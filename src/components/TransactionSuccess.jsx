import { motion } from 'framer-motion';
import { explorerTxUrl } from '../lib/networkConfig';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * TransactionSuccess — Reusable "transaction sealed on Stellar" success card.
 * Extracted from Endorse and WorkerRegistration pages to eliminate
 * code duplication. Displays a check icon, title/subtitle, full tx hash,
 * and a link to Stellar Explorer.
 *
 * @param {Object} props
 * @param {string} props.txHash - Stellar transaction hash.
 * @param {string} props.title - Success heading text.
 * @param {string} props.subtitle - Success subtitle text.
 * @param {string} [props.borderRadius='2px'] - Card border radius.
 * @returns {React.ReactElement} The TransactionSuccess component.
 */
const TransactionSuccess = ({ txHash, title, subtitle, borderRadius = '2px' }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        border: '1px solid rgba(22,163,74,0.15)',
        backgroundColor: 'rgba(22,163,74,0.03)',
        padding: '20px',
        borderRadius,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <CheckCircle2 style={{ width: '18px', height: '18px', color: '#16A34A' }} />
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{title}</h4>
          <p className="font-inter" style={{ fontSize: '10px', color: 'rgba(22,163,74,0.5)' }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', marginBottom: '8px', borderRadius: '6px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>{txHash}</span>
      </div>
      <a
        href={explorerTxUrl(txHash)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t('endorse.viewOnExplorer')} - transaction ${txHash.slice(0, 8)}`}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)',
          border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px',
          textDecoration: 'none', textTransform: 'uppercase', fontWeight: '700',
          borderRadius: '8px',
        }}
        className="font-inter"
      >
        <ExternalLink className="tc-icon-sm" /> {t('endorse.viewOnExplorer')}
      </a>
    </motion.div>
  );
};

TransactionSuccess.propTypes = {
  /** Stellar transaction hash. */
  txHash: PropTypes.string.isRequired,
  /** Success heading text. */
  title: PropTypes.string.isRequired,
  /** Success subtitle text. */
  subtitle: PropTypes.string.isRequired,
  /** Card border radius. */
  borderRadius: PropTypes.string,
};

export default TransactionSuccess;
