import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, ShieldCheck, Wallet } from 'lucide-react';
import { registerToastInstance } from '../lib/toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (msg) => showToast(msg, 'success');
  const error = (msg) => showToast(msg, 'error');
  const info = (msg) => showToast(msg, 'info');

  // Use ref to avoid stale closure: the bridge always calls the latest functions
  const toastRef = useRef({ success, error, info });
  toastRef.current = { success, error, info };

  useEffect(() => {
    registerToastInstance({
      success: (msg) => toastRef.current.success(msg),
      error: (msg) => toastRef.current.error(msg),
      info: (msg) => toastRef.current.info(msg),
    });
  }, []);

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow-2xl pointer-events-auto group relative overflow-hidden backdrop-blur-xl ${
                toast.type === 'success' 
                  ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-100 shadow-[0_8px_32px_rgba(16,185,129,0.15)]' 
                  : toast.type === 'error'
                  ? 'bg-gradient-to-r from-red-600/20 to-rose-600/5 border-red-500/30 text-red-50 shadow-[0_8px_32px_rgba(239,68,68,0.2)]'
                  : 'bg-gradient-to-r from-accent/15 to-purple-800/10 border-accent/20 text-white shadow-[0_8px_32px_rgba(124,58,237,0.15)]'
              }`}
            >
              <div className="absolute inset-0 bg-white/[0.02]" />
              
              <div className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                toast.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]' 
                : toast.type === 'error' ? 'bg-red-500/20 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]' 
                : 'bg-accent/20 border border-accent/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
              }`}>
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                {toast.type === 'info' && <ShieldCheck className="w-5 h-5 text-purple-400" />}
              </div>

              <div className="flex-1 relative z-10">
                 <p className="text-[13px] font-bold leading-tight tracking-wide drop-shadow-sm">{toast.message}</p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="relative z-10 p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
