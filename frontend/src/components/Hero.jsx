import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center px-6 overflow-hidden h-[calc(100vh-80px)] bg-transparent">
      {/* Hero Content - Left Aligned */}
      <div className="relative z-10 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-left-8 duration-1000">
        <div className="max-w-3xl">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-[1.1] tracking-tight text-left">
            <span className="text-gray-300 drop-shadow-sm">
              함께 떠나는
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent drop-shadow-lg filter brightness-110">
              특별한 여행
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl leading-relaxed font-light text-left">
            친구들과 함께 여행 계획을 세우고, 추억을 공유하고,
            <br />
            잊지 못할 순간들을 만들어보세요
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start items-center sm:items-start">
            <button 
              onClick={handleGetStarted} 
              className="group px-8 py-4 bg-gray-100 hover:bg-white rounded-full text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center gap-2 hover:-translate-y-1 hover:scale-105"
            >
              {isLoggedIn ? '대시보드로 가기' : '무료로 시작하기'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {!isLoggedIn && (
              <Link to="/login" className="px-8 py-4 bg-transparent border border-white/10 text-gray-300 hover:text-white rounded-full font-semibold text-lg hover:bg-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
