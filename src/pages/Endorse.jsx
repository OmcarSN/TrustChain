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
      toast.success(t('endorse.endorsementSealed'));
    } catch (err) { setError(err.message || 'Transaction failed'); toast.error(err.message || 'Submission failed'); }
    finally { setIsSigning(false); }
  };

  /* Not connected */
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white" style={{ paddingTop: '100px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '56px', height: '56px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Award style={{ width: '24px', height: '24px', color: 'rgba(255,255,255,0.3)' }} />
          </div>
          <h2 className="font-clash" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '900', marginBottom: '8px' }}>{t('endorse.headerTitle')}</h2>
          <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '32px' }}>{t('endorse.headerSubtitle')}</p>
          <button onClick={connect} style={{ width: '100%', padding: '15px', backgroundColor: '#ffffff', color: '#000000', border: 'none', fontSize: '11px', letterSpacing: '3px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase' }}>
            <Wallet style={{ width: '14px', height: '14px' }} /> {t('dashboard.connectBtn')}
          </button>
        </motion.div>
      </div>
    );
  }

  const labelStyle = { fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' };
  const inputStyle = { width: '100%', padding: '11px 14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '13px', outline: 'none' };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '20%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <style>{`
        @keyframes endFadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .end-anim { opacity:0; animation: endFadeUp 0.4s ease forwards; }
        .end-input:focus { border-color: rgba(255,255,255,0.3) !important; }
        .end-input::placeholder { color: rgba(255,255,255,0.2); }
        .end-star { transition: all 0.15s ease; cursor: pointer; }
        .end-star:hover { transform: scale(1.15); }
        .end-find-btn { transition: all 0.2s ease; }
        .end-find-btn:hover { background-color: #e8e8e8 !important; }
        .end-submit:hover:not(:disabled) { background-color: #e8e8e8 !important; transform: translateY(-1px); }
        .end-submit { transition: all 0.2s ease; }
      `}</style>

      <div style={{ paddingTop: '100px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingLeft: '24px', paddingRight: '24px', position: 'relative', zIndex: 10 }}>

        {/* Page Header */}
        <div className="end-anim" style={{ textAlign: 'center', marginBottom: '36px', animationDelay: '0s' }}>
          <p className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>{t('nav.workerPortal')}</p>
          <h1 className="font-clash" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '900', color: '#ffffff', marginBottom: '6px' }}>{t('endorse.header')}</h1>
          <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>{t('endorse.headerSubtitle')}</p>
        </div>

        {/* Two Column Card */}
        <div className="end-anim" style={{ width: '100%', maxWidth: '900px', display: 'grid', gridTemplateColumns: '300px 1fr', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)', borderTop: '2px solid rgba(255,255,255,0.12)', overflow: 'hidden', animationDelay: '0.15s', animationDuration: '0.5s' }}>

          {/* ═══ LEFT PANEL — Find Worker ═══ */}
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              className="end-input font-inter" style={inputStyle}
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
                <motion.div key="found" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.2)' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>{foundWorker.name}</p>
                      <p className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{foundWorker.skill} · {foundWorker.city}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '9px', letterSpacing: '2px', color: '#00dc6e', backgroundColor: 'rgba(0,220,110,0.08)', border: '1px solid rgba(0,220,110,0.25)', padding: '3px 10px', fontWeight: '700', textTransform: 'uppercase' }} className="font-inter">● {t('discover.verified')}</span>
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
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
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
            <div style={{ fontSize: '9px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', fontWeight: '700' }} className="font-inter">
              {t('endorse.formTitle')}
            </div>

            {/* Rating */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="font-inter" style={labelStyle}><Star style={{ width: '12px', height: '12px' }} /> {t('endorse.ratingFieldLabel')}</label>
                {activeStarValue > 0 && <span className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px' }}>{ratingLabels[activeStarValue]}</span>}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)}
                    className="end-star" style={{ background: 'none', border: 'none', padding: '4px' }}>
                    <Star style={{ width: '22px', height: '22px', color: activeStarValue >= s ? '#f5a623' : 'rgba(255,255,255,0.15)', fill: activeStarValue >= s ? '#f5a623' : 'transparent' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="font-inter" style={labelStyle}><Briefcase style={{ width: '12px', height: '12px' }} /> {t('jobTypes.label')}</label>
              <div style={{ position: 'relative' }}>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="end-input font-inter"
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
                <span className="font-inter" style={{ fontSize: '10px', color: feedback.length >= 20 ? 'rgba(0,220,110,0.5)' : 'rgba(255,255,255,0.2)', fontVariantNumeric: 'tabular-nums' }}>{feedback.length}/300</span>
              </div>
              <textarea value={feedback} onChange={(e) => e.target.value.length <= 300 && setFeedback(e.target.value)}
                placeholder={t('endorse.placeholderFeedback')}
                className="end-input font-inter" style={{ ...inputStyle, minHeight: '100px', resize: 'none', lineHeight: '1.6' }} />
              {feedback.length > 0 && feedback.length < 20 && (
                <p className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap style={{ width: '10px', height: '10px' }} /> {20 - feedback.length} {t('endorse.moreCharsNeeded', { count: 20 - feedback.length })}
                </p>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
              {/* Feature tags */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                {[
                  { icon: ShieldCheck, text: t('endorse.badgeOnChain') },
                  { icon: Clock, text: t('endorse.badgePermanent') },
                  { icon: Sparkles, text: t('endorse.badgeStellar') },
                ].map((b, i) => (
                  <span key={i} className="font-inter" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase' }}>
                    <b.icon style={{ width: '10px', height: '10px', color: 'rgba(255,255,255,0.15)' }} /> {b.text}
                  </span>
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
                  <motion.button key="submit" onClick={handleEndorse} disabled={!canSubmit || isSigning} className="end-submit font-inter"
                    style={{
                      width: '100%', padding: '15px',
                      backgroundColor: canSubmit ? '#ffffff' : 'rgba(255,255,255,0.05)',
                      color: canSubmit ? '#000000' : 'rgba(255,255,255,0.2)',
                      fontSize: '11px', letterSpacing: '3px', fontWeight: canSubmit ? '800' : '600',
                      border: canSubmit ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      cursor: canSubmit ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      textTransform: 'uppercase',
                    }}>
                    {isSigning ? <><Loader2 style={{ width: '14px', height: '14px' }} className="animate-spin" /> {t('registration.btnMinting')}...</>
                      : canSubmit ? <>{t('endorse.btnSubmit')} <ShieldCheck style={{ width: '14px', height: '14px' }} /></>
                      : <span>{t('endorse.completeAllFields')}</span>}
                  </motion.button>
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
