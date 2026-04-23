import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Activity, BarChart3, Globe, RefreshCw, Clock, TrendingUp, Layers, Zap, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useWallet } from '../context/WalletContext';
import { fetchAllCredentialEvents } from '../services/indexer';
import MetricCard from '../components/MetricCard';
import ActivityFeed from '../components/ActivityFeed';
import { useTranslation } from 'react-i18next';

const Analytics = () => {
  const { isConnected, connect } = useWallet();
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({ totalCredentials: 0, activeWallets: 0, todayTx: 0, recentActivity: [], trendData: [], loading: true, error: null });
  const [chartType, setChartType] = useState('area');
  const [lastIndexed, setLastIndexed] = useState(Date.now());
  const [timeSinceIndex, setTimeSinceIndex] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 flex items-center justify-center relative overflow-hidden text-white">
        <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md z-10">
          <div className="w-14 h-14 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6"><BarChart3 className="w-7 h-7 text-white/30" /></div>
          <h2 className="font-clash text-3xl font-bold mb-3 tracking-tighter">{t('analytics.headerTitle')}</h2>
          <p className="text-white/30 mb-8 text-sm font-inter">{t('analytics.headerSubtitle')}</p>
          <button onClick={connect} className="w-full py-4 bg-white text-black rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] hover:opacity-85 transition-opacity flex items-center justify-center gap-2"><Wallet className="w-4 h-4" /> {t('dashboard.connectBtn')}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', right: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center"><Layers className="w-4 h-4 text-white/40" /></div>
              <div className="flex items-center gap-2 px-2.5 py-1 border border-white/10 rounded-[2px]"><div className="w-1.5 h-1.5 rounded-full bg-white/40" /><span className="text-[9px] font-bold uppercase tracking-wider text-white/40">Testnet</span></div>
            </div>
            <h1 className="font-clash text-3xl md:text-4xl font-bold tracking-tighter mb-1.5">{t('analytics.headerTitle')}</h1>
            <p className="text-white/25 text-sm font-inter flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-white/20" /> {t('analytics.headerSubtitle')}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-[2px] border border-white/[0.07] bg-white/[0.02]">
              <Clock className="w-3.5 h-3.5 text-white/20" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 font-inter">{t('analytics.indexed')} <span className="text-white/50">{timeSinceIndex}</span></span>
            </div>
            <button onClick={() => loadData(true)} disabled={isRefreshing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[2px] font-bold text-[10px] uppercase tracking-wider border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-40">
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> {t('analytics.indexNow')}
            </button>
          </motion.div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <MetricCard title={t('analytics.statCreds')} value={metrics.totalCredentials} subtitle={t('analytics.contractIndex')} icon={ShieldCheck} delay={0} />
          <MetricCard title={t('analytics.statTotalUsers')} value={metrics.activeWallets} subtitle={t('analytics.uniqueParticipants')} icon={Users} delay={1} />
          <MetricCard title={t('analytics.txToday')} value={metrics.todayTx} subtitle={t('analytics.past24h')} icon={Zap} delay={2} trend={metrics.todayTx > 0 ? 12 : 0} />
          <MetricCard title={t('analytics.networkStatus')} value="100%" subtitle={t('analytics.stellarOps')} icon={Globe} delay={3} />
        </div>

        {/* Chart + Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-[2px] overflow-hidden flex flex-col h-full border border-white/[0.07] bg-white/[0.02]">
            <div className="flex items-center justify-between p-5 pb-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center"><TrendingUp className="w-3.5 h-3.5 text-white/30" /></div>
                <div><h3 className="text-sm font-bold tracking-tight font-inter mb-0.5">{t('analytics.chartTitle')}</h3><p className="text-[9px] text-white/20 uppercase tracking-wider font-inter">{t('analytics.overview7d')}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-[2px] overflow-hidden border border-white/10">
                  {['area','bar'].map(ct => (
                    <button key={ct} onClick={() => setChartType(ct)} className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all ${chartType===ct ? 'bg-white text-black' : 'text-white/30 hover:text-white/50'}`}>{ct === 'area' ? 'Area' : 'Bar'}</button>
                  ))}
                </div>
                <div className="px-3 py-1.5 rounded-[2px] border border-white/10">
                  <span className="text-[10px] font-bold text-white/50 font-inter">{metrics.totalCredentials}</span>
                  <span className="text-[9px] text-white/20 font-bold ml-1.5 uppercase tracking-wider">{t('analytics.total')}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full min-h-[240px] p-4 pt-2">
              {metrics.loading && !metrics.trendData.length ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/20 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mb-4 text-white/20" /><span className="text-xs uppercase tracking-widest font-bold font-inter">{t('analytics.indexingData')}</span>
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

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="min-h-[340px]">
            <ActivityFeed activities={metrics.recentActivity} loading={metrics.loading} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
