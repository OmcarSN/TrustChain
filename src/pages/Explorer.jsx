import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Database, Hash, Clock, ExternalLink, UserCheck, FileSearch, ShieldCheck } from 'lucide-react';
import { fetchCredentialsByWallet } from '../services/indexer';
import { validateWalletAddress } from '../utils/validation';
import { useTranslation } from 'react-i18next';

const Explorer = () => {
  const { t } = useTranslation();
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
      setError(t('explorer.validationError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const truncate = (addr) => (addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : '');

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
      {/* Light leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', right: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center reveal">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-inter mb-3">
            {t('explorer.subHeader', 'Search Stellar Testnet for on-chain credentials')}
          </p>
          <h1 className="font-clash text-4xl md:text-5xl font-bold tracking-tighter text-white">
            {t('explorer.header', 'Credential Explorer')}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto reveal reveal-d1">
          <form onSubmit={handleSearch} className="relative">
            <div className={`flex items-center border-b ${!isValidAddress && searchQuery.trim().length > 0 ? 'border-red-400/50' : 'border-white/20'} focus-within:border-white/60 transition-colors`}>
              <Search className={`w-5 h-5 mr-3 ${!isValidAddress && searchQuery.trim().length > 0 ? 'text-red-400/50' : 'text-white/30'}`} />
              <input
                type="text"
                placeholder={t('explorer.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent py-4 text-sm font-mono text-white placeholder-white/30 outline-none"
              />
              <button
                type="submit"
                disabled={loading || !searchQuery.trim() || !isValidAddress}
                className="bg-white text-black px-6 py-2.5 rounded-[2px] font-bold text-[11px] uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-85 flex items-center gap-2 ml-3"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('explorer.searchBtnShort', 'Search')}
              </button>
            </div>
          </form>
          {!isValidAddress && searchQuery.trim().length > 0 && (
            <p className="text-red-400/70 text-xs mt-2 font-inter">{t('explorer.validationError')}</p>
          )}
        </div>

        {/* How-to cards (before search) */}
        {!hasSearched && (
          <div className="max-w-3xl mx-auto reveal reveal-d2">
            <div className="text-center mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 font-inter">{t('explorer.howToTitle')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
              {[
                { step: '01', icon: UserCheck, title: t('explorer.howToStep1Title') || 'Get Worker ID', desc: t('explorer.howToStep1') },
                { step: '02', icon: FileSearch, title: t('explorer.howToStep2Title') || 'Search', desc: t('explorer.howToStep2') },
                { step: '03', icon: ShieldCheck, title: t('explorer.howToStep3Title') || 'Verify', desc: t('explorer.howToStep3') },
              ].map((item, i) => (
                <div key={i} className="bg-[#050505] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-white/40" />
                    </div>
                    <span className="text-[10px] font-bold text-white/10 tracking-wider font-inter">{item.step}</span>
                  </div>
                  <h4 className="text-xs font-bold mb-1.5 text-white/60 font-inter">{item.title}</h4>
                  <p className="text-[11px] text-white/25 leading-relaxed font-inter">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-white/[0.07] rounded-[2px] overflow-hidden">
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center text-white/40">
                  <Loader2 className="w-6 h-6 animate-spin mb-4 text-white/50" />
                  <p className="font-bold uppercase tracking-widest text-xs font-inter">{t('explorer.queryingHorizon')}</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center text-red-400/70"><p className="font-bold font-inter">{error}</p></div>
              ) : results.length === 0 ? (
                <div className="p-16 text-center">
                  <Database className="w-10 h-10 text-white/10 mx-auto mb-4" />
                  <p className="text-white/50 font-bold mb-2 font-inter">{t('explorer.noWorkers')}</p>
                  <p className="text-sm text-white/25 font-inter">{t('explorer.noWorkersSub')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-white/40 font-inter whitespace-nowrap">{t('explorer.credentialType')}</th>
                        <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-white/40 font-inter whitespace-nowrap">{t('explorer.issuedOn')}</th>
                        <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-white/40 font-inter whitespace-nowrap">{t('explorer.txHash')}</th>
                        <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-white/40 font-inter whitespace-nowrap">{t('explorer.ledger')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((cred, idx) => (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          key={cred.txHash}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center">
                                <Database className="w-3.5 h-3.5 text-white/40" />
                              </div>
                              <span className="font-bold text-sm text-white/80 font-inter">{cred.credentialType}</span>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-2 text-white/50 text-sm font-inter">
                              <Clock className="w-3.5 h-3.5 text-white/25" />
                              {new Date(cred.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="p-5">
                            <a href={`https://stellar.expert/explorer/testnet/tx/${cred.txHash}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm font-mono text-white/50 hover:text-white transition-colors group">
                              <Hash className="w-3.5 h-3.5 text-white/30" />
                              {truncate(cred.txHash)}
                              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </td>
                          <td className="p-5">
                            <span className="inline-flex items-center px-3 py-1 bg-white/[0.03] border border-white/[0.06] rounded-[2px] text-xs font-mono text-white/60">{cred.ledger}</span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 text-center border-t border-white/5">
                    <p className="text-[10px] uppercase font-bold text-white/25 tracking-widest font-inter">
                      Showing {results.length} {t('explorer.showingResults', { count: results.length }).split(' ').slice(1).join(' ')}
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
