import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { fetchCredentialsByWallet } from '../services/indexer';
import { useTranslation } from 'react-i18next';
import ExplorerSearchHero from '../components/explorer/ExplorerSearchHero';
import ExplorerHowTo from '../components/explorer/ExplorerHowTo';
import ExplorerResultsTable from '../components/explorer/ExplorerResultsTable';

/**
 * Explorer — Orchestrator page for searching worker credentials on Stellar.
 * Manages search query state, Stellar address validation, and credential
 * fetching from the indexer service. Delegates rendering to
 * ExplorerSearchHero (search bar), ExplorerHowTo (pre-search guide),
 * and ExplorerResultsTable (search results).
 *
 * @returns {React.ReactElement} The Explorer page.
 */
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

  return (
    <div className="relative overflow-hidden text-white" style={{ minHeight: '100vh' }}>

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

        {/* Search Hero */}
        <ExplorerSearchHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isValidAddress={isValidAddress}
          loading={loading}
          handleSearch={handleSearch}
          placeholderText={placeholderText}
          t={t}
        />

        {/* How To Verify (pre-search) */}
        {!hasSearched && <ExplorerHowTo t={t} />}

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <ExplorerResultsTable
              results={results}
              loading={loading}
              error={error}
              searchQuery={searchQuery}
              t={t}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Explorer;
