import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Star, Briefcase, MapPin, ArrowUpRight } from 'lucide-react';

/**
 * DashboardSidebar — Left sidebar of the authenticated Dashboard page.
 * Displays the worker's credential summary (skill, rating, endorsement counts),
 * quick action links, credential card detail, and reputation stars.
 *
 * @param {Object} props
 * @param {Object|null} props.credential - Worker credential object (null if not minted).
 * @param {string} props.credential.name - Worker's full name.
 * @param {string} props.credential.skill - Primary skill category.
 * @param {string} props.credential.city - City of residence.
 * @param {string} [props.credential.bio] - Optional short bio.
 * @param {string} [props.credential.experience] - Years of experience.
 * @param {Object|null} props.reputation - Computed reputation object.
 * @param {number|string} props.reputation.average - Average star rating.
 * @param {number} [props.reputation.total] - Total endorsement count.
 * @param {Array} props.endorsementsReceived - Endorsements received by the worker.
 * @param {Array} props.endorsementsGiven - Endorsements given by the worker.
 * @param {Array<Object>} props.quickActions - Quick action link configs.
 * @param {string} props.quickActions[].to - React Router path.
 * @param {React.ComponentType} props.quickActions[].icon - Lucide icon component.
 * @param {string} props.quickActions[].label - Action title.
 * @param {string} props.quickActions[].sub - Action subtitle.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The DashboardSidebar component.
 */
const DashboardSidebar = ({ credential, reputation, endorsementsReceived, endorsementsGiven, quickActions, t }) => (
  <div className="db-sidebar tc-flex-col" style={{ width: '280px', minWidth: '260px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', paddingBottom: '40px' }}>

    {/* Sidebar stats */}
    <div className="db-anim tc-flex-col tc-sidebar-section" style={{ gap: '14px', animationDelay: '0s' }}>
      <div className="tc-flex-between">
        <span className="font-inter tc-label">{t('dashboard.credential')}</span>
        <span className="tc-card-interactive tc-text-xs tc-ls-wide" style={{ padding: '3px 12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>{credential?.skill || '—'}</span>
      </div>
      <div className="tc-divider" />
      <div className="tc-flex-between">
        <span className="font-inter tc-label">{t('dashboard.avgRating')}</span>
        <div className="tc-flex tc-flex-gap-sm" style={{ alignItems: 'center' }}>
          <span className="font-clash tc-stat-lg">{reputation?.average || '0.0'}</span>
          <Star className="tc-icon-sm" style={{ color: '#f5a623', fill: '#f5a623' }} />
        </div>
      </div>
      <div className="tc-flex-between">
        <span className="font-inter tc-label">{t('dashboard.received')}</span>
        <span className="font-clash tc-stat-lg">{endorsementsReceived.length}</span>
      </div>
      <div className="tc-flex-between">
        <span className="font-inter tc-label">{t('dashboard.given')}</span>
        <span className="font-clash tc-stat-lg">{endorsementsGiven.length}</span>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="db-anim" style={{ animationDelay: '0.05s' }}>
      <p className="font-inter tc-label tc-sidebar-label">{t('dashboard.quickActions')}</p>
      {quickActions.map((a, i) => (
        <Link key={i} to={a.to} className="db-qa">
          <div className="tc-activity-icon">
            <a.icon className="tc-icon-md tc-icon-accent" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="font-inter tc-text-white tc-text-base" style={{ fontWeight: '600', marginBottom: '2px' }}>{a.label}</p>
            <p className="font-inter tc-text-dimmer tc-text-sm">{a.sub}</p>
          </div>
          <ArrowUpRight className="tc-icon-sm tc-icon-dim" style={{ flexShrink: 0 }} />
        </Link>
      ))}
    </div>

    {/* My Credential */}
    {credential && (
      <div className="db-anim" style={{ animationDelay: '0.1s' }}>
        <p className="font-inter tc-label tc-sidebar-label">{t('dashboard.myCredential')}</p>
        <div className="tc-card-sm" style={{ margin: '0 12px', borderTop: '2px solid rgba(255,255,255,0.12)' }}>
          <div className="tc-flex-between tc-mb-sm">
            <span className="font-inter tc-text-white tc-text-lg tc-fw-black">{credential.name}</span>
            <span className="tc-verified-badge tc-text-xs" style={{ padding: '3px 8px', letterSpacing: '2px' }}>● {t('dashboard.onChain')}</span>
          </div>
          <div className="tc-flex tc-flex-gap tc-mb-sm" style={{ alignItems: 'center' }}>
            <span className="tc-meta-row"><Briefcase className="tc-icon-sm tc-icon-dim" /><span className="font-inter tc-text-dim tc-text-xs">{credential.skill}</span></span>
            <span className="tc-meta-row"><MapPin className="tc-icon-sm tc-icon-dim" /><span className="font-inter tc-text-dim tc-text-xs">{credential.city}</span></span>
          </div>
          {credential.bio && <p className="font-inter tc-bio-quote tc-text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px' }}>"{credential.bio}"</p>}
        </div>
      </div>
    )}

    {/* Reputation */}
    {reputation && endorsementsReceived.length > 0 && (
      <div className="db-anim tc-card-sm" style={{ margin: '12px 12px 0', animationDelay: '0.15s' }}>
        <p className="font-inter tc-label tc-mb-sm" style={{ letterSpacing: '4px' }}>{t('dashboard.reputation')}</p>
        <div className="tc-flex tc-flex-gap" style={{ alignItems: 'center' }}>
          <span className="font-clash tc-stat-value">{reputation.average}</span>
          <div>
            <div className="tc-flex tc-mb-xs" style={{ gap: '2px' }}>
              {[1, 2, 3, 4, 5].map(s => (<Star key={s} className="tc-icon-sm" style={{ color: s <= Math.round(reputation.average) ? '#f5a623' : 'rgba(255,255,255,0.1)', fill: s <= Math.round(reputation.average) ? '#f5a623' : 'transparent' }} />))}
            </div>
            <p className="font-inter tc-text-dimmer tc-text-xs">{endorsementsReceived.length} {endorsementsReceived.length !== 1 ? t('dashboard.reviews') : t('dashboard.review')}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

DashboardSidebar.propTypes = {
  /** Worker credential object (null if not yet minted). */
  credential: PropTypes.shape({
    name: PropTypes.string,
    skill: PropTypes.string,
    city: PropTypes.string,
    bio: PropTypes.string,
    experience: PropTypes.string,
  }),
  /** Computed reputation from endorsements. */
  reputation: PropTypes.shape({
    average: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    total: PropTypes.number,
  }),
  /** Endorsements received by the worker. */
  endorsementsReceived: PropTypes.array.isRequired,
  /** Endorsements given by the worker. */
  endorsementsGiven: PropTypes.array.isRequired,
  /** Quick action link configurations. */
  quickActions: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    sub: PropTypes.string.isRequired,
  })).isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

DashboardSidebar.defaultProps = {
  credential: null,
  reputation: null,
};

export default DashboardSidebar;
