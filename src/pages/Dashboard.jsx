import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShieldCheck, Award, Search, UserCheck,
  Wallet, ArrowRight, ExternalLink, Clock, Star,
  Briefcase, MapPin, Hash, TrendingUp, Activity,
  ChevronRight, Zap, Users, Copy, Check,
  Sparkles, ArrowUpRight, BarChart3, Target,
  FileCheck, PenLine, Eye, Globe, Link2, Inbox
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../context/WalletContext';
import { fetchWorkerCredential } from '../lib/stellar';
import { calculateScore } from '../lib/reputation';

/* ── Quick Action Link ────────────────────────────────────────── */
const QuickAction = ({ to, icon: Icon, label, sublabel }) => (
  <Link to={to} className="flex items-center gap-3 p-3 border border-white/[0.05] rounded-[2px] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.05] transition-all group">
    <div className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
      <Icon className="w-3.5 h-3.5 text-white/40" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-white/70 group-hover:text-white transition-colors font-inter">{label}</p>
      <p className="text-[9px] text-white/20 font-inter">{sublabel}</p>
    </div>
    <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-white/40 transition-all shrink-0" />
  </Link>
);

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
          setCredential({
            name: localWorkerData.name || localWorkerData.fullName || 'Worker',
            skill: localWorkerData.skill || localWorkerData.skillCategory || '—',
            city: localWorkerData.city || 'Unknown',
            experience: localWorkerData.experience || '—',
            bio: localWorkerData.bio || '',
          });
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
      <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 flex flex-col justify-center relative overflow-hidden text-white">
        <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-14 h-14 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="w-7 h-7 text-white/30" />
          </div>
          <h2 className="font-clash text-3xl font-bold mb-3 tracking-tight">{t('dashboard.commandCenter')}</h2>
          <p className="text-white/30 mb-8 text-sm font-inter font-light leading-relaxed">{t('dashboard.connectPrompt')}</p>
          <button onClick={connect} className="w-full py-4 bg-white text-black rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] hover:opacity-85 transition-opacity flex items-center justify-center gap-2">
            <Wallet className="w-4 h-4" /> {t('dashboard.connectBtn')}
          </button>
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
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
      {/* Light leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '20%', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 reveal">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-inter mb-2">{t('dashboard.identityHub', 'Identity Hub')}</p>
            <h1 className="font-clash text-3xl lg:text-4xl font-bold tracking-tight">
              {t('dashboard.welcome', 'Welcome')}
              {credential && credential.name && credential.name !== 'Worker' && <span className="text-white/40">, {credential.name.split(' ')[0]}</span>}
            </h1>
          </div>
          <div className="flex items-center gap-2 border border-white/10 rounded-[2px] px-4 py-2">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span className="font-mono text-[10px] text-white/50">{truncAddr(walletAddress)}</span>
            <button onClick={copyAddress} className="text-white/20 hover:text-white transition-colors">
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
            <a href={`https://stellar.expert/explorer/testnet/address/${walletAddress}`} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors">
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="border-t border-b border-white/5 grid grid-cols-2 md:grid-cols-4 mb-6 reveal reveal-d1">
          {[
            { icon: ShieldCheck, label: t('dashboard.credential'), value: credential?.skill || '—' },
            { icon: Star, label: t('dashboard.avgRating'), value: reputation?.average || '0.0' },
            { icon: Award, label: t('dashboard.received'), value: endorsementsReceived.length },
            { icon: UserCheck, label: t('dashboard.given'), value: endorsementsGiven.length },
          ].map((stat, i, arr) => (
            <div key={stat.label} className={`px-6 py-6 ${i < arr.length - 1 ? 'border-r border-white/5' : ''}`}>
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1 font-inter">{stat.label}</p>
              <p className="font-clash text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content: 3-col */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Quick Actions + Credential */}
          <div className="lg:col-span-3 space-y-4 reveal reveal-d2">
            <div className="border border-white/[0.05] rounded-[2px] p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-3 font-inter">{t('dashboard.quickActions')}</h3>
              <div className="space-y-1.5">
                <QuickAction to="/worker" icon={credential ? FileCheck : ShieldCheck} label={credential ? t('dashboard.updateCred') : t('dashboard.mintCred')} sublabel={t('dashboard.workerPortal')} />
                <QuickAction to="/discover" icon={Users} label={t('dashboard.findWorkers')} sublabel={t('dashboard.browseHire')} />
                <QuickAction to="/endorse" icon={Award} label={t('dashboard.endorseWorker')} sublabel={t('dashboard.writeReview')} />
                <QuickAction to="/verify" icon={Search} label={t('dashboard.verifyWorker')} sublabel={t('dashboard.auditReputation')} />
                {credential && <QuickAction to={`/profile/${walletAddress}`} icon={Eye} label={t('dashboard.myProfile')} sublabel={t('dashboard.publicPage')} />}
              </div>
            </div>

            {/* Credential Card */}
            {credential && (
              <div className="border border-white/[0.07] rounded-[2px] p-4 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/30 font-inter">{t('dashboard.myCredential')}</p>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 border border-green-400/20 rounded-[2px]">
                    <div className="w-1 h-1 rounded-full bg-green-400" />
                    <span className="text-[7px] font-bold uppercase text-green-400/70">{t('dashboard.onChain')}</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold mb-1.5 font-inter">{credential.name}</h4>
                <div className="flex items-center gap-2.5 mb-2 text-white/30 text-[10px] font-inter">
                  <span className="flex items-center gap-1"><Briefcase className="w-2.5 h-2.5" /> {credential.skill}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {credential.city}</span>
                </div>
                {credential.bio && <p className="text-[10px] text-white/20 italic leading-relaxed border-t border-white/5 pt-2 mt-2 line-clamp-2 font-inter">"{credential.bio}"</p>}
              </div>
            )}

            {/* Reputation */}
            {reputation && endorsementsReceived.length > 0 && (
              <div className="border border-white/[0.07] rounded-[2px] p-4 bg-white/[0.02]">
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/25 mb-3 font-inter">{t('dashboard.reputation')}</p>
                <div className="flex items-center gap-3">
                  <span className="font-clash text-3xl font-bold">{reputation.average}</span>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[1,2,3,4,5].map(s => (<Star key={s} className={`w-3 h-3 ${s <= Math.round(reputation.average) ? 'text-white fill-white' : 'text-white/10'}`} />))}
                    </div>
                    <p className="text-[9px] text-white/25 font-inter">{endorsementsReceived.length} {endorsementsReceived.length !== 1 ? t('dashboard.reviews') : t('dashboard.review')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Activity Feed */}
          <div className="lg:col-span-9 border border-white/[0.05] rounded-[2px] reveal reveal-d3">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold tracking-tight font-inter">{t('dashboard.activityFeed')}</h3>
                <div className="flex gap-px">
                  {[
                    { key: 'all', label: t('dashboard.tabAll') },
                    { key: 'received', label: t('dashboard.tabReceived') },
                    { key: 'given', label: t('dashboard.tabGiven') },
                  ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all ${
                        activeTab === tab.key ? 'bg-white text-black' : 'text-white/25 hover:text-white/50 bg-white/[0.02]'
                      }`}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="space-y-2">{[1,2,3].map(i => (<div key={i} className="p-4 bg-white/[0.02] border border-white/[0.03] animate-pulse h-14 rounded-[2px]" />))}</div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-[2px] bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-5 h-5 text-white/10" />
                  </div>
                  <p className="text-white/20 font-bold uppercase tracking-[0.18em] text-[10px] mb-1 font-inter">{t('dashboard.noActivity')}</p>
                  <p className="text-white/25 text-[11px] font-inter max-w-xs mx-auto">{t('dashboard.noActivitySub')}</p>
                </div>
              ) : (
                <div className="space-y-px max-h-[420px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
                  <AnimatePresence>
                    {filteredEvents.slice(0, 20).map((event, idx) => (
                      <motion.div key={`${event.txHash}-${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                        className="group p-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-all">
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-[2px] flex items-center justify-center shrink-0 ${
                            event.type === 'received' ? 'bg-white/5 border border-white/10' : 'bg-white/5 border border-white/10'
                          }`}>
                            {event.type === 'received' ? <Award className="w-3.5 h-3.5 text-white/40" /> : <UserCheck className="w-3.5 h-3.5 text-white/40" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold font-inter">{event.type === 'received' ? t('dashboard.endorsementReceived') : t('dashboard.endorsementGiven')}</p>
                                <span className="px-1.5 py-0.5 border border-white/10 rounded-[2px] text-[7px] font-bold uppercase text-white/40">{event.jobType}</span>
                              </div>
                              <div className="flex gap-0.5 shrink-0">
                                {[1,2,3,4,5].map(s => (<Star key={s} className={`w-2.5 h-2.5 ${s <= event.rating ? 'text-white fill-white' : 'text-white/5'}`} />))}
                              </div>
                            </div>
                            <p className="text-[10px] text-white/25 truncate mb-1.5 font-inter">"{event.feedback}"</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] text-white/15 flex items-center gap-1 font-inter">
                                <Clock className="w-2.5 h-2.5" />{new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {event.txHash && (
                                <a href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`} target="_blank" rel="noopener noreferrer"
                                  className="text-[8px] font-mono text-white/10 hover:text-white/40 transition-colors flex items-center gap-1">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
