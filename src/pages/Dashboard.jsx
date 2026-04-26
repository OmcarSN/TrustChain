import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShieldCheck, Award, Search, UserCheck, Wallet, ArrowRight, ExternalLink, Clock, Star, Briefcase, MapPin, Hash, TrendingUp, Activity, ChevronRight, Zap, Users, Copy, Check, Sparkles, ArrowUpRight, BarChart3, Target, FileCheck, PenLine, Eye, Globe, Link2, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../context/WalletContext';
import { fetchWorkerCredential } from '../lib/stellar';
import { calculateScore } from '../lib/reputation';

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

      // Fallback: if received is empty, scan all endorsement keys
      // to check if any endorsements reference this wallet as the worker
      let receivedFinal = received;
      if (received.length === 0) {
        const allReceived = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('endorsements_')) {
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            list.forEach(e => {
              if (e.worker === walletAddress) allReceived.push(e);
            });
          }
        }
        if (allReceived.length > 0) {
          receivedFinal = allReceived;
          // Also fix the storage so the correct key exists going forward
          localStorage.setItem(localKey, JSON.stringify(allReceived));
        }
      }
      setEndorsementsReceived(receivedFinal);
      const rep = calculateScore(receivedFinal);
      setReputation(rep);

      // ── 2. Always read endorsements given (scan all keys) ──
      const given = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('endorsements_') && key !== localKey) {
          const list = JSON.parse(localStorage.getItem(key) || '[]');
          list.forEach(e => {
            if (e.endorser === walletAddress) given.push(e);
          });
        }
      }
      given.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setEndorsementsGiven(given);

      // ── 3. Try to load credential (on-chain first, fallback to localStorage) ──
      try {
        const cred = await fetchWorkerCredential(walletAddress);
        const localWorkerData = JSON.parse(
          localStorage.getItem(`trustchain_worker_${walletAddress}`) || 'null'
        );
        if (localWorkerData) {
          cred.name = localWorkerData.name || localWorkerData.fullName || cred.name;
          cred.skill = localWorkerData.skill || localWorkerData.skillCategory || cred.skill;
          cred.city = localWorkerData.city || cred.city;
          cred.bio = localWorkerData.bio || cred.bio;
          cred.experience = localWorkerData.experience || cred.experience;
        }
        setCredential(cred);
      } catch {
        // Fallback: read credential entirely from localStorage
        const localWorkerData = JSON.parse(
          localStorage.getItem(`trustchain_worker_${walletAddress}`) || 'null'
        );
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
    };
    loadData();
  }, [walletAddress]);

  const truncAddr = (a) => a ? `${a.slice(0,6)}…${a.slice(-6)}` : '';
  const copyAddress = () => { navigator.clipboard.writeText(walletAddress); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px' }}>
        <style>{`
          @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes iconPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.05); } 50% { box-shadow: 0 0 0 12px rgba(255,255,255,0); } }
          @keyframes btnPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,0); } }
          @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
          .conn-anim { opacity: 0; animation: fadeSlideUp 0.6s ease forwards; }
          .shimmer-text { background: linear-gradient(to right, #ffffff 20%, #888888 50%, #ffffff 80%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; animation: shimmer 3s linear infinite; }
          .conn-btn { transition: all 0.25s ease; animation: btnPulse 2.5s ease infinite; }
          .conn-btn:hover { background-color: rgba(220,220,220,1) !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.15) !important; }
        `}</style>

        {/* Background Graphics */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,110,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="text-center" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
          
          <div className="conn-anim" style={{ width: '72px', height: '72px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', animation: 'iconPulse 3s ease infinite, fadeSlideUp 0.6s ease forwards', animationDelay: '0s, 0.1s', borderRadius: '2px' }}>
            <LayoutDashboard style={{ width: '28px', height: '28px', color: 'rgba(255,255,255,0.5)' }} />
          </div>

          <h2 className="font-clash shimmer-text conn-anim" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '12px', animationDelay: '0.2s' }}>{t('dashboard.commandCenter')}</h2>
          
          <p className="font-inter conn-anim" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', marginBottom: '32px', maxWidth: '400px', textAlign: 'center', lineHeight: '1.6', animationDelay: '0.3s' }}>{t('dashboard.connectPrompt')}</p>
          
          <div className="conn-anim" style={{ animationDelay: '0.4s' }}>
            <button onClick={connect} className="conn-btn font-inter" style={{ padding: '14px 40px', backgroundColor: '#ffffff', color: '#000000', border: 'none', fontWeight: '800', fontSize: '13px', letterSpacing: '2px', cursor: 'pointer', borderRadius: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase' }}>
              <Wallet style={{ width: '16px', height: '16px' }} /> {t('dashboard.connectBtn')}
            </button>
          </div>

          <div className="conn-anim font-inter" style={{ display: 'flex', gap: '32px', marginTop: '48px', opacity: 0.4, animationDelay: '0.6s' }}>
            <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>✓ VIEW STATS</span>
            <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>✓ MANAGE PROFILE</span>
            <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>✓ TRACK ENDORSEMENTS</span>
          </div>

        </div>
      </div>
    );
  }

  const allEvents = [...endorsementsReceived.map(e => ({ ...e, type:'received' })), ...endorsementsGiven.map(e => ({ ...e, type:'given' }))].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const filteredEvents = activeTab === 'all' ? allEvents : allEvents.filter(e => e.type === activeTab);

  const quickActions = [
    { to:'/worker', icon: credential ? FileCheck : ShieldCheck, label: credential ? t('dashboard.updateCred') : t('dashboard.mintCred'), sub: t('dashboard.workerPortal') },
    { to:'/discover', icon: Users, label: t('dashboard.findWorkers'), sub: t('dashboard.browseHire') },
    { to:'/endorse', icon: Award, label: t('dashboard.endorseWorker'), sub: t('dashboard.writeReview') },
    { to:'/verify', icon: Search, label: t('dashboard.verifyWorker'), sub: t('dashboard.auditReputation') },
    ...(credential ? [{ to:`/profile/${walletAddress}`, icon: Eye, label: t('dashboard.myProfile'), sub: t('dashboard.publicPage') }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Background Graphics (Grid & Orbs) */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,220,110,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      
      {/* Atmospheric Light Leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top:'-80px', left:'20%', width:'400px', height:'400px', background:'#f97316', filter:'blur(120px)', opacity:0.04, zIndex: 0 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom:'-80px', right:'-80px', width:'400px', height:'400px', background:'#1e3a8a', filter:'blur(120px)', opacity:0.05, zIndex: 0 }} />

      <style>{`
        @keyframes dbFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .db-anim { opacity:0; animation: dbFadeUp 0.4s ease forwards; }
        .db-qa { transition: all 0.15s ease; cursor:pointer; text-decoration:none; color:inherit; display:flex; align-items:center; gap:14px; padding:12px 20px; border-bottom:1px solid rgba(255,255,255,0.04); }
        .db-qa:hover { background-color: rgba(255,255,255,0.03); }
        .db-tab { transition: all 0.15s ease; cursor:pointer; border:none; }
        .db-tab:hover { background-color: rgba(255,255,255,0.04); }
        @media (max-width:900px) { .db-layout { flex-direction:column !important; } .db-sidebar { width:100% !important; border-right:none !important; border-bottom:1px solid rgba(255,255,255,0.06); } }
      `}</style>

      {/* Two-column layout */}
      <div className="db-layout" style={{ display:'flex', paddingTop:'100px', paddingLeft:'24px', paddingRight:'24px', minHeight:'100vh', position:'relative', zIndex:10 }}>

        {/* ═══ LEFT SIDEBAR ═══ */}
        <div className="db-sidebar" style={{ width:'280px', minWidth:'260px', flexShrink:0, borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', overflowY:'auto', paddingBottom:'40px' }}>

          {/* Sidebar stats — vertical stack, not cramped grid */}
          <div className="db-anim" style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animationDelay: '0s'
          }}>
            {/* Credential/Skill pill — full width */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>
                {t('dashboard.credential')}
              </span>
              <span style={{
                padding: '3px 12px',
                border: '1px solid rgba(255,255,255,0.12)',
                fontSize: '10px',
                letterSpacing: '2px',
                color: 'rgba(255,255,255,0.7)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                fontWeight: '600'
              }}>
                {credential?.skill || '—'}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.04)' }} />

            {/* Avg Rating row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>
                {t('dashboard.avgRating')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="font-clash" style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff' }}>
                  {reputation?.average || '0.0'}
                </span>
                <Star style={{ width: '12px', height: '12px', color: '#f5a623', fill: '#f5a623' }} />
              </div>
            </div>

            {/* Received row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>
                {t('dashboard.received')}
              </span>
              <span className="font-clash" style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff' }}>
                {endorsementsReceived.length}
              </span>
            </div>

            {/* Given row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: '700' }}>
                {t('dashboard.given')}
              </span>
              <span className="font-clash" style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff' }}>
                {endorsementsGiven.length}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="db-anim" style={{ animationDelay:'0.05s' }}>
            <p className="font-inter" style={{ padding:'20px 20px 10px 20px', fontSize:'9px', letterSpacing:'4px', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', fontWeight:'700' }}>{t('dashboard.quickActions')}</p>
            {quickActions.map((a, i) => (
              <Link key={i} to={a.to} className="db-qa">
                <div style={{ width:'32px', height:'32px', flexShrink:0, border:'1px solid rgba(255,255,255,0.08)', backgroundColor:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <a.icon style={{ width:'14px', height:'14px', color:'rgba(255,255,255,0.35)' }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p className="font-inter" style={{ fontSize:'13px', fontWeight:'600', color:'#fff', marginBottom:'2px' }}>{a.label}</p>
                  <p className="font-inter" style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)' }}>{a.sub}</p>
                </div>
                <ArrowUpRight style={{ width:'11px', height:'11px', color:'rgba(255,255,255,0.2)', flexShrink:0 }} />
              </Link>
            ))}
          </div>

          {/* My Credential */}
          {credential && (
            <div className="db-anim" style={{ animationDelay:'0.1s' }}>
              <p className="font-inter" style={{ padding:'20px 20px 10px 20px', fontSize:'9px', letterSpacing:'4px', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', fontWeight:'700' }}>{t('dashboard.myCredential')}</p>
              <div style={{ margin:'0 12px', padding:'16px', border:'1px solid rgba(255,255,255,0.08)', backgroundColor:'rgba(255,255,255,0.02)', borderTop:'2px solid rgba(255,255,255,0.12)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
                  <span className="font-inter" style={{ fontSize:'15px', fontWeight:'800', color:'#fff' }}>{credential.name}</span>
                  <span style={{ fontSize:'9px', letterSpacing:'2px', color:'#00dc6e', backgroundColor:'rgba(0,220,110,0.08)', border:'1px solid rgba(0,220,110,0.2)', padding:'3px 8px' }}>● {t('dashboard.onChain')}</span>
                </div>
                <div style={{ display:'flex', gap:'12px', alignItems:'center', marginBottom:'10px' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Briefcase style={{ width:'11px', height:'11px', color:'rgba(255,255,255,0.2)' }} /><span className="font-inter" style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)' }}>{credential.skill}</span></span>
                  <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><MapPin style={{ width:'11px', height:'11px', color:'rgba(255,255,255,0.2)' }} /><span className="font-inter" style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)' }}>{credential.city}</span></span>
                </div>
                {credential.bio && <p className="font-inter" style={{ fontSize:'12px', color:'rgba(255,255,255,0.3)', fontStyle:'italic', lineHeight:'1.5', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'10px', marginTop:'4px' }}>"{credential.bio}"</p>}
              </div>
            </div>
          )}

          {/* Reputation */}
          {reputation && endorsementsReceived.length > 0 && (
            <div className="db-anim" style={{ margin:'12px 12px 0', padding:'16px', border:'1px solid rgba(255,255,255,0.08)', backgroundColor:'rgba(255,255,255,0.02)', animationDelay:'0.15s' }}>
              <p className="font-inter" style={{ fontSize:'9px', letterSpacing:'4px', color:'rgba(255,255,255,0.25)', marginBottom:'10px', textTransform:'uppercase', fontWeight:'700' }}>{t('dashboard.reputation')}</p>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <span className="font-clash" style={{ fontSize:'2rem', fontWeight:'900' }}>{reputation.average}</span>
                <div>
                  <div style={{ display:'flex', gap:'2px', marginBottom:'4px' }}>
                    {[1,2,3,4,5].map(s => (<Star key={s} style={{ width:'12px', height:'12px', color: s <= Math.round(reputation.average) ? '#f5a623' : 'rgba(255,255,255,0.1)', fill: s <= Math.round(reputation.average) ? '#f5a623' : 'transparent' }} />))}
                  </div>
                  <p className="font-inter" style={{ fontSize:'10px', color:'rgba(255,255,255,0.25)' }}>{endorsementsReceived.length} {endorsementsReceived.length !== 1 ? t('dashboard.reviews') : t('dashboard.review')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══ RIGHT MAIN AREA ═══ */}
        <div style={{ flex:1, padding:'32px 40px', overflowY:'auto' }}>

          {/* Page Header */}
          <div className="db-anim" style={{ marginBottom:'32px', animationDelay:'0s' }}>
            <p className="font-inter" style={{ fontSize:'10px', letterSpacing:'4px', color:'rgba(255,255,255,0.3)', marginBottom:'6px', textTransform:'uppercase', fontWeight:'600' }}>{t('dashboard.eyebrow')}</p>
            <h1 className="font-clash" style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:'900', color:'#fff', marginBottom:'4px' }}>
              {t('dashboard.overview')}
              {credential && credential.name && credential.name !== 'Worker' && <span style={{ color:'rgba(255,255,255,0.4)' }}>, {credential.name.split(' ')[0]}</span>}
            </h1>
            <p className="font-inter" style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)' }}>{t('dashboard.overviewSub')}</p>
          </div>

          {/* Wallet bar */}
          <div className="db-anim" style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'28px', animationDelay:'0.05s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', border:'1px solid rgba(255,255,255,0.1)', padding:'8px 14px' }}>
              <span style={{ width:'6px', height:'6px', backgroundColor:'#00dc6e', borderRadius:'50%' }} />
              <span style={{ fontFamily:'monospace', fontSize:'11px', color:'rgba(255,255,255,0.5)' }}>{truncAddr(walletAddress)}</span>
              <button onClick={copyAddress} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.2)', display:'flex', padding:'2px' }}>
                {copied ? <Check style={{ width:'12px', height:'12px', color:'#00dc6e' }} /> : <Copy style={{ width:'12px', height:'12px' }} />}
              </button>
              <a href={`https://stellar.expert/explorer/testnet/account/${walletAddress}`} target="_blank" rel="noopener noreferrer" style={{ color:'rgba(255,255,255,0.2)', display:'flex' }}>
                <ExternalLink style={{ width:'12px', height:'12px' }} />
              </a>
            </div>
          </div>



          {/* Activity Feed */}
          <div className="db-anim" style={{ animationDelay:'0.25s' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <span className="font-inter" style={{ fontSize:'10px', letterSpacing:'4px', color:'rgba(255,255,255,0.3)', fontWeight:'700', textTransform:'uppercase' }}>{t('dashboard.activityFeed')}</span>
              <div style={{ display:'flex', gap:'0' }}>
                {[
                  { key:'all', label: t('dashboard.tabAll') },
                  { key:'received', label: t('dashboard.tabReceived') },
                  { key:'given', label: t('dashboard.tabGiven') },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="db-tab font-inter"
                    style={{
                      padding:'5px 14px', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase',
                      border:'1px solid rgba(255,255,255,0.1)',
                      backgroundColor: activeTab === tab.key ? '#fff' : 'transparent',
                      color: activeTab === tab.key ? '#000' : 'rgba(255,255,255,0.3)',
                      fontWeight: activeTab === tab.key ? '700' : '400',
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>{[1,2,3].map(i => (<div key={i} style={{ padding:'16px', backgroundColor:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.03)', height:'56px' }} className="animate-pulse" />))}</div>
            ) : filteredEvents.length === 0 ? (
              <div style={{ padding:'48px 0', textAlign:'center' }}>
                <Inbox style={{ width:'32px', height:'32px', color:'rgba(255,255,255,0.1)', margin:'0 auto 12px' }} />
                <p className="font-inter" style={{ fontSize:'13px', color:'rgba(255,255,255,0.2)' }}>{t('dashboard.noActivity')}</p>
                <p className="font-inter" style={{ fontSize:'11px', color:'rgba(255,255,255,0.15)', marginTop:'4px' }}>{t('dashboard.noActivitySub')}</p>
              </div>
            ) : (
              <div style={{ maxHeight:'500px', overflowY:'auto', scrollbarWidth:'thin', scrollbarColor:'rgba(255,255,255,0.05) transparent' }}>
                <AnimatePresence>
                  {filteredEvents.slice(0,20).map((event, idx) => (
                    <motion.div key={`${event.txHash}-${idx}`} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: idx * 0.03 }}
                      style={{ padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:'14px', alignItems:'flex-start' }}>
                      <div style={{ width:'36px', height:'36px', flexShrink:0, border:'1px solid rgba(255,255,255,0.1)', backgroundColor:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {event.type === 'received' ? <Award style={{ width:'14px', height:'14px', color:'rgba(255,255,255,0.25)' }} /> : <UserCheck style={{ width:'14px', height:'14px', color:'rgba(255,255,255,0.25)' }} />}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
                          <span className="font-inter" style={{ fontSize:'13px', fontWeight:'700', color:'#fff' }}>{event.type === 'received' ? t('dashboard.endorsementReceived') : t('dashboard.endorsementGiven')}</span>
                          <span style={{ fontSize:'9px', letterSpacing:'2px', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.1)', padding:'2px 8px', textTransform:'uppercase' }}>{event.jobType}</span>
                        </div>
                        <p className="font-inter" style={{ fontSize:'13px', color:'rgba(255,255,255,0.45)', fontStyle:'italic', marginBottom:'6px' }}>"{event.feedback}"</p>
                        <div style={{ display:'flex', gap:'12px' }}>
                          <span className="font-inter" style={{ fontSize:'11px', color:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', gap:'4px' }}>
                            <Clock style={{ width:'10px', height:'10px' }} />{new Date(event.timestamp).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                          </span>
                          {event.txHash && (
                            <a href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`} target="_blank" rel="noopener noreferrer" style={{ fontSize:'11px', fontFamily:'monospace', color:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', gap:'4px', textDecoration:'none' }}>
                              <Hash style={{ width:'10px', height:'10px' }} />{event.txHash.slice(0,8)}…
                            </a>
                          )}
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:'2px', alignItems:'center', flexShrink:0 }}>
                        {[1,2,3,4,5].map(s => (<Star key={s} style={{ width:'13px', height:'13px', color: s <= event.rating ? '#f5a623' : 'rgba(255,255,255,0.1)', fill: s <= event.rating ? '#f5a623' : 'transparent' }} />))}
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
  );
};

export default Dashboard;
