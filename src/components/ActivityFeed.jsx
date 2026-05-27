import React from 'react';
import { explorerTxUrl } from '../lib/networkConfig';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Activity, ExternalLink, Clock, CheckCircle2, XCircle, Zap } from 'lucide-react';

const feedItemStyle = `
@keyframes livePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes feedItemIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
`;

/**
 * ActivityFeed — Real-time blockchain activity feed panel.
 * Renders a scrollable list of recent Stellar transactions with status icons,
 * wallet addresses, operation types, and external explorer links.
 * Used on the Analytics page.
 *
 * @param {Object} props
 * @param {Array<Object>} props.activities - Array of activity objects from the indexer.
 * @param {string} props.activities[].hash - Transaction hash (Stellar).
 * @param {string} props.activities[].walletAddress - Stellar public key.
 * @param {string} props.activities[].timeAgo - Human-readable time string.
 * @param {string} props.activities[].operationType - Credential type or operation label.
 * @param {boolean} props.activities[].successful - Whether the transaction succeeded.
 * @param {boolean} props.loading - Whether data is still being fetched.
 * @returns {React.ReactElement} The ActivityFeed component.
 */
const ActivityFeed = ({ activities, loading }) => {
  const { t } = useTranslation();
  const truncate = (addr) => (addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '');

  if (loading && (!activities || activities.length === 0)) {
    return (
      <div className="tc-feed-container tc-flex-col">
        <style>{feedItemStyle}</style>
        <div className="tc-feed-header tc-flex tc-flex-gap-sm tc-flex-center">
          <div className="tc-activity-icon tc-activity-icon-sm">
            <Zap className="tc-icon-sm tc-icon-muted" />
          </div>
          <span className="tc-text-white tc-text-base tc-fw-bold">
            {t("dashboard.activityFeed")}
          </span>
        </div>
        <div className="tc-p-16 tc-flex-1">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="tc-skeleton-pulse" style={{
              height: '48px',
              marginBottom: '6px',
              animation: `livePulse 1.5s ease infinite`,
              animationDelay: `${i * 120}ms`
            }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tc-feed-container tc-flex-col">
      <style>{feedItemStyle}</style>

      {/* ═══ Header ═══ */}
      <div className="tc-feed-header tc-flex-between tc-flex-shrink-0">
        {/* Left zone */}
        <div className="tc-flex tc-flex-gap-sm tc-flex-center">
          <div className="tc-activity-icon tc-activity-icon-sm">
            <Zap className="tc-icon-sm tc-icon-muted" />
          </div>
          <div>
            <div className="tc-text-white tc-text-base tc-fw-bold tc-line-height-1">
              {t("dashboard.activityFeed")}
            </div>
            <div className="font-inter tc-caption tc-mt-2">
              {t("dashboard.realTimeEvents")}
            </div>
          </div>
        </div>

        {/* Right zone — LIVE */}
        <div className="tc-flex tc-flex-gap-sm tc-flex-center">
          <div className="tc-dot-sm" style={{ animation: 'livePulse 1.5s ease infinite' }} />
          <span className="tc-text-accent tc-text-xs tc-fw-bold tc-ls-wide">LIVE</span>
        </div>
      </div>

      {/* ═══ Feed List ═══ */}
      <div className="relative tc-flex-1" style={{ minHeight: 0 }}>
        <div className="tc-scroll-hidden tc-scroll-feed">

          {activities.length === 0 ? (
            <div className="tc-flex-center tc-flex-col tc-empty-state">
              <div className="tc-activity-icon tc-mb-sm" style={{ width: '36px', height: '36px' }}>
                <Activity className="tc-icon-lg tc-icon-dimmer" />
              </div>
              <p className="font-inter tc-text-dimmer tc-text-xs tc-fw-bold tc-mb-xs">
                {t("dashboard.noActivity")}
              </p>
              <p className="font-inter tc-text-faint tc-text-xs" style={{ maxWidth: '180px' }}>
                {t("dashboard.noActivitySubFeed")}
              </p>
            </div>
          ) : (
            activities.map((activity, idx) => {
              const isEndorsement = activity.operationType?.toLowerCase().includes('endorsement');
              return (
                <a
                  key={`${activity.hash}-${idx}`}
                  href={explorerTxUrl(activity.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tc-feed-item"
                  style={{
                    backgroundColor: isEndorsement
                      ? 'rgba(255,190,50,0.03)'
                      : idx % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent',
                    borderLeft: isEndorsement ? '2px solid rgba(255,190,50,0.4)' : '2px solid transparent',
                    animation: 'feedItemIn 0.3s ease forwards',
                    animationDelay: `${idx * 0.04}s`,
                    opacity: 0
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isEndorsement
                      ? 'rgba(255,190,50,0.03)'
                      : idx % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent';
                  }}
                >
                  {/* Status Icon */}
                  <div className="tc-feed-status-icon" style={{
                    borderColor: activity.successful !== false
                      ? 'rgba(0,220,110,0.4)' : 'rgba(239,68,68,0.4)',
                    backgroundColor: activity.successful !== false
                      ? 'rgba(0,220,110,0.07)' : 'rgba(239,68,68,0.07)',
                  }}>
                    {activity.successful !== false
                      ? <CheckCircle2 className="tc-icon-sm tc-icon-success" />
                      : <XCircle className="tc-icon-sm tc-icon-error" />
                    }
                  </div>

                  {/* Address + Meta */}
                  <div className="tc-min-w-0">
                    <div className="tc-mono tc-text-white tc-text-xs tc-fw-bold tc-truncate tc-mb-xs">
                      {truncate(activity.walletAddress)}
                    </div>
                    <div className="tc-flex tc-flex-gap-sm tc-flex-center">
                      <Clock className="tc-icon-xs tc-icon-dim tc-flex-shrink-0" />
                      <span className="tc-text-dimmer tc-text-xs">{activity.timeAgo}</span>
                      <span className="tc-text-faint tc-text-xs">•</span>
                      {isEndorsement ? (
                        <span className="tc-endorsement-tag">{activity.operationType}</span>
                      ) : (
                        <span className="tc-text-dim tc-text-xs tc-truncate tc-ls-sm">
                          {activity.operationType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* External Link */}
                  <div className="tc-feed-link-icon">
                    <ExternalLink className="tc-icon-sm" />
                  </div>
                </a>
              );
            })
          )}
        </div>

        {/* Bottom fade gradient */}
        {activities.length > 0 && <div className="tc-fade-bottom" />}
      </div>
    </div>
  );
};

ActivityFeed.propTypes = {
  /** Array of activity objects from the Stellar indexer. */
  activities: PropTypes.arrayOf(PropTypes.shape({
    hash: PropTypes.string,
    walletAddress: PropTypes.string,
    timeAgo: PropTypes.string,
    operationType: PropTypes.string,
    successful: PropTypes.bool,
  })),
  /** Whether the data is still being fetched from Horizon. */
  loading: PropTypes.bool,
};

ActivityFeed.defaultProps = {
  activities: [],
  loading: false,
};

export default ActivityFeed;
