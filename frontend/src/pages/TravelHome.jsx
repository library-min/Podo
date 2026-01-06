import { useState, useEffect, useRef } from 'react';
import { Copy, Users, Clock, MapPin, Check, Plus, UserPlus, Trash2, Send, Home, Package, Calendar, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import AlertModal from '../components/AlertModal';

function TravelHome({ travel }) {
    const { travelId } = useParams();
    const [dDay, setDDay] = useState(0);
    const [copied, setCopied] = useState(false);
    const [members, setMembers] = useState([]);
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMember, setNewMember] = useState({ email: '' });

    // Chat State
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const chatEndRef = useRef(null);

    // Tab navigation
    const tabs = [
        { id: 'home', label: '홈', icon: Home, path: `/travel/${travelId}/home` },
        { id: 'packing', label: '패킹 리스트', icon: Package, path: `/travel/${travelId}/packing` },
        { id: 'schedule', label: '일정', icon: Calendar, path: `/travel/${travelId}/schedule` },
    ];
    
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

    useEffect(() => {
        // D-Day 계산
        const startDate = new Date(travel.startDate);
        const today = new Date();
        const diffTime = startDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDDay(diffDays);

        // 멤버 목록 불러오기
        fetchMembers();

        // 채팅 메시지 불러오기
        fetchMessages();

        // WebSocket 연결
        const socket = new SockJS('http://localhost:8080/ws-stomp');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            console.log('✅ TravelHome WebSocket 연결 성공!');

            // 멤버 변경 구독
            client.subscribe(`/topic/travel/${travel.travelId}`, (message) => {
                if (message.body === 'MEMBER_JOINED') {
                    fetchMembers();
                }
            });

            // 채팅 메시지 구독
            client.subscribe(`/topic/chat/${travel.travelId}`, (message) => {
                const chatMessage = JSON.parse(message.body);
                setMessages(prev => {
                    // 중복 메시지 방지 (ID 또는 timestamp + sender로 체크)
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

    // 채팅 메시지가 추가될 때마다 스크롤을 맨 아래로
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/members/${travel.travelId}`);
            setMembers(response.data);
        } catch (error) {
            console.error('멤버 불러오기 실패:', error);
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
            console.error('초대 실패:', error);
            showAlert('실패', '초대 전송에 실패했습니다.', 'error');
        }
    };

    const deleteMember = async (memberId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/members/${memberId}`);
            fetchMembers();
        } catch (error) {
            console.error('멤버 삭제 실패:', error);
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
            console.error('메시지 불러오기 실패:', error);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !stompClient || !stompClient.connected) return;

        const userEmail = localStorage.getItem('userEmail');
        const userNickname = localStorage.getItem('userNickname');
        const senderName = userNickname || (userEmail ? userEmail.split('@')[0] : 'Unknown');

        const chatMessage = {
            travelId: travel.travelId,
            sender: senderName,
            message: newMessage.trim()
        };

        // 서버로 메시지 전송 (WebSocket 브로드캐스트만 사용)
        axios.post(`http://localhost:8080/api/chat/${travel.travelId}`, chatMessage)
            .then(() => {
                setNewMessage('');
            })
            .catch(err => console.error('메시지 전송 실패:', err));
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

            {/* Top Bar */}
            <div className="mb-6 flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                {/* Back Button */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-primary/30 transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">대시보드</span>
                </Link>

                {/* Navigation Tabs */}
                <div className="flex gap-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = window.location.pathname === tab.path;
                        return (
                            <Link
                                key={tab.id}
                                to={tab.path}
                                className={`flex items-center justify-center px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-primary/30'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 items-start">
                {/* Left Column - Chat */}
                <div className="flex flex-col gap-4">
                    <div className="h-[calc(100vh-240px)] rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10">
                            <h3 className="text-lg font-bold text-white">채팅</h3>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                            {messages.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p className="text-sm">아직 메시지가 없습니다</p>
                                    <p className="text-xs mt-1">첫 메시지를 보내보세요!</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const currentUser = localStorage.getItem('userNickname') || localStorage.getItem('userEmail')?.split('@')[0];
                                    const isMyMessage = msg.sender === currentUser;

                                    return (
                                        <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] ${isMyMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                                {!isMyMessage && (
                                                    <span className="text-xs text-gray-400 px-2">{msg.sender}</span>
                                                )}
                                                <div className={`px-4 py-2 rounded-2xl ${
                                                    isMyMessage
                                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white'
                                                        : 'bg-white/10 text-white'
                                                }`}>
                                                    <p className="text-sm break-words">{msg.message}</p>
                                                </div>
                                                <span className="text-xs text-gray-500 px-2">
                                                    {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="메시지를 입력하세요..."
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="px-4 py-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white hover:shadow-lg transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Travel Info */}
                <div className="flex flex-col gap-4">
                    {/* Travel Title & Dates */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-2">{travel.title}</h2>
                        <p className="text-sm text-gray-400">{travel.startDate} ~ {travel.endDate}</p>
                    </div>

                    {/* D-Day Counter */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 via-purple-600/20 to-pink-600/10 border border-primary/30">
                        <div className="text-center">
                            {dDay > 0 ? (
                                <span className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Day -{dDay}
                                </span>
                            ) : dDay === 0 ? (
                                <span className="text-2xl font-bold text-primary animate-pulse">
                                    오늘이에요! 🎉
                                </span>
                            ) : (
                                <span className="text-2xl font-bold text-gray-400">
                                    종료됨
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
