import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Star, MapPin, Briefcase, ShieldCheck, ExternalLink, 
  Calendar, Share2, Award, CheckCircle2, Clock, Hash, 
  ArrowLeft, Loader2, AlertCircle, Copy, Check, Sparkles,
  Target, Globe, Fingerprint
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchCredentialsByWallet } from '../services/indexer';
import { calculateScore } from '../lib/reputation';
import { useToast } from '../context/ToastContext';

const WorkerProfile = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [endorsements, setEndorsements] = useState([]);
  const [credentialHistory, setCredentialHistory] = useState([]);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  useEffect(() => {
    if (!address) return;

    const loadProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const credentials = await fetchCredentialsByWallet(address);
        
        if (!credentials || credentials.length === 0) {
          throw new Error('Worker profile not found on-chain. No active credentials detected.');
        }

        setCredentialHistory(credentials);
        const firstResult = credentials[0];

        const localKey = `endorsements_${address}`;
        const endorse = JSON.parse(localStorage.getItem(localKey) || '[]');
        const rep = calculateScore(endorse);

        const localDataStr = localStorage.getItem(`trustchain_worker_${address}`);
        const localData = localDataStr ? JSON.parse(localDataStr) : {};

        const mergedProfile = {
          ...firstResult,
          address,
          name: localData.name || localData.fullName || firstResult.name || 'Worker',
          city: localData.city || firstResult.city || 'Unknown',
          experience: localData.experience || firstResult.yearsExperience || 0,
          bio: localData.bio || firstResult.bio || '',
          skill: localData.skill || localData.skillCategory || firstResult.credentialType || 'General'
        };

        setProfile(mergedProfile);
        setEndorsements(endorse);
        setReputation(rep);
      } catch (err) {
        setError(err.message || 'Worker profile not found on-chain.');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [address]);

  const handleShare = () => {
    const url = `${window.location.origin}/profile/${address}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Profile link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopiedAddr(true);
    toast.success('Wallet address copied!');
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const truncateAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : '';

  /* ── Loading skeleton ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-[100px] pb-8 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col h-full">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 font-semibold text-xs group" style={{ color: '#737373' }}>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="p-8 rounded-[20px] animate-pulse" style={{ background: 'rgba(10,10,10,0.7)', blur: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-20 h-20 rounded-2xl mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.03)' }} />
                <div className="h-6 rounded-lg w-2/3 mx-auto mb-3" style={{ background: 'rgba(255,255,255,0.03)' }} />
                <div className="h-3 rounded-lg w-1/2 mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.03)' }} />
                <div className="space-y-2.5">{[1,2,3,4,5].map(i => <div key={i} className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />)}</div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="p-10 rounded-[20px] animate-pulse" style={{ background: 'rgba(10,10,10,0.7)', blur: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="h-8 rounded-xl w-1/2 mb-5" style={{ background: 'rgba(255,255,255,0.03)' }} />
                <div className="h-3 rounded-lg w-full mb-2" style={{ background: 'rgba(255,255,255,0.03)' }} />
                <div className="h-3 rounded-lg w-3/4 mb-8" style={{ background: 'rgba(255,255,255,0.03)' }} />
                <div className="flex gap-3"><div className="h-12 rounded-xl flex-1" style={{ background: 'rgba(255,255,255,0.03)' }} /><div className="h-12 rounded-xl flex-1" style={{ background: 'rgba(255,255,255,0.03)' }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ───────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen bg-background pt-[100px] flex items-center justify-center px-6 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-md p-10 rounded-[20px] relative overflow-hidden"
          style={{ background: 'rgba(10,10,10,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-3xl mb-2" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>Profile Not Found</h2>
          <p className="mb-3 text-sm" style={{ color: '#a3a3a3' }}>{error}</p>
          <p className="font-mono text-[10px] mb-6 truncate px-4" style={{ color: '#525252' }}>{address}</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/verify" className="w-full">
              <div className="shiny-border">
                <div className="shiny-border-inner w-full py-3.5 font-semibold uppercase tracking-[0.15em] text-[10px] text-white flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verify Page
                </div>
              </div>
            </Link>
            <Link to="/" className="w-full py-3.5 rounded-full font-semibold uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#a3a3a3' }}>
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Profile View ──────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background pt-[100px] pb-8 px-4 sm:px-6 relative overflow-hidden text-gray-900 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full relative z-10">
        
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xs group transition-colors" style={{ color: '#6B7280' }} onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column: Profile + Reputation ────────────── */}
          <div className="lg:col-span-1 space-y-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-[20px] relative overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            >
              <div className="p-6">
                {/* Avatar & Identity */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                    <User className="w-10 h-10 text-[#1E3A8A]" />
                  </div>
                  <h2 className="text-2xl mb-1 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>{profile.name}</h2>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: '#6B7280' }}>
                      <Briefcase className="w-3 h-3 text-[#EA580C]" /> {profile.skill}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: '#6B7280' }}>
                      <MapPin className="w-3 h-3 text-[#EA580C]" /> {profile.city}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981', animation: 'pulse-dot 2s infinite' }} />
                    <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: '#059669' }}>On-Chain Verified</span>
                  </div>
                </div>

                {/* Reputation Score */}
                <div className="text-center mb-6">
                  <div className="w-28 h-28 rounded-full mx-auto flex items-center justify-center relative mb-4">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 112 112">
                      <circle cx="56" cy="56" r="50" fill="none" stroke="#F3F4F6" strokeWidth="5" />
                      <circle cx="56" cy="56" r="50" fill="none" stroke="url(#profileScoreGrad)" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${((reputation?.average || 0) / 5) * 314} 314`} />
                      <defs>
                        <linearGradient id="profileScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#1E3A8A" />
                          <stop offset="100%" stopColor="#EA580C" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="text-center z-10">
                      <div className="text-3xl font-bold tracking-tight text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>{reputation?.average || '0.0'}</div>
                      <div className="label-mono mt-0.5 text-gray-500">Rating</div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4" style={{ color: s <= Math.floor(reputation?.average || 0) ? '#FBBF24' : '#E5E7EB', fill: s <= Math.floor(reputation?.average || 0) ? '#FBBF24' : 'none' }} />
                    ))}
                  </div>
                  <p className="label-mono" style={{ color: '#6B7280' }}>{reputation?.total || 0} Endorsements</p>
                </div>

                {/* Star Breakdown */}
                <div className="space-y-2 mb-6">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2.5">
                      <span className="text-[10px] font-bold w-5 text-right" style={{ color: '#4B5563' }}>{star}★</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${reputation?.breakdown[star] || 0}%` }} transition={{ duration: 1, delay: 0.5 + star * 0.1, ease: [0.23, 1, 0.32, 1] }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #1E3A8A, #EA580C)' }} />
                      </div>
                      <span className="text-[9px] font-bold w-7 text-right" style={{ color: '#4B5563' }}>{reputation?.breakdown[star] || 0}%</span>
                    </div>
                  ))}
                </div>

                {/* Wallet */}
                <div className="pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
                  <p className="label-mono mb-2 text-gray-500">Stellar Address</p>
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    <span className="text-[10px] font-mono font-bold font-medium truncate flex-1" style={{ color: '#4B5563' }}>{address}</span>
                    <button onClick={copyAddress} className="shrink-0 transition-colors hover:bg-gray-200 p-1 rounded">
                      {copiedAddr ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" style={{ color: '#6B7280' }} />}
                    </button>
                  </div>
                  <a href={`https://stellar.expert/explorer/testnet/address/${address}`} target="_blank" rel="noopener noreferrer" className="mt-2.5 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all label-mono text-[#4B5563] hover:text-[#1E3A8A] font-bold" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    Explorer <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <Link to={`/endorse?address=${address}`} className="mt-2.5 w-full block">
                    <div className="shiny-border">
                      <div className="shiny-border-inner w-full py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-white flex items-center justify-center gap-2">
                        <Award className="w-3.5 h-3.5" /> Endorse Worker
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right Column: Bio, Actions, Endorsements ─────── */}
          <div className="lg:col-span-2 flex flex-col h-[650px] lg:h-[800px] overflow-hidden">
            <div className="space-y-4 flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#E5E7EB transparent' }}>
              
              {/* Identity Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: [0.23, 1, 0.32, 1] }} className="rounded-[20px] relative overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div className="p-6 sm:p-8">
                  <div className="mb-6 pb-6" style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <h1 className="text-4xl mb-3 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>{profile.name}</h1>
                    <div className="flex flex-wrap gap-4 items-center mb-4">
                      <span className="flex items-center gap-1.5 label-mono" style={{ color: '#6B7280' }}>
                        <Briefcase className="w-3.5 h-3.5 text-[#EA580C]" /> {profile.skill}
                      </span>
                      <span className="flex items-center gap-1.5 label-mono" style={{ color: '#6B7280' }}>
                        <MapPin className="w-3.5 h-3.5 text-[#EA580C]" /> {profile.city}
                      </span>
                      {profile.experience > 0 && (
                        <span className="flex items-center gap-1.5 label-mono" style={{ color: '#6B7280' }}>
                          <Calendar className="w-3.5 h-3.5 text-[#EA580C]" /> {profile.experience} Yrs
                        </span>
                      )}
                    </div>
                    <p className="text-base leading-relaxed italic max-w-2xl" style={{ color: '#4B5563', fontWeight: 400 }}>
                      "{profile.bio}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleShare} className="flex-1 min-w-[160px] py-3.5 rounded-full transition-all flex items-center justify-center gap-2.5 label-mono group hover:bg-gray-100" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#4B5563' }}>
                      {copied ? <><Check className="w-3.5 h-3.5 text-[#10B981]" /> Copied!</> : <><Share2 className="w-3.5 h-3.5 text-[#1E3A8A]" /> Share Profile</>}
                    </button>
                    <button onClick={() => navigate(`/endorse?address=${profile.address}`)} className="flex-1 min-w-[160px] active:scale-[0.98]">
                      <div className="shiny-border">
                        <div className="shiny-border-inner w-full py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white flex items-center justify-center gap-2.5">
                          <Award className="w-3.5 h-3.5" /> Endorse Worker
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* On-Chain Credentials */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <h3 className="text-2xl text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>On-Chain Credentials</h3>
                  <span className="label-mono px-2.5 py-0.5 rounded-full text-gray-500" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    {credentialHistory.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {credentialHistory.length > 0 ? credentialHistory
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((cred, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.05, ease: [0.23, 1, 0.32, 1] }} className="p-5 rounded-[20px] group transition-all" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }} onMouseEnter={e => {e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; e.currentTarget.style.borderColor = '#1E3A8A'}} onMouseLeave={e => {e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02)'; e.currentTarget.style.borderColor = '#E5E7EB'}}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                              <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
                            </div>
                            <div>
                              <span className="label-mono block mb-0.5 text-gray-500">Soroban Contract Event</span>
                              <span className="text-xs font-mono font-bold" style={{ color: '#EA580C' }}>{cred.credentialType || cred.type || 'Verified Interaction'}</span>
                            </div>
                          </div>
                          {cred.successful !== false && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
                              <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                              <span className="text-[9px] font-bold text-[#059669] uppercase tracking-wider pr-1">Minted</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #E5E7EB' }}>
                          <span className="text-[9px] font-bold flex items-center gap-1.5" style={{ color: '#6B7280' }}>
                            <Calendar className="w-2.5 h-2.5" />
                            {new Date(cred.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {cred.txHash && (
                            <a href={`https://stellar.expert/explorer/testnet/tx/${cred.txHash}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors" style={{ color: '#4B5563' }} onMouseEnter={e => e.currentTarget.style.color = '#1E3A8A'} onMouseLeave={e => e.currentTarget.style.color = '#4B5563'}>
                              View Explorer <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )) : (
                    <div className="p-10 text-center rounded-[20px]" style={{ border: '1px dashed #E5E7EB', background: '#F9FAFB' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                        <Award className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="label-mono mb-1 text-gray-500 font-bold">No Credentials Yet</p>
                      <p className="text-[10px]" style={{ color: '#6B7280', fontWeight: 400 }}>Be the first to endorse this worker</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Endorsements Feedback */}
              {endorsements.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5, ease: [0.23, 1, 0.32, 1] }} className="mt-4 pb-4">
                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <h3 className="text-2xl text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Endorsement Feedback</h3>
                    <span className="label-mono px-2.5 py-0.5 rounded-full text-gray-500" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                      {endorsements.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {endorsements
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .map((endorsement, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + idx * 0.05, ease: [0.23, 1, 0.32, 1] }} className="p-5 rounded-[20px] transition-all group" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                                <User className="w-4 h-4 text-gray-400" />
                              </div>
                              <div>
                                <span className="label-mono block mb-0.5 text-gray-500">Endorser Wallet</span>
                                <span className="text-xs font-mono font-bold" style={{ color: '#4B5563' }}>{truncateAddress(endorsement.endorser)}</span>
                              </div>
                            </div>
                            <div className="flex gap-0.5 p-1.5 rounded-md" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} className="w-3 h-3" style={{ color: s <= endorsement.rating ? '#FBBF24' : '#E5E7EB', fill: s <= endorsement.rating ? '#FBBF24' : 'none' }} />
                              ))}
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider mb-2" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280' }}>
                              {endorsement.jobType}
                            </span>
                            <p className="text-[11px] leading-relaxed italic" style={{ color: '#4B5563', fontWeight: 400 }}>"{endorsement.feedback}"</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 pt-4 flex items-center justify-center gap-5 shrink-0" style={{ color: '#6B7280' }}>
          {[ { icon: Globe, text: 'Public Profile' }, { icon: ShieldCheck, text: 'Verified Data' }, { icon: Sparkles, text: 'Stellar Testnet' } ].map((b, i) => (
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

export default WorkerProfile;
