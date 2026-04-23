import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Briefcase, Calendar, FileText, Wallet, Loader2, CheckCircle2, ShieldCheck, ArrowLeft, ChevronDown, ExternalLink, AlertCircle, Sparkles, Zap, PenLine, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { mintWorkerCredential } from '../lib/stellar';
import { useToast } from '../context/ToastContext';
import { validateWalletAddress, validateCredentialInput, sanitizeString } from '../utils/validation';
import { useTranslation } from 'react-i18next';

const STEPS = [
  { icon: PenLine, label: 'registration.step1' },
  { icon: ShieldCheck, label: 'registration.step2' },
  { icon: Sparkles, label: 'registration.step3' },
];

const FormField = ({ icon: Icon, label, error, children, completed }) => (
  <div className="space-y-2">
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
      setTxResult(response); setExistingCredential(data);
      toast.success(`Credential issued! Tx: ${response?.hash?.slice(0,8) || 'ok'}...`);
    } catch (err) { console.error(err); toast.error(err.message || 'Failed to mint'); }
    finally { setIsMinting(false); }
  };

  const trunc = (a) => a ? `${a.slice(0,6)}...${a.slice(-6)}` : '';
  const filled = [formData.fullName, formData.skillCategory, formData.experience, formData.city, (formData.bio||'').length >= 10].filter(Boolean).length;
  const curStep = txResult ? 3 : isMinting ? 2 : 1;
  const iCls = (f) => `w-full bg-transparent border-0 border-b ${errors[f] ? 'border-red-400/40' : 'border-white/20'} py-2.5 text-white text-xs focus:outline-none focus:border-white/60 transition-all font-inter placeholder:text-white/20`;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 flex items-center justify-center relative overflow-hidden text-white">
        <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md z-10">
          <div className="w-14 h-14 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6"><Wallet className="w-7 h-7 text-white/30" /></div>
          <h2 className="font-clash text-3xl font-bold mb-3 tracking-tight">{t('registration.headerTitle')}</h2>
          <p className="text-white/30 mb-8 text-sm font-inter">{t('registration.headerSubtitle')}</p>
          <button onClick={connect} className="w-full py-4 bg-white text-black rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] hover:opacity-85 transition-opacity flex items-center justify-center gap-2"><Wallet className="w-4 h-4" /> {t('dashboard.connectBtn')}</button>
        </motion.div>
      </div>
    );
  }

  if (existingCredential && !isMinting && !txResult) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
        <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '30%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
        <div className="max-w-xl mx-auto z-10 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors font-bold text-xs group mb-6"><ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back</Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-white/[0.07] rounded-[2px] bg-white/[0.02]">
            <div className="h-px bg-white/10" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center"><Award className="w-4 h-4 text-white/40" /></div>
                  <h2 className="font-clash text-xl font-bold tracking-tighter">{t('dashboard.myCredential')}</h2>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 border border-green-400/20 rounded-[2px]"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="text-[8px] font-bold uppercase text-green-400">{t('dashboard.onChain')}</span></div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {[{ l: t('registration.nameLabel'), v: existingCredential.name || existingCredential.fullName }, { l: t('registration.skillLabel'), v: existingCredential.skill || existingCredential.skillCategory }].map((d,i) => (
                    <div key={i} className="p-3 border border-white/5 rounded-[2px]"><p className="text-[8px] uppercase text-white/20 font-bold tracking-wider mb-1 font-inter">{d.l}</p><p className="font-bold text-sm">{d.v}</p></div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[{ l: t('registration.experienceLabel'), v: `${existingCredential.experience} ${t('registration.yearsLabel')}` }, { l: t('registration.cityLabel'), v: existingCredential.city }].map((d,i) => (
                    <div key={i} className="p-3 border border-white/5 rounded-[2px]"><p className="text-[8px] uppercase text-white/20 font-bold tracking-wider mb-1 font-inter">{d.l}</p><p className="font-bold text-sm">{d.v}</p></div>
                  ))}
                </div>
                <div className="p-3 border border-white/5 rounded-[2px]"><p className="text-[8px] uppercase text-white/20 font-bold tracking-wider mb-1 font-inter">{t('registration.bioLabelShort')}</p><p className="text-xs text-white/40 italic font-inter">"{existingCredential.bio}"</p></div>
              </div>
              <button onClick={() => { setFormData({ fullName: existingCredential.name||existingCredential.fullName||'', skillCategory: existingCredential.skill||existingCredential.skillCategory||'', experience: existingCredential.experience||'', city: existingCredential.city||'', bio: existingCredential.bio||'' }); setExistingCredential(null); }}
                className="mt-6 w-full py-3.5 border border-white/10 rounded-[2px] font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white/5 transition-all flex items-center justify-center gap-2"><PenLine className="w-3.5 h-3.5" /> {t('registration.updateCredential')}</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '20%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />
      <div className="max-w-[1000px] w-full mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors font-bold text-xs group mb-4"><ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> {t('registration.backToHome')}</Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 border border-white/[0.07] rounded-[2px] p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white/40" /></div>
              <div><h1 className="font-clash text-2xl font-bold tracking-tighter">{t('registration.headerTitle')}</h1><p className="text-white/25 text-xs font-inter">{t('registration.headerSubtitle')}</p></div>
            </div>
            <div className="flex items-center gap-2 border border-white/10 px-3 py-2 rounded-[2px]"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="font-mono text-[10px] text-white/40">{trunc(walletAddress)}</span></div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="mb-4 flex items-center justify-center">
          {STEPS.map((step, i) => { const sn=i+1, isA=curStep>=sn, isC=curStep===sn, Ic=step.icon; return (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-10 sm:w-16 h-px relative mx-1 bg-white/5"><motion.div className="absolute inset-y-0 left-0 bg-white/40" initial={{ width:'0%' }} animate={{ width: isA?'100%':'0%' }} /></div>}
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-[2px] transition-all ${isC?'bg-white text-black':isA?'text-white/40':'text-white/15'}`}>
                <div className={`w-5 h-5 rounded-[2px] flex items-center justify-center ${isC?'bg-black text-white':isA?'bg-white/20 text-white/60':'bg-white/5 text-white/15'}`}>{isA&&!isC?<CheckCircle2 className="w-2.5 h-2.5" />:<Ic className="w-2.5 h-2.5" />}</div>
                <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:block">{t(step.label)}</span>
              </div>
            </React.Fragment>
          ); })}
        </div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border border-white/[0.07] rounded-[2px] bg-white/[0.02] overflow-hidden">
          <div className="h-px bg-white/5"><motion.div className="h-full bg-white/40" animate={{ width: `${(filled/5)*100}%` }} /></div>
          <div className="py-5 px-6 sm:py-6 sm:px-10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2"><PenLine className="w-4 h-4 text-white/20" /><span className="text-xs font-bold text-white/40 font-inter">Professional Details</span></div>
              <span className="text-[9px] font-bold text-white/15 font-inter">{filled}/5</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField icon={User} label={t('registration.labelName')} error={errors.fullName} completed={(formData.fullName||'').length>=2}><input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Raj Kumar" className={iCls('fullName')} /></FormField>
              <FormField icon={Briefcase} label={t('registration.labelSkill')} error={errors.skillCategory} completed={!!formData.skillCategory}><div className="relative"><select name="skillCategory" value={formData.skillCategory} onChange={handleInputChange} className={`${iCls('skillCategory')} appearance-none pr-8 cursor-pointer`}><option value="">{t('registration.skillSelect')}</option>{skillCategories.map(c=><option key={c} value={c} className="bg-[#0a0a0a]">{t('jobs.'+c.replace(/\s+/g,''))}</option>)}</select><ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15 pointer-events-none" /></div></FormField>
              <FormField icon={Calendar} label={t('registration.labelExp')} error={errors.experience} completed={formData.experience>0}><input type="number" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="0" min="0" max="50" className={iCls('experience')} /></FormField>
              <FormField icon={MapPin} label={t('registration.labelCity')} error={errors.city} completed={!!formData.city}><input name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Mumbai" className={iCls('city')} /></FormField>
            </div>
            <FormField icon={FileText} label="Short Bio" error={errors.bio} completed={(formData.bio||'').length>=10}>
              <div className="relative"><textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="2" maxLength={64} placeholder={t('registration.bioPlaceholder')} className={`${iCls('bio')} resize-none min-h-[70px] border border-white/10 rounded-[2px] p-3`} /><span className={`absolute right-3 bottom-2.5 text-[9px] font-bold font-inter ${(formData.bio||'').length>55?'text-white/40':'text-white/15'}`}>{(formData.bio||'').length}/64</span></div>
            </FormField>
            <div className="mt-4">
              <AnimatePresence mode="wait">
                {txResult ? (
                  <motion.div key="s" initial={{ opacity:0 }} animate={{ opacity:1 }} className="border border-green-400/15 rounded-[2px] bg-green-400/[0.03] p-6 text-center">
                    <div className="w-12 h-12 rounded-[2px] bg-green-400/10 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-6 h-6 text-green-400" /></div>
                    <h3 className="font-clash text-lg font-bold mb-1">Credential Minted!</h3>
                    <p className="text-[10px] text-green-400/50 mb-4 font-inter">Sealed on Stellar</p>
                    <a href={`https://stellar.expert/explorer/testnet/tx/${txResult.hash}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 hover:text-white border border-white/10 px-5 py-2.5 rounded-[2px] transition-all"><ExternalLink className="w-3 h-3" /> {t('registration.viewOnExplorer')}</a>
                  </motion.div>
                ) : (
                  <motion.div key="b" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                    <div className="flex flex-col items-center mb-3 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-white/10 rounded-[2px] mb-2"><Zap className="w-3.5 h-3.5 text-white/40" /><span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{t('registration.gaslessTransaction')}</span></div>
                      <p className="text-[11px] text-white/25 font-inter">{t('registration.gaslessDesc')}</p>
                    </div>
                    <button onClick={handleMint} disabled={isMinting||filled!==5} className={`w-full py-4 rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] transition-all flex items-center justify-center gap-2.5 ${filled===5?'bg-white text-black hover:opacity-85':'bg-white/[0.03] border border-white/5 text-white/20 cursor-not-allowed'}`}>
                      {isMinting?<><Loader2 className="w-4 h-4 animate-spin" /> {t('registration.btnMinting')}</>:filled===5?<><ShieldCheck className="w-4 h-4" /> {t('registration.btnSubmit')}</>:<span>{t('registration.completeAllFields')}</span>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {errors._submit && <div className="mt-3 p-3 border border-red-400/20 rounded-[2px] flex items-center gap-2 text-red-400/80 text-[10px] font-inter"><AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors._submit}</div>}
            </div>
          </div>
        </motion.div>
        <div className="mt-8 flex items-center justify-center gap-5 text-white/10">
          {[{ icon: ShieldCheck, l: t('registration.badgeSoulbound') },{ icon: Clock, l: t('registration.badgePermanent') },{ icon: Sparkles, l: t('registration.badgeStellar') }].map((b,i)=>(<React.Fragment key={i}>{i>0&&<div className="w-1 h-1 rounded-full bg-white/5" />}<div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider font-inter"><b.icon className="w-3 h-3" /> {b.l}</div></React.Fragment>))}
        </div>
      </div>
    </div>
  );
};

export default WorkerRegistration;
