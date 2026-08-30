import React, { useState, useEffect } from 'react';
import { explorerAccountUrl } from '../../lib/networkConfig';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  User, Briefcase, MapPin, Calendar, Award,
  Copy, Check, ExternalLink, Share2, ShieldCheck, Phone
} from 'lucide-react';
import { getWorkerStatus, updateWorkerStatus } from '../../lib/credentialContract';

/**
 * ProfileSidebar — Left sidebar on the WorkerProfile page.
 * Displays the worker avatar, verified badge (if endorsed), name,
 * endorse CTA, contact button (phone visible to logged-in users),
 * wallet address with copy button, Stellar Explorer link,
 * skill/city metadata, experience, bio quote, and a share button.
 *
 * @param {Object} props
 * @param {Object} props.profile - Worker profile data (name, skill, city, experience, bio, phone).
 * @param {string} props.address - Stellar wallet address.
 * @param {Array} props.endorsements - Array of endorsement objects.
 * @param {boolean} props.copiedAddr - Whether the address was recently copied.
 * @param {boolean} props.copiedShare - Whether the share link was recently copied.
 * @param {Function} props.copyAddr - Callback to copy wallet address.
 * @param {Function} props.shareProfile - Callback to share profile link.
 * @param {boolean} props.isConnected - Whether the viewer has a connected wallet.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The ProfileSidebar component.
 */
const ProfileSidebar = ({
  profile, address, endorsements,
  copiedAddr, copiedShare, copyAddr, shareProfile, isConnected, viewerAddress, t
}) => {
  const [showPhone, setShowPhone] = useState(false);

  // Read initial status from localStorage (instant, no network call)
  const storageKey = `tc_status_${address}`;
  const [currentStatus, setCurrentStatus] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved !== null ? Number(saved) : 0;
    } catch { return 0; }
  });
  const [statusLoading, setStatusLoading] = useState(false);

  // On mount, try reading from contract (background, non-blocking)
  useEffect(() => {
    let mounted = true;
    getWorkerStatus(address)
      .then(({ status }) => {
        if (mounted) {
          setCurrentStatus(status);
          try { localStorage.setItem(storageKey, String(status)); } catch {}
        }
      })
      .catch(() => {}); // silently fallback to localStorage value
    return () => { mounted = false; };
  }, [address, storageKey]);

  const handleStatusChange = (newStatus) => {
    if (newStatus === currentStatus || statusLoading) return;
    // Optimistic update — instant UI change
    setCurrentStatus(newStatus);
    try { localStorage.setItem(storageKey, String(newStatus)); } catch {}

    // Fire-and-forget Soroban call in background
    setStatusLoading(true);
    updateWorkerStatus(address, newStatus)
      .catch((err) => console.error('[CredentialContract] Status update (background):', err))
      .finally(() => setStatusLoading(false));
  };


  const hasPhone = profile.phone && profile.phone.length > 0;
  const whatsappLink = hasPhone ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}` : null;

  return (
  <div
    className="prof-anim tc-sidebar-width tc-sticky-side glass-card"
    role="complementary"
    aria-label={t('profile.sidebarLabel', 'Worker profile details')}
    style={{ animationDelay: '0s', borderRadius: '16px', padding: '28px 24px' }}
  >
    {/* Avatar */}
    <div className="tc-avatar">
      <User className="tc-avatar-icon" aria-hidden="true" />
    </div>

    {/* Verified badge */}
    {endorsements.length > 0 && (
      <div className="tc-verified-badge font-inter" style={{ boxShadow: '0 0 16px rgba(22,163,74,0.2)' }}>
        <ShieldCheck className="tc-icon-sm" aria-hidden="true" /> {t('profile.badgeVerified')}
      </div>
    )}

    {/* Worker Availability Status */}
    {viewerAddress && viewerAddress === address ? (
      /* ── Worker's own profile: Toggle switch ── */
      <div className="tc-mb-md">
        <button
          onClick={() => handleStatusChange(currentStatus === 0 ? 2 : 0)}
          disabled={statusLoading}
          className="font-inter"
          style={{
            width: '100%',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            cursor: statusLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: statusLoading ? 0.6 : 1,
          }}
        >
          <span style={{
            fontSize: '11px', fontWeight: '600', letterSpacing: '1.2px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {statusLoading ? 'Updating...' : currentStatus === 0 ? 'Available' : 'Unavailable'}
          </span>
          {/* Toggle track */}
          <div style={{
            width: '36px', height: '20px', borderRadius: '10px',
            background: currentStatus === 0 ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.1)',
            position: 'relative', transition: 'background 0.3s ease',
            flexShrink: 0,
          }}>
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%',
              background: currentStatus === 0 ? '#22c55e' : 'rgba(255,255,255,0.3)',
              position: 'absolute', top: '2px',
              left: currentStatus === 0 ? '18px' : '2px',
              transition: 'all 0.3s ease',
            }} />
          </div>
        </button>
      </div>
    ) : (
      /* ── Visitor view: No status shown ── */
      null
    )}

    {/* Worker Name */}
    <h2 className="font-clash tc-heading-xl tc-mb-md">{profile.name}</h2>

    {/* Primary Action: Endorse */}
    <Link to={`/endorse?worker=${address}`} className="prof-endorse-btn font-inter btn-glow tc-mb-lg" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} aria-label={t('profile.endorseBtnLabel', `Endorse ${profile.name}`)}>
      <Award className="tc-icon-md" aria-hidden="true" /> {t('profile.endorseBtn')}
    </Link>

    {/* Contact Worker Button */}
    {isConnected ? (
      hasPhone ? (
        <div className="tc-mb-lg">
          {!showPhone ? (
            <button
              onClick={() => setShowPhone(true)}
              className="font-inter"
              style={{
                width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px', background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', color: '#22c55e',
                fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(34,197,94,0.2)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'rgba(34,197,94,0.1)'; }}
            >
              <Phone style={{ width: '14px', height: '14px' }} /> Contact Worker
            </button>
          ) : (
            <div style={{
              background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '8px', padding: '12px 16px',
            }}>
              <p className="font-inter" style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                Phone Number
              </p>
              <p className="font-inter" style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', marginBottom: '10px', letterSpacing: '0.5px' }}>
                {profile.phone}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`tel:${profile.phone}`} className="font-inter" style={{
                  flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px', color: '#ffffff', fontSize: '10px', fontWeight: '700', letterSpacing: '1px',
                  textTransform: 'uppercase', textAlign: 'center', textDecoration: 'none', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '4px',
                }}>
                  <Phone style={{ width: '12px', height: '12px' }} /> Call
                </a>
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="font-inter" style={{
                    flex: 1, padding: '8px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)',
                    borderRadius: '6px', color: '#25d366', fontSize: '10px', fontWeight: '700', letterSpacing: '1px',
                    textTransform: 'uppercase', textAlign: 'center', textDecoration: 'none',
                  }}>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null
    ) : (
      <div className="tc-mb-lg">
        <div className="font-inter" style={{
          width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'rgba(255,255,255,0.35)',
          fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          <Phone style={{ width: '14px', height: '14px' }} /> Connect Wallet to Contact
        </div>
      </div>
    )}

    {/* Wallet Address block */}
    <div className="tc-mb-xs">
      <p className="font-inter tc-label tc-mb-xs">{t('profile.stellarAddress')}</p>
      <div className="tc-addr-block">
        <span className="tc-addr-text">{address}</span>
        <button onClick={copyAddr} className="prof-copy tc-copy-btn" aria-label={t('profile.copyAddress', 'Copy wallet address')}>
          {copiedAddr ? <Check className="tc-icon-sm" style={{ color: '#4F6BED' }} aria-hidden="true" /> : <Copy className="tc-icon-sm" aria-hidden="true" />}
        </button>
      </div>
    </div>

    {/* View on Stellar */}
    <a href={explorerAccountUrl(address)} target="_blank" rel="noopener noreferrer" className="prof-stellar font-inter tc-stellar-link tc-mb-lg" aria-label={t('profile.viewStellar', 'View account on Stellar Explorer')}>
      <ExternalLink className="tc-icon-sm" aria-hidden="true" /> View on Stellar
    </a>

    {/* Divider */}
    <div className="tc-divider tc-mb-lg" role="separator" />

    {/* Meta: Skill + City */}
    <div className="tc-flex-col tc-flex-gap-sm tc-mb-md">
      <div className="tc-meta-row">
        <Briefcase className="tc-meta-icon" aria-hidden="true" />
        <span className="font-inter tc-meta-text">{profile.skill}</span>
      </div>
      <div className="tc-meta-row">
        <MapPin className="tc-meta-icon" aria-hidden="true" />
        <span className="font-inter tc-meta-text">{profile.city}</span>
      </div>
    </div>

    {/* Experience */}
    {profile.experience > 0 && (
      <div className="font-inter tc-meta-row tc-mb-md tc-text-dim" style={{ fontSize: '13px' }}>
        <Calendar className="tc-meta-icon" aria-hidden="true" />
        {profile.experience} {t('profile.yrs')}
      </div>
    )}

    {/* Bio Quote */}
    {profile.bio && (
      <p className="font-inter tc-bio-quote tc-mb-lg" style={{ animation: 'bioPulse 3s ease infinite' }}>
        "{profile.bio}"
      </p>
    )}

    {/* Share Profile Button */}
    <button onClick={shareProfile} className="prof-share-btn font-inter tc-btn-outline" aria-label={t('profile.shareBtnLabel', 'Share this profile')}>
      {copiedShare ? <><Check className="tc-icon-md" style={{ color: '#4F6BED' }} aria-hidden="true" /> {t('profile.copied')}</> : <><Share2 className="tc-icon-md" aria-hidden="true" /> {t('profile.shareProfile')}</>}
    </button>
  </div>
  );
};

ProfileSidebar.propTypes = {
  /** Worker profile data object. */
  profile: PropTypes.shape({
    name: PropTypes.string,
    skill: PropTypes.string,
    city: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bio: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  /** Stellar wallet address of the worker. */
  address: PropTypes.string.isRequired,
  /** Array of endorsement objects for the worker. */
  endorsements: PropTypes.array.isRequired,
  /** Whether the wallet address was recently copied. */
  copiedAddr: PropTypes.bool.isRequired,
  /** Whether the share link was recently copied. */
  copiedShare: PropTypes.bool.isRequired,
  /** Callback to copy the wallet address to clipboard. */
  copyAddr: PropTypes.func.isRequired,
  /** Callback to share the profile link. */
  shareProfile: PropTypes.func.isRequired,
  /** Whether the viewer has a connected wallet. */
  isConnected: PropTypes.bool,
  /** The stellar address of the person viewing this profile. */
  viewerAddress: PropTypes.string,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default ProfileSidebar;
