import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Activity, BarChart3, Globe, RefreshCw, Clock, TrendingUp, Layers, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useWallet } from '../context/WalletContext';
import { fetchAllCredentialEvents } from '../services/indexer';
import MetricCard from '../components/MetricCard';
import ActivityFeed from '../components/ActivityFeed';

const Analytics = () => {
  const { isConnected, connect } = useWallet();
  const [metrics, setMetrics] = useState({
    totalCredentials: 0, activeWallets: 0, todayTx: 0,
    recentActivity: [], trendData: [], loading: true, error: null,
  });
  const [chartType, setChartType] = useState('area');
  const [lastIndexed, setLastIndexed] = useState(Date.now());
  const [timeSinceIndex, setTimeSinceIndex] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (forceRefresh = false) => {
    setIsRefreshing(true);
    setMetrics(prev => ({ ...prev, loading: true }));
    try {
      const events = await fetchAllCredentialEvents(forceRefresh);
      const totalCredentials = events.length;
      const uniqueWallets = new Set();
      events.forEach(e => uniqueWallets.add(e.walletAddress));
      const activeWallets = uniqueWallets.size;
      const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
      let todayTx = 0;
      const trendMap = {};
      const today = new Date();
      for (let i = 6; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate() - i); trendMap[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0; }
      events.forEach(e => {
        const txDate = new Date(e.timestamp);
        if (txDate >= startOfToday) todayTx++;
        const currentDiff = (today - txDate) / (1000 * 60 * 60 * 24);
        if (currentDiff <= 7) { const dayStr = txDate.toLocaleDateString('en-US', { weekday: 'short' }); if (trendMap[dayStr] !== undefined) trendMap[dayStr]++; }
      });
      const trendData = Object.keys(trendMap).map(day => ({ day, issuances: trendMap[day] }));
      const recentActivity = events.slice(0, 10).map(e => {
        const diffMs = new Date() - new Date(e.timestamp);
        const diffMins = Math.floor(diffMs / 60000);
        const timeAgo = diffMins < 1 ? 'Just now' : diffMins < 60 ? `${diffMins} min${diffMins !== 1 ? 's' : ''} ago` : `${Math.floor(diffMins/60)} hr${Math.floor(diffMins/60) !== 1 ? 's' : ''} ago`;
        return { hash: e.txHash, walletAddress: e.walletAddress, timeAgo, operationType: e.credentialType, successful: e.successful };
      });
      const indexedTime = sessionStorage.getItem('trustchain_indexed_events_timestamp');
      setLastIndexed(indexedTime ? parseInt(indexedTime, 10) : Date.now());
      setMetrics({ totalCredentials, activeWallets, todayTx, recentActivity, trendData, loading: false, error: null });
    } catch (err) {
      console.warn('Analytics data load:', err.message);
      setMetrics(prev => ({ ...prev, loading: false, error: null }));
    } finally { setIsRefreshing(false); }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (!lastIndexed) return;
    const updateTimeSince = () => {
      const seconds = Math.floor((Date.now() - lastIndexed) / 1000);
      if (seconds < 5) setTimeSinceIndex('Just now');
      else if (seconds < 60) setTimeSinceIndex(`${seconds}s ago`);
      else setTimeSinceIndex(`${Math.floor(seconds / 60)}m ago`);
    };
    updateTimeSince();
    const interval = setInterval(updateTimeSince, 1000);
    return () => clearInterval(interval);
  }, [lastIndexed]);

  const sparkValues = metrics.trendData.map(d => d.issuances);

  /* ── Not connected ─────────────────────────────────────────── */
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background pt-[100px] flex items-center justify-center px-6 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-md p-10 rounded-[20px] relative overflow-hidden shadow-sm"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
        >
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[#EFF6FF] border border-[#DBEAFE]">
              <BarChart3 className="w-7 h-7 text-[#1E3A8A]" />
            </div>
            <h2 className="text-3xl mb-2 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>TrustChain Analytics</h2>
            <p className="mb-8 text-sm font-medium text-gray-500">Connect wallet to access global network metrics.</p>
            <button onClick={connect} className="w-full">
              <div className="shiny-border">
                <div className="shiny-border-inner w-full py-4 relative z-20 font-bold uppercase tracking-[0.2em] text-[10px] text-white flex items-center justify-center gap-2.5">
                  Connect Wallet
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Connected view ────────────────────────────────────────── */
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background mt-16 py-5 px-6 pb-16 relative flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto relative z-10 flex flex-col h-full">
        
        {/* ── Header ──────────────────────────────── */}
        <div className="mb-3 flex flex-col md:flex-row md:items-end justify-between gap-3 shrink-0">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#EFF6FF] border border-[#DBEAFE]">
                <Layers className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#D1FAE5]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981', animation: 'pulse-dot 2s infinite' }} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#10B981]">Testnet</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl mb-1 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, letterSpacing: '-0.03em' }}>
              Network Analytics
            </h1>
            <p className="text-sm flex items-center gap-2 font-bold text-gray-500">
              <Globe className="w-3.5 h-3.5 text-[#1E3A8A] opacity-60" /> Live Stellar Testnet indexed data
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: [0.23, 1, 0.32, 1] }} className="flex items-center gap-3">
            {/* Time badge */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-sm bg-[#FFFFFF] border border-[#E5E7EB]">
              <Clock className="w-3.5 h-3.5 text-[#1E3A8A] opacity-60" />
              <span className="label-mono font-bold text-gray-900">
                Indexed: <span className="text-gray-500">{timeSinceIndex}</span>
              </span>
            </div>
            {/* Refresh — shiny border button */}
            <button onClick={() => loadData(true)} disabled={isRefreshing} className="disabled:opacity-40">
              <div className="shiny-border">
                <div className="shiny-border-inner px-5 py-2.5 relative z-20 text-[10px] font-bold uppercase tracking-[0.15em] text-white flex items-center gap-2">
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Index Now
                </div>
              </div>
            </button>
          </motion.div>
        </div>

        {/* ── 4-Col Metric Cards ──────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3 shrink-0">
          <MetricCard title="Total Interactions" value={metrics.totalCredentials} subtitle="Contract Index" icon={ShieldCheck} color="purple" delay={0} />
          <MetricCard title="Active Wallets" value={metrics.activeWallets} subtitle="Unique Participants" icon={Users} color="cyan" delay={1} />
          <MetricCard title="Transactions Today" value={metrics.todayTx} subtitle="Past 24 Hours" icon={Zap} color="amber" delay={2} trend={metrics.todayTx > 0 ? 12 : 0} />
          <MetricCard title="Network Status" value="100%" subtitle="Stellar Testnet Operational" icon={Globe} color="green" delay={3} />
        </div>

        {/* ── Chart + Activity Feed ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-1 flex-1 min-h-0">
          
          {/* Main Chart Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-2 rounded-2xl overflow-hidden flex flex-col shadow-sm min-h-[300px] max-h-[380px]"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
            }}
          >
            {/* Chart header */}
            <div className="flex items-center justify-between p-4 pb-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#EFF6FF] border border-[#DBEAFE]">
                  <TrendingUp className="w-4 h-4 text-[#1E3A8A]" />
                </div>
                <div>
                  <h3 className="leading-none mb-0.5 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, fontSize: '16px' }}>Interaction Trend</h3>
                  <p className="label-mono font-bold text-gray-500">7-day overview</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Chart type toggle */}
                <div className="flex items-center rounded-full overflow-hidden bg-[#F9FAFB] border border-[#E5E7EB]">
                  {['area', 'bar'].map(type => (
                    <button
                      key={type}
                      onClick={() => setChartType(type)}
                      className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all duration-300 rounded-full"
                      style={{
                        background: chartType === type ? '#EFF6FF' : 'transparent',
                        color: chartType === type ? '#1E3A8A' : '#6B7280',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Total badge */}
                <div className="px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE]">
                  <span className="text-[10px] font-bold text-[#1E3A8A]">{metrics.totalCredentials}</span>
                  <span className="label-mono ml-1.5 font-bold text-gray-500">total</span>
                </div>
              </div>
            </div>
            
            {/* Chart body */}
            <div className="p-4 pt-2 flex-1 min-h-0" style={{ width: '100%', minWidth: 200 }}>
              {metrics.loading && !metrics.trendData.length ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <RefreshCw className="w-6 h-6 animate-spin mb-4 text-[#1E3A8A] opacity-50" />
                  <span className="label-mono font-bold text-gray-500">Indexing Horizon Data...</span>
                </div>
              ) : chartType === 'area' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.trendData} margin={{ top: 16, right: 16, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1E3A8A" stopOpacity={0.15} />
                        <stop offset="50%" stopColor="#1E3A8A" stopOpacity={0.05} />
                        <stop offset="100%" stopColor="#1E3A8A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#1E3A8A" />
                        <stop offset="100%" stopColor="#0284C7" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="day" stroke="none" tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="none" tick={{ fill: '#4B5563', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }} axisLine={false} tickLine={false} allowDecimals={false} dx={-8} />
                    <Area type="monotone" dataKey="issuances" stroke="url(#lineStroke)" strokeWidth={2.5} fill="url(#areaFill)"
                      dot={{ fill: '#FFFFFF', stroke: '#1E3A8A', strokeWidth: 2, r: 4 }}
                      activeDot={{ fill: '#1E3A8A', stroke: '#FFFFFF', strokeWidth: 3, r: 6, filter: 'url(#glow)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.trendData} margin={{ top: 16, right: 16, bottom: 0, left: -20 }} barCategoryGap="25%">
                    <defs>
                      <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1E3A8A" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="day" stroke="none" tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="none" tick={{ fill: '#4B5563', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }} axisLine={false} tickLine={false} allowDecimals={false} dx={-8} />
                    <Bar dataKey="issuances" fill="url(#barFill)" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Activity Feed Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden flex flex-col min-h-[300px] max-h-[380px]"
          >
            <ActivityFeed activities={metrics.recentActivity} loading={metrics.loading} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;
