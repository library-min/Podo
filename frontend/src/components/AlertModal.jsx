import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function AlertModal({ isOpen, onClose, title, message, type = 'success' }) {
    if (!isOpen) return null;

    const typeConfig = {
        success: {
            icon: CheckCircle,
            color: 'text-green-400',
            bg: 'bg-green-500/20',
            border: 'border-green-500/50',
            btn: 'bg-green-500 hover:bg-green-600'
        },
        error: {
            icon: AlertCircle,
            color: 'text-red-400',
            bg: 'bg-red-500/20',
            border: 'border-red-500/50',
            btn: 'bg-red-500 hover:bg-red-600'
        },
        info: {
            icon: Info,
            color: 'text-blue-400',
            bg: 'bg-blue-500/20',
            border: 'border-blue-500/50',
            btn: 'bg-blue-500 hover:bg-blue-600'
        }
    };

    const config = typeConfig[type] || typeConfig.info;
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm bg-dark border border-white/10 rounded-3xl shadow-2xl p-6 scale-100 animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full ${config.bg} border ${config.border} mb-4`}>
                        <Icon className={`w-8 h-8 ${config.color}`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">
                        {title}
                    </h3>
                    
                    <p className="text-gray-400 mb-6">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className={`w-full py-3 rounded-xl text-white font-semibold transition-all shadow-lg ${config.btn}`}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
