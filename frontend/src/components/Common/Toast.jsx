import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200',
      icon: <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-950/90 border-rose-500/30 text-rose-200',
      icon: <XCircle className="h-5 w-5 text-rose-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-950/90 border-amber-500/30 text-amber-200',
      icon: <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />,
    },
    info: {
      bg: 'bg-blue-950/90 border-blue-500/30 text-blue-200',
      icon: <Info className="h-5 w-5 text-blue-400 shrink-0" />,
    },
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-slide-in ${config.bg} max-w-sm`}>
      {config.icon}
      <span className="text-sm font-medium pr-2">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
