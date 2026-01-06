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
    <section className="relative flex flex-col items-center justify-center px-6 pt-10 pb-0 overflow-hidden h-[calc(100vh-80px)]">
      {/* Gradient Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
          <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            함께 떠나는
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            특별한 여행
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
          친구들과 함께 여행 계획을 세우고, 추억을 공유하고,
          <br />
          잊지 못할 순간들을 만들어보세요
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={handleGetStarted} 
            className="group px-8 py-4 bg-gradient-to-r from-primary to-purple-600 rounded-2xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 flex items-center gap-2 hover:scale-105"
          >
            {isLoggedIn ? '대시보드로 가기' : '무료로 시작하기'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {!isLoggedIn && (
            <Link to="/login" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
              로그인
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
