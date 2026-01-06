import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Routes, Route, Navigate } from 'react-router-dom';
import { ArrowLeft, Home, Package, Calendar, Users, Share2, Sparkles } from 'lucide-react';
import axios from 'axios';
import TravelHome from './TravelHome';
import PackingList from './PackingList';
import Schedule from './Schedule';

function TravelWorkspace() {
    const { travelId } = useParams();
    const navigate = useNavigate();
    const [travel, setTravel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('home');

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
            alert('여행 정보를 불러올 수 없습니다.');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'home', label: '홈', icon: Home, path: `/travel/${travelId}/home` },
        { id: 'packing', label: '패킹 리스트', icon: Package, path: `/travel/${travelId}/packing` },
        { id: 'schedule', label: '일정', icon: Calendar, path: `/travel/${travelId}/schedule` },
    ];

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
        <div className="min-h-screen bg-dark">
            {/* Header */}
            <header className="border-b border-white/10 bg-dark/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>대시보드</span>
                        </Link>

                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
                            <Share2 className="w-4 h-4" />
                            <span>친구 초대</span>
                        </button>
                    </div>

                    {/* Travel Info */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-purple-600">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">{travel.title}</h1>
                            <p className="text-gray-400 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {travel.startDate} ~ {travel.endDate}
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = window.location.pathname === tab.path;
                            return (
                                <Link
                                    key={tab.id}
                                    to={tab.path}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                                        isActive
                                            ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Content */}
            <Routes>
                <Route index element={<Navigate to={`/travel/${travelId}/home`} replace />} />
                <Route path="home" element={<TravelHome travel={travel} onUpdate={fetchTravelInfo} />} />
                <Route path="packing" element={<PackingList travelId={travelId} />} />
                <Route path="schedule" element={<Schedule travel={travel} />} />
            </Routes>
        </div>
    );
}

export default TravelWorkspace;
