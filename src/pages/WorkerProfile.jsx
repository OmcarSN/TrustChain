import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { calculateScore } from '../lib/reputation';
import { useTranslation } from 'react-i18next';
import { getWorker, getEndorsements } from '../lib/supabaseData';
import ProfileSidebar from '../components/worker-profile/ProfileSidebar';
import ProfileStatsRow from '../components/worker-profile/ProfileStatsRow';
import EndorsementList from '../components/worker-profile/EndorsementList';

/**
 * WorkerProfile — Public worker reputation page.
 * Loads a worker's credential and endorsement data from Supabase,
 * computes reputation scores, and delegates rendering to sub-components:
 * - ProfileSidebar: avatar, name, skill, wallet, share/copy actions
 * - ProfileStatsRow: avg rating, total reviews, highest, weighted score
 * - EndorsementList: scrollable list of endorsement cards
 *
 * @returns {React.ReactElement} The WorkerProfile page.
 */
const WorkerProfile = () => {
  const { address } = useParams();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [endorsements, setEndorsements] = useState([]);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const loadProfile = useCallback(async () => {
    const data = await getWorker(address);
    const endorse = await getEndorsements(address);
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

   
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);


  const copyAddr = () => { navigator.clipboard.writeText(address); setCopiedAddr(true); setTimeout(() => setCopiedAddr(false), 2000); };
  const shareProfile = () => { navigator.clipboard.writeText(window.location.href); setCopiedShare(true); setTimeout(() => setCopiedShare(false), 2000); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060A] relative overflow-hidden text-white" role="status" aria-label={t('profile.loading', 'Loading profile')} style={{ paddingTop: '100px', paddingBottom: '80px', paddingLeft: '48px', paddingRight: '48px' }}>
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
      <div className="min-h-screen bg-[#05060A] flex items-center justify-center relative text-white" role="alert" aria-label={t('profile.notFound')} style={{ paddingTop: '100px', paddingBottom: '80px', paddingLeft: '48px', paddingRight: '48px', overflow: 'clip' }}>
        {/* Background Graphics (Grid & Orbs) */}
        <div className="tc-bg-grid fixed" />
        <div className="tc-orb-blue fixed" />
        <div className="tc-orb-green fixed" />
        
        <div className="tc-leak-orange fixed" style={{ left: '-80px' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
            <div className="tc-activity-icon tc-flex-center" style={{ width: '56px', height: '56px', margin: '0 auto 24px' }}>
              <User className="tc-icon-dim" style={{ width: '24px', height: '24px' }} aria-hidden="true" />
          </div>
            <h2 className="font-clash tc-fw-black" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t('profile.notFound')}</h2>
            <p className="font-inter tc-text-base tc-text-dim" style={{ marginBottom: '24px' }}>{t('profile.notFoundDesc')}</p>
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

  return (
    <div className="bg-[#05060A] text-white" style={{ overflow: 'clip', position: 'relative', minHeight: '100vh' }}>
      {/* Background Graphics (Grid & Orbs) */}
      <div className="tc-bg-grid fixed" />
      <div className="tc-orb-blue fixed" />
      <div className="tc-orb-green fixed" />
      
      {/* Light leaks */}
      <div className="tc-leak-orange fixed" style={{ right: '-80px', left: 'auto' }} />
      <div className="rounded-full pointer-events-none" style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(61,86,201,0.05) 0%, transparent 70%)', willChange: 'transform', zIndex: 0 }} />

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
      <div className="tc-profile-shell" style={{ paddingTop: '100px', paddingBottom: '80px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '0', minHeight: '100vh', position: 'relative', zIndex: 10 }}>

        {/* ═══ LEFT SIDEBAR ═══ */}
        <ProfileSidebar
          profile={profile}
          address={address}
          endorsements={endorsements}
          copiedAddr={copiedAddr}
          copiedShare={copiedShare}
          copyAddr={copyAddr}
          shareProfile={shareProfile}
          t={t}
        />

        {/* ═══ RIGHT MAIN AREA ═══ */}
        <div className="glass-card tc-profile-main" style={{ flex: 1, padding: '40px', borderLeft: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px' }} role="main" aria-label={t('profile.mainContent', 'Worker reputation and reviews')}>

          {/* Eyebrow + Title */}
          <div className="prof-anim" style={{ marginBottom: '28px', animationDelay: '0.05s' }}>
            <p className="font-inter tc-eyebrow tc-mb-xs">{t('profile.badgePublic')}</p>
            <h1 className="font-clash tc-fw-black tc-text-white" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}><span className="text-gradient">{t('profile.reviewsHeader')}</span></h1>
          </div>

          {/* Stats Row */}
          <ProfileStatsRow
            statAvgRating={statAvgRating}
            statTotalReviews={statTotalReviews}
            statHighestScore={statHighestScore}
            statWeightedScore={statWeightedScore}
            t={t}
          />

          {/* Endorsements Section */}
          <EndorsementList endorsements={endorsements} t={t} />
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
