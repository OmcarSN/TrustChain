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

/* ── Floating Orb ─────────────────────────────────────────────── */
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none -z-10 ${className}`}
    animate={{ y: [0, -15, 0], scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

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
        // 1. Fetch credentials from Horizon instead of direct Soroban contract call
        const credentials = await fetchCredentialsByWallet(address);
        
        if (!credentials || credentials.length === 0) {
          throw new Error('Worker profile not found on-chain. No active credentials detected.');
        }

        setCredentialHistory(credentials);
        const firstResult = credentials[0]; // Most recent credential action

        // 2. Fetch local endorsement history for reputation scores
        const localKey = `endorsements_${address}`;
        const endorse = JSON.parse(localStorage.getItem(localKey) || '[]');
        const rep = calculateScore(endorse);

        // 3. Merge on-chain data with local metadata to ensure rich UI profile
        const localDataStr = localStorage.getItem(`trustchain_worker_${address}`);
        const localData = localDataStr ? JSON.parse(localDataStr) : {};

        const mergedProfile = {
          ...firstResult, // Pulls timestamp, txHash, credentialType, etc.
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
      <div className="min-h-screen bg-background pt-20 pb-8 px-4 sm:px-6 relative overflow-hidden">
        <FloatingOrb className="w-[600px] h-[400px] bg-accent/5 blur-[150px] top-20 left-1/3" />
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-accent transition-colors font-bold text-xs group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="p-8 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-20 h-20 rounded-2xl bg-white/[0.04] mx-auto mb-5" />
                <div className="h-6 bg-white/[0.04] rounded-lg w-2/3 mx-auto mb-3" />
                <div className="h-3 bg-white/[0.04] rounded-lg w-1/2 mx-auto mb-6" />
                <div className="space-y-2.5">{[1,2,3,4,5].map(i => <div key={i} className="h-2 bg-white/[0.04] rounded-full" />)}</div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="p-10 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="h-8 bg-white/[0.04] rounded-xl w-1/2 mb-5" />
                <div className="h-3 bg-white/[0.04] rounded-lg w-full mb-2" />
                <div className="h-3 bg-white/[0.04] rounded-lg w-3/4 mb-8" />
                <div className="flex gap-3"><div className="h-12 bg-white/[0.04] rounded-xl flex-1" /><div className="h-12 bg-white/[0.04] rounded-xl flex-1" /></div>
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
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center px-6 relative overflow-hidden">
        <FloatingOrb className="w-[500px] h-[500px] bg-red-900/5 blur-[120px] top-1/4 left-1/2 -translate-x-1/2" />
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md p-10 rounded-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(239,68,68,0.05) 0%, rgba(255,255,255,0.03) 100%)',
             border: '1px solid rgba(239,68,68,0.1)',
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-black mb-2 tracking-tight">Profile Not Found</h2>
          <p className="text-white/30 mb-3 font-medium text-sm">{error}</p>
          <p className="text-white/15 font-mono text-[10px] mb-6 truncate px-4">{address}</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/verify" className="w-full py-3.5 bg-gradient-to-r from-accent to-purple-700 text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Verify Page
            </Link>
            <Link to="/" className="w-full py-3.5 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Profile View ──────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 sm:px-6 relative overflow-hidden text-white">
      {/* Background */}
      <FloatingOrb className="w-[700px] h-[500px] bg-accent/5 blur-[160px] top-10 right-1/4" />
      <FloatingOrb className="w-[400px] h-[400px] bg-purple-800/5 blur-[120px] bottom-20 left-10" delay={3} />
      <div className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)`,
          backgroundSize: '70px 70px',
        }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-accent transition-colors font-bold text-xs group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column: Profile + Reputation ────────────── */}
          <div className="lg:col-span-1 space-y-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(124,58,237,0.06) 0%, rgba(255,255,255,0.03) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Top accent */}
              <div className="h-1 bg-gradient-to-r from-accent via-purple-500 to-accent/30" />
              <motion.div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              <div className="p-6">
                {/* Avatar & Identity */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-800/20 flex items-center justify-center border border-accent/15 mx-auto mb-4 shadow-[0_8px_24px_rgba(124,58,237,0.12)]">
                    <User className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="text-xl font-black mb-1 tracking-tight">{profile.name}</h2>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className="flex items-center gap-1 text-white/35 text-[11px] font-semibold">
                      <Briefcase className="w-3 h-3 text-accent/60" /> {profile.skill}
                    </span>
                    <span className="flex items-center gap-1 text-white/35 text-[11px] font-semibold">
                      <MapPin className="w-3 h-3 text-accent/60" /> {profile.city}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/12 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-green-400">On-Chain Verified</span>
                  </div>
                </div>

                {/* Reputation Score */}
                <div className="text-center mb-6">
                  <div className="w-28 h-28 rounded-full mx-auto flex items-center justify-center relative mb-4">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 112 112">
                      <circle cx="56" cy="56" r="50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
                      <circle 
                        cx="56" cy="56" r="50" fill="none" 
                        stroke="url(#profileScoreGrad)" 
                        strokeWidth="5" 
                        strokeLinecap="round"
                        strokeDasharray={`${((reputation?.average || 0) / 5) * 314} 314`}
                      />
                      <defs>
                        <linearGradient id="profileScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="text-center z-10">
                      <div className="text-3xl font-black tracking-tighter">{reputation?.average || '0.0'}</div>
                      <div className="text-[7px] font-bold uppercase tracking-[0.25em] text-white/18 mt-0.5">Rating</div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.floor(reputation?.average || 0) ? 'text-amber-400 fill-amber-400' : 'text-white/5'}`} />
                    ))}
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/18">{reputation?.total || 0} Endorsements</p>
                </div>

                {/* Star Breakdown */}
                <div className="space-y-2 mb-6">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2.5">
                      <span className="text-[9px] font-bold text-white/20 w-5 text-right">{star}★</span>
                      <div className="flex-1 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${reputation?.breakdown[star] || 0}%` }}
                          transition={{ duration: 1, delay: 0.5 + star * 0.1 }}
                          className="h-full bg-gradient-to-r from-accent to-purple-400 rounded-full" 
                        />
                      </div>
                      <span className="text-[9px] font-bold text-white/15 w-7 text-right">{reputation?.breakdown[star] || 0}%</span>
                    </div>
                  ))}
                </div>

                {/* Wallet */}
                <div className="pt-4 border-t border-white/[0.04]">
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/12 mb-2">Stellar Address</p>
                  <div className="flex items-center gap-2 p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.03]">
                    <span className="text-[9px] font-mono text-white/20 truncate flex-1">{address}</span>
                    <button onClick={copyAddress} className="shrink-0">
                      {copiedAddr ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/15 hover:text-accent transition-colors" />}
                    </button>
                  </div>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/address/${address}`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-2.5 flex items-center justify-center gap-2 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg border border-white/[0.04] transition-all text-[8px] font-bold uppercase tracking-wider text-white/25 group"
                  >
                    Explorer <ExternalLink className="w-2.5 h-2.5 group-hover:scale-110 transition-transform" />
                  </a>
                  <Link
                    to="/endorse"
                    className="mt-2 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-lg font-black uppercase tracking-[0.15em] text-[9px] transition-all shadow-lg shadow-accent/20 active:scale-[0.97]"
                  >
                    <Award className="w-3.5 h-3.5" /> Endorse This Worker
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right Column: Bio, Actions, Endorsements & Credentials ─────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Identity Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="p-6 sm:p-8">
                <div className="mb-6 pb-6 border-b border-white/[0.04]">
                  <h1 className="text-3xl font-black mb-3 tracking-tight">{profile.name}</h1>
                  <div className="flex flex-wrap gap-4 items-center mb-4">
                    <span className="flex items-center gap-1.5 text-white/40 text-[11px] font-bold uppercase tracking-wider">
                      <Briefcase className="w-3.5 h-3.5 text-accent" /> {profile.skill}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/40 text-[11px] font-bold uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-accent" /> {profile.city}
                    </span>
                    {profile.experience > 0 && (
                      <span className="flex items-center gap-1.5 text-white/40 text-[11px] font-bold uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-accent" /> {profile.experience} Yrs
                      </span>
                    )}
                  </div>
                  <p className="text-base text-white/35 leading-relaxed font-medium italic max-w-2xl">
                    "{profile.bio}"
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleShare}
                    className="flex-1 min-w-[160px] py-3.5 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl font-black uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2.5 active:scale-95 group"
                  >
                    {copied 
                      ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</>
                      : <><Share2 className="w-3.5 h-3.5 text-accent group-hover:rotate-12 transition-transform" /> Share Profile</>
                    }
                  </button>
                  <button
                    onClick={() => navigate(`/endorse`)}
                    className="flex-1 min-w-[160px] py-3.5 bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-accent/15 active:scale-95 group"
                  >
                    <Award className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Endorse Worker
                  </button>
                </div>
              </div>
            </motion.div>

            {/* On-Chain Credential History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 ml-1 mb-5">
                <div className="w-1.5 h-6 bg-gradient-to-b from-accent to-purple-600 rounded-full" />
                <h3 className="text-lg font-black tracking-tight">On-Chain Credentials</h3>
                <span className="ml-auto text-[9px] font-bold text-white/12 bg-white/[0.03] px-2 py-0.5 rounded-md">{credentialHistory.length}</span>
              </div>

              <div className="space-y-3">
                {credentialHistory.length > 0 ? credentialHistory
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((cred, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.06 }}
                      className="p-5 rounded-xl transition-all group"
                      style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/12">
                            <ShieldCheck className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/18 block">Soroban Contract Event</span>
                            <span className="text-xs font-mono font-semibold text-white/40">{cred.credentialType || cred.type || 'Verified Interaction'}</span>
                          </div>
                        </div>
                        {cred.successful !== false && (
                          <div className="flex items-center gap-1 p-1.5 bg-green-500/10 border border-green-500/20 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider pr-1">Minted</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
                        <span className="text-[9px] font-semibold text-white/12 flex items-center gap-1.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(cred.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {cred.txHash && (
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${cred.txHash}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-white/12 hover:text-accent transition-colors"
                          >
                            View Explorer <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )) : (
                  <div className="p-10 text-center rounded-xl border border-dashed border-white/[0.05]">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.02] flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 text-white/[0.06]" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/15 mb-1">No Credentials Yet</p>
                    <p className="text-[10px] text-white/8 font-medium">Be the first to endorse this worker</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Endorsement Feedback History */}
            {endorsements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <div className="flex items-center gap-3 ml-1 mb-5">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
                  <h3 className="text-lg font-black tracking-tight">Endorsement Feedback</h3>
                  <span className="ml-auto text-[9px] font-bold text-white/12 bg-white/[0.03] px-2 py-0.5 rounded-md">{endorsements.length}</span>
                </div>

                <div className="space-y-3">
                  {endorsements
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((endorsement, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.06 }}
                        className="p-5 rounded-xl transition-all group"
                        style={{
                          background: 'rgba(255,255,255,0.015)',
                          border: '1px solid rgba(255,255,255,0.03)',
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
                              <User className="w-4 h-4 text-white/30" />
                            </div>
                            <div>
                              <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/18 block">Endorser Wallet</span>
                              <span className="text-xs font-mono font-semibold text-white/40">{truncateAddress(endorsement.endorser)}</span>
                            </div>
                          </div>
                          <div className="flex gap-0.5 p-1.5 bg-white/[0.02] rounded-md">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= endorsement.rating ? 'text-amber-400 fill-amber-400' : 'text-white/5'}`} />
                            ))}
                          </div>
                        </div>

                        <div className="mb-3">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[8px] font-bold uppercase tracking-wider text-white/40 mb-2">
                            {endorsement.jobType}
                          </span>
                          <p className="text-[11px] text-white/30 leading-relaxed italic">"{endorsement.feedback}"</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-5 text-white/10"
        >
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <Globe className="w-3 h-3" /> Public Profile
          </div>
          <div className="w-1 h-1 rounded-full bg-white/5" />
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" /> Verified Data
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

export default WorkerProfile;
