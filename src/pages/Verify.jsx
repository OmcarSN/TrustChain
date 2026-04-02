import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Star, MapPin, Briefcase, ShieldCheck, ExternalLink, 
  Share2, Award, User, History, CheckCircle2, Calendar, 
  Loader2, AlertCircle, Fingerprint, Globe, ArrowRight, Sparkles,
  Clock, Target, Zap, Copy, Check
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchWorkerCredential } from '../lib/stellar';
import { calculateScore } from '../lib/reputation';
import { useToast } from '../context/ToastContext';

/* ── Floating Orb ─────────────────────────────────────────────── */
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none -z-10 ${className}`}
    animate={{ y: [0, -15, 0], scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  
  const [workerSearch, setWorkerSearch] = useState(searchParams.get('address') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (searchParams.get('address')) {
      performSearch(searchParams.get('address'));
    }
  }, []);

  const performSearch = async (address) => {
    if (!address) return;
    setIsSearching(true);
    setError(null);
    try {
      const credential = await fetchWorkerCredential(address);
      const localKey = `endorsements_${address}`;
      const endorsements = JSON.parse(localStorage.getItem(localKey) || '[]');
      const reputation = calculateScore(endorsements);
      
      setProfile({ ...credential, address, reputation, endorsements });
      toast.success('Reputation Profile Verified');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Worker not found on-chain');
      toast.error('Verification failed');
      setProfile(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(workerSearch);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/verify?address=${profile.address}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Profile link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : "";

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden text-white">
      {/* ── Background ──────────────────────────────────────── */}
      <FloatingOrb className="w-[800px] h-[500px] bg-accent/5 blur-[160px] top-10 left-1/2 -translate-x-1/2" />
      <FloatingOrb className="w-[400px] h-[400px] bg-purple-800/5 blur-[120px] bottom-40 right-10" delay={3} />
      <FloatingOrb className="w-[300px] h-[300px] bg-indigo-900/5 blur-[100px] top-80 left-10" delay={5} />
      <div className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)`,
          backgroundSize: '70px 70px',
        }}
      />
      
      <div className="max-w-6xl mx-auto">
        {/* ── Hero Search ───────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-accent/8 border border-accent/12 mb-7"
          >
            <Fingerprint className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">On-Chain Verification</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tighter leading-[0.95]"
          >
            Verify Worker<br/>
            <span className="bg-gradient-to-r from-accent via-purple-400 to-accent bg-clip-text text-transparent">Reputation</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-white/25 font-medium text-base sm:text-lg mb-10 max-w-xl mx-auto"
          >
            Search any Stellar address to audit on-chain credentials and reputation
          </motion.p>
          
          {/* Search Bar */}
          <motion.form 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearchSubmit}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <Search className="w-4 h-4 text-white/25" />
              </div>
              <input 
                type="text" 
                placeholder="Enter Stellar Address (G...)" 
                value={workerSearch}
                onChange={(e) => setWorkerSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl py-5 pl-18 pr-36 text-white font-medium tracking-tight transition-all focus:border-accent/25 focus:outline-none focus:bg-white/[0.05] focus:shadow-[0_0_50px_rgba(124,58,237,0.06)] text-sm placeholder:text-white/12"
                style={{ paddingLeft: '4.2rem' }}
              />
              <button 
                type="submit"
                disabled={isSearching || !workerSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-accent to-purple-700 text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] hover:from-accent-hover hover:to-purple-800 active:scale-95 transition-all shadow-lg shadow-accent/15 disabled:opacity-30 flex items-center gap-2"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Globe className="w-3.5 h-3.5" /> Search</>}
              </button>
            </div>
          </motion.form>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: 8 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="mt-5 text-red-400/80 font-semibold text-xs flex items-center justify-center gap-2 bg-red-500/5 border border-red-500/10 px-4 py-2.5 rounded-xl w-fit mx-auto"
              >
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ── Results ────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {(isSearching || profile) && (
            <motion.div
              key={isSearching ? 'loading' : profile?.address}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
            >
              {/* Verified Banner */}
              {!isSearching && profile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8 p-4 rounded-xl flex items-center justify-between"
                  style={{
                    background: 'linear-gradient(145deg, rgba(34,197,94,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(34,197,94,0.1)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-500/12 flex items-center justify-center">
                      <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-green-400">Ledger Verified</p>
                      <p className="text-[10px] font-medium text-green-400/35">Credential confirmed on Stellar Testnet</p>
                    </div>
                  </div>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/account/${profile.address}`} 
                    target="_blank" rel="noopener noreferrer" 
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.06] rounded-lg border border-white/[0.06] transition-all text-[9px] font-bold uppercase tracking-wider text-white/40 group"
                  >
                    Explorer <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  </a>
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ── Left: Profile Card ──────────────────── */}
                <div className="lg:col-span-4 space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
                    
                    {isSearching ? (
                      <div className="p-8 animate-pulse space-y-5">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] mx-auto" />
                        <div className="h-5 bg-white/[0.04] rounded-lg w-2/3 mx-auto" />
                        <div className="h-3 bg-white/[0.04] rounded-lg w-1/2 mx-auto" />
                        <div className="space-y-2.5 pt-5 border-t border-white/[0.03]">
                          {[1,2,3].map(i => <div key={i} className="h-3 bg-white/[0.04] rounded" />)}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6">
                        {/* Avatar */}
                        <div className="text-center mb-5">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-800/20 flex items-center justify-center border border-accent/15 mx-auto mb-3 shadow-[0_6px_24px_rgba(124,58,237,0.12)]">
                            <User className="w-8 h-8 text-accent" />
                          </div>
                          <h2 className="text-xl font-black tracking-tight mb-1">{profile.name}</h2>
                          <div className="inline-flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-green-400/80">Verified</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-5">
                          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-white/[0.03] rounded-lg border border-white/[0.03]">
                            <Briefcase className="w-3.5 h-3.5 text-accent/60" />
                            <span className="text-xs font-semibold text-white/50">{profile.skill}</span>
                          </div>
                          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-white/[0.03] rounded-lg border border-white/[0.03]">
                            <MapPin className="w-3.5 h-3.5 text-accent/60" />
                            <span className="text-xs font-semibold text-white/50">{profile.city}</span>
                          </div>
                          {profile.experience && (
                            <div className="flex items-center gap-3 px-3.5 py-2.5 bg-white/[0.03] rounded-lg border border-white/[0.03]">
                              <Calendar className="w-3.5 h-3.5 text-accent/60" />
                              <span className="text-xs font-semibold text-white/50">{profile.experience} Years Exp</span>
                            </div>
                          )}
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                          <div className="pt-4 border-t border-white/[0.04]">
                            <p className="text-[11px] text-white/30 leading-relaxed italic">"{profile.bio}"</p>
                          </div>
                        )}

                        {/* Address */}
                        <div className="mt-4 pt-4 border-t border-white/[0.04]">
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/12 mb-1.5">Stellar Address</p>
                          <p className="text-[10px] font-mono text-white/20 truncate">{profile.address}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Action Buttons */}
                  {!isSearching && profile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="space-y-2.5"
                    >
                      <button 
                        onClick={() => navigate(`/endorse?address=${profile.address}`)}
                        className="group w-full py-3.5 bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-accent/15 active:scale-[0.98]"
                      >
                        <Award className="w-4 h-4 group-hover:scale-110 transition-transform" /> Endorse Worker
                      </button>
                      <button 
                        onClick={handleShare}
                        className="group w-full py-3.5 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
                      >
                        {copied 
                          ? <><Check className="w-4 h-4 text-green-400" /> Copied!</>
                          : <><Share2 className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" /> Share Profile</>
                        }
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* ── Right: Reputation + Endorsements ──────── */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Reputation Score */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                    
                    {isSearching ? (
                      <div className="p-8 animate-pulse flex items-center gap-8">
                        <div className="w-28 h-28 rounded-full bg-white/[0.04] shrink-0" />
                        <div className="flex-1 space-y-3">
                          <div className="h-5 bg-white/[0.04] rounded w-1/3" />
                          {[1,2,3,4,5].map(i => <div key={i} className="h-2 bg-white/[0.04] rounded-full" />)}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          {/* Score Ring */}
                          <div className="shrink-0 relative">
                            <div className="w-28 h-28 rounded-full relative flex items-center justify-center">
                              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 112 112">
                                <circle cx="56" cy="56" r="50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
                                <circle 
                                  cx="56" cy="56" r="50" fill="none" 
                                  stroke="url(#verifyScoreGrad)" 
                                  strokeWidth="5" 
                                  strokeLinecap="round"
                                  strokeDasharray={`${(profile.reputation.average / 5) * 314} 314`}
                                />
                                <defs>
                                  <linearGradient id="verifyScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#7c3aed" />
                                    <stop offset="100%" stopColor="#a78bfa" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <div className="text-center z-10">
                                <div className="text-3xl font-black tracking-tighter">{profile.reputation.average || '0.0'}</div>
                                <div className="text-[7px] font-bold uppercase tracking-[0.25em] text-white/18 mt-0.5">Score</div>
                              </div>
                            </div>
                          </div>

                          {/* Breakdown */}
                          <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xs font-black uppercase tracking-wider text-white/35">Rating Breakdown</h3>
                              <span className="text-[9px] font-bold text-accent/50">
                                {profile.reputation.total} {profile.reputation.total === 1 ? 'Review' : 'Reviews'}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {[5,4,3,2,1].map(star => (
                                <div key={star} className="flex items-center gap-2.5">
                                  <div className="flex items-center gap-1 w-10">
                                    <span className="text-[10px] font-bold text-white/20">{star}</span>
                                    <Star className="w-3 h-3 text-amber-400/30 fill-amber-400/30" />
                                  </div>
                                  <div className="flex-1 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${profile.reputation.breakdown[star] || 0}%` }}
                                      transition={{ duration: 1, delay: 0.5 + star * 0.08 }}
                                      className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400" 
                                    />
                                  </div>
                                  <span className="text-[9px] font-bold text-white/15 w-7 text-right">{profile.reputation.breakdown[star] || 0}%</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-white/[0.04]">
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(profile.reputation.average) ? 'text-amber-400 fill-amber-400' : 'text-white/[0.05]'}`} />
                                ))}
                              </div>
                              <span className="text-[10px] font-semibold text-white/18">{profile.reputation.average || '0.0'} out of 5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Stats Row */}
                  {!isSearching && profile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="grid grid-cols-3 gap-3"
                    >
                      {[
                        { value: profile.reputation.total, label: 'Total Jobs', color: 'text-accent' },
                        { value: profile.experience ? `${profile.experience}yr` : '—', label: 'Experience' },
                        { value: profile.timestamp ? new Date(profile.timestamp).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }) : '—', label: 'Member Since' },
                      ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-xl text-center" style={{
                          background: 'rgba(255,255,255,0.025)',
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}>
                          <p className={`text-xl font-black tracking-tight mb-0.5 ${stat.color || ''}`}>{stat.value}</p>
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/18">{stat.label}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Endorsement History */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-accent to-purple-600 rounded-full" />
                      <h3 className="text-lg font-black tracking-tight">Endorsement History</h3>
                      {!isSearching && profile && (
                        <span className="ml-auto text-[9px] font-bold text-white/12 bg-white/[0.03] px-2 py-0.5 rounded-md">
                          {profile.endorsements.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {isSearching ? (
                        [1,2].map(i => (
                          <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse h-28" />
                        ))
                      ) : profile.endorsements.length > 0 ? (
                        profile.endorsements
                          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                          .map((endorsement, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.06 }}
                            className="p-5 rounded-xl group transition-all"
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.04)',
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/12">
                                  <ShieldCheck className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                  <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/18 block">Endorser</span>
                                  <span className="text-xs font-mono font-semibold text-white/40">{truncateAddress(endorsement.endorser)}</span>
                                </div>
                              </div>
                              <div className="flex gap-0.5 p-1.5 bg-white/[0.02] rounded-md">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className={`w-3 h-3 ${s <= endorsement.rating ? 'text-amber-400 fill-amber-400' : 'text-white/[0.05]'}`} />
                                ))}
                              </div>
                            </div>

                            <div className="mb-3">
                              <span className="inline-block px-2 py-0.5 rounded-md bg-accent/8 border border-accent/12 text-[8px] font-bold uppercase tracking-wider text-accent/70 mb-2">
                                {endorsement.jobType}
                              </span>
                              <p className="text-[11px] text-white/30 leading-relaxed italic">"{endorsement.feedback}"</p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
                              <span className="text-[9px] font-semibold text-white/12 flex items-center gap-1.5">
                                <Calendar className="w-2.5 h-2.5" />
                                {new Date(endorsement.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                              {endorsement.txHash && (
                                <a
                                  href={`https://stellar.expert/explorer/testnet/tx/${endorsement.txHash}`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-white/12 hover:text-accent transition-colors"
                                >
                                  View TX <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-10 text-center rounded-xl border border-dashed border-white/[0.05]">
                          <div className="w-14 h-14 rounded-2xl bg-white/[0.02] flex items-center justify-center mx-auto mb-4">
                            <History className="w-6 h-6 text-white/[0.06]" />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/15 mb-1">No Endorsements Yet</p>
                          <p className="text-[10px] text-white/8 font-medium">Be the first to endorse this worker</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isSearching && !profile && !error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center max-w-sm mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-7 h-7 text-white/[0.06]" />
            </div>
            <p className="text-white/12 text-xs font-bold mb-1">Paste a Stellar address above to get started</p>
            <p className="text-white/[0.06] text-[10px] font-medium">Credentials are pulled directly from the blockchain</p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-5 text-white/10"
        >
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <Fingerprint className="w-3 h-3" /> Immutable Data
          </div>
          <div className="w-1 h-1 rounded-full bg-white/5" />
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" /> Tamper-Proof
          </div>
          <div className="w-1 h-1 rounded-full bg-white/5" />
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <Target className="w-3 h-3" /> Stellar Network
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Verify;
