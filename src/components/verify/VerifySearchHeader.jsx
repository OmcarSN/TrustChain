import React from 'react';
import { Search, Loader2, Globe, AlertCircle, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import PropTypes from 'prop-types';

/**
 * VerifySearchHeader — Verify page search hero section.
 * Renders an eyebrow badge, page title, subtitle, and a Stellar
 * address search form with loading spinner and error display.
 *
 * @param {Object} props
 * @param {string} props.workerSearch - Current search input value.
 * @param {Function} props.setWorkerSearch - Search input change handler.
 * @param {boolean} props.isSearching - Whether a search is in progress.
 * @param {string|null} props.error - Error message, or null.
 * @param {Function} props.handleSearchSubmit - Form submit handler.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The VerifySearchHeader component.
 */
const VerifySearchHeader = ({ workerSearch, setWorkerSearch, isSearching, error, handleSearchSubmit, t }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center"
    role="search" aria-label={t('verify.searchRegion', 'Verify worker credentials')}
  >
    <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-inter mb-3">
      <Fingerprint className="w-3.5 h-3.5 inline mr-1.5" aria-hidden="true" />{t('verify.onChainBadge')}
    </p>
    <h1 className="font-clash text-4xl md:text-5xl font-bold tracking-tighter mb-3">
      {t('verify.headerTitle')}<br/>
      <span className="text-white/30">{t('verify.headerTitleHighlight')}</span>
    </h1>
    <p className="text-white/25 text-sm max-w-xl mx-auto mb-6 font-inter font-light">{t('verify.headerSubtitle')}</p>

    {/* Search Form */}
    <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto" aria-label={t('verify.searchFormLabel', 'Search by wallet address')}>
      <div className="flex items-center border-b border-white/20 focus-within:border-white/60 transition-colors">
        <Search className="w-5 h-5 text-white/20 mr-3" aria-hidden="true" />
        <input
          type="text"
          placeholder={t('dashboard.searchPlaceholder')}
          value={workerSearch}
          onChange={(e) => setWorkerSearch(e.target.value)}
          aria-label={t('verify.inputLabel', 'Stellar wallet address to verify')}
          className="flex-1 bg-transparent py-4 text-sm font-mono text-white placeholder-white/30 outline-none"
        />
        <button type="submit" disabled={isSearching || !workerSearch}
          aria-label={t('verify.searchBtnLabel', 'Verify credentials on-chain')}
          className="bg-white text-black px-6 py-2.5 rounded-[2px] font-bold text-[11px] uppercase tracking-wider transition-all disabled:opacity-30 hover:opacity-85 flex items-center gap-2 ml-3">
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <><Globe className="w-3.5 h-3.5" aria-hidden="true" /> {t('verify.searchBtn')}</>}
        </button>
      </div>
    </form>

    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          role="alert"
          className="mt-4 text-red-400/80 text-xs flex items-center justify-center gap-2 border border-red-400/20 px-4 py-2.5 rounded-[2px] w-fit mx-auto font-inter">
          <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.section>
);

export default VerifySearchHeader;

VerifySearchHeader.propTypes = {
  /** Current search input value. */
  workerSearch: PropTypes.string.isRequired,
  /** Search input change handler. */
  setWorkerSearch: PropTypes.func.isRequired,
  /** Whether a verification search is in progress. */
  isSearching: PropTypes.bool.isRequired,
  /** Error message from failed search, or null. */
  error: PropTypes.string,
  /** Form submit handler. */
  handleSearchSubmit: PropTypes.func.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};
