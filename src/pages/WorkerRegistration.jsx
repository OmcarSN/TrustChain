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
  const [isUpdating, setIsUpdating] = useState(false);

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
    if (formData.bio.length > 150) ne.bio = 'Bio too long (max 150 chars)';
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
      const data = { 
        name: sanitizeString(formData.fullName), 
        skill: sanitizeString(formData.skillCategory), 
        city: sanitizeString(formData.city), 
        experience: sanitizeString(String(formData.experience)), 
        bio: sanitizeString(formData.bio), 
        phone: verifiedPhone || (existingCredential ? existingCredential.phone : ''), 
        timestamp: new Date().toISOString() 
      };
      const response = await mintWorkerCredential(walletAddress, data);
      const isUpserted = await upsertWorker(walletAddress, data);
      if (!isUpserted) {
        throw new Error("Minted on-chain successfully, but failed to sync to database. Please refresh.");
      }
      notifyStatsUpdated();
      setTxResult(response); 
      setExistingCredential(data);
      setIsUpdating(false);
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
  if (existingCredential && !isUpdating && !isMinting && !txResult) {
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
          setIsUpdating(true);
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
