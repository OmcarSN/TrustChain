import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Activity, Database, Clock, RefreshCcw, ShieldCheck } from 'lucide-react';
import { getErrorLog, getTxLog, clearLogs } from '../utils/monitor';

const AdminLogs = () => {
  const [errors, setErrors] = useState([]);
  const [txs, setTxs] = useState([]);

  const loadData = () => {
    setErrors(getErrorLog());
    setTxs(getTxLog());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all monitoring logs?")) {
      clearLogs();
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[100px] pb-12 px-6 relative overflow-hidden text-gray-900">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'rgba(239,68,68,0.05)', filter: 'blur(150px)', zIndex: 0 }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Banner */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
           className="mb-8 p-6 rounded-[20px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm"
           style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#FEF2F2] border border-[#FEE2E2]">
                <Database className="w-6 h-6 text-red-500" />
              </div>
              <h1 className="text-3xl text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>System Logs</h1>
            </div>
            <p className="text-sm font-medium text-gray-500">
              Internal monitoring dashboard mapping all LocalStorage captured exceptions and transactions.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={loadData}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all active:scale-95 bg-[#F9FAFB] border border-[#E5E7EB] text-gray-600 hover:bg-[#EFF6FF] hover:border-[#DBEAFE] hover:text-[#1E3A8A]"
            >
              <RefreshCcw className="w-4 h-4 text-[#1E3A8A]" /> Refresh
            </button>
            <button 
              onClick={handleClear}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all active:scale-95 bg-[#FEF2F2] border border-[#FEE2E2] text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> Clear Logs
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TX Log Table */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-[20px] overflow-hidden flex flex-col h-[600px] shadow-sm bg-[#FFFFFF] border border-[#E5E7EB]">
            <div className="p-5 flex items-center justify-between shrink-0 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#10B981]" />
                <h2 className="text-lg text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Transaction Log</h2>
              </div>
              <span className="label-mono px-2 py-1 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] font-bold text-gray-600">{txs.length}</span>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              {txs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                  <ShieldCheck className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="label-mono font-bold text-gray-400">No Transactions Recorded</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="sticky top-0 z-10 bg-[#F9FAFB]">
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="p-4 label-mono font-bold text-gray-500">Time</th>
                      <th className="p-4 label-mono font-bold text-gray-500">Type</th>
                      <th className="p-4 label-mono font-bold text-gray-500">Wallet</th>
                      <th className="p-4 label-mono font-bold text-gray-500">Tx Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txs.map((tx, i) => (
                      <tr key={i} className="hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]">
                        <td className="p-4 text-[10px] font-mono flex items-center gap-2 font-bold text-gray-500">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-4 text-[10px] font-bold text-[#10B981]">{tx.type}</td>
                        <td className="p-4 text-xs font-mono font-bold text-gray-600">
                          {tx.wallet ? `${tx.wallet.slice(0,6)}...${tx.wallet.slice(-4)}` : '—'}
                        </td>
                        <td className="p-4 text-xs font-mono font-bold text-[#0284C7]">
                          {tx.txHash ? `${tx.txHash.slice(0,8)}...` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>

          {/* Error Log Table */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-[20px] overflow-hidden flex flex-col h-[600px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm">
            <div className="p-5 flex items-center justify-between shrink-0 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg text-gray-900" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}>Exception Log</h2>
              </div>
              <span className="label-mono px-2 py-1 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] font-bold text-red-500">{errors.length}</span>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              {errors.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                  <ShieldCheck className="w-12 h-12 mb-4 text-[#10B981] opacity-50" />
                  <p className="label-mono font-bold text-gray-500">System Healthy</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="sticky top-0 z-10 bg-[#F9FAFB]">
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="p-4 label-mono font-bold text-gray-500">Time</th>
                      <th className="p-4 label-mono font-bold text-gray-500">Context</th>
                      <th className="p-4 label-mono font-bold text-gray-500">Exception Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.map((err, i) => (
                      <tr key={i} className="hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]">
                        <td className="p-4 text-[10px] font-mono flex items-center gap-2 font-bold text-gray-500">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {new Date(err.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-4 text-[10px] font-bold text-[#1E3A8A]">
                          {err.context}
                        </td>
                        <td className="p-4">
                          <div className="text-xs font-bold text-red-500 mb-1">{err.message}</div>
                          {err.stack && (
                            <div className="text-[10px] font-mono font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-xs text-gray-400">
                              {err.stack.split('\n')[1] || err.stack.split('\n')[0]}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
