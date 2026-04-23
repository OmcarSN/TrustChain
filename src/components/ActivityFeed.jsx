import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Activity, ExternalLink, Clock, CheckCircle2, XCircle, Zap } from 'lucide-react';

const ActivityFeed = ({ activities, loading }) => {
  const { t } = useTranslation();
  const truncate = (addr) => (addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '');

  if (loading && (!activities || activities.length === 0)) {
    return (
      <div className="rounded-[2px] p-5 h-full flex flex-col border border-white/[0.07] bg-white/[0.02]">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-7 h-7 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-white/30" /></div>
          <h3 className="text-sm font-bold text-white tracking-tight font-inter">{t("dashboard.activityFeed")}</h3>
        </div>
        <div className="space-y-2.5 flex-1">
          {[1,2,3,4,5].map((i) => (<div key={i} className="h-[56px] bg-white/[0.03] rounded-[2px] animate-pulse" style={{ animationDelay: `${i*120}ms` }} />))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2px] p-5 h-full flex flex-col border border-white/[0.07] bg-white/[0.02]">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-white/30" /></div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight leading-none mb-0.5 font-inter">{t("dashboard.activityFeed")}</h3>
            <p className="text-[9px] text-white/20 uppercase tracking-wider font-inter">{t("dashboard.realTimeEvents")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 border border-green-400/15 rounded-[2px]">
          <div className="relative flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><div className="absolute w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" /></div>
          <span className="text-[9px] uppercase font-bold text-green-400/80 tracking-wider">{t("dashboard.live")}</span>
        </div>
      </div>

      <div className="space-y-1.5 overflow-y-auto flex-1 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent', maxHeight: '380px' }}>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-[2px] bg-white/5 border border-white/5 flex items-center justify-center mb-3"><Activity className="w-5 h-5 text-white/15" /></div>
            <p className="text-xs font-bold text-white/25 mb-1 font-inter">{t("dashboard.noActivity")}</p>
            <p className="text-[10px] text-white/10 max-w-[180px] font-inter">{t("dashboard.noActivitySubFeed")}</p>
          </div>
        ) : (
          <AnimatePresence>
            {activities.map((activity, idx) => (
              <motion.div key={`${activity.hash}-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: idx * 0.04 }}
                className="flex items-center justify-between p-3 rounded-[2px] border border-white/[0.04] hover:border-white/[0.1] transition-all bg-white/[0.01]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-[2px] flex items-center justify-center shrink-0 ${activity.successful ? 'bg-green-400/8 border border-green-400/15' : 'bg-red-400/8 border border-red-400/15'}`}>
                    {activity.successful ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold font-mono text-white/60 tracking-tight truncate">{truncate(activity.walletAddress)}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-2.5 h-2.5 text-white/15 shrink-0" />
                      <span className="text-[10px] text-white/25 font-inter">{activity.timeAgo}</span>
                      <span className="text-white/10 text-[10px]">•</span>
                      <span className="text-[10px] text-white/30 font-inter truncate">{activity.operationType}</span>
                    </div>
                  </div>
                </div>
                <a href={`https://stellar.expert/explorer/testnet/tx/${activity.hash}`} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-[2px] text-white/15 hover:text-white/50 border border-white/5 hover:border-white/15 transition-all shrink-0 ml-2">
                  <ExternalLink className="w-3 h-3" />
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
