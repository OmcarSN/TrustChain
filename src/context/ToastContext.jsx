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
  
  const parseMessage = (msg, type) => {
    if (typeof msg !== 'string') return { title: type === 'error' ? 'Error' : 'Success', sub: '' };
    if (msg.includes('!')) {
      const parts = msg.split('!');
      return { title: parts[0].trim() + '!', sub: parts.slice(1).join('!').trim() || (type === 'success' ? 'Transaction confirmed on Stellar' : '') };
    }
    if (msg.includes(':')) {
      const parts = msg.split(':');
      return { title: parts[0].trim(), sub: parts.slice(1).join(':').trim() };
    }
    return {
      title: type === 'error' ? 'Action Failed' : type === 'info' ? 'Notice' : 'Success',
      sub: msg
    };
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const { title, sub } = parseMessage(message, type);
    setToasts(p => [...p, { id, title, sub, type }]);
    setTimeout(() => removeToast(id), 4500);
  };
  
  const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));
  const success = (msg) => showToast(msg, 'success');
  const showError = (msg) => showToast(msg, 'error');
  const info = (msg) => showToast(msg, 'info');
  const toastRef = useRef({ success, error: showError, info });
  toastRef.current = { success, error: showError, info };

  useEffect(() => {
    registerToastInstance({
      success: (msg) => toastRef.current.success(msg),
      error: (msg) => toastRef.current.error(msg),
      info: (msg) => toastRef.current.info(msg)
    });
  }, []);

  return (
    <ToastContext.Provider value={{ success, error: showError, info }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-[360px] w-full pointer-events-none" role="alert" aria-live="assertive" aria-atomic="true">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const waveColor = isSuccess ? 'rgba(34,197,94,0.22)' : isError ? 'rgba(239,68,68,0.22)' : 'rgba(79,107,237,0.22)';
            const iconBg = isSuccess ? 'rgba(34,197,94,0.18)' : isError ? 'rgba(239,68,68,0.18)' : 'rgba(79,107,237,0.18)';
            const iconColor = isSuccess ? '#22c55e' : isError ? '#ef4444' : '#7C93F2';
            const titleColor = isSuccess ? '#22c55e' : isError ? '#ef4444' : '#7C93F2';
            const borderColor = isSuccess ? 'rgba(34,197,94,0.3)' : isError ? 'rgba(239,68,68,0.3)' : 'rgba(79,107,237,0.3)';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="pointer-events-auto relative overflow-hidden font-inter"
                style={{
                  width: '100%',
                  minHeight: '74px',
                  borderRadius: '12px',
                  boxSizing: 'border-box',
                  padding: '12px 16px',
                  backgroundColor: '#0c0f17',
                  border: `1px solid ${borderColor}`,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                {/* Wave decorative background */}
                <svg
                  viewBox="0 0 1440 320"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: 'absolute',
                    transform: 'rotate(90deg)',
                    left: '-32px',
                    top: '28px',
                    width: '90px',
                    fill: waveColor,
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                >
                  <path
                    d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                    fillOpacity="1"
                  />
                </svg>

                {/* Circular Icon Container */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: iconBg,
                    border: `1px solid ${borderColor}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {isSuccess && (
                    <svg viewBox="0 0 512 512" style={{ width: '18px', height: '18px', fill: iconColor }}>
                      <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
                    </svg>
                  )}
                  {isError && <AlertCircle style={{ width: '18px', height: '18px', color: iconColor }} />}
                  {!isSuccess && !isError && <ShieldCheck style={{ width: '18px', height: '18px', color: iconColor }} />}
                </div>

                {/* Message Text Container */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexGrow: 1,
                    minWidth: 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: titleColor,
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.3px',
                      lineHeight: '1.3',
                    }}
                  >
                    {toast.title}
                  </p>
                  {toast.sub && (
                    <p
                      style={{
                        margin: '2px 0 0 0',
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.65)',
                        lineHeight: '1.35',
                        wordBreak: 'break-word',
                      }}
                    >
                      {toast.sub}
                    </p>
                  )}
                </div>

                {/* Close Cross Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.4)',
                    transition: 'color 0.2s ease',
                    position: 'relative',
                    zIndex: 1,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'; }}
                  aria-label="Close notification"
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  /** Child component tree to wrap with toast context. */
  children: PropTypes.node.isRequired,
};
