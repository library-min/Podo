import { UserPlus, Users, Plane, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function HowToStart() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

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
  ];

  return (
    <section className="px-6 py-32 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Title */}
        <div className="text-center mb-32">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              시작하는 방법
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            두 단계로 간편하게 시작하는 여행 계획
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative group h-full"
                >
                  {/* Card */}
                  <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-primary/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 flex flex-col h-full">
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
                    <p className="text-gray-400 text-center leading-relaxed mb-8 flex-grow">
                      {step.description}
                    </p>

                    {/* Button for Step 02 */}
                    {step.number === '02' && (
                      <button
                        onClick={handleGetStarted}
                        className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      >
                        지금 바로 시작하기
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>

                  {/* Connection Dot */}
                  <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50 ring-4 ring-dark group-hover:scale-150 transition-transform duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
