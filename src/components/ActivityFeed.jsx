import React from 'react';
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

const ActivityFeed = ({ activities, loading }) => {
  const { t } = useTranslation();
  const truncate = (addr) => (addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '');

  if (loading && (!activities || activities.length === 0)) {
    return (
      <div style={{
        backgroundColor: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <style>{feedItemStyle}</style>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '28px', height: '28px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: '0'
          }}>
            <Zap style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.4)' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.01em' }}>
            {t("dashboard.activityFeed")}
          </span>
        </div>
        <div style={{ padding: '16px', flex: 1 }}>
          {[1,2,3,4,5].map((i) => (
            <div key={i} style={{
              height: '48px',
              backgroundColor: 'rgba(255,255,255,0.03)',
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
    <div style={{
      backgroundColor: '#0a0a0a',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '0',
      borderRadius: '0',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{feedItemStyle}</style>

      {/* ═══ Header ═══ */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        {/* Left zone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: '0'
          }}>
            <Zap style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.4)' }} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.01em', color: '#ffffff', lineHeight: 1 }}>
              {t("dashboard.activityFeed")}
            </div>
            <div className="font-inter" style={{
              fontSize: '9px', letterSpacing: '3px',
              color: 'rgba(255,255,255,0.3)', marginTop: '2px',
              textTransform: 'uppercase'
            }}>
              {t("dashboard.realTimeEvents")}
            </div>
          </div>
        </div>

        {/* Right zone — LIVE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            backgroundColor: '#00dc6e',
            animation: 'livePulse 1.5s ease infinite'
          }} />
          <span style={{
            fontSize: '10px', fontWeight: '700',
            letterSpacing: '2px', color: '#00dc6e'
          }}>
            LIVE
          </span>
        </div>
      </div>

      {/* ═══ Feed List ═══ */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div style={{
          maxHeight: '380px',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="feed-scroll-hide"
        >
          <style>{`.feed-scroll-hide::-webkit-scrollbar { display: none; }`}</style>

          {activities.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '48px 16px', textAlign: 'center'
            }}>
              <div style={{
                width: '36px', height: '36px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Activity style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.15)' }} />
              </div>
              <p className="font-inter" style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.25)', marginBottom: '4px' }}>
                {t("dashboard.noActivity")}
              </p>
              <p className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.1)', maxWidth: '180px' }}>
                {t("dashboard.noActivitySubFeed")}
              </p>
            </div>
          ) : (
            activities.map((activity, idx) => {
              const isEndorsement = activity.operationType?.toLowerCase().includes('endorsement');
              return (
                <a
                  key={`${activity.hash}-${idx}`}
                  href={`https://stellar.expert/explorer/testnet/tx/${activity.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 1fr auto',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    backgroundColor: isEndorsement
                      ? 'rgba(255,190,50,0.03)'
                      : idx % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent',
                    borderLeft: isEndorsement ? '2px solid rgba(255,190,50,0.4)' : '2px solid transparent',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background 0.15s ease',
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
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: activity.successful !== false
                      ? '1.5px solid rgba(0,220,110,0.4)'
                      : '1.5px solid rgba(239,68,68,0.4)',
                    backgroundColor: activity.successful !== false
                      ? 'rgba(0,220,110,0.07)'
                      : 'rgba(239,68,68,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: '0'
                  }}>
                    {activity.successful !== false
                      ? <CheckCircle2 style={{ width: '11px', height: '11px', color: '#00dc6e' }} />
                      : <XCircle style={{ width: '11px', height: '11px', color: '#ef4444' }} />
                    }
                  </div>

                  {/* Address + Meta */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '12px', fontWeight: '700',
                      fontFamily: 'monospace', color: '#ffffff',
                      letterSpacing: '0.02em', marginBottom: '3px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {truncate(activity.walletAddress)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock style={{ width: '10px', height: '10px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                        {activity.timeAgo}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>•</span>
                      {isEndorsement ? (
                        <span style={{
                          fontSize: '10px', color: 'rgba(255,190,50,0.8)',
                          backgroundColor: 'rgba(255,190,50,0.08)',
                          border: '1px solid rgba(255,190,50,0.2)',
                          padding: '1px 6px', letterSpacing: '0.5px',
                          lineHeight: '1.4'
                        }}>
                          {activity.operationType}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '10px', color: 'rgba(255,255,255,0.4)',
                          letterSpacing: '0.5px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {activity.operationType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* External Link */}
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.15)',
                      transition: 'color 0.15s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.15)'; }}
                  >
                    <ExternalLink style={{ width: '11px', height: '11px' }} />
                  </div>
                </a>
              );
            })
          )}
        </div>

        {/* Bottom fade gradient */}
        {activities.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '48px',
            background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
            pointerEvents: 'none'
          }} />
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
