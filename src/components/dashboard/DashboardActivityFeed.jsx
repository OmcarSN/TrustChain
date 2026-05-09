import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, UserCheck, Clock, Hash, Star, Inbox } from 'lucide-react';

/**
 * Dashboard activity feed with tab filtering (All / Received / Given).
 */
const DashboardActivityFeed = ({ filteredEvents, activeTab, setActiveTab, loading, t }) => (
  <div className="db-anim" style={{ animationDelay: '0.25s' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <span className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase' }}>{t('dashboard.activityFeed')}</span>
      <div style={{ display: 'flex', gap: '0' }}>
        {[
          { key: 'all', label: t('dashboard.tabAll') },
          { key: 'received', label: t('dashboard.tabReceived') },
          { key: 'given', label: t('dashboard.tabGiven') },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="db-tab font-inter"
            style={{
              padding: '5px 14px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? '#000' : 'rgba(255,255,255,0.3)',
              fontWeight: activeTab === tab.key ? '700' : '400',
            }}>
            {tab.label}
          </button>
        ))}
      </div>
    </div>

    {loading ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{[1, 2, 3].map(i => (<div key={i} style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)', height: '56px' }} className="animate-pulse" />))}</div>
    ) : filteredEvents.length === 0 ? (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <Inbox style={{ width: '32px', height: '32px', color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px' }} />
        <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>{t('dashboard.noActivity')}</p>
        <p className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)', marginTop: '4px' }}>{t('dashboard.noActivitySub')}</p>
      </div>
    ) : (
      <div style={{ maxHeight: '500px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
        <AnimatePresence>
          {filteredEvents.slice(0, 20).map((event, idx) => (
            <motion.div key={`${event.txHash}-${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
              style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {event.type === 'received' ? <Award style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.25)' }} /> : <UserCheck style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.25)' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span className="font-inter" style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{event.type === 'received' ? t('dashboard.endorsementReceived') : t('dashboard.endorsementGiven')}</span>
                  <span style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', textTransform: 'uppercase' }}>{event.jobType}</span>
                </div>
                <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', marginBottom: '6px' }}>"{event.feedback}"</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock style={{ width: '10px', height: '10px' }} />{new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {event.txHash && (
                    <a href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                      <Hash style={{ width: '10px', height: '10px' }} />{event.txHash.slice(0, 8)}…
                    </a>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center', flexShrink: 0 }}>
                {[1, 2, 3, 4, 5].map(s => (<Star key={s} style={{ width: '13px', height: '13px', color: s <= event.rating ? '#f5a623' : 'rgba(255,255,255,0.1)', fill: s <= event.rating ? '#f5a623' : 'transparent' }} />))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )}
  </div>
);

DashboardActivityFeed.propTypes = {
  filteredEvents: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['received', 'given']).isRequired,
    txHash: PropTypes.string,
    feedback: PropTypes.string,
    jobType: PropTypes.string,
    rating: PropTypes.number,
    timestamp: PropTypes.string,
  })).isRequired,
  activeTab: PropTypes.oneOf(['all', 'received', 'given']).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default DashboardActivityFeed;
