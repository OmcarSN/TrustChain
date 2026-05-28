import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { mintWorkerCredential } from '../lib/stellar';
import { useToast } from '../context/ToastContext';
import { validateWalletAddress, validateCredentialInput, sanitizeString } from '../utils/validation';
import { useTranslation } from 'react-i18next';
import { notifyStatsUpdated } from '../hooks/usePlatformStats';
import { getWorker, upsertWorker } from '../lib/supabaseData';
import RegistrationConnectPrompt from '../components/registration/RegistrationConnectPrompt';
import ExistingCredentialCard from '../components/registration/ExistingCredentialCard';
import RegistrationForm from '../components/registration/RegistrationForm';
import PhoneVerification from '../components/registration/PhoneVerification';

/**
 * WorkerRegistration — Orchestrator page for minting worker credentials.
 * Manages form state, validation, and on-chain minting via Stellar.
 * Delegates rendering to RegistrationConnectPrompt (not connected),
 * ExistingCredentialCard (already registered), and RegistrationForm
 * (new registration). Stores credential data in Supabase and
 * notifies the platform stats hook on successful mint.
 *
 * @returns {React.ReactElement} The WorkerRegistration page.
 */
const WorkerRegistration = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const { walletAddress, isConnected, connect } = useWallet();
  const [formData, setFormData] = useState({ fullName: '', skillCategory: '', experience: '', city: '', bio: '' });
  const [errors, setErrors] = useState({});
  const [isMinting, setIsMinting] = useState(false);
  const [txResult, setTxResult] = useState(null);
  const [existingCredential, setExistingCredential] = useState(null);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');

  useEffect(() => {
    if (walletAddress) {
      getWorker(walletAddress).then(data => setExistingCredential(data || null));
    }
  }, [walletAddress]);

  const validateForm = () => {
    const ne = {};
    if (!validateWalletAddress(walletAddress)) ne._submit = 'Invalid wallet address.';
    if (!formData.fullName || formData.fullName.length < 2) ne.fullName = 'Name must be at least 2 characters';
    if (!formData.skillCategory) ne.skillCategory = 'Please select a skill';
    if (!formData.experience || formData.experience < 0 || formData.experience > 50) ne.experience = 'Must be 0-50 years';
    if (!formData.city) ne.city = 'City is required';
    if (!formData.bio || formData.bio.length < 10) ne.bio = 'Bio must be at least 10 chars';
    if (new TextEncoder().encode(formData.bio).length > 64) ne.bio = 'Bio too long (max 64 bytes)';
    const sc = validateCredentialInput({ fullName: formData.fullName, skillCategory: formData.skillCategory, experience: String(formData.experience), city: formData.city, bio: formData.bio });
    if (!sc.isValid) Object.keys(sc.errors).forEach(k => { ne[k] = sc.errors[k]; });
    setErrors(ne);
    return Object.keys(ne).length === 0;
  };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })); if (errors[name]) setErrors(p => ({ ...p, [name]: null })); };

  const handleMint = async () => {
    if (!validateForm()) return;
    setIsMinting(true);
    try {
      const data = { name: sanitizeString(formData.fullName), skill: sanitizeString(formData.skillCategory), city: sanitizeString(formData.city), experience: sanitizeString(String(formData.experience)), bio: sanitizeString(formData.bio), phone: verifiedPhone, timestamp: new Date().toISOString() };
      const response = await mintWorkerCredential(walletAddress, data);
      await upsertWorker(walletAddress, data);
      notifyStatsUpdated();
      setTxResult(response); setExistingCredential(data);
      toast.success(`Credential issued! Tx: ${response?.hash?.slice(0,8) || 'ok'}...`);
    } catch (err) { console.error(err); toast.error(err.message || 'Failed to mint'); }
    finally { setIsMinting(false); }
  };

  const trunc = (a) => a ? `${a.slice(0,6)}...${a.slice(-6)}` : '';
  const copyAddr = () => { navigator.clipboard.writeText(walletAddress); setCopiedAddr(true); setTimeout(() => setCopiedAddr(false), 2000); };
  const filled = [formData.fullName, formData.skillCategory, formData.experience, formData.city, (formData.bio||'').length >= 10].filter(Boolean).length;

  // ── Connect Prompt ──
  if (!isConnected) {
    return <RegistrationConnectPrompt connect={connect} t={t} />;
  }

  // ── Existing Credential View ──
  if (existingCredential && !isMinting && !txResult) {
    return (
      <ExistingCredentialCard
        existingCredential={existingCredential}
        walletAddress={walletAddress}
        copiedAddr={copiedAddr}
        copyAddr={copyAddr}
        trunc={trunc}
        onUpdate={() => {
          setFormData({
            fullName: existingCredential.name || existingCredential.fullName || '',
            skillCategory: existingCredential.skill || existingCredential.skillCategory || '',
            experience: existingCredential.experience || '',
            city: existingCredential.city || '',
            bio: existingCredential.bio || ''
          });
          setExistingCredential(null);
        }}
        t={t}
      />
    );
  }

  // ── Phone Verification Gate ──
  if (!isPhoneVerified && !existingCredential) {
    return (
      <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
        <div className="tc-bg-grid" />
        <div className="tc-orb-blue" />
        <div className="tc-orb-green" />
        <div className="tc-leak-orange" />
        <div className="tc-leak-blue" />

        <div className="min-h-screen w-full" style={{ paddingTop: '80px', paddingBottom: '64px', paddingLeft: '60px', paddingRight: '60px', position: 'relative', zIndex: 10 }}>
          <div className="reg-anim" style={{ textAlign: 'center', padding: '40px 60px 0 60px', width: '100%', animationDelay: '0s' }}>
            <p className="font-inter" style={{ color: '#22c55e', fontSize: '11px', letterSpacing: '0.2em', marginBottom: '12px', textTransform: 'uppercase', fontWeight: '600' }}>WORKER PORTAL</p>
            <h1 className="font-clash" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>Worker Identity Portal</h1>
            <p className="font-inter" style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>{t('registration.headerSubtitle')}</p>
          </div>

          <PhoneVerification
            walletAddress={walletAddress}
            onVerified={(phoneNumber) => {
              setVerifiedPhone(phoneNumber);
              setIsPhoneVerified(true);
            }}
            t={t}
          />
        </div>
      </div>
    );
  }

  // ── Registration Form ──
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Background Graphics (Grid & Orbs) */}
      <div className="tc-bg-grid" />
      <div className="tc-orb-blue" />
      <div className="tc-orb-green" />
      
      {/* Atmospheric Light Leaks */}
      <div className="tc-leak-orange" />
      <div className="tc-leak-blue" />

      <style>{`
        @keyframes regFadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .reg-anim { opacity:0; animation: regFadeUp 0.4s ease forwards; }

        .journey-bar { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: flex-start; width: 100%; padding: 0 80px; margin: 32px 0; }
        .journey-step { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
        .journey-connector { height: 1px; background: #1a1a1a; margin-top: 18px; flex: 1; min-width: 80px; transition: background 0.3s ease; }
        .journey-connector.completed { background: #22c55e; }
        .journey-icon { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #222; display: flex; align-items: center; justify-content: center; font-size: 14px; background: #0c0c0c; flex-shrink: 0; color: #333; transition: all 0.3s ease; }
        .journey-step.active .journey-icon { border-color: #ffffff; color: #ffffff; background: #111; box-shadow: 0 0 12px rgba(255,255,255,0.1); }
        .journey-step.completed .journey-icon { border-color: #22c55e; color: #22c55e; background: #0a1a0f; box-shadow: 0 0 12px rgba(34,197,94,0.2); }
        .journey-step.pending .journey-icon { border-color: #22c55e; color: #22c55e; animation: glow-pulse 1.2s ease-in-out infinite; }
        @keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); } 50% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } }
        .journey-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; color: #333; margin-top: 4px; white-space: nowrap; }
        .journey-step.active .journey-label, .journey-step.completed .journey-label { color: #22c55e; }
        .journey-desc { font-size: 10px; color: #2a2a2a; white-space: nowrap; }
        .journey-step.active .journey-desc { color: #555; }
        .mint-flash .journey-icon { animation: mint-bounce 0.3s ease; }
        @keyframes mint-bounce { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }

        .form-card { background: #0d0d0d; border: 1px solid #1e1e1e; border-top: 2px solid #22c55e; border-radius: 0 0 8px 8px; padding: 32px 48px 40px 48px; width: 100%; margin: 0; }
        .form-card-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid #1a1a1a; margin-bottom: 28px; }
        .form-card-title { font-size: 15px; font-weight: 700; color: #ffffff; }
        .form-progress-badge { background: #0a1a0f; border: 1px solid #22c55e33; color: #22c55e; font-size: 11px; padding: 4px 12px; border-radius: 4px; font-weight: 700; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 40px; }
        .field-bio { grid-column: 1 / -1; }
        .form-field { display: flex; flex-direction: column; gap: 8px; }
        .field-label { font-size: 10px; letter-spacing: 0.14em; color: #444; font-weight: 600; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .field-input { width: 100%; background: #0a0a0a; border: 1px solid #1e1e1e; border-radius: 4px; padding: 12px 16px; font-size: 14px; color: #e5e5e5; transition: border-color 0.2s ease; }
        .field-input:focus { outline: none; border-color: #2a2a2a; }
        .field-input.has-value { border-color: rgba(34,197,94,0.2); }
        select.field-input { appearance: none; cursor: pointer; }
        select.field-input option { background: #0c0c0c; color: #fff; }

        .gasless-banner { margin-top: 28px; padding: 14px 20px; background: #0a1a0f; border: 1px solid rgba(34,197,94,0.15); border-radius: 4px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .gasless-title { color: #22c55e; font-size: 11px; letter-spacing: 0.15em; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .gasless-subtitle { color: #555; font-size: 11px; margin-top: 4px; }

        .mint-btn { margin-top: 16px; width: 100%; padding: 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; border-radius: 4px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 10px; text-transform: uppercase; }
        .mint-btn:disabled { background: #111; color: #2a2a2a; border: 1px solid #1a1a1a; cursor: not-allowed; }
        .mint-btn:not(:disabled) { background: #ffffff; color: #000000; border: none; }
        .mint-btn:not(:disabled):hover { background: #e5e5e5; }
      `}</style>

      <div className="min-h-screen w-full" style={{ paddingTop: '80px', paddingBottom: '64px', paddingLeft: '60px', paddingRight: '60px', position: 'relative', zIndex: 10 }}>
        {/* Page Header */}
        <div className="reg-anim" style={{ textAlign: 'center', padding: '40px 60px 0 60px', width: '100%', animationDelay: '0s' }}>
          <p className="font-inter" style={{ color: '#22c55e', fontSize: '11px', letterSpacing: '0.2em', marginBottom: '12px', textTransform: 'uppercase', fontWeight: '600' }}>WORKER PORTAL</p>
          <h1 className="font-clash" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>Worker Identity Portal</h1>
          <p className="font-inter" style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>{t('registration.headerSubtitle')}</p>
        </div>

        <RegistrationForm
          formData={formData}
          errors={errors}
          isMinting={isMinting}
          txResult={txResult}
          filled={filled}
          handleInputChange={handleInputChange}
          handleMint={handleMint}
          t={t}
        />
      </div>
    </div>
  );
};

export default WorkerRegistration;
