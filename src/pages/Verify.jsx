import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, MapPin, Briefcase, ShieldCheck, ExternalLink,
  Share2, Award, User, History, CheckCircle2, Calendar,
  Loader2, AlertCircle, Fingerprint, Globe, ArrowRight, Sparkles,
  Clock, Target, Zap, Copy, Check, Hash
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchWorkerCredential } from '../lib/stellar';
import { calculateScore } from '../lib/reputation';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { t } = useTranslation();

  const [workerSearch, setWorkerSearch] = useState(searchParams.get('address') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (searchParams.get('address')) performSearch(searchParams.get('address'));
  }, []);

  const performSearch = async (address) => {
    if (!address) return;
    setIsSearching(true); setError(null);
    try {
      const credential = await fetchWorkerCredential(address);
      const endorsements = JSON.parse(localStorage.getItem(`endorsements_${address}`) || '[]');
      const reputation = calculateScore(endorsements);
      setProfile({ ...credential, address, reputation, endorsements });
      toast.success(t('verify.verifiedResult'));
    } catch (err) {
      setError(err.message || 'Worker not found on-chain');
      toast.error(t('verify.failedResult'));
      setProfile(null);
    } finally { setIsSearching(false); }
  };

  const handleSearchSubmit = (e) => { e.preventDefault(); performSearch(workerSearch); };
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/verify?address=${profile.address}`);
    setCopied(true); toast.success(t('verify.copied'));
    setTimeout(() => setCopied(false), 2000);
  };
  const truncAddr = (a) => a ? `${a.slice(0,6)}…${a.slice(-6)}` : '';

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
      {/* Background Graphics (Grid & Orbs) */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,110,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      
      {/* Atmospheric Light Leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '30%', width: '500px', height: '500px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04, zIndex: 0 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05, zIndex: 0 }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-inter mb-3">
            <Fingerprint className="w-3.5 h-3.5 inline mr-1.5" />{t('verify.onChainBadge')}
          </p>
          <h1 className="font-clash text-4xl md:text-5xl font-bold tracking-tighter mb-3">
            {t('verify.headerTitle')}<br/>
            <span className="text-white/30">{t('verify.headerTitleHighlight')}</span>
          </h1>
          <p className="text-white/25 text-sm max-w-xl mx-auto mb-6 font-inter font-light">{t('verify.headerSubtitle')}</p>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="flex items-center border-b border-white/20 focus-within:border-white/60 transition-colors">
              <Search className="w-5 h-5 text-white/20 mr-3" />
              <input
                type="text"
                placeholder={t('dashboard.searchPlaceholder')}
                value={workerSearch}
                onChange={(e) => setWorkerSearch(e.target.value)}
                className="flex-1 bg-transparent py-4 text-sm font-mono text-white placeholder-white/30 outline-none"
              />
              <button type="submit" disabled={isSearching || !workerSearch}
                className="bg-white text-black px-6 py-2.5 rounded-[2px] font-bold text-[11px] uppercase tracking-wider transition-all disabled:opacity-30 hover:opacity-85 flex items-center gap-2 ml-3">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Globe className="w-3.5 h-3.5" /> {t('verify.searchBtn')}</>}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-4 text-red-400/80 text-xs flex items-center justify-center gap-2 border border-red-400/20 px-4 py-2.5 rounded-[2px] w-fit mx-auto font-inter">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Results */}
        <AnimatePresence mode="wait">
          {(isSearching || profile) && (
            <motion.div key={isSearching ? 'loading' : profile?.address} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Verified Banner */}
              {!isSearching && profile && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                  className="mb-6 p-4 rounded-[2px] flex items-center justify-between border border-green-400/10 bg-green-400/[0.03]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[2px] bg-green-400/10 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-400">{t('verify.ledgerVerified')}</p>
                      <p className="text-[9px] text-green-400/40 font-inter">{t('verify.credentialConfirmed')}</p>
                    </div>
                  </div>
                  <a href={`https://stellar.expert/explorer/testnet/account/${profile.address}`} target="_blank" rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-2 px-4 py-2 border border-white/10 rounded-[2px] text-[9px] font-bold uppercase tracking-wider text-white/40 hover:text-white hover:border-white/30 transition-all">
                    Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Profile Card */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="border border-white/[0.07] rounded-[2px] bg-white/[0.02] overflow-hidden">
                    {isSearching ? (
                      <div className="p-8 animate-pulse space-y-4">
                        <div className="w-14 h-14 bg-white/5 rounded-[2px] mx-auto" />
                        <div className="h-4 bg-white/5 rounded-[2px] w-2/3 mx-auto" />
                        <div className="h-3 bg-white/5 rounded-[2px] w-1/2 mx-auto" />
                      </div>
                    ) : (
                      <div className="p-6">
                        <div className="text-center mb-5">
                          <div className="w-14 h-14 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                            <User className="w-7 h-7 text-white/30" />
                          </div>
                          <h2 className="font-clash text-xl font-bold mb-1">{profile.name}</h2>
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-green-400/80">{t('profile.badgeVerified')}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center gap-3 px-3 py-2.5 border border-white/5 rounded-[2px]">
                            <Briefcase className="w-3.5 h-3.5 text-white/20" />
                            <span className="text-xs text-white/50 font-inter">{profile.skill}</span>
                          </div>
                          <div className="flex items-center gap-3 px-3 py-2.5 border border-white/5 rounded-[2px]">
                            <MapPin className="w-3.5 h-3.5 text-white/20" />
                            <span className="text-xs text-white/50 font-inter">{profile.city}</span>
                          </div>
                          {profile.experience && (
                            <div className="flex items-center gap-3 px-3 py-2.5 border border-white/5 rounded-[2px]">
                              <Calendar className="w-3.5 h-3.5 text-white/20" />
                              <span className="text-xs text-white/50 font-inter">{profile.experience} {t('verify.yearsExp')}</span>
                            </div>
                          )}
                        </div>
                        {profile.bio && (
                          <div className="pt-3 border-t border-white/5">
                            <p className="text-[11px] text-white/25 leading-relaxed italic font-inter">"{profile.bio}"</p>
                          </div>
                        )}
                        <div className="mt-4 pt-3 border-t border-white/5">
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/15 mb-1 font-inter">{t('verify.stellarAddress')}</p>
                          <p className="text-[10px] font-mono text-white/25 truncate">{profile.address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!isSearching && profile && (
                    <div className="space-y-2">
                      <button onClick={() => navigate(`/endorse?address=${profile.address}`)}
                        className="w-full py-3.5 bg-white text-black rounded-[2px] font-bold uppercase tracking-[0.15em] text-[10px] hover:opacity-85 transition-opacity flex items-center justify-center gap-2">
                        <Award className="w-4 h-4" /> {t('profile.endorseBtn')}
                      </button>
                      <button onClick={handleShare}
                        className="w-full py-3.5 border border-white/10 rounded-[2px] font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                        {copied ? <><Check className="w-4 h-4 text-green-400" /> {t('verify.copied')}</> : <><Share2 className="w-4 h-4" /> {t('verify.shareProfile')}</>}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Reputation + Endorsements */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Reputation */}
                  <div className="border border-white/[0.07] rounded-[2px] bg-white/[0.02]">
                    {isSearching ? (
                      <div className="p-8 animate-pulse flex items-center gap-8">
                        <div className="w-24 h-24 rounded-full bg-white/5 shrink-0" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-white/5 rounded-[2px] w-1/3" />
                          {[1,2,3,4,5].map(i => <div key={i} className="h-1.5 bg-white/5 rounded-full" />)}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          {/* Score Ring */}
                          <div className="shrink-0 relative">
                            <div className="w-24 h-24 rounded-full relative flex items-center justify-center">
                              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
                                <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                                <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round"
                                  strokeDasharray={`${(profile.reputation.average / 5) * 264} 264`} />
                              </svg>
                              <div className="text-center z-10">
                                <div className="font-clash text-2xl font-bold">{profile.reputation.average || '0.0'}</div>
                                <div className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/20 font-inter">{t('verify.score')}</div>
                              </div>
                            </div>
                          </div>

                          {/* Breakdown */}
                          <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/30 font-inter">{t('verify.ratingBreakdown')}</h3>
                              <span className="text-[9px] font-bold text-white/20 font-inter">{profile.reputation.total} {t('discover.reviews')}</span>
                            </div>
                            <div className="space-y-2">
                              {[5,4,3,2,1].map(star => (
                                <div key={star} className="flex items-center gap-2.5">
                                  <div className="flex items-center gap-1 w-8">
                                    <span className="text-[10px] font-bold text-white/20">{star}</span>
                                    <Star className="w-2.5 h-2.5 text-white/20 fill-white/20" />
                                  </div>
                                  <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${profile.reputation.breakdown[star] || 0}%` }}
                                      transition={{ duration: 1, delay: 0.3 + star * 0.08 }}
                                      className="h-full rounded-full bg-white/40" />
                                  </div>
                                  <span className="text-[9px] font-bold text-white/15 w-7 text-right">{profile.reputation.breakdown[star] || 0}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats Row */}
                  {!isSearching && profile && (
                    <div className="grid grid-cols-3 gap-px bg-white/5">
                      {[
                        { value: profile.reputation.total, label: t('verify.totalJobs') },
                        { value: profile.experience ? `${profile.experience}yr` : '—', label: t('verify.experience') },
                        { value: profile.timestamp ? new Date(profile.timestamp).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }) : '—', label: t('verify.memberSince') },
                      ].map((stat, i) => (
                        <div key={i} className="bg-[#050505] p-5 text-center">
                          <p className="font-clash text-xl font-bold mb-0.5">{stat.value}</p>
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 font-inter">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Endorsement History */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-5 bg-white/20 rounded-full" />
                      <h3 className="text-sm font-bold tracking-tight font-inter">{t('profile.reviewsHeader')}</h3>
                      {!isSearching && profile && (
                        <span className="ml-auto text-[9px] font-bold text-white/15 font-inter">{profile.endorsements.length}</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {isSearching ? (
                        [1,2].map(i => <div key={i} className="p-5 bg-white/[0.02] border border-white/5 animate-pulse h-24 rounded-[2px]" />)
                      ) : profile.endorsements.length > 0 ? (
                        profile.endorsements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((endorsement, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + idx * 0.05 }}
                            className="p-4 border border-white/[0.05] rounded-[2px] bg-white/[0.02] hover:border-white/[0.12] transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center">
                                  <ShieldCheck className="w-3.5 h-3.5 text-white/30" />
                                </div>
                                <div>
                                  <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/20 block font-inter">{t('profile.endorserLabel')}</span>
                                  <span className="text-xs font-mono text-white/40">{truncAddr(endorsement.endorser)}</span>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (<Star key={s} className={`w-2.5 h-2.5 ${s <= endorsement.rating ? 'text-white fill-white' : 'text-white/10'}`} />))}
                              </div>
                            </div>
                            <div className="mb-2">
                              <span className="inline-block px-2 py-0.5 border border-white/10 rounded-[2px] text-[8px] font-bold uppercase text-white/40 mb-1.5">{endorsement.jobType}</span>
                              <p className="text-[11px] text-white/30 leading-relaxed italic font-inter">"{endorsement.feedback}"</p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                              <span className="text-[9px] text-white/15 flex items-center gap-1 font-inter">
                                <Calendar className="w-2.5 h-2.5" /> {new Date(endorsement.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                              {endorsement.txHash && (
                                <a href={`https://stellar.expert/explorer/testnet/tx/${endorsement.txHash}`} target="_blank" rel="noopener noreferrer"
                                  className="text-[8px] font-mono text-white/10 hover:text-white/30 transition-colors flex items-center gap-1">
                                  <Hash className="w-2 h-2" /> {endorsement.txHash.slice(0,8)}…
                                </a>
                              )}
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-10 text-center border border-dashed border-white/5 rounded-[2px]">
                          <History className="w-6 h-6 text-white/10 mx-auto mb-3" />
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/15 font-inter">{t('profile.noReviews')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isSearching && !profile && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-[2px] bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white/10" />
            </div>
            <p className="text-white/15 text-xs font-bold font-inter">{t('verify.emptyStateTitle')}</p>
            <p className="text-white/10 text-[10px] font-inter">{t('verify.emptyStateSubtitle')}</p>
          </motion.div>
        )}

        {/* Footer badges */}
        <div className="mt-10 flex items-center justify-center gap-5 text-white/10">
          {[
            { icon: Fingerprint, label: t('verify.badgeImmutable') },
            { icon: ShieldCheck, label: t('verify.badgeTamperProof') },
            { icon: Target, label: t('verify.badgeStellar') },
          ].map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-1 h-1 rounded-full bg-white/5" />}
              <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider font-inter">
                <b.icon className="w-3 h-3" /> {b.label}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Verify;
