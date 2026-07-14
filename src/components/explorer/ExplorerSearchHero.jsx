import React from 'react';
import PropTypes from 'prop-types';
import { Search, Loader2 } from 'lucide-react';

/**
 * ExplorerSearchHero — Top-of-page search section on the Explorer page.
 * Renders an eyebrow label, large title, subtitle, and a search bar
 * with real-time Stellar address validation and submit/loading states.
 *
 * @param {Object} props
 * @param {string} props.searchQuery - Current search input value.
 * @param {Function} props.setSearchQuery - Setter for the search input.
 * @param {boolean} props.isValidAddress - Whether the input is a valid Stellar address.
 * @param {boolean} props.loading - Whether a search is in progress.
 * @param {Function} props.handleSearch - Form submit handler.
 * @param {string} props.placeholderText - Placeholder text for the search input.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The ExplorerSearchHero component.
 */
const ExplorerSearchHero = ({ searchQuery, setSearchQuery, isValidAddress, loading, handleSearch, placeholderText, t }) => (
  <>
    {/* Eyebrow with lines */}
    <div className="ex-anim tc-separator tc-flex-center tc-mb-md" style={{ maxWidth: '680px', animationDelay: '0s' }}>
      <div className="tc-separator-line" role="separator" />
      <span className="font-inter tc-eyebrow" style={{ whiteSpace: 'nowrap' }}>
        {t('explorer.eyebrow')}
      </span>
      <div className="tc-separator-line" role="separator" />
    </div>

    {/* Title */}
    <h1 className="ex-anim font-clash tc-fw-black tc-text-white tc-mb-lg" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', textAlign: 'center', letterSpacing: '-2px', lineHeight: '1', animationDelay: '0.08s' }}>
      <span className="text-gradient">{t('explorer.title')}</span>
    </h1>

    {/* Subtitle */}
    <p className="ex-anim font-inter tc-body tc-mb-2xl" style={{ textAlign: 'center', maxWidth: '420px', animationDelay: '0.14s' }}>
      {t('explorer.subtitle')}
    </p>

    {/* Search Bar */}
    <div className="ex-anim tc-mb-4xl" style={{ width: '100%', maxWidth: '680px', animationDelay: '0.22s', animationDuration: '0.45s' }}>
      <form onSubmit={handleSearch} role="search" aria-label={t('explorer.searchLabel', 'Search for worker credentials')}>
        <div className="glass-card" style={{ display: 'flex', gap: '0', padding: 0, overflow: 'hidden' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
            <Search className="tc-icon-lg tc-icon-dimmer" style={{ flexShrink: 0, marginRight: '10px' }} aria-hidden="true" />
            <input
              type="text"
              placeholder={placeholderText}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ex-search-input"
              aria-label={t('explorer.searchInputLabel', 'Enter Stellar wallet address')}
              aria-invalid={!isValidAddress && searchQuery.trim().length > 0}
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
            className="btn-glow font-inter"
            aria-label={t('explorer.searchBtnLabel', 'Search credentials')}
            style={{
              padding: '18px 32px', borderRadius: 0,
              cursor: (!searchQuery.trim() || !isValidAddress) ? 'not-allowed' : 'pointer',
              opacity: (!searchQuery.trim() || !isValidAddress) ? 0.4 : 1,
              flexShrink: 0,
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-label={t('explorer.searching', 'Searching')} /> : t('explorer.searchBtnShort')}
          </button>
        </div>
      </form>
      {!isValidAddress && searchQuery.trim().length > 0 && (
        <p className="font-inter tc-form-error tc-ls-wide" role="alert" style={{ marginTop: '12px', textAlign: 'left' }}>
          ⚠ {t('explorer.validationWarning')}
        </p>
      )}
    </div>
  </>
);

ExplorerSearchHero.propTypes = {
  /** Current search input value (Stellar address). */
  searchQuery: PropTypes.string.isRequired,
  /** Setter callback for the search input value. */
  setSearchQuery: PropTypes.func.isRequired,
  /** Whether the current input is a valid Stellar public key. */
  isValidAddress: PropTypes.bool.isRequired,
  /** Whether a search query is currently in progress. */
  loading: PropTypes.bool.isRequired,
  /** Form submit handler for triggering the search. */
  handleSearch: PropTypes.func.isRequired,
  /** Placeholder text for the search input field. */
  placeholderText: PropTypes.string.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default ExplorerSearchHero;
