import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    product: [
      { name: '기능', href: '#features' },
      { name: '가격', href: '#pricing' },
      { name: '후기', href: '#testimonials' },
      { name: '업데이트', href: '#updates' },
    ],
    company: [
      { name: '회사 소개', href: '#about' },
      { name: '블로그', href: '#blog' },
      { name: '채용', href: '#careers' },
      { name: '문의하기', href: '#contact' },
    ],
    support: [
      { name: '도움말', href: '#help' },
      { name: 'FAQ', href: '#faq' },
      { name: '이용약관', href: '#terms' },
      { name: '개인정보처리방침', href: '#privacy' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="relative px-6 py-20 border-t border-white/10">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-4">
              TravelTogether
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              친구들과 함께 만드는 특별한 여행 경험. 계획부터 추억 공유까지, 모든 순간을 함께하세요.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@traveltogether.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>1588-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>서울시 강남구 테헤란로 123</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-white font-semibold mb-4">제품</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">회사</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">지원</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-16 p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-purple-600/10 border border-white/10 backdrop-blur-sm">
          <div className="max-w-2xl">
            <h4 className="text-2xl font-bold text-white mb-2">
              최신 소식을 받아보세요
            </h4>
            <p className="text-gray-400 mb-6">
              새로운 기능과 여행 팁을 가장 먼저 받아보세요
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
                구독하기
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © 2024 TravelTogether. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
