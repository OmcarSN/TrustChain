import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Star, MapPin, Briefcase, Wallet, Loader2, 
  CheckCircle2, ShieldCheck, ChevronDown, User, Hash,
  ExternalLink, AlertCircle, Sparkles, FileCheck, PenLine,
  Send, Award, Zap, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchWorkerCredential, submitWorkerEndorsement } from '../lib/stellar';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

/* ── Step labels ──────────────────────────────────────────────── */
const STEPS = [
  { icon: Search,  label: 'Find' },
  { icon: PenLine, label: 'Review' },
  { icon: Send,    label: 'Seal' },
];

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

  const currentStep = isSuccess ? 3 : (foundWorker ? 2 : 1);
  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Outstanding'];
  const canSubmit = isConnected && foundWorker && rating > 0 && jobType && feedback.length >= 20;
  const activeStarValue = hoveredStar || rating;
  const truncAddr = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-6)}` : "";

  const handleSearch = async () => {
    if (!workerSearch) return;
    if (workerSearch === walletAddress) { toast.error("You cannot endorse yourself."); return; }
    setIsSearching(true); setError(null); setFoundWorker(null);
    try {
      const credential = await fetchWorkerCredential(workerSearch);
      // Merge with localStorage to get real registered info
      const localData = JSON.parse(localStorage.getItem(`trustchain_worker_${workerSearch}`) || 'null');
      if (localData) {
        credential.name = localData.name || localData.fullName || credential.name;
        credential.city = localData.city || credential.city;
        credential.bio = localData.bio || credential.bio;
        credential.skill = localData.skill || localData.skillCategory || credential.skill;
        credential.experience = localData.experience || credential.experience;
        credential.phone = localData.phone || '';
      }
      setFoundWorker({ ...credential, address: workerSearch });
      toast.success('Worker found');
    } catch (err) {
      // Even if on-chain fetch fails, check localStorage
      const localData = JSON.parse(localStorage.getItem(`trustchain_worker_${workerSearch}`) || 'null');
      if (localData) {
        setFoundWorker({
          name: localData.name || localData.fullName || 'Worker',
          skill: localData.skill || localData.skillCategory || '—',
          city: localData.city || 'Unknown',
          bio: localData.bio || '',
          experience: localData.experience || '—',
          address: workerSearch,
        });
        toast.success('Worker found');
      } else {
        setError(err.message || 'Worker not found');
        toast.error(err.message || 'Search failed');
      }
    } finally { setIsSearching(false); }
  };

  const handleEndorse = async () => {
    if (!canSubmit) return;
    const localKey = `endorsements_${foundWorker.address}`;
    const prev = JSON.parse(localStorage.getItem(localKey) || '[]');
    // Duplicate check: same endorser can only endorse the same worker once per day (not forever)
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    if (prev.some(e => e.endorser === walletAddress && e.timestamp && e.timestamp.slice(0, 10) === today)) {
      toast.error("You've already endorsed this worker today. Try again tomorrow.");
      return;
    }
    setIsSigning(true); setError(null);
    try {
      const response = await submitWorkerEndorsement({ worker: foundWorker.address, rating, jobType, feedback }, walletAddress);
      const hash = response.hash;
      setTxHash(hash); setIsSuccess(true);
      localStorage.setItem(localKey, JSON.stringify([...prev, { endorser: walletAddress, worker: foundWorker.address, rating, jobType, feedback, txHash: hash, timestamp: new Date().toISOString() }]));
      toast.success('Endorsement sealed');
    } catch (err) {
      setError(err.message || 'Transaction failed');
      toast.error(err.message || 'Submission failed');
    } finally { setIsSigning(false); }
  };

  /* ── Not connected ──────────────────────────────────────────── */
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[150px] -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md p-10 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(255,255,255,0.03) 60%, rgba(124,58,237,0.04) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-800/20 border border-accent/15 flex items-center justify-center mx-auto mb-5">
            <Award className="w-7 h-7 text-accent" />
          </div>
          <h2 className="text-2xl font-black mb-2 tracking-tight">Endorse Workers</h2>
          <p className="text-white/30 mb-6 text-sm font-medium">Connect your Freighter wallet to write on-chain endorsements.</p>
          <button onClick={connect} className="group w-full py-4 bg-gradient-to-r from-accent to-purple-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-accent/25 active:scale-[0.98]">
            <Wallet className="w-4 h-4" /> Connect Freighter
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── Main Page ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background pt-20 pb-6 px-4 sm:px-6 relative overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/6 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 left-10 w-[300px] h-[300px] bg-purple-900/8 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* ── Compact Header Row ────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 sm:p-5 rounded-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(15,15,25,0.7) 50%, rgba(99,40,210,0.06) 100%)',
            border: '1px solid rgba(124,58,237,0.12)',
          }}
        >
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-accent/12 rounded-full blur-[60px]" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-purple-800 flex items-center justify-center shadow-lg shadow-accent/20">
                <Award className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight leading-tight">Endorse Excellence</h1>
                <p className="text-white/30 text-[10px] font-semibold hidden sm:block">Validate trusted workers on Stellar</p>
              </div>
            </div>

            {/* Step Progress — inline in header */}
            <div className="hidden md:flex items-center gap-0">
              {STEPS.map((step, i) => {
                const stepNum = i + 1;
                const isActive = currentStep >= stepNum;
                const isCurrent = currentStep === stepNum;
                const Icon = step.icon;
                return (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="w-8 h-[2px] relative mx-0.5">
                        <div className="absolute inset-0 bg-white/5 rounded-full" />
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-purple-500 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: isActive ? '100%' : '0%' }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    )}
                    <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                      isCurrent ? 'bg-accent/15 border border-accent/25 text-white' : isActive ? 'text-white/40' : 'text-white/15'
                    }`}>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        isCurrent ? 'bg-accent text-white' : isActive ? 'bg-accent/20 text-accent' : 'bg-white/5 text-white/15'
                      }`}>
                        {isActive && !isCurrent ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Icon className="w-2.5 h-2.5" />}
                      </div>
                      {step.label}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Wallet badge */}
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              <span className="font-mono text-[10px] text-white/40">{truncAddr(walletAddress)}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Main 2-Column Grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* ── Left: Search + Worker Card ──────────────────────── */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <Search className="w-3.5 h-3.5 text-accent/60" />
                <label className="text-[9px] font-black uppercase tracking-[0.15em] text-white/35">Find Worker</label>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Stellar address (G...)" 
                  value={workerSearch}
                  onChange={(e) => setWorkerSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-accent/30 transition-all font-medium text-white placeholder:text-white/15"
                />
                <button 
                  onClick={handleSearch}
                  disabled={isSearching || !workerSearch}
                  className="px-3 bg-gradient-to-br from-accent to-purple-700 text-white rounded-lg hover:shadow-lg hover:shadow-accent/20 active:scale-95 transition-all disabled:opacity-30 shrink-0"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-400/80 text-[10px] mt-2 font-bold flex items-center gap-1.5 bg-red-500/5 px-2.5 py-1.5 rounded-lg border border-red-500/10"
                >
                  <AlertCircle className="w-3 h-3 shrink-0" /> {error}
                </motion.p>
              )}
            </motion.div>

            {/* Worker Card */}
            <AnimatePresence mode="wait">
              {foundWorker ? (
                <motion.div
                  key="worker-card"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(15,15,25,0.5) 100%)',
                    border: '1px solid rgba(124,58,237,0.12)',
                  }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/25 to-purple-800/25 flex items-center justify-center border border-accent/12 relative shrink-0">
                        <User className="w-5 h-5 text-accent" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-[2px] border-[#0a0a0f] flex items-center justify-center">
                          <CheckCircle2 className="w-2 h-2 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black truncate">{foundWorker.name}</h3>
                        <div className="flex items-center gap-1 text-white/30 text-[10px] font-semibold">
                          <MapPin className="w-2.5 h-2.5" /> {foundWorker.city}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.03]">
                        <span className="text-[8px] font-black uppercase tracking-wider text-white/20">Skill</span>
                        <span className="text-[11px] font-bold text-accent">{foundWorker.skill}</span>
                      </div>
                      {foundWorker.experience && foundWorker.experience !== '—' && (
                        <div className="flex justify-between items-center p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.03]">
                          <span className="text-[8px] font-black uppercase tracking-wider text-white/20">Experience</span>
                          <span className="text-[11px] font-bold text-emerald-400">{foundWorker.experience}</span>
                        </div>
                      )}
                      {foundWorker.bio && (
                        <div className="p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.03]">
                          <p className="text-[8px] font-black uppercase tracking-wider text-white/20 mb-1">Bio</p>
                          <p className="text-[10px] text-white/40 leading-relaxed">{foundWorker.bio}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5">
                      <Hash className="w-2.5 h-2.5 text-white/10" />
                      <span className="text-[8px] font-mono text-white/10 truncate">{foundWorker.address}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-xl border border-dashed border-white/[0.05] flex flex-col items-center justify-center text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center mb-2">
                    <User className="w-5 h-5 text-white/8" />
                  </div>
                  <p className="text-white/12 text-[10px] font-bold uppercase tracking-wider">No Worker Selected</p>
                  <p className="text-white/8 text-[9px] mt-0.5">Search by address above</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Endorsement Form ─────────────────────────── */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative rounded-xl overflow-hidden h-full"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Locked overlay */}
              <AnimatePresence>
                {!foundWorker && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0a0a0f]/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl gap-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <Search className="w-5 h-5 text-white/12" />
                    </div>
                    <p className="text-white/15 font-black uppercase tracking-[0.2em] text-[8px]">Search a Worker First</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-5 sm:p-6">
                {/* Form Header */}
                <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/[0.05]">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/10">
                    <FileCheck className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-base font-black tracking-tight">Write Endorsement</h2>
                    <p className="text-[9px] text-white/20 font-semibold">All fields required</p>
                  </div>
                </div>

                {/* Form Fields — 2 columns on large screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* ── Star Rating ──────────────────────────────── */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.15em] text-accent/70 flex items-center gap-1">
                        <Star className="w-3 h-3" /> Rating
                      </label>
                      <AnimatePresence mode="wait">
                        {activeStarValue > 0 && (
                          <motion.span
                            key={activeStarValue}
                            initial={{ opacity: 0, y: -3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] font-bold text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded"
                          >
                            {ratingLabels[activeStarValue]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex gap-1 p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04] w-fit">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoveredStar(s)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="p-1 rounded hover:bg-amber-400/5 transition-all active:scale-90"
                        >
                          <Star className={`w-6 h-6 transition-all ${
                            activeStarValue >= s 
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' 
                              : 'text-white/10 hover:text-white/20'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Job Type ─────────────────────────────────── */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30 flex items-center gap-1 mb-2">
                      <Briefcase className="w-3 h-3" /> Job Type
                    </label>
                    <div className="relative">
                      <select 
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg py-2.5 pl-3 pr-9 text-white text-xs appearance-none focus:outline-none focus:border-accent/30 transition-all font-medium cursor-pointer"
                      >
                        <option value="" disabled>Select type...</option>
                        <option value="One-time Job" className="bg-[#0f1016]">One-time Job</option>
                        <option value="Recurring" className="bg-[#0f1016]">Recurring</option>
                        <option value="Contract" className="bg-[#0f1016]">Contract</option>
                        <option value="Freelance" className="bg-[#0f1016]">Freelance</option>
                        <option value="Full-time" className="bg-[#0f1016]">Full-time</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15 pointer-events-none" />
                      {jobType && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* ── Review Textarea — full width ─────────────── */}
                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30 flex items-center gap-1">
                        <PenLine className="w-3 h-3" /> Review
                      </label>
                      <div className="flex items-center gap-1.5">
                        {feedback.length >= 20 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="w-3.5 h-3.5 rounded-full bg-green-500/20 flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-2 h-2 text-green-400" />
                          </motion.div>
                        )}
                        <span className={`text-[9px] font-bold tabular-nums ${
                          feedback.length >= 20 ? 'text-green-400/50' : feedback.length > 0 ? 'text-amber-400/50' : 'text-white/12'
                        }`}>
                          {feedback.length}/300
                        </span>
                      </div>
                    </div>
                    <textarea 
                      value={feedback}
                      onChange={(e) => e.target.value.length <= 300 && setFeedback(e.target.value)}
                      placeholder="Describe work quality, professionalism, and reliability..."
                      className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg p-3 text-white text-xs focus:outline-none focus:border-accent/30 transition-all font-medium min-h-[100px] resize-none placeholder:text-white/12 leading-relaxed"
                    />
                    {feedback.length > 0 && feedback.length < 20 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-amber-400/50 text-[9px] font-semibold mt-1.5 flex items-center gap-1"
                      >
                        <Zap className="w-2.5 h-2.5" /> {20 - feedback.length} more characters needed
                      </motion.p>
                    )}
                  </div>

                  {/* ── Submit / Success — full width ──────────────── */}
                  <div className="sm:col-span-2">
                    <AnimatePresence mode="wait">
                      {isSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-xl overflow-hidden"
                          style={{
                            background: 'linear-gradient(145deg, rgba(34,197,94,0.08) 0%, rgba(15,15,25,0.5) 100%)',
                            border: '1px solid rgba(34,197,94,0.15)',
                          }}
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black uppercase tracking-tight">Endorsement Recorded</h4>
                                <p className="text-[9px] text-green-400/50 font-semibold">Sealed on Stellar</p>
                              </div>
                            </div>
                            <div className="bg-black/30 p-3 rounded-lg border border-white/[0.04] space-y-2">
                              <div className="flex items-center gap-1.5">
                                <Hash className="w-2.5 h-2.5 text-white/15" />
                                <span className="text-[9px] font-mono text-white/25 truncate">{txHash}</span>
                              </div>
                              <a 
                                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-accent hover:text-white bg-accent/10 hover:bg-accent/20 py-2 rounded-lg transition-all"
                              >
                                <ExternalLink className="w-3 h-3" /> View on Explorer
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="submit"
                          onClick={handleEndorse}
                          disabled={!canSubmit || isSigning}
                          className="group w-full relative overflow-hidden py-4 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:cursor-not-allowed"
                          style={{
                            background: canSubmit 
                              ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)'
                              : 'rgba(255,255,255,0.03)',
                            border: canSubmit ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.05)',
                            boxShadow: canSubmit ? '0 6px 24px rgba(124,58,237,0.2)' : 'none',
                          }}
                          whileHover={canSubmit ? { scale: 1.01 } : {}}
                          whileTap={canSubmit ? { scale: 0.98 } : {}}
                        >
                          {canSubmit && (
                            <motion.div
                              className="absolute inset-0 opacity-25"
                              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-2.5">
                            {isSigning ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Signing on Freighter...</>
                            ) : canSubmit ? (
                              <>Sign & Seal Endorsement <ShieldCheck className="w-4 h-4 group-hover:rotate-[10deg] transition-transform" /></>
                            ) : (
                              <span className="text-white/20">Complete All Fields</span>
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

        {/* ── Footer Badges ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-5 flex items-center justify-center gap-4 text-white/10"
        >
          {[
            { icon: ShieldCheck, text: 'On-Chain Verified' },
            { icon: Clock, text: 'Permanent Record' },
            { icon: Sparkles, text: 'Stellar Testnet' },
          ].map((badge, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-0.5 h-0.5 rounded-full bg-white/8" />}
              <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider">
                <badge.icon className="w-2.5 h-2.5" /> {badge.text}
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Endorse;
