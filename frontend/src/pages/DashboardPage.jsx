import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Calendar, Copy, MapPin, UserPlus, X, Shield, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Navbar from '../components/Navbar';
import AlertModal from '../components/AlertModal';

function DashboardPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [travels, setTravels] = useState([]);
    const [stats, setStats] = useState({ monthlyTravels: [], scheduleTypes: [] }); // 👈 통계 상태 추가
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');

    // Chart Colors (Aurora Theme)
    const COLORS = ['#a78bfa', '#c084fc', '#818cf8', '#60a5fa', '#34d399', '#f472b6'];

    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [previewTravel, setPreviewTravel] = useState(null);
    
    // Alert State
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success',
        onClose: () => {}
    });

    const showAlert = (title, message, type = 'success') => {
        setAlertState({
            isOpen: true,
            title,
            message,
            type,
            onClose: () => setAlertState(prev => ({ ...prev, isOpen: false }))
        });
    };

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const email = localStorage.getItem('userEmail');
        const role = localStorage.getItem('userRole');

        if (!isLoggedIn || !email) {
            navigate('/login');
            return;
        }

        setUserEmail(email);
        setUserRole(role || 'USER');
        fetchTravels(email);
        fetchStats(email); // 👈 통계 조회 추가
    }, [navigate]);

    const fetchTravels = (emailArg) => {
        const targetEmail = emailArg || userEmail;
        if (!targetEmail) return;
        
        axios.get(`http://localhost:8080/api/travels/my?email=${targetEmail}`)
            .then(res => {
                setTravels(res.data);
            })
            .catch(err => console.error('목록 로딩 에러:', err));
    };

    const fetchStats = (emailArg) => {
        const targetEmail = emailArg || userEmail;
        if (!targetEmail) return;

        axios.get(`http://localhost:8080/api/travels/stats?email=${targetEmail}`)
            .then(res => {
                setStats(res.data);
            })
            .catch(err => console.error('통계 로딩 에러:', err));
    };

    const createTravel = () => {
        if (!title) return showAlert('알림', '제목을 입력하세요!', 'error');
        if (!startDate) return showAlert('알림', '출발 날짜를 선택하세요!', 'error');
        if (!endDate) return showAlert('알림', '도착 날짜를 선택하세요!', 'error');
        if (new Date(startDate) > new Date(endDate)) {
            return showAlert('알림', '도착 날짜는 출발 날짜보다 이후여야 합니다!', 'error');
        }

        const nickname = localStorage.getItem('userNickname') || userEmail.split('@')[0];

        axios.post('http://localhost:8080/api/travels', {
            title: title,
            startDate: startDate,
            endDate: endDate,
            creatorEmail: userEmail,
            creatorName: nickname
        })
            .then(res => {
                showAlert('성공', res.data);
                setTitle('');
                setStartDate('');
                setEndDate('');
                setShowCreateModal(false);
                fetchTravels(userEmail);
                fetchStats(userEmail); // 통계 갱신
            })
            .catch(err => console.error('생성 에러:', err));
    };

    const searchTravelByCode = () => {
        if (!inviteCode.trim()) {
            return showAlert('알림', '초대코드를 입력하세요!', 'error');
        }

        axios.get(`http://localhost:8080/api/travels/code/${inviteCode}`)
            .then(res => {
                setPreviewTravel(res.data);
            })
            .catch(err => {
                console.error('조회 실패:', err);
                showAlert('실패', '유효하지 않은 초대코드입니다.', 'error');
            });
    };

    const joinTravel = () => {
        if (!previewTravel) return;

        const nickname = localStorage.getItem('userNickname') || userEmail.split('@')[0];

        axios.post(`http://localhost:8080/api/travels/${previewTravel.travelId}/join`, null, {
            params: {
                email: userEmail,
                nickname: nickname
            }
        })
            .then(res => {
                showAlert('성공', res.data);
                setShowJoinModal(false);
                setInviteCode('');
                setPreviewTravel(null);
                fetchTravels(userEmail);
                fetchStats(userEmail); // 통계 갱신
            })
            .catch(err => {
                console.error('참가 실패:', err);
                showAlert('실패', err.response?.data || '여행 참가에 실패했습니다.', 'error');
            });
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        showAlert('복사 완료', '초대 코드가 복사되었습니다!');
    };

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/80 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="text-white font-bold text-sm mb-1">{label}</p>
                    <p className="text-primary text-sm">
                        {payload[0].value} {payload[0].name === 'value' ? '회' : '건'}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />
            <AlertModal 
                isOpen={alertState.isOpen}
                onClose={alertState.onClose}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
                
                {/* Action Buttons - Compact */}
                <div className="mb-8 flex justify-between items-center">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            새로운 여행
                        </button>
                        <button
                            onClick={() => setShowJoinModal(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-primary/30 transition-all"
                        >
                            <UserPlus className="w-5 h-5" />
                            참가하기
                        </button>
                    </div>

                    {/* 관리자 전용 버튼 */}
                    {userRole === 'ADMIN' && (
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                        >
                            <Shield className="w-5 h-5" />
                            관리자 대시보드
                        </button>
                    )}
                </div>

                {/* Travels List Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white">내 여행 목록</h3>
                        <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm">
                            총 {travels.length}개
                        </span>
                    </div>

                    {travels.length === 0 ? (
                        <div className="text-center py-20 px-6 rounded-3xl bg-white/5 border border-white/10 border-dashed">
                            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 mb-6">
                                <MapPin className="w-12 h-12 text-primary" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-3">
                                아직 여행이 없어요
                            </h4>
                            <p className="text-gray-400 mb-8">
                                첫 번째 여행을 만들고 친구들과 함께 추억을 만들어보세요!
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {travels.map((travel) => (
                                <div
                                    key={travel.travelId}
                                    onClick={() => navigate(`/travel/${travel.travelId}/home`)}
                                    className="group relative p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-primary/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
                                >
                                    {/* Travel Title */}
                                    <div className="mb-4">
                                        <h4 className="text-xl font-bold text-white mb-2 line-clamp-1">
                                            {travel.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            <span>{travel.startDate} ~ {travel.endDate}</span>
                                        </div>
                                    </div>

                                    {/* Invite Code Button (Hidden Code) */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(travel.inviteCode);
                                        }}
                                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        <Copy className="w-4 h-4 group-hover/btn:text-primary transition-colors" />
                                        <span className="text-sm font-medium">초대 코드 복사</span>
                                    </button>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 to-purple-600/0 group-hover:from-primary/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 📊 Travel Statistics Section */}
                <div className="border-t border-white/5 pt-12">
                    <div className="flex items-center gap-3 mb-8 px-1">
                        <div className="p-2 rounded-xl bg-primary/10">
                            <BarChart2 className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">여행 인사이트</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Monthly Travels Chart */}
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-primary" />
                                월별 여행 추이
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.monthlyTravels}>
                                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                        <Bar dataKey="value" fill="#a78bfa" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Schedule Types Chart */}
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <PieChartIcon className="w-5 h-5 text-purple-400" />
                                나의 여행 스타일 (일정 유형)
                            </h3>
                            <div className="h-64 flex items-center justify-center">
                                {stats.scheduleTypes.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.scheduleTypes}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {stats.scheduleTypes.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-gray-500 text-sm">데이터가 충분하지 않습니다</p>
                                )}
                            </div>
                            {/* Legend */}
                            <div className="flex flex-wrap gap-3 justify-center mt-2">
                                {stats.scheduleTypes.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-xs text-gray-400">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Travel Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-dark border border-white/10 rounded-3xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600">
                                    <Plus className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">새로운 여행 만들기</h3>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">여행지</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="어디로 여행 가시나요?"
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">출발 날짜</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">종료 날짜</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={createTravel}
                                className="w-full mt-4 py-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                            >
                                여행 생성하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Join Travel Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => {
                    setShowJoinModal(false);
                    setInviteCode('');
                    setPreviewTravel(null);
                }}>
                    <div className="bg-dark border border-white/10 rounded-3xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600">
                                    <UserPlus className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">여행 참가하기</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setShowJoinModal(false);
                                    setInviteCode('');
                                    setPreviewTravel(null);
                                }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {!previewTravel ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">초대 코드</label>
                                    <input
                                        type="text"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && searchTravelByCode()}
                                        placeholder="초대 코드를 입력하세요"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                                    />
                                </div>
                                <button
                                    onClick={searchTravelByCode}
                                    className="w-full py-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                                >
                                    조회하기
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Travel Preview */}
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                                    <h4 className="text-xl font-bold text-white mb-4">{previewTravel.title}</h4>
                                    <div className="space-y-2.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">출발일</span>
                                            <span className="text-sm text-white font-semibold">{previewTravel.startDate}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">종료일</span>
                                            <span className="text-sm text-white font-semibold">{previewTravel.endDate}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">여행 기간</span>
                                            <span className="text-sm text-white font-semibold">
                                                {Math.ceil((new Date(previewTravel.endDate) - new Date(previewTravel.startDate)) / (1000 * 60 * 60 * 24)) + 1}일
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-400 text-center">
                                    이 여행에 참가하시겠습니까?
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setPreviewTravel(null);
                                            setInviteCode('');
                                        }}
                                        className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={joinTravel}
                                        className="flex-1 py-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                                    >
                                        참가하기
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;
