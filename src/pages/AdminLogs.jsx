import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Activity, Database, Clock, RefreshCcw } from 'lucide-react';
import { getErrorLog, getTxLog, clearLogs } from '../utils/monitor';
import { useTranslation } from 'react-i18next';

/**
 * AdminLogs — Developer diagnostics page.
 * Displays two side-by-side panels: a transaction log and an error log,
 * each with sticky table headers and auto-refresh every 5 seconds.
 * Provides refresh and clear actions for log management.
 *
 * @returns {React.ReactElement} The AdminLogs page.
 */
const AdminLogs = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState([]);
  const [txs, setTxs] = useState([]);

  const loadData = useCallback(() => { setErrors(getErrorLog()); setTxs(getTxLog()); }, []);
   
  useEffect(() => { loadData(); const iv = setInterval(loadData, 5000); return () => clearInterval(iv); }, [loadData]);
  const handleClear = () => { if (window.confirm("Clear all logs?")) { clearLogs(); loadData(); } };

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', right: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center"><Database className="w-5 h-5 text-white/30" /></div>
              <h1 className="font-clash text-3xl font-bold tracking-tighter">{t('adminLogs.headerTitle')}</h1>
            </div>
            <p className="text-white/30 text-sm max-w-xl font-inter">{t('adminLogs.headerSubtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-[2px] font-bold uppercase tracking-wider text-xs text-white/40 hover:text-white hover:border-white/30 transition-all">
              <RefreshCcw className="w-4 h-4" /> {t('adminLogs.refreshBtn')}
            </button>
            <button onClick={handleClear} className="flex items-center gap-2 px-5 py-2.5 border border-red-400/20 rounded-[2px] font-bold uppercase tracking-wider text-xs text-red-400/80 hover:bg-red-400/10 transition-all">
              <Trash2 className="w-4 h-4" /> {t('adminLogs.clearBtn')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* TX Log */}
          <div className="border border-white/[0.07] rounded-[2px] bg-white/[0.02] overflow-hidden flex flex-col h-[600px]">
            <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3"><Activity className="w-4 h-4 text-green-400" /><h2 className="text-sm font-bold tracking-tight font-inter uppercase">{t('adminLogs.txLogsTab')}</h2></div>
              <span className="text-xs font-mono text-white/30">{txs.length} Entries</span>
            </div>
            <div className="flex-1 overflow-auto">
              {txs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/15"><Activity className="w-10 h-10 mb-3 opacity-40" /><p className="font-bold uppercase tracking-widest text-xs font-inter">No Transactions</p></div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/30 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 text-[10px] font-bold uppercase text-white/30 font-inter">Timestamp</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-white/30 font-inter">Type</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-white/30 font-inter">Wallet</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-white/30 font-inter">Tx Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txs.map((tx, i) => (
                      <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="p-4 font-mono text-white/40 text-xs flex items-center gap-2"><Clock className="w-3 h-3" />{new Date(tx.timestamp).toLocaleTimeString()}</td>
                        <td className="p-4 text-green-400/80 font-bold text-xs">{tx.type}</td>
                        <td className="p-4 font-mono text-white/50 text-xs">{tx.wallet ? `${tx.wallet.slice(0,6)}…${tx.wallet.slice(-4)}` : 'N/A'}</td>
                        <td className="p-4 font-mono text-xs text-white/30">{tx.txHash ? `${tx.txHash.slice(0,8)}…` : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Error Log */}
          <div className="border border-white/[0.07] rounded-[2px] bg-white/[0.02] overflow-hidden flex flex-col h-[600px]">
            <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3"><AlertTriangle className="w-4 h-4 text-red-400" /><h2 className="text-sm font-bold tracking-tight font-inter uppercase">{t('adminLogs.errorLogsTab')}</h2></div>
              <span className="text-xs font-mono text-white/30">{errors.length} Entries</span>
            </div>
            <div className="flex-1 overflow-auto">
              {errors.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/15"><AlertTriangle className="w-10 h-10 mb-3 opacity-40" /><p className="font-bold uppercase tracking-widest text-xs font-inter">System Healthy</p></div>
              ) : (
                <table className="w-full text-left text-sm max-w-full">
                  <thead className="bg-black/30 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 text-[10px] font-bold uppercase text-white/30 whitespace-nowrap font-inter">Timestamp</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-white/30 whitespace-nowrap font-inter">Context</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-white/30 font-inter">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.map((err, i) => (
                      <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="p-4 font-mono text-white/40 text-xs whitespace-nowrap flex items-center gap-2"><Clock className="w-3 h-3" />{new Date(err.timestamp).toLocaleTimeString()}</td>
                        <td className="p-4 text-white/50 font-bold text-xs whitespace-nowrap">{err.context}</td>
                        <td className="p-4 text-xs font-mono">
                          <div className="text-red-400/80 mb-1">{err.message}</div>
                          {err.stack && <div className="text-white/20 text-[10px] overflow-hidden text-ellipsis whitespace-nowrap max-w-xs xl:max-w-md">{err.stack.split('\n')[1] || err.stack.split('\n')[0]}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
