import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * PhoneVerification — OTP-based phone verification gate.
 * Renders a phone number input + OTP entry flow. Calls the backend
 * /api/send-otp and /api/verify-otp endpoints. On successful verification,
 * invokes the onVerified callback so the parent can unlock the mint form.
 *
 * @param {Object} props
 * @param {string} props.walletAddress - The connected wallet address.
 * @param {Function} props.onVerified - Callback invoked with the verified phone number.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement}
 */
const PhoneVerification = ({ walletAddress, onVerified, t }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'verified'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpInputRef = useRef(null);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-focus OTP input when step changes
  useEffect(() => {
    if (step === 'otp' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const formatPhone = (raw) => {
    // Strip everything except digits and leading +
    let cleaned = raw.replace(/[^\d+]/g, '');
    // Auto-prepend +91 for Indian numbers if user types 10 digits without country code
    if (cleaned.length === 10 && !cleaned.startsWith('+')) {
      cleaned = '+91' + cleaned;
    }
    return cleaned;
  };

  const handleSendOTP = async () => {
    const formatted = formatPhone(phone);
    if (!formatted || formatted.length < 10) {
      setError(t('phoneVerify.errInvalidPhone'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatted, walletAddress }),
      });

      // Safely handle empty or HTML responses (like Vite 404)
      let data;
      const textResponse = await res.text();
      try {
        data = JSON.parse(textResponse);
      } catch {
        throw new Error('Server returned an invalid response. If running locally, you must use vercel dev to test actual SMS.');
      }

      if (!res.ok) {
        setError(data.error || t('phoneVerify.errSendFail'));
        return;
      }

      setPhone(formatted);

      // If phone was already verified before, skip OTP entirely
      if (data.alreadyVerified) {
        setStep('verified');
        setTimeout(() => onVerified(formatted), 800);
        return;
      }

      setStep('otp');
      setCountdown(60); // 60 second cooldown before resend
    } catch (err) {
      setError(err.message || t('phoneVerify.errNetwork'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError(t('phoneVerify.errInvalidCode'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, walletAddress }),
      });

      // Safely handle empty or HTML responses
      let data;
      const textResponse = await res.text();
      try {
        data = JSON.parse(textResponse);
      } catch {
        throw new Error('Server returned an invalid response. If running locally, you must use vercel dev to test actual SMS.');
      }

      if (!res.ok) {
        setError(data.error || t('phoneVerify.errVerifyFail'));
        return;
      }

      setStep('verified');
      // Brief delay so user sees the success state
      setTimeout(() => onVerified(phone), 800);
    } catch (err) {
      setError(err.message || t('phoneVerify.errNetwork'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setOtp('');
    setError('');
    handleSendOTP();
  };

  return (
    <motion.div
      className="form-card reg-anim"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      style={{ maxWidth: '480px', margin: '32px auto 0' }}
    >
      {/* Header */}
      <div className="form-card-header">
        <h2 className="form-card-title font-inter" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck className="w-4 h-4" style={{ color: '#4F6BED' }} />
          {t('phoneVerify.title')}
        </h2>
        <span className="form-progress-badge font-inter uppercase">
          {step === 'verified' ? t('phoneVerify.verified') : step === 'otp' ? t('phoneVerify.step2') : t('phoneVerify.step1')}
        </span>
      </div>

      <p className="font-inter" style={{ fontSize: '12px', color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
        {t('phoneVerify.desc')}
      </p>

      <AnimatePresence mode="wait">
        {step === 'phone' && (
          <motion.div key="phone-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="form-field">
              <label htmlFor="otp-phone" className="field-label font-inter uppercase">
                <Phone className="w-3.5 h-3.5 text-[#333]" /> {t('phoneVerify.phoneLabel')}
              </label>
              <input
                id="otp-phone"
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (error) setError(''); }}
                placeholder="+91 9876543210"
                className={`field-input ${phone.length >= 10 ? 'has-value' : ''} ${error ? '!border-red-500/50' : ''}`}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
              />
              <p className="font-inter" style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>
                {t('phoneVerify.phoneHint')}
              </p>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading || phone.length < 10}
              className="mint-btn font-inter"
              style={{ marginTop: '20px' }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {t('phoneVerify.btnSending')}</>
              ) : (
                <><Phone className="w-4 h-4" /> {t('phoneVerify.btnSend')}</>
              )}
            </button>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div key="otp-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{
              padding: '12px 16px',
              background: '#0b0e20',
              border: '1px solid rgba(79,107,237,0.15)',
              borderRadius: '4px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 className="w-4 h-4" style={{ color: '#4F6BED', flexShrink: 0 }} />
              <span className="font-inter" style={{ fontSize: '11px', color: '#7C93F2' }}>
                {t('phoneVerify.codeSent')} <strong>{phone}</strong>
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="otp-code" className="field-label font-inter uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-[#333]" /> {t('phoneVerify.codeLabel')}
              </label>
              <input
                ref={otpInputRef}
                id="otp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); if (error) setError(''); }}
                placeholder="123456"
                className={`field-input ${otp.length === 6 ? 'has-value' : ''} ${error ? '!border-red-500/50' : ''}`}
                style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '20px', fontWeight: '700' }}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
              />
              <p className="font-inter" style={{ fontSize: '10px', color: '#444', marginTop: '4px', textAlign: 'center' }}>
                {t('phoneVerify.codeHint')}
              </p>
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="mint-btn font-inter"
              style={{ marginTop: '20px' }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {t('phoneVerify.btnVerifying')}</>
              ) : (
                <><ShieldCheck className="w-4 h-4" /> {t('phoneVerify.btnVerify')}</>
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className="font-inter"
              style={{
                marginTop: '12px',
                width: '100%',
                background: 'transparent',
                border: '1px solid #1e1e1e',
                color: countdown > 0 ? '#333' : '#888',
                padding: '10px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
                letterSpacing: '0.05em',
              }}
            >
              {countdown > 0 ? t('phoneVerify.btnResendIn').replace('{{seconds}}', countdown) : t('phoneVerify.btnResend')}
            </button>
          </motion.div>
        )}

        {step === 'verified' && (
          <motion.div
            key="verified-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '20px 0' }}
          >
            <div style={{
              width: '56px', height: '56px',
              backgroundColor: 'rgba(22,163,74,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', borderRadius: '50%',
              border: '1px solid rgba(22,163,74,0.2)',
            }}>
              <CheckCircle2 style={{ width: '28px', height: '28px', color: '#16A34A' }} />
            </div>
            <h3 className="font-clash" style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
              {t('phoneVerify.successTitle')}
            </h3>
            <p className="font-inter" style={{ fontSize: '11px', color: '#555' }}>
              {t('phoneVerify.successDesc')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-inter"
          role="alert"
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(239,68,68,0.8)',
            fontSize: '11px',
            borderRadius: '4px',
            background: 'rgba(239,68,68,0.03)',
          }}
        >
          <AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

PhoneVerification.propTypes = {
  /** Connected wallet address. */
  walletAddress: PropTypes.string.isRequired,
  /** Callback when phone is successfully verified, receives the phone number. */
  onVerified: PropTypes.func.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default PhoneVerification;
