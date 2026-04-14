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
    // Re-validate on change but don't show error until they type something
    if (searchQuery.trim().length > 0) {
      setIsValidAddress(validateWalletAddress(searchQuery.trim()));
    } else {
      setIsValidAddress(true); // default true when empty so error isn't screaming immediately
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
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 sm:px-6 relative overflow-hidden text-white">
      {/* Background — consistent with other pages */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-0 w-[700px] h-[500px] bg-accent/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
            backgroundSize: '70px 70px',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header — consistent compact style */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-5 rounded-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(15,15,25,0.7) 50%, rgba(99,40,210,0.06) 100%)',
            border: '1px solid rgba(124,58,237,0.12)',
          }}
        >
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-accent/12 rounded-full blur-[60px]" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-800 flex items-center justify-center shadow-lg shadow-accent/20">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">Credential Explorer</h1>
                <p className="text-white/30 text-[10px] font-semibold hidden sm:block">Search on-chain TrustChain events</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/8 border border-accent/12 rounded-lg">
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="text-[9px] font-black uppercase tracking-wider text-accent">Horizon Indexer</span>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className={`flex items-center bg-white/[0.03] border ${!isValidAddress && searchQuery.trim().length > 0 ? 'border-red-500/30' : 'border-white/[0.06]'} rounded-2xl overflow-hidden focus-within:border-accent/25 transition-all`}>
              <div className="pl-5 pr-2">
                <Search className={`w-4 h-4 ${!isValidAddress && searchQuery.trim().length > 0 ? 'text-red-400/50' : 'text-white/20'}`} />
              </div>
              <input
                type="text"
                placeholder="Enter Stellar Wallet Address (e.g., G...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-4 px-2 text-sm font-mono text-white placeholder-white/15 outline-none"
              />
              <div className="pr-3">
                <button 
                  type="submit"
                  disabled={loading || !searchQuery.trim() || !isValidAddress}
                  className="px-5 py-2.5 bg-gradient-to-r from-accent to-purple-700 hover:from-accent-hover hover:to-purple-800 text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-accent/15 active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
              </div>
            </div>
          </form>
          {/* Validation error text */}
          {!isValidAddress && searchQuery.trim().length > 0 && (
            <p className="text-red-400/80 text-[10px] font-bold mt-2 ml-2 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-red-400" />
              Please enter a valid Stellar wallet address (starts with G, 56 characters)
            </p>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center text-white/40">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-accent" />
                  <p className="font-bold uppercase tracking-widest text-xs">Querying Horizon Indexer...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center text-red-400">
                  <p className="font-bold">{error}</p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-16 text-center">
                  <Database className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/50 font-bold mb-2">No Credentials Found</p>
                  <p className="text-sm text-white/30">We couldn't find any contract interactions for this wallet address.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="p-5 text-xs font-black uppercase tracking-widest text-white/50 whitespace-nowrap">Credential Type</th>
                        <th className="p-5 text-xs font-black uppercase tracking-widest text-white/50 whitespace-nowrap">Issued On</th>
                        <th className="p-5 text-xs font-black uppercase tracking-widest text-white/50 whitespace-nowrap">Tx Hash</th>
                        <th className="p-5 text-xs font-black uppercase tracking-widest text-white/50 whitespace-nowrap">Ledger</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((cred, idx) => (
                        <motion.tr 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={cred.txHash} 
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                                <Database className="w-4 h-4 text-accent" />
                              </div>
                              <span className="font-bold text-sm text-white/90">{cred.credentialType}</span>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                              <Clock className="w-3.5 h-3.5 text-white/30" />
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
                              className="flex items-center gap-2 text-sm font-mono text-purple-400 hover:text-purple-300 transition-colors group"
                            >
                              <Hash className="w-3.5 h-3.5 text-purple-400/50" />
                              {truncate(cred.txHash)}
                              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </td>
                          <td className="p-5">
                            <span className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-white/80">
                              {cred.ledger}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-white/[0.01] text-center border-t border-white/5">
                    <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">
                      Showing {results.length} historical credentials
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-4 text-white/10"
        >
          {[
            { icon: Database, text: 'Horizon Indexer' },
            { icon: ShieldCheck, text: 'On-Chain Data' },
            { icon: Sparkles, text: 'Stellar Testnet' },
          ].map((badge, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-0.5 h-0.5 rounded-full bg-white/6" />}
              <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider">
                <badge.icon className="w-2.5 h-2.5" /> {badge.text}
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Explorer;
