import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './HomePage.css'

function HomePage() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [travels, setTravels] = useState([])
    const [userEmail, setUserEmail] = useState('')

    useEffect(() => {
        // 로그인 체크
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const email = localStorage.getItem('userEmail')

        if (!isLoggedIn || !email) {
            navigate('/login')
            return
        }

        setUserEmail(email)
        fetchTravels()
    }, [navigate])

    const fetchTravels = () => {
        axios.get('http://localhost:8080/api/travels')
            .then(res => {
                setTravels(res.data)
            })
            .catch(err => console.error('목록 로딩 에러:', err))
    }

    const createTravel = () => {
        if (!title) return alert('제목을 입력하세요!')

        axios.post('http://localhost:8080/api/travels', {
            title: title,
            startDate: '2026-05-01',
            endDate: '2026-05-05'
        })
            .then(res => {
                alert(res.data)
                setTitle('')
                fetchTravels()
            })
            .catch(err => console.error('생성 에러:', err))
    }

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userEmail')
        navigate('/login')
    }

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="navbar-content">
                    <h1 className="navbar-title">🍇 포도 여행 플래너</h1>
                    <div className="navbar-actions">
                        <span className="user-email">{userEmail}</span>
                        <button onClick={handleLogout} className="logout-button">
                            로그아웃
                        </button>
                    </div>
                </div>
            </nav>

            <div className="content-wrapper">
                <div className="create-section">
                    <h2 className="section-title">새로운 여행 만들기</h2>
                    <div className="input-wrapper">
                        <input
                            className="travel-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="어디로 여행 가시나요?"
                        />
                        <button
                            className="create-button"
                            onClick={createTravel}
                        >
                            방 생성하기
                        </button>
                    </div>
                </div>

                <div className="travels-section">
                    <h2 className="section-title">내 여행 목록</h2>
                    {travels.length === 0 ? (
                        <div className="empty-state">
                            <p className="empty-icon">✈️</p>
                            <p className="empty-text">등록된 여행이 없습니다.</p>
                            <p className="empty-subtext">첫 여행을 만들어보세요!</p>
                        </div>
                    ) : (
                        <div className="travels-grid">
                            {travels.map(t => (
                                <div key={t.travelId} className="travel-card">
                                    <h3 className="travel-title">{t.title}</h3>
                                    <p className="travel-date">📅 {t.startDate} ~ {t.endDate}</p>
                                    <div className="invite-code">
                                        <span className="code-label">초대 코드</span>
                                        <span className="code-value">{t.inviteCode}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomePage
