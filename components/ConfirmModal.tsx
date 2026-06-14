import React from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  language: 'pt-BR' | 'en-US';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel, language }) => {
  const isPT = language === 'pt-BR';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <p className="text-white text-sm font-medium mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
          >
            {isPT ? 'Cancelar' : 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-colors"
          >
            {isPT ? 'Confirmar' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
