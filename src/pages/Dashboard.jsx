import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Search, Users, FileCheck, Award, Eye, Copy, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../context/WalletContext';
import { fetchWorkerCredential } from '../lib/stellar';
import { calculateScore } from '../lib/reputation';
import ConnectPrompt from '../components/dashboard/ConnectPrompt';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardActivityFeed from '../components/dashboard/DashboardActivityFeed';

/**
 * Dashboard page — composed from ConnectPrompt, DashboardSidebar, and DashboardActivityFeed.
 * Manages data fetching and state; delegates rendering to sub-components.
 */
const Dashboard = () => {
  const { walletAddress, isConnected, connect } = useWallet();
  const [credential, setCredential] = useState(null);
  const [reputation, setReputation] = useState(null);
  const [endorsementsGiven, setEndorsementsGiven] = useState([]);
  const [endorsementsReceived, setEndorsementsReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { t } = useTranslation();

  const loadDashboardData = useCallback(async () => {
    if (!walletAddress) { setLoading(false); return; }
    setLoading(true);

      // ── 1. Always read endorsements received (never skip this) ──
      const localKey = `endorsements_${walletAddress}`;
      const received = JSON.parse(localStorage.getItem(localKey) || '[]');

      if (import.meta.env.DEV) {
        console.group('🔍 TrustChain Dashboard — Data Diagnostic');
        console.log('Wallet:', walletAddress);
        console.log('LocalStorage key checked:', localKey);
        console.log('Raw value:', localStorage.getItem(localKey));
        console.log('Parsed received endorsements:', received);
        console.log('All localStorage keys:', Object.keys(localStorage));
        console.groupEnd();
      }

      // Fallback: scan all endorsement keys if none found
      let receivedFinal = received;
      if (received.length === 0) {
        const allReceived = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('endorsements_')) {
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            list.forEach(e => { if (e.worker === walletAddress) allReceived.push(e); });
          }
        }
        if (allReceived.length > 0) {
          receivedFinal = allReceived;
          localStorage.setItem(localKey, JSON.stringify(allReceived));
        }
      }
      setEndorsementsReceived(receivedFinal);
      const rep = calculateScore(receivedFinal);
      setReputation(rep);

      // ── 2. Endorsements given ──
      const given = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('endorsements_') && key !== localKey) {
          const list = JSON.parse(localStorage.getItem(key) || '[]');
          list.forEach(e => { if (e.endorser === walletAddress) given.push(e); });
        }
      }
      given.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setEndorsementsGiven(given);

      // ── 3. Load credential ──
      try {
        const cred = await fetchWorkerCredential(walletAddress);
        const localWorkerData = JSON.parse(localStorage.getItem(`trustchain_worker_${walletAddress}`) || 'null');
        if (localWorkerData) {
          cred.name = localWorkerData.name || localWorkerData.fullName || cred.name;
          cred.skill = localWorkerData.skill || localWorkerData.skillCategory || cred.skill;
          cred.city = localWorkerData.city || cred.city;
          cred.bio = localWorkerData.bio || cred.bio;
          cred.experience = localWorkerData.experience || cred.experience;
        }
        setCredential(cred);
      } catch {
        const localWorkerData = JSON.parse(localStorage.getItem(`trustchain_worker_${walletAddress}`) || 'null');
        if (localWorkerData) {
          setCredential({
            name: localWorkerData.name || localWorkerData.fullName || 'Worker',
            skill: localWorkerData.skill || localWorkerData.skillCategory || '—',
            city: localWorkerData.city || 'Unknown',
            experience: localWorkerData.experience || '—',
            bio: localWorkerData.bio || '',
          });
        } else {
          setCredential(null);
        }
      }
      setLoading(false);
  }, [walletAddress]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const truncAddr = (a) => a ? `${a.slice(0, 6)}…${a.slice(-6)}` : '';
  const copyAddress = () => { navigator.clipboard.writeText(walletAddress); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (!isConnected) {
    return <ConnectPrompt connect={connect} t={t} />;
  }

  const allEvents = [
    ...endorsementsReceived.map(e => ({ ...e, type: 'received' })),
    ...endorsementsGiven.map(e => ({ ...e, type: 'given' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const filteredEvents = activeTab === 'all' ? allEvents : allEvents.filter(e => e.type === activeTab);

  const quickActions = [
    { to: '/worker', icon: credential ? FileCheck : ShieldCheck, label: credential ? t('dashboard.updateCred') : t('dashboard.mintCred'), sub: t('dashboard.workerPortal') },
    { to: '/discover', icon: Users, label: t('dashboard.findWorkers'), sub: t('dashboard.browseHire') },
    { to: '/endorse', icon: Award, label: t('dashboard.endorseWorker'), sub: t('dashboard.writeReview') },
    { to: '/verify', icon: Search, label: t('dashboard.verifyWorker'), sub: t('dashboard.auditReputation') },
    ...(credential ? [{ to: `/profile/${walletAddress}`, icon: Eye, label: t('dashboard.myProfile'), sub: t('dashboard.publicPage') }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Background Graphics */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,110,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '20%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04, zIndex: 0 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05, zIndex: 0 }} />

      <style>{`
        @keyframes dbFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .db-anim { opacity:0; animation: dbFadeUp 0.4s ease forwards; }
        .db-qa { transition: all 0.15s ease; cursor:pointer; text-decoration:none; color:inherit; display:flex; align-items:center; gap:14px; padding:12px 20px; border-bottom:1px solid rgba(255,255,255,0.04); }
        .db-qa:hover { background-color: rgba(255,255,255,0.03); }
        .db-tab { transition: all 0.15s ease; cursor:pointer; border:none; }
        .db-tab:hover { background-color: rgba(255,255,255,0.04); }
        @media (max-width:900px) { .db-layout { flex-direction:column !important; } .db-sidebar { width:100% !important; border-right:none !important; border-bottom:1px solid rgba(255,255,255,0.06); } }
      `}</style>

      <div className="db-layout" style={{ display: 'flex', paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px', minHeight: '100vh', position: 'relative', zIndex: 10 }}>

        {/* ═══ LEFT SIDEBAR ═══ */}
        <DashboardSidebar
          credential={credential}
          reputation={reputation}
          endorsementsReceived={endorsementsReceived}
          endorsementsGiven={endorsementsGiven}
          quickActions={quickActions}
          t={t}
        />

        {/* ═══ RIGHT MAIN AREA ═══ */}
        <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
          {/* Page Header */}
          <div className="db-anim" style={{ marginBottom: '32px', animationDelay: '0s' }}>
            <p className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>{t('dashboard.eyebrow')}</p>
            <h1 className="font-clash" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>
              {t('dashboard.overview')}
              {credential && credential.name && credential.name !== 'Worker' && <span style={{ color: 'rgba(255,255,255,0.4)' }}>, {credential.name.split(' ')[0]}</span>}
            </h1>
            <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>{t('dashboard.overviewSub')}</p>
          </div>

          {/* Wallet bar */}
          <div className="db-anim" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', animationDelay: '0.05s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#00dc6e', borderRadius: '50%' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{truncAddr(walletAddress)}</span>
              <button onClick={copyAddress} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', display: 'flex', padding: '2px' }}>
                {copied ? <Check style={{ width: '12px', height: '12px', color: '#00dc6e' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
              </button>
              <a href={`https://stellar.expert/explorer/testnet/account/${walletAddress}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.2)', display: 'flex' }}>
                <ExternalLink style={{ width: '12px', height: '12px' }} />
              </a>
            </div>
          </div>

          {/* Activity Feed */}
          <DashboardActivityFeed
            filteredEvents={filteredEvents}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={loading}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
