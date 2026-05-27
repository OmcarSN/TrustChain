import React from 'react';
import { NETWORK } from '../../lib/networkConfig';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, User, AlertCircle, Loader2
} from 'lucide-react';

/**
 * WorkerSearchPanel — Left panel of the Endorse page.
 * Displays the search input, find worker button, worker card result,
 * and a "why this matters" info section with on-chain status badge.
 * Extracted from Endorse.jsx for modularity.
 *
 * @param {Object} props
 * @param {string} props.workerSearch - Current search input value (Stellar address).
 * @param {Function} props.setWorkerSearch - Setter for search input.
 * @param {Function} props.handleSearch - Triggers worker lookup on Stellar.
 * @param {boolean} props.isSearching - Whether a search is in progress.
 * @param {Object|null} props.foundWorker - Resolved worker object, or null.
 * @param {string} props.foundWorker.name - Worker's name.
 * @param {string} props.foundWorker.skill - Skill category.
 * @param {string} props.foundWorker.city - City of residence.
 * @param {string|null} props.error - Error message from search, or null.
 * @param {Object} props.labelStyle - Shared label style object from parent.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The WorkerSearchPanel component.
 */
const WorkerSearchPanel = ({
  workerSearch, setWorkerSearch, handleSearch, isSearching, foundWorker,
  error, labelStyle, t
}) => (
  <div className="tc-p-lg tc-flex-col" style={{ gap: '18px' }}>
    {/* Panel header */}
    <div style={{ ...labelStyle, marginBottom: '0' }}>
      <Search className="tc-icon-sm tc-icon-dim" />
      {t('endorse.findWorkerLabel')}
    </div>

    {/* Search input */}
    <input
      type="text" placeholder={t('endorse.searchPlaceholder')} value={workerSearch}
      onChange={(e) => setWorkerSearch(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      className="end-input font-inter w-full px-4 py-3 text-sm" style={{ outline: 'none' }}
      aria-label={t('endorse.searchPlaceholder')}
    />

    {/* Find Worker button */}
    <button onClick={handleSearch} disabled={isSearching || !workerSearch} className="end-find-btn font-inter tc-btn-primary"
      aria-label={t('endorse.findWorkerLabel')}
      style={{ cursor: !workerSearch ? 'not-allowed' : 'pointer', opacity: !workerSearch ? 0.4 : 1, borderRadius: '8px', padding: '12px 16px', fontSize: '11px', letterSpacing: '2px' }}>
      {isSearching ? <Loader2 className="tc-icon-md" className="animate-spin" /> : <><Search className="tc-icon-sm" /> {t('endorse.findWorkerLabel')}</>}
    </button>

    {error && (
      <p className="font-inter tc-form-error tc-flex" style={{ alignItems: 'center', gap: '6px' }}>
        <AlertCircle className="tc-icon-sm" style={{ flexShrink: 0 }} /> {error}
      </p>
    )}

    {/* Worker card or empty state */}
    <AnimatePresence mode="wait">
      {foundWorker ? (
        <motion.div key="found" className="worker-card-anim" exit={{ opacity: 0 }}
          style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
          <div className="tc-flex tc-flex-gap-sm tc-mb-sm" style={{ alignItems: 'center' }}>
            <div className="tc-activity-icon" style={{ width: '40px', height: '40px', borderRadius: '8px' }}>
              <User className="tc-icon-lg tc-icon-dim" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="tc-text-white tc-text-md tc-fw-bold tc-mb-xs">{foundWorker.name}</p>
              <p className="font-inter tc-text-dim tc-text-sm">{foundWorker.skill} · {foundWorker.city}</p>
            </div>
          </div>
          <span className="font-inter pulse-glow tc-verified-badge" style={{ borderRadius: '6px', display: 'inline-block' }}>● {t('discover.verified')}</span>
          
          {/* Divider */}
          <div className="tc-divider-light" style={{ margin: '16px 0' }} />

          {/* Why endorse section */}
          <div style={{ padding: '0 4px' }}>
            <p className="font-inter tc-label tc-mb-sm">WHY THIS MATTERS</p>

            {/* 3 info points */}
            <div className="tc-flex tc-flex-gap" style={{ flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', text: 'Stellar' },
              { icon: '✓',  text: 'Tamper-proof' },
              { icon: '⚡', text: 'Gasless' },
            ].map((item, i) => (
              <div key={i} className="tc-flex tc-flex-gap-sm" style={{ alignItems: 'center' }}>
                <span className="tc-text-xs" style={{ flexShrink: 0 }}>{item.icon}</span>
                <span className="font-inter tc-text-dim tc-text-xs" style={{ letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{item.text}</span>
              </div>
            ))}
            </div>

            {/* Divider */}
            <div className="tc-divider-light" style={{ margin: '16px 0' }} />

            {/* On-chain badge */}
            <div className="tc-flex tc-flex-gap-sm tc-onchain-badge" style={{ alignItems: 'center' }}>
              <div className="tc-dot-sm" style={{
                boxShadow: '0 0 6px rgba(0,220,110,0.6)',
                animation: 'verifiedPulse 2s ease infinite',
              }} />
              <span className="font-inter tc-text-accent tc-text-xs tc-fw-bold" style={{ letterSpacing: '1.5px', opacity: 0.7 }}>
                STELLAR {NETWORK.toUpperCase()} ACTIVE
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="tc-flex-center tc-flex-col" style={{ flex: 1, padding: '32px 0' }}>
          <div className="tc-activity-icon tc-mb-sm" style={{ width: '56px', height: '56px', borderRadius: '10px' }}>
            <User className="tc-icon-2xl tc-icon-dimmer" />
          </div>
          <p className="font-inter tc-label">{t('endorse.noWorkerSelected')}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

WorkerSearchPanel.propTypes = {
  /** Current search input value (Stellar public key). */
  workerSearch: PropTypes.string.isRequired,
  /** Setter for the search input value. */
  setWorkerSearch: PropTypes.func.isRequired,
  /** Triggers worker credential lookup on Stellar. */
  handleSearch: PropTypes.func.isRequired,
  /** Whether a search request is currently in progress. */
  isSearching: PropTypes.bool.isRequired,
  /** Resolved worker credential object, or null if not found. */
  foundWorker: PropTypes.shape({
    name: PropTypes.string,
    skill: PropTypes.string,
    city: PropTypes.string,
  }),
  /** Error message from the search, or null. */
  error: PropTypes.string,
  /** Shared label style object from parent Endorse page. */
  labelStyle: PropTypes.object.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

WorkerSearchPanel.defaultProps = {
  foundWorker: null,
  error: null,
};

export default WorkerSearchPanel;
