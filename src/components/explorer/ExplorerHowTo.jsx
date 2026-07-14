import React from 'react';
import PropTypes from 'prop-types';
import { UserCheck, FileSearch, ShieldCheck } from 'lucide-react';

/**
 * ExplorerHowTo — Pre-search instructional section on the Explorer page.
 * Renders a 3-step card grid explaining the credential verification process
 * (Get Worker ID → Search → Verify) and a security assurance banner with
 * pulsing animation indicating Stellar testnet connectivity.
 *
 * @param {Object} props
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The ExplorerHowTo component.
 */
const ExplorerHowTo = ({ t }) => (
  <div style={{ width: '100%', maxWidth: '1000px' }} role="region" aria-label={t('explorer.howToRegion', 'How to verify credentials')}>
    {/* Section label with lines */}
    <div className="ex-anim tc-separator tc-mb-xl" style={{ animationDelay: '0.3s' }}>
      <div style={{ flex: 1 }} className="tc-divider" role="separator" />
      <span className="font-inter tc-eyebrow" style={{ whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.25)' }}>
        {t('explorer.howToTitle')}
      </span>
      <div style={{ flex: 1 }} className="tc-divider" role="separator" />
    </div>

    {/* 3 Step Cards */}
    <div className="tc-grid-3" style={{ gap: '16px', position: 'relative' }} role="list" aria-label={t('explorer.stepsLabel', 'Verification steps')}>
      {[
        { step: '01', icon: UserCheck, title: t('explorer.howToStep1Title') || 'Get Worker ID', desc: t('explorer.howToStep1'), delay: '0.35s' },
        { step: '02', icon: FileSearch, title: t('explorer.howToStep2Title') || 'Search', desc: t('explorer.howToStep2'), delay: '0.4s' },
        { step: '03', icon: ShieldCheck, title: t('explorer.howToStep3Title') || 'Verify', desc: t('explorer.howToStep3'), delay: '0.45s' },
      ].map((item, i, arr) => (
        <div key={i} className="ex-anim ex-step glass-card" role="listitem" style={{
          borderRight: i < arr.length - 1 ? 'none' : undefined,
          animationDelay: item.delay,
        }}>
          {i < arr.length - 1 && (
            <span className="tc-text-dimmer" style={{ position: 'absolute', right: '-7px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', zIndex: 1, pointerEvents: 'none' }} aria-hidden="true">→</span>
          )}
          <div className="tc-flex-between tc-mb-xl" style={{ alignItems: 'flex-start' }}>
            <div className="tc-activity-icon" style={{ width: '40px', height: '40px' }}>
              <item.icon className="tc-icon-xl tc-icon-accent" aria-hidden="true" />
            </div>
            <span className="font-inter tc-label">{t('explorer.step')} {item.step}</span>
          </div>
          <h4 className="font-clash tc-heading-sm tc-mb-sm" style={{ fontSize: '16px' }}>{item.title}</h4>
          <p className="font-inter tc-body tc-text-dim tc-text-base">{item.desc}</p>
        </div>
      ))}
    </div>

    {/* Security Banner */}
    <div className="ex-anim tc-flex tc-flex-gap-lg" role="status" aria-label={t('explorer.securityBanner', 'Security information')} style={{
      marginTop: '48px', padding: '24px 32px',
      background: 'linear-gradient(135deg, rgba(0,220,110,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      border: '1px solid rgba(0,220,110,0.15)',
      borderLeft: '3px solid rgba(0,220,110,0.4)',
      alignItems: 'center',
      animation: 'securityPulse 3s ease infinite, exFadeUp 0.4s ease forwards',
      animationDelay: '0.5s', opacity: 0,
    }}>
      <ShieldCheck style={{ color: '#00dc6e', width: '24px', height: '24px', flexShrink: 0 }} aria-hidden="true" />
      <div>
        <p className="font-inter tc-mb-xs tc-fw-bold" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
          {t('explorer.securityTitle')}
        </p>
        <p className="font-inter tc-caption tc-text-sm tc-ls-wide">
          {t('explorer.securitySub')}
        </p>
      </div>
    </div>
  </div>
);

ExplorerHowTo.propTypes = {
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default ExplorerHowTo;
