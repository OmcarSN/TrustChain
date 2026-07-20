import React from 'react';
import { explorerTxUrl } from '../../lib/networkConfig';
import { Loader2, Database, Hash, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

import PropTypes from 'prop-types';

/**
 * ExplorerResultsTable — Credential search results display.
 * Handles loading, empty, error, and data states with a tabular layout
 * showing credential type, timestamp, transaction hash with explorer links,
 * and ledger number. Supports copy-to-clipboard for tx hashes.
 *
 * @param {Object} props
 * @param {Array<Object>} props.results - Array of credential result objects.
 * @param {boolean} props.loading - Whether the search query is in progress.
 * @param {string|null} props.error - Error message string, or null if no error.
 * @param {string} props.searchQuery - The Stellar address being searched.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The ExplorerResultsTable component.
 */
const ExplorerResultsTable = ({ results, loading, error, searchQuery, t }) => {
  const truncate = (addr) => (addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : '');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card tc-mb-lg" style={{ width: '100%', maxWidth: '1100px', padding: '0', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 80px rgba(79,107,237,0.04)' }}
      role="region"
      aria-label={t('explorer.resultsRegion', 'Search results')}
    >
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center" role="status" aria-label={t('explorer.queryingHorizon')} style={{ padding: '64px 16px' }}>
          <Loader2 className="w-6 h-6 animate-spin mb-4" style={{ color: '#7C93F2' }} aria-hidden="true" />
          <p className="font-bold uppercase tracking-widest text-xs font-inter" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '3px' }}>{t('explorer.queryingHorizon')}</p>
        </div>
      ) : error ? (
        <div role="alert" style={{ padding: '48px 16px', textAlign: 'center' }}><p className="font-bold font-inter" style={{ color: 'rgba(239,68,68,0.7)', padding: '12px 20px', borderRadius: '8px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', display: 'inline-block' }}>{error}</p></div>
      ) : results.length === 0 ? (
        <div role="status" style={{ padding: '64px 16px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Database style={{ width: '24px', height: '24px', color: 'rgba(255,255,255,0.15)' }} aria-hidden="true" />
          </div>
          <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700', marginBottom: '8px' }}>{t('explorer.noWorkers')}</p>
          <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>{t('explorer.noWorkersSub')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Results Header */}
          <div className="tc-flex-between tc-feed-header" style={{ background: 'linear-gradient(135deg, rgba(79,107,237,0.05), rgba(124,147,242,0.02), rgba(255,255,255,0.02))', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="font-inter tc-eyebrow" style={{ letterSpacing: '2px' }}>
              <span className="text-gradient" style={{ fontWeight: '700' }}>{t('explorer.showing')} {results.length} {t('explorer.credentials')}</span> · <span className="tc-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>{truncate(searchQuery)}</span>
            </div>
            <div className="flex items-center gap-2" style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.12)' }}>
              <ShieldCheck style={{ width: '14px', height: '14px', color: '#16A34A' }} aria-hidden="true" />
              <span className="font-inter" style={{ fontSize: '10px', letterSpacing: '1px', fontWeight: '700', color: '#16A34A', opacity: 0.9 }}>{t('explorer.onChainVerified')}</span>
            </div>
          </div>

          {/* Table */}
          <div className="w-full min-w-[800px]" role="table" aria-label={t('explorer.credentialsTable', 'Credentials table')}>
            {/* Header Row */}
            <div className="tc-table-header" role="row" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="font-inter tc-label" role="columnheader">{t('explorer.credentialType')}</div>
              <div className="font-inter tc-label" role="columnheader">{t('explorer.issuedOn')}</div>
              <div className="font-inter tc-label" role="columnheader">{t('explorer.txHash')}</div>
              <div className="font-inter tc-label" role="columnheader">{t('explorer.ledger')}</div>
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
                    role="row"
                    aria-label={`${cred.credentialType} credential`}
                    className="tc-table-row hover:bg-white/[0.03] transition-all duration-150 group result-row"
                    style={{ animationDelay: `${idx * 0.04}s`, borderLeft: '2px solid transparent', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = '#4F6BED'; e.currentTarget.style.background = 'rgba(79,107,237,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div role="cell">
                      <div className="flex items-center">
                        <Database className="tc-icon-md tc-icon-dimmer" style={{ marginRight: '10px' }} aria-hidden="true" />
                        <span className="font-inter" style={{
                          fontSize: '13px', fontWeight: '600',
                          color: isUnknown ? 'rgba(255,255,255,0.35)' : '#ffffff',
                          fontStyle: isUnknown ? 'italic' : 'normal'
                        }}>
                          {cred.credentialType}
                        </span>
                        {isMultiOp && (
                          <span className="font-inter" style={{
                            fontSize: '9px',
                            backgroundColor: 'rgba(255,200,50,0.1)',
                            border: '1px solid rgba(255,200,50,0.2)',
                            color: 'rgba(255,200,50,0.7)',
                            padding: '1px 6px', marginLeft: '8px',
                            fontWeight: '700', letterSpacing: '0.5px'
                          }}>MULTI-OP</span>
                        )}
                      </div>
                    </div>
                    <div role="cell">
                      <div className="flex items-center gap-2 font-inter tc-text-dim" style={{ fontSize: '12px' }}>
                        <Clock className="w-3.5 h-3.5 text-white/20" aria-hidden="true" />
                        <time dateTime={new Date(cred.timestamp).toISOString()}>
                          {new Date(cred.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                    </div>
                    <div role="cell">
                      <div className="flex items-center gap-2">
                        <a href={explorerTxUrl(cred.txHash)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:text-white transition-colors tc-mono"
                          aria-label={`View transaction ${truncate(cred.txHash)} on Stellar Explorer`}
                          style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                          <Hash className="w-3 h-3 text-white/20" aria-hidden="true" />
                          {truncate(cred.txHash)}
                        </a>
                        <button
                          onClick={() => { navigator.clipboard.writeText(cred.txHash); }}
                          title="Copy Hash"
                          aria-label={`Copy transaction hash ${truncate(cred.txHash)}`}
                          className="p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <span style={{ fontSize: '12px' }} aria-hidden="true">📋</span>
                        </button>
                        <a href={explorerTxUrl(cred.txHash)} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Open in Stellar Explorer">
                          <ExternalLink className="w-3 h-3 text-white/30" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                    <div role="cell">
                      <span className="tc-mono" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                        {cred.ledger}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="tc-label" style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
            <span style={{ opacity: 0.6 }}>{t('explorer.showing')} {results.length} {t('explorer.historicalCredentials')}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

ExplorerResultsTable.propTypes = {
  /** Array of credential result objects from Horizon API. */
  results: PropTypes.arrayOf(PropTypes.shape({
    /** Credential type label (e.g. 'Worker Identity'). */
    credentialType: PropTypes.string,
    /** ISO 8601 timestamp of credential creation. */
    timestamp: PropTypes.string,
    /** Stellar transaction hash. */
    txHash: PropTypes.string,
    /** Ledger sequence number. */
    ledger: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  /** Whether the search is in progress. */
  loading: PropTypes.bool.isRequired,
  /** Error message, or null. */
  error: PropTypes.string,
  /** Stellar address being searched. */
  searchQuery: PropTypes.string.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default ExplorerResultsTable;
