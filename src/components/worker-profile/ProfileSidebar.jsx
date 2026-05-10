import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  User, Briefcase, MapPin, Calendar, Award,
  Copy, Check, ExternalLink, Share2, ShieldCheck
} from 'lucide-react';

/**
 * ProfileSidebar — Left sidebar on the WorkerProfile page.
 * Displays the worker avatar, verified badge (if endorsed), name,
 * endorse CTA, wallet address with copy button, Stellar Explorer link,
 * skill/city metadata, experience, bio quote, and a share button.
 *
 * @param {Object} props
 * @param {Object} props.profile - Worker profile data (name, skill, city, experience, bio).
 * @param {string} props.address - Stellar wallet address.
 * @param {Array} props.endorsements - Array of endorsement objects.
 * @param {boolean} props.copiedAddr - Whether the address was recently copied.
 * @param {boolean} props.copiedShare - Whether the share link was recently copied.
 * @param {Function} props.copyAddr - Callback to copy wallet address.
 * @param {Function} props.shareProfile - Callback to share profile link.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The ProfileSidebar component.
 */
const ProfileSidebar = ({
  profile, address, endorsements,
  copiedAddr, copiedShare, copyAddr, shareProfile, t
}) => (
  <div
    className="prof-anim tc-sidebar-width tc-sticky-side"
    role="complementary"
    aria-label={t('profile.sidebarLabel', 'Worker profile details')}
    style={{ animationDelay: '0s' }}
  >
    {/* Avatar */}
    <div className="tc-avatar">
      <User className="tc-avatar-icon" aria-hidden="true" />
    </div>

    {/* Verified badge */}
    {endorsements.length > 0 && (
      <div className="tc-verified-badge font-inter">
        <ShieldCheck className="tc-icon-sm" aria-hidden="true" /> {t('profile.badgeVerified')}
      </div>
    )}

    {/* Worker Name */}
    <h2 className="font-clash tc-heading-xl tc-mb-md">{profile.name}</h2>

    {/* Primary Action: Endorse */}
    <Link to={`/endorse?worker=${address}`} className="prof-endorse-btn font-inter tc-btn-primary tc-mb-lg" aria-label={t('profile.endorseBtnLabel', `Endorse ${profile.name}`)}>
      <Award className="tc-icon-md" aria-hidden="true" /> {t('profile.endorseBtn')}
    </Link>

    {/* Wallet Address block */}
    <div className="tc-mb-xs">
      <p className="font-inter tc-label tc-mb-xs">{t('profile.stellarAddress')}</p>
      <div className="tc-addr-block">
        <span className="tc-addr-text">{address}</span>
        <button onClick={copyAddr} className="prof-copy tc-copy-btn" aria-label={t('profile.copyAddress', 'Copy wallet address')}>
          {copiedAddr ? <Check className="tc-icon-sm" style={{ color: '#00dc6e' }} aria-hidden="true" /> : <Copy className="tc-icon-sm" aria-hidden="true" />}
        </button>
      </div>
    </div>

    {/* View on Stellar */}
    <a href={`https://stellar.expert/explorer/testnet/account/${address}`} target="_blank" rel="noopener noreferrer" className="prof-stellar font-inter tc-stellar-link tc-mb-lg" aria-label={t('profile.viewStellar', 'View account on Stellar Explorer')}>
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
      {copiedShare ? <><Check className="tc-icon-md" style={{ color: '#00dc6e' }} aria-hidden="true" /> {t('profile.copied')}</> : <><Share2 className="tc-icon-md" aria-hidden="true" /> {t('profile.shareProfile')}</>}
    </button>
  </div>
);

ProfileSidebar.propTypes = {
  /** Worker profile data object. */
  profile: PropTypes.shape({
    name: PropTypes.string,
    skill: PropTypes.string,
    city: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bio: PropTypes.string,
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
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default ProfileSidebar;
