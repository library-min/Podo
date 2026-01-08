import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Package, Calendar, Users, Share2, Sparkles, X, BarChart2, Settings } from 'lucide-react';
import axios from 'axios';
import TravelHome from './TravelHome';
import PackingList from './PackingList';
import Schedule from './Schedule';
import VoteManager from './VoteManager';
import TravelSettings from './TravelSettings';
import AlertModal from '../components/AlertModal';
import PresenceAvatars from './PresenceAvatars';
import StarryBackground from '../components/StarryBackground';

function TravelWorkspace() {
    const { travelId } = useParams();
    const navigate = useNavigate();
    const [travel, setTravel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    
    // 현재 사용자 닉네임 가져오기 (없으면 이메일 아이디 부분 사용)
    const currentUser = localStorage.getItem('userNickname') || localStorage.getItem('userEmail')?.split('@')[0] || 'Guest';

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
        // 로그인 체크
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        // 여행 정보 불러오기
        fetchTravelInfo();
    }, [travelId, navigate]);

    const fetchTravelInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/travels/${travelId}`);
            setTravel(response.data);
        } catch (error) {
            console.error('여행 정보 로딩 에러:', error);
            showAlert('오류', '여행 정보를 불러올 수 없습니다.', 'error', () => navigate('/dashboard'));
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail) return showAlert('알림', '이메일을 입력하세요!', 'error');
        
        const userEmail = localStorage.getItem('userEmail');
        const userNickname = localStorage.getItem('userNickname');
        const senderName = userNickname || (userEmail ? userEmail.split('@')[0] : 'Unknown');
        
        try {
            await axios.post(`http://localhost:8080/api/members/${travelId}/invite`, {
                email: inviteEmail,
                senderName: senderName 
            });
            showAlert('성공', '초대가 전송되었습니다!');
            setInviteEmail('');
            setInviteModalOpen(false);
        } catch (error) {
            console.error('초대 실패:', error);
            showAlert('실패', '초대에 실패했습니다.', 'error');
        }
    };

    const tabs = [
        { id: 'home', label: '홈', icon: Home, path: `/travel/${travelId}/home` },
        { id: 'packing', label: '패킹 리스트', icon: Package, path: `/travel/${travelId}/packing` },
        { id: 'schedule', label: '일정', icon: Calendar, path: `/travel/${travelId}/schedule` },
        { id: 'vote', label: '투표', icon: BarChart2, path: `/travel/${travelId}/vote` },
        { id: 'settings', label: '설정', icon: Settings, path: `/travel/${travelId}/settings` },
    ];

    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">여행 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!travel) {
        return null;
    }

    return (
        <div className="min-h-screen bg-transparent relative">
            <AlertModal 
                isOpen={alertState.isOpen}
                onClose={alertState.onClose}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

                                    {/* Top Bar - Sticky Header */}

                                    <div className="sticky top-0 z-50 w-full overflow-hidden mb-4 bg-black">
                                        <StarryBackground />

                                        <div className="relative z-10 max-w-6xl mx-auto px-6 py-4">

                                            <div className="flex items-center justify-between p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">

                                                {/* Back Button */}

                                                <Link

                                                    to="/dashboard"

                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-primary/30 transition-all group"

                                                >

                                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />

                                                    <span className="hidden sm:inline font-semibold text-sm">대시보드</span>

                                                </Link>

                        

                                                {/* Navigation Tabs */}

                                                <div className="flex gap-1 sm:gap-2">

                                                    {tabs.map((tab) => {

                                                        const Icon = tab.icon;

                                                        const isActive = location.pathname.includes(tab.path);

                                                        return (

                                                            <Link

                                                                key={tab.id}

                                                                to={tab.path}

                                                                className={`flex items-center justify-center p-2.5 sm:px-4 sm:py-2 rounded-xl font-semibold transition-all duration-300 ${

                                                                    isActive

                                                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'

                                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-primary/30'

                                                                }`}

                                                                title={tab.label}

                                                            >

                                                                <Icon className="w-5 h-5" />

                                                                <span className="hidden md:inline ml-2 text-sm">{tab.label}</span>

                                                            </Link>

                                                        );

                                                    })}

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                        

                                    {/* Content Container (Added max-w and center alignment) */}

                                    <div className="max-w-6xl mx-auto">

                                        <Routes>
                <Route index element={<Navigate to={`/travel/${travelId}/home`} replace />} />
                <Route path="home" element={<TravelHome travel={travel} onUpdate={fetchTravelInfo} />} />
                <Route path="packing" element={<PackingList travelId={travelId} />} />
                <Route path="schedule" element={<Schedule travel={travel} />} />
                <Route path="vote" element={<VoteManager travelId={travelId} />} />
                <Route path="settings" element={<TravelSettings travel={travel} onUpdate={fetchTravelInfo} />} />
            </Routes>
            </div>

            {/* Invite Modal */}
            {inviteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-dark border border-white/10 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">친구 초대하기</h3>
                            <button 
                                onClick={() => setInviteModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">이메일 주소</label>
                                <input 
                                    type="email" 
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="friend@example.com"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                    onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
                                />
                            </div>
                            
                            <button 
                                onClick={handleInvite}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                            >
                                초대 보내기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TravelWorkspace;
