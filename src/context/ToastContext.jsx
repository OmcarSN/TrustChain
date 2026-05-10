import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { registerToastInstance } from '../lib/toast';
import PropTypes from 'prop-types';

/**
 * ToastContext — React context for toast notification state.
 * Provides success, error, and info toast methods.
 */
const ToastContext = createContext();

/**
 * useToast — Convenience hook for consuming ToastContext.
 * Throws if used outside a ToastProvider.
 *
 * @returns {{success: Function, error: Function, info: Function}} Toast methods.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

/**
 * ToastProvider — Context provider that manages toast notification
 * lifecycle. Auto-dismisses toasts after 4 seconds and registers
 * a global toast instance for use outside React.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child component tree.
 * @returns {React.ReactElement} The ToastProvider component.
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  // eslint-disable-next-line react-hooks/purity
  const showToast = (message, type = 'success') => { const id = Date.now(); setToasts(p => [...p, { id, message, type }]); setTimeout(() => removeToast(id), 4000); };
  const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));
  const success = (msg) => showToast(msg, 'success');
  const showError = (msg) => showToast(msg, 'error');
  const info = (msg) => showToast(msg, 'info');
  const toastRef = useRef({ success, error: showError, info });
  toastRef.current = { success, error: showError, info };
  useEffect(() => { registerToastInstance({ success: (msg) => toastRef.current.success(msg), error: (msg) => toastRef.current.error(msg), info: (msg) => toastRef.current.info(msg) }); }, []);

  return (
    <ToastContext.Provider value={{ success, error: showError, info }}>
      {children}
      <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none" role="alert" aria-live="assertive" aria-atomic="true">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`p-4 rounded-[2px] border flex items-center gap-3.5 shadow-2xl pointer-events-auto relative overflow-hidden ${
                toast.type === 'success' ? 'bg-[#0a0a0a] border-green-400/20 text-green-100'
                : toast.type === 'error' ? 'bg-[#0a0a0a] border-red-400/25 text-red-100'
                : 'bg-[#0a0a0a] border-white/15 text-white'
              }`}>
              <div className={`relative z-10 w-9 h-9 rounded-[2px] flex items-center justify-center shrink-0 ${
                toast.type === 'success' ? 'bg-green-400/10 border border-green-400/20'
                : toast.type === 'error' ? 'bg-red-400/10 border border-red-400/20'
                : 'bg-white/5 border border-white/10'
              }`}>
                {toast.type === 'success' && <CheckCircle2 className="w-4.5 h-4.5 text-green-400" />}
                {toast.type === 'error' && <AlertCircle className="w-4.5 h-4.5 text-red-400" />}
                {toast.type === 'info' && <ShieldCheck className="w-4.5 h-4.5 text-white/50" />}
              </div>
              <div className="flex-1 relative z-10"><p className="text-[12px] font-bold leading-tight tracking-wide font-inter">{toast.message}</p></div>
              <button onClick={() => removeToast(toast.id)} className="relative z-10 p-1.5 hover:bg-white/10 rounded-[2px] transition-colors text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  /** Child component tree to wrap with toast context. */
  children: PropTypes.node.isRequired,
};
