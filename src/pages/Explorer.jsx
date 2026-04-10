import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Database, Hash, Clock, ExternalLink } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0a0a0f] pt-28 pb-12 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-accent/5 blur-[200px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(124,58,237,0.2)]"
          >
            <Database className="w-8 h-8 text-accent" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-purple-400 via-accent to-cyan-400 bg-clip-text text-transparent"
          >
            Credential Explorer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white/40 text-sm md:text-base max-w-xl mx-auto font-medium"
          >
            Search the decentralized index for on-chain TrustChain events and verifiable credentials.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 max-w-2xl mx-auto flex flex-col"
        >
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50" />
            <div className={`relative flex items-center bg-white/5 backdrop-blur-xl border ${!isValidAddress && searchQuery.trim().length > 0 ? 'border-red-500/50' : 'border-white/10'} rounded-2xl overflow-hidden focus-within:border-accent/50 transition-colors`}>
              <div className="pl-6 pr-2">
                <Search className={`w-5 h-5 ${!isValidAddress && searchQuery.trim().length > 0 ? 'text-red-400/50' : 'text-white/50'}`} />
              </div>
              <input
                type="text"
                placeholder="Enter Stellar Wallet Address (e.g., G...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-5 px-2 text-sm font-mono text-white placeholder-white/30 outline-none"
              />
              <div className="pr-3">
                <button 
                  type="submit"
                  disabled={loading || !searchQuery.trim() || !isValidAddress}
                  className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
              </div>
            </div>
          </form>
          {/* Validation error text */}
          {!isValidAddress && searchQuery.trim().length > 0 && (
            <p className="text-red-400 text-sm mt-1 ml-2">Please enter a valid Stellar wallet address (Starts with G, 56 characters).</p>
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
      </div>
    </div>
  );
};

export default Explorer;
