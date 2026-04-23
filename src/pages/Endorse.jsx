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
import { useTranslation } from 'react-i18next';

const STEPS = [
  { icon: Search,  label: 'endorse.step1' },
  { icon: PenLine, label: 'endorse.step2' },
  { icon: Send,    label: 'endorse.step3' },
];

const Endorse = () => {
  const toast = useToast();
  const { walletAddress, isConnected, connect } = useWallet();
  const { t } = useTranslation();

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
  const ratingLabels = ['', t('endorse.ratingPoor'), t('endorse.ratingFair'), t('endorse.ratingGood'), t('endorse.ratingGreat'), t('endorse.ratingOutstanding')];
  const canSubmit = isConnected && foundWorker && rating > 0 && jobType && feedback.length >= 20;
  const activeStarValue = hoveredStar || rating;
  const truncAddr = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-6)}` : "";

  const handleSearch = async () => {
    if (!workerSearch) return;
    if (workerSearch === walletAddress) { toast.error(t('endorse.cannotEndorseSelf')); return; }
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
      toast.success(t('endorse.workerFound'));
    } catch (err) {
      const localData = JSON.parse(localStorage.getItem(`trustchain_worker_${workerSearch}`) || 'null');
      if (localData) {
        setFoundWorker({ name: localData.name || localData.fullName || 'Worker', skill: localData.skill || localData.skillCategory || '—', city: localData.city || 'Unknown', bio: localData.bio || '', experience: localData.experience || '—', address: workerSearch });
        toast.success(t('endorse.workerFound'));
      } else { setError(err.message || 'Worker not found'); toast.error(err.message || 'Search failed'); }
    } finally { setIsSearching(false); }
  };

  const handleEndorse = async () => {
    if (!canSubmit) return;
    const localKey = `endorsements_${foundWorker.address}`;
    const prev = JSON.parse(localStorage.getItem(localKey) || '[]');
    if (prev.some(e => e.endorser === walletAddress)) { toast.error(t('endorse.alreadyEndorsed')); return; }
    setIsSigning(true); setError(null);
    try {
      const response = await submitWorkerEndorsement({ worker: foundWorker.address, rating, jobType, feedback }, walletAddress);
      const hash = response.hash;
      setTxHash(hash); setIsSuccess(true);
      localStorage.setItem(localKey, JSON.stringify([...prev, { endorser: walletAddress, worker: foundWorker.address, rating, jobType, feedback, txHash: hash, timestamp: new Date().toISOString() }]));
      toast.success(t('endorse.endorsementSealed'));
    } catch (err) { setError(err.message || 'Transaction failed'); toast.error(err.message || 'Submission failed'); }
    finally { setIsSigning(false); }
  };

  /* Not connected */
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 flex items-center justify-center relative overflow-hidden text-white">
        <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-14 h-14 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Award className="w-7 h-7 text-white/30" />
          </div>
          <h2 className="font-clash text-3xl font-bold mb-3 tracking-tighter">{t('endorse.headerTitle')}</h2>
          <p className="text-white/30 mb-8 text-sm font-inter font-light">{t('endorse.headerSubtitle')}</p>
          <button onClick={connect} className="w-full py-4 bg-white text-black rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] hover:opacity-85 transition-opacity flex items-center justify-center gap-2">
            <Wallet className="w-4 h-4" /> {t('dashboard.connectBtn')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
      {/* Light leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '20%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-4 border border-white/[0.07] rounded-[2px] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-white/40" />
              </div>
              <div>
                <h1 className="font-clash text-lg font-bold tracking-tighter">{t('endorse.headerTitle')}</h1>
                <p className="text-[9px] text-white/25 font-inter hidden sm:block">{t('endorse.headerSubtitle')}</p>
              </div>
            </div>

            {/* Steps */}
            <div className="hidden md:flex items-center gap-0">
              {STEPS.map((step, i) => {
                const stepNum = i + 1;
                const isActive = currentStep >= stepNum;
                const isCurrent = currentStep === stepNum;
                const Icon = step.icon;
                return (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="w-8 h-px relative mx-0.5 bg-white/5">
                        <motion.div className="absolute inset-y-0 left-0 bg-white/40" initial={{ width: '0%' }} animate={{ width: isActive ? '100%' : '0%' }} transition={{ duration: 0.4 }} />
                      </div>
                    )}
                    <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[2px] text-[8px] font-bold uppercase tracking-wider transition-all ${
                      isCurrent ? 'bg-white text-black' : isActive ? 'text-white/40' : 'text-white/15'
                    }`}>
                      <div className={`w-4 h-4 rounded-[2px] flex items-center justify-center ${
                        isCurrent ? 'bg-black text-white' : isActive ? 'bg-white/20 text-white/60' : 'bg-white/5 text-white/15'
                      }`}>
                        {isActive && !isCurrent ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Icon className="w-2.5 h-2.5" />}
                      </div>
                      {t(step.label)}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Wallet badge */}
            <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-[2px]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="font-mono text-[10px] text-white/40">{truncAddr(walletAddress)}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* Left: Search + Worker Card */}
          <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-28">
            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="p-4 border border-white/[0.07] rounded-[2px] bg-white/[0.02]">
              <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30 flex items-center gap-1 mb-3 font-inter">
                <Search className="w-3 h-3" /> {t('endorse.findWorkerLabel')}
              </label>
              <div className="flex gap-2">
                <input type="text" placeholder={t('dashboard.searchPlaceholder')} value={workerSearch}
                  onChange={(e) => setWorkerSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-transparent border-0 border-b border-white/20 py-2.5 text-xs focus:outline-none focus:border-white/60 text-white placeholder:text-white/20 font-mono" />
                <button onClick={handleSearch} disabled={isSearching || !workerSearch}
                  className="px-3 bg-white text-black rounded-[2px] hover:opacity-85 transition-all disabled:opacity-30 shrink-0">
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-400/80 text-[10px] mt-2 font-bold flex items-center gap-1.5 border border-red-400/20 px-2.5 py-1.5 rounded-[2px] font-inter">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {error}
                </motion.p>
              )}
            </motion.div>

            {/* Worker Card */}
            <AnimatePresence mode="wait">
              {foundWorker ? (
                <motion.div key="worker-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="border border-white/[0.07] rounded-[2px] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center relative shrink-0">
                      <User className="w-5 h-5 text-white/30" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#050505] flex items-center justify-center">
                        <CheckCircle2 className="w-2 h-2 text-black" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold truncate">{foundWorker.name}</h3>
                      <div className="flex items-center gap-1 text-white/30 text-[10px]"><MapPin className="w-2.5 h-2.5" /> {foundWorker.city}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center p-2.5 border border-white/5 rounded-[2px]">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-white/20 font-inter">{t('endorse.skillLabel')}</span>
                      <span className="text-[11px] font-bold text-white/60">{foundWorker.skill}</span>
                    </div>
                    {foundWorker.experience && foundWorker.experience !== '—' && (
                      <div className="flex justify-between items-center p-2.5 border border-white/5 rounded-[2px]">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-white/20 font-inter">{t('endorse.experienceLabel')}</span>
                        <span className="text-[11px] font-bold text-white/60">{foundWorker.experience}</span>
                      </div>
                    )}
                    {foundWorker.bio && (
                      <div className="p-2.5 border border-white/5 rounded-[2px]">
                        <p className="text-[8px] font-bold uppercase tracking-wider text-white/20 mb-1 font-inter">{t('endorse.bioLabel')}</p>
                        <p className="text-[10px] text-white/30 leading-relaxed font-inter">{foundWorker.bio}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5">
                    <Hash className="w-2.5 h-2.5 text-white/10" />
                    <span className="text-[8px] font-mono text-white/10 truncate">{foundWorker.address}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="p-6 rounded-[2px] border border-dashed border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-[2px] bg-white/[0.03] flex items-center justify-center mb-2">
                    <User className="w-5 h-5 text-white/10" />
                  </div>
                  <p className="text-white/15 text-[10px] font-bold uppercase tracking-wider font-inter">{t('endorse.noWorkerSelected')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="relative border border-white/[0.07] rounded-[2px] bg-white/[0.02] overflow-hidden">
              {/* Locked overlay */}
              <AnimatePresence>
                {!foundWorker && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#050505]/80 z-10 flex flex-col items-center justify-center rounded-[2px] gap-2">
                    <div className="w-10 h-10 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center">
                      <Search className="w-5 h-5 text-white/15" />
                    </div>
                    <p className="text-white/15 font-bold uppercase tracking-[0.2em] text-[8px] font-inter">{t('endorse.findWorkerLabel')}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-5">
                {/* Form Header */}
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5">
                  <div className="w-7 h-7 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center">
                    <FileCheck className="w-3.5 h-3.5 text-white/40" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold tracking-tight font-inter">{t('endorse.formTitle')}</h2>
                    <p className="text-[9px] text-white/20 font-inter">{t('endorse.allFieldsRequired')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Rating */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30 flex items-center gap-1 font-inter">
                        <Star className="w-3 h-3" /> {t('endorse.ratingFieldLabel')}
                      </label>
                      <AnimatePresence mode="wait">
                        {activeStarValue > 0 && (
                          <motion.span key={activeStarValue} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="text-[9px] font-bold text-white/50 border border-white/10 px-2 py-0.5 rounded-[2px]">{ratingLabels[activeStarValue]}</motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex gap-1 p-2.5 border border-white/5 rounded-[2px] w-fit">
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)}
                          className="p-1 rounded-[2px] hover:bg-white/5 transition-all">
                          <Star className={`w-6 h-6 transition-all ${activeStarValue >= s ? 'text-white fill-white' : 'text-white/10'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30 flex items-center gap-1 mb-2 font-inter">
                      <Briefcase className="w-3 h-3" /> {t('jobTypes.label')}
                    </label>
                    <div className="relative">
                      <select value={jobType} onChange={(e) => setJobType(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-white/20 py-2.5 pr-8 text-xs text-white appearance-none focus:outline-none focus:border-white/60 cursor-pointer font-inter">
                        <option value="" disabled>{t('endorse.selectJobType')}</option>
                        <option value="One-time Job" className="bg-[#0a0a0a]">{t('jobTypes.One-time Job')}</option>
                        <option value="Recurring" className="bg-[#0a0a0a]">{t('jobTypes.Recurring')}</option>
                        <option value="Contract" className="bg-[#0a0a0a]">{t('jobTypes.Contract')}</option>
                        <option value="Freelance" className="bg-[#0a0a0a]">{t('jobTypes.Freelance')}</option>
                        <option value="Full-time" className="bg-[#0a0a0a]">{t('jobTypes.Full-time')}</option>
                      </select>
                      <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15 pointer-events-none" />
                    </div>
                  </div>

                  {/* Textarea */}
                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30 flex items-center gap-1 font-inter">
                        <PenLine className="w-3 h-3" /> {t('endorse.reviewLabel')}
                      </label>
                      <span className={`text-[9px] font-bold tabular-nums font-inter ${feedback.length >= 20 ? 'text-green-400/50' : feedback.length > 0 ? 'text-white/30' : 'text-white/15'}`}>
                        {feedback.length}/300
                      </span>
                    </div>
                    <textarea value={feedback} onChange={(e) => e.target.value.length <= 300 && setFeedback(e.target.value)}
                      placeholder={t('endorse.placeholderFeedback')}
                      className="w-full bg-transparent border border-white/10 rounded-[2px] p-3 text-white text-xs focus:outline-none focus:border-white/30 transition-all min-h-[80px] resize-none placeholder:text-white/15 leading-relaxed font-inter" />
                    {feedback.length > 0 && feedback.length < 20 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/30 text-[9px] mt-1.5 flex items-center gap-1 font-inter">
                        <Zap className="w-2.5 h-2.5" /> {20 - feedback.length} {t('endorse.moreCharsNeeded', { count: 20 - feedback.length })}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="sm:col-span-2">
                    <AnimatePresence mode="wait">
                      {isSuccess ? (
                        <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="border border-green-400/15 rounded-[2px] bg-green-400/[0.03] p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-[2px] bg-green-400/10 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold">{t('endorse.endorsementRecorded')}</h4>
                              <p className="text-[9px] text-green-400/50 font-inter">{t('endorse.sealedOnStellar')}</p>
                            </div>
                          </div>
                          <div className="border border-white/5 p-3 rounded-[2px] space-y-2">
                            <div className="flex items-center gap-1.5">
                              <Hash className="w-2.5 h-2.5 text-white/15" />
                              <span className="text-[9px] font-mono text-white/25 truncate">{txHash}</span>
                            </div>
                            <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-white/40 hover:text-white border border-white/10 py-2 rounded-[2px] transition-all">
                              <ExternalLink className="w-3 h-3" /> {t('endorse.viewOnExplorer')}
                            </a>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.button key="submit" onClick={handleEndorse} disabled={!canSubmit || isSigning}
                          className={`w-full py-4 rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] transition-all flex items-center justify-center gap-2.5 ${
                            canSubmit ? 'bg-white text-black hover:opacity-85' : 'bg-white/[0.03] border border-white/5 text-white/20 cursor-not-allowed'
                          }`}>
                          {isSigning ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('registration.btnMinting')}...</>
                            : canSubmit ? <>{t('endorse.btnSubmit')} <ShieldCheck className="w-4 h-4" /></>
                            : <span>{t('endorse.completeAllFields')}</span>}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-white/10">
          {[
            { icon: ShieldCheck, textKey: 'endorse.badgeOnChain' },
            { icon: Clock, textKey: 'endorse.badgePermanent' },
            { icon: Sparkles, textKey: 'endorse.badgeStellar' },
          ].map((badge, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-0.5 h-0.5 rounded-full bg-white/5" />}
              <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider font-inter">
                <badge.icon className="w-2.5 h-2.5" /> {t(badge.textKey)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Endorse;
