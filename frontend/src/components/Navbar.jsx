import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const email = localStorage.getItem('userEmail');
    setIsLoggedIn(loggedIn);
    setUserEmail(email || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-dark/80 backdrop-blur-xl">
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
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">{userEmail}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                >
                  대시보드
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
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
