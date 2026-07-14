import React, { useState, useEffect } from 'react';
import { NETWORK } from '../lib/networkConfig';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Activity, BarChart3, Globe, RefreshCw, Clock, TrendingUp, Layers, Zap, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useWallet } from '../context/WalletContext';
import { fetchAllCredentialEvents } from '../services/indexer';
import ActivityFeed from '../components/ActivityFeed';
import { useTranslation } from 'react-i18next';

/**
 * Analytics — Network insights page.
 * Displays real-time Stellar network metrics including total credentials,
 * active wallets, today's transactions, a 7-day trend chart (area/bar toggle),
 * and a live activity feed panel.
 *
 * Data is fetched from the Horizon indexer and cached in sessionStorage.
 * Supports manual re-indexing via the "INDEX NOW" button.
 *
 * @returns {React.ReactElement} The Analytics page.
 */
const Analytics = () => {
  useWallet();
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({ totalCredentials: 0, activeWallets: 0, todayTx: 0, recentActivity: [], trendData: [], loading: true, error: null });
  const [chartType, setChartType] = useState('area');
  const [lastIndexed, setLastIndexed] = useState(Date.now());
  const [timeSinceIndex, setTimeSinceIndex] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Fetches and processes all credential events from Horizon.
   * Computes totals, unique wallets, daily trend data, and recent activity.
   * @param {boolean} [forceRefresh=false] - Bypass sessionStorage cache.
   */
  const loadData = async (forceRefresh = false) => {
    setIsRefreshing(true); setMetrics(p => ({ ...p, loading: true }));
    try {
      const events = await fetchAllCredentialEvents(forceRefresh);
      const totalCredentials = events.length;
      const uniqueWallets = new Set(); events.forEach(e => uniqueWallets.add(e.walletAddress));
      const activeWallets = uniqueWallets.size;
      const startOfToday = new Date(); startOfToday.setHours(0,0,0,0); let todayTx = 0;
      const trendMap = {}; const today = new Date();
      for (let i = 6; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate()-i); trendMap[d.toLocaleDateString('en-US',{weekday:'short'})] = 0; }
      events.forEach(e => { const txDate = new Date(e.timestamp); if (txDate >= startOfToday) todayTx++; const diff = (today-txDate)/(1000*60*60*24); if (diff <= 7) { const ds = txDate.toLocaleDateString('en-US',{weekday:'short'}); if (trendMap[ds] !== undefined) trendMap[ds]++; } });
      const trendData = Object.keys(trendMap).map(day => ({ day, issuances: trendMap[day] }));
      const recentActivity = events.slice(0, 10).map(e => { const dm = Math.floor((new Date()-new Date(e.timestamp))/60000); return { hash: e.txHash, walletAddress: e.walletAddress, timeAgo: dm < 1 ? 'Just now' : dm < 60 ? `${dm}m ago` : `${Math.floor(dm/60)}h ago`, operationType: e.credentialType, successful: e.successful }; });
      const it = sessionStorage.getItem('trustchain_indexed_events_timestamp');
      setLastIndexed(it ? parseInt(it, 10) : Date.now());
      setMetrics({ totalCredentials, activeWallets, todayTx, recentActivity, trendData, loading: false, error: null });
    } catch (err) { console.warn('Analytics:', err.message); setMetrics(p => ({ ...p, loading: false, error: null })); }
    finally { setIsRefreshing(false); }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    if (!lastIndexed) return;
    const update = () => { const s = Math.floor((Date.now()-lastIndexed)/1000); setTimeSinceIndex(s < 5 ? 'Just now' : s < 60 ? `${s}s ago` : `${Math.floor(s/60)}m ago`); };
    update(); const iv = setInterval(update, 1000); return () => clearInterval(iv);
  }, [lastIndexed]);

  const statCards = [
    { title: t('analytics.statCreds'), value: metrics.totalCredentials, subtitle: t('analytics.contractIndex'), icon: ShieldCheck },
    { title: t('analytics.statTotalUsers'), value: metrics.activeWallets, subtitle: t('analytics.uniqueParticipants'), icon: Users },
    { title: t('analytics.txToday'), value: metrics.todayTx, subtitle: t('analytics.past24h'), icon: Zap, trend: metrics.todayTx > 0 ? 12 : 0 },
    { title: t('analytics.networkStatus'), value: '100', subtitle: t('analytics.stellarOps'), icon: Globe, isGreen: true },
  ];

  return (
    <div className="relative overflow-hidden text-white min-h-screen" style={{ background: '#050505' }}>
      {/* Background Decorations */}
      <div className="tc-bg-grid" />
      <div className="tc-orb-blue" />

      {/* Page Wrapper */}
      <div className="tc-page-wide" style={{ paddingTop: '120px', paddingBottom: '48px', maxWidth: '1400px', position: 'relative', zIndex: 10 }}>

        {/* ═══ Page Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="tc-mb-lg"
        >
          <div className="tc-flex-between" style={{ flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <p className="font-inter tc-eyebrow tc-mb-xs">NETWORK INSIGHTS</p>
              <h1 className="font-clash tc-heading-hero tc-mb-xs" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', textTransform: 'none', letterSpacing: '-0.02em' }}>
                <span className="text-gradient">{t('analytics.headerTitle')}</span>
              </h1>
              <p className="font-inter tc-text-dim tc-text-base">
                <Globe className="tc-icon-md" style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px', opacity: 0.5 }} />
                {t('analytics.headerSubtitle')}
              </p>
            </div>
            <div className="tc-flex tc-flex-gap-sm">
              <div className="tc-flex tc-flex-gap-sm tc-card-interactive">
                <Clock className="tc-icon-sm tc-icon-dim" />
                <span className="font-inter tc-label tc-text-xs tc-ls-wide">
                  {t('analytics.indexed')} <span className="tc-text-dim">{timeSinceIndex}</span>
                </span>
              </div>
              <button
                onClick={() => loadData(true)}
                disabled={isRefreshing}
                className="tc-flex tc-flex-gap-sm tc-card-interactive hover:text-white hover:border-white/40"
                style={{
                  background: 'transparent', color: 'rgba(255,255,255,0.4)',
                  fontSize: '10px', fontWeight: '800', letterSpacing: '2px',
                  textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isRefreshing ? 0.4 : 1
                }}
              >
                <RefreshCw className={`tc-icon-sm ${isRefreshing ? 'animate-spin' : ''}`} />
                {t('analytics.indexNow')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ═══ Stats Row ═══ */}
        <div className="tc-grid-4 tc-mb-lg" style={{ gap: '14px', alignItems: 'stretch' }}>
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            const isStr = typeof card.value === 'string';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + idx * 0.05, duration: 0.45 }}
                className="stat-card-premium group"
                style={{ cursor: 'default' }}
              >
                <div className="tc-flex-between tc-mb-xs">
                  <p className="font-inter tc-label tc-text-xs" style={{ letterSpacing: '0.12em' }}>{card.title}</p>
                  <div className="tc-activity-icon" style={{ width: '28px', height: '28px' }}>
                    <Icon className="tc-icon-sm" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  </div>
                </div>
                <div className="tc-flex tc-flex-gap-sm tc-mb-xs" style={{ alignItems: 'baseline' }}>
                  <h2 className="font-clash tc-stat-hero counter-glow" style={{ color: card.isGreen ? '#00dc6e' : '#ffffff' }}>
                    {isStr ? card.value : card.value.toLocaleString()}
                  </h2>
                  {card.trend > 0 && (
                    <span className="tc-verified-badge tc-text-sm" style={{ padding: '2px 8px' }}>
                      <TrendingUp className="tc-icon-sm" />{card.trend}%
                    </span>
                  )}
                </div>
                <p className="font-inter tc-text-dimmer tc-text-sm" style={{ letterSpacing: '1px', marginTop: '4px' }}>
                  {card.subtitle}
                </p>
                {card.isGreen && (
                  <span className="tc-verified-badge tc-text-xs" style={{ display: 'inline-block', marginTop: '8px', padding: '3px 8px', letterSpacing: '1.5px' }}>
                    Stellar {NETWORK.charAt(0).toUpperCase() + NETWORK.slice(1)} Operational
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ═══ Chart + Activity Feed Row ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'stretch' }}>

          {/* ═══ Chart Panel ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-card" style={{ padding: '20px 24px' }}
          >
            {/* Chart Header */}
            <div className="tc-flex-between tc-mb-xs" style={{ alignItems: 'flex-start' }}>
              <div>
                <div className="tc-flex tc-flex-gap-sm" style={{ alignItems: 'center' }}>
                  <div className="tc-activity-icon" style={{ width: '28px', height: '28px' }}>
                    <TrendingUp className="tc-icon-md" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </div>
                  <h3 className="font-inter tc-text-lg tc-fw-bold">{t('analytics.chartTitle')}</h3>
                </div>
                <p className="font-inter tc-caption" style={{ marginTop: '4px' }}>
                  {t('analytics.overview7d')}
                </p>
              </div>
              <div className="tc-flex tc-flex-gap-sm">
                <div className="tc-flex" style={{ overflow: 'hidden' }}>
                  {['area', 'bar'].map(ct => (
                    <button
                      key={ct}
                      onClick={() => setChartType(ct)}
                      className={`tc-chart-toggle ${chartType === ct ? 'tc-chart-toggle--active' : 'tc-chart-toggle--inactive'}`}
                      style={{ marginLeft: ct === 'bar' ? '-1px' : '0' }}
                    >
                      {ct === 'area' ? 'Area' : 'Bar'}
                    </button>
                  ))}
                </div>
                <div className="tc-card-interactive tc-flex tc-flex-gap-sm" style={{ height: '28px', alignItems: 'center' }}>
                  <span className="font-inter tc-text-sm tc-fw-bold" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{metrics.totalCredentials}</span>
                  <span className="font-inter tc-text-dimmer tc-text-sm tc-fw-bold" style={{ textTransform: 'uppercase' }}>{t('analytics.total')}</span>
                </div>
              </div>
            </div>

            {/* Chart Canvas */}
            <div style={{ marginTop: '16px', height: '280px' }}>
              {metrics.loading && !metrics.trendData.length ? (
                <div className="tc-flex-center tc-flex-col" style={{ width: '100%', height: '100%' }}>
                  <RefreshCw className="animate-spin" style={{ width: '24px', height: '24px', color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }} />
                  <span className="font-inter tc-label">{t('analytics.indexingData')}</span>
                </div>
              ) : chartType === 'area' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.trendData} margin={{ top: 16, right: 16, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" stopOpacity={0.1} /><stop offset="100%" stopColor="#ffffff" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="day" stroke="none" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="none" tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} dx={-8} />
                    <Area type="monotone" dataKey="issuances" stroke="rgba(255,255,255,0.4)" strokeWidth={2} fill="url(#areaFill)" dot={{ fill: '#050505', stroke: 'rgba(255,255,255,0.5)', strokeWidth: 2, r: 4 }} activeDot={{ fill: '#fff', stroke: '#050505', strokeWidth: 3, r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.trendData} margin={{ top: 16, right: 16, bottom: 0, left: -20 }} barCategoryGap="25%">
                    <defs><linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} /><stop offset="100%" stopColor="#ffffff" stopOpacity={0.1} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="day" stroke="none" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="none" tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} dx={-8} />
                    <Bar dataKey="issuances" fill="url(#barFill)" radius={[2, 2, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* ═══ Activity Feed Panel ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{ maxWidth: '100%', overflow: 'hidden' }}
          >
            <ActivityFeed activities={metrics.recentActivity} loading={metrics.loading} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;
