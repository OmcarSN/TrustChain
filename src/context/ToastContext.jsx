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
              className={`p-4 rounded-xl border flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] pointer-events-auto group relative overflow-hidden bg-white ${
                toast.type === 'success' 
                  ? 'border-green-200' 
                  : toast.type === 'error'
                  ? 'border-red-200'
                  : 'border-[#E5E7EB]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                toast.type === 'success' ? 'bg-green-50' : toast.type === 'error' ? 'bg-red-50' : 'bg-orange-50'
              }`}>
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {toast.type === 'info' && <ShieldCheck className="w-5 h-5 text-orange-500" />}
              </div>

              <div className="flex-1">
                 <p className="text-[13px] font-bold leading-tight text-gray-900">{toast.message}</p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-900"
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
