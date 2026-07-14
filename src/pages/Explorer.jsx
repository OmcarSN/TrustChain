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
    <div className="relative overflow-hidden text-white" style={{ minHeight: '100vh', background: '#050505' }}>
      {/* Background Decorations */}
      <div className="tc-bg-grid" />
      <div className="tc-orb-green" />
      <div className="tc-leak-blue" />

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
