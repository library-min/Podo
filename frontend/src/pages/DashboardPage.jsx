import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Calendar, Copy, Sparkles, MapPin, Home } from 'lucide-react';
import axios from 'axios';

function DashboardPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [travels, setTravels] = useState([]);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const email = localStorage.getItem('userEmail');

        if (!isLoggedIn || !email) {
            navigate('/login');
            return;
        }

        setUserEmail(email);
        fetchTravels();
    }, [navigate]);

    const fetchTravels = () => {
        axios.get('http://localhost:8080/api/travels')
            .then(res => {
                setTravels(res.data);
            })
            .catch(err => console.error('목록 로딩 에러:', err));
    };

    const createTravel = () => {
        if (!title) return alert('제목을 입력하세요!');

        axios.post('http://localhost:8080/api/travels', {
            title: title,
            startDate: '2026-05-01',
            endDate: '2026-05-05'
        })
            .then(res => {
                alert(res.data);
                setTitle('');
                fetchTravels();
            })
            .catch(err => console.error('생성 에러:', err));
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert('초대 코드가 복사되었습니다!');
    };

    return (
        <div className="min-h-screen bg-dark">
            {/* Navigation Bar */}
            <nav className="border-b border-white/10 bg-dark/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-purple-600 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                    Travel Together
                                </h1>
                                <p className="text-xs text-gray-500">대시보드</p>
                            </div>
                        </Link>

                        {/* User Info & Buttons */}
                        <div className="flex items-center gap-3">
                            <Link
                                to="/"
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/30 transition-all duration-300"
                            >
                                <Home className="w-4 h-4" />
                                <span>홈</span>
                            </Link>
                            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {userEmail.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-300">{userEmail}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">로그아웃</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        안녕하세요! 👋
                    </h2>
                    <p className="text-xl text-gray-400">
                        새로운 여행을 만들거나 기존 여행을 관리해보세요
                    </p>
                </div>

                {/* Create Travel Section */}
                <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-purple-600/10 to-pink-600/5 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-600">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">새로운 여행 만들기</h3>
                            <p className="text-gray-400 text-sm">친구들과 함께할 여행을 시작하세요</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="어디로 여행 가시나요?"
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                onKeyPress={(e) => e.key === 'Enter' && createTravel()}
                            />
                        </div>
                        <button
                            onClick={createTravel}
                            className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            여행 생성
                        </button>
                    </div>
                </div>

                {/* Travels List Section */}
                <div>
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

                                    {/* Invite Code */}
                                    <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">초대 코드</p>
                                                <p className="text-lg font-bold text-primary tracking-wider">
                                                    {travel.inviteCode}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(travel.inviteCode);
                                                }}
                                                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all duration-300 group/btn"
                                            >
                                                <Copy className="w-4 h-4 text-gray-400 group-hover/btn:text-primary transition-colors" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 to-purple-600/0 group-hover:from-primary/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
