import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './AuthPage.css'

function LoginPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await axios.post('http://localhost:8080/api/login', formData)

            // 로그인 성공 - 사용자 정보 저장
            localStorage.setItem('userEmail', formData.email)
            localStorage.setItem('isLoggedIn', 'true')

            alert(response.data)
            navigate('/')
        } catch (err) {
            setError(err.response?.data || '이메일 또는 비밀번호가 틀렸습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="bubble bubble-1"></div>
                <div className="bubble bubble-2"></div>
                <div className="bubble bubble-3"></div>
                <div className="bubble bubble-4"></div>
            </div>

            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">🍇 포도 여행 플래너</h1>
                    <p className="auth-subtitle">로그인하여 여행을 시작하세요</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            '로그인'
                        )}
                    </button>
                </form>

                <div className="toggle-mode">
                    <p>
                        계정이 없으신가요?
                        <Link to="/signup" className="toggle-link">
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
