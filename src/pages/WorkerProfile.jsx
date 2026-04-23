import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Briefcase, MapPin, Star, Calendar, Award,
  ArrowLeft, Copy, Check, ExternalLink, Share2,
  ShieldCheck, Clock, Hash, ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { calculateScore } from '../lib/reputation';
import TrustChainLogo from '../components/TrustChainLogo';

const WorkerProfile = () => {
  const { address } = useParams();
  const [profile, setProfile] = useState(null);
  const [endorsements, setEndorsements] = useState([]);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`trustchain_worker_${address}`) || 'null');
    const endorse = JSON.parse(localStorage.getItem(`endorsements_${address}`) || '[]');
    if (data) {
      setProfile({
        name: data.name || data.fullName || 'Unknown',
        skill: data.skill || data.skillCategory || 'General',
        city: data.city || 'Unknown',
        experience: data.experience || 0,
        bio: data.bio || '',
        timestamp: data.timestamp,
      });
    }
    setEndorsements(endorse);
    setReputation(calculateScore(endorse));
    setLoading(false);
  }, [address]);

  const truncate = (a) => a ? `${a.slice(0,6)}…${a.slice(-6)}` : '';
  const copyAddr = () => { navigator.clipboard.writeText(address); setCopiedAddr(true); setTimeout(() => setCopiedAddr(false), 2000); };
  const shareProfile = () => { navigator.clipboard.writeText(window.location.href); setCopiedShare(true); setTimeout(() => setCopiedShare(false), 2000); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-48 bg-white/5 rounded-[2px]" />
            <div className="h-40 bg-white/5 rounded-[2px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 flex items-center justify-center relative overflow-hidden text-white">
        <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <User className="w-7 h-7 text-white/20" />
          </div>
          <h2 className="font-clash text-2xl font-bold mb-2">{t('profile.noCredentialTitle')}</h2>
          <p className="text-white/30 text-sm mb-6 font-inter">{t('profile.noCredentialSub')}</p>
          <div className="flex gap-3">
            <Link to="/verify" className="flex-1 py-3 bg-white text-black rounded-[2px] font-bold text-[10px] tracking-[0.15em] uppercase text-center hover:opacity-85 transition-opacity">{t('profile.verify')}</Link>
            <Link to="/" className="flex-1 py-3 border border-white/15 rounded-[2px] font-bold text-[10px] tracking-[0.15em] uppercase text-center hover:bg-white/5 transition-all">{t('profile.goHome')}</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
      {/* Light leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', right: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <Link to="/discover" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-bold mb-6 group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> {t('profile.backToDiscover')}
        </Link>

        {/* Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10 reveal">
          {/* Identity Card */}
          <div className="md:col-span-4 border border-white/[0.07] rounded-[2px] p-6 bg-white/[0.02]">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-white/30" />
              </div>
              <h2 className="font-clash text-xl font-bold mb-1">{profile.name}</h2>
              <div className="flex items-center gap-3 text-white/30 text-[10px] font-inter">
                <span className="flex items-center gap-1"><Briefcase className="w-2.5 h-2.5" /> {profile.skill}</span>
                <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {profile.city}</span>
              </div>
              {profile.experience > 0 && (
                <span className="flex items-center gap-1 text-white/20 text-[10px] mt-1 font-inter">
                  <Calendar className="w-2.5 h-2.5" /> {profile.experience} {t('profile.yrs')}
                </span>
              )}
            </div>
            {profile.bio && <p className="text-[11px] text-white/30 italic leading-relaxed border-t border-white/5 pt-4 text-center font-inter">"{profile.bio}"</p>}

            {/* Wallet */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2 font-inter">{t('profile.walletAddress')}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-white/40 flex-1 truncate">{address}</span>
                <button onClick={copyAddr} className="text-white/20 hover:text-white transition-colors">
                  {copiedAddr ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <a href={`https://stellar.expert/explorer/testnet/address/${address}`} target="_blank" rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-[2px] text-[9px] font-bold uppercase tracking-wider text-white/30 hover:text-white hover:border-white/30 transition-all">
                <ExternalLink className="w-3 h-3" /> {t('profile.viewOnStellar')}
              </a>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button onClick={shareProfile} className="flex-1 py-2.5 border border-white/10 rounded-[2px] text-[9px] font-bold uppercase tracking-wider text-white/30 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-1.5">
                {copiedShare ? <><Check className="w-3 h-3 text-green-400" /> {t('profile.copied')}</> : <><Share2 className="w-3 h-3" /> {t('profile.shareProfile')}</>}
              </button>
              <Link to={`/endorse?worker=${address}`} className="flex-1 py-2.5 bg-white text-black rounded-[2px] text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-85 transition-opacity">
                <Award className="w-3 h-3" /> {t('profile.endorse')}
              </Link>
            </div>
          </div>

          {/* Right side: Reputation + Endorsements */}
          <div className="md:col-span-8 space-y-4">
            {/* Reputation Bar */}
            <div className="border border-white/[0.07] rounded-[2px] p-6 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-white/20 rounded-full" />
                <h3 className="text-sm font-bold tracking-tight font-inter">{t('profile.reputationScore')}</h3>
              </div>
              {endorsements.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="font-clash text-3xl font-bold">{reputation?.average || '0.0'}</p>
                    <div className="flex justify-center gap-0.5 mt-1">
                      {[1,2,3,4,5].map(s => (<Star key={s} className={`w-3 h-3 ${s <= Math.round(reputation?.average || 0) ? 'text-white fill-white' : 'text-white/10'}`} />))}
                    </div>
                    <p className="text-[8px] uppercase tracking-wider text-white/20 mt-1 font-inter">{t('profile.avgRating')}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-clash text-3xl font-bold">{endorsements.length}</p>
                    <p className="text-[8px] uppercase tracking-wider text-white/20 mt-1 font-inter">{t('profile.totalReviews')}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-clash text-3xl font-bold">{reputation?.highest || '—'}</p>
                    <p className="text-[8px] uppercase tracking-wider text-white/20 mt-1 font-inter">{t('profile.highestScore')}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-clash text-3xl font-bold">{reputation?.weighted?.toFixed(1) || '—'}</p>
                    <p className="text-[8px] uppercase tracking-wider text-white/20 mt-1 font-inter">{t('profile.weightedScore')}</p>
                  </div>
                </div>
              ) : (
                <p className="text-white/20 text-xs font-inter">{t('profile.noEndorsements')}</p>
              )}
            </div>

            {/* Endorsements List */}
            <div className="border border-white/[0.07] rounded-[2px] bg-white/[0.02]">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight font-inter">{t('profile.endorsements')}</h3>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider">{endorsements.length} {t('profile.total')}</span>
              </div>
              {endorsements.length === 0 ? (
                <div className="p-10 text-center border-t border-dashed border-white/5">
                  <Award className="w-8 h-8 text-white/10 mx-auto mb-3" />
                  <p className="text-white/20 text-xs font-inter">{t('profile.noEndorsementsYet')}</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
                  {endorsements.map((e, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="p-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5 text-white/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 border border-white/10 rounded-[2px] text-[8px] font-bold uppercase text-white/40">{e.jobType}</span>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(s => (<Star key={s} className={`w-2.5 h-2.5 ${s <= e.rating ? 'text-white fill-white' : 'text-white/10'}`} />))}
                            </div>
                          </div>
                          <p className="text-[11px] text-white/30 leading-relaxed mb-1.5 font-inter">"{e.feedback}"</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[8px] text-white/15 flex items-center gap-1 font-inter">
                              <Clock className="w-2.5 h-2.5" /> {new Date(e.timestamp).toLocaleDateString()}
                            </span>
                            {e.txHash && (
                              <a href={`https://stellar.expert/explorer/testnet/tx/${e.txHash}`} target="_blank" rel="noopener noreferrer"
                                className="text-[8px] font-mono text-white/10 hover:text-white/30 transition-colors flex items-center gap-1">
                                <Hash className="w-2 h-2" /> {e.txHash.slice(0,8)}…
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
