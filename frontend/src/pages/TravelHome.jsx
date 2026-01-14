import { useState, useEffect, useRef } from 'react';
import { Copy, Users, Clock, MapPin, Check, Plus, UserPlus, Trash2, Send, Image as ImageIcon, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import AlertModal from '../components/AlertModal';
import PresenceAvatars from './PresenceAvatars';

function TravelHome({ travel }) {
    const { travelId } = useParams();
    const [dDay, setDDay] = useState(0);
    const [copied, setCopied] = useState(false);
    const [members, setMembers] = useState([]);
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMember, setNewMember] = useState({ email: '' });

    // 현재 사용자 닉네임 가져오기 (없으면 이메일 아이디 부분 사용)
    const currentUser = localStorage.getItem('userNickname') || localStorage.getItem('userEmail')?.split('@')[0] || 'Guest';

    // Chat State
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // 👈 선택된 파일 상태
    const [stompClient, setStompClient] = useState(null);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    
    // Alert State
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success',
        onClose: () => {}
    });

    const showAlert = (title, message, type = 'success', onClose = () => {}) => {
        setAlertState({
            isOpen: true,
            title,
            message,
            type,
            onClose: () => {
                setAlertState(prev => ({ ...prev, isOpen: false }));
                onClose();
            }
        });
    };

    // D-Day 계산
    useEffect(() => {
        if (!travel || !travel.startDate) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시간 부분 제거

        const startDate = new Date(travel.startDate);
        startDate.setHours(0, 0, 0, 0); // 시간 부분 제거

        const diffTime = startDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDDay(diffDays);
    }, [travel]);

    // 초기 데이터 로딩 (멤버, 메시지)
    useEffect(() => {
        if (!travel) return;

        fetchMembers();
        fetchMessages();
    }, [travel]);

    useEffect(() => {
        // WebSocket connection for Chat & Member updates
        const socket = new SockJS('http://localhost:8080/ws-stomp');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            // client.subscribe... logic
            client.subscribe(`/topic/travel/${travel.travelId}`, (message) => {
                if (message.body === 'MEMBER_JOINED') {
                    fetchMembers();
                }
            });

            client.subscribe(`/topic/chat/${travel.travelId}`, (message) => {
                const chatMessage = JSON.parse(message.body);
                setMessages(prev => {
                    const isDuplicate = prev.some(msg =>
                        msg.id === chatMessage.id ||
                        (msg.timestamp === chatMessage.timestamp && msg.sender === chatMessage.sender && msg.message === chatMessage.message)
                    );
                    if (isDuplicate) return prev;
                    return [...prev, chatMessage];
                });
            });
        });

        setStompClient(client);

        return () => {
            if (client && client.connected) {
                client.disconnect();
            }
        };
    }, [travel]);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/members/${travel.travelId}`);
            setMembers(response.data);
        } catch (error) {
            console.error('Failed to fetch members:', error.message || 'Unknown error');
        }
    };

    const sendInvitation = async () => {
        if (!newMember.email.trim()) {
            showAlert('알림', '이메일을 입력하세요!', 'error');
            return;
        }

        const userEmail = localStorage.getItem('userEmail');
        const userNickname = localStorage.getItem('userNickname');
        const senderName = userNickname || (userEmail ? userEmail.split('@')[0] : 'Unknown');

        try {
            await axios.post(`http://localhost:8080/api/members/${travel.travelId}/invite`, {
                email: newMember.email,
                senderName: senderName
            });
            showAlert('성공', '초대장을 보냈습니다!\n상대방이 수락하면 목록에 표시됩니다.');
            setNewMember({ email: '' });
            setShowAddMember(false);
        } catch (error) {
            console.error('Invitation failed:', error.message || 'Unknown error');
            showAlert('실패', '초대 전송에 실패했습니다.', 'error');
        }
    };

    const deleteMember = async (memberId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/members/${memberId}`);
            fetchMembers();
        } catch (error) {
            console.error('Failed to delete member:', error.message || 'Unknown error');
        }
    };

    const copyInviteCode = () => {
        navigator.clipboard.writeText(travel.inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chat/${travel.travelId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error.message || 'Unknown error');
        }
    };

    // 1. File Selection Handler
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
        e.target.value = ''; 
    };

    // 2. Send Message Handler (Text + Image)
    const sendMessage = async () => {
        if (!newMessage.trim() && !selectedFile) return;

        const userEmail = localStorage.getItem('userEmail');
        const userNickname = localStorage.getItem('userNickname');
        const senderName = userNickname || (userEmail ? userEmail.split('@')[0] : 'Unknown');

        try {
            // A. Upload Image first if exists
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const res = await axios.post(`http://localhost:8080/api/chat/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const imageUrl = res.data;
                const imageMessage = {
                    travelId: travel.travelId,
                    sender: senderName,
                    message: imageUrl,
                    type: 'IMAGE'
                };
                await axios.post(`http://localhost:8080/api/chat/${travel.travelId}`, imageMessage);
            }

            // B. Send Text
            if (newMessage.trim()) {
                const textMessage = {
                    travelId: travel.travelId,
                    sender: senderName,
                    message: newMessage.trim(),
                    type: 'TEXT'
                };
                await axios.post(`http://localhost:8080/api/chat/${travel.travelId}`, textMessage);
            }

            setNewMessage('');
            setSelectedFile(null);

        } catch (error) {
            console.error('Message send failed:', error.message || 'Unknown error');
            showAlert('오류', '메시지 전송 중 문제가 발생했습니다.', 'error');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={alertState.onClose}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            <div className="grid lg:grid-cols-3 gap-6 items-start">
                {/* Left Column - Chat (2/3 width) */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="h-[calc(100vh-280px)] rounded-3xl bg-white/5 border border-white/10 flex flex-col backdrop-blur-sm shadow-xl">
                        {/* Chat Header */}
                        <div className="p-5 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Send className="w-5 h-5 text-primary" />
                                실시간 채팅
                            </h3>
                            <PresenceAvatars travelId={travel.travelId} currentUser={currentUser} />
                        </div>

                        {/* Messages */}
                        <div 
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
                        >
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                    <Send className="w-12 h-12 mb-3" />
                                    <p className="text-sm">아직 메시지가 없습니다</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const currentUser = localStorage.getItem('userNickname') || localStorage.getItem('userEmail')?.split('@')[0];
                                    const isMyMessage = msg.sender === currentUser;

                                    return (
                                        <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] ${isMyMessage ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                                                {!isMyMessage && (
                                                    <span className="text-xs font-bold text-gray-400 px-2">{msg.sender}</span>
                                                )}
                                                <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${ 
                                                    isMyMessage
                                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white'
                                                        : 'bg-white/10 text-white'
                                                }`}> 
                                                    {msg.type === 'IMAGE' ? (
                                                        <img 
                                                            src={msg.message} 
                                                            alt="Chat Attachment" 
                                                            className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                            onClick={() => window.open(msg.message, '_blank')}
                                                        />
                                                    ) : (
                                                        <p className="text-sm break-words leading-relaxed">{msg.message}</p>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-gray-600 px-2">
                                                    {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Image Preview Area */}
                        {selectedFile && (
                            <div className="px-5 pt-3 bg-white/[0.02]">
                                <div className="relative inline-block">
                                    <img 
                                        src={URL.createObjectURL(selectedFile)} 
                                        alt="Preview" 
                                        className="h-20 rounded-xl border border-white/10 shadow-lg object-cover"
                                    />
                                    <button 
                                        onClick={() => setSelectedFile(null)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-5 border-t border-white/10 bg-white/[0.02] rounded-b-3xl">
                            <div className="flex gap-2">
                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    className="hidden"
                                />
                                
                                {/* Image Button */}
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className={`px-4 rounded-2xl border transition-all ${ 
                                        selectedFile 
                                        ? 'bg-primary/20 border-primary text-primary' 
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                    title="사진 첨부"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                </button>

                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder={selectedFile ? "사진과 함께 보낼 메시지 (선택)" : "메시지를 입력하세요..."}
                                    className="flex-1 px-5 py-3 bg-dark/50 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 rounded-2xl text-white hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!newMessage.trim() && !selectedFile}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Travel Info (1/3 width) */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {/* Travel Title & Dates */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-2">{travel.title}</h2>
                        <p className="text-sm text-gray-400">{travel.startDate} ~ {travel.endDate}</p>
                    </div>

                    {/* D-Day Counter - Simple & Modern */}
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">D-Day</h3>
                                <p className="text-white font-medium">여행 시작까지</p>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            {dDay > 0 ? (
                                <span className="text-4xl font-black text-white tracking-tight">
                                    D-{dDay}
                                </span>
                            ) : dDay === 0 ? (
                                <span className="text-3xl font-black text-primary animate-pulse">
                                    D-Day 🎉
                                </span>
                            ) : (
                                <span className="text-2xl font-bold text-gray-500">
                                    종료
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Members - 더 컴팩트하게 */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                참여 멤버
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold">
                                {members.length}명
                            </span>
                        </div>

                        {/* Member List */}
                        <div className="space-y-2 mb-3 max-h-64 overflow-y-auto scrollbar-hide">
                            {members.length === 0 ? (
                                <div className="text-center py-6 text-gray-500">
                                    <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs">아직 멤버가 없습니다</p>
                                </div>
                            ) : (
                                members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="group flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                                    >
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div
                                                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-dark ${ 
                                                    member.online ? 'bg-green-500' : 'bg-gray-500'
                                                }`}
                                            ></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-semibold truncate">{member.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteMember(member.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Member Section */}
                        {!showAddMember ? (
                            <button
                                onClick={() => setShowAddMember(true)}
                                className="w-full py-2.5 rounded-lg bg-white/5 border border-dashed border-white/20 text-gray-400 hover:bg-white/10 hover:text-white hover:border-primary/30 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="font-semibold">멤버 초대하기</span>
                            </button>
                        ) : (
                            <div className="space-y-2 p-3 rounded-lg bg-white/5 border border-primary/30">
                                <p className="text-xs text-gray-400">초대할 친구의 이메일</p>
                                <input
                                    type="email"
                                    placeholder="friend@example.com"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                    className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50"
                                    onKeyPress={(e) => e.key === 'Enter' && sendInvitation()}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={sendInvitation}
                                        className="flex-1 py-2 text-sm rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
                                    >
                                        초대
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddMember(false);
                                            setNewMember({ email: '' });
                                        }}
                                        className="px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TravelHome;