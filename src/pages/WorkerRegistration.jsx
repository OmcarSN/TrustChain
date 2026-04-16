import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Briefcase, Calendar, FileText, 
  Wallet, Loader2, CheckCircle2, ShieldCheck, 
  ArrowLeft, ChevronDown, ExternalLink, AlertCircle,
  Sparkles, Zap, PenLine, Clock, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { mintWorkerCredential } from '../lib/stellar';
import { useToast } from '../context/ToastContext';
import { validateWalletAddress, validateCredentialInput, sanitizeString } from '../utils/validation';

/* ── Step Progress ────────────────────────────────────────────── */
const STEPS = [
  { icon: PenLine, label: 'Fill Details' },
  { icon: ShieldCheck, label: 'Mint Credential' },
  { icon: Sparkles, label: 'On-Chain' },
];

/* ── Form Field Component ─────────────────────────────────────── */
const FormField = ({ icon: Icon, label, error, children, completed }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="label-mono flex items-center gap-1.5 ml-1">
        <Icon className="w-3 h-3" style={{ color: '#8B5CF6' }} /> {label}
      </label>
      {completed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ease: [0.23, 1, 0.32, 1] }}>
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
        </motion.div>
      )}
    </div>
    {children}
    {error && (
      <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-medium flex items-center gap-1.5 ml-1 text-red-500">
        <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
      </motion.p>
    )}
  </div>
);

const WorkerRegistration = () => {
  const toast = useToast();
  const { walletAddress, isConnected, connect } = useWallet();
  
  const [formData, setFormData] = useState({
    fullName: '',
    skillCategory: '',
    experience: '',
    city: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [isMinting, setIsMinting] = useState(false);
  const [txResult, setTxResult] = useState(null);
  const [existingCredential, setExistingCredential] = useState(null);

  const skillCategories = [
    'Construction', 'Electrician', 'Plumbing', 'Carpenter', 'Painter',
    'Domestic Work', 'Cooking', 'Cleaning', 'Babysitting', 'Beautician',
    'Gardening', 'Tailoring', 'Driver', 'Transport', 'Security Guard',
    'Agriculture', 'Maintenance', 'Other'
  ];

  useEffect(() => {
    if (walletAddress) {
      const stored = localStorage.getItem(`trustchain_worker_${walletAddress}`);
      if (stored) {
        setExistingCredential(JSON.parse(stored));
      } else {
        setExistingCredential(null);
      }
    }
  }, [walletAddress]);

  const validateForm = () => {
    const newErrors = {};
    if (!validateWalletAddress(walletAddress)) newErrors._submit = 'Invalid connected wallet address.';
    if (!formData.fullName || formData.fullName.length < 2) newErrors.fullName = 'Name must be at least 2 characters';
    if (!formData.skillCategory) newErrors.skillCategory = 'Please select a skill category';
    if (!formData.experience || formData.experience < 0 || formData.experience > 50) newErrors.experience = 'Experience must be between 0 and 50 years';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.bio || formData.bio.length < 10) newErrors.bio = 'Bio must be at least 10 characters';
    if (new TextEncoder().encode(formData.bio).length > 128) newErrors.bio = 'Bio is too long (max 128 bytes for on-chain storage)';
    const securityCheck = validateCredentialInput({
      fullName: formData.fullName, skillCategory: formData.skillCategory,
      experience: String(formData.experience), city: formData.city, bio: formData.bio
    });
    if (!securityCheck.isValid) {
      Object.keys(securityCheck.errors).forEach(key => { newErrors[key] = securityCheck.errors[key]; });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleMint = async () => {
    if (!validateForm()) return;
    setIsMinting(true);
    try {
      const data = {
        name: sanitizeString(formData.fullName), skill: sanitizeString(formData.skillCategory),
        city: sanitizeString(formData.city), experience: sanitizeString(String(formData.experience)),
        bio: sanitizeString(formData.bio), timestamp: new Date().toISOString()
      };
      const response = await mintWorkerCredential(walletAddress, data);
      localStorage.setItem(`trustchain_worker_${walletAddress}`, JSON.stringify(data));
      const registry = JSON.parse(localStorage.getItem('trustchain_worker_registry') || '[]');
      if (!registry.includes(walletAddress)) { registry.push(walletAddress); localStorage.setItem('trustchain_worker_registry', JSON.stringify(registry)); }
      setTxResult(response);
      setExistingCredential(data);
      toast.success(`Credential issued! Tx: ${response?.hash ? response.hash.slice(0, 8) : 'unknown'}...`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to mint credential');
    } finally {
      setIsMinting(false);
    }
  };

  const truncateAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : "";
  const filledCount = [formData.fullName, formData.skillCategory, formData.experience, formData.city, (formData.bio || '').length >= 10].filter(Boolean).length;
  const currentStep = txResult ? 3 : isMinting ? 2 : 1;

  const inputStyle = (field) => ({
    background: '#FFFFFF',
    border: `1px solid ${errors[field] ? '#EF4444' : '#E5E7EB'}`,
    borderRadius: '10px',
    padding: '14px 16px',
    width: '100%',
    color: '#111827',
    fontSize: '14px',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
  });

  const handleFocus = (e) => { e.target.style.borderColor = '#EA580C'; e.target.style.boxShadow = '0 0 0 3px rgba(234,88,12,0.1)'; };
  const handleBlur = (e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; };

  /* ── Not connected ─────────────────────────────────────────── */
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background pt-[100px] flex items-center justify-center px-6 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-md p-10 rounded-[20px] relative overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
              <Wallet className="w-8 h-8 text-[#1E3A8A]" />
            </div>
            <h2 className="text-2xl mb-2 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Worker Portal</h2>
            <p className="mb-8 text-sm leading-relaxed" style={{ color: '#4B5563', fontWeight: 400 }}>Connect your Freighter wallet to mint your on-chain credential.</p>
            <button onClick={connect} className="w-full relative overflow-hidden rounded-full transition-all hover:scale-[1.02] btn-press">
              <div
                 className="w-full py-4 font-bold uppercase tracking-[0.2em] text-[10px] text-white flex items-center justify-center gap-2.5 rounded-full"
                 style={{ background: '#1E3A8A' }}>
                  <Wallet className="w-4 h-4" /> Connect Freighter
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Existing credential view ──────────────────────────────── */
  if (existingCredential && !isMinting && !txResult) {
    return (
      <div className="min-h-screen bg-background pt-[100px] pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xs group transition-colors font-medium text-gray-500 hover:text-gray-900">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[20px] relative overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div className="h-1" style={{ background: 'linear-gradient(90deg, #1E3A8A, #EA580C)' }} />
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    <Award className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Your Credential</h2>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7280', fontWeight: 400 }}>Verified on-chain identity</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: '#10B981', animation: 'pulse-dot 2s infinite' }} />
                    <span className="font-mono text-[11px] font-bold" style={{ color: '#4B5563' }}>{truncateAddress(walletAddress)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981', animation: 'pulse-dot 2s infinite' }} />
                    <span className="text-[9px] font-semibold uppercase text-[#10B981]">On-Chain</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Name', value: existingCredential.name || existingCredential.fullName },
                      { label: 'Skill', value: existingCredential.skill || existingCredential.skillCategory, color: '#EA580C' },
                    ].map((f, i) => (
                      <div key={i} className="p-4 rounded-xl transition-colors hover:bg-gray-50" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                        <p className="label-mono mb-1.5">{f.label}</p>
                        <p className="font-bold text-base" style={{ color: f.color || '#111827' }}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Experience', value: `${existingCredential.experience} Years` },
                      { label: 'City', value: existingCredential.city },
                    ].map((f, i) => (
                      <div key={i} className="p-4 rounded-xl transition-colors hover:bg-gray-50" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                        <p className="label-mono mb-1.5">{f.label}</p>
                        <p className="font-bold text-base text-gray-900">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl flex flex-col justify-between transition-colors hover:bg-gray-50" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                  <div>
                    <p className="label-mono mb-1.5">Bio</p>
                    <p className="text-sm italic leading-relaxed" style={{ color: '#4B5563' }}>"{existingCredential.bio}"</p>
                  </div>
                  <div className="mt-4 pt-3" style={{ borderTop: '1px solid #E5E7EB' }}>
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold" style={{ color: '#6B7280' }}>
                      <ShieldCheck className="w-3 h-3" /> Soulbound · Non-Transferable
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setFormData({ fullName: existingCredential.name || existingCredential.fullName || '', skillCategory: existingCredential.skill || existingCredential.skillCategory || '', experience: existingCredential.experience || '', city: existingCredential.city || '', bio: existingCredential.bio || '' }); setExistingCredential(null); }}
                className="mt-8 w-full py-4 rounded-xl font-bold uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2 hover:bg-gray-50 hover-lift btn-press"
                style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#1E3A8A' }}
              >
                <PenLine className="w-3.5 h-3.5 text-[#EA580C]" /> Update Credential
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Main Registration Form ────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background pt-[100px] pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-5 p-5 sm:p-6 rounded-[20px] relative overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] group transition-colors font-medium text-gray-500 hover:text-gray-900">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981', animation: 'pulse-dot 2s infinite' }} />
              <span className="font-mono text-[10px] font-bold" style={{ color: '#4B5563' }}>{truncateAddress(walletAddress)}</span>
            </div>
          </div>

          {/* Title + Step Progress */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1E3A8A' }}>
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, letterSpacing: '-0.02em' }}>Worker Registration</h1>
                <p className="text-[11px]" style={{ color: '#4B5563', fontWeight: 400 }}>Mint your on-chain credential</p>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center">
              {STEPS.map((step, i) => {
                const stepNum = i + 1;
                const isActive = currentStep >= stepNum;
                const isCurrent = currentStep === stepNum;
                const Icon = step.icon;
                return (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="w-8 sm:w-12 h-[2px] relative mx-0.5">
                        <div className="absolute inset-0 rounded-full" style={{ background: '#E5E7EB', borderStyle: 'dashed' }} />
                        <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: 'linear-gradient(90deg, #1E3A8A, #EA580C)' }} initial={{ width: '0%' }} animate={{ width: isActive ? '100%' : '0%' }} transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }} />
                      </div>
                    )}
                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all" style={{
                      background: isCurrent ? '#EFF6FF' : isActive ? '#F9FAFB' : 'transparent',
                      border: isCurrent ? '1px solid #DBEAFE' : isActive ? '1px solid #E5E7EB' : '1px solid transparent',
                    }}>
                      <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{
                        background: isCurrent ? '#1E3A8A' : isActive ? '#EFF6FF' : '#F3F4F6',
                        color: isCurrent ? '#fff' : isActive ? '#1E3A8A' : '#9CA3AF',
                      }}>
                        {isActive && !isCurrent ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Icon className="w-2.5 h-2.5" />}
                      </div>
                      <span className="text-[8px] uppercase tracking-wider hidden sm:block font-bold" style={{ color: isCurrent ? '#111827' : isActive ? '#6B7280' : '#9CA3AF' }}>{step.label}</span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-[20px] relative overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
        >
          {/* Progress bar */}
          <div className="h-[3px]" style={{ background: '#F3F4F6' }}>
            <motion.div className="h-full" style={{ background: 'linear-gradient(90deg, #1E3A8A, #EA580C)' }} animate={{ width: `${(filledCount / 5) * 100}%` }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} />
          </div>

          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
              <div className="flex items-center gap-2">
                <PenLine className="w-3.5 h-3.5 text-[#EA580C]" />
                <span className="heading-serif text-xl" style={{ color: '#111827' }}>Professional Details</span>
              </div>
              <span className="text-xs font-medium" style={{ color: '#6B7280' }}>{filledCount}/5 completed</span>
            </div>

            {/* 3-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField icon={User} label="Full Name" error={errors.fullName} completed={(formData.fullName || '').length >= 2}>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Raj Kumar" style={inputStyle('fullName')} onFocus={handleFocus} onBlur={handleBlur} />
                </FormField>
                <FormField icon={Briefcase} label="Skill Category" error={errors.skillCategory} completed={!!formData.skillCategory}>
                  <div className="relative">
                    <select name="skillCategory" value={formData.skillCategory} onChange={handleInputChange} style={{ ...inputStyle('skillCategory'), appearance: 'none', paddingRight: '40px', cursor: 'pointer' }}>
                      <option value="">Select Category</option>
                      {skillCategories.map(c => <option key={c} value={c} style={{background:'#FFFFFF'}}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#6B7280' }} />
                  </div>
                </FormField>
                <FormField icon={Calendar} label="Years Experience" error={errors.experience} completed={formData.experience > 0}>
                  <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="0" min="0" max="50" style={inputStyle('experience')} onFocus={handleFocus} onBlur={handleBlur} />
                </FormField>
                <FormField icon={MapPin} label="City" error={errors.city} completed={!!formData.city}>
                  <input name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Mumbai" style={inputStyle('city')} onFocus={handleFocus} onBlur={handleBlur} />
                </FormField>
              </div>

              <div className="lg:col-span-1">
                <FormField icon={FileText} label="Short Bio" error={errors.bio} completed={(formData.bio || '').length >= 10}>
                  <div className="relative">
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="4" maxLength={128} placeholder="Briefly describe your expertise (max 128 chars)..." style={{ ...inputStyle('bio'), resize: 'none', minHeight: '140px' }} onFocus={handleFocus} onBlur={handleBlur} />
                    <span className="absolute right-3 bottom-2.5 text-[10px] font-medium" style={{ color: (formData.bio || '').length > 110 ? '#EA580C' : '#6B7280' }}>
                      {(formData.bio || '').length}/128
                    </span>
                  </div>
                </FormField>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {txResult ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[20px] overflow-hidden" style={{ background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
                    <div className="p-5 text-center">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#D1FAE5' }}>
                        <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                      </div>
                      <h3 className="text-lg mb-1 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Credential Minted!</h3>
                      <p className="text-[10px] mb-3 font-semibold" style={{ color: '#059669' }}>Permanently sealed on Stellar</p>
                      <a href={`https://stellar.expert/explorer/testnet/tx/${txResult.hash}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full transition-all hover:bg-blue-100"
                        style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', color: '#1E3A8A' }}>
                        <ExternalLink className="w-3 h-3" /> View on Explorer
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="submit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: '#FFFBEB', border: '1px solid #FEF3C7' }}>
                        <Zap className="w-3 h-3 text-[#D97706] shrink-0" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#D97706]">Gasless</span>
                      </div>
                      <p className="text-xs hidden sm:block font-medium" style={{ color: '#4B5563' }}>Fee sponsored by TrustChain</p>
                    </div>
                    {filledCount === 5 ? (
                      <button onClick={handleMint} disabled={isMinting} className="w-full hover-lift btn-press">
                        <div className="shiny-border">
                          <div className="shiny-border-inner w-full py-4 font-bold uppercase tracking-[0.2em] text-[11px] text-white flex items-center justify-center gap-3">
                            {isMinting ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing Transaction...</> : <><ShieldCheck className="w-4 h-4" /> Mint My Credential</>}
                          </div>
                        </div>
                      </button>
                    ) : (
                      <button disabled className="w-full py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] cursor-not-allowed" style={{ background: '#F3F4F6', color: '#9CA3AF' }}>
                        Complete All Fields to Mint
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {errors._submit && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 rounded-xl flex items-center gap-2 text-[10px] font-medium" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444' }}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors._submit}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Trust footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 flex items-center justify-center gap-5 font-bold" style={{ color: '#6B7280' }}>
          {[{ icon: ShieldCheck, text: 'Soulbound Token' }, { icon: Clock, text: 'Permanent Record' }, { icon: Sparkles, text: 'Stellar Testnet' }].map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-1 h-1 rounded-full" style={{ background: '#E5E7EB' }} />}
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold"><b.icon className="w-3 h-3" /> {b.text}</div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerRegistration;
