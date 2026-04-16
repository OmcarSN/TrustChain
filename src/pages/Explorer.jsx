import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Database, Hash, Clock, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { fetchCredentialsByWallet } from '../services/indexer';
import { validateWalletAddress } from '../utils/validation';

const Explorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsValidAddress(validateWalletAddress(searchQuery.trim()));
    } else {
      setIsValidAddress(true);
    }
  }, [searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !isValidAddress) return;

    setLoading(true);
    setHasSearched(true);
    setError('');
    
    try {
      const credentials = await fetchCredentialsByWallet(searchQuery.trim());
      setResults(credentials);
    } catch (err) {
      setError('Failed to fetch data from the Horizon indexer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const truncate = (addr) => (addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : '');

  return (
    <div className="min-h-screen bg-background pt-[100px] pb-8 px-4 sm:px-6 relative overflow-hidden text-gray-900">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* ── Header Banner ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-6 p-6 rounded-[20px] shadow-sm"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#EFF6FF] border border-[#DBEAFE]"
              >
                <Database className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <h1
                  className="text-[28px] text-gray-900"
                  style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500, letterSpacing: '-0.02em' }}
                >
                  Credential Explorer
                </h1>
                <p className="text-sm hidden sm:block font-medium text-gray-500">
                  Search on-chain TrustChain events
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0F9FF] border border-[#E0F2FE]"
            >
              <Sparkles className="w-3 h-3 text-[#0284C7]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#0284C7]">Horizon Indexer</span>
            </div>
          </div>
        </motion.div>

        {/* ── Search Input ────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-6"
        >
          <form onSubmit={handleSearch} className="relative shadow-lg rounded-xl">
            <div
              className="flex items-center rounded-xl overflow-hidden transition-all bg-[#FFFFFF]"
              style={{
                border: `2px solid ${!isValidAddress && searchQuery.trim().length > 0 ? '#F87171' : '#E5E7EB'}`,
              }}
            >
              <div className="pl-5 pr-2">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter Stellar Wallet Address (e.g., G...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-4 px-2 text-sm text-gray-900 outline-none placeholder-gray-400 font-bold"
                style={{
                  fontFamily: 'monospace',
                }}
                onFocus={e => {
                  e.target.closest('div[class]').style.borderColor = '#1E3A8A';
                  e.target.closest('div[class]').style.boxShadow = '0 0 0 3px #EFF6FF';
                }}
                onBlur={e => {
                  e.target.closest('div[class]').style.borderColor = !isValidAddress && searchQuery.trim().length > 0 ? '#F87171' : '#E5E7EB';
                  e.target.closest('div[class]').style.boxShadow = 'none';
                }}
              />
              <div className="pr-3">
                <button 
                  type="submit"
                  disabled={loading || !searchQuery.trim() || !isValidAddress}
                  className="transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                >
                  <div className="shiny-border">
                    <div
                      className="shiny-border-inner relative z-20 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </form>
          {!isValidAddress && searchQuery.trim().length > 0 && (
            <p className="text-[10px] mt-2 ml-2 flex items-center gap-1.5 text-red-500 font-bold">
              <span className="w-1 h-1 rounded-full bg-red-500" />
              Please enter a valid Stellar wallet address (starts with G, 56 characters)
            </p>
          )}
        </motion.div>

        {/* ── Results ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-[20px] overflow-hidden shadow-lg bg-[#FFFFFF] border border-[#E5E7EB]"
            >
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#1E3A8A]" />
                  <p className="label-mono font-bold text-gray-500">Querying Horizon Indexer...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center text-red-500">
                  <p className="font-bold">{error}</p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-16 text-center">
                  <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-bold mb-2 text-gray-600">No Credentials Found</p>
                  <p className="text-sm font-medium text-gray-400">We couldn't find any contract interactions for this wallet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                        <th className="p-5 label-mono whitespace-nowrap font-bold text-gray-600">Credential Type</th>
                        <th className="p-5 label-mono whitespace-nowrap font-bold text-gray-600">Issued On</th>
                        <th className="p-5 label-mono whitespace-nowrap font-bold text-gray-600">Tx Hash</th>
                        <th className="p-5 label-mono whitespace-nowrap font-bold text-gray-600">Ledger</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((cred, idx) => (
                        <motion.tr 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
                          key={cred.txHash} 
                          className="hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]"
                        >
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#EFF6FF] border border-[#DBEAFE]"
                              >
                                <Database className="w-4 h-4 text-[#1E3A8A]" />
                              </div>
                              <span className="font-bold text-sm text-gray-900">{cred.credentialType}</span>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {new Date(cred.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td className="p-5">
                            <a 
                              href={`https://stellar.expert/explorer/testnet/tx/${cred.txHash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm font-mono font-bold transition-colors group text-[#0284C7] hover:text-[#EA580C]"
                            >
                              <Hash className="w-3.5 h-3.5 opacity-50" />
                              {truncate(cred.txHash)}
                              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </td>
                          <td className="p-5">
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#F9FAFB] border border-[#E5E7EB] text-gray-600"
                            >
                              {cred.ledger}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 text-center border-t border-[#E5E7EB]">
                    <p className="label-mono font-bold text-gray-500">Showing {results.length} historical credentials</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Feature Pills ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          {[
            { icon: Database, text: 'Horizon Indexer', color: '#1E3A8A' },
            { icon: ShieldCheck, text: 'On-Chain Data', color: '#0284C7' },
            { icon: Sparkles, text: 'Stellar Testnet', color: '#10B981' },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-bold"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                color: '#6B7280',
              }}
            >
              <badge.icon className="w-3 h-3" style={{ color: badge.color }} />
              {badge.text}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Explorer;
