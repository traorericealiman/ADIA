import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const Toasts: React.FC = () => {
  const { toasts, dismissToast } = useCrm();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const borderColors = {
          success: 'border-l-4 border-l-emerald-500 bg-white text-gray-900',
          warning: 'border-l-4 border-l-amber-500 bg-white text-gray-900',
          danger: 'border-l-4 border-l-red-600 bg-white text-gray-900',
          info: 'border-l-4 border-l-[#ff7900] bg-white text-gray-900'
        };

        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
          danger: <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-[#ff7900] flex-shrink-0" />
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-none shadow-xl border border-gray-200 transition-all transform translate-y-0 ${borderColors[toast.type]}`}
            role="alert"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{icons[toast.type]}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-black">{toast.title}</h4>
                    <span className="text-[11px] text-gray-400 font-mono">{toast.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{toast.message}</p>
                </div>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-gray-400 hover:text-black p-1 transition-colors"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
