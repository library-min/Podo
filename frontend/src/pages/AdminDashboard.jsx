import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Plane, PlusCircle, Shield, ArrowLeft, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import StarryBackground from '../components/StarryBackground';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTravels: 0,
    todayTravels: 0,
    totalAdmins: 0
  });

  // 최근 7일간 가입자 수 (임시 데이터 - 추후 실제 데이터로 교체 가능)
  const chartData = [
    { date: '01/03', users: 12, travels: 5 },
    { date: '01/04', users: 19, travels: 8 },
    { date: '01/05', users: 15, travels: 6 },
    { date: '01/06', users: 25, travels: 12 },
    { date: '01/07', users: 22, travels: 10 },
    { date: '01/08', users: 30, travels: 15 },
    { date: '01/09', users: 28, travels: 13 }
  ];

  useEffect(() => {
    // 권한 확인
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }

    fetchAdminStats();
  }, [navigate]);

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('관리자 통계 조회 실패:', error);
      if (error.response?.status === 403) {
        alert('관리자 권한이 필요합니다.');
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Global Background */}
      <div className="fixed inset-0 -z-10">
        <StarryBackground />
      </div>

      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">관리자 대시보드</h1>
            </div>
            <p className="text-gray-400">서비스 운영 현황을 한눈에 확인하세요</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            대시보드로
          </button>
        </div>

        {/* 통계 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 총 회원 수 카드 */}
          <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">총 회원 수</p>
                <h2 className="text-4xl font-bold text-white">{stats.totalUsers.toLocaleString()}</h2>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 transition-all duration-300 pointer-events-none"></div>
          </div>

          {/* 총 여행 방 개수 카드 */}
          <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-purple-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">총 여행 방</p>
                <h2 className="text-4xl font-bold text-white">{stats.totalTravels.toLocaleString()}</h2>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all">
                <Plane className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
          </div>

          {/* 오늘 생성된 여행 방 카드 */}
          <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-green-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">오늘 생성된 여행</p>
                <h2 className="text-4xl font-bold text-white">{stats.todayTravels.toLocaleString()}</h2>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all">
                <PlusCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/5 group-hover:to-green-600/5 transition-all duration-300 pointer-events-none"></div>
          </div>

          {/* 관리자 수 카드 */}
          <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-orange-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">관리자 수</p>
                <h2 className="text-4xl font-bold text-white">{stats.totalAdmins.toLocaleString()}</h2>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 group-hover:from-orange-500/30 group-hover:to-red-600/30 transition-all">
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/0 to-red-600/0 group-hover:from-orange-500/5 group-hover:to-red-600/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 가입자 추이 차트 */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-white">최근 7일간 가입자 추이</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#F9FAFB',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Legend
                  wrapperStyle={{ color: '#F9FAFB', fontSize: '14px' }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="가입자 수"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 여행 생성 추이 차트 */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Plane className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">최근 7일간 여행 생성 추이</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#F9FAFB',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Legend
                  wrapperStyle={{ color: '#F9FAFB', fontSize: '14px' }}
                />
                <Bar
                  dataKey="travels"
                  fill="#A855F7"
                  radius={[8, 8, 0, 0]}
                  name="여행 생성 수"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 요약 정보 */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-gray-400">시스템 정상 작동 중</p>
            </div>
            <p className="text-sm text-gray-500">
              마지막 업데이트: {new Date().toLocaleString('ko-KR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
