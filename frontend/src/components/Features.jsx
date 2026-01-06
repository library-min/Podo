import { Users, Link2, MapPin, Camera } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Users,
      title: '여행 방 생성',
      description: '친구들과 함께할 프라이빗 여행 공간을 만들고 실시간으로 계획을 공유하세요',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Link2,
      title: '초대 코드',
      description: '간단한 초대 코드로 친구들을 초대하고 함께 여행을 준비해보세요',
      gradient: 'from-primary to-purple-500',
    },
    {
      icon: MapPin,
      title: '여행지 추천',
      description: 'AI 기반 여행지 추천으로 당신에게 완벽한 여행지를 찾아드립니다',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Camera,
      title: '추억 공유',
      description: '여행 중 찍은 사진과 동영상을 실시간으로 공유하고 함께 추억을 만드세요',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <section className="px-6 py-32 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              모든 것이 한 곳에
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            여행 계획부터 추억 공유까지, 필요한 모든 기능을 제공합니다
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 to-purple-600/0 group-hover:from-primary/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
