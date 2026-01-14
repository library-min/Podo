import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import AlertModal from '../components/AlertModal';

function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailStatus, setEmailStatus] = useState({
        checking: false,
        available: null,
        message: ''
    });

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

    // 이메일 중복 체크 (debounced)
    useEffect(() => {
        if (!formData.email || formData.email.length < 3) {
            setEmailStatus({ checking: false, available: null, message: '' });
            return;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setEmailStatus({ checking: false, available: false, message: '올바른 이메일 형식이 아닙니다.' });
            return;
        }

        setEmailStatus({ checking: true, available: null, message: '확인 중...' });

        const timeoutId = setTimeout(async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users/check-email', {
                    params: { email: formData.email }
                });

                if (response.data.available) {
                    setEmailStatus({
                        checking: false,
                        available: true,
                        message: '사용 가능한 이메일입니다.'
                    });
                } else {
                    setEmailStatus({
                        checking: false,
                        available: false,
                        message: '이미 사용 중인 이메일입니다.'
                    });
                }
            } catch (err) {
                console.error('Email check error:', err);
                setEmailStatus({
                    checking: false,
                    available: null,
                    message: ''
                });
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [formData.email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 이메일 중복 체크
        if (emailStatus.available === false) {
            setError('이메일이 이미 사용 중입니다.');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', {
                email: formData.email,
                password: formData.password,
                nickname: formData.nickname
            });

            showAlert('회원가입 성공! 🎉', response.data, 'success', () => navigate('/login'));
        } catch (err) {
            setError(err.response?.data || '회원가입에 실패했습니다.');
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

                {/* Signup Card */}
                <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary font-semibold">Podo</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            여행의 시작
                        </h1>
                        <p className="text-gray-400">
                            지금 가입하고 특별한 여행을 시작하세요
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                                이메일
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    required
                                    className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none transition-all ${
                                        emailStatus.available === true
                                            ? 'border-green-500/50 focus:border-green-500'
                                            : emailStatus.available === false
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : 'border-white/10 focus:border-primary/50'
                                    } focus:bg-white/10`}
                                />
                                {emailStatus.checking && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></div>
                                    </div>
                                )}
                                {!emailStatus.checking && emailStatus.available === true && (
                                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                )}
                                {!emailStatus.checking && emailStatus.available === false && (
                                    <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                                )}
                            </div>
                            {emailStatus.message && (
                                <p className={`mt-2 text-sm flex items-center gap-1 ${
                                    emailStatus.available === true
                                        ? 'text-green-400'
                                        : emailStatus.available === false
                                        ? 'text-red-400'
                                        : 'text-gray-400'
                                }`}>
                                    {emailStatus.message}
                                </p>
                            )}
                        </div>

                        {/* Nickname Input */}
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-semibold text-gray-300 mb-2">
                                닉네임
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="nickname"
                                    type="text"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    placeholder="닉네임을 입력하세요"
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

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                                비밀번호 확인
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
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
                            disabled={loading || emailStatus.available === false}
                            className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>가입 중...</span>
                                </div>
                            ) : (
                                '회원가입'
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

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-gray-400">
                            이미 계정이 있으신가요?{' '}
                            <Link
                                to="/login"
                                className="text-primary hover:text-purple-400 font-semibold transition-colors"
                            >
                                로그인
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    가입하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
                </p>
            </div>
        </div>
    );
}

export default SignupPage;
