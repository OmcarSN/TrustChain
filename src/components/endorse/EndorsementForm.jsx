import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Briefcase, Loader2,
  CheckCircle2, ShieldCheck, ChevronDown, 
  ExternalLink, Sparkles, PenLine,
  Zap, Clock
} from 'lucide-react';

/**
 * EndorsementForm — Right panel of the Endorse page.
 * Contains star rating (radio group), job type dropdown, review textarea,
 * feature badges, and submit/success states.
 * Extracted from Endorse.jsx for modularity.
 *
 * @param {Object} props
 * @param {Object|null} props.foundWorker - The worker being endorsed (null = locked overlay).
 * @param {number} props.rating - Current star rating (1-5).
 * @param {Function} props.setRating - Setter for the rating value.
 * @param {number} props.hoveredStar - Currently hovered star index (0 = none).
 * @param {Function} props.setHoveredStar - Setter for the hovered star.
 * @param {string} props.jobType - Selected job type string.
 * @param {Function} props.setJobType - Setter for job type.
 * @param {string} props.feedback - Review textarea content.
 * @param {Function} props.setFeedback - Setter for feedback text.
 * @param {boolean} props.isSigning - Whether a transaction is being signed.
 * @param {boolean} props.isSuccess - Whether the endorsement was submitted successfully.
 * @param {string} props.txHash - Stellar transaction hash (on success).
 * @param {boolean} props.canSubmit - Whether the form passes validation.
 * @param {Function} props.handleEndorse - Submit handler for on-chain endorsement.
 * @param {Object} props.labelStyle - Shared label style object from parent.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The EndorsementForm panel.
 */
const EndorsementForm = ({
  foundWorker, rating, setRating, hoveredStar, setHoveredStar,
  jobType, setJobType, feedback, setFeedback,
  isSigning, isSuccess, txHash, canSubmit,
  handleEndorse, labelStyle, t
}) => {
  const activeStarValue = hoveredStar || rating;
  const ratingLabels = ['', t('endorse.ratingPoor'), t('endorse.ratingFair'), t('endorse.ratingGood'), t('endorse.ratingGreat'), t('endorse.ratingOutstanding')];

  return (
    <div className="tc-form-panel">
      {/* Locked overlay */}
      <AnimatePresence>
        {!foundWorker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="tc-locked-overlay">
            <Search className="tc-icon-2xl tc-icon-dimmer" />
            <p className="font-inter tc-label tc-ls-wider tc-icon-dimmer">{t('endorse.searchByAddress')}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel header */}
      <div style={{ ...labelStyle, paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {t('endorse.formTitle')}
      </div>

      {/* Rating */}
      <div>
        <div className="tc-flex-between tc-mb-xs">
          <label className="font-inter" style={labelStyle}><Star className="tc-icon-sm" /> {t('endorse.ratingFieldLabel')}</label>
          {activeStarValue > 0 && <span className="font-inter tc-card-interactive tc-text-xs" style={{ color: 'rgba(255,255,255,0.5)', padding: '2px 8px' }}>{ratingLabels[activeStarValue]}</span>}
        </div>
        <div className="tc-flex" style={{ gap: '4px' }} role="radiogroup" aria-label={t('endorse.ratingFieldLabel')}>
          {[1,2,3,4,5].map(s => {
            const isActive = activeStarValue >= s;
            const isSelected = rating >= s;
            return (
              <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)}
                role="radio" aria-checked={rating === s} aria-label={`${s} star${s !== 1 ? 's' : ''}`}
                className={`end-star ${isSelected ? 'star-pop' : ''}`} style={{ background: 'none', border: 'none', padding: '4px' }}>
                <Star style={{ width: '22px', height: '22px', color: isActive ? '#f5c518' : 'rgba(255,255,255,0.15)', fill: isActive ? '#f5c518' : 'transparent' }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label className="font-inter" style={labelStyle}><Briefcase className="tc-icon-sm" /> {t('jobTypes.label')}</label>
        <div style={{ position: 'relative' }}>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="end-input end-input-dropdown font-inter w-full px-4 py-3 text-sm"
            aria-label={t('jobTypes.label')}
            style={{ outline: 'none', appearance: 'none', cursor: 'pointer', paddingRight: '36px' }}>
            <option value="" disabled>{t('endorse.selectJobType')}</option>
            <option value="One-time Job" className="tc-option-dark">{t('jobTypes.One-time Job')}</option>
            <option value="Recurring" className="tc-option-dark">{t('jobTypes.Recurring')}</option>
            <option value="Contract" className="tc-option-dark">{t('jobTypes.Contract')}</option>
            <option value="Freelance" className="tc-option-dark">{t('jobTypes.Freelance')}</option>
            <option value="Full-time" className="tc-option-dark">{t('jobTypes.Full-time')}</option>
          </select>
          <ChevronDown className="tc-icon-sm" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Review Textarea */}
      <div>
        <div className="tc-flex-between tc-mb-xs">
          <label className="font-inter" style={labelStyle}><PenLine className="tc-icon-sm" /> {t('endorse.reviewLabel')}</label>
          <span className="font-inter tc-text-xs tc-text-tabular" style={{ color: feedback.length === 300 ? '#ff4444' : feedback.length > 250 ? '#f5c518' : 'rgba(255,255,255,0.25)' }}>{feedback.length}/300</span>
        </div>
        <textarea value={feedback} onChange={(e) => e.target.value.length <= 300 && setFeedback(e.target.value)}
          placeholder={t('endorse.placeholderFeedback')}
          aria-label={t('endorse.reviewLabel')}
          className="end-input end-input-textarea font-inter w-full px-4 py-3 text-sm" style={{ outline: 'none' }} />
        {feedback.length > 0 && feedback.length < 20 && (
          <p className="font-inter tc-text-dimmer tc-text-xs tc-flex" style={{ marginTop: '6px', alignItems: 'center', gap: '4px' }}>
            <Zap className="tc-icon-xs" /> {20 - feedback.length} {t('endorse.moreCharsNeeded', { count: 20 - feedback.length })}
          </p>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="tc-action-bar">
        {/* Feature tags */}
        <div className="badge-fade-in tc-badge-row">
          {[
            { icon: ShieldCheck, text: t('endorse.badgeOnChain'), color: '#00dc6e' },
            { icon: Clock, text: t('endorse.badgePermanent'), color: '#ffffff' },
            { icon: Sparkles, text: t('endorse.badgeStellar'), color: '#4b9fff' },
          ].map((b, i, arr) => (
            <React.Fragment key={i}>
              <span className="font-inter tc-eyebrow tc-text-xs tc-ls-wide tc-flex" style={{ color: 'rgba(255,255,255,0.25)', alignItems: 'center', gap: '5px' }}>
                <b.icon className="tc-icon-sm" style={{ color: b.color }} /> {b.text}
              </span>
              {i < arr.length - 1 && <span className="tc-text-faint">·</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Submit / Success */}
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="tc-success-card">
              <div className="tc-flex tc-flex-gap tc-mb-sm" style={{ alignItems: 'center' }}>
                <CheckCircle2 className="tc-icon-xl" style={{ color: '#00dc6e' }} />
                <div>
                  <h4 className="tc-text-white tc-text-md tc-fw-bold">{t('endorse.endorsementRecorded')}</h4>
                  <p className="font-inter tc-text-accent tc-text-xs" style={{ opacity: 0.5 }}>{t('endorse.sealedOnStellar')}</p>
                </div>
              </div>
              <div className="tc-card-interactive tc-mb-xs" style={{ borderRadius: '6px' }}>
                <span className="tc-mono tc-text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{txHash}</span>
              </div>
              <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                aria-label={`${t('endorse.viewOnExplorer')} - transaction ${txHash.slice(0, 8)}`}
                className="font-inter tc-btn-outline tc-text-xs tc-ls-wide" style={{ color: 'rgba(255,255,255,0.4)', borderRadius: '8px', textDecoration: 'none' }}>
                <ExternalLink className="tc-icon-sm" /> {t('endorse.viewOnExplorer')}
              </a>
            </motion.div>
          ) : (
            <button key="submit" onClick={handleEndorse} disabled={!canSubmit || isSigning} className="end-submit font-inter"
              aria-label={isSigning ? 'Submitting endorsement' : 'Submit endorsement on-chain'}
              style={{
                width: '100%', padding: '16px',
                backgroundColor: canSubmit ? '#ffffff' : 'rgba(255,255,255,0.08)',
                color: canSubmit ? '#000000' : 'rgba(255,255,255,0.3)',
                fontSize: '13px', letterSpacing: '2.5px', fontWeight: '800',
                border: 'none',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                marginTop: '20px',
                borderRadius: '10px',
                animation: canSubmit ? 'btnPulse 2.5s ease infinite' : 'none'
              }}>
              {isSigning ? <><Loader2 className="tc-icon-md" style={{ display: 'inline', verticalAlign: 'text-bottom' }} className="spinner" /> SUBMITTING...</>
                : <> SUBMIT ENDORSEMENT ON-CHAIN</>}
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

EndorsementForm.propTypes = {
  /** Worker object returned from search, or null if none found. */
  foundWorker: PropTypes.object,
  /** Current star rating (1-5). */
  rating: PropTypes.number.isRequired,
  /** Setter for the star rating. */
  setRating: PropTypes.func.isRequired,
  /** Index of the currently hovered star (0 = none). */
  hoveredStar: PropTypes.number.isRequired,
  /** Setter for the hovered star. */
  setHoveredStar: PropTypes.func.isRequired,
  /** Selected job type string. */
  jobType: PropTypes.string.isRequired,
  /** Setter for job type. */
  setJobType: PropTypes.func.isRequired,
  /** Review textarea content. */
  feedback: PropTypes.string.isRequired,
  /** Setter for feedback text. */
  setFeedback: PropTypes.func.isRequired,
  /** Whether a Stellar transaction is being signed. */
  isSigning: PropTypes.bool.isRequired,
  /** Whether the endorsement was submitted successfully. */
  isSuccess: PropTypes.bool.isRequired,
  /** Stellar transaction hash (displayed on success). */
  txHash: PropTypes.string,
  /** Whether the form passes all validation checks. */
  canSubmit: PropTypes.bool.isRequired,
  /** Submit handler for on-chain endorsement. */
  handleEndorse: PropTypes.func.isRequired,
  /** Shared label style object from parent Endorse page. */
  labelStyle: PropTypes.object.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

EndorsementForm.defaultProps = {
  foundWorker: null,
  txHash: '',
};

export default EndorsementForm;
