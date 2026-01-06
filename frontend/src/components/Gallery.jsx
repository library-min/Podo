import { ArrowRight } from 'lucide-react';

export default function Gallery() {
  const destinations = [
    {
      title: '제주도',
      subtitle: '푸른 바다와 함께',
      description: '한라산부터 성산일출봉까지',
      image: 'https://images.unsplash.com/photo-1599619351208-3e6906b94044?w=800&q=80',
      gradient: 'from-blue-600/80 to-cyan-600/80',
    },
    {
      title: '서울',
      subtitle: '도심 속 낭만',
      description: '궁궐과 카페가 공존하는 도시',
      image: 'https://images.unsplash.com/photo-1601399363579-13b10e7e3ff1?w=800&q=80',
      gradient: 'from-purple-600/80 to-pink-600/80',
    },
    {
      title: '부산',
      subtitle: '바다 향기 가득',
      description: '해운대부터 광안리까지',
      image: 'https://images.unsplash.com/photo-1556699146-1e04f6e97d00?w=800&q=80',
      gradient: 'from-orange-600/80 to-rose-600/80',
    },
  ];

  return (
    <section className="px-6 py-32 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              어디든 갈 수 있어요
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            국내 최고의 여행지를 탐험하고 새로운 경험을 만들어보세요
          </p>
        </div>

        {/* Image Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <img
                src={dest.image}
                alt={dest.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${dest.gradient} via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm text-gray-200 mb-2">{dest.subtitle}</p>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {dest.title}
                  </h3>
                  <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {dest.description}
                  </p>
                  <button className="inline-flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    자세히 보기
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Border Glow Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/20 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
