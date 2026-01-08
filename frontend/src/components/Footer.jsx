import { Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const footerLinks = [
    { name: '블로그', to: '#' },
    { name: '도움말', to: '/help' },
    { name: '이용약관', to: '/terms' },
    { name: '개인정보처리방침', to: '/privacy' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="relative w-full bg-transparent py-12 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center gap-8">
        
        {/* Center Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
          {footerLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="text-sm text-gray-400 hover:text-primary transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Center Social Icons */}
        <div className="flex items-center gap-4">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
              >
                <Icon className="w-4 h-4 text-gray-400 hover:text-primary transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Center Copyright */}
        <div className="text-center">
          <p className="text-xs text-gray-500 tracking-wider">
            © 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}