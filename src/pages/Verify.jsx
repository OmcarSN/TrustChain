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

  const handleSearchSubmit = (e) => { e.preventDefault(); performSearch(workerSearch); };
  const handleShare = () => {
    const url = `${window.location.origin}/verify?address=${profile.address}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Profile link copied!');
    setTimeout(() => setCopied(false), 2000);
  };
  const truncateAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : "";

  return (
    <div className="min-h-screen bg-background pt-[100px] pb-6 px-4 sm:px-6 relative overflow-hidden text-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* ── Hero Search ────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}
          >
            <Fingerprint className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E3A8A]">On-Chain Verification</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl mb-3 leading-[0.95] text-gray-900"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, letterSpacing: '-0.03em' }}
          >
            Verify Worker<br/>
            <span className="bg-gradient-to-r from-[#1E3A8A] via-[#EA580C] to-[#1E3A8A] bg-clip-text text-transparent">Reputation</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-sm mb-6 max-w-xl mx-auto"
            style={{ color: '#4B5563', fontWeight: 400 }}
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
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                <Search className="w-4 h-4" style={{ color: '#6B7280' }} />
              </div>
              <input 
                type="text" 
                placeholder="Enter Stellar Address (G...)" 
                value={workerSearch}
                onChange={(e) => setWorkerSearch(e.target.value)}
                className="w-full rounded-2xl py-5 pr-36 text-sm text-gray-900 transition-all focus:outline-none shadow-sm"
                style={{
                  paddingLeft: '4.2rem',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  fontFamily: '"Inter", sans-serif',
                }}
                onFocus={e => { e.target.style.borderColor = '#1E3A8A'; e.target.style.boxShadow = '0 0 0 2px rgba(30, 58, 138, 0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'; }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button 
                  type="submit"
                  disabled={isSearching || !workerSearch}
                  className="disabled:opacity-30 active:scale-95 transition-all"
                >
                  <div className="shiny-border">
                    <div className="shiny-border-inner px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white flex items-center gap-2">
                      {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Globe className="w-3.5 h-3.5" /> Search</>}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.form>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-5 text-xs flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl w-fit mx-auto font-bold"
                style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
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
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Verified Banner */}
              {!isSearching && profile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8 p-4 rounded-[20px] flex items-center justify-between"
                  style={{ background: '#ECFDF5', border: '1px solid #D1FAE5' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-[#D1FAE5] shadow-sm">
                      <ShieldCheck className="w-4.5 h-4.5 text-[#10B981]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#059669]">Ledger Verified</p>
                      <p className="text-[10px] font-bold text-[#10B981]">Credential confirmed on Stellar Testnet</p>
                    </div>
                  </div>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/account/${profile.address}`} 
                    target="_blank" rel="noopener noreferrer" 
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full transition-all text-[9px] font-bold uppercase tracking-wider group hover:bg-gray-100"
                    style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#1E3A8A' }}
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
                    className="rounded-[20px] relative overflow-hidden shadow-sm"
                    style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
                  >
                    {isSearching ? (
                      <div className="p-8 animate-pulse space-y-5">
                        <div className="w-16 h-16 rounded-2xl mx-auto" style={{ background: '#F3F4F6' }} />
                        <div className="h-5 rounded-lg w-2/3 mx-auto" style={{ background: '#F3F4F6' }} />
                        <div className="h-3 rounded-lg w-1/2 mx-auto" style={{ background: '#F3F4F6' }} />
                        <div className="space-y-2.5 pt-5" style={{ borderTop: '1px solid #E5E7EB' }}>
                          {[1,2,3].map(i => <div key={i} className="h-3 rounded" style={{ background: '#F3F4F6' }} />)}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6">
                        <div className="text-center mb-5">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                            <User className="w-8 h-8 text-[#1E3A8A]" />
                          </div>
                          <h2 className="text-2xl mb-1 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>{profile.name}</h2>
                          <div className="inline-flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981', animation: 'pulse-dot 2s infinite' }} />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: '#059669' }}>Verified</span>
                          </div>
                        </div>
                        <div className="space-y-2 mb-5">
                          {[
                            { icon: Briefcase, text: profile.skill },
                            { icon: MapPin, text: profile.city },
                            ...(profile.experience && profile.experience !== "Unknown" ? [{ icon: Calendar, text: `${profile.experience} Years Exp` }] : []),
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                              <item.icon className="w-3.5 h-3.5" style={{ color: '#EA580C', opacity: 0.8 }} />
                              <span className="text-xs font-bold" style={{ color: '#6B7280' }}>{item.text}</span>
                            </div>
                          ))}
                        </div>
                        {profile.bio && (
                          <div className="pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
                            <p className="text-[11px] leading-relaxed italic" style={{ color: '#4B5563' }}>"{profile.bio}"</p>
                          </div>
                        )}
                        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
                          <p className="label-mono mb-1.5 font-bold text-gray-400">Stellar Address</p>
                          <p className="text-[10px] font-mono font-bold truncate" style={{ color: '#4B5563' }}>{profile.address}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Actions */}
                  {!isSearching && profile && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-2.5">
                      <button onClick={() => navigate(`/endorse?address=${profile.address}`)} className="w-full active:scale-[0.98]">
                        <div className="shiny-border">
                          <div className="shiny-border-inner w-full py-3.5 font-bold uppercase tracking-[0.15em] text-[10px] text-white flex items-center justify-center gap-2.5">
                            <Award className="w-4 h-4" /> Endorse Worker
                          </div>
                        </div>
                      </button>
                      <button 
                        onClick={handleShare}
                        className="w-full py-3.5 rounded-full font-bold uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] hover:bg-gray-100"
                        style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#4B5563' }}
                      >
                        {copied ? <><Check className="w-4 h-4 text-[#10B981]" /> Copied!</> : <><Share2 className="w-4 h-4 text-[#1E3A8A]" /> Share Profile</>}
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
                    className="rounded-[20px] relative overflow-hidden shadow-sm"
                    style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
                  >
                    {isSearching ? (
                      <div className="p-8 animate-pulse flex items-center gap-8">
                        <div className="w-28 h-28 rounded-full shrink-0" style={{ background: '#F3F4F6' }} />
                        <div className="flex-1 space-y-3">
                          <div className="h-5 rounded w-1/3" style={{ background: '#F3F4F6' }} />
                          {[1,2,3,4,5].map(i => <div key={i} className="h-2 rounded-full" style={{ background: '#F3F4F6' }} />)}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          <div className="shrink-0 relative">
                            <div className="w-28 h-28 rounded-full relative flex items-center justify-center">
                              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 112 112">
                                <circle cx="56" cy="56" r="50" fill="none" stroke="#F3F4F6" strokeWidth="5" />
                                <circle cx="56" cy="56" r="50" fill="none" stroke="url(#verifyScoreGrad)" strokeWidth="5" strokeLinecap="round"
                                  strokeDasharray={`${(profile.reputation.average / 5) * 314} 314`}
                                />
                                <defs>
                                  <linearGradient id="verifyScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1E3A8A" />
                                    <stop offset="100%" stopColor="#EA580C" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <div className="text-center z-10">
                                <div className="text-3xl font-bold tracking-tight text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>{profile.reputation.average || '0.0'}</div>
                                <div className="label-mono mt-0.5 text-gray-500">Score</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: '"Playfair Display", serif' }}>Rating Breakdown</h3>
                              <span className="label-mono" style={{ color: '#1E3A8A' }}>
                                {profile.reputation.total} {profile.reputation.total === 1 ? 'Review' : 'Reviews'}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {[5,4,3,2,1].map(star => (
                                <div key={star} className="flex items-center gap-2.5">
                                  <div className="flex items-center gap-1 w-10">
                                    <span className="text-[10px] font-bold" style={{ color: '#4B5563' }}>{star}</span>
                                    <Star className="w-3 h-3" style={{ color: '#EA580C', opacity: 0.5 }} />
                                  </div>
                                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${profile.reputation.breakdown[star] || 0}%` }}
                                      transition={{ duration: 1, delay: 0.5 + star * 0.08, ease: [0.23, 1, 0.32, 1] }}
                                      className="h-full rounded-full"
                                      style={{ background: 'linear-gradient(90deg, #1E3A8A, #EA580C)' }}
                                    />
                                  </div>
                                  <span className="text-[9px] font-bold w-7 text-right" style={{ color: '#4B5563' }}>{profile.reputation.breakdown[star] || 0}%</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 pt-4 mt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className="w-3.5 h-3.5" style={{ color: s <= Math.floor(profile.reputation.average) ? '#FBBF24' : '#E5E7EB', fill: s <= Math.floor(profile.reputation.average) ? '#FBBF24' : 'none' }} />
                                ))}
                              </div>
                              <span className="text-[10px] font-bold" style={{ color: '#6B7280' }}>{profile.reputation.average || '0.0'} out of 5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Stats Row */}
                  {!isSearching && profile && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-3 gap-3">
                      {[
                        { value: profile.reputation.total, label: 'Total Jobs', color: '#1E3A8A' },
                        { value: profile.experience && profile.experience !== "Unknown" ? `${profile.experience}yr` : '—', label: 'Experience', color: '#1E3A8A' },
                        { value: profile.timestamp ? new Date(profile.timestamp).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }) : '—', label: 'Member Since', color: '#1E3A8A' },
                      ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-[14px] text-center shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                          <p className="text-xl font-bold tracking-tight mb-0.5" style={{ color: stat.color }}>{stat.value}</p>
                          <p className="label-mono font-bold text-gray-500">{stat.label}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Endorsement History */}
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="flex items-center gap-3 mb-5">
                      <h3 className="text-xl text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Endorsement History</h3>
                      {!isSearching && profile && (
                        <span className="label-mono px-2.5 py-0.5 rounded-full text-gray-600 font-bold" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                          {profile.endorsements.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {isSearching ? (
                        [1,2].map(i => (
                          <div key={i} className="p-5 rounded-[20px] animate-pulse h-28" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }} />
                        ))
                      ) : profile.endorsements.length > 0 ? (
                        profile.endorsements
                          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                          .map((endorsement, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.06, ease: [0.23, 1, 0.32, 1] }}
                            className="p-5 rounded-[20px] transition-all duration-300 shadow-sm hover:shadow-md"
                            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                                  <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
                                </div>
                                <div>
                                  <span className="label-mono block font-bold text-gray-500">Endorser</span>
                                  <span className="text-xs font-mono font-bold" style={{ color: '#4B5563' }}>{truncateAddress(endorsement.endorser)}</span>
                                </div>
                              </div>
                              <div className="flex gap-0.5 p-1.5 rounded-md" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className="w-3 h-3" style={{ color: s <= endorsement.rating ? '#FBBF24' : '#E5E7EB', fill: s <= endorsement.rating ? '#FBBF24' : 'none' }} />
                                ))}
                              </div>
                            </div>
                            <div className="mb-3">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider mb-2" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', color: '#1E3A8A' }}>
                                {endorsement.jobType}
                              </span>
                              <p className="text-[11px] leading-relaxed italic font-medium" style={{ color: '#4B5563' }}>"{endorsement.feedback}"</p>
                            </div>
                            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #E5E7EB' }}>
                              <span className="text-[9px] font-bold flex items-center gap-1.5" style={{ color: '#6B7280' }}>
                                <Calendar className="w-2.5 h-2.5" />
                                {new Date(endorsement.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                              {endorsement.txHash && (
                                <a href={`https://stellar.expert/explorer/testnet/tx/${endorsement.txHash}`} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors"
                                  style={{ color: '#4B5563' }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#1E3A8A'}
                                  onMouseLeave={e => e.currentTarget.style.color = '#4B5563'}
                                >
                                  View TX <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-10 text-center rounded-[20px]" style={{ border: '1px dashed #E5E7EB', background: '#F9FAFB' }}>
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white border border-gray-200 shadow-sm">
                            <History className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-600">No Endorsements Yet</p>
                          <p className="text-[10px] font-medium" style={{ color: '#6B7280' }}>Be the first to endorse this worker</p>
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
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-white border border-gray-200 shadow-sm">
              <Sparkles className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-xs font-bold mb-1 text-gray-600">Paste a Stellar address above to get started</p>
            <p className="text-[10px]" style={{ color: '#6B7280', fontWeight: 400 }}>Credentials are pulled directly from the blockchain</p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 flex items-center justify-center gap-5" style={{ color: '#6B7280' }}>
          {[
            { icon: Fingerprint, text: 'Immutable Data' },
            { icon: ShieldCheck, text: 'Tamper-Proof' },
            { icon: Target, text: 'Stellar Network' },
          ].map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-0.5 h-0.5 rounded-full" style={{ background: '#E5E7EB' }} />}
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold"><b.icon className="w-3 h-3" /> {b.text}</div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Verify;
