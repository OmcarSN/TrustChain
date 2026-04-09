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

/* ── Floating Orb ─────────────────────────────────────────────── */
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none -z-10 ${className}`}
    animate={{ y: [0, -15, 0], scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ── Step Progress ────────────────────────────────────────────── */
const STEPS = [
  { icon: PenLine,     label: 'Fill Details' },
  { icon: ShieldCheck, label: 'Mint Credential' },
  { icon: Sparkles,    label: 'On-Chain' },
];

/* ── Form Field Component ─────────────────────────────────────── */
const FormField = ({ icon: Icon, label, error, children, completed }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-1.5 ml-1">
        <Icon className="w-3 h-3" /> {label}
      </label>
      {completed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center">
          <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
        </motion.div>
      )}
    </div>
    {children}
    {error && (
      <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="text-red-400/80 text-[10px] font-semibold flex items-center gap-1.5 ml-1">
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
    'Construction', 'Domestic Work', 'Transport', 
    'Agriculture', 'Cleaning', 'Maintenance', 'Other'
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

    // Validate the connected wallet first
    if (!validateWalletAddress(walletAddress)) {
      newErrors._submit = 'Invalid connected wallet address.';
    }

    if (!formData.fullName || formData.fullName.length < 2) 
      newErrors.fullName = 'Name must be at least 2 characters';
    if (!formData.skillCategory) 
      newErrors.skillCategory = 'Please select a skill category';
    if (!formData.experience || formData.experience < 0 || formData.experience > 50) 
      newErrors.experience = 'Experience must be between 0 and 50 years';
    if (!formData.city) 
      newErrors.city = 'City is required';
    if (!formData.bio || formData.bio.length < 10) 
      newErrors.bio = 'Bio must be at least 10 characters';
    if (new TextEncoder().encode(formData.bio).length > 64) 
      newErrors.bio = 'Bio is too long (max 64 bytes for on-chain storage)';

    // General Validation Check against XSS/Script Injections from validation.js
    const securityCheck = validateCredentialInput({
      fullName: formData.fullName,
      skillCategory: formData.skillCategory,
      experience: String(formData.experience),
      city: formData.city,
      bio: formData.bio
    });

    if (!securityCheck.isValid) {
      // Merge security errors if any strings are tainted
      Object.keys(securityCheck.errors).forEach(key => {
        newErrors[key] = securityCheck.errors[key];
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

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
        timestamp: new Date().toISOString()
      };
      
      const response = await mintWorkerCredential(walletAddress, data);
      localStorage.setItem(`trustchain_worker_${walletAddress}`, JSON.stringify(data));
      
      // Add to global worker registry for discovery
      const registry = JSON.parse(localStorage.getItem('trustchain_worker_registry') || '[]');
      if (!registry.includes(walletAddress)) {
        registry.push(walletAddress);
        localStorage.setItem('trustchain_worker_registry', JSON.stringify(registry));
      }
      
      setTxResult(response);
      setExistingCredential(data);
      
      const shortHash = response?.hash ? response.hash.slice(0, 8) : 'unknown';
      toast.success(`Credential issued! Tx: ${shortHash}...`);
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

  const inputClass = (field) => `w-full bg-white/[0.03] border ${errors[field] ? 'border-red-500/30' : 'border-white/[0.06]'} rounded-xl py-3.5 pl-4 pr-4 text-white text-sm focus:outline-none focus:border-accent/30 focus:bg-white/[0.05] transition-all font-medium placeholder:text-white/12`;

  /* ── Not connected ─────────────────────────────────────────── */
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center px-6 relative overflow-hidden">
        <FloatingOrb className="w-[600px] h-[600px] bg-accent/5 blur-[150px] top-20 left-1/2 -translate-x-1/2" />
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md p-10 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(255,255,255,0.03) 60%, rgba(124,58,237,0.04) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-800/20 border border-accent/15 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-black mb-2 tracking-tight">Worker Portal</h2>
            <p className="text-white/30 mb-8 text-sm font-medium leading-relaxed">
              Connect your Freighter wallet to mint your on-chain credential.
            </p>
            <button 
              onClick={connect}
              className="group w-full py-4 bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-accent/25 active:scale-[0.98]"
            >
              <Wallet className="w-4 h-4 group-hover:rotate-[-8deg] transition-transform" />
              Connect Freighter
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Existing credential view ──────────────────────────────── */
  if (existingCredential && !isMinting && !txResult) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8 px-4 sm:px-6 relative overflow-hidden">
        <FloatingOrb className="w-[600px] h-[400px] bg-accent/5 blur-[150px] top-20 left-1/3" />
        <div className="max-w-xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-accent transition-colors font-bold text-xs group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              border: '1px solid rgba(124,58,237,0.12)',
            }}
          >
            <div className="h-1 bg-gradient-to-r from-accent via-purple-500 to-accent/30" />
            <motion.div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Your Credential</h2>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/15 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase text-green-400">On-Chain</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                    <p className="text-[9px] uppercase text-white/25 font-bold tracking-wider mb-1">Name</p>
                    <p className="font-bold text-sm">{existingCredential.name || existingCredential.fullName}</p>
                  </div>
                  <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                    <p className="text-[9px] uppercase text-white/25 font-bold tracking-wider mb-1">Skill</p>
                    <p className="font-bold text-sm text-accent">{existingCredential.skill || existingCredential.skillCategory}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                    <p className="text-[9px] uppercase text-white/25 font-bold tracking-wider mb-1">Experience</p>
                    <p className="font-bold text-sm">{existingCredential.experience} Years</p>
                  </div>
                  <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                    <p className="text-[9px] uppercase text-white/25 font-bold tracking-wider mb-1">City</p>
                    <p className="font-bold text-sm">{existingCredential.city}</p>
                  </div>
                </div>
                <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                  <p className="text-[9px] uppercase text-white/25 font-bold tracking-wider mb-1">Bio</p>
                  <p className="text-xs text-white/50 italic leading-relaxed">"{existingCredential.bio}"</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setFormData({
                    fullName: existingCredential.name || existingCredential.fullName || '',
                    skillCategory: existingCredential.skill || existingCredential.skillCategory || '',
                    experience: existingCredential.experience || '',
                    city: existingCredential.city || '',
                    bio: existingCredential.bio || '',
                  });
                  setExistingCredential(null);
                }}
                className="mt-6 w-full py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white rounded-xl font-bold uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2"
              >
                <PenLine className="w-3.5 h-3.5 text-accent" /> Update Credential
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Main Registration Form ────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Background */}
      <FloatingOrb className="w-[700px] h-[500px] bg-accent/5 blur-[160px] top-10 left-1/3" />
      <FloatingOrb className="w-[400px] h-[400px] bg-purple-800/5 blur-[120px] bottom-20 right-10" delay={3} />
      <div className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)`,
          backgroundSize: '70px 70px',
        }}
      />

      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-accent transition-colors font-bold text-xs group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
        </motion.div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 p-6 sm:p-8 rounded-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(15,15,25,0.8) 50%, rgba(99,40,210,0.08) 100%)',
            border: '1px solid rgba(124,58,237,0.15)',
          }}
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/15 rounded-full blur-[80px]" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent to-purple-800 flex items-center justify-center shadow-lg shadow-accent/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Worker Registration</h1>
                <p className="text-white/30 text-xs font-medium">Mint your on-chain credential</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] px-3.5 py-2 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              <span className="font-mono text-[11px] text-white/40">{truncateAddress(walletAddress)}</span>
            </div>
          </div>
        </motion.div>

        {/* Step Progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex items-center justify-center"
        >
          {STEPS.map((step, i) => {
            const stepNum = i + 1;
            const isActive = currentStep >= stepNum;
            const isCurrent = currentStep === stepNum;
            const Icon = step.icon;
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className="w-10 sm:w-16 h-[2px] relative mx-1">
                    <div className="absolute inset-0 bg-white/5 rounded-full" />
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-purple-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: isActive ? '100%' : '0%' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                )}
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  isCurrent ? 'bg-accent/15 border border-accent/25' : isActive ? 'bg-white/[0.03] border border-white/[0.06]' : 'border border-transparent'
                }`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    isCurrent ? 'bg-accent text-white' : isActive ? 'bg-accent/20 text-accent' : 'bg-white/[0.04] text-white/15'
                  }`}>
                    {isActive && !isCurrent ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${
                    isCurrent ? 'text-white' : isActive ? 'text-white/40' : 'text-white/15'
                  }`}>{step.label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </motion.div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Progress bar */}
          <div className="h-1 bg-white/[0.02]">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-purple-500"
              animate={{ width: `${(filledCount / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <PenLine className="w-4 h-4 text-accent/60" />
                <span className="text-xs font-bold text-white/40">Professional Details</span>
              </div>
              <span className="text-[9px] font-bold text-white/15">{filledCount}/5 completed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {/* Name */}
              <FormField icon={User} label="Full Name" error={errors.fullName} completed={(formData.fullName || '').length >= 2}>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Raj Kumar"
                  className={inputClass('fullName')}
                />
              </FormField>

              {/* Category */}
              <FormField icon={Briefcase} label="Skill Category" error={errors.skillCategory} completed={!!formData.skillCategory}>
                <div className="relative">
                  <select
                    name="skillCategory"
                    value={formData.skillCategory}
                    onChange={handleInputChange}
                    className={`${inputClass('skillCategory')} appearance-none pr-10 cursor-pointer`}
                  >
                    <option value="">Select Category</option>
                    {skillCategories.map(c => <option key={c} value={c} className="bg-[#0f1016]">{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15 pointer-events-none" />
                </div>
              </FormField>

              {/* Experience */}
              <FormField icon={Calendar} label="Years Experience" error={errors.experience} completed={formData.experience > 0}>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="50"
                  className={inputClass('experience')}
                />
              </FormField>

              {/* City */}
              <FormField icon={MapPin} label="City" error={errors.city} completed={!!formData.city}>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Mumbai"
                  className={inputClass('city')}
                />
              </FormField>
            </div>

            {/* Bio */}
            <FormField icon={FileText} label="Short Bio" error={errors.bio} completed={(formData.bio || '').length >= 10}>
              <div className="relative">
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength={64}
                  placeholder="Briefly describe your expertise (max 64 chars)..."
                  className={`${inputClass('bio')} resize-none min-h-[90px]`}
                />
                <span className={`absolute right-3 bottom-2.5 text-[9px] font-bold ${
                  (formData.bio || '').length > 55 ? 'text-amber-400/50' : 'text-white/12'
                }`}>
                  {(formData.bio || '').length}/64
                </span>
              </div>
            </FormField>

            {/* Submit / Result */}
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {txResult ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(145deg, rgba(34,197,94,0.08) 0%, rgba(15,15,25,0.5) 100%)',
                      border: '1px solid rgba(34,197,94,0.15)',
                    }}
                  >
                    <div className="p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-7 h-7 text-green-400" />
                      </div>
                      <h3 className="text-lg font-black mb-1">Credential Minted!</h3>
                      <p className="text-[10px] text-green-400/50 font-semibold mb-4">Permanently sealed on Stellar</p>
                      <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${txResult.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-accent hover:text-white bg-accent/10 hover:bg-accent/20 px-5 py-2.5 rounded-lg transition-all"
                      >
                        <ExternalLink className="w-3 h-3" /> View on Explorer
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Gasless Transaction Info */}
                    <div className="flex flex-col items-center justify-center mb-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Gasless Transaction</span>
                      </div>
                      <p className="text-[11px] text-white/40 font-medium">
                        Your transaction fee is sponsored by TrustChain — you pay nothing
                      </p>
                    </div>
                    
                    <button
                      onClick={handleMint}
                      disabled={isMinting || filledCount !== 5}
                      className="group w-full relative overflow-hidden py-5 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:cursor-not-allowed"
                      style={{
                        background: filledCount === 5
                          ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)'
                          : 'rgba(255,255,255,0.04)',
                        border: filledCount === 5 ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: filledCount === 5 ? '0 8px 32px rgba(124,58,237,0.25)' : 'none',
                      }}
                    >
                      {filledCount === 5 && (
                        <motion.div
                          className="absolute inset-0 opacity-30"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-3">
                        {isMinting ? (
                          <><Loader2 className="w-4.5 h-4.5 animate-spin" /> Preparing Transaction...</>
                        ) : filledCount === 5 ? (
                          <><ShieldCheck className="w-4.5 h-4.5 group-hover:rotate-[10deg] transition-transform" /> Mint My Credential</>
                        ) : (
                          <span className="text-white/25">Complete All Fields to Mint</span>
                        )}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {errors._submit && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-red-500/8 border border-red-500/12 rounded-xl flex items-center gap-2 text-red-400/80 text-[10px] font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors._submit}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Trust footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-5 text-white/10"
        >
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" /> Soulbound Token
          </div>
          <div className="w-1 h-1 rounded-full bg-white/5" />
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Permanent Record
          </div>
          <div className="w-1 h-1 rounded-full bg-white/5" />
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Stellar Testnet
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerRegistration;
