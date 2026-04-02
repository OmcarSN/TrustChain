import React, { createContext, useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    registerToastInstance({ success, error, info });
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
              className={`p-5 rounded-3xl border backdrop-blur-2xl flex items-center gap-4 shadow-2xl pointer-events-auto group relative overflow-hidden ${
                toast.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/20 text-white' 
                  : toast.type === 'error'
                  ? 'bg-red-500/10 border-red-500/20 text-white'
                  : 'bg-accent/10 border-accent/20 text-white'
              }`}
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 opacity-10 blur-xl -z-10 ${
                toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-accent'
              }`} />

              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${
                toast.type === 'success' ? 'bg-green-500/10 border-green-500/20' : toast.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-accent/10 border-accent/20'
              }`}>
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                {toast.type === 'info' && <ShieldCheck className="w-5 h-5 text-accent" />}
              </div>

              <div className="flex-1">
                 <p className="text-sm font-bold leading-tight">{toast.message}</p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors text-white/20 hover:text-white"
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
