import { UserPlus, Users, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowToStart() {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: '회원가입',
      description: '간단한 정보만 입력하면 30초 만에 가입 완료',
    },
    {
      number: '02',
      icon: Users,
      title: '여행 방 생성',
      description: '친구들을 초대하고 함께 여행 계획 세우기',
    },
    {
      number: '03',
      icon: Plane,
      title: '여행 떠나기',
      description: '계획한 여정을 따라 멋진 추억 만들기',
    },
  ];

  return (
    <section className="px-6 py-32 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              시작하는 방법
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            세 단계로 간편하게 시작하는 여행 계획
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2"></div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-primary/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                    {/* Step Number */}
                    <div className="absolute -top-6 left-8 text-7xl font-bold bg-gradient-to-b from-primary/30 to-primary/10 bg-clip-text text-transparent">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-6 mt-8">
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-purple-600 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/50">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connection Dot */}
                  <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50 ring-4 ring-dark group-hover:scale-150 transition-transform duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <Link to="/signup" className="inline-block group px-10 py-5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
            지금 바로 시작하기
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
