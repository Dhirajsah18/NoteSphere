import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white text-emerald-950 shadow-lg shadow-emerald-500/10',
    error: 'border-rose-200 bg-white text-rose-950 shadow-lg shadow-rose-500/10',
    info: 'border-indigo-200 bg-white text-indigo-950 shadow-lg shadow-indigo-500/10',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
          borders[type] || borders.info
        }`}
      >
        {icons[type] || icons.info}
        <p className="text-xs sm:text-sm font-bold pr-2">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
