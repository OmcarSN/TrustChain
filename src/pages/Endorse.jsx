import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Star, 
  MapPin, 
  Briefcase, 
  Wallet, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  ChevronDown,
  User,
  Hash,
  ExternalLink,
  AlertCircle,
  Sparkles,
  FileCheck,
  PenLine,
  Send,
  Award,
  Zap,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchWorkerCredential, submitWorkerEndorsement } from '../lib/stellar';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

/* ── Step labels for the progress bar ─────────────────────────── */
const STEPS = [
  { icon: Search,     label: 'Find Worker' },
  { icon: PenLine,    label: 'Write Review' },
  { icon: Send,       label: 'Seal On-Chain' },
];

/* ── Animated background particles ────────────────────────────── */
const FloatingParticle = ({ delay, size, left, duration }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${left}%`,
      background: `radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)`,
    }}
    initial={{ y: '100vh', opacity: 0 }}
    animate={{ 
      y: '-20vh', 
      opacity: [0, 0.6, 0.6, 0],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
);

const Endorse = () => {
  const toast = useToast();
  const { walletAddress, isConnected, connect } = useWallet();
  
  const [workerSearch, setWorkerSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundWorker, setFoundWorker] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [jobType, setJobType] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const [isSigning, setIsSigning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState(null);

  /* Determine the current step */
  const currentStep = isSuccess ? 3 : (foundWorker ? 2 : 1);

  const ratingLabels = ['', 'Needs Work', 'Fair', 'Good', 'Very Good', 'Outstanding'];

  const handleSearch = async () => {
    if (!workerSearch) return;
    
    if (workerSearch === walletAddress) {
      toast.error("You cannot endorse yourself.");
      return;
    }

    setIsSearching(true);
    setError(null);
    setFoundWorker(null);

    try {
      const credential = await fetchWorkerCredential(workerSearch);
      setFoundWorker({
        ...credential,
        address: workerSearch
      });
      toast.success('Worker Profile Found');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Worker not found');
      toast.error(err.message || 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleEndorse = async () => {
    if (!canSubmit) return;

    const localKey = `endorsements_${foundWorker.address}`;
    const previousEndorsements = JSON.parse(localStorage.getItem(localKey) || '[]');
    const alreadyEndorsed = previousEndorsements.some(e => e.endorser === walletAddress);

    if (alreadyEndorsed) {
      toast.error("You have already endorsed this worker.");
      return;
    }
    
    setIsSigning(true);
    setError(null);

    try {
      const response = await submitWorkerEndorsement({
        worker: foundWorker.address,
        rating,
        jobType,
        feedback
      }, walletAddress);
      
      const hash = response.hash;
      setTxHash(hash);
      setIsSuccess(true);

      const newEndorsement = {
        endorser: walletAddress,
        worker: foundWorker.address,
        rating,
        jobType,
        feedback,
        txHash: hash,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(localKey, JSON.stringify([...previousEndorsements, newEndorsement]));
      
      toast.success('Endorsement Sealed on Stellar');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Transaction failed');
      toast.error(err.message || 'Submission failed');
    } finally {
      setIsSigning(false);
    }
  };

  const truncateAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : "";

  const canSubmit = isConnected && foundWorker && rating > 0 && jobType && feedback.length >= 20;

  const activeStarValue = hoveredStar || rating;

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden text-white">
      {/* ── Ambient Background ─────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Primary gradient orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-40 left-10 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-60 right-0 w-[300px] h-[300px] bg-indigo-900/8 rounded-full blur-[100px]" />
        
        {/* Floating particles */}
        <FloatingParticle delay={0}   size={6}  left={15} duration={14} />
        <FloatingParticle delay={2}   size={4}  left={35} duration={18} />
        <FloatingParticle delay={4}   size={8}  left={55} duration={12} />
        <FloatingParticle delay={6}   size={5}  left={75} duration={16} />
        <FloatingParticle delay={8}   size={3}  left={90} duration={20} />
        <FloatingParticle delay={1}   size={6}  left={5}  duration={15} />
        <FloatingParticle delay={3}   size={4}  left={45} duration={17} />
        <FloatingParticle delay={5}   size={7}  left={65} duration={13} />
        
        {/* Grid lines (subtle) */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* ── Back Link ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-accent transition-colors font-bold text-xs group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* ── Hero Header ───────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 p-8 sm:p-10 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(15,15,25,0.8) 50%, rgba(99,40,210,0.08) 100%)',
            border: '1px solid rgba(124,58,237,0.15)',
          }}
        >
          {/* Decorative corner glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/15 rounded-full blur-[80px]" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-[60px]" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent to-purple-800 flex items-center justify-center shadow-lg shadow-accent/20">
                  <Award className="w-5.5 h-5.5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Endorse Excellence</h1>
                </div>
              </div>
              <p className="text-white/35 font-semibold text-xs tracking-wide ml-14">
                Validate trusted workers with on-chain endorsements on Stellar
              </p>
            </div>

            <div className="ml-14 md:ml-0">
              {isConnected ? (
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-3 bg-accent/10 border border-accent/20 px-5 py-3 rounded-2xl"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent mb-0.5 leading-none">Endorser</span>
                    <span className="text-sm font-mono font-bold text-white/80">{truncateAddress(walletAddress)}</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-purple-700 flex items-center justify-center shadow-lg shadow-accent/25">
                    <ShieldCheck className="w-4.5 h-4.5 text-white" />
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={connect}
                  className="group px-6 py-3.5 bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] transition-all flex items-center gap-2.5 shadow-xl shadow-accent/30 active:scale-95"
                >
                  <Wallet className="w-4 h-4 group-hover:rotate-[-8deg] transition-transform" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Step Progress Indicator ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-10 flex items-center justify-center gap-0"
        >
          {STEPS.map((step, i) => {
            const stepNum = i + 1;
            const isActive = currentStep >= stepNum;
            const isCurrent = currentStep === stepNum;
            const Icon = step.icon;
            
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className="w-12 sm:w-20 h-[2px] relative mx-1">
                    <div className="absolute inset-0 bg-white/5 rounded-full" />
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-purple-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: isActive ? '100%' : '0%' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                )}
                <motion.div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    isCurrent
                      ? 'bg-accent/15 border border-accent/30 shadow-lg shadow-accent/10'
                      : isActive
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-transparent border border-transparent'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? 'bg-accent text-white shadow-md shadow-accent/30'
                      : isActive
                        ? 'bg-accent/20 text-accent'
                        : 'bg-white/5 text-white/20'
                  }`}>
                    {isActive && !isCurrent ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                    isCurrent ? 'text-white' : isActive ? 'text-white/50' : 'text-white/20'
                  }`}>
                    {step.label}
                  </span>
                </motion.div>
              </React.Fragment>
            );
          })}
        </motion.div>

        {/* ── Main Content Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* ── Left Column: Search & Worker Card ─────────────── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4 text-accent/60" />
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Find Worker by Address
                </label>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Enter Stellar address (G...)" 
                    value={workerSearch}
                    onChange={(e) => setWorkerSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent/40 focus:bg-white/[0.06] transition-all font-medium text-white placeholder:text-white/15"
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={isSearching || !workerSearch}
                  className="group px-4 bg-gradient-to-br from-accent to-purple-700 text-white rounded-xl hover:shadow-lg hover:shadow-accent/20 active:scale-95 transition-all disabled:opacity-30 disabled:hover:shadow-none"
                >
                  {isSearching ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Search className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />}
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400/80 text-[10px] mt-3 font-bold flex items-center gap-1.5 bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10"
                >
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
                </motion.p>
              )}
            </motion.div>

            {/* Worker Card — appears after search */}
            <AnimatePresence mode="wait">
              {foundWorker && (
                <motion.div
                  key="worker-card"
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 15 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative overflow-hidden rounded-2xl"
                  style={{
                    background: 'linear-gradient(145deg, rgba(124,58,237,0.1) 0%, rgba(15,15,25,0.6) 100%)',
                    border: '1px solid rgba(124,58,237,0.15)',
                  }}
                >
                  {/* Shimmer effect on top */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent)',
                    }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  <div className="p-6">
                    {/* Worker Header */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-purple-800/30 flex items-center justify-center border border-accent/15 relative">
                        <User className="w-7 h-7 text-accent" />
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0a0f] flex items-center justify-center">
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black truncate">{foundWorker.name}</h3>
                        <div className="flex items-center gap-1.5 text-white/35 text-[11px] font-semibold">
                          <MapPin className="w-3 h-3" /> {foundWorker.city}
                        </div>
                      </div>
                    </div>

                    {/* Worker Details */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center p-3 bg-white/[0.04] rounded-xl border border-white/[0.04]">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">Primary Skill</span>
                        <span className="text-xs font-bold text-accent">{foundWorker.skill}</span>
                      </div>
                      <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.04]">
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25 mb-1.5">Bio</p>
                        <p className="text-[11px] text-white/50 leading-relaxed">{foundWorker.bio}</p>
                      </div>
                    </div>

                    {/* Address footer */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                      <Hash className="w-3 h-3 text-white/15" />
                      <span className="text-[9px] font-mono text-white/15 truncate">{foundWorker.address}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state when no worker found */}
            {!foundWorker && !isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-8 rounded-2xl border border-dashed border-white/[0.06] flex flex-col items-center justify-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-white/10" />
                </div>
                <p className="text-white/15 text-xs font-bold uppercase tracking-wider mb-1">No Worker Selected</p>
                <p className="text-white/10 text-[11px]">Search by Stellar address above</p>
              </motion.div>
            )}
          </div>

          {/* ── Right Column: Endorsement Form ────────────────── */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Locked overlay when no worker found */}
              <AnimatePresence>
                {!foundWorker && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0a0a0f]/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl gap-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <Search className="w-5 h-5 text-white/15" />
                    </div>
                    <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[9px]">Search a Worker First</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-8 sm:p-10">
                {/* Form Header */}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.06]">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/10">
                    <FileCheck className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight">New Endorsement</h2>
                    <p className="text-[10px] text-white/25 font-semibold mt-0.5">All fields are required</p>
                  </div>
                </div>

                <div className="space-y-7">
                  
                  {/* ── Star Rating ──────────────────────────── */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/80 flex items-center gap-1.5">
                        <Star className="w-3 h-3" /> Reliability & Proficiency
                      </label>
                      <AnimatePresence mode="wait">
                        {activeStarValue > 0 && (
                          <motion.span
                            key={activeStarValue}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="text-[10px] font-bold text-amber-400/80 bg-amber-400/10 px-2.5 py-1 rounded-md"
                          >
                            {ratingLabels[activeStarValue]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex gap-1.5 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] w-fit">
                      {[1, 2, 3, 4, 5].map((s) => {
                        const isActive = activeStarValue >= s;
                        return (
                          <button
                            key={s}
                            onClick={() => setRating(s)}
                            onMouseEnter={() => setHoveredStar(s)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="group p-1.5 rounded-lg hover:bg-amber-400/5 transition-all active:scale-90"
                          >
                            <Star 
                              className={`w-8 h-8 transition-all duration-200 ${
                                isActive 
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                                  : 'text-white/10 group-hover:text-white/20'
                              }`} 
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Job Type Dropdown ─────────────────────── */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35 flex items-center gap-1.5 mb-3">
                      <Briefcase className="w-3 h-3" /> Job Specification
                    </label>
                    <div className="relative">
                      <select 
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl py-3.5 pl-4 pr-10 text-white text-sm appearance-none focus:outline-none focus:border-accent/30 focus:bg-white/[0.06] transition-all font-medium cursor-pointer"
                      >
                        <option value="" disabled>Select type of work...</option>
                        <option value="One-time Job" className="bg-[#0f1016]">One-time Job</option>
                        <option value="Recurring" className="bg-[#0f1016]">Recurring</option>
                        <option value="Contract" className="bg-[#0f1016]">Contract</option>
                        <option value="Freelance Project" className="bg-[#0f1016]">Freelance Project</option>
                        <option value="Full-time" className="bg-[#0f1016]">Full-time</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      
                      {/* Selected badge */}
                      {jobType && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center shadow-md shadow-accent/30"
                        >
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* ── Review Textarea ───────────────────────── */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35 flex items-center gap-1.5">
                        <PenLine className="w-3 h-3" /> Verified Review
                      </label>
                      <div className="flex items-center gap-2">
                        {feedback.length >= 20 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                          </motion.div>
                        )}
                        <span className={`text-[10px] font-bold tracking-wider tabular-nums ${
                          feedback.length >= 20 ? 'text-green-400/50' : feedback.length > 0 ? 'text-amber-400/50' : 'text-white/15'
                        }`}>
                          {feedback.length} / 300
                        </span>
                      </div>
                    </div>
                    <textarea 
                      value={feedback}
                      onChange={(e) => e.target.value.length <= 300 && setFeedback(e.target.value)}
                      placeholder="Describe the quality of work, professionalism, and reliability..."
                      className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 text-white text-sm focus:outline-none focus:border-accent/30 focus:bg-white/[0.06] transition-all font-medium min-h-[130px] resize-none placeholder:text-white/12 leading-relaxed"
                    />
                    {feedback.length > 0 && feedback.length < 20 && (
                      <motion.p
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-amber-400/50 text-[10px] font-semibold mt-2 flex items-center gap-1.5"
                      >
                        <Zap className="w-3 h-3" /> {20 - feedback.length} more characters needed
                      </motion.p>
                    )}
                  </div>

                  {/* ── Submit Button / Success State ─────────── */}
                  <div className="pt-2">
                    <AnimatePresence mode="wait">
                      {isSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-2xl overflow-hidden"
                          style={{
                            background: 'linear-gradient(145deg, rgba(34,197,94,0.1) 0%, rgba(15,15,25,0.6) 100%)',
                            border: '1px solid rgba(34,197,94,0.2)',
                          }}
                        >
                          <div className="p-6">
                            <div className="flex items-center gap-3 mb-5">
                              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">Endorsement Recorded</h4>
                                <p className="text-[10px] text-green-400/50 font-semibold">Permanently sealed on Stellar</p>
                              </div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/[0.04] space-y-3">
                              <div className="flex items-center gap-2">
                                <Hash className="w-3 h-3 text-white/15" />
                                <span className="text-[10px] font-mono text-white/30 truncate">{txHash}</span>
                              </div>
                              <a 
                                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-accent hover:text-white bg-accent/10 hover:bg-accent/20 py-2.5 rounded-lg transition-all"
                              >
                                <ExternalLink className="w-3 h-3" /> View on Stellar Explorer
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="submit"
                          onClick={handleEndorse}
                          disabled={!canSubmit || isSigning}
                          className="group w-full relative overflow-hidden py-5 text-white rounded-2xl font-black uppercase tracking-[0.25em] text-[11px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:cursor-not-allowed"
                          style={{
                            background: canSubmit 
                              ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)'
                              : 'rgba(255,255,255,0.04)',
                            border: canSubmit ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.06)',
                            boxShadow: canSubmit ? '0 8px 32px rgba(124,58,237,0.25), 0 0 0 1px rgba(124,58,237,0.1)' : 'none',
                          }}
                          whileHover={canSubmit ? { scale: 1.01, boxShadow: '0 12px 40px rgba(124,58,237,0.35)' } : {}}
                          whileTap={canSubmit ? { scale: 0.98 } : {}}
                        >
                          {/* Animated shimmer for active state */}
                          {canSubmit && (
                            <motion.div
                              className="absolute inset-0 opacity-30"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                              }}
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                            />
                          )}
                          
                          <span className="relative z-10 flex items-center gap-3">
                            {isSigning ? (
                              <>
                                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                Signing on Freighter...
                              </>
                            ) : canSubmit ? (
                              <>
                                Sign & Seal Endorsement
                                <ShieldCheck className="w-4.5 h-4.5 group-hover:rotate-[10deg] transition-transform" />
                              </>
                            ) : (
                              <>
                                <span className="text-white/25">Complete All Fields</span>
                              </>
                            )}
                          </span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Footer Trust Indicator ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-6 text-white/15"
        >
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" /> On-Chain Verified
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Permanent Record
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Stellar Testnet
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Endorse;
