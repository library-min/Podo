import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, LogOut, Bell, Check, XIcon, User, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import AlertModal from './AlertModal';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const email = localStorage.getItem('userEmail');
    const nickname = localStorage.getItem('userNickname');
    setIsLoggedIn(loggedIn);
    setUserEmail(email || '');
    setUserNickname(nickname || '');

    if (loggedIn && email) {
      fetchNotifications(email);
      connectWebSocket(email);
    }
  }, []);

  const fetchNotifications = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/notifications/${email}`);
      setNotifications(response.data);
      const unread = response.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('알림 불러오기 실패:', error);
    }
  };

  const connectWebSocket = (email) => {
    const socket = new SockJS('http://localhost:8080/ws-stomp');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log('✅ 알림 WebSocket 연결 성공!');
      stompClient.subscribe(`/topic/notifications/${email}`, (message) => {
        const newNotification = JSON.parse(message.body);
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
    });
  };

  const acceptInvitation = async (notificationId) => {
    try {
      await axios.post(`http://localhost:8080/api/notifications/${notificationId}/accept`, {
        name: userNickname || userEmail.split('@')[0]
      });
      fetchNotifications(userEmail);
      showAlert('성공', '초대를 수락했습니다!');
    } catch (error) {
      console.error('초대 수락 실패:', error);
    }
  };

  const rejectInvitation = async (notificationId) => {
    try {
      await axios.post(`http://localhost:8080/api/notifications/${notificationId}/reject`);
      fetchNotifications(userEmail);
    } catch (error) {
      console.error('초대 거절 실패:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:8080/api/notifications/${notificationId}/read`);
      fetchNotifications(userEmail);
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userNickname');
    setIsLoggedIn(false);
    setUserEmail('');
    setUserNickname('');
    navigate('/');
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-dark/80 backdrop-blur-xl">
      <AlertModal 
        isOpen={alertState.isOpen}
        onClose={alertState.onClose}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-purple-600 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Podo
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-dark border border-white/10 rounded-2xl shadow-2xl max-h-[500px] overflow-y-auto">
                      <div className="p-4 border-b border-white/10">
                        <h3 className="text-lg font-bold text-white">알림</h3>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">새로운 알림이 없습니다</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/10">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 hover:bg-white/5 transition-all ${!notif.read ? 'bg-primary/5' : ''}`}
                              onClick={() => !notif.read && markAsRead(notif.id)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <p className="text-sm text-white flex-1">{notif.message}</p>
                                {!notif.read && (
                                  <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mb-3">{notif.senderName}</p>

                              {notif.type === 'INVITATION' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      acceptInvitation(notif.id);
                                    }}
                                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-1"
                                  >
                                    <Check className="w-4 h-4" />
                                    수락
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      rejectInvitation(notif.id);
                                    }}
                                    className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all flex items-center justify-center gap-1"
                                  >
                                    <XIcon className="w-4 h-4" />
                                    거절
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {(userNickname || userEmail).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300">{userNickname || userEmail}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                      <div className="p-1">
                        <Link
                          to="/mypage"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4" />
                          마이페이지
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          대시보드
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          로그아웃
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                >
                  시작하기
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">{userEmail}</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold text-center hover:shadow-lg hover:shadow-primary/50 transition-all"
                >
                  대시보드
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-center hover:bg-white/10 transition-all"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold text-center hover:shadow-lg hover:shadow-primary/50 transition-all"
                >
                  시작하기
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
