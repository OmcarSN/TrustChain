import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShieldCheck, Award, Search, UserCheck, 
  Wallet, ArrowRight, ExternalLink, Clock, Star, 
  Briefcase, MapPin, Hash, TrendingUp, Activity,
  ChevronRight, Zap, Users, Copy, Check, 
  Sparkles, ArrowUpRight, BarChart3, Target,
  FileCheck, PenLine, Eye, Globe, Link2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { fetchWorkerCredential } from '../lib/stellar';
import { calculateScore } from '../lib/reputation';

/* ── Animated background orb ──────────────────────────────────── */
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none -z-10 ${className}`}
    animate={{
      y: [0, -20, 0],
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

/* ── Stat Card Component ──────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, suffix, color, badge, delay = 0, trend }) => {
  const colorMap = {
    accent:  { bg: 'rgba(124,58,237,0.1)',  border: 'rgba(124,58,237,0.15)', text: 'text-accent',       glow: 'rgba(124,58,237,0.08)' },
    amber:   { bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.15)',  text: 'text-amber-400',    glow: 'rgba(251,191,36,0.08)' },
    blue:    { bg: 'rgba(96,165,250,0.1)',    border: 'rgba(96,165,250,0.15)',  text: 'text-blue-400',     glow: 'rgba(96,165,250,0.08)' },
    emerald: { bg: 'rgba(52,211,153,0.1)',    border: 'rgba(52,211,153,0.15)', text: 'text-emerald-400',  glow: 'rgba(52,211,153,0.08)' },
  };
  const c = colorMap[color] || colorMap.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className="group relative p-5 rounded-2xl cursor-default overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: `linear-gradient(145deg, ${c.glow} 0%, rgba(255,255,255,0.03) 100%)`,
        border: `1px solid rgba(255,255,255,0.06)`,
      }}
      whileHover={{
        borderColor: c.border,
      }}
    >
      {/* Hover glow */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: c.glow }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <Icon className={`w-5 h-5 ${c.text}`} />
          </div>
          {badge && (
            <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
              badge === 'Active' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/15' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
            }`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1.5">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black tracking-tight">{value}</span>
          {suffix && <span className="text-xs text-white/15 font-bold">{suffix}</span>}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Quick Action Link ────────────────────────────────────────── */
const QuickAction = ({ to, icon: Icon, label, sublabel, color, delay = 0 }) => {
  const colorMap = {
    accent:  { bg: 'rgba(124,58,237,0.1)',  border: 'rgba(124,58,237,0.15)', text: 'text-accent' },
    amber:   { bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.15)',  text: 'text-amber-400' },
    blue:    { bg: 'rgba(96,165,250,0.1)',    border: 'rgba(96,165,250,0.15)',  text: 'text-blue-400' },
    emerald: { bg: 'rgba(52,211,153,0.1)',    border: 'rgba(52,211,153,0.15)', text: 'text-emerald-400' },
  };
  const c = colorMap[color] || colorMap.accent;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <Link to={to} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.05] transition-all group">
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <Icon className={`w-4 h-4 ${c.text}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">{label}</p>
            <p className="text-[10px] text-white/20 font-medium">{sublabel}</p>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </Link>
    </motion.div>
  );
};

const Dashboard = () => {
  const { walletAddress, isConnected, connect } = useWallet();
  const [credential, setCredential] = useState(null);
  const [reputation, setReputation] = useState(null);
  const [endorsementsGiven, setEndorsementsGiven] = useState([]);
  const [endorsementsReceived, setEndorsementsReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!walletAddress) { setLoading(false); return; }

    const loadData = async () => {
      setLoading(true);
      try {
        const cred = await fetchWorkerCredential(walletAddress);
        setCredential(cred);
        const localKey = `endorsements_${walletAddress}`;
        const received = JSON.parse(localStorage.getItem(localKey) || '[]');
        setEndorsementsReceived(received);
        const rep = calculateScore(received);
        setReputation(rep);
      } catch {
        setCredential(null);
      }

      const given = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('endorsements_')) {
          const list = JSON.parse(localStorage.getItem(key) || '[]');
          list.forEach(e => {
            if (e.endorser === walletAddress) {
              given.push(e);
            }
          });
        }
      }
      given.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setEndorsementsGiven(given);
      setLoading(false);
    };

    loadData();
  }, [walletAddress]);

  const truncateAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : '';

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background pt-32 flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background */}
        <FloatingOrb className="w-[600px] h-[600px] bg-accent/5 blur-[150px] top-20 left-1/2 -translate-x-1/2" />
        <FloatingOrb className="w-[300px] h-[300px] bg-purple-700/5 blur-[100px] bottom-20 right-20" delay={2} />
        
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md relative"
        >
          {/* Card */}
          <div 
            className="p-10 rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(255,255,255,0.03) 60%, rgba(124,58,237,0.04) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-700/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-800/20 border border-accent/15 flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-black mb-2 tracking-tight">Command Center</h2>
              <p className="text-white/30 mb-8 text-sm font-medium leading-relaxed">
                Connect your Freighter wallet to access your TrustChain dashboard and on-chain reputation.
              </p>
              <button 
                onClick={connect}
                className="group w-full py-4 bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-accent/25 active:scale-[0.98]"
              >
                <Wallet className="w-4 h-4 group-hover:rotate-[-8deg] transition-transform" />
                Connect Wallet
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Merge and sort all activity events ───────────────────── */
  const allEvents = [
    ...endorsementsReceived.map(e => ({ ...e, type: 'received' })),
    ...endorsementsGiven.map(e => ({ ...e, type: 'given' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filteredEvents = activeTab === 'all' 
    ? allEvents 
    : allEvents.filter(e => e.type === activeTab);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden">
      {/* ── Ambient Background ──────────────────────────────── */}
      <FloatingOrb className="w-[700px] h-[500px] bg-accent/5 blur-[160px] top-10 left-1/3" />
      <FloatingOrb className="w-[400px] h-[400px] bg-purple-800/5 blur-[120px] bottom-40 right-10" delay={3} />
      <FloatingOrb className="w-[300px] h-[300px] bg-indigo-900/5 blur-[100px] top-80 right-1/4" delay={5} />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* ── Header ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-accent/8 border border-accent/12 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              >
                <Sparkles className="w-3 h-3" />
                Dashboard
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Welcome Back
                {credential ? (
                  <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
                    , {credential.name.split(' ')[0]}
                  </span>
                ) : ''}
              </h1>
            </div>

            {/* Wallet Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <div 
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="font-mono text-xs text-white/50">{truncateAddress(walletAddress)}</span>
                <button onClick={copyAddress} className="text-white/20 hover:text-accent transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a 
                  href={`https://stellar.expert/explorer/testnet/address/${walletAddress}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="text-white/20 hover:text-accent transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Stats Grid ────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard
            icon={ShieldCheck}
            label="Credential"
            value={credential ? credential.skill : '—'}
            color="accent"
            badge={credential ? 'Active' : 'Not Minted'}
            delay={0.05}
          />
          <StatCard
            icon={Star}
            label="Avg Rating"
            value={reputation?.average || '0.0'}
            suffix="/ 5"
            color="amber"
            delay={0.1}
          />
          <StatCard
            icon={Award}
            label="Received"
            value={endorsementsReceived.length}
            color="blue"
            delay={0.15}
          />
          <StatCard
            icon={UserCheck}
            label="Given"
            value={endorsementsGiven.length}
            color="emerald"
            delay={0.2}
          />
        </div>

        {/* ── Main Content (3-col layout) ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* ── Left Column ─────────────────────────────────── */}
          <div className="space-y-5">
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-5 rounded-2xl"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-black uppercase tracking-wider">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <QuickAction
                  to="/worker"
                  icon={credential ? FileCheck : ShieldCheck}
                  label={credential ? 'Update Credential' : 'Mint Credential'}
                  sublabel="Worker Portal"
                  color="accent"
                  delay={0.3}
                />
                <QuickAction
                  to="/endorse"
                  icon={Award}
                  label="Endorse a Worker"
                  sublabel="Write a Review"
                  color="amber"
                  delay={0.35}
                />
                <QuickAction
                  to="/verify"
                  icon={Search}
                  label="Verify Reputation"
                  sublabel="Audit Worker"
                  color="blue"
                  delay={0.4}
                />
                {credential && (
                  <QuickAction
                    to={`/profile/${walletAddress}`}
                    icon={Eye}
                    label="Public Profile"
                    sublabel="Shareable Link"
                    color="emerald"
                    delay={0.45}
                  />
                )}
              </div>
            </motion.div>

            {/* Credential Card */}
            {credential && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(124,58,237,0.1) 0%, rgba(15,15,25,0.6) 100%)',
                  border: '1px solid rgba(124,58,237,0.12)',
                }}
              >
                {/* Accent top bar */}
                <div className="h-1 bg-gradient-to-r from-accent via-purple-500 to-accent/30" />
                
                {/* Shimmer */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-accent/70">My Credential</p>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/15 rounded-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[8px] font-black uppercase text-green-400">On-Chain</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-black mb-2">{credential.name}</h4>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1.5 text-white/35 text-[11px] font-semibold">
                      <Briefcase className="w-3 h-3" /> {credential.skill}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/35 text-[11px] font-semibold">
                      <MapPin className="w-3 h-3" /> {credential.city}
                    </span>
                  </div>
                  
                  {credential.bio && (
                    <p className="text-[11px] text-white/25 italic leading-relaxed border-t border-white/[0.04] pt-3 mt-3">
                      "{credential.bio}"
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Reputation Score Card */}
            {reputation && endorsementsReceived.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-2xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(251,191,36,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(251,191,36,0.08)',
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-amber-400/60" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white/50">Reputation Score</h3>
                </div>
                
                {/* Score visual */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                      <circle 
                        cx="32" cy="32" r="28" fill="none" 
                        stroke="url(#scoreGrad)" 
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${(reputation.average / 5) * 175.9} 175.9`}
                      />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-black">{reputation.average}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-1.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(reputation.average) ? 'text-amber-400 fill-amber-400' : 'text-white/8'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] text-white/25 font-semibold">
                      Based on {endorsementsReceived.length} endorsement{endorsementsReceived.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Right Column: Activity Feed ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 rounded-2xl"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="p-6 sm:p-8">
              {/* Header with tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-7 bg-gradient-to-b from-accent to-purple-600 rounded-full" />
                  <h3 className="text-lg font-black tracking-tight">Activity Feed</h3>
                  <span className="text-[9px] font-bold text-white/15 bg-white/[0.04] px-2 py-0.5 rounded-md">{allEvents.length}</span>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                  {[
                    { key: 'all',      label: 'All' },
                    { key: 'received', label: 'Received' },
                    { key: 'given',    label: 'Given' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                        activeTab === tab.key
                          ? 'bg-accent/15 text-accent border border-accent/20'
                          : 'text-white/25 hover:text-white/40 border border-transparent'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity List */}
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.03] animate-pulse h-20" />
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mx-auto mb-5">
                    <Activity className="w-7 h-7 text-white/8" />
                  </div>
                  <p className="text-white/20 font-black uppercase tracking-[0.2em] text-[10px] mb-2">No Activity Yet</p>
                  <p className="text-white/10 text-xs font-medium max-w-xs mx-auto">
                    Start by minting a credential or endorsing a worker
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Link to="/worker" className="px-4 py-2 bg-accent/10 border border-accent/15 text-accent text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-accent/20 transition-all">
                      Mint Credential
                    </Link>
                    <Link to="/endorse" className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] text-white/40 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:text-white/60 transition-all">
                      Endorse Worker
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
                  <AnimatePresence>
                    {filteredEvents.slice(0, 15).map((event, idx) => (
                      <motion.div
                        key={`${event.txHash}-${idx}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all"
                      >
                        <div className="flex items-start gap-3">
                          {/* Event Icon */}
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            event.type === 'received' 
                              ? 'bg-blue-400/10 border border-blue-400/15' 
                              : 'bg-emerald-400/10 border border-emerald-400/15'
                          }`}>
                            {event.type === 'received' 
                              ? <Award className="w-4 h-4 text-blue-400" />
                              : <UserCheck className="w-4 h-4 text-emerald-400" />
                            }
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Top row */}
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold">
                                  {event.type === 'received' ? 'Endorsement Received' : 'Endorsement Given'}
                                </p>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                  event.type === 'received'
                                    ? 'bg-blue-400/10 text-blue-400'
                                    : 'bg-emerald-400/10 text-emerald-400'
                                }`}>
                                  {event.jobType}
                                </span>
                              </div>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className={`w-3 h-3 ${s <= event.rating ? 'text-amber-400 fill-amber-400' : 'text-white/5'}`} />
                                ))}
                              </div>
                            </div>
                            
                            {/* Feedback */}
                            <p className="text-[11px] text-white/30 truncate mb-2 leading-relaxed">"{event.feedback}"</p>
                            
                            {/* Footer */}
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-semibold text-white/15 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {event.txHash && (
                                <a 
                                  href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="text-[9px] font-mono text-white/10 hover:text-accent transition-colors flex items-center gap-1"
                                >
                                  <Hash className="w-2.5 h-2.5" />
                                  {event.txHash.slice(0, 8)}…
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Footer Badges ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-5 text-white/10"
        >
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <Globe className="w-3 h-3" /> Stellar Network
          </div>
          <div className="w-1 h-1 rounded-full bg-white/5" />
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" /> On-Chain Data
          </div>
          <div className="w-1 h-1 rounded-full bg-white/5" />
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
            <Target className="w-3 h-3" /> Live Testnet
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
