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

  const isValidStellarAddress = (input) => {
    return /^G[A-Z0-9]{55}$/.test(input.trim());
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsValidAddress(isValidStellarAddress(searchQuery));
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

  const placeholderText = t('explorer.searchPlaceholder');
  const truncate = (addr) => (addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : '');

  return (
    <div className="bg-[#050505] relative overflow-hidden text-white" style={{ minHeight: '100vh' }}>
      {/* Light leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', right: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <style>{`
        @keyframes exFadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .ex-anim { opacity:0; animation: exFadeUp 0.4s ease forwards; }
        .ex-search-input { transition: border 0.2s ease; }
        .ex-search-input:focus { border-color: rgba(255,255,255,0.3) !important; outline: none; }
        .ex-search-input::placeholder { color: rgba(255,255,255,0.2); }
        .ex-search-btn { transition: all 0.2s ease; }
        .ex-search-btn:hover:not(:disabled) { background-color: #e8e8e8 !important; }
        .ex-step { transition: all 0.2s ease; position: relative; }
        .ex-step:hover { background-color: rgba(255,255,255,0.04) !important; }
        @keyframes rowFadeIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        .result-row { opacity:0; animation: rowFadeIn 0.4s ease forwards; }
        @keyframes securityPulse { 0%,100% { border-left-color: rgba(0,220,110,0.3); } 50% { border-left-color: rgba(0,220,110,0.7); } }
      `}</style>

      {/* Page Wrapper */}
      <div style={{
        paddingTop: '120px', paddingBottom: '80px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        minHeight: '100vh',
        paddingLeft: '24px', paddingRight: '24px',
        position: 'relative', zIndex: 10
      }}>

        {/* ═══ HERO SECTION ═══ */}

        {/* Eyebrow with lines */}
        <div className="ex-anim" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', width: '100%', maxWidth: '680px', justifyContent: 'center', animationDelay: '0s' }}>
          <div style={{ width: '100%', maxWidth: '120px', height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <span className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            {t('explorer.eyebrow')}
          </span>
          <div style={{ width: '100%', maxWidth: '120px', height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Title */}
        <h1 className="ex-anim font-clash" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: '-2px', lineHeight: '1', marginBottom: '20px', animationDelay: '0.08s' }}>
          {t('explorer.title')}
        </h1>

        {/* Subtitle */}
        <p className="ex-anim font-inter" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', maxWidth: '420px', lineHeight: '1.6', marginBottom: '40px', animationDelay: '0.14s' }}>
          {t('explorer.subtitle')}
        </p>

        {/* ═══ SEARCH BAR ═══ */}
        <div className="ex-anim" style={{ width: '100%', maxWidth: '680px', marginBottom: '80px', animationDelay: '0.22s', animationDuration: '0.45s' }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: 'flex', gap: '0', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
                <Search style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.2)', flexShrink: 0, marginRight: '10px' }} />
                <input
                  type="text"
                  placeholder={placeholderText}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ex-search-input"
                  style={{
                    flex: 1, padding: '18px 0',
                    backgroundColor: 'transparent', border: 'none',
                    color: '#ffffff', fontSize: '14px',
                    fontFamily: 'monospace', outline: 'none',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim() || !isValidAddress}
                className="ex-search-btn font-inter"
                style={{
                  padding: '18px 32px',
                  backgroundColor: '#ffffff', color: '#000000',
                  border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '11px', letterSpacing: '3px', fontWeight: '800',
                  cursor: (!searchQuery.trim() || !isValidAddress) ? 'not-allowed' : 'pointer',
                  opacity: (!searchQuery.trim() || !isValidAddress) ? 0.4 : 1,
                  textTransform: 'uppercase', flexShrink: 0,
                }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('explorer.searchBtnShort')}
              </button>
            </div>
          </form>
          {!isValidAddress && searchQuery.trim().length > 0 && (
            <p className="font-inter" style={{ color: 'rgba(255,80,80,0.8)', fontSize: '12px', letterSpacing: '1px', marginTop: '12px', textAlign: 'left' }}>
              ⚠ {t('explorer.validationWarning')}
            </p>
          )}
        </div>

        {/* ═══ HOW TO VERIFY (pre-search) ═══ */}
        {!hasSearched && (
          <div style={{ width: '100%', maxWidth: '1000px' }}>

            {/* Section label with lines */}
            <div className="ex-anim" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', animationDelay: '0.3s' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
              <span className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.25)', fontWeight: '600', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {t('explorer.howToTitle')}
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* 3 Step Cards — shared borders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', position: 'relative' }}>
              {[
                { step: '01', icon: UserCheck, title: t('explorer.howToStep1Title') || 'Get Worker ID', desc: t('explorer.howToStep1'), delay: '0.35s' },
                { step: '02', icon: FileSearch, title: t('explorer.howToStep2Title') || 'Search', desc: t('explorer.howToStep2'), delay: '0.4s' },
                { step: '03', icon: ShieldCheck, title: t('explorer.howToStep3Title') || 'Verify', desc: t('explorer.howToStep3'), delay: '0.45s' },
              ].map((item, i, arr) => (
                <div key={i} className="ex-anim ex-step" style={{
                  padding: '32px 28px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRight: i < arr.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  animationDelay: item.delay,
                }}>
                  {/* Arrow connector */}
                  {i < arr.length - 1 && (
                    <span style={{ position: 'absolute', right: '-7px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: 'rgba(255,255,255,0.2)', zIndex: 1, pointerEvents: 'none' }}>→</span>
                  )}

                  {/* Icon + Step number */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                    <div style={{ width: '40px', height: '40px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <item.icon style={{ width: '18px', height: '18px', color: 'rgba(255,255,255,0.4)' }} />
                    </div>
                    <span className="font-inter" style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.2)', fontWeight: '600' }}>{t('explorer.step')} {item.step}</span>
                  </div>

                  {/* Title + Description */}
                  <h4 className="font-clash" style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '10px' }}>{item.title}</h4>
                  <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Security Banner */}
            <div className="ex-anim" style={{
              marginTop: '48px', padding: '24px 32px',
              background: 'linear-gradient(135deg, rgba(0,220,110,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(0,220,110,0.15)',
              borderLeft: '3px solid rgba(0,220,110,0.4)',
              display: 'flex', gap: '20px', alignItems: 'center',
              animation: 'securityPulse 3s ease infinite, exFadeUp 0.4s ease forwards',
              animationDelay: '0.5s', opacity: 0,
            }}>
              <ShieldCheck style={{ color: '#00dc6e', width: '24px', height: '24px', flexShrink: 0 }} />
              <div>
                <p className="font-inter" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: '4px' }}>
                  {t('explorer.securityTitle')}
                </p>
                <p className="font-inter" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  {t('explorer.securitySub')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SEARCH RESULTS ═══ */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ width: '100%', maxWidth: '1100px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
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
                  {/* Results Header */}
                  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize:'11px', letterSpacing:'2px', color:'rgba(255,255,255,0.3)', textTransform: 'uppercase' }} className="font-inter">
                      {t('explorer.showing')} {results.length} {t('explorer.credentials')} · <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{truncate(searchQuery)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00dc6e]" />
                      <span style={{ fontSize: '10px', color: 'rgba(0,220,110,0.6)', letterSpacing: '1px', fontWeight: '700' }} className="font-inter">{t('explorer.onChainVerified')}</span>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="w-full min-w-[800px]">
                    {/* Header Row */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr',
                      padding: '12px 20px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      borderBottom: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <div style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', textTransform: 'uppercase' }} className="font-inter">{t('explorer.credentialType')}</div>
                      <div style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', textTransform: 'uppercase' }} className="font-inter">{t('explorer.issuedOn')}</div>
                      <div style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', textTransform: 'uppercase' }} className="font-inter">{t('explorer.txHash')}</div>
                      <div style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', textTransform: 'uppercase' }} className="font-inter">{t('explorer.ledger')}</div>
                    </div>

                    {/* Data Rows */}
                    <div>
                      {results.map((cred, idx) => {
                        const isMultiOp = cred.credentialType === 'Multi-Op Credential';
                        const knownTypes = ['Worker Identity', 'Reputation Score', 'Certification', 'Employment Record', 'Skill Badge', 'Verification', 'Multi-Op Credential'];
                        const isUnknown = !knownTypes.includes(cred.credentialType);

                        return (
                          <div
                            key={cred.txHash}
                            style={{
                              display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr',
                              padding: '16px 20px',
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                              alignItems: 'center',
                              animationDelay: `${idx * 0.04}s`
                            }}
                            className="hover:bg-white/[0.03] transition-all duration-150 group result-row"
                          >
                            <div>
                              <div className="flex items-center">
                                <Database className="w-[14px] h-[14px]" style={{ color: 'rgba(255,255,255,0.2)', marginRight: '10px' }} />
                                <span className="font-inter" style={{
                                  fontSize: '13px', fontWeight: '600',
                                  color: isUnknown ? 'rgba(255,255,255,0.35)' : '#ffffff',
                                  fontStyle: isUnknown ? 'italic' : 'normal'
                                }}>
                                  {cred.credentialType}
                                </span>
                                {isMultiOp && (
                                  <span style={{
                                    fontSize: '9px',
                                    backgroundColor: 'rgba(255,200,50,0.1)',
                                    border: '1px solid rgba(255,200,50,0.2)',
                                    color: 'rgba(255,200,50,0.7)',
                                    padding: '1px 6px', marginLeft: '8px',
                                    fontWeight: '700', letterSpacing: '0.5px'
                                  }} className="font-inter">MULTI-OP</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 font-inter" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                                <Clock className="w-3.5 h-3.5 text-white/20" />
                                {new Date(cred.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <a href={`https://stellar.expert/explorer/testnet/tx/${cred.txHash}`} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-2 hover:text-white transition-colors"
                                  style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>
                                  <Hash className="w-3 h-3 text-white/20" />
                                  {truncate(cred.txHash)}
                                </a>
                                <button
                                  onClick={() => { navigator.clipboard.writeText(cred.txHash); }}
                                  title="Copy Hash"
                                  className="p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <span style={{ fontSize: '12px' }}>📋</span>
                                </button>
                                <a href={`https://stellar.expert/explorer/testnet/tx/${cred.txHash}`} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ExternalLink className="w-3 h-3 text-white/30" />
                                </a>
                              </div>
                            </div>
                            <div>
                              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
                                {cred.ledger}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.2)', fontWeight: '600', textTransform: 'uppercase' }} className="font-inter">
                      {t('explorer.showing')} {results.length} {t('explorer.historicalCredentials')}
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
