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
    const today = new Date().toISOString().slice(0, 10);
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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background pt-[100px] flex items-center justify-center px-6 relative overflow-hidden text-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-md p-10 rounded-[20px] relative overflow-hidden shadow-lg"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
            <Award className="w-7 h-7 text-[#1E3A8A]" />
          </div>
          <h2 className="text-3xl mb-2 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Endorse Workers</h2>
          <p className="mb-6 text-sm" style={{ color: '#6B7280', fontWeight: 400 }}>Connect your Freighter wallet to write on-chain endorsements.</p>
          <button onClick={connect} className="w-full">
            <div className="shiny-border">
              <div className="shiny-border-inner w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white flex items-center justify-center gap-2.5">
                <Wallet className="w-4 h-4" /> Connect Freighter
              </div>
            </div>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-16 py-5 px-4 sm:px-6 relative overflow-hidden text-gray-900 flex flex-col">
      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col h-full">
        
        {/* ── Header ────────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-4 p-4 sm:p-5 rounded-[20px] relative overflow-hidden shrink-0 shadow-sm"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                <Award className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Endorse Excellence</h1>
                <p className="hidden sm:block" style={{ color: '#6B7280', fontSize: '12px', fontWeight: 400 }}>Validate trusted workers on Stellar</p>
              </div>
            </div>

            {/* Step Progress */}
            <div className="hidden md:flex items-center gap-0">
              {STEPS.map((step, i) => {
                const stepNum = i + 1;
                const isActive = currentStep >= stepNum;
                const isCurrent = currentStep === stepNum;
                const Icon = step.icon;
                return (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="w-8 h-[2px] relative mx-1">
                        <div className="absolute inset-0 rounded-full" style={{ background: '#F3F4F6' }} />
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ background: '#1E3A8A' }}
                          initial={{ width: '0%' }}
                          animate={{ width: isActive ? '100%' : '0%' }}
                          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        />
                      </div>
                    )}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                      isCurrent ? 'text-white' : isActive ? 'text-[#4B5563]' : 'text-[#9CA3AF]'
                    }`} style={{ background: isCurrent ? '#1E3A8A' : 'transparent', border: isCurrent ? '1px solid #1E3A8A' : '1px solid transparent' }}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isCurrent ? 'bg-white text-[#1E3A8A]' : isActive ? 'bg-[#EFF6FF] text-[#1E3A8A]' : 'bg-[#F9FAFB] text-[#9CA3AF]'
                      }`}>
                        {isActive && !isCurrent ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                      </div>
                      {step.label}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Wallet badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
              <span className="font-mono text-[10px] font-bold" style={{ color: '#4B5563' }}>{truncAddr(walletAddress)}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Main Layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 pb-6">
          
          {/* Left Column: Search & Worker Info */}
          <div className="lg:col-span-4 space-y-4 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="p-5 rounded-[20px] shrink-0 shadow-sm"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4" style={{ color: '#1E3A8A' }} />
                <label className="label-mono font-bold text-gray-500">Find Worker</label>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Stellar address (G...)" 
                  value={workerSearch}
                  onChange={(e) => setWorkerSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded-xl py-2.5 px-3 text-xs transition-all text-gray-900 border focus:outline-none"
                  style={{ background: '#F9FAFB', borderColor: '#E5E7EB', fontFamily: '"Inter", sans-serif' }}
                  onFocus={e => e.target.style.borderColor = '#1E3A8A'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <button 
                  onClick={handleSearch}
                  disabled={isSearching || !workerSearch}
                  className="px-4 rounded-xl transition-all disabled:opacity-30 flex items-center justify-center active:scale-95 shrink-0 hover:bg-blue-100"
                  style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-[#1E3A8A]" /> : <Search className="w-4 h-4 text-[#1E3A8A]" />}
                </button>
              </div>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] mt-2 font-bold flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border" style={{ background: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}>
                  <AlertCircle className="w-3 h-3 shrink-0" /> {error}
                </motion.p>
              )}
            </motion.div>

            <AnimatePresence mode="wait">
              {foundWorker ? (
                <motion.div
                  key="worker-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="rounded-[20px] relative overflow-hidden flex-1 shadow-sm"
                  style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center relative shrink-0" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                        <User className="w-5 h-5 text-[#1E3A8A]" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#10B981', border: '2px solid #FFFFFF' }}>
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg truncate text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>{foundWorker.name}</h3>
                        <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color: '#6B7280' }}>
                          <MapPin className="w-2.5 h-2.5" /> {foundWorker.city}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                        <span className="label-mono font-bold text-gray-500">Skill</span>
                        <span className="text-[11px] font-bold" style={{ color: '#1E3A8A' }}>{foundWorker.skill}</span>
                      </div>
                      {foundWorker.experience && foundWorker.experience !== '—' && (
                        <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                          <span className="label-mono font-bold text-gray-500">Experience</span>
                          <span className="text-[11px] font-bold" style={{ color: '#10B981' }}>{foundWorker.experience}</span>
                        </div>
                      )}
                      {foundWorker.bio && (
                        <div className="p-3 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                          <p className="label-mono mb-1.5 font-bold text-gray-500">Bio</p>
                          <p className="text-[10px] leading-relaxed font-medium" style={{ color: '#4B5563' }}>{foundWorker.bio}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 flex items-center gap-1.5" style={{ borderTop: '1px solid #E5E7EB' }}>
                      <Hash className="w-3 h-3" style={{ color: '#6B7280' }} />
                      <span className="text-[9px] font-mono font-bold truncate" style={{ color: '#6B7280' }}>{foundWorker.address}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-[20px] flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50"
                  style={{ border: '1px dashed #E5E7EB' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="label-mono font-bold mb-1 text-gray-600">No Worker Selected</p>
                  <p className="text-[10px]" style={{ color: '#9CA3AF', fontWeight: 400 }}>Search by address above</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-8 flex flex-col h-[526px] xl:h-auto overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="relative rounded-[20px] h-full flex flex-col shadow-sm"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
            >
              <AnimatePresence>
                {!foundWorker && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[20px] gap-3 backdrop-blur-md"
                    style={{ background: 'rgba(255,255,255,0.8)' }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="label-mono font-bold text-gray-600">Search a Worker First</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-5 sm:p-7 flex flex-col h-full overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                    <FileCheck className="w-5 h-5 text-[#1E3A8A]" />
                  </div>
                  <div>
                    <h2 className="text-xl text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Write Endorsement</h2>
                    <p className="text-[10px] font-medium" style={{ color: '#6B7280' }}>All fields required</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 min-h-0">
                  
                  {/* Rating */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="label-mono font-bold text-gray-500 flex items-center gap-1.5"><Star className="w-3.5 h-3.5" style={{ color: '#EA580C' }}/> Rating</label>
                      <AnimatePresence mode="wait">
                        {activeStarValue > 0 && (
                          <motion.span
                            key={activeStarValue}
                            initial={{ opacity: 0, y: -3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: '#FFF7ED', color: '#EA580C' }}
                          >
                            {ratingLabels[activeStarValue]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex gap-1 p-2 rounded-xl w-fit border" style={{ background: '#F9FAFB', borderColor: '#E5E7EB' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoveredStar(s)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="p-1.5 rounded-lg transition-all active:scale-90 hover:bg-white"
                        >
                          <Star className={`w-6 h-6 transition-all ${
                            activeStarValue >= s 
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]' 
                              : 'text-gray-300 hover:text-gray-400'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="label-mono font-bold text-gray-500 flex items-center gap-1.5 mb-2.5">
                      <Briefcase className="w-3.5 h-3.5" style={{ color: '#1E3A8A' }} /> Job Type
                    </label>
                    <div className="relative">
                      <select 
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full rounded-xl py-3 pl-4 pr-10 text-gray-900 border text-xs appearance-none transition-all cursor-pointer font-bold focus:outline-none"
                        style={{ background: '#F9FAFB', borderColor: '#E5E7EB' }}
                        onFocus={e => e.target.style.borderColor = '#1E3A8A'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                      >
                        <option value="" disabled>Select type...</option>
                        <option value="One-time Job" className="bg-white">One-time Job</option>
                        <option value="Recurring" className="bg-white">Recurring</option>
                        <option value="Contract" className="bg-white">Contract</option>
                        <option value="Freelance" className="bg-white">Freelance</option>
                        <option value="Full-time" className="bg-white">Full-time</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#6B7280' }} />
                    </div>
                  </div>

                  {/* Review Textarea */}
                  <div className="sm:col-span-2 flex flex-col mb-4">
                    <div className="flex justify-between items-center mb-2.5">
                      <label className="label-mono font-bold text-gray-500 flex items-center gap-1.5">
                        <PenLine className="w-3.5 h-3.5" style={{ color: '#10B981' }} /> Review
                      </label>
                      <div className="flex items-center gap-1.5 label-mono shrink-0">
                        {feedback.length >= 20 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: '#D1FAE5' }}>
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#059669]" />
                          </motion.div>
                        )}
                        <span className="font-bold" style={{ color: feedback.length >= 20 ? '#10B981' : feedback.length > 0 ? '#EA580C' : '#9CA3AF' }}>
                          {feedback.length}/300
                        </span>
                      </div>
                    </div>
                    <textarea 
                      value={feedback}
                      onChange={(e) => e.target.value.length <= 300 && setFeedback(e.target.value)}
                      placeholder="Describe work quality, professionalism, and reliability..."
                      className="w-full rounded-xl p-4 text-gray-900 border text-xs transition-all font-medium resize-none flex-1 min-h-[120px] focus:outline-none"
                      style={{ background: '#F9FAFB', borderColor: '#E5E7EB' }}
                      onFocus={e => e.target.style.borderColor = '#1E3A8A'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                    {feedback.length > 0 && feedback.length < 20 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] font-bold flex items-center gap-1 mt-2 mb-0.5" style={{ color: '#EA580C' }}>
                        <Zap className="w-3 h-3" /> {20 - feedback.length} more characters needed
                      </motion.p>
                    )}
                  </div>

                  {/* Submit / Success Area */}
                  <div className="sm:col-span-2 pt-2 pb-1 shrink-0">
                    <AnimatePresence mode="wait">
                      {isSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-[20px] overflow-hidden"
                          style={{ background: '#ECFDF5', border: '1px solid #D1FAE5' }}
                        >
                          <div className="p-5">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[#D1FAE5] shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                              </div>
                              <div>
                                <h4 className="label-mono font-bold" style={{ color: '#059669' }}>Endorsement Recorded</h4>
                                <p className="text-[10px] font-bold" style={{ color: '#10B981' }}>Sealed on Stellar</p>
                              </div>
                            </div>
                            <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                              <div className="flex items-center gap-2">
                                <Hash className="w-3 h-3 text-gray-400" />
                                <span className="text-[10px] font-mono font-bold" style={{ color: '#6B7280' }}>{txHash.slice(0, 10)}...</span>
                              </div>
                              <a 
                                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all label-mono text-[#1E3A8A] font-bold"
                                style={{ background: '#EFF6FF' }}
                              >
                                View Explorer <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="submit"
                          onClick={handleEndorse}
                          disabled={!canSubmit || isSigning}
                          className="w-full disabled:opacity-40"
                        >
                          {canSubmit ? (
                            <div className="shiny-border">
                              <div className="shiny-border-inner w-full py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white flex items-center justify-center gap-2.5">
                                {isSigning ? (
                                  <><Loader2 className="w-4 h-4 animate-spin text-white" /> Signing...</>
                                ) : (
                                  <>Sign & Seal <ShieldCheck className="w-4 h-4" /></>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="w-full py-4 rounded-xl flex items-center justify-center gap-2.5 label-mono font-bold" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#9CA3AF' }}>
                              Complete All Fields
                            </div>
                          )}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Endorse;
