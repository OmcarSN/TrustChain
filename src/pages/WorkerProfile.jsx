import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Briefcase, MapPin, Star, Calendar, Award,
  ArrowLeft, Copy, Check, ExternalLink, Share2,
  ShieldCheck, Clock, Hash, ArrowRight
} from 'lucide-react';
import { calculateScore } from '../lib/reputation';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white" style={{ paddingTop: '100px', paddingBottom: '80px', paddingLeft: '48px', paddingRight: '48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden text-white" style={{ paddingTop: '100px', paddingBottom: '80px', paddingLeft: '48px', paddingRight: '48px' }}>
        <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', left: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div style={{ width: '56px', height: '56px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <User style={{ color: 'rgba(255,255,255,0.2)', width: '24px', height: '24px' }} />
          </div>
          <h2 className="font-clash" style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '8px' }}>{t('profile.notFound')}</h2>
          <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '24px' }}>{t('profile.notFoundDesc')}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/verify" style={{ flex: 1, padding: '12px', backgroundColor: '#ffffff', color: '#000000', fontWeight: '800', fontSize: '10px', letterSpacing: '2px', textAlign: 'center', textTransform: 'uppercase', textDecoration: 'none' }}>{t('verify.btnVerify')}</Link>
            <Link to="/" style={{ flex: 1, padding: '12px', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontWeight: '700', fontSize: '10px', letterSpacing: '2px', textAlign: 'center', textTransform: 'uppercase', textDecoration: 'none' }}>{t('notFound.returnHome')}</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const statAvgRating = reputation?.average || 0;
  const statTotalReviews = reputation?.total || endorsements.length || 0;
  const statHighestScore = reputation?.highestScore || (endorsements.length > 0 ? Math.max(...endorsements.map(e => e.rating || 0)) : statAvgRating);
  const statWeightedScore = reputation?.weightedScore || (Number(statAvgRating) * statTotalReviews).toFixed(1);
  const renderStatValue = (val, isFloat) => {
    if (val === undefined || val === null || val === '—' || isNaN(val)) {
      return <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.2)' }}>N/A</span>;
    }
    return <AnimatedStat value={val} isFloat={isFloat} />;
  };

  return (
    <div className="bg-[#050505] text-white" style={{ overflowX: 'hidden', position: 'relative', minHeight: '100vh' }}>
      {/* Light leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', right: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <style>{`
        @keyframes profFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prof-anim { opacity: 0; animation: profFadeUp 0.4s ease forwards; }
        .prof-endorse-btn { transition: all 0.2s ease; }
        .prof-endorse-btn:hover { background-color: #e8e8e8 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,255,255,0.1); }
        .prof-share-btn { transition: all 0.2s ease; }
        .prof-share-btn:hover { background-color: rgba(255,255,255,0.04) !important; }
        .prof-card:hover { border-color: rgba(255,255,255,0.15) !important; transform: translateX(3px); }
        .prof-card { transition: all 0.3s ease; }
        .prof-stat:hover { background-color: rgba(255,255,255,0.02) !important; }
        .prof-stat { transition: background-color 0.2s ease; }
        .prof-copy:hover { color: #ffffff !important; }
        .prof-copy { transition: color 0.2s ease; }
        .prof-stellar:hover { color: #ffffff !important; }
        .prof-stellar { transition: color 0.2s ease; }
        @keyframes bioPulse {
          0%, 100% { border-color: rgba(255,255,255,0.1); }
          50%       { border-color: rgba(255,255,255,0.25); }
        }
      `}</style>

      {/* Page Wrapper */}
      <div style={{ paddingTop: '100px', paddingBottom: '80px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '0', minHeight: '100vh', position: 'relative', zIndex: 10 }}>

        {/* ═══ LEFT SIDEBAR (320px) ═══ */}
        <div className="prof-anim" style={{ width: '320px', flexShrink: 0, paddingRight: '40px', animationDelay: '0s' }}>

          {/* Avatar */}
          <div style={{ width: '80px', height: '80px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <User style={{ color: 'rgba(255,255,255,0.2)', width: '32px', height: '32px' }} />
          </div>

          {/* Verified badge */}
          {endorsements.length > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '9px', letterSpacing: '3px', color: '#00dc6e', backgroundColor: 'rgba(0,220,110,0.08)', border: '1px solid rgba(0,220,110,0.25)', padding: '4px 12px', marginBottom: '16px', fontWeight: '700', textTransform: 'uppercase' }} className="font-inter">
              <ShieldCheck style={{ width: '10px', height: '10px' }} /> {t('profile.badgeVerified')}
            </div>
          )}

          {/* Worker Name */}
          <h2 className="font-clash" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '900', color: '#ffffff', marginBottom: '14px', textTransform: 'capitalize' }}>{profile.name}</h2>

          {/* Meta: Skill + City */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
              <span className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{profile.skill}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
              <span className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{profile.city}</span>
            </div>
          </div>

          {/* Experience */}
          {profile.experience > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }} className="font-inter">
              <Calendar style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
              {profile.experience} {t('profile.yrs')}
            </div>
          )}

          {/* Bio Quote */}
          {profile.bio && (
            <p className="font-inter" style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '14px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '24px', animation: 'bioPulse 3s ease infinite' }}>
              "{profile.bio}"
            </p>
          )}

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

          {/* Wallet Address block */}
          <div style={{ marginBottom: '10px' }}>
            <p className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700' }}>{t('profile.stellarAddress')}</p>
            <div style={{ padding: '12px 14px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all', lineHeight: '1.5', flex: 1 }}>{address}</span>
              <button onClick={copyAddr} className="prof-copy" style={{ color: 'rgba(255,255,255,0.2)', cursor: 'pointer', background: 'none', border: 'none', padding: '4px', flexShrink: 0, marginLeft: '8px' }}>
                {copiedAddr ? <Check style={{ width: '12px', height: '12px', color: '#00dc6e' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
              </button>
            </div>
          </div>

          {/* View on Stellar */}
          <a href={`https://stellar.expert/explorer/testnet/account/${address}`} target="_blank" rel="noopener noreferrer" className="prof-stellar font-inter" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', marginBottom: '28px', textTransform: 'uppercase' }}>
            <ExternalLink style={{ width: '11px', height: '11px' }} /> View on Stellar
          </a>

          {/* Share Profile Button */}
          <button onClick={shareProfile} className="prof-share-btn font-inter" style={{ width: '100%', padding: '13px 20px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent', color: '#ffffff', fontSize: '11px', letterSpacing: '3px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px', textTransform: 'uppercase' }}>
            {copiedShare ? <><Check style={{ width: '14px', height: '14px', color: '#00dc6e' }} /> {t('profile.copied')}</> : <><Share2 style={{ width: '14px', height: '14px' }} /> {t('profile.shareProfile')}</>}
          </button>

          {/* Endorse Worker Button */}
          <Link to={`/endorse?worker=${address}`} className="prof-endorse-btn font-inter" style={{ width: '100%', padding: '15px 20px', backgroundColor: '#ffffff', color: '#000000', border: 'none', fontSize: '11px', letterSpacing: '3px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', textDecoration: 'none', textTransform: 'uppercase' }}>
            <Award style={{ width: '14px', height: '14px' }} /> {t('profile.endorseBtn')}
          </Link>
        </div>

        {/* ═══ RIGHT MAIN AREA ═══ */}
        <div style={{ flex: 1, paddingLeft: '40px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Eyebrow + Title */}
          <div className="prof-anim" style={{ marginBottom: '28px', animationDelay: '0.05s' }}>
            <p className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>{t('profile.badgePublic')}</p>
            <h1 className="font-clash" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '900', color: '#ffffff' }}>{t('profile.reviewsHeader')}</h1>
          </div>

          {/* Stats Row */}
          <div className="prof-anim" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', marginBottom: '40px', animationDelay: '0.1s' }}>
            {[
              { value: statAvgRating, label: t('profile.statRating'), isFloat: true, showStars: true },
              { value: statTotalReviews, label: t('profile.statJobs'), isFloat: false },
              { value: statHighestScore, label: t('profile.statPoints').replace('Trust Points','Highest Score'), isFloat: false },
              { value: statWeightedScore, label: 'Weighted Score', isFloat: true },
            ].map((stat, i, arr) => (
              <div key={i} className="prof-stat" style={{ padding: '20px 24px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ height: '14px', marginBottom: '8px', display: 'flex', justifyContent: 'center', gap: '2px' }}>
                  {stat.showStars && [1,2,3,4,5].map(s => (
                    <Star key={s} style={{ width: '14px', height: '14px', color: s <= Math.round(statAvgRating) ? '#f5a623' : 'rgba(255,255,255,0.1)', fill: s <= Math.round(statAvgRating) ? '#f5a623' : 'transparent' }} />
                  ))}
                </div>
                <p className="font-clash" style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', lineHeight: '1', margin: '0 0 8px 0' }}>{renderStatValue(stat.value, stat.isFloat)}</p>
                <p className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Endorsements Section */}
          <div className="prof-anim" style={{ animationDelay: '0.15s' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase' }}>{t('profile.reviewsHeader')}</span>
              <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>{endorsements.length} {t('analytics.total')}</span>
            </div>

            {endorsements.length === 0 ? (
              <div style={{ padding: '40px 24px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                <Award style={{ width: '32px', height: '32px', color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px' }} />
                <p className="font-inter" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>{t('profile.beFirstEndorse')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {endorsements.map((e, idx) => (
                  <div
                    key={idx}
                    className="prof-card prof-anim"
                    style={{
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderLeft: '2px solid rgba(255,255,255,0.15)',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      padding: '20px 24px',
                      animationDelay: `${0.2 + idx * 0.08}s`,
                    }}
                  >
                    {/* Top row: job type + stars */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.03)', textTransform: 'uppercase' }}>
                        {e.jobType || 'Freelance Project'}
                      </span>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} style={{ width: '14px', height: '14px', color: s <= e.rating ? '#f5a623' : 'rgba(255,255,255,0.1)', fill: s <= e.rating ? '#f5a623' : 'transparent' }} />
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="font-inter" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '14px' }}>
                      "{e.feedback}"
                    </p>

                    {/* Meta row */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock style={{ width: '10px', height: '10px', color: 'rgba(255,255,255,0.15)' }} />
                        {new Date(e.timestamp).toLocaleDateString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <User style={{ width: '10px', height: '10px', color: 'rgba(255,255,255,0.15)' }} />
                        {t('profile.endorserLabel')}: {e.endorser ? `${e.endorser.substring(0, 6)}...${e.endorser.substring(e.endorser.length - 4)}` : 'Unknown'}
                      </span>
                      {e.txHash && (
                        <a href={`https://stellar.expert/explorer/testnet/tx/${e.txHash}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }} className="prof-stellar">
                          <Hash style={{ width: '10px', height: '10px', color: 'rgba(255,255,255,0.15)' }} />
                          {t('profile.viewTx')}: {e.txHash.substring(0, 8)}...
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
