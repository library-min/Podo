import { Instagram, Twitter, Facebook, Sparkles } from 'lucide-react';
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
    <footer className="w-full bg-transparent">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 pt-0 pb-2">
        <div className="flex items-center justify-between">
          {/* Logo - Left Side */}
          <div className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-purple-600">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Podo
              </h1>
            </div>
          </div>

          {/* Links - Center */}
          <div className="hidden lg:flex items-center gap-6">
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

          {/* Social Links - Right Side */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Copyright - Full Width Border */}
      <div className="w-full">
        <div className="px-12 py-2 text-center">
          <p className="text-xs text-gray-500">
            © 2026 Podo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
