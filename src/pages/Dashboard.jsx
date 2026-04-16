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
    accent:  { bg: '#EFF6FF', border: '#DBEAFE', iconColor: '#1E3A8A' },
    amber:   { bg: '#FFF7ED', border: '#FFEDD5', iconColor: '#EA580C' },
    blue:    { bg: '#F0F9FF', border: '#E0F2FE', iconColor: '#0284C7' },
    emerald: { bg: '#ECFDF5', border: '#D1FAE5', iconColor: '#10B981' },
  };
  const c = colorMap[color] || colorMap.accent;
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-4 rounded-[14px] transition-all duration-300 group shadow-sm"
      style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E3A8A'; e.currentTarget.style.background = '#F9FAFB'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF'; }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <Icon className="w-4 h-4" style={{ color: c.iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-900 transition-colors group-hover:text-[#1E3A8A]">{label}</p>
        <p className="text-[10px] font-medium" style={{ color: '#6B7280' }}>{sublabel}</p>
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" style={{ color: '#1E3A8A', opacity: 0 }} />
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
        const localWorkerData = JSON.parse(localStorage.getItem(`trustchain_worker_${walletAddress}`) || 'null');
        if (localWorkerData) {
          setCredential({ name: localWorkerData.name || localWorkerData.fullName || 'Worker', skill: localWorkerData.skill || localWorkerData.skillCategory || '—', city: localWorkerData.city || 'Unknown', experience: localWorkerData.experience || '—', bio: localWorkerData.bio || '' });
        } else { setCredential(null); }
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
      <div className="min-h-screen bg-background pt-[100px] flex items-center justify-center px-6 relative overflow-hidden text-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-md p-10 rounded-[20px] relative overflow-hidden shadow-lg"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
        >
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
              <LayoutDashboard className="w-7 h-7 text-[#1E3A8A]" />
            </div>
            <h2 className="text-3xl mb-2 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Command Center</h2>
            <p className="mb-8 text-sm" style={{ color: '#6B7280', fontWeight: 400 }}>Connect wallet to access your dashboard.</p>
            <button onClick={connect} className="w-full">
              <div className="shiny-border">
                <div className="shiny-border-inner w-full py-4 relative z-20 font-bold uppercase tracking-[0.2em] text-[10px] text-white flex items-center justify-center gap-2.5">
                  <Wallet className="w-4 h-4" /> Connect Wallet
                </div>
              </div>
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
    <div className="min-h-screen bg-background pt-[100px] pb-6 px-4 sm:px-6 relative overflow-hidden text-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* ── Welcome Banner ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-4 p-5 sm:p-6 rounded-[20px] shadow-sm"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#EFF6FF] border border-[#DBEAFE]">
                <LayoutDashboard className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-[32px] text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, letterSpacing: '-0.02em' }}>
                  Welcome Back
                </h1>
                <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Your on-chain identity hub</p>
              </div>
            </div>

            {/* Wallet Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECFDF5] border border-[#D1FAE5]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" style={{ animation: 'pulse-dot 2s infinite' }} />
              <span className="font-mono text-[11px] font-bold text-[#10B981]">{truncAddr(walletAddress)}</span>
              <button onClick={copyAddress} className="transition-colors text-[#10B981] opacity-70 hover:opacity-100">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
              <a href={`https://stellar.expert/explorer/testnet/address/${walletAddress}`} target="_blank" rel="noopener noreferrer" className="transition-colors text-[#10B981] opacity-70 hover:opacity-100">
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row (4 cards) ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, ease: [0.23, 1, 0.32, 1] }} className="grid grid-cols-4 gap-3 mb-4">
          {[
            { icon: ShieldCheck, label: 'Credential', value: credential?.skill || '—', badge: credential ? 'Active' : null, accent: '#1E3A8A', badgeBg: '#ECFDF5', badgeBorder: '#D1FAE5', badgeColor: '#10B981' },
            { icon: Star, label: 'Avg Rating', value: reputation?.average || '0.0', suffix: '/ 5', accent: '#EA580C' },
            { icon: Award, label: 'Received', value: endorsementsReceived.length, accent: '#10B981' },
            { icon: UserCheck, label: 'Given', value: endorsementsGiven.length, accent: '#0284C7' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="p-5 rounded-[20px] relative overflow-hidden cursor-default shadow-sm"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `${stat.accent}15`, border: `1px solid ${stat.accent}30` }}>
                  <stat.icon className="w-4.5 h-4.5" style={{ color: stat.accent }} />
                </div>
                {stat.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider" style={{ background: stat.badgeBg, border: `1px solid ${stat.badgeBorder}`, color: stat.badgeColor }}>
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className="label-mono mb-1 font-bold text-gray-500">{stat.label}</p>
              <div className="flex items-baseline gap-1.5">
                {stat.label === 'Credential' ? (
                  <span className="text-[28px] text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>{stat.value}</span>
                ) : (
                  <span className="text-2xl font-bold tracking-tight text-gray-900">{stat.value}</span>
                )}
                {stat.suffix && <span className="text-xs font-bold" style={{ color: '#6B7280' }}>{stat.suffix}</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main Content: 3-col ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* ── Left: Quick Actions ───────────────────────────── */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="p-5 rounded-[20px] shadow-sm"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Quick Actions</h3>
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
          </div>

          {/* ── Right: Activity Feed ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-9 rounded-[20px] shadow-sm"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderLeft: '3px solid #1E3A8A' }}
          >
            <div className="p-5">
              {/* Header + Tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, fontSize: '18px' }}>Activity Feed</h3>
                  <span className="label-mono px-2 py-0.5 rounded-full text-gray-500 font-bold" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>{allEvents.length}</span>
                </div>
                <div className="flex gap-1 p-0.5 rounded-full" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'received', label: 'Received' },
                    { key: 'given', label: 'Given' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className="px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300"
                      style={{
                        background: activeTab === tab.key ? '#EFF6FF' : 'transparent',
                        color: activeTab === tab.key ? '#1E3A8A' : '#6B7280',
                      }}
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
                    <div key={i} className="p-4 rounded-xl animate-pulse h-16" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }} />
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-gray-200 bg-gray-50">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-white shadow-sm border border-gray-200">
                    <Activity className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="font-bold uppercase tracking-[0.15em] text-[10px] mb-1.5 text-gray-600">No Activity Yet</p>
                  <p className="text-xs max-w-xs mx-auto mb-5 font-medium text-gray-500">
                    Start by minting a credential or endorsing a worker
                  </p>
                  <div className="flex justify-center gap-2.5">
                    <Link to="/worker">
                      <div className="shiny-border">
                        <div className="shiny-border-inner px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-white">Mint Credential</div>
                      </div>
                    </Link>
                    <Link to="/endorse" className="px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-gray-100"
                      style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#4B5563' }}>
                      Endorse Worker
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#E5E7EB transparent' }}>
                  <AnimatePresence>
                    {filteredEvents.slice(0, 20).map((event, idx) => (
                      <motion.div
                        key={`${event.txHash}-${idx}`}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03, ease: [0.23, 1, 0.32, 1] }}
                        className="group p-4 rounded-xl transition-all duration-300 shadow-sm"
                        style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E3A8A'; e.currentTarget.style.background = '#F9FAFB'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF'; }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{
                            background: event.type === 'received' ? '#F0F9FF' : '#EFF6FF',
                            border: `1px solid ${event.type === 'received' ? '#E0F2FE' : '#DBEAFE'}`,
                          }}>
                            {event.type === 'received'
                              ? <Award className="w-4 h-4 text-[#0284C7]" />
                              : <UserCheck className="w-4 h-4 text-[#1E3A8A]" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-gray-900 group-hover:text-[#1E3A8A] transition-colors">
                                  {event.type === 'received' ? 'Endorsement Received' : 'Endorsement Given'}
                                </p>
                                <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase" style={{
                                  background: event.type === 'received' ? '#F0F9FF' : '#EFF6FF',
                                  color: event.type === 'received' ? '#0284C7' : '#1E3A8A',
                                  border: `1px solid ${event.type === 'received' ? '#E0F2FE' : '#DBEAFE'}`,
                                }}>{event.jobType}</span>
                              </div>
                              <div className="flex gap-0.5 shrink-0">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className="w-2.5 h-2.5" style={{ color: s <= event.rating ? '#FBBF24' : '#E5E7EB', fill: s <= event.rating ? '#FBBF24' : 'none' }} />
                                ))}
                              </div>
                            </div>
                            <p className="text-[10px] truncate mb-1.5 font-medium leading-relaxed" style={{ color: '#4B5563', fontStyle: 'italic' }}>"{event.feedback}"</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-bold flex items-center gap-1" style={{ color: '#6B7280' }}>
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {event.txHash && (
                                <a href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`} target="_blank" rel="noopener noreferrer"
                                  className="text-[9px] font-bold font-mono flex items-center gap-1 transition-colors"
                                  style={{ color: '#1E3A8A' }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#EA580C'}
                                  onMouseLeave={e => e.currentTarget.style.color = '#1E3A8A'}
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 flex items-center justify-center gap-5" style={{ color: '#6B7280' }}>
          {[
            { icon: Globe, text: 'Stellar Network' },
            { icon: ShieldCheck, text: 'On-Chain Data' },
            { icon: Target, text: 'Live Testnet' },
          ].map((badge, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-0.5 h-0.5 rounded-full" style={{ background: '#E5E7EB' }} />}
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold">
                <badge.icon className="w-3 h-3" /> {badge.text}
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
