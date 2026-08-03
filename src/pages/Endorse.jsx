import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { fetchWorkerCredential, submitWorkerEndorsement } from '../lib/stellar';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { notifyStatsUpdated } from '../hooks/usePlatformStats';
import { getWorker, getEndorsements, getEndorsementsGiven, addEndorsement } from '../lib/supabaseData';
import { validateWalletAddress } from '../utils/validation';
import ConnectWalletPrompt from '../components/ConnectWalletPrompt';
import WorkerSearchPanel from '../components/endorse/WorkerSearchPanel';
import EndorsementForm from '../components/endorse/EndorsementForm';
import PageBackground from '../components/PageBackground';

/**
 * Endorse — Page for endorsing a registered worker.
 * Manages the full endorsement workflow: wallet search, worker lookup,
 * star rating, job type selection, feedback, and on-chain submission.
 * Delegates rendering to ConnectWalletPrompt, WorkerSearchPanel,
 * and EndorsementForm sub-components.
 *
 * @returns {React.ReactElement} The Endorse page.
 */
const Endorse = () => {
  const toast = useToast();
  const { walletAddress, isConnected } = useWallet();
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
  const [alreadyEndorsed, setAlreadyEndorsed] = useState(false);

  const canSubmit = isConnected && foundWorker && !alreadyEndorsed && rating > 0 && jobType && feedback.length >= 20;

  const handleSearch = async () => {
    if (!validateWalletAddress(workerSearch.trim())) { toast.error(t('endorse.invalidAddress')); return; }
    if (workerSearch.trim() === walletAddress) { toast.error(t('endorse.cannotEndorseSelf')); return; }
    setIsSearching(true); setError(null); setFoundWorker(null); setAlreadyEndorsed(false);
    try {
      const credential = await fetchWorkerCredential(workerSearch.trim());
      const localData = await getWorker(workerSearch.trim());
      if (localData) {
        credential.name = localData.name || localData.fullName || credential.name;
        credential.city = localData.city || credential.city;
        credential.bio = localData.bio || credential.bio;
        credential.skill = localData.skill || localData.skillCategory || credential.skill;
        credential.experience = localData.experience || credential.experience;
        credential.phone = localData.phone || '';
      }
      setFoundWorker({ ...credential, address: workerSearch });

      // Check if this wallet already endorsed this worker
      const prev = await getEndorsements(workerSearch.trim());
      const given = await getEndorsementsGiven(walletAddress);
      if (prev.some(e => e.endorser === walletAddress) || given.some(e => e.worker === workerSearch.trim())) {
        setAlreadyEndorsed(true);
        toast.error(t('endorse.alreadyEndorsed'));
      } else {
        toast.success(t('endorse.workerFound'));
      }
    } catch (err) {
      const localData = await getWorker(workerSearch);
      if (localData) {
        setFoundWorker({ name: localData.name || localData.fullName || 'Worker', skill: localData.skill || localData.skillCategory || '—', city: localData.city || 'Unknown', bio: localData.bio || '', experience: localData.experience || '—', address: workerSearch });

        // Check if this wallet already endorsed this worker
        const prevLocal = await getEndorsements(workerSearch.trim());
        const givenLocal = await getEndorsementsGiven(walletAddress);
        if (prevLocal.some(e => e.endorser === walletAddress) || givenLocal.some(e => e.worker === workerSearch.trim())) {
          setAlreadyEndorsed(true);
          toast.error(t('endorse.alreadyEndorsed'));
        } else {
          toast.success(t('endorse.workerFound'));
        }
      } else { setError(err.message || 'Worker not found'); toast.error(err.message || 'Search failed'); }
    } finally { setIsSearching(false); }
  };

  const handleEndorse = async () => {
    if (!canSubmit) return;

    // Duplicate check 1: Check endorsements received by this worker
    const prev = await getEndorsements(foundWorker.address);
    if (prev.some(e => e.endorser === walletAddress)) { toast.error(t('endorse.alreadyEndorsed')); return; }

    // Duplicate check 2: Check endorsements given BY this wallet (safety net)
    const given = await getEndorsementsGiven(walletAddress);
    if (given.some(e => e.worker === foundWorker.address)) { toast.error(t('endorse.alreadyEndorsed')); return; }
    setIsSigning(true); setError(null);
    try {
      const response = await submitWorkerEndorsement({ worker: foundWorker.address, rating, jobType, feedback }, walletAddress);
      const hash = response.hash;
      setTxHash(hash); setIsSuccess(true);
      const isSaved = await addEndorsement({ endorser: walletAddress, worker: foundWorker.address, rating, jobType, feedback, txHash: hash });
      if (!isSaved) {
        throw new Error("Endorsement sealed on-chain, but failed to sync to the database. Please try refreshing.");
      }
      notifyStatsUpdated();
      toast.success(t('endorse.endorsementSealed'));
    } catch (err) { setError(err.message || 'Transaction failed'); toast.error(err.message || 'Submission failed'); }
    finally { setIsSigning(false); }
  };

  /* Not connected */
  if (!isConnected) {
    return (
      <ConnectWalletPrompt
        icon={<Award style={{ width: '28px', height: '28px', color: 'rgba(255,255,255,0.5)' }} />}
        title={t('endorse.headerTitle')}
        subtitle={t('endorse.headerSubtitle')}
        features={['✓ ON-CHAIN RECORD', '✓ PERMANENT', '✓ STELLAR SOROBAN']}
        borderRadius="14px"
      />
    );
  }

  const labelStyle = { fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' };

  return (
    <div className="min-h-screen bg-[#05060A] relative overflow-hidden text-white">
      {/* Background Graphics */}
      <PageBackground />

      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); filter: blur(3px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes workerCardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes starPop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        @keyframes btnPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,0); } }
        .end-anim { opacity: 0; animation: fadeSlideUp 0.6s ease forwards; }
        .end-panel-anim { opacity: 0; animation: fadeSlideUp 0.5s 0.2s ease forwards; }
        .end-input { transition: all 0.2s ease; border: 1px solid rgba(255,255,255,0.15); background-color: rgba(255,255,255,0.03); color: #ffffff; border-radius: 8px; padding: 14px 16px; font-size: 14px; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .end-input:focus { border-color: rgba(255,255,255,0.3) !important; box-shadow: 0 0 16px rgba(255,255,255,0.04) !important; background-color: rgba(255,255,255,0.06); }
        .end-input-dropdown { border: 1px solid rgba(255,255,255,0.12) !important; background-color: rgba(255,255,255,0.04) !important; color: rgba(255,255,255,0.6) !important; border-radius: 8px !important; padding: 14px 16px !important; backdrop-filter: blur(12px); }
        .end-input-textarea { border: 1px solid rgba(255,255,255,0.1) !important; background-color: rgba(255,255,255,0.03) !important; color: #ffffff !important; line-height: 1.6; resize: vertical !important; min-height: 120px !important; border-radius: 8px !important; padding: 14px 16px !important; backdrop-filter: blur(12px); }
        .end-input-textarea:focus { box-shadow: 0 0 20px rgba(255,255,255,0.03) !important; background-color: rgba(255,255,255,0.06) !important; }
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
        .pulse-glow { box-shadow: 0 0 8px rgba(22,163,74,0.4); animation: pulseGlow 2s infinite; }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 8px rgba(22,163,74,0.2); } 50% { box-shadow: 0 0 12px rgba(22,163,74,0.6); } 100% { box-shadow: 0 0 8px rgba(22,163,74,0.2); } }
        .worker-card-anim { animation: workerCardIn 0.4s ease forwards; }
        .badge-fade-in { opacity: 0; animation: fadeSlideUp 0.6s ease forwards; animation-delay: 0.6s; }
        @keyframes verifiedPulse { 0% { box-shadow: 0 0 0 0 rgba(22,163,74, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(22,163,74, 0); } 100% { box-shadow: 0 0 0 0 rgba(22,163,74, 0); } }
      `}</style>

      <div className="px-4 md:px-10" style={{ paddingTop: '24px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', position: 'relative', zIndex: 10 }}>

        {/* Page Header */}
        <div className="end-anim" style={{ textAlign: 'center', marginBottom: '16px', paddingTop: '72px', paddingBottom: '16px', animationDelay: '0s' }}>
          <p className="font-inter tc-eyebrow" style={{ marginBottom: '8px', fontWeight: '600' }}>{t('nav.workerPortal')}</p>
          <h1 className="font-clash text-gradient" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '900', marginBottom: '6px' }}>{t('endorse.header')}</h1>
          <p className="font-inter tc-text-dim" style={{ fontSize: '13px', letterSpacing: '1px', marginBottom: '12px' }}>{t('endorse.headerSubtitle')}</p>
        </div>

        {/* Two Column Card */}
        <div className="end-panel-anim w-full max-w-5xl mx-auto glass-card flex flex-col md:grid md:grid-cols-[1fr_2fr]" style={{ gap: '0', padding: 0, position: 'relative', zIndex: 1, overflow: 'hidden' }}>

          {/* ═══ LEFT PANEL — Find Worker ═══ */}
          <WorkerSearchPanel
            workerSearch={workerSearch} setWorkerSearch={setWorkerSearch}
            handleSearch={handleSearch} isSearching={isSearching}
            foundWorker={foundWorker} error={error}
            labelStyle={labelStyle} t={t}
          />

          {/* ═══ RIGHT PANEL — Form ═══ */}
          <EndorsementForm
            foundWorker={foundWorker} rating={rating} setRating={setRating}
            hoveredStar={hoveredStar} setHoveredStar={setHoveredStar}
            jobType={jobType} setJobType={setJobType}
            feedback={feedback} setFeedback={setFeedback}
            isSigning={isSigning} isSuccess={isSuccess} txHash={txHash}
            canSubmit={canSubmit} handleEndorse={handleEndorse}
            labelStyle={labelStyle} t={t}
          />
        </div>
      </div>
    </div>
  );
};

export default Endorse;
