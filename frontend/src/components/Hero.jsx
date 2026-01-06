import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Gradient Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 hover:bg-white/10 transition-all duration-300">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-gray-300">새로운 여행 경험을 시작하세요</span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            함께 떠나는
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            특별한 여행
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          친구들과 함께 여행 계획을 세우고, 추억을 공유하고,
          <br />
          잊지 못할 순간들을 만들어보세요
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Link to="/signup" className="group px-8 py-4 bg-gradient-to-r from-primary to-purple-600 rounded-2xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 flex items-center gap-2 hover:scale-105">
            무료로 시작하기
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
            로그인
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className="text-gray-500 text-sm md:text-base">활성 사용자</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
              50K+
            </div>
            <div className="text-gray-500 text-sm md:text-base">생성된 여행</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
              4.9★
            </div>
            <div className="text-gray-500 text-sm md:text-base">사용자 평점</div>
          </div>
        </div>
      </div>
    </section>
  );
}
