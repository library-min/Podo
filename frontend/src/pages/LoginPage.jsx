import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Sparkles } from 'lucide-react';
import axios from 'axios';
import AlertModal from '../components/AlertModal';

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            const { token, email, nickname, role } = response.data;

            // 토큰과 사용자 정보를 로컬 스토리지에 저장
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userNickname', nickname);
            localStorage.setItem('userRole', role); // 권한 정보 저장
            localStorage.setItem('isLoggedIn', 'true');

            showAlert('환영합니다! 👋', `${nickname}님, 로그인에 성공했습니다!`, 'success', () => navigate('/dashboard'));
        } catch (err) {
            console.error('Login error:', err);
            // 백엔드에서 반환한 에러 메시지 사용, 없으면 기본 메시지
            const errorMessage = err.response?.data || '아이디 또는 비밀번호가 잘못되었습니다.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center px-6 py-12 relative overflow-hidden">
            <AlertModal 
                isOpen={alertState.isOpen}
                onClose={alertState.onClose}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            <div className="relative w-full max-w-md">
                {/* Back to Home Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>홈으로 돌아가기</span>
                </Link>

                {/* Login Card */}
                <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary font-semibold">Podo</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            다시 만나서 반가워요
                        </h1>
                        <p className="text-gray-400">
                            로그인하고 여행을 계속하세요
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                                아이디 / 이메일
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="아이디 또는 이메일을 입력하세요"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                                비밀번호
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>로그인 중...</span>
                                </div>
                            ) : (
                                '로그인'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gradient-to-b from-white/10 to-white/5 text-gray-400">
                                또는
                            </span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-gray-400">
                            아직 계정이 없으신가요?{' '}
                            <Link
                                to="/signup"
                                className="text-primary hover:text-purple-400 font-semibold transition-colors"
                            >
                                회원가입
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    로그인하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
