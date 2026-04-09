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

/* ── Quick Action Link ────────────────────────────────────────── */
const QuickAction = ({ to, icon: Icon, label, sublabel, color }) => {
  const colorMap = {
    accent:  { bg: 'rgba(124,58,237,0.1)',  border: 'rgba(124,58,237,0.15)', text: 'text-accent' },
    amber:   { bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.15)',  text: 'text-amber-400' },
    blue:    { bg: 'rgba(96,165,250,0.1)',    border: 'rgba(96,165,250,0.15)',  text: 'text-blue-400' },
    emerald: { bg: 'rgba(52,211,153,0.1)',    border: 'rgba(52,211,153,0.15)', text: 'text-emerald-400' },
  };
  const c = colorMap[color] || colorMap.accent;
  return (
    <Link to={to} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.05] transition-all group">
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}
      >
        <Icon className={`w-3.5 h-3.5 ${c.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">{label}</p>
        <p className="text-[9px] text-white/15 font-medium">{sublabel}</p>
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 text-white/8 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
    </Link>
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
        // Merge with localStorage data to get the real registered name
        const localWorkerData = JSON.parse(localStorage.getItem(`trustchain_worker_${walletAddress}`) || 'null');
        if (localWorkerData) {
          cred.name = localWorkerData.name || localWorkerData.fullName || cred.name;
          cred.city = localWorkerData.city || cred.city;
          cred.bio = localWorkerData.bio || cred.bio;
          cred.experience = localWorkerData.experience || cred.experience;
        }
        setCredential(cred);
        const localKey = `endorsements_${walletAddress}`;
        const received = JSON.parse(localStorage.getItem(localKey) || '[]');
        setEndorsementsReceived(received);
        const rep = calculateScore(received);
        setReputation(rep);
      } catch {
        // Even if on-chain fetch fails, try localStorage for credential data
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
      const given = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('endorsements_')) {
          const list = JSON.parse(localStorage.getItem(key) || '[]');
          list.forEach(e => { if (e.endorser === walletAddress) given.push(e); });
        }
      }
      given.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setEndorsementsGiven(given);
      setLoading(false);
    };
    loadData();
  }, [walletAddress]);

  const truncAddr = (a) => a ? `${a.slice(0,6)}…${a.slice(-6)}` : '';
  const copyAddress = () => { navigator.clipboard.writeText(walletAddress); setCopied(true); setTimeout(() => setCopied(false), 2000); };

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
              <LayoutDashboard className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-2xl font-black mb-2 tracking-tight">Command Center</h2>
            <p className="text-white/30 mb-6 text-sm font-medium">Connect wallet to access your dashboard.</p>
            <button onClick={connect} className="group w-full py-4 bg-gradient-to-r from-accent to-purple-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-accent/25 active:scale-[0.98]">
              <Wallet className="w-4 h-4" /> Connect Wallet
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Activity data ─────────────────────────────────────────── */
  const allEvents = [
    ...endorsementsReceived.map(e => ({ ...e, type: 'received' })),
    ...endorsementsGiven.map(e => ({ ...e, type: 'given' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const filteredEvents = activeTab === 'all' ? allEvents : allEvents.filter(e => e.type === activeTab);

  return (
    <div className="min-h-screen bg-background pt-20 pb-6 px-4 sm:px-6 relative overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/3 w-[700px] h-[400px] bg-accent/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-purple-800/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
            backgroundSize: '70px 70px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ── Compact Header Bar ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 sm:p-5 rounded-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(15,15,25,0.7) 50%, rgba(99,40,210,0.06) 100%)',
            border: '1px solid rgba(124,58,237,0.12)',
          }}
        >
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-accent/12 rounded-full blur-[60px]" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-purple-800 flex items-center justify-center shadow-lg shadow-accent/20">
                <LayoutDashboard className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                  Welcome Back{credential && credential.name && credential.name !== 'Worker' ? <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">, {credential.name.split(' ')[0]}</span> : ''}
                </h1>
                <p className="text-white/25 text-[10px] font-semibold hidden sm:block">Your on-chain identity hub</p>
              </div>
            </div>

            {/* Wallet Badge */}
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              <span className="font-mono text-[10px] text-white/40">{truncAddr(walletAddress)}</span>
              <button onClick={copyAddress} className="text-white/15 hover:text-accent transition-colors">
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <a href={`https://stellar.expert/explorer/testnet/address/${walletAddress}`} target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-accent transition-colors">
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Strip ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-4 gap-3 mb-4"
        >
          {[
            { 
              icon: ShieldCheck, label: 'Credential', 
              value: credential?.skill || '—', 
              badge: credential ? 'Active' : null,
              color: 'accent',
              glow: 'rgba(124,58,237,0.08)',
              badgeClass: 'bg-green-500/10 text-green-400 border-green-500/15',
            },
            { 
              icon: Star, label: 'Avg Rating', 
              value: reputation?.average || '0.0', suffix: '/ 5',
              color: 'amber',
              glow: 'rgba(251,191,36,0.06)',
            },
            { 
              icon: Award, label: 'Received', 
              value: endorsementsReceived.length,
              color: 'blue',
              glow: 'rgba(96,165,250,0.06)',
            },
            { 
              icon: UserCheck, label: 'Given', 
              value: endorsementsGiven.length,
              color: 'emerald',
              glow: 'rgba(52,211,153,0.06)',
            },
          ].map((stat, i) => {
            const iconColors = {
              accent: 'text-accent', amber: 'text-amber-400',
              blue: 'text-blue-400', emerald: 'text-emerald-400',
            };
            const bgColors = {
              accent: 'rgba(124,58,237,0.12)', amber: 'rgba(251,191,36,0.12)',
              blue: 'rgba(96,165,250,0.12)', emerald: 'rgba(52,211,153,0.12)',
            };
            const borderColors = {
              accent: 'rgba(124,58,237,0.15)', amber: 'rgba(251,191,36,0.15)',
              blue: 'rgba(96,165,250,0.15)', emerald: 'rgba(52,211,153,0.15)',
            };
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                className="p-4 rounded-xl relative overflow-hidden group hover:translate-y-[-2px] transition-transform cursor-default"
                style={{
                  background: `linear-gradient(145deg, ${stat.glow} 0%, rgba(255,255,255,0.025) 100%)`,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: stat.glow }} />
                <div className="relative z-10 flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bgColors[stat.color], border: `1px solid ${borderColors[stat.color]}` }}>
                    <stat.icon className={`w-4 h-4 ${iconColors[stat.color]}`} />
                  </div>
                  {stat.badge && (
                    <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${stat.badgeClass}`}>{stat.badge}</span>
                  )}
                </div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/20 mb-0.5">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black tracking-tight">{stat.value}</span>
                  {stat.suffix && <span className="text-[10px] text-white/12 font-bold">{stat.suffix}</span>}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Main Content: 3-col ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* ── Left: Quick Actions + Credential ─────────────── */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <h3 className="text-[10px] font-black uppercase tracking-wider">Quick Actions</h3>
              </div>
              <div className="space-y-1.5">
                <QuickAction to="/worker" icon={credential ? FileCheck : ShieldCheck} label={credential ? 'Update Credential' : 'Mint Credential'} sublabel="Worker Portal" color="accent" />
                <QuickAction to="/discover" icon={Users} label="Find Workers" sublabel="Browse & Hire" color="blue" />
                <QuickAction to="/endorse" icon={Award} label="Endorse Worker" sublabel="Write Review" color="amber" />
                <QuickAction to="/verify" icon={Search} label="Verify Worker" sublabel="Audit Reputation" color="emerald" />
                {credential && (
                  <QuickAction to={`/profile/${walletAddress}`} icon={Eye} label="My Profile" sublabel="Public Page" color="accent" />
                )}
              </div>
            </motion.div>

            {/* Credential Card */}
            {credential && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(15,15,25,0.5) 100%)',
                  border: '1px solid rgba(124,58,237,0.1)',
                }}
              >
                <div className="h-[2px] bg-gradient-to-r from-accent via-purple-500 to-accent/30" />
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[8px] font-black uppercase tracking-[0.18em] text-accent/60">My Credential</p>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 border border-green-500/12 rounded">
                      <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[7px] font-black uppercase text-green-400">On-Chain</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-black mb-1.5">{credential.name}</h4>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="flex items-center gap-1 text-white/30 text-[10px] font-semibold"><Briefcase className="w-2.5 h-2.5" /> {credential.skill}</span>
                    <span className="flex items-center gap-1 text-white/30 text-[10px] font-semibold"><MapPin className="w-2.5 h-2.5" /> {credential.city}</span>
                  </div>
                  {credential.bio && (
                    <p className="text-[10px] text-white/20 italic leading-relaxed border-t border-white/[0.04] pt-2 mt-2 line-clamp-2">
                      "{credential.bio}"
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Mini Reputation Card */}
            {reputation && endorsementsReceived.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="p-4 rounded-xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(251,191,36,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(251,191,36,0.06)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400/50" />
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-white/40">Reputation</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 shrink-0">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                      <circle cx="24" cy="24" r="20" fill="none" stroke="url(#scoreGradD)" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${(reputation.average / 5) * 125.6} 125.6`}
                      />
                      <defs>
                        <linearGradient id="scoreGradD" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-black">{reputation.average}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= Math.round(reputation.average) ? 'text-amber-400 fill-amber-400' : 'text-white/6'}`} />
                      ))}
                    </div>
                    <p className="text-[9px] text-white/20 font-semibold">
                      {endorsementsReceived.length} review{endorsementsReceived.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Right: Activity Feed ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-9 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div className="p-5">
              {/* Header + Tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-5 bg-gradient-to-b from-accent to-purple-600 rounded-full" />
                  <h3 className="text-sm font-black tracking-tight">Activity Feed</h3>
                  <span className="text-[8px] font-bold text-white/12 bg-white/[0.04] px-1.5 py-0.5 rounded">{allEvents.length}</span>
                </div>
                <div className="flex gap-1 p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'received', label: 'Received' },
                    { key: 'given', label: 'Given' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
                        activeTab === tab.key
                          ? 'bg-accent/15 text-accent border border-accent/20'
                          : 'text-white/20 hover:text-white/35 border border-transparent'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Events */}
              {loading ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.03] animate-pulse h-16" />
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-6 h-6 text-white/6" />
                  </div>
                  <p className="text-white/15 font-black uppercase tracking-[0.18em] text-[9px] mb-1.5">No Activity Yet</p>
                  <p className="text-white/8 text-[11px] font-medium max-w-xs mx-auto mb-4">
                    Start by minting a credential or endorsing a worker
                  </p>
                  <div className="flex justify-center gap-2.5">
                    <Link to="/worker" className="px-3.5 py-2 bg-accent/10 border border-accent/15 text-accent text-[9px] font-bold uppercase tracking-wider rounded-lg hover:bg-accent/20 transition-all">Mint Credential</Link>
                    <Link to="/endorse" className="px-3.5 py-2 bg-white/[0.04] border border-white/[0.06] text-white/30 text-[9px] font-bold uppercase tracking-wider rounded-lg hover:text-white/50 transition-all">Endorse Worker</Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
                  <AnimatePresence>
                    {filteredEvents.slice(0, 20).map((event, idx) => (
                      <motion.div
                        key={`${event.txHash}-${idx}`}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            event.type === 'received' 
                              ? 'bg-blue-400/10 border border-blue-400/12' 
                              : 'bg-emerald-400/10 border border-emerald-400/12'
                          }`}>
                            {event.type === 'received' 
                              ? <Award className="w-3.5 h-3.5 text-blue-400" />
                              : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold">
                                  {event.type === 'received' ? 'Endorsement Received' : 'Endorsement Given'}
                                </p>
                                <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase ${
                                  event.type === 'received' ? 'bg-blue-400/10 text-blue-400' : 'bg-emerald-400/10 text-emerald-400'
                                }`}>{event.jobType}</span>
                              </div>
                              <div className="flex gap-0.5 shrink-0">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className={`w-2.5 h-2.5 ${s <= event.rating ? 'text-amber-400 fill-amber-400' : 'text-white/5'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-[10px] text-white/25 truncate mb-1.5">"{event.feedback}"</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] font-semibold text-white/12 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {event.txHash && (
                                <a href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`} target="_blank" rel="noopener noreferrer"
                                  className="text-[8px] font-mono text-white/8 hover:text-accent transition-colors flex items-center gap-1"
                                >
                                  <Hash className="w-2 h-2" /> {event.txHash.slice(0,8)}…
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
          transition={{ delay: 0.4 }}
          className="mt-5 flex items-center justify-center gap-4 text-white/10"
        >
          {[
            { icon: Globe, text: 'Stellar Network' },
            { icon: ShieldCheck, text: 'On-Chain Data' },
            { icon: Target, text: 'Live Testnet' },
          ].map((badge, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-0.5 h-0.5 rounded-full bg-white/6" />}
              <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider">
                <badge.icon className="w-2.5 h-2.5" /> {badge.text}
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
