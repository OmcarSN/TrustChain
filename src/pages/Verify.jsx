import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchWorkerCredential } from '../lib/stellar';
import { calculateScore } from '../lib/reputation';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { getEndorsements } from '../lib/supabaseData';
import VerifySearchHeader from '../components/verify/VerifySearchHeader';
import VerifyResultsPanel from '../components/verify/VerifyResultsPanel';

/**
 * Verify — Orchestrator page for verifying a worker's on-chain credential.
 * Accepts an address from the URL query string or manual search input,
 * fetches the credential from the Stellar network, computes a reputation
 * score, and displays results. Delegates rendering to VerifySearchHeader
 * (search form) and VerifyResultsPanel (results display).
 *
 * @returns {React.ReactElement} The Verify page.
 */
const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { t } = useTranslation();

  const [workerSearch, setWorkerSearch] = useState(searchParams.get('address') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const performSearch = useCallback(async (address) => {
    if (!address) return;
    setIsSearching(true); setError(null);
    try {
      const credential = await fetchWorkerCredential(address);
      const endorsements = await getEndorsements(address);
      const reputation = calculateScore(endorsements);
      setProfile({ ...credential, address, reputation, endorsements });
      toast.success(t('verify.verifiedResult'));
    } catch (err) {
      setError(err.message || 'Worker not found on-chain');
      toast.error(t('verify.failedResult'));
      setProfile(null);
    } finally { setIsSearching(false); }
  }, [toast, t]);

   
  useEffect(() => {
    if (searchParams.get('address')) performSearch(searchParams.get('address'));
  }, [searchParams, performSearch]);

  const handleSearchSubmit = (e) => { e.preventDefault(); performSearch(workerSearch); };
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/verify?address=${profile.address}`);
    setCopied(true); toast.success(t('verify.copied'));
    setTimeout(() => setCopied(false), 2000);
  };
  const truncAddr = (a) => a ? `${a.slice(0,6)}…${a.slice(-6)}` : '';
  const navigateToEndorse = (address) => navigate(`/endorse?address=${address}`);

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden text-white">
      {/* Background Graphics (Grid & Orbs) */}
      <div className="tc-bg-grid" />
      <div className="tc-orb-blue" />
      <div className="tc-orb-green" />
      
      {/* Atmospheric Light Leaks */}
      <div className="tc-leak-orange" />
      <div className="tc-leak-blue" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Search Header */}
        <VerifySearchHeader
          workerSearch={workerSearch}
          setWorkerSearch={setWorkerSearch}
          isSearching={isSearching}
          error={error}
          handleSearchSubmit={handleSearchSubmit}
          t={t}
        />

        {/* Results Panel */}
        <VerifyResultsPanel
          profile={profile}
          isSearching={isSearching}
          error={error}
          copied={copied}
          handleShare={handleShare}
          navigateToEndorse={navigateToEndorse}
          truncAddr={truncAddr}
          t={t}
        />
      </div>
    </div>
  );
};

export default Verify;
