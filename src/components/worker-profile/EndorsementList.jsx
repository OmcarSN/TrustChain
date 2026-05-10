import React from 'react';
import PropTypes from 'prop-types';
import { Star, Award, Clock, User, Hash } from 'lucide-react';

/**
 * EndorsementList — Scrollable list of endorsement review cards on WorkerProfile.
 * Renders a section header with count, empty state messaging, and individual
 * endorsement cards with star ratings, feedback quotes, timestamps, endorser
 * addresses, and Stellar explorer links.
 *
 * @param {Object} props
 * @param {Array<Object>} props.endorsements - Array of endorsement objects.
 * @param {string} [props.endorsements[].endorser] - Stellar public key of the endorser.
 * @param {number} [props.endorsements[].rating] - Star rating (1-5).
 * @param {string} [props.endorsements[].feedback] - Review text.
 * @param {string} [props.endorsements[].jobType] - Job category label.
 * @param {string} [props.endorsements[].timestamp] - ISO 8601 timestamp.
 * @param {string} [props.endorsements[].txHash] - Stellar transaction hash.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The EndorsementList component.
 */
const EndorsementList = ({ endorsements, t }) => (
  <div className="prof-anim" style={{ animationDelay: '0.15s' }} role="region" aria-label={t('profile.endorsementsRegion', 'Endorsements and reviews')}>
    {/* Header */}
    <div className="tc-flex-between tc-mb-md">
      <span className="font-inter tc-eyebrow-bright tc-ls-wider">{t('profile.reviewsHeader')}</span>
      <span className="font-inter tc-text-dimmer tc-text-sm">{endorsements.length} {t('analytics.total')}</span>
    </div>

    {endorsements.length === 0 ? (
      <div className="tc-card-sm" style={{ padding: '40px 24px', textAlign: 'center' }}>
        <Award className="tc-icon-dimmer" style={{ width: '32px', height: '32px', margin: '0 auto 12px' }} aria-hidden="true" />
        <p className="font-inter tc-text-dimmer tc-text-sm">{t('profile.beFirstEndorse')}</p>
      </div>
    ) : (
      <div className="tc-flex-col tc-flex-gap" role="list" aria-label={t('profile.endorsementsList', 'List of endorsements')}>
        {endorsements.map((e, idx) => (
          <article
            key={idx}
            className="prof-card prof-anim tc-endorse-card"
            role="listitem"
            aria-label={`${t('profile.endorsementFrom', 'Endorsement from')} ${e.endorser ? `${e.endorser.substring(0, 6)}...` : 'Unknown'} — ${e.rating} ${t('profile.stars', 'stars')}`}
            style={{
              borderLeft: '2px solid rgba(255,255,255,0.15)',
              padding: '20px 24px',
              animationDelay: `${0.2 + idx * 0.08}s`,
            }}
          >
            {/* Top row: job type + stars */}
            <div className="tc-flex-between tc-mb-sm" style={{ alignItems: 'flex-start' }}>
              <span className="font-inter tc-card-interactive tc-text-xs tc-ls-wider" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                {e.jobType || 'Freelance Project'}
              </span>
              <div className="tc-flex" style={{ gap: '3px' }} role="img" aria-label={`${e.rating} out of 5 stars`}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="tc-icon-md" style={{ color: s <= e.rating ? '#f5a623' : 'rgba(255,255,255,0.1)', fill: s <= e.rating ? '#f5a623' : 'transparent' }} aria-hidden="true" />
                ))}
              </div>
            </div>

            {/* Review text */}
            <p className="font-inter tc-text-dim tc-mb-sm tc-text-italic" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              "{e.feedback}"
            </p>

            {/* Meta row */}
            <div className="tc-flex tc-flex-gap tc-text-dimmer tc-text-sm" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="tc-meta-row">
                <Clock className="tc-icon-xs tc-icon-dimmer" aria-hidden="true" />
                <time dateTime={new Date(e.timestamp).toISOString()}>{new Date(e.timestamp).toLocaleDateString()}</time>
              </span>
              <span className="tc-meta-row">
                <User className="tc-icon-xs tc-icon-dimmer" aria-hidden="true" />
                {t('profile.endorserLabel')}: {e.endorser ? `${e.endorser.substring(0, 6)}...${e.endorser.substring(e.endorser.length - 4)}` : 'Unknown'}
              </span>
              {e.txHash && (
                <a href={`https://stellar.expert/explorer/testnet/tx/${e.txHash}`} target="_blank" rel="noopener noreferrer" aria-label={`${t('profile.viewTx')}: ${e.txHash.substring(0, 8)}`} className="tc-meta-row tc-mono prof-stellar" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.25)' }}>
                  <Hash className="tc-icon-xs tc-icon-dimmer" aria-hidden="true" />
                  {t('profile.viewTx')}: {e.txHash.substring(0, 8)}...
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
);

EndorsementList.propTypes = {
  /** Array of endorsement objects to render as review cards. */
  endorsements: PropTypes.arrayOf(PropTypes.shape({
    /** Stellar public key of the endorser. */
    endorser: PropTypes.string,
    /** Star rating (1-5). */
    rating: PropTypes.number,
    /** Review feedback text. */
    feedback: PropTypes.string,
    /** Job category label. */
    jobType: PropTypes.string,
    /** ISO 8601 timestamp of the endorsement. */
    timestamp: PropTypes.string,
    /** Stellar transaction hash. */
    txHash: PropTypes.string,
  })).isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default EndorsementList;
