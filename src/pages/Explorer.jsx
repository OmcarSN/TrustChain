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

  const placeholderText = "Enter Stellar wallet address (G...)";

  const truncate = (addr) => (addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : '');

  return (
    <div className="bg-[#050505] pb-12 relative overflow-hidden text-white" style={{ minHeight: '100vh' }}>
      {/* Light leaks */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: '-80px', right: '-80px', width: '400px', height: '400px', background: '#f97316', filter: 'blur(120px)', opacity: 0.04 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: '#1e3a8a', filter: 'blur(120px)', opacity: 0.05 }} />

      <div className="relative z-10">
        <style>{`
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          .cursor { animation: blink 1s ease infinite; color: rgba(255,255,255,0.4); }
          
          @keyframes titleShimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .explorer-title {
            background: linear-gradient(90deg, #fff 35%, #888 45%, #fff 55%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: titleShimmer 4s linear infinite;
          }

          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-entry {
            opacity: 0;
            animation: fadeSlideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }

          .prominent-search {
            width: 100%;
            padding: 20px 28px;
            font-size: 15px;
            background-color: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.15);
            color: #ffffff;
            outline: none;
            border-radius: 0;
            transition: all 0.3s ease;
          }
          @keyframes borderGlow {
            0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.15); }
            50% { box-shadow: 0 0 20px rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.3); }
          }
          .prominent-search:focus {
            border: 1px solid rgba(255,255,255,0.4);
            animation: borderGlow 2s ease infinite;
          }
          .step-card {
            padding: 28px;
            border: 1px solid rgba(255,255,255,0.08);
            background-color: rgba(255,255,255,0.02);
            border-radius: 0;
            transition: all 0.3s ease;
          }
          .step-card:hover {
            border: 1px solid rgba(255,255,255,0.2);
            background-color: rgba(255,255,255,0.04);
            transform: translateY(-3px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.4);
          }
          .step-icon-box {
            transition: all 0.3s ease;
          }
          .step-card:hover .step-icon-box {
            transform: rotate(8deg) scale(1.1);
            border-color: rgba(255,255,255,0.3);
            color: rgba(255,255,255,0.8);
          }
          @keyframes securityPulse {
            0%, 100% { border-left-color: rgba(0,220,110,0.3); }
            50% { border-left-color: rgba(0,220,110,0.7); }
          }
          .security-banner {
            margin-top: 48px;
            padding: 24px 32px;
            background: linear-gradient(135deg, rgba(0,220,110,0.05) 0%, rgba(255,255,255,0.02) 100%);
            border: 1px solid rgba(0,220,110,0.15);
            border-left: 3px solid rgba(0,220,110,0.4);
            display: flex;
            gap: 20px;
            align-items: center;
            animation: securityPulse 3s ease infinite;
          }

          @keyframes rowFadeIn {
            from { opacity: 0; transform: translateX(-8px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .result-row {
            opacity: 0;
            animation: rowFadeIn 0.4s ease forwards;
          }
        `}</style>

        {/* Hero Header Section */}
        <div style={{ 
          minHeight: '60vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          textAlign: 'center',
          paddingTop: '88px',
          paddingBottom: '32px',
          paddingLeft: '24px',
          paddingRight: '24px'
        }}>
          <div className="animate-entry" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            justifyContent: 'center',
            marginBottom: '8px',
            animationDelay: '0s'
          }}>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <span className="font-inter" style={{ 
              fontSize: '11px', 
              letterSpacing: '6px', 
              color: 'rgba(255,255,255,0.3)', 
              fontWeight: '500',
              textTransform: 'uppercase'
            }}>
              VERIFY ANY WORKER
            </span>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
          </div>
          <h1 className="font-clash explorer-title animate-entry" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', marginBottom: '16px', animationDelay: '0.1s', letterSpacing: '-0.02em' }}>
            Explorer
          </h1>
          <p className="font-inter animate-entry" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px', animationDelay: '0.2s', maxWidth: '600px' }}>
            Enter a valid Stellar wallet address to verify on-chain credentials
          </p>

          {/* Search Bar Wrapper */}
          <div className="animate-entry" style={{ maxWidth: '680px', width: '100%', margin: '32px auto 0 auto', paddingBottom: '16px', animationDelay: '0.3s' }}>
            <form onSubmit={handleSearch} className="w-full">
              <div style={{ display: 'flex', width: '100%', gap: '0', height: '56px' }}>
                <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                  <input
                    type="text"
                    placeholder={placeholderText}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="prominent-search"
                    style={{
                      height: '100%',
                      paddingRight: '48px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      boxShadow: (isValidAddress && searchQuery.trim().length === 56) ? '0 0 16px rgba(0,220,110,0.1)' : '',
                      borderColor: (isValidAddress && searchQuery.trim().length === 56) ? 'rgba(0,220,110,0.3)' : 'rgba(255,255,255,0.15)',
                      borderRight: 'none',
                      backgroundColor: '#0d0d0d'
                    }}
                  />
                  <Search style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'rgba(255,255,255,0.3)', 
                    width: '18px', 
                    height: '18px',
                    pointerEvents: 'none'
                  }} />
                </div>
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim() || !isValidAddress}
                  style={{ 
                    height: '100%',
                    padding: '0 28px',
                    backgroundColor: '#ffffff', 
                    color: '#000000', 
                    fontWeight: '800', 
                    fontSize: '12px', 
                    letterSpacing: '2px', 
                    border: 'none', 
                    cursor: (!searchQuery.trim() || !isValidAddress) ? 'not-allowed' : 'pointer', 
                    borderRadius: '0', 
                    transition: 'all 0.2s ease',
                    opacity: (!searchQuery.trim() || !isValidAddress) ? 0.4 : 1,
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}
                  className="uppercase flex items-center justify-center font-inter hover:bg-[#dcdcdc]"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SEARCH'}
                </button>
              </div>
            </form>
            {!isValidAddress && searchQuery.trim().length > 0 && (
              <p style={{
                color: 'rgba(255,80,80,0.8)',
                fontSize: '12px',
                letterSpacing: '1px',
                marginTop: '12px',
                textAlign: 'left'
              }} className="font-inter">
                ⚠ Please enter a valid Stellar wallet address (starts with G, 56 characters)
              </p>
            )}
          </div>
        </div>

        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto', 
          paddingLeft: '24px', 
          paddingRight: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px'
        }}>
          {/* How-to cards (before search) */}
          {!hasSearched && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '48px', paddingBottom: '80px' }}>
              <div className="animate-entry" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '48px', marginBottom: '32px', animationDelay: '0.4s' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                <h3 style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', whiteSpace: 'nowrap' }} className="font-inter">
                  HOW TO VERIFY A WORKER
                </h3>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
              </div>
              <div className="relative" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {/* Connector Arrows (Desktop) */}
                <div className="hidden md:flex absolute top-1/2 left-[33.33%] -translate-x-1/2 -translate-y-1/2 z-20 text-white/10 text-2xl animate-entry" style={{ animationDelay: '0.55s' }}>→</div>
                <div className="hidden md:flex absolute top-1/2 left-[66.66%] -translate-x-1/2 -translate-y-1/2 z-20 text-white/10 text-2xl animate-entry" style={{ animationDelay: '0.65s' }}>→</div>

                {[
                  { step: '01', icon: UserCheck, title: t('explorer.howToStep1Title') || 'Get Worker ID', desc: t('explorer.howToStep1'), delay: '0.5s' },
                  { step: '02', icon: FileSearch, title: t('explorer.howToStep2Title') || 'Search', desc: t('explorer.howToStep2'), delay: '0.6s' },
                  { step: '03', icon: ShieldCheck, title: t('explorer.howToStep3Title') || 'Verify', desc: t('explorer.howToStep3'), delay: '0.7s' },
                ].map((item, i) => (
                  <div key={i} className="step-card animate-entry" style={{ 
                    animationDelay: item.delay, 
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderTop: '2px solid rgba(255,255,255,0.2)' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="step-icon-box" style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.2)', fontWeight: '600' }} className="font-inter">STEP {item.step}</span>
                    </div>
                    <h4 className="font-clash" style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px', color: '#ffffff' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.7' }} className="font-inter">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Info Banner */}
              <div className="security-banner animate-entry" style={{ animationDelay: '0.8s' }}>
                <ShieldCheck style={{ color: '#00dc6e', width: '24px', height: '24px' }} />
                <div className="flex flex-col gap-1">
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }} className="font-inter">
                    All credentials are stored on-chain via Stellar Soroban
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase' }} className="font-inter">
                    Tamper-proof · Permanent · Verifiable by anyone
                  </p>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {hasSearched && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                style={{ marginTop: '40px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0' }}
                className="rounded-[2px] overflow-hidden mb-24">
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
                        SHOWING {results.length} CREDENTIALS · <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{truncate(searchQuery)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00dc6e]" />
                        <span style={{ fontSize: '10px', color: 'rgba(0,220,110,0.6)', letterSpacing: '1px', fontWeight: '700' }} className="font-inter">ON-CHAIN VERIFIED</span>
                      </div>
                    </div>

                    {/* Custom Table with Grid Layout */}
                    <div className="w-full min-w-[800px]">
                      {/* Header Row */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '2fr 2fr 2fr 1fr',
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
                                display: 'grid', 
                                gridTemplateColumns: '2fr 2fr 2fr 1fr',
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
                                    fontSize: '13px', 
                                    fontWeight: '600', 
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
                                      padding: '1px 6px', 
                                      marginLeft: '8px',
                                      fontWeight: '700',
                                      letterSpacing: '0.5px'
                                    }} className="font-inter">
                                      MULTI-OP
                                    </span>
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
                                    className="flex items-center gap-2 text-[#ffffff] hover:text-[#ffffff] transition-colors"
                                    style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>
                                    <Hash className="w-3 h-3 text-white/20" />
                                    {truncate(cred.txHash)}
                                  </a>
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(cred.txHash);
                                      // Optional: add a toast or small tooltip here if needed
                                    }}
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
                    <div style={{ 
                      padding: '16px', 
                      textAlign: 'center', 
                      borderTop: '1px solid rgba(255,255,255,0.06)' 
                    }}>
                      <p style={{ 
                        fontSize: '10px', 
                        letterSpacing: '3px', 
                        color: 'rgba(255,255,255,0.2)',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }} className="font-inter">
                        SHOWING {results.length} HISTORICAL CREDENTIALS
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
