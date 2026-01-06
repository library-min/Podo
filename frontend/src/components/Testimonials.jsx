import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: '김민지',
      role: '여행 블로거',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      comment: '친구들과 제주도 여행을 계획할 때 정말 유용했어요. 실시간으로 일정을 공유하고 수정할 수 있어서 너무 편했습니다!',
    },
    {
      name: '박준호',
      role: '대학생',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
      comment: '초대 코드 기능이 정말 간편해요. 친구들 모두 쉽게 참여할 수 있었고, 여행 추억을 한곳에 모아볼 수 있어 좋았어요.',
    },
    {
      name: '이서연',
      role: '직장인',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      comment: 'UI가 너무 깔끔하고 사용하기 쉬워요. 여행 계획부터 사진 공유까지 모든 게 한 앱에서 해결되니 정말 편리합니다!',
    },
  ];

  return (
    <section className="px-6 py-32 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              사용자 후기
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            이미 수많은 사람들이 함께 여행하고 있습니다
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-primary/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-10">
                <Quote className="w-16 h-16 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-300 leading-relaxed mb-8 relative z-10">
                "{testimonial.comment}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full ring-2 ring-primary/30"
                />
                <div>
                  <h4 className="text-white font-semibold">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Hover Gradient Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 to-purple-600/0 group-hover:from-primary/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-20 p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-purple-600/10 to-pink-600/10 border border-white/10 backdrop-blur-sm">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-400">만족도</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">고객 지원</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100K+</div>
              <div className="text-gray-400">공유된 사진</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400">여행지</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
