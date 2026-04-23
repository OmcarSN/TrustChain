import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Briefcase, MapPin, Star, Calendar, Award,
  ArrowLeft, Copy, Check, ExternalLink, Share2,
  ShieldCheck, Clock, Hash, ArrowRight
} from 'lucide-react';
import { calculateScore } from '../lib/reputation';
import TrustChainLogo from '../components/TrustChainLogo';

const AnimatedStat = ({ value, isFloat }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue === 0) {
      setCount(numValue || 0);
      return;
    }
    const duration = 1000;
    const steps = 30;
    const stepTime = Math.abs(Math.floor(duration / steps));
    const inc = numValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= numValue) {
        clearInterval(timer);
        setCount(numValue);
      } else {
        setCount(current);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return <>{isFloat ? count.toFixed(1) : Math.round(count)}</>;
};

const WorkerProfile = () => {
  const { address } = useParams();
  const [profile, setProfile] = useState(null);
  const [endorsements, setEndorsements] = useState([]);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`trustchain_worker_${address}`) || 'null');
    const endorse = JSON.parse(localStorage.getItem(`endorsements_${address}`) || '[]');
    if (data) {
      setProfile({
        name: data.name || data.fullName || 'Unknown',
        skill: data.skill || data.skillCategory || 'General',
        city: data.city || 'Unknown',
        experience: data.experience || 0,
        bio: data.bio || '',
        timestamp: data.timestamp,
      });
    }
    setEndorsements(endorse);
    setReputation(calculateScore(endorse));
    setLoading(false);
  }, [address]);

  const truncate = (a) => a ? `${a.slice(0,6)}…${a.slice(-6)}` : '';
  const copyAddr = () => { navigator.clipboard.writeText(address); setCopiedAddr(true); setTimeout(() => setCopiedAddr(false), 2000); };
  const shareProfile = () => { navigator.clipboard.writeText(window.location.href); setCopiedShare(true); setTimeout(() => setCopiedShare(false), 2000); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-[100px] pb-12 px-[3vw] relative overflow-hidden text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-48 bg-white/5 rounded-[2px]" />
            <div className="h-40 bg-white/5 rounded-[2px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050505] pt-[100px] pb-12 px-[3vw] flex items-center justify-center relative overflow-hidden text-white">
        <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <User className="w-7 h-7 text-white/20" />
          </div>
          <h2 className="font-clash text-2xl font-bold mb-2">No Credential Found</h2>
          <p className="text-white/30 text-sm mb-6 font-inter">This worker profile does not exist on the TrustChain network.</p>
          <div className="flex gap-3">
            <Link to="/verify" className="flex-1 py-3 bg-white text-black rounded-[2px] font-bold text-[10px] tracking-[0.15em] uppercase text-center hover:opacity-85 transition-opacity">Verify</Link>
            <Link to="/" className="flex-1 py-3 border border-white/15 rounded-[2px] font-bold text-[10px] tracking-[0.15em] uppercase text-center hover:bg-white/5 transition-all">Go Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const statAvgRating = reputation?.avgRating || 0;
  const statTotalReviews = reputation?.totalReviews || endorsements.length || 0;
  const statHighestScore = reputation?.highestScore || (endorsements.length > 0 ? Math.max(...endorsements.map(e => e.rating || 0)) : statAvgRating);
  const statWeightedScore = reputation?.weightedScore || (statAvgRating * statTotalReviews).toFixed(1);
  const renderStatValue = (val, isFloat) => {
    if (val === undefined || val === null || val === '—' || isNaN(val)) {
      return <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.2)' }}>N/A</span>;
    }
    return <AnimatedStat value={val} isFloat={isFloat} />;
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-12 relative text-white" style={{ overflowX: 'hidden', position: 'relative' }}>
      {/* Light leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', right: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '3vw', paddingRight: '3vw', paddingTop: '100px' }} className="relative z-10">
        <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes nameShimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .worker-name {
            background: linear-gradient(90deg, #fff 35%, #888 45%, #fff 55%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: nameShimmer 4s linear infinite;
          }
          @keyframes borderPulse {
            0%, 100% { border-color: rgba(255,255,255,0.1); }
            50%       { border-color: rgba(255,255,255,0.3); }
          }
          .bio-quote {
            animation: borderPulse 3s ease infinite;
          }
          .hover-glow {
            transition: box-shadow 0.3s ease;
          }
          .hover-glow:hover {
            box-shadow: inset 0 0 20px rgba(255,255,255,0.03);
          }
          @keyframes endorsePulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.2); }
            50%       { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
          }
          .endorse-btn {
            transition: all 0.25s ease;
            animation: endorsePulse 2.5s ease infinite;
          }
          .endorse-btn:hover {
            background-color: rgba(220,220,220,1) !important;
            transform: scale(1.02);
          }
          .share-btn {
            transition: all 0.25s ease;
          }
          .share-btn:hover {
            background-color: rgba(255,255,255,0.08) !important;
            border-color: rgba(255,255,255,0.4) !important;
          }
          .endorsement-card {
            transition: all 0.3s ease;
          }
          .endorsement-card:hover {
            border-color: rgba(255,255,255,0.15) !important;
            transform: translateX(4px);
          }
          .back-link-group {
            transition: color 0.2s ease;
          }
          .back-link-group:hover {
            color: rgba(255,255,255,0.8) !important;
          }
          .back-link-group:hover .back-arrow {
            transform: translateX(-4px);
          }
          .back-arrow {
            transition: transform 0.2s ease;
          }
        `}</style>
        {/* Breadcrumb */}
        <Link to="/discover" className="inline-flex items-center gap-2 font-bold mb-6 back-link-group" style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', marginBottom: '24px', textTransform: 'uppercase', animation: 'fadeSlideUp 0.4s ease forwards' }}>
          <ArrowLeft className="w-3.5 h-3.5 back-arrow" /> Back to Discover
        </Link>

        {/* Profile Header */}
        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', marginBottom: '40px' }} className="reveal">
          {/* Identity Card (Left Sidebar) */}
          <div className="border border-white/[0.07] rounded-[2px] p-6 bg-white/[0.02] md:sticky top-[100px]" style={{ minWidth: '260px', width: '260px', flexShrink: '0', opacity: 0, animation: 'fadeSlideUp 0.5s 0.1s ease forwards' }}>
            <div className="flex flex-col mb-4">
              <div className="flex items-center justify-center hover-glow" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '16px' }}>
                <User style={{ color: 'rgba(255,255,255,0.3)', width: '32px', height: '32px' }} />
              </div>
              <h2 className="font-clash worker-name" style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>{profile.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.45)', gap: '12px', marginBottom: '6px' }} className="font-inter">
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {profile.skill}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.city}</span>
              </div>
              {profile.experience > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.35)', gap: '4px', marginBottom: '6px' }} className="font-inter">
                  <Calendar className="w-3 h-3" /> {profile.experience} Yrs Exp
                </span>
              )}
            </div>
            {profile.bio && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', borderLeft: '2px solid rgba(255,255,255,0.15)', paddingLeft: '12px', marginTop: '12px', marginBottom: '20px' }} className="leading-relaxed font-inter bio-quote">"{profile.bio}"</p>}

            {/* Wallet */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 12px', borderRadius: '2px', marginBottom: '8px' }}>
              <p style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 'bold' }} className="font-inter">Wallet Address</p>
              <div className="flex items-center justify-between gap-2">
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', wordBreak: 'break-all' }} className="flex-1">{address}</span>
                <button onClick={copyAddr} style={{ color: 'rgba(255,255,255,0.3)' }} className="hover:text-white transition-colors shrink-0 flex items-center justify-center p-1">
                  {copiedAddr ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <a href={`https://stellar.expert/explorer/testnet/account/${address}`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }} className="hover:underline transition-all font-inter">
                <ExternalLink className="w-3 h-3" /> View on Stellar
              </a>
            </div>

            {/* Actions */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={shareProfile} style={{ padding: '10px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '12px', letterSpacing: '1.5px', width: '100%', cursor: 'pointer', borderRadius: '0' }} className="uppercase flex items-center justify-center gap-2 share-btn font-inter">
                {copiedShare ? <><Check className="w-4 h-4 text-green-400" /> Copied!</> : <><Share2 className="w-4 h-4" /> Share Profile</>}
              </button>
              <Link to={`/endorse?worker=${address}`} style={{ padding: '10px', backgroundColor: '#ffffff', color: '#000000', fontWeight: '700', fontSize: '12px', letterSpacing: '1.5px', border: 'none', width: '100%', cursor: 'pointer', borderRadius: '0' }} className="uppercase flex items-center justify-center gap-2 endorse-btn font-inter">
                <Award className="w-4 h-4" /> Endorse Worker
              </Link>
            </div>
          </div>

          {/* Right side: Reputation + Endorsements */}
          <div style={{ flex: '1', minWidth: '0' }}>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px', opacity: 0, animation: 'fadeSlideUp 0.5s 0.2s ease forwards' }}>
              <div style={{ backgroundColor: '#0a0a0a', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.08)', borderTop: '2px solid rgba(255,255,255,0.15)' }}>
                <div className="flex justify-center gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => (<Star key={s} style={{ width: '16px', height: '16px' }} className={`${s <= Math.round(statAvgRating) ? 'text-[#f5c518] fill-[#f5c518]' : 'text-white/10'}`} />))}
                </div>
                <p style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em' }} className="font-clash">{renderStatValue(statAvgRating, true)}</p>
                <p style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }} className="uppercase font-inter">Avg Rating</p>
              </div>
              <div style={{ backgroundColor: '#0a0a0a', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.08)', borderTop: '2px solid rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em' }} className="font-clash">{renderStatValue(statTotalReviews, false)}</p>
                <p style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }} className="uppercase font-inter">Total Reviews</p>
              </div>
              <div style={{ backgroundColor: '#0a0a0a', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.08)', borderTop: '2px solid rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em' }} className="font-clash">{renderStatValue(statHighestScore, false)}</p>
                <p style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }} className="uppercase font-inter">Highest Score</p>
              </div>
              <div style={{ backgroundColor: '#0a0a0a', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '2px solid rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em' }} className="font-clash">{renderStatValue(statWeightedScore, true)}</p>
                <p style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }} className="uppercase font-inter">Weighted Score</p>
              </div>
            </div>

            {/* Endorsements List */}
            <div style={{ opacity: 0, animation: 'fadeSlideUp 0.5s 0.3s ease forwards' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '3px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }} className="font-inter">Endorsements</h3>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }} className="font-inter">{endorsements.length} Total</span>
              </div>
              {endorsements.length === 0 ? (
                <div style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <Award className="w-8 h-8 text-white/10 mx-auto mb-3" />
                  <p className="text-white/20 text-xs font-inter">No endorsements yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {endorsements.map((e, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: '3px solid rgba(255,200,50,0.4)' }}
                      className="endorsement-card"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', letterSpacing: '2px', backgroundColor: 'rgba(255,200,50,0.08)', border: '1px solid rgba(255,200,50,0.2)', color: 'rgba(255,200,50,0.7)', padding: '2px 10px', textTransform: 'uppercase' }} className="font-inter">{e.jobType || 'FREELANCE PROJECT'}</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1,2,3,4,5].map(s => (<Star key={s} style={{ width: '12px', height: '12px', color: s <= e.rating ? '#f5c518' : 'rgba(255,255,255,0.1)', fill: s <= e.rating ? '#f5c518' : 'none', filter: s <= e.rating ? 'drop-shadow(0 0 4px rgba(245,197,24,0.5))' : 'none' }} />))}
                        </div>
                      </div>
                      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', marginBottom: '12px' }} className="font-inter">"{e.feedback}"</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
                        <span>{new Date(e.timestamp).toLocaleDateString()} • From: {e.endorser ? `${e.endorser.substring(0, 6)}...${e.endorser.substring(e.endorser.length - 4)}` : 'Unknown'}</span>
                        {e.txHash && (
                          <a href={`https://stellar.expert/explorer/testnet/tx/${e.txHash}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            Tx: {e.txHash.substring(0, 8)}...
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
