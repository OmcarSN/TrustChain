import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, UserCheck, Clock, Hash, Star, Inbox } from 'lucide-react';
import { explorerTxUrl } from '../../lib/networkConfig';

/**
 * DashboardActivityFeed — Tab-filtered activity feed on the Dashboard page.
 * Displays endorsements received and given with star ratings, timestamps,
 * Stellar explorer links, and feedback text. Supports "All / Received / Given"
 * tab filtering with animated tab indicator states.
 *
 * @param {Object} props
 * @param {Array<Object>} props.filteredEvents - Pre-filtered endorsement events to render.
 * @param {'received'|'given'} props.filteredEvents[].type - Endorsement direction.
 * @param {string} [props.filteredEvents[].txHash] - Stellar transaction hash.
 * @param {string} [props.filteredEvents[].feedback] - Reviewer's feedback text.
 * @param {string} [props.filteredEvents[].jobType] - Job category label.
 * @param {number} [props.filteredEvents[].rating] - Star rating (1-5).
 * @param {string} [props.filteredEvents[].timestamp] - ISO 8601 timestamp string.
 * @param {'all'|'received'|'given'} props.activeTab - Currently active filter tab.
 * @param {Function} props.setActiveTab - Callback to change the active tab.
 * @param {boolean} props.loading - Whether endorsement data is still loading.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The DashboardActivityFeed component.
 */
const DashboardActivityFeed = ({ filteredEvents, activeTab, setActiveTab, loading, t }) => (
  <div className="db-anim" style={{ animationDelay: '0.25s' }}>
    <div className="tc-flex-between tc-mb-md">
      <span className="font-inter tc-label tc-ls-wider">{t('dashboard.activityFeed')}</span>
      <div className="tc-flex">
        {[
          { key: 'all', label: t('dashboard.tabAll') },
          { key: 'received', label: t('dashboard.tabReceived') },
          { key: 'given', label: t('dashboard.tabGiven') },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`db-tab font-inter tc-chart-toggle ${activeTab === tab.key ? 'tc-chart-toggle--active' : 'tc-chart-toggle--inactive'}`}
            style={{ padding: '5px 14px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {tab.label}
          </button>
        ))}
      </div>
    </div>

    {loading ? (
      <div className="tc-flex-col" style={{ gap: '4px' }}>{[1, 2, 3].map(i => (<div key={i} className="tc-card-sm animate-pulse" style={{ height: '56px' }} />))}</div>
    ) : filteredEvents.length === 0 ? (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <Inbox className="tc-icon-dimmer" style={{ width: '32px', height: '32px', margin: '0 auto 12px' }} />
        <p className="font-inter tc-text-dimmer tc-text-base">{t('dashboard.noActivity')}</p>
        <p className="font-inter tc-text-faint tc-text-sm" style={{ marginTop: '4px' }}>{t('dashboard.noActivitySub')}</p>
      </div>
    ) : (
      <div className="tc-scroll-hidden" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <AnimatePresence>
          {filteredEvents.slice(0, 20).map((event, idx) => (
            <motion.div key={`${event.txHash}-${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
              className="tc-activity-item" style={{ padding: '16px 0' }}>
              <div className="tc-activity-icon" style={{ width: '36px', height: '36px' }}>
                {event.type === 'received'
                  ? <Award className="tc-icon-md tc-icon-accent" />
                  : <UserCheck className="tc-icon-md tc-icon-accent" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tc-flex tc-flex-gap-sm tc-mb-xs" style={{ alignItems: 'center' }}>
                  <span className="font-inter tc-text-white tc-text-base tc-fw-bold">{event.type === 'received' ? t('dashboard.endorsementReceived') : t('dashboard.endorsementGiven')}</span>
                  <span className="tc-card-interactive tc-text-xs tc-ls-wide" style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{event.jobType}</span>
                </div>
                <p className="font-inter tc-text-dim tc-text-base tc-text-italic tc-mb-xs">"{event.feedback}"</p>
                <div className="tc-flex tc-flex-gap">
                  <span className="font-inter tc-text-dimmer tc-text-sm tc-flex" style={{ alignItems: 'center', gap: '4px' }}>
                    <Clock className="tc-icon-xs" />{new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {event.txHash && (
                    <a href={explorerTxUrl(event.txHash)} target="_blank" rel="noopener noreferrer" className="tc-mono tc-text-faint tc-text-sm tc-flex" style={{ alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                      <Hash className="tc-icon-xs" />{event.txHash.slice(0, 8)}…
                    </a>
                  )}
                </div>
              </div>
              <div className="tc-flex" style={{ gap: '2px', alignItems: 'center', flexShrink: 0 }}>
                {[1, 2, 3, 4, 5].map(s => (<Star key={s} className="tc-icon-md" style={{ color: s <= event.rating ? '#f5a623' : 'rgba(255,255,255,0.1)', fill: s <= event.rating ? '#f5a623' : 'transparent' }} />))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )}
  </div>
);

DashboardActivityFeed.propTypes = {
  /** Pre-filtered endorsement event objects to render. */
  filteredEvents: PropTypes.arrayOf(PropTypes.shape({
    /** Endorsement direction — received or given. */
    type: PropTypes.oneOf(['received', 'given']).isRequired,
    /** Stellar transaction hash for explorer link. */
    txHash: PropTypes.string,
    /** Reviewer's feedback text. */
    feedback: PropTypes.string,
    /** Job category label (e.g., "Plumbing"). */
    jobType: PropTypes.string,
    /** Star rating value (1-5). */
    rating: PropTypes.number,
    /** ISO 8601 timestamp of the endorsement. */
    timestamp: PropTypes.string,
  })).isRequired,
  /** Currently active filter tab key. */
  activeTab: PropTypes.oneOf(['all', 'received', 'given']).isRequired,
  /** Callback to change the active tab. */
  setActiveTab: PropTypes.func.isRequired,
  /** Whether endorsement data is still loading. */
  loading: PropTypes.bool.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default DashboardActivityFeed;
