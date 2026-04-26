import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Briefcase, Calendar, FileText, Wallet, Loader2, CheckCircle2, ShieldCheck, ArrowLeft, ChevronDown, ExternalLink, AlertCircle, Sparkles, Zap, PenLine, Clock, Award, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { mintWorkerCredential } from '../lib/stellar';
import { useToast } from '../context/ToastContext';
import { validateWalletAddress, validateCredentialInput, sanitizeString } from '../utils/validation';
import { useTranslation } from 'react-i18next';
import { notifyStatsUpdated } from '../hooks/usePlatformStats';

const JOURNEY_STEPS = [
  { id: 1, icon: '✎', label: 'BUILD PROFILE', desc: 'Fill your details' },
  { id: 2, icon: '⬡', label: 'SIGN & SEND', desc: 'Approve in Freighter' },
  { id: 3, icon: '✦', label: 'MINTED', desc: 'On-chain forever' },
];



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

  const skillCategories = ['AC Technician','Agriculture','Babysitting','Carpenter','Cleaning','Construction','Cooking','Domestic Work','Driver','Electrician','Gardening','Maintenance','Painter','Plumbing','Security guard','Tailoring','Transport','Other'];

  useEffect(() => {
    if (walletAddress) {
      const stored = localStorage.getItem(`trustchain_worker_${walletAddress}`);
      setExistingCredential(stored ? JSON.parse(stored) : null);
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
      const data = { name: sanitizeString(formData.fullName), skill: sanitizeString(formData.skillCategory), city: sanitizeString(formData.city), experience: sanitizeString(String(formData.experience)), bio: sanitizeString(formData.bio), timestamp: new Date().toISOString() };
      const response = await mintWorkerCredential(walletAddress, data);
      localStorage.setItem(`trustchain_worker_${walletAddress}`, JSON.stringify(data));
      const reg = JSON.parse(localStorage.getItem('trustchain_worker_registry') || '[]');
      if (!reg.includes(walletAddress)) { reg.push(walletAddress); localStorage.setItem('trustchain_worker_registry', JSON.stringify(reg)); }
      notifyStatsUpdated();
      setTxResult(response); setExistingCredential(data);
      toast.success(`Credential issued! Tx: ${response?.hash?.slice(0,8) || 'ok'}...`);
    } catch (err) { console.error(err); toast.error(err.message || 'Failed to mint'); }
    finally { setIsMinting(false); }
  };

  const trunc = (a) => a ? `${a.slice(0,6)}...${a.slice(-6)}` : '';
  const copyAddr = () => { navigator.clipboard.writeText(walletAddress); setCopiedAddr(true); setTimeout(() => setCopiedAddr(false), 2000); };
  const filled = [formData.fullName, formData.skillCategory, formData.experience, formData.city, (formData.bio||'').length >= 10].filter(Boolean).length;
  const curStep = txResult ? 3 : isMinting ? 2 : 1;
  const iCls = (f) => `w-full bg-transparent border-0 border-b ${errors[f] ? 'border-red-400/40' : 'border-white/20'} py-2.5 text-white text-xs focus:outline-none focus:border-white/60 transition-all font-inter placeholder:text-white/20`;

  if (!isConnected) {
    return (
      <div className="relative overflow-hidden text-white min-h-screen" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px' }}>
        <style>{`
          @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes iconPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.05); } 50% { box-shadow: 0 0 0 12px rgba(255,255,255,0); } }
          @keyframes btnPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,0); } }
          @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
          .conn-anim { opacity: 0; animation: fadeSlideUp 0.6s ease forwards; }
          .shimmer-text { background: linear-gradient(to right, #ffffff 20%, #888888 50%, #ffffff 80%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; animation: shimmer 3s linear infinite; }
          .conn-btn { transition: all 0.25s ease; animation: btnPulse 2.5s ease infinite; }
          .conn-btn:hover { background-color: rgba(220,220,220,1) !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.15) !important; }
        `}</style>

        {/* Background Graphics */}

        <div className="text-center" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
          
          <div className="conn-anim" style={{ width: '72px', height: '72px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', animation: 'iconPulse 3s ease infinite, fadeSlideUp 0.6s ease forwards', animationDelay: '0s, 0.1s', borderRadius: '2px' }}>
            <Wallet style={{ width: '28px', height: '28px', color: 'rgba(255,255,255,0.5)' }} />
          </div>

          <h2 className="font-clash shimmer-text conn-anim" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '12px', animationDelay: '0.2s' }}>{t('registration.headerTitle')}</h2>
          
          <p className="font-inter conn-anim" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', marginBottom: '32px', maxWidth: '400px', textAlign: 'center', lineHeight: '1.6', animationDelay: '0.3s' }}>{t('registration.headerSubtitle')}</p>
          
          <div className="conn-anim" style={{ animationDelay: '0.4s' }}>
            <button onClick={connect} className="conn-btn font-inter" style={{ padding: '14px 40px', backgroundColor: '#ffffff', color: '#000000', border: 'none', fontWeight: '800', fontSize: '13px', letterSpacing: '2px', cursor: 'pointer', borderRadius: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase' }}>
              <Wallet style={{ width: '16px', height: '16px' }} /> {t('dashboard.connectBtn')}
            </button>
          </div>

          <div className="conn-anim font-inter" style={{ display: 'flex', gap: '32px', marginTop: '48px', opacity: 0.4, animationDelay: '0.6s' }}>
            <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>✓ MINT CREDENTIAL</span>
            <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>✓ BUILD REPUTATION</span>
            <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>✓ GET ENDORSED</span>
          </div>

        </div>
      </div>
    );
  }

  if (existingCredential && !isMinting && !txResult) {
    const fields = [
      { label: t('registration.nameLabel'), value: existingCredential.name || existingCredential.fullName },
      { label: t('registration.skillLabel'), value: existingCredential.skill || existingCredential.skillCategory },
      { label: t('registration.experienceLabel'), value: `${existingCredential.experience} ${t('registration.yearsLabel')}` },
      { label: t('registration.cityLabel'), value: existingCredential.city },
    ];
    return (
      <div className="relative overflow-hidden text-white min-h-screen">

        <style>{`
          @keyframes wpFadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .wp-anim { opacity: 0; animation: wpFadeSlideUp 0.4s ease forwards; }
          .wp-update-btn { transition: all 0.2s ease; border-top: 1px solid rgba(255,255,255,0.08); }
          .wp-update-btn:hover { background-color: rgba(255,255,255,0.04) !important; color: #00dc6e !important; border-top-color: rgba(0,220,110,0.2); }
          .wp-copy-btn { transition: color 0.2s ease; }
          .wp-copy-btn:hover { color: #ffffff !important; }
        `}</style>

        {/* Page Wrapper — centered column */}
        <div className="min-h-screen px-4 md:px-12 lg:px-24 w-full flex flex-col items-center" style={{
          paddingTop: '100px',
          paddingBottom: '60px',
          position: 'relative',
          zIndex: 10
        }}>

          {/* ═══ Page Header — centered ═══ */}
          <div style={{ width: '100%', maxWidth: '1100px', textAlign: 'center', marginBottom: '32px' }}>
            <p className="wp-anim font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px', textTransform: 'uppercase', fontWeight: '600', textAlign: 'center', animationDelay: '0s' }}>
              {t('nav.workerPortal')}
            </p>
            <h1 className="wp-anim font-clash" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '900', marginBottom: '6px', letterSpacing: '-0.02em', lineHeight: '1.1', color: '#ffffff', textAlign: 'center', animationDelay: '0.08s' }}>
              {t('dashboard.myCredential')}
            </h1>
            <p className="wp-anim font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', animationDelay: '0.14s' }}>
              {t('registration.headerSubtitle')}
            </p>
          </div>

          {/* ═══ Credential Card ═══ */}
          <div className="wp-anim" style={{
            width: '100%',
            maxWidth: '1100px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderTop: '2px solid rgba(255,255,255,0.15)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            borderRadius: '2px',
            animationDelay: '0.22s',
            animationDuration: '0.5s'
          }}>

            {/* Card Header Bar */}
            <div style={{
              padding: '14px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase' }}>
                {t('dashboard.myCredential')}
              </span>
              <span style={{
                fontSize: '10px', letterSpacing: '2px', color: '#00dc6e',
                backgroundColor: 'rgba(0,220,110,0.08)',
                border: '1px solid rgba(0,220,110,0.25)',
                padding: '4px 12px', fontWeight: '700'
              }}>
                ● {t('discover.badgeOnChain')}
              </span>
            </div>

            {/* Card Body — Fields Grid */}
            <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
              {fields.map((f, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div key={idx} className="wp-anim" style={{
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    paddingRight: isLeft ? '24px' : '0',
                    paddingLeft: isLeft ? '0' : '24px',
                    borderRight: isLeft ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    animationDelay: `${0.28 + idx * 0.05}s`
                  }}>
                    <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>
                      {f.label}
                    </span>
                    <span className="font-clash" style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
                      {f.value}
                    </span>
                  </div>
                );
              })}

              {/* Bio — full width */}
              {existingCredential.bio && (
                <div className="wp-anim" style={{ gridColumn: '1 / -1', padding: '14px 0', animationDelay: '0.48s' }}>
                  <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>
                    {t('registration.bioLabelShort')}
                  </span>
                  <div style={{
                    padding: '12px 14px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderLeft: '2px solid rgba(255,255,255,0.1)',
                    marginTop: '8px'
                  }}>
                    <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', lineHeight: '1.6' }}>
                      "{existingCredential.bio}"
                    </p>
                  </div>
                </div>
              )}

              {/* Wallet Address Row */}
              <div className="wp-anim" style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 0', animationDelay: '0.52s' }}>
                <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>
                  WALLET ADDRESS
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                    {trunc(walletAddress)}
                  </span>
                  <button
                    onClick={copyAddr}
                    className="wp-copy-btn"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', padding: '4px' }}
                  >
                    {copiedAddr ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Update Button */}
            <button
              onClick={() => { setFormData({ fullName: existingCredential.name||existingCredential.fullName||'', skillCategory: existingCredential.skill||existingCredential.skillCategory||'', experience: existingCredential.experience||'', city: existingCredential.city||'', bio: existingCredential.bio||'' }); setExistingCredential(null); }}
              className="wp-update-btn font-inter"
              style={{
                width: '100%',
                padding: '15px 24px',
                backgroundColor: 'transparent',
                border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                color: '#ffffff',
                fontSize: '11px', letterSpacing: '3px', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              <PenLine style={{ width: '13px', height: '13px', color: 'rgba(255,255,255,0.35)' }} />
              {t('registration.updateCredential')}
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Background Graphics (Grid & Orbs) */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,110,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      
      {/* Atmospheric Light Leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '20%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04, zIndex: 0 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05, zIndex: 0 }} />

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

      <div className="min-h-screen w-full" style={{ paddingTop:'80px', paddingBottom:'64px', paddingLeft:'60px', paddingRight:'60px', position:'relative', zIndex:10 }}>

        {/* Page Header */}
        <div className="reg-anim" style={{ textAlign:'center', padding:'40px 60px 0 60px', width:'100%', animationDelay:'0s' }}>
          <p className="font-inter" style={{ color: '#22c55e', fontSize: '11px', letterSpacing: '0.2em', marginBottom: '12px', textTransform:'uppercase', fontWeight:'600' }}>
            WORKER PORTAL
          </p>
          <h1 className="font-clash" style={{ fontSize:'28px', fontWeight:'800', marginBottom:'4px', letterSpacing:'-0.02em', lineHeight:'1.1' }}>Worker Identity Portal</h1>
          <p className="font-inter" style={{ fontSize:'13px', color:'#666', marginTop:'6px' }}>{t('registration.headerSubtitle')}</p>
        </div>

        {/* Journey Stepper */}
        <div className="reg-anim journey-bar" style={{ animationDelay:'0.1s' }}>
          {JOURNEY_STEPS.map((step, i) => {
            let statusClass = '';
            if (step.id === 1) {
              statusClass = filled === 5 ? 'completed' : 'active';
            } else if (step.id === 2) {
              if (txResult) statusClass = 'completed';
              else if (isMinting) statusClass = 'pending';
            } else if (step.id === 3) {
              if (txResult) statusClass = 'completed mint-flash';
            }
            
            let connectorCompleted = false;
            if (i === 1 && filled === 5) connectorCompleted = true;
            if (i === 2 && txResult) connectorCompleted = true;

            return (
              <React.Fragment key={step.id}>
                {i > 0 && (
                  <div className={`journey-connector ${connectorCompleted ? 'completed' : ''}`} />
                )}
                <div className={`journey-step ${statusClass}`}>
                  <div className="journey-icon font-inter">{step.icon}</div>
                  <div className="journey-label font-inter uppercase">{step.label}</div>
                  <div className="journey-desc font-inter">{step.desc}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Card */}
        <motion.div className="form-card reg-anim" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.5 }}>

          {/* Card Header */}
          <div className="form-card-header">
            <h2 className="form-card-title font-inter">Professional Details</h2>
            <span className="form-progress-badge font-inter uppercase">{filled}/5</span>
          </div>

          {/* Form Fields Grid */}
          <div className="form-grid">
            <div className="form-field">
              <label className="field-label font-inter uppercase"><User className="w-3.5 h-3.5 text-[#333]" /> {t('registration.labelName')}</label>
              <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Raj Kumar" className={`field-input ${formData.fullName.length>=2 ? 'filled':''} ${errors.fullName ? '!border-red-500/50' : ''}`} />
              {errors.fullName && <p className="text-red-400 text-[10px]">{errors.fullName}</p>}
            </div>
            <div className="form-field">
              <label className="field-label font-inter uppercase"><Briefcase className="w-3.5 h-3.5 text-[#333]" /> {t('registration.labelSkill')}</label>
              <div className="relative">
                <select name="skillCategory" value={formData.skillCategory} onChange={handleInputChange} className={`field-input ${formData.skillCategory ? 'filled':''} ${errors.skillCategory ? '!border-red-500/50' : ''}`}>
                  <option value="">{t('registration.skillSelect')}</option>
                  {skillCategories.map(c => <option key={c} value={c}>{t('jobs.'+c.replace(/\s+/g,''))}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] pointer-events-none" />
              </div>
              {errors.skillCategory && <p className="text-red-400 text-[10px]">{errors.skillCategory}</p>}
            </div>
            <div className="form-field">
              <label className="field-label font-inter uppercase"><Calendar className="w-3.5 h-3.5 text-[#333]" /> {t('registration.labelExp')}</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="0" min="0" max="50" className={`field-input ${formData.experience>0 ? 'filled':''} ${errors.experience ? '!border-red-500/50' : ''}`} />
              {errors.experience && <p className="text-red-400 text-[10px]">{errors.experience}</p>}
            </div>
            <div className="form-field">
              <label className="field-label font-inter uppercase"><MapPin className="w-3.5 h-3.5 text-[#333]" /> {t('registration.labelCity')}</label>
              <input name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Mumbai" className={`field-input ${formData.city ? 'filled':''} ${errors.city ? '!border-red-500/50' : ''}`} />
              {errors.city && <p className="text-red-400 text-[10px]">{errors.city}</p>}
            </div>
            <div className="form-field field-bio">
              <label className="field-label font-inter uppercase"><FileText className="w-3.5 h-3.5 text-[#333]" /> Short Bio <span className="ml-auto text-[10px] text-[#444]">{(formData.bio||'').length}/64</span></label>
              <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" maxLength={64} placeholder={t('registration.bioPlaceholder')} className={`field-input resize-none ${formData.bio.length>=10 ? 'filled':''} ${errors.bio ? '!border-red-500/50' : ''}`} />
              {errors.bio && <p className="text-red-400 text-[10px]">{errors.bio}</p>}
            </div>
          </div>

          {/* Submit Area */}
          <AnimatePresence mode="wait">
            {txResult ? (
              <motion.div key="s" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ border:'1px solid rgba(0,220,110,0.15)', backgroundColor:'rgba(0,220,110,0.03)', padding:'24px', textAlign:'center', marginTop:'36px', borderRadius:'6px' }}>
                <div style={{ width:'48px', height:'48px', backgroundColor:'rgba(0,220,110,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', borderRadius:'50%' }}><CheckCircle2 style={{ width:'24px', height:'24px', color:'#00dc6e' }} /></div>
                <h3 className="font-clash" style={{ fontSize:'18px', fontWeight:'800', marginBottom:'4px', color:'#fff' }}>Credential Minted!</h3>
                <p className="font-inter" style={{ fontSize:'10px', color:'rgba(0,220,110,0.5)', marginBottom:'16px' }}>Sealed on Stellar</p>
                <a href={`https://stellar.expert/explorer/testnet/tx/${txResult.hash}`} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'8px', fontSize:'10px', fontWeight:'700', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.1)', padding:'10px 20px', textDecoration:'none', transition:'color 0.2s', borderRadius:'4px' }}><ExternalLink style={{ width:'12px', height:'12px' }} /> {t('registration.viewOnExplorer')}</a>
              </motion.div>
            ) : (
              <motion.div key="b" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                {/* Gasless Banner */}
                <div className="gasless-banner">
                  <div className="gasless-title font-inter uppercase"><Zap className="w-3.5 h-3.5" /> {t('registration.gaslessTransaction')}</div>
                  <div className="gasless-subtitle font-inter">{t('registration.gaslessDesc')}</div>
                </div>
                {/* Mint Button */}
                <button onClick={handleMint} disabled={isMinting||filled!==5} className="mint-btn font-inter">
                  {isMinting ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('registration.btnMinting')}</> : filled===5 ? <><ShieldCheck className="w-4 h-4" /> {t('registration.btnSubmit')}</> : <span>{t('registration.completeAllFields')}</span>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {errors._submit && <div className="font-inter" style={{ marginTop:'12px', padding:'10px 14px', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', gap:'8px', color:'rgba(239,68,68,0.8)', fontSize:'10px', borderRadius:'4px' }}><AlertCircle style={{ width:'14px', height:'14px', flexShrink:0 }} /> {errors._submit}</div>}

        </motion.div>

      </div>
    </div>
  );
};

export default WorkerRegistration;
