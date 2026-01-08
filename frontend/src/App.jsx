import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react' // 👈 추가
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import TravelWorkspace from './pages/TravelWorkspace'
import MyPage from './pages/MyPage'
import HelpPage from './pages/HelpPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import AdminDashboard from './pages/AdminDashboard'
import Footer from './components/Footer'
import StarryBackground from './components/StarryBackground'
import './App.css'

function AppContent() {
    const location = useLocation();
    const hideFooterPaths = ['/login', '/signup', '/admin/dashboard'];
    const shouldHideFooter = hideFooterPaths.includes(location.pathname);

    // 페이지 이동 시 스크롤을 맨 위로 초기화
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            {/* Global Background */}
            <div className="fixed inset-0 -z-10">
                <StarryBackground />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* 메인 컨텐츠 영역 */}
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/mypage" element={<MyPage />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/travel/:travelId/*" element={<TravelWorkspace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>

                {/* 로그인, 회원가입 페이지가 아닐 때만 Footer 표시 */}
                {!shouldHideFooter && <Footer />}
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    )
}

export default App