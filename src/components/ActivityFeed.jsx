import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ExternalLink, Clock, CheckCircle2, XCircle, Zap } from 'lucide-react';

const ActivityFeed = ({ activities, loading }) => {
  const truncate = (addr) => (addr ? `${addr.slice(0, 6)}. . .${addr.slice(-4)}` : '');

  if (loading && (!activities || activities.length === 0)) {
    return (
      <div
        className="rounded-2xl p-4 h-full flex flex-col shadow-sm"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
        }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#EFF6FF] border border-[#DBEAFE]">
            <Zap className="w-4 h-4 text-[#1E3A8A]" />
          </div>
          <h3 className="text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, fontSize: '16px' }}>Live Activity Feed</h3>
        </div>
        <div className="space-y-2.5 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-[50px] rounded-xl animate-pulse bg-[#F9FAFB] border border-[#E5E7EB]" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 h-full flex flex-col min-h-0 shadow-sm"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#EFF6FF] border border-[#DBEAFE]">
            <Zap className="w-4 h-4 text-[#1E3A8A]" />
          </div>
          <div>
            <h3 className="leading-none mb-0.5 text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, fontSize: '16px' }}>Live Activity Feed</h3>
            <p className="label-mono font-bold text-gray-500">Real-time contract events</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full" style={{ background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }} />
            <div className="absolute w-1.5 h-1.5 rounded-full animate-ping" style={{ background: '#10B981' }} />
          </div>
          <span className="text-[9px] uppercase font-bold tracking-wider" style={{ color: '#10B981' }}>Live</span>
        </div>
      </div>

      {/* Activity list */}
      <div
        className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#E5E7EB transparent',
        }}
      >
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gray-50 border border-gray-200">
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs font-bold mb-1 text-gray-600">No Activity Yet</p>
            <p className="text-[10px] max-w-[180px] font-medium text-gray-500">Waiting for contract interactions on Stellar Testnet...</p>
          </div>
        ) : (
          <AnimatePresence>
            {activities.map((activity, idx) => (
              <motion.div
                key={`${activity.hash}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: idx * 0.04, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 group shadow-sm bg-[#FFFFFF] border border-[#E5E7EB]"
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.borderColor = '#1E3A8A';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: activity.successful ? '#ECFDF5' : '#FEF2F2',
                      border: `1px solid ${activity.successful ? '#D1FAE5' : '#FEE2E2'}`,
                    }}
                  >
                    {activity.successful ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <span className="block text-xs font-bold tracking-tight truncate transition-colors group-hover:text-[#1E3A8A]" style={{ fontFamily: 'monospace', color: '#1E3A8A' }}>
                      {truncate(activity.walletAddress)}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-2.5 h-2.5 shrink-0 text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-500">{activity.timeAgo}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[10px] font-bold truncate text-[#0284C7]">{activity.operationType}</span>
                    </div>
                  </div>
                </div>
                
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${activity.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-300 shrink-0 ml-2 bg-[#F9FAFB] border border-[#E5E7EB] text-gray-500 hover:bg-[#EFF6FF] hover:border-[#1E3A8A] hover:text-[#EA580C]"
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
