import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const colors = {
    success: 'border-[var(--gov-green)] bg-[var(--risk-low-bg)] text-[var(--risk-low)]',
    error: 'border-[var(--risk-high-border)] bg-[var(--risk-high-bg)] text-[var(--risk-high)]',
    info: 'border-[var(--gov-blue)] bg-[#f0f4ff] text-[var(--gov-blue)]'
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`
        flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg mb-3
        ${colors[type]} max-width-[320px] pointer-events-auto
      `}
    >
      <div className="flex-1 text-sm font-semibold">{message}</div>
      <button onClick={() => onClose(id)} className="opacity-50 hover:opacity-100">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </motion.div>
  );
};

export const ToastHub: React.FC<{ toasts: ToastProps[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[200] pointer-events-none flex flex-col items-end">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
