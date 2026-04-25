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
import { notifyStatsUpdated } from '../hooks/usePlatformStats';

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
      notifyStatsUpdated();
      toast.success(t('endorse.endorsementSealed'));
    } catch (err) { setError(err.message || 'Transaction failed'); toast.error(err.message || 'Submission failed'); }
    finally { setIsSigning(false); }
  };

  /* Not connected */
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px' }}>
        <style>{`
          @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes iconPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.05); } 50% { box-shadow: 0 0 0 12px rgba(255,255,255,0); } }
          @keyframes btnPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,0); } }
          @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
          .conn-anim { opacity: 0; animation: fadeSlideUp 0.6s ease forwards; }
          .shimmer-text { background: linear-gradient(to right, #ffffff 20%, #888888 50%, #ffffff 80%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; animation: shimmer 3s linear infinite; }
          .conn-btn { transition: all 0.25s ease; animation: btnPulse 2.5s ease infinite; }
          .conn-btn:hover { background-color: rgba(220,220,220,1) !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.15) !important; }
        `}</style>

        {/* Background Graphics */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,110,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="text-center" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
          
          <div className="conn-anim" style={{ width: '72px', height: '72px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', animation: 'iconPulse 3s ease infinite, fadeSlideUp 0.6s ease forwards', animationDelay: '0s, 0.1s', borderRadius: '2px' }}>
            <Award style={{ width: '28px', height: '28px', color: 'rgba(255,255,255,0.5)' }} />
          </div>

          <h2 className="font-clash shimmer-text conn-anim" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', letterSpacing: '-0.02em', lineHeight: '1.1', textAlign: 'center', marginBottom: '12px', animationDelay: '0.2s' }}>{t('endorse.headerTitle')}</h2>
          
          <p className="font-inter conn-anim" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', marginBottom: '32px', maxWidth: '400px', textAlign: 'center', lineHeight: '1.6', animationDelay: '0.3s' }}>{t('endorse.headerSubtitle')}</p>
          
          <div className="conn-anim" style={{ animationDelay: '0.4s' }}>
            <button onClick={connect} className="conn-btn font-inter" style={{ padding: '14px 40px', backgroundColor: '#ffffff', color: '#000000', border: 'none', fontWeight: '800', fontSize: '13px', letterSpacing: '2px', cursor: 'pointer', borderRadius: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase' }}>
              <Wallet style={{ width: '16px', height: '16px' }} /> {t('dashboard.connectBtn')}
            </button>
          </div>

          <div className="conn-anim font-inter" style={{ display: 'flex', gap: '32px', marginTop: '40px', opacity: 0.35, animationDelay: '0.6s' }}>
            <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>✓ ON-CHAIN RECORD</span>
            <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>✓ PERMANENT</span>
            <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>✓ STELLAR SOROBAN</span>
          </div>

        </div>
      </div>
    );
  }

  const labelStyle = { fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' };
  const inputStyle = { outline: 'none' };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '20%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); filter: blur(3px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes workerCardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes starPop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        @keyframes btnPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,0); } }
        .end-anim { opacity: 0; animation: fadeSlideUp 0.6s ease forwards; }
        .end-panel-anim { opacity: 0; animation: fadeSlideUp 0.5s 0.2s ease forwards; }
        .end-input { transition: all 0.2s ease; border: 1px solid rgba(255,255,255,0.15); background-color: rgba(255,255,255,0.03); color: #ffffff; }
        .end-input:focus { border-color: rgba(255,255,255,0.3) !important; box-shadow: 0 0 16px rgba(255,255,255,0.04) !important; }
        .end-input-dropdown { border: 1px solid rgba(255,255,255,0.12) !important; background-color: rgba(255,255,255,0.04) !important; color: rgba(255,255,255,0.6) !important; }
        .end-input-textarea { border: 1px solid rgba(255,255,255,0.1) !important; background-color: rgba(255,255,255,0.03) !important; color: #ffffff !important; line-height: 1.6; resize: vertical !important; min-height: 120px !important; }
        .end-input-textarea:focus { box-shadow: 0 0 20px rgba(255,255,255,0.03) !important; }
        .end-input::placeholder { color: rgba(255,255,255,0.2); }
        .end-star { transition: 0.15s ease; cursor: pointer; color: rgba(255,255,255,0.15); font-size: 28px; }
        .end-star:hover { transform: scale(1.2); color: #f5c518 !important; }
        .star-pop { animation: starPop 0.3s ease; color: #f5c518 !important; }
        .end-find-btn { transition: all 0.2s ease; }
        .end-find-btn:hover { background-color: #e8e8e8 !important; box-shadow: 0 0 20px rgba(255,255,255,0.1); transform: translateY(-1px); }
        .end-submit { transition: all 0.3s ease; }
        .end-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.15); background-color: #e8e8e8 !important; }
        .spinner { animation: spin 0.8s linear infinite; }
        .shimmer-text { background: linear-gradient(to right, #ffffff 20%, #888888 50%, #ffffff 80%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; animation: shimmer 3s linear infinite; }
        .pulse-glow { box-shadow: 0 0 8px rgba(0,220,110,0.4); animation: pulseGlow 2s infinite; }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 8px rgba(0,220,110,0.2); } 50% { box-shadow: 0 0 12px rgba(0,220,110,0.6); } 100% { box-shadow: 0 0 8px rgba(0,220,110,0.2); } }
        .worker-card-anim { animation: workerCardIn 0.4s ease forwards; }
        .badge-fade-in { opacity: 0; animation: fadeSlideUp 0.6s ease forwards; animation-delay: 0.6s; }
        @keyframes verifiedPulse { 0% { box-shadow: 0 0 0 0 rgba(0,220,110, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(0,220,110, 0); } 100% { box-shadow: 0 0 0 0 rgba(0,220,110, 0); } }
      `}</style>

      <div className="px-4 md:px-10" style={{ paddingTop: '24px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', position: 'relative', zIndex: 10 }}>

        {/* Page Header */}
        <div className="end-anim" style={{ textAlign: 'center', marginBottom: '16px', paddingTop: '72px', paddingBottom: '16px', animationDelay: '0s' }}>
          <p className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>{t('nav.workerPortal')}</p>
          <h1 className="font-clash shimmer-text" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '900', marginBottom: '6px' }}>{t('endorse.header')}</h1>
          <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '12px' }}>{t('endorse.headerSubtitle')}</p>
        </div>

        {/* Two Column Card */}
        <div className="end-panel-anim w-full max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-[1fr_2fr]" style={{ gap: '0', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', borderTop: '2px solid rgba(255,255,255,0.15)', position: 'relative', zIndex: 1 }}>

          {/* ═══ LEFT PANEL — Find Worker ═══ */}
          <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Panel header */}
            <div style={{ ...labelStyle, marginBottom: '0' }}>
              <Search style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.2)' }} />
              {t('endorse.findWorkerLabel')}
            </div>

            {/* Search input */}
            <input
              type="text" placeholder={t('endorse.searchPlaceholder')} value={workerSearch}
              onChange={(e) => setWorkerSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="end-input font-inter w-full px-3 py-2.5 text-sm" style={inputStyle}
            />

            {/* Find Worker button */}
            <button onClick={handleSearch} disabled={isSearching || !workerSearch} className="end-find-btn font-inter"
              style={{ padding: '10px 16px', backgroundColor: '#ffffff', color: '#000000', border: 'none', fontSize: '11px', letterSpacing: '2px', fontWeight: '700', width: '100%', cursor: !workerSearch ? 'not-allowed' : 'pointer', opacity: !workerSearch ? 0.4 : 1, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {isSearching ? <Loader2 style={{ width: '14px', height: '14px' }} className="animate-spin" /> : <><Search style={{ width: '12px', height: '12px' }} /> {t('endorse.findWorkerLabel')}</>}
            </button>

            {error && (
              <p className="font-inter" style={{ color: 'rgba(255,80,80,0.8)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle style={{ width: '12px', height: '12px', flexShrink: 0 }} /> {error}
              </p>
            )}

            {/* Worker card or empty state */}
            <AnimatePresence mode="wait">
              {foundWorker ? (
                <motion.div key="found" className="worker-card-anim" exit={{ opacity: 0 }}
                  style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.2)' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>{foundWorker.name}</p>
                      <p className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{foundWorker.skill} · {foundWorker.city}</p>
                    </div>
                  </div>
                  <span className="font-inter pulse-glow" style={{ display: 'inline-block', fontSize: '9px', letterSpacing: '2px', color: '#00dc6e', backgroundColor: 'rgba(0,220,110,0.08)', border: '1px solid rgba(0,220,110,0.25)', padding: '3px 10px', fontWeight: '700', textTransform: 'uppercase' }}>● {t('discover.verified')}</span>
                  
                  {/* Add below the VERIFIED badge in the left column */}

                  {/* Divider */}
                  <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', margin:'16px 0' }} />

                  {/* Why endorse section */}
                  <div style={{ padding:'0 4px' }}>
                    <p className="font-inter" style={{
                      fontSize: '10px', letterSpacing: '3px',
                      color: 'rgba(255,255,255,0.25)', marginBottom: '12px',
                      fontWeight: '700'
                    }}>
                      WHY THIS MATTERS
                    </p>

                    {/* 3 info points */}
                    {[
                      { icon: '🔒', text: 'Stored on Stellar blockchain' },
                      { icon: '✓',  text: 'Tamper-proof record' },
                      { icon: '⚡', text: 'Gasless via Soroban' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontSize:'14px', flexShrink:0, marginTop:'1px' }}>{item.icon}</span>
                        <span className="font-inter" style={{
                          fontSize: '11px', color: 'rgba(255,255,255,0.4)',
                          lineHeight: '1.5'
                        }}>{item.text}</span>
                      </div>
                    ))}

                    {/* Divider */}
                    <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', margin:'16px 0' }} />

                    {/* On-chain badge */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 12px',
                      border: '1px solid rgba(0,220,110,0.15)',
                      backgroundColor: 'rgba(0,220,110,0.04)',
                    }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: '#00dc6e',
                        boxShadow: '0 0 6px rgba(0,220,110,0.6)',
                        animation: 'verifiedPulse 2s ease infinite',
                        flexShrink: 0
                      }} />
                      <span className="font-inter" style={{
                        fontSize: '10px', letterSpacing: '1.5px',
                        color: 'rgba(0,220,110,0.7)',
                        fontWeight: '700'
                      }}>
                        STELLAR TESTNET ACTIVE
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
                  <div style={{ width: '56px', height: '56px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <User style={{ width: '22px', height: '22px', color: 'rgba(255,255,255,0.15)' }} />
                  </div>
                  <p className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>{t('endorse.noWorkerSelected')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ═══ RIGHT PANEL — Form ═══ */}
          <div style={{ padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Locked overlay */}
            <AnimatePresence>
              {!foundWorker && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(5,5,5,0.8)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Search style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.15)' }} />
                  <p className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', fontWeight: '700' }}>{t('endorse.searchByAddress')}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Panel header */}
            <div style={{ ...labelStyle, paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {t('endorse.formTitle')}
            </div>

            {/* Rating */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="font-inter" style={labelStyle}><Star style={{ width: '12px', height: '12px' }} /> {t('endorse.ratingFieldLabel')}</label>
                {activeStarValue > 0 && <span className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px' }}>{ratingLabels[activeStarValue]}</span>}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1,2,3,4,5].map(s => {
                  const isActive = activeStarValue >= s;
                  const isSelected = rating >= s;
                  return (
                    <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)}
                      className={`end-star ${isSelected ? 'star-pop' : ''}`} style={{ background: 'none', border: 'none', padding: '4px' }}>
                      <Star style={{ width: '22px', height: '22px', color: isActive ? '#f5c518' : 'rgba(255,255,255,0.15)', fill: isActive ? '#f5c518' : 'transparent' }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="font-inter" style={labelStyle}><Briefcase style={{ width: '12px', height: '12px' }} /> {t('jobTypes.label')}</label>
              <div style={{ position: 'relative' }}>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="end-input end-input-dropdown font-inter w-full px-3 py-2.5 text-sm"
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '32px' }}>
                  <option value="" disabled>{t('endorse.selectJobType')}</option>
                  <option value="One-time Job" style={{ backgroundColor: '#0a0a0a' }}>{t('jobTypes.One-time Job')}</option>
                  <option value="Recurring" style={{ backgroundColor: '#0a0a0a' }}>{t('jobTypes.Recurring')}</option>
                  <option value="Contract" style={{ backgroundColor: '#0a0a0a' }}>{t('jobTypes.Contract')}</option>
                  <option value="Freelance" style={{ backgroundColor: '#0a0a0a' }}>{t('jobTypes.Freelance')}</option>
                  <option value="Full-time" style={{ backgroundColor: '#0a0a0a' }}>{t('jobTypes.Full-time')}</option>
                </select>
                <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Review Textarea */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="font-inter" style={labelStyle}><PenLine style={{ width: '12px', height: '12px' }} /> {t('endorse.reviewLabel')}</label>
                <span className="font-inter" style={{ fontSize: '10px', color: feedback.length === 300 ? '#ff4444' : feedback.length > 250 ? '#f5c518' : 'rgba(255,255,255,0.25)', fontVariantNumeric: 'tabular-nums' }}>{feedback.length}/300</span>
              </div>
              <textarea value={feedback} onChange={(e) => e.target.value.length <= 300 && setFeedback(e.target.value)}
                placeholder={t('endorse.placeholderFeedback')}
                className="end-input end-input-textarea font-inter w-full px-3 py-2.5 text-sm" style={{ ...inputStyle }} />
              {feedback.length > 0 && feedback.length < 20 && (
                <p className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap style={{ width: '10px', height: '10px' }} /> {20 - feedback.length} {t('endorse.moreCharsNeeded', { count: 20 - feedback.length })}
                </p>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
              {/* Feature tags */}
              <div className="badge-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px' }}>
                {[
                  { icon: ShieldCheck, text: t('endorse.badgeOnChain'), color: '#00dc6e' },
                  { icon: Clock, text: t('endorse.badgePermanent'), color: '#ffffff' },
                  { icon: Sparkles, text: t('endorse.badgeStellar'), color: '#4b9fff' },
                ].map((b, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="font-inter" style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase' }}>
                      <b.icon style={{ width: '12px', height: '12px', color: b.color }} /> {b.text}
                    </span>
                    {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Submit / Success */}
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ border: '1px solid rgba(0,220,110,0.15)', backgroundColor: 'rgba(0,220,110,0.03)', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <CheckCircle2 style={{ width: '18px', height: '18px', color: '#00dc6e' }} />
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{t('endorse.endorsementRecorded')}</h4>
                        <p className="font-inter" style={{ fontSize: '10px', color: 'rgba(0,220,110,0.5)' }}>{t('endorse.sealedOnStellar')}</p>
                      </div>
                    </div>
                    <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>{txHash}</span>
                    </div>
                    <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', textDecoration: 'none', textTransform: 'uppercase', fontWeight: '700' }} className="font-inter">
                      <ExternalLink style={{ width: '12px', height: '12px' }} /> {t('endorse.viewOnExplorer')}
                    </a>
                  </motion.div>
                ) : (
                  <button key="submit" onClick={handleEndorse} disabled={!canSubmit || isSigning} className="end-submit font-inter"
                    style={{
                      width: '100%', padding: '16px',
                      backgroundColor: canSubmit ? '#ffffff' : 'rgba(255,255,255,0.08)',
                      color: canSubmit ? '#000000' : 'rgba(255,255,255,0.3)',
                      fontSize: '13px', letterSpacing: '2.5px', fontWeight: '800',
                      border: 'none',
                      cursor: canSubmit ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      marginTop: '20px',
                      animation: canSubmit ? 'btnPulse 2.5s ease infinite' : 'none'
                    }}>
                    {isSigning ? <><Loader2 style={{ width: '14px', height: '14px', display: 'inline', verticalAlign: 'text-bottom' }} className="spinner" /> SUBMITTING...</>
                      : <>⚡ SUBMIT ENDORSEMENT ON-CHAIN</>}
                  </button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Endorse;
