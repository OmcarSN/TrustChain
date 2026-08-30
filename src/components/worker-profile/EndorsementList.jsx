import React, { useState } from 'react';
import { explorerTxUrl } from '../../lib/networkConfig';
import PropTypes from 'prop-types';
import { Star, Award, Clock, User, Hash, MessageSquare } from 'lucide-react';
import { replyToEndorsementOnChain } from '../../lib/reputationContract';

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
 * @param {string} props.workerAddress - The profile being viewed.
 * @param {string} props.viewerAddress - The connected wallet.
 * @returns {React.ReactElement} The EndorsementList component.
 */
const EndorsementList = ({ endorsements, t, workerAddress, viewerAddress }) => {
  const [replyingIdx, setReplyingIdx] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replySuccess, setReplySuccess] = useState({});

  const handleReply = async (idx) => {
    if (!viewerAddress || viewerAddress !== workerAddress) return;
    setReplyLoading(true);
    try {
      await replyToEndorsementOnChain(workerAddress, idx, replyText);
      setReplySuccess(prev => ({ ...prev, [idx]: true }));
      setReplyingIdx(null);
      setReplyText('');
      setTimeout(() => {
        setReplySuccess(prev => ({ ...prev, [idx]: false }));
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit reply: ' + err.message);
    } finally {
      setReplyLoading(false);
    }
  };

  return (
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
            className="prof-card prof-anim tc-endorse-card glass-card"
            role="listitem"
            aria-label={`${t('profile.endorsementFrom', 'Endorsement from')} ${e.endorser ? `${e.endorser.substring(0, 6)}...` : 'Unknown'} — ${e.rating} ${t('profile.stars', 'stars')}`}
            style={{
              borderLeft: '2px solid rgba(79,107,237,0.4)',
              padding: '20px 24px',
              animationDelay: `${0.2 + idx * 0.08}s`,
              borderRadius: '12px',
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
                <a href={explorerTxUrl(e.txHash)} target="_blank" rel="noopener noreferrer" aria-label={`${t('profile.viewTx')}: ${e.txHash.substring(0, 8)}`} className="tc-meta-row tc-mono prof-stellar" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.25)' }}>
                  <Hash className="tc-icon-xs tc-icon-dimmer" aria-hidden="true" />
                  {t('profile.viewTx')}: {e.txHash.substring(0, 8)}...
                </a>
              )}
            </div>

            {/* Reply UI */}
            {viewerAddress && viewerAddress === workerAddress && (
              <div className="tc-mt-md" style={{ marginTop: '16px' }}>
                {replySuccess[idx] ? (
                  <div className="font-inter tc-text-sm" style={{ color: '#4ade80' }}>
                    Reply submitted on-chain!
                  </div>
                ) : replyingIdx === idx ? (
                  <div className="tc-flex-col" style={{ gap: '8px' }}>
                    <textarea
                      className="font-inter glass-card tc-text-dim tc-text-sm"
                      style={{ width: '100%', minHeight: '60px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }}
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={replyLoading}
                    />
                    <div className="tc-flex" style={{ gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        className="font-inter tc-text-xs"
                        style={{ padding: '6px 12px', background: 'transparent', color: 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer' }}
                        onClick={() => { setReplyingIdx(null); setReplyText(''); }}
                        disabled={replyLoading}
                      >
                        Cancel
                      </button>
                      <button
                        className="font-inter tc-text-xs tc-fw-bold"
                        style={{ padding: '6px 12px', background: 'rgba(79,107,237,0.2)', color: '#fff', border: '1px solid rgba(79,107,237,0.4)', borderRadius: '4px', cursor: replyLoading ? 'not-allowed' : 'pointer' }}
                        onClick={() => handleReply(idx)}
                        disabled={replyLoading}
                      >
                        {replyLoading ? 'Submitting...' : 'Submit Reply'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="tc-flex tc-text-dimmer tc-text-xs"
                    style={{ gap: '4px', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={() => { setReplyingIdx(idx); setReplyText(''); }}
                  >
                    <MessageSquare className="tc-icon-xs" aria-hidden="true" />
                    Reply
                  </button>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    )}
  </div>
  );
};

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
  /** Worker's address. */
  workerAddress: PropTypes.string,
  /** Connected wallet address. */
  viewerAddress: PropTypes.string,
};

export default EndorsementList;
