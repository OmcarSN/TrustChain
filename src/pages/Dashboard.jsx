import React, { useState, useEffect, useCallback } from 'react';
import { explorerAccountUrl } from '../lib/networkConfig';
import { ShieldCheck, Search, Users, FileCheck, Award, Eye, Copy, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../context/WalletContext';
import { fetchWorkerCredential } from '../lib/stellar';
import { calculateScore } from '../lib/reputation';
import { getWorker, getEndorsements, getEndorsementsGiven } from '../lib/supabaseData';
import ConnectPrompt from '../components/dashboard/ConnectPrompt';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardActivityFeed from '../components/dashboard/DashboardActivityFeed';
import PageBackground from '../components/PageBackground';

/**
 * Dashboard — Authenticated user's command center page.
 * Fetches credential, endorsement, and reputation data from Supabase
 * and Stellar Horizon, then delegates rendering to:
 * - ConnectPrompt: shown when wallet is not connected
 * - DashboardSidebar: stats, quick actions, credential card
 * - DashboardActivityFeed: tab-filtered endorsement timeline
 *
 * @returns {React.ReactElement} The Dashboard page.
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

      // ── 1. Endorsements received ──
      const received = await getEndorsements(walletAddress);
      setEndorsementsReceived(received);
      const rep = calculateScore(received);
      setReputation(rep);

      // ── 2. Endorsements given ──
      const given = await getEndorsementsGiven(walletAddress);
      given.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setEndorsementsGiven(given);

      // ── 3. Load credential ──
      try {
        const cred = await fetchWorkerCredential(walletAddress);
        const localWorkerData = await getWorker(walletAddress);
        if (localWorkerData) {
          cred.name = localWorkerData.name || localWorkerData.fullName || cred.name;
          cred.skill = localWorkerData.skill || localWorkerData.skillCategory || cred.skill;
          cred.city = localWorkerData.city || cred.city;
          cred.bio = localWorkerData.bio || cred.bio;
          cred.experience = localWorkerData.experience || cred.experience;
        }
        setCredential(cred);
      } catch {
        const localWorkerData = await getWorker(walletAddress);
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
    ...(credential ? [{ to: `/profile/${walletAddress}`, icon: Eye, label: t('dashboard.myProfile'), sub: t('dashboard.publicPage') }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#05060A] relative overflow-hidden text-white">
      {/* Background Graphics */}
      <PageBackground />


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
            <p className="font-inter tc-eyebrow tc-mb-xs">{t('dashboard.eyebrow')}</p>
            <h1 className="font-clash tc-fw-black tc-text-white" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', marginBottom: '4px' }}>
              <span className="text-gradient">{t('dashboard.overview')}</span>
              {credential && credential.name && credential.name !== 'Worker' && <span className="tc-text-dim">, {credential.name.split(' ')[0]}</span>}
            </h1>
            <p className="font-inter tc-text-dim tc-text-base">{t('dashboard.overviewSub')}</p>
          </div>

          {/* Wallet bar */}
          <div className="db-anim" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', animationDelay: '0.05s' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#4F6BED', borderRadius: '50%' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{truncAddr(walletAddress)}</span>
              <button onClick={copyAddress} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', display: 'flex', padding: '2px' }}>
              {copied ? <Check className="tc-icon-sm" /> : <Copy className="tc-icon-sm" />}
              </button>
              <a href={explorerAccountUrl(walletAddress)} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.2)', display: 'flex' }}>
                <ExternalLink className="tc-icon-sm" />
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
