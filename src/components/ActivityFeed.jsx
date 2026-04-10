import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ExternalLink, Clock, CheckCircle2, XCircle, Zap } from 'lucide-react';

const ActivityFeed = ({ activities, loading }) => {
  const truncate = (addr) => (addr ? `${addr.slice(0, 6)}. . .${addr.slice(-4)}` : '');

  if (loading && (!activities || activities.length === 0)) {
    return (
      <div
        className="rounded-2xl p-6 h-full flex flex-col"
        style={{
          background: 'linear-gradient(160deg, rgba(124,58,237,0.06) 0%, rgba(15,15,24,0.6) 40%, rgba(15,15,24,0.4) 100%)',
          border: '1px solid rgba(124,58,237,0.06)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Live Activity Feed</h3>
        </div>
        <div className="space-y-2.5 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-[60px] bg-white/[0.03] rounded-xl animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 h-full flex flex-col"
      style={{
        background: 'linear-gradient(160deg, rgba(124,58,237,0.06) 0%, rgba(15,15,24,0.6) 40%, rgba(15,15,24,0.4) 100%)',
        border: '1px solid rgba(124,58,237,0.06)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight leading-none mb-0.5">Live Activity Feed</h3>
            <p className="text-[9px] font-medium text-white/25 uppercase tracking-wider">Real-time contract events</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-400/10 border border-emerald-400/10 rounded-lg">
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-[9px] uppercase font-bold text-emerald-400/80 tracking-wider">Live</span>
        </div>
      </div>

      {/* Activity list */}
      <div
        className="space-y-2 overflow-y-auto flex-1 pr-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(124,58,237,0.15) transparent',
        }}
      >
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5 text-white/20" />
            </div>
            <p className="text-xs font-bold text-white/30 mb-1">No Activity Yet</p>
            <p className="text-[10px] text-white/15 max-w-[180px]">Waiting for contract interactions on the Stellar Testnet...</p>
          </div>
        ) : (
          <AnimatePresence>
            {activities.map((activity, idx) => (
              <motion.div
                key={`${activity.hash}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: idx * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 group"
                style={{
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.03)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.015)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)';
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status indicator */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: activity.successful ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                      border: `1px solid ${activity.successful ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)'}`,
                    }}
                  >
                    {activity.successful ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="min-w-0">
                    <span className="block text-xs font-bold font-mono text-white/75 tracking-tight truncate">
                      {truncate(activity.walletAddress)}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-2.5 h-2.5 text-white/20 shrink-0" />
                      <span className="text-[10px] text-white/30 font-medium">{activity.timeAgo}</span>
                      <span className="text-white/10 text-[10px]">•</span>
                      <span className="text-[10px] text-accent/60 font-semibold truncate">{activity.operationType}</span>
                    </div>
                  </div>
                </div>
                
                {/* External link */}
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${activity.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-white/20 transition-all duration-200 shrink-0 ml-2"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                    e.currentTarget.style.color = '#a855f7';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.2)';
                  }}
                  title="View on Stellar Expert"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
