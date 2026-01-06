import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Save, Camera, Sparkles, MapPin, ArrowRight, UserX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AlertModal from '../components/AlertModal';

function MyPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [nickname, setNickname] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState({ travelCount: 0 });
    const [travels, setTravels] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        if (userEmail) {
            fetchUserInfo();
            fetchUserStats();
        }
    }, [userEmail]);

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${userEmail}`);
            setUser(response.data);
            setNickname(response.data.nickname);
        } catch (error) {
            console.error('정보 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async () => {
        try {
            // 내 여행 목록 가져오기
            const response = await axios.get(`http://localhost:8080/api/travels/my?email=${userEmail}`);
            setStats({ travelCount: response.data.length });
            setTravels(response.data);
        } catch (error) {
            console.error('통계 로딩 실패:', error);
        }
    };

    const handleUpdateNickname = async () => {
        try {
            await axios.patch(`http://localhost:8080/api/users/${userEmail}`, {
                nickname: nickname
            });

            // 로컬 스토리지 업데이트 및 알림
            localStorage.setItem('userNickname', nickname);
            showAlert('변경 완료', '닉네임이 변경되었습니다!', 'success', () => {
                setIsEditing(false);
                fetchUserInfo();
                window.location.reload();
            });
        } catch (error) {
            console.error('업데이트 실패:', error);
            showAlert('변경 실패', '닉네임 변경에 실패했습니다.', 'error');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${userEmail}`);

            // 로컬 스토리지 초기화
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userNickname');

            showAlert('탈퇴 완료', '회원탈퇴가 완료되었습니다.', 'success', () => {
                navigate('/');
            });
        } catch (error) {
            console.error('회원탈퇴 실패:', error);
            showAlert('탈퇴 실패', '회원탈퇴에 실패했습니다.', 'error');
        }
    };

    if (loading) return <div className="min-h-screen bg-dark text-white flex items-center justify-center">로딩 중...</div>;

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            <AlertModal 
                isOpen={alertState.isOpen}
                onClose={alertState.onClose}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">마이페이지</h1>
                    <p className="text-gray-400">내 정보를 관리하고 여행 기록을 확인하세요</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {/* Left Column: Profile Card */}
                    <div className="md:col-span-1">
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-center relative overflow-hidden group h-full">
                            {/* Background decoration */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-purple-600/20 blur-2xl -z-10"></div>
                            
                            {/* Avatar */}
                            <div className="relative inline-block mb-4">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl shadow-primary/30">
                                    {nickname.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute bottom-0 right-0 p-2 rounded-full bg-dark border border-white/10 text-gray-400 hover:text-white cursor-pointer transition-colors">
                                    <Camera className="w-5 h-5" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">{user?.nickname}</h2>
                            <p className="text-sm text-gray-400 mb-6">{user?.email}</p>

                            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">{stats.travelCount}</p>
                                    <p className="text-xs text-gray-500">참여 중인 여행</p>
                                </div>
                                <div className="text-center border-l border-white/10">
                                    <p className="text-2xl font-bold text-purple-400">0</p>
                                    <p className="text-xs text-gray-500">완료한 여행</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="md:col-span-2">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 h-full">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                내 정보 수정
                            </h3>

                            <div className="space-y-6">
                                {/* Email Field (Read Only) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                                        이메일 계정
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-black/20 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed">
                                        <Mail className="w-5 h-5" />
                                        <span>{user?.email}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2 ml-1">* 이메일은 변경할 수 없습니다.</p>
                                </div>

                                {/* Nickname Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        닉네임
                                    </label>
                                    <div className={`flex items-center gap-3 px-4 py-3 bg-white/5 border rounded-xl transition-all ${isEditing ? 'border-primary/50 bg-white/10' : 'border-white/10'}`}>
                                        <User className={`w-5 h-5 ${isEditing ? 'text-primary' : 'text-gray-500'}`} />
                                        <input 
                                            type="text" 
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            disabled={!isEditing}
                                            className="bg-transparent border-none outline-none text-white flex-1 disabled:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end pt-4">
                                    {!isEditing ? (
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-semibold"
                                        >
                                            수정하기
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setNickname(user.nickname); // Reset
                                                }}
                                                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all font-semibold"
                                            >
                                                취소
                                            </button>
                                            <button 
                                                onClick={handleUpdateNickname}
                                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                저장하기
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Travels Section */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-primary" />
                        참여 중인 여행
                    </h3>
                    
                    {travels.length === 0 ? (
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 border-dashed text-center">
                            <p className="text-gray-400 mb-4">아직 참여 중인 여행이 없습니다.</p>
                            <Link to="/dashboard" className="text-primary hover:text-purple-400 font-semibold">
                                여행 만들기 →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {travels.map((travel) => (
                                <div 
                                    key={travel.travelId}
                                    onClick={() => navigate(`/travel/${travel.travelId}/home`)}
                                    className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between"
                                >
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                            {travel.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>{travel.startDate} ~ {travel.endDate}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Danger Zone - 회원탈퇴 */}
                <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
                                <UserX className="w-5 h-5" />
                                위험 영역
                            </h3>
                            <p className="text-gray-400 text-sm">
                                회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all font-semibold"
                        >
                            회원탈퇴
                        </button>
                    </div>
                </div>
            </div>

            {/* 회원탈퇴 확인 모달 */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-dark border border-red-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                                <UserX className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">정말 탈퇴하시겠습니까?</h3>
                            <p className="text-gray-400">
                                모든 여행 데이터와 정보가 영구적으로 삭제됩니다.<br />
                                이 작업은 되돌릴 수 없습니다.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    handleDeleteAccount();
                                }}
                                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
                            >
                                탈퇴하기
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 font-semibold transition-all"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyPage;
