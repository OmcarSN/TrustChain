import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Activity, BarChart3, Globe, RefreshCw, Clock, TrendingUp, Layers, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useWallet } from '../context/WalletContext';
import { fetchAllCredentialEvents } from '../services/indexer';
import MetricCard from '../components/MetricCard';
import ActivityFeed from '../components/ActivityFeed';



/* ── Main Analytics Page ────────────────────────────────────── */
const Analytics = () => {
  const { isConnected, connect } = useWallet();
  const [metrics, setMetrics] = useState({
    totalCredentials: 0,
    activeWallets: 0,
    todayTx: 0,
    recentActivity: [],
    trendData: [],
    loading: true,
    error: null,
  });
  const [chartType, setChartType] = useState('area'); // 'area' or 'bar'
  const [lastIndexed, setLastIndexed] = useState(Date.now());
  const [timeSinceIndex, setTimeSinceIndex] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* ── Fetch logic using the indexer ─────── */
  const loadData = async (forceRefresh = false) => {
    setIsRefreshing(true);
    setMetrics(prev => ({ ...prev, loading: true }));
    try {
      const events = await fetchAllCredentialEvents(forceRefresh);
      
      const totalCredentials = events.length;
      
      const uniqueWallets = new Set();
      events.forEach(e => uniqueWallets.add(e.walletAddress));
      const activeWallets = uniqueWallets.size;

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      let todayTx = 0;
      
      // Calculate 7-day trend
      const trendMap = {};
      const today = new Date();
      // Initialize map with last 7 days to 0
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        trendMap[dayStr] = 0;
      }

      events.forEach(e => {
        const txDate = new Date(e.timestamp);
        if (txDate >= startOfToday) {
          todayTx++;
        }
        
        // Populate trend data
        const currentDiff = (today - txDate) / (1000 * 60 * 60 * 24);
        if (currentDiff <= 7) {
          const dayStr = txDate.toLocaleDateString('en-US', { weekday: 'short' });
          if (trendMap[dayStr] !== undefined) {
            trendMap[dayStr]++;
          }
        }
      });

      const trendData = Object.keys(trendMap).map(day => ({
        day,
        issuances: trendMap[day],
      }));

      const recentActivity = events.slice(0, 10).map(e => {
        const diffMs = new Date() - new Date(e.timestamp);
        const diffMins = Math.floor(diffMs / 60000);
        const timeAgo = diffMins < 1 
          ? 'Just now' 
          : diffMins < 60 
            ? `${diffMins} min${diffMins !== 1 ? 's' : ''} ago` 
            : `${Math.floor(diffMins/60)} hr${Math.floor(diffMins/60) !== 1 ? 's' : ''} ago`;

        return {
          hash: e.txHash,
          walletAddress: e.walletAddress,
          timeAgo: timeAgo,
          operationType: e.credentialType,
          successful: e.successful
        };
      });

      const indexedTime = sessionStorage.getItem('trustchain_indexed_events_timestamp');
      setLastIndexed(indexedTime ? parseInt(indexedTime, 10) : Date.now());

      setMetrics({
        totalCredentials,
        activeWallets,
        todayTx,
        recentActivity,
        trendData,
        loading: false,
        error: null,
      });

    } catch (err) {
      console.warn('Analytics data load:', err.message);
      setMetrics(prev => ({ ...prev, loading: false, error: null }));
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Timer for "Last indexed: X seconds ago"
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

  // Compute sparkline data for each metric card from trendData
  const sparkValues = metrics.trendData.map(d => d.issuances);

  /* ── Not connected ─────────────────────────────────────────── */
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[150px] -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md p-10 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(255,255,255,0.03) 60%, rgba(124,58,237,0.04) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-800/20 border border-accent/15 flex items-center justify-center mx-auto mb-5">
              <BarChart3 className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-2xl font-black mb-2 tracking-tight">TrustChain Analytics</h2>
            <p className="text-white/30 mb-6 text-sm font-medium">Connect wallet to access global network metrics.</p>
            <button onClick={connect} className="group w-full py-4 bg-gradient-to-r from-accent to-purple-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-accent/25 active:scale-[0.98]">
              Connect Wallet
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Connected view ────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-28 pb-16 px-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-purple-600/[0.04] blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-500/[0.03] blur-[160px] rounded-full pointer-events-none" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ── Header ──────────────────────────────── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-accent" />
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 bg-accent/8 border border-accent/10 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-accent/80">Testnet</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1.5 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Network Analytics
            </h1>
            <p className="text-white/30 text-sm font-medium flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-purple-400/60" /> Live Stellar Testnet indexed data
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            {/* Time badge */}
            <div
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Clock className="w-3.5 h-3.5 text-accent/60" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Indexed: <span className="text-white/60">{timeSinceIndex}</span>
              </span>
            </div>

            {/* Refresh button */}
            <button 
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.08))',
                border: '1px solid rgba(124,58,237,0.2)',
                color: '#a855f7',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(124,58,237,0.15))';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(124,58,237,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.08))';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Index Now
            </button>
          </motion.div>
        </div>

        {/* ── 4-Col Metric Cards ──────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
          <MetricCard 
            title="Total Interactions" 
            value={metrics.totalCredentials} 
            subtitle="Contract Index" 
            icon={ShieldCheck} 
            color="purple"
            delay={0}
            sparkData={sparkValues}
          />
          <MetricCard 
            title="Active Wallets" 
            value={metrics.activeWallets} 
            subtitle="Unique Participants" 
            icon={Users} 
            color="blue"
            delay={1}
          />
          <MetricCard 
            title="Transactions Today" 
            value={metrics.todayTx} 
            subtitle="Past 24 Hours" 
            icon={Zap} 
            color="amber"
            delay={2}
            trend={metrics.todayTx > 0 ? 12 : 0}
          />
          <MetricCard 
            title="Network Status" 
            value="100%" 
            subtitle="Stellar Testnet Operational" 
            icon={Globe} 
            color="green"
            delay={3}
          />
        </div>

        {/* ── Chart + Activity Feed ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Main Chart Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(124,58,237,0.06) 0%, rgba(15,15,24,0.6) 40%, rgba(15,15,24,0.4) 100%)',
              border: '1px solid rgba(124,58,237,0.06)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Chart header */}
            <div className="flex items-center justify-between p-5 pb-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-none mb-0.5">Interaction Trend</h3>
                  <p className="text-[9px] font-medium text-white/25 uppercase tracking-wider">7-day overview</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Chart type toggle */}
                <div
                  className="flex items-center rounded-lg overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <button
                    onClick={() => setChartType('area')}
                    className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all duration-200"
                    style={{
                      background: chartType === 'area' ? 'rgba(124,58,237,0.2)' : 'transparent',
                      color: chartType === 'area' ? '#a855f7' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    Area
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all duration-200"
                    style={{
                      background: chartType === 'bar' ? 'rgba(124,58,237,0.2)' : 'transparent',
                      color: chartType === 'bar' ? '#a855f7' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    Bar
                  </button>
                </div>

                {/* Total badge */}
                <div
                  className="px-3 py-1.5 rounded-lg"
                  style={{
                    background: 'rgba(124,58,237,0.08)',
                    border: '1px solid rgba(124,58,237,0.1)',
                  }}
                >
                  <span className="text-[10px] font-black text-accent tracking-wider">
                    {metrics.totalCredentials}
                  </span>
                  <span className="text-[9px] text-white/25 font-bold ml-1.5 uppercase tracking-wider">total</span>
                </div>
              </div>
            </div>
            
            {/* Chart body */}
            <div style={{ width: '100%', minWidth: 200, height: 300 }} className="p-4 pt-2">
              {metrics.loading && !metrics.trendData.length ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-sm font-medium">
                  <RefreshCw className="w-6 h-6 animate-spin mb-4 text-accent/50" />
                  <span className="text-xs uppercase tracking-widest font-bold">Indexing Horizon Data...</span>
                </div>
              ) : chartType === 'area' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.trendData} margin={{ top: 16, right: 16, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} />
                        <stop offset="50%" stopColor="#7c3aed" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.03)"
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="day" 
                      stroke="none"
                      tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="none"
                      tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                      dx={-8}
                    />

                    <Area
                      type="monotone"
                      dataKey="issuances"
                      stroke="url(#lineStroke)"
                      strokeWidth={2.5}
                      fill="url(#areaFill)"
                      dot={{
                        fill: '#0f0f18',
                        stroke: '#a855f7',
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        fill: '#a855f7',
                        stroke: '#0f0f18',
                        strokeWidth: 3,
                        r: 6,
                        filter: 'url(#glow)',
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.trendData} margin={{ top: 16, right: 16, bottom: 0, left: -20 }} barCategoryGap="25%">
                    <defs>
                      <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.03)"
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="day" 
                      stroke="none"
                      tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="none"
                      tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                      dx={-8}
                    />

                    <Bar
                      dataKey="issuances"
                      fill="url(#barFill)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Activity Feed Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[400px]"
          >
            <ActivityFeed activities={metrics.recentActivity} loading={metrics.loading} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;
