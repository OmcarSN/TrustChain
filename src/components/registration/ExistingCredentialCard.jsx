import React from 'react';
import PropTypes from 'prop-types';
import { PenLine, Copy, Check } from 'lucide-react';

/**
 * ExistingCredentialCard — Full-page credential display shown when a worker
 * already has a minted on-chain credential. Renders the worker's credential
 * fields (name, skill, experience, city, bio), wallet address with copy button,
 * and an "Update Credential" action button.
 *
 * Used by WorkerRegistration when `existingCredential` is detected.
 *
 * @param {Object} props
 * @param {Object} props.existingCredential - The worker's credential data from localStorage/chain.
 * @param {string} [props.existingCredential.name] - Worker's name (fallback: fullName).
 * @param {string} [props.existingCredential.skill] - Skill category (fallback: skillCategory).
 * @param {string|number} [props.existingCredential.experience] - Years of experience.
 * @param {string} [props.existingCredential.city] - City of residence.
 * @param {string} [props.existingCredential.bio] - Short bio text.
 * @param {string} props.walletAddress - Stellar public key of the worker.
 * @param {boolean} props.copiedAddr - Whether the wallet address was recently copied.
 * @param {Function} props.copyAddr - Handler to copy wallet address to clipboard.
 * @param {Function} props.trunc - Utility to truncate the wallet address for display.
 * @param {Function} props.onUpdate - Handler to switch to the update credential form.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The ExistingCredentialCard component.
 */
const ExistingCredentialCard = ({ existingCredential, walletAddress, copiedAddr, copyAddr, trunc, onUpdate, t }) => {
  const fields = [
    { label: t('registration.nameLabel'), value: existingCredential.name || existingCredential.fullName },
    { label: t('registration.skillLabel'), value: existingCredential.skill || existingCredential.skillCategory },
    { label: t('registration.experienceLabel'), value: `${existingCredential.experience} ${t('registration.yearsLabel')}` },
    { label: t('registration.cityLabel'), value: existingCredential.city },
  ];

  return (
    <div className="relative overflow-hidden text-white min-h-screen">
      <style>{`
        @keyframes wpFadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wp-anim { opacity: 0; animation: wpFadeSlideUp 0.4s ease forwards; }
        .wp-update-btn { transition: all 0.2s ease; border-top: 1px solid rgba(255,255,255,0.08); }
        .wp-update-btn:hover { background-color: rgba(255,255,255,0.04) !important; color: #00dc6e !important; border-top-color: rgba(0,220,110,0.2); }
        .wp-copy-btn { transition: color 0.2s ease; }
        .wp-copy-btn:hover { color: #ffffff !important; }
      `}</style>

      <div className="min-h-screen px-4 md:px-12 lg:px-24 w-full flex flex-col items-center" role="main" aria-label={t('registration.credentialCardLabel', 'Your existing credential')} style={{ paddingTop: '100px', paddingBottom: '60px', position: 'relative', zIndex: 10 }}>
        {/* Page Header */}
        <div style={{ width: '100%', maxWidth: '1100px', textAlign: 'center' }} className="tc-mb-xl">
          <p className="wp-anim font-inter tc-eyebrow tc-mb-sm" style={{ textAlign: 'center', animationDelay: '0s' }}>
            {t('nav.workerPortal')}
          </p>
          <h1 className="wp-anim font-clash tc-heading-hero tc-mb-xs" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', textAlign: 'center', animationDelay: '0.08s', letterSpacing: '-0.02em' }}>
            {t('dashboard.myCredential')}
          </h1>
          <p className="wp-anim font-inter tc-text-dim tc-text-base" style={{ textAlign: 'center', animationDelay: '0.14s' }}>
            {t('registration.headerSubtitle')}
          </p>
        </div>

        {/* Credential Card */}
        <div className="wp-anim tc-panel" role="region" aria-label={t('registration.credentialDetails', 'Credential details')} style={{ width: '100%', maxWidth: '1100px', borderTop: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.4)', overflow: 'hidden', borderRadius: '2px', animationDelay: '0.22s', animationDuration: '0.5s' }}>
          {/* Card Header Bar */}
          <div className="tc-feed-header tc-flex-between">
            <span className="font-inter tc-label tc-ls-wider">
              {t('dashboard.myCredential')}
            </span>
            <span className="tc-verified-badge tc-text-xs tc-ls-wide" style={{ padding: '4px 12px' }}>
              ● {t('discover.badgeOnChain')}
            </span>
          </div>

          {/* Card Body — Fields Grid */}
          <div className="tc-grid-2" style={{ padding: '20px 24px', gap: '0' }}>
            {fields.map((f, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div key={idx} className="wp-anim" style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingRight: isLeft ? '24px' : '0', paddingLeft: isLeft ? '0' : '24px', borderRight: isLeft ? '1px solid rgba(255,255,255,0.05)' : 'none', animationDelay: `${0.28 + idx * 0.05}s` }}>
                  <span className="font-inter tc-label tc-mb-xs" style={{ display: 'block' }}>{f.label}</span>
                  <span className="font-clash tc-text-white tc-text-lg tc-fw-bold" style={{ wordSpacing: '0.15em', letterSpacing: '0.02em' }}>{f.value}</span>
                </div>
              );
            })}

            {/* Bio */}
            {existingCredential.bio && (
              <div className="wp-anim tc-full-span" style={{ padding: '14px 0', animationDelay: '0.48s' }}>
                <span className="font-inter tc-label tc-mb-xs" style={{ display: 'block' }}>{t('registration.bioLabelShort')}</span>
                <div className="tc-bio-quote" style={{ marginTop: '8px' }}>
                  <p className="font-inter tc-text-dim tc-text-base tc-text-italic" style={{ lineHeight: '1.6' }}>"{existingCredential.bio}"</p>
                </div>
              </div>
            )}

            {/* Wallet Address Row */}
            <div className="wp-anim tc-full-span" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 0', animationDelay: '0.52s' }}>
              <span className="font-inter tc-label tc-mb-xs" style={{ display: 'block' }}>WALLET ADDRESS</span>
              <div className="tc-flex-between">
                <span className="tc-mono tc-text-base">{trunc(walletAddress)}</span>
                <button onClick={copyAddr} className="wp-copy-btn tc-copy-btn" aria-label={t('registration.copyAddr', 'Copy wallet address')}>
                  {copiedAddr ? <Check className="w-3.5 h-3.5 text-green-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <button onClick={onUpdate} className="wp-update-btn font-inter tc-btn-primary" aria-label={t('registration.updateBtnLabel', 'Update your credential')} style={{ backgroundColor: 'transparent', color: '#ffffff', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <PenLine className="tc-icon-md tc-icon-accent" aria-hidden="true" /> {t('registration.updateCredential')}
          </button>
        </div>
      </div>
    </div>
  );
};

ExistingCredentialCard.propTypes = {
  /** Worker credential data from localStorage or chain. */
  existingCredential: PropTypes.shape({
    /** Worker's display name. */
    name: PropTypes.string,
    /** Fallback name field. */
    fullName: PropTypes.string,
    /** Primary skill category. */
    skill: PropTypes.string,
    /** Fallback skill field. */
    skillCategory: PropTypes.string,
    /** Years of experience. */
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** City of residence. */
    city: PropTypes.string,
    /** Short bio text. */
    bio: PropTypes.string,
  }).isRequired,
  /** Stellar public key of the worker. */
  walletAddress: PropTypes.string.isRequired,
  /** Whether the wallet address was recently copied to clipboard. */
  copiedAddr: PropTypes.bool.isRequired,
  /** Handler to copy wallet address to clipboard. */
  copyAddr: PropTypes.func.isRequired,
  /** Utility function to truncate a Stellar address for display. */
  trunc: PropTypes.func.isRequired,
  /** Handler to switch to the update credential form. */
  onUpdate: PropTypes.func.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default ExistingCredentialCard;
