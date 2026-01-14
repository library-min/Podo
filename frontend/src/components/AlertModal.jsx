import { X, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AlertModal({ isOpen, onClose, title, message, type = 'success' }) {
    const [confetti, setConfetti] = useState([]);

    useEffect(() => {
        if (isOpen && type === 'success') {
            // Generate confetti particles
            const particles = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 0.5,
                duration: 2 + Math.random() * 1,
                size: 4 + Math.random() * 4,
                rotation: Math.random() * 360
            }));
            setConfetti(particles);
        }
    }, [isOpen, type]);

    if (!isOpen) return null;

    const typeConfig = {
        success: {
            icon: CheckCircle,
            color: 'text-green-400',
            iconBg: 'from-green-500 to-emerald-600',
            glowColor: 'shadow-green-500/50',
            border: 'border-green-500/30',
            btn: 'from-green-500 to-emerald-600 hover:shadow-green-500/50',
            particles: true
        },
        error: {
            icon: AlertCircle,
            color: 'text-red-400',
            iconBg: 'from-red-500 to-rose-600',
            glowColor: 'shadow-red-500/50',
            border: 'border-red-500/30',
            btn: 'from-red-500 to-rose-600 hover:shadow-red-500/50',
            particles: false
        },
        info: {
            icon: Info,
            color: 'text-blue-400',
            iconBg: 'from-blue-500 to-cyan-600',
            glowColor: 'shadow-blue-500/50',
            border: 'border-blue-500/30',
            btn: 'from-blue-500 to-cyan-600 hover:shadow-blue-500/50',
            particles: false
        }
    };

    const config = typeConfig[type] || typeConfig.info;
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            {/* Success Confetti */}
            {config.particles && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {confetti.map((particle) => (
                        <div
                            key={particle.id}
                            className="absolute top-0 animate-confetti-fall"
                            style={{
                                left: `${particle.left}%`,
                                animationDelay: `${particle.delay}s`,
                                animationDuration: `${particle.duration}s`
                            }}
                        >
                            <Sparkles
                                className="text-yellow-400"
                                style={{
                                    width: `${particle.size}px`,
                                    height: `${particle.size}px`,
                                    transform: `rotate(${particle.rotation}deg)`
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl p-8 scale-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config.iconBg} opacity-5 blur-xl`}></div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all group"
                >
                    <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="relative flex flex-col items-center text-center">
                    {/* Animated Icon */}
                    <div className="relative mb-6">
                        {/* Pulsing ring */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.iconBg} opacity-20 animate-ping`}></div>

                        {/* Icon container */}
                        <div className={`relative p-5 rounded-full bg-gradient-to-r ${config.iconBg} ${config.glowColor} shadow-2xl animate-bounce-slow`}>
                            <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                        </div>

                        {/* Decorative sparkles for success */}
                        {type === 'success' && (
                            <>
                                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
                                <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 text-yellow-300 animate-pulse delay-100" />
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-400 mb-8 text-base leading-relaxed max-w-sm">
                        {message}
                    </p>

                    {/* Confirm Button */}
                    <button
                        onClick={onClose}
                        className={`w-full py-4 rounded-2xl bg-gradient-to-r ${config.btn} text-white font-bold text-base transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] duration-200`}
                    >
                        확인
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-10vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(110vh) rotate(720deg);
                        opacity: 0;
                    }
                }

                .animate-confetti-fall {
                    animation: confetti-fall linear forwards;
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }

                .delay-100 {
                    animation-delay: 0.1s;
                }
            `}</style>
        </div>
    );
}
