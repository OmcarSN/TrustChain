import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Activity, Database, Clock, RefreshCcw } from 'lucide-react';
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
    // Auto-refresh every 5 seconds while on this dashboard
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
    <div className="min-h-screen bg-[#0a0a0f] pt-28 pb-12 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 blur-[200px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                <Database className="w-6 h-6 text-red-400" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">System Logs</h1>
            </div>
            <p className="text-white/40 text-sm max-w-xl font-medium">
              Internal monitoring dashboard mapping all LocalStorage captured exceptions and transactions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={loadData}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all"
            >
              <RefreshCcw className="w-4 h-4 text-white/50" /> Refresh
            </button>
            <button 
              onClick={handleClear}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-bold uppercase tracking-wider text-xs transition-all"
            >
              <Trash2 className="w-4 h-4" /> Clear Logs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* TX Log Table */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-black tracking-wider uppercase">Transaction Log</h2>
              </div>
              <span className="text-xs font-mono text-white/40">{txs.length} Entries</span>
            </div>
            <div className="flex-1 overflow-auto p-0">
              {txs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20">
                  <Activity className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-bold uppercase tracking-widest text-xs">No Transactions Recorded</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/20 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 text-[10px] font-black uppercase text-white/40">Timestamp</th>
                      <th className="p-4 text-[10px] font-black uppercase text-white/40">Type</th>
                      <th className="p-4 text-[10px] font-black uppercase text-white/40">Wallet</th>
                      <th className="p-4 text-[10px] font-black uppercase text-white/40">Tx Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txs.map((tx, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-4 font-mono text-white/50 text-xs flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-4 text-green-400 font-bold text-xs">{tx.type}</td>
                        <td className="p-4 font-mono text-white/70 text-xs">
                          {tx.wallet ? `${tx.wallet.slice(0,6)}...${tx.wallet.slice(-4)}` : 'N/A'}
                        </td>
                        <td className="p-4 font-mono text-xs text-white/50">
                          {tx.txHash ? `${tx.txHash.slice(0,8)}...` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Error Log Table */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
             <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-black tracking-wider uppercase">Exception Log</h2>
              </div>
              <span className="text-xs font-mono text-white/40">{errors.length} Entries</span>
            </div>
            <div className="flex-1 overflow-auto p-0">
              {errors.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20">
                  <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-bold uppercase tracking-widest text-xs">System Healthy</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm max-w-full">
                  <thead className="bg-black/20 sticky top-0 z-10 w-full">
                    <tr>
                      <th className="p-4 text-[10px] font-black uppercase text-white/40 whitespace-nowrap">Timestamp</th>
                      <th className="p-4 text-[10px] font-black uppercase text-white/40 whitespace-nowrap">Context</th>
                      <th className="p-4 text-[10px] font-black uppercase text-white/40">Error Message / Stack Trace</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.map((err, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-4 font-mono text-white/50 text-xs whitespace-nowrap flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(err.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-4 text-accent font-bold text-xs whitespace-nowrap">
                          {err.context}
                        </td>
                        <td className="p-4 text-xs font-mono">
                          <div className="text-red-400 mb-1">{err.message}</div>
                          {err.stack && (
                            <div className="text-white/30 text-[10px] w-full overflow-hidden text-ellipsis whitespace-nowrap max-w-xs xl:max-w-md">
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
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
