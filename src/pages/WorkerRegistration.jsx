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

const STEPS = [
  { icon: PenLine, label: 'registration.step1' },
  { icon: ShieldCheck, label: 'registration.step2' },
  { icon: Sparkles, label: 'registration.step3' },
];

const FormField = ({ icon: Icon, label, error, children, completed }) => (
  <div className="space-y-2 p-6 bg-white/5 border border-white/5 rounded-sm">
    <div className="flex items-center justify-between">
      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-1.5 font-inter"><Icon className="w-3 h-3" /> {label}</label>
      {completed && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 rounded-[2px] bg-green-400/10 flex items-center justify-center"><CheckCircle2 className="w-2.5 h-2.5 text-green-400" /></motion.div>}
    </div>
    {children}
    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400/80 text-[10px] font-inter flex items-center gap-1.5"><AlertCircle className="w-3 h-3 shrink-0" /> {error}</motion.p>}
  </div>
);

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
      <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px' }}>
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
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,110,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

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
      <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
        <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '30%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
        <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

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
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '20%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <style>{`
        @keyframes regFadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .reg-anim { opacity:0; animation: regFadeUp 0.4s ease forwards; }
        .reg-mint-btn { transition: all 0.2s ease; }
        .reg-mint-btn:hover:not(:disabled) { background-color: #e8e8e8 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,255,255,0.12); }
        .reg-input { background:transparent; border:none; border-bottom:1px solid rgba(255,255,255,0.1); font-weight:600; color:#fff; outline:none; transition: border-color 0.2s; }
        .reg-input:focus { border-bottom-color: rgba(255,255,255,0.4); }
        .reg-input::placeholder { color: rgba(255,255,255,0.2); }
        .reg-input-err { border-bottom-color: rgba(239,68,68,0.4) !important; }
        .reg-textarea { resize:none; min-height:60px; }
        .reg-select { appearance:none; cursor:pointer; padding-right:28px; }
      `}</style>

      <div className="min-h-screen px-4 md:px-12 lg:px-24 w-full flex flex-col items-center" style={{ paddingTop:'90px', paddingBottom:'32px', position:'relative', zIndex:10 }}>

        {/* Page Header */}
        <div className="reg-anim" style={{ width:'100%', maxWidth:'1100px', textAlign:'center', marginBottom:'16px', animationDelay:'0s' }}>
          <p className="font-inter" style={{ fontSize:'10px', letterSpacing:'4px', color:'rgba(255,255,255,0.3)', marginBottom:'8px', textTransform:'uppercase', fontWeight:'600' }}>{t('nav.workerPortal')}</p>
          <h1 className="font-clash" style={{ fontSize:'clamp(1.5rem, 3vw, 2.2rem)', fontWeight:'900', marginBottom:'4px', letterSpacing:'-0.02em', lineHeight:'1.1' }}>{t('registration.headerTitle')}</h1>
          <p className="font-inter" style={{ fontSize:'13px', color:'rgba(255,255,255,0.4)' }}>{t('registration.headerSubtitle')}</p>
        </div>

        {/* Stepper */}
        <div className="reg-anim" style={{ width:'100%', maxWidth:'1100px', display:'flex', alignItems:'center', justifyContent: 'space-between', marginBottom:'16px', animationDelay:'0.1s' }}>
          {STEPS.map((step, i) => {
            const sn = i + 1, isDone = curStep > sn, isCur = curStep === sn, Ic = step.icon;
            return (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ flex:'1', height:'1px', margin:'0 8px', backgroundColor: isDone ? 'rgba(0,220,110,0.3)' : 'rgba(255,255,255,0.08)' }} />}
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <div style={{
                    width:'24px', height:'24px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'700', flexShrink:0,
                    ...(isCur ? { backgroundColor:'#fff', color:'#000' } : isDone ? { backgroundColor:'rgba(0,220,110,0.15)', border:'1px solid rgba(0,220,110,0.4)', color:'#00dc6e' } : { backgroundColor:'transparent', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.3)' })
                  }}>
                    {isDone ? <CheckCircle2 style={{ width:'12px', height:'12px' }} /> : <Ic style={{ width:'10px', height:'10px' }} />}
                  </div>
                  <span className="font-inter hidden sm:block" style={{ fontSize:'10px', letterSpacing:'2px', fontWeight:'700', textTransform:'uppercase', color: isCur ? '#fff' : isDone ? '#00dc6e' : 'rgba(255,255,255,0.25)' }}>{t(step.label)}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Card */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.5 }} style={{ width:'100%', maxWidth:'1100px', border:'1px solid rgba(255,255,255,0.1)', borderTop:'2px solid rgba(255,255,255,0.12)', backgroundColor:'rgba(255,255,255,0.02)', boxShadow:'0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.4)', overflow:'hidden', borderRadius:'2px' }}>

          {/* Progress bar */}
          <div style={{ height:'2px', backgroundColor:'rgba(255,255,255,0.03)' }}><motion.div style={{ height:'100%', backgroundColor:'rgba(0,220,110,0.5)' }} animate={{ width:`${(filled/5)*100}%` }} /></div>

          {/* Card Header */}
          <div style={{ padding:'10px 24px', borderBottom:'1px solid rgba(255,255,255,0.08)', backgroundColor:'rgba(255,255,255,0.03)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <PenLine style={{ width:'13px', height:'13px', color:'rgba(255,255,255,0.3)' }} />
              <span className="font-inter" style={{ fontSize:'13px', fontWeight:'700', color:'#fff' }}>Professional Details</span>
            </div>
            <span style={{ fontSize:'10px', letterSpacing:'2px', color:'#00dc6e', backgroundColor:'rgba(0,220,110,0.08)', border:'1px solid rgba(0,220,110,0.2)', padding:'3px 10px', fontWeight:'700' }}>{filled}/5</span>
          </div>

          {/* Form Fields */}
          <div style={{ padding:'24px 32px' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8" style={{ marginBottom:'14px' }}>
              <FormField icon={User} label={t('registration.labelName')} error={errors.fullName} completed={(formData.fullName||'').length>=2}>
                <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Raj Kumar" className={`reg-input w-full px-3 py-2.5 text-sm ${errors.fullName ? 'reg-input-err' : ''}`} />
              </FormField>
              <FormField icon={Briefcase} label={t('registration.labelSkill')} error={errors.skillCategory} completed={!!formData.skillCategory}>
                <div className="relative">
                  <select name="skillCategory" value={formData.skillCategory} onChange={handleInputChange} className={`reg-input reg-select w-full px-3 py-2.5 text-sm ${errors.skillCategory ? 'reg-input-err' : ''}`}>
                    <option value="">{t('registration.skillSelect')}</option>
                    {skillCategories.map(c => <option key={c} value={c} style={{ backgroundColor:'#0a0a0a' }}>{t('jobs.'+c.replace(/\s+/g,''))}</option>)}
                  </select>
                  <ChevronDown style={{ position:'absolute', right:'4px', top:'50%', transform:'translateY(-50%)', width:'14px', height:'14px', color:'rgba(255,255,255,0.3)', pointerEvents:'none' }} />
                </div>
              </FormField>
              <FormField icon={Calendar} label={t('registration.labelExp')} error={errors.experience} completed={formData.experience>0}>
                <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="0" min="0" max="50" className={`reg-input w-full px-3 py-2.5 text-sm ${errors.experience ? 'reg-input-err' : ''}`} />
              </FormField>
              <FormField icon={MapPin} label={t('registration.labelCity')} error={errors.city} completed={!!formData.city}>
                <input name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Mumbai" className={`reg-input w-full px-3 py-2.5 text-sm ${errors.city ? 'reg-input-err' : ''}`} />
              </FormField>
            </div>
            <div style={{ gridColumn:'1 / -1' }}>
              <FormField icon={FileText} label="Short Bio" error={errors.bio} completed={(formData.bio||'').length>=10}>
                <div className="relative">
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="2" maxLength={64} placeholder={t('registration.bioPlaceholder')} className={`reg-input reg-textarea w-full px-3 py-2.5 text-sm ${errors.bio ? 'reg-input-err' : ''}`} style={{ borderBottom:'1px solid rgba(255,255,255,0.1)' }} />
                  <span className="font-inter" style={{ position:'absolute', right:'0', bottom:'8px', fontSize:'10px', fontWeight:'700', color: (formData.bio||'').length > 55 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }}>{(formData.bio||'').length}/64</span>
                </div>
              </FormField>
            </div>
          </div>

          {/* Submit Area */}
          <div style={{ padding:'0 24px 24px' }}>
            <AnimatePresence mode="wait">
              {txResult ? (
                <motion.div key="s" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ border:'1px solid rgba(0,220,110,0.15)', backgroundColor:'rgba(0,220,110,0.03)', padding:'24px', textAlign:'center' }}>
                  <div style={{ width:'48px', height:'48px', backgroundColor:'rgba(0,220,110,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><CheckCircle2 style={{ width:'24px', height:'24px', color:'#00dc6e' }} /></div>
                  <h3 className="font-clash" style={{ fontSize:'18px', fontWeight:'800', marginBottom:'4px' }}>Credential Minted!</h3>
                  <p className="font-inter" style={{ fontSize:'10px', color:'rgba(0,220,110,0.5)', marginBottom:'16px' }}>Sealed on Stellar</p>
                  <a href={`https://stellar.expert/explorer/testnet/tx/${txResult.hash}`} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'8px', fontSize:'10px', fontWeight:'700', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.1)', padding:'10px 20px', textDecoration:'none', transition:'color 0.2s' }}><ExternalLink style={{ width:'12px', height:'12px' }} /> {t('registration.viewOnExplorer')}</a>
                </motion.div>
              ) : (
                <motion.div key="b" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                  {/* Gasless Banner */}
                  <div style={{ padding:'10px 14px', backgroundColor:'rgba(0,220,110,0.05)', border:'1px solid rgba(0,220,110,0.15)', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', marginBottom:'16px' }}>
                    <span className="font-inter" style={{ fontSize:'10px', letterSpacing:'3px', color:'#00dc6e', fontWeight:'700', textTransform:'uppercase' }}>⚡ {t('registration.gaslessTransaction')}</span>
                    <p className="font-inter" style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>{t('registration.gaslessDesc')}</p>
                  </div>
                  {/* Mint Button */}
                  <button onClick={handleMint} disabled={isMinting||filled!==5} className="reg-mint-btn" style={{
                    width:'100%', padding:'15px 24px', borderRadius:'2px', border:'none',
                    fontSize:'11px', letterSpacing:'3px', fontWeight:'800', textTransform:'uppercase',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', cursor: filled===5 ? 'pointer' : 'not-allowed',
                    backgroundColor: filled===5 ? '#ffffff' : 'rgba(255,255,255,0.03)',
                    color: filled===5 ? '#000000' : 'rgba(255,255,255,0.2)',
                    ...(filled!==5 ? { border:'1px solid rgba(255,255,255,0.05)' } : {})
                  }}>
                    {isMinting ? <><Loader2 style={{ width:'14px', height:'14px' }} className="animate-spin" /> {t('registration.btnMinting')}</> : filled===5 ? <><ShieldCheck style={{ width:'14px', height:'14px' }} /> {t('registration.btnSubmit')}</> : <span>{t('registration.completeAllFields')}</span>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {errors._submit && <div className="font-inter" style={{ marginTop:'12px', padding:'10px 14px', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', gap:'8px', color:'rgba(239,68,68,0.8)', fontSize:'10px' }}><AlertCircle style={{ width:'14px', height:'14px', flexShrink:0 }} /> {errors._submit}</div>}
          </div>

          {/* Feature Tags */}
          <div style={{ padding:'12px 24px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'center', gap:'24px' }}>
            {[{ icon: ShieldCheck, l: t('registration.badgeSoulbound') }, { icon: Clock, l: t('registration.badgePermanent') }, { icon: Sparkles, l: t('registration.badgeStellar') }].map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width:'3px', height:'3px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.08)' }} />}
                <div className="font-inter" style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'9px', letterSpacing:'2px', color:'rgba(255,255,255,0.2)', fontWeight:'700', textTransform:'uppercase' }}>
                  <b.icon style={{ width:'10px', height:'10px', color:'rgba(255,255,255,0.15)' }} /> {b.l}
                </div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default WorkerRegistration;
