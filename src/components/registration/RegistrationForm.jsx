import React from 'react';
import { explorerTxUrl } from '../../lib/networkConfig';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, Briefcase, Calendar, FileText,
  Loader2, CheckCircle2, ShieldCheck, ChevronDown,
  ExternalLink, AlertCircle, Zap
} from 'lucide-react';

const JOURNEY_STEPS = [
  { id: 1, icon: '✎', label: 'BUILD PROFILE', desc: 'Fill your details' },
  { id: 2, icon: '⬡', label: 'SIGN & SEND', desc: 'Approve in Freighter' },
  { id: 3, icon: '✦', label: 'MINTED', desc: 'On-chain forever' },
];

const SKILL_CATEGORIES = [
  'AC Technician','Agriculture','Babysitting','Carpenter','Cleaning',
  'Construction','Cooking','Domestic Work','Driver','Electrician',
  'Gardening','Maintenance','Painter','Plumbing','Security guard',
  'Tailoring','Transport','Other'
];

import PropTypes from 'prop-types';

/**
 * RegistrationForm — Worker credential registration form.
 * Renders a 3-step journey stepper, a 2-column form grid for professional
 * details (name, skill, experience, city, bio), a gasless transaction
 * banner, and a mint button. On success, displays a confirmation card
 * with a Stellar Explorer link.
 *
 * @param {Object} props
 * @param {Object} props.formData - Current form field values.
 * @param {Object} props.errors - Validation error messages keyed by field.
 * @param {boolean} props.isMinting - Whether a mint transaction is in progress.
 * @param {Object|null} props.txResult - Transaction result object, or null.
 * @param {number} props.filled - Count of filled form fields (0–5).
 * @param {Function} props.handleInputChange - Input change handler.
 * @param {Function} props.handleMint - Mint submit handler.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The RegistrationForm component.
 */
const RegistrationForm = ({
  formData, errors, isMinting, txResult, filled,
  handleInputChange, handleMint, t
}) => (
  <>
    {/* Journey Stepper */}
    <div className="reg-anim journey-bar" role="navigation" aria-label={t('registration.journeyLabel', 'Registration progress')} style={{ animationDelay: '0.1s' }}>
      {JOURNEY_STEPS.map((step, i) => {
        let statusClass = '';
        if (step.id === 1) {
          statusClass = filled === 5 ? 'completed' : 'active';
        } else if (step.id === 2) {
          if (txResult) statusClass = 'completed';
          else if (isMinting) statusClass = 'pending';
        } else if (step.id === 3) {
          if (txResult) statusClass = 'completed mint-flash';
        }

        let connectorCompleted = false;
        if (i === 1 && filled === 5) connectorCompleted = true;
        if (i === 2 && txResult) connectorCompleted = true;

        return (
          <React.Fragment key={step.id}>
            {i > 0 && (
              <div className={`journey-connector ${connectorCompleted ? 'completed' : ''}`} role="separator" aria-hidden="true" />
            )}
            <div className={`journey-step ${statusClass}`} aria-current={statusClass === 'active' || statusClass === 'pending' ? 'step' : undefined}>
              <div className="journey-icon font-inter" aria-hidden="true">{step.icon}</div>
              <div className="journey-label font-inter uppercase">{step.label}</div>
              <div className="journey-desc font-inter">{step.desc}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>

    {/* Form Card */}
    <motion.div className="form-card reg-anim glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
      role="form" aria-label={t('registration.formLabel', 'Worker registration form')}
    >
      {/* Card Header */}
      <div className="form-card-header">
        <h2 className="form-card-title font-inter">Professional Details</h2>
        <span className="form-progress-badge font-inter uppercase" role="status" aria-label={`${filled} of 5 fields completed`}>{filled}/5</span>
      </div>

      {/* Form Fields Grid */}
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="reg-fullName" className="field-label font-inter uppercase"><User className="w-3.5 h-3.5 text-[#333]" aria-hidden="true" /> {t('registration.labelName')}</label>
          <input id="reg-fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Raj Kumar" aria-required="true" aria-invalid={!!errors.fullName} className={`field-input ${formData.fullName.length >= 2 ? 'filled' : ''} ${errors.fullName ? '!border-red-500/50' : ''}`} />
          {errors.fullName && <p className="text-red-400 text-[10px]" role="alert">{errors.fullName}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="reg-skillCategory" className="field-label font-inter uppercase"><Briefcase className="w-3.5 h-3.5 text-[#333]" aria-hidden="true" /> {t('registration.labelSkill')}</label>
          <div className="relative">
            <select id="reg-skillCategory" name="skillCategory" value={formData.skillCategory} onChange={handleInputChange} aria-required="true" aria-invalid={!!errors.skillCategory} className={`field-input ${formData.skillCategory ? 'filled' : ''} ${errors.skillCategory ? '!border-red-500/50' : ''}`}>
              <option value="">{t('registration.skillSelect')}</option>
              {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{t('jobs.' + c.replace(/\s+/g, ''))}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] pointer-events-none" aria-hidden="true" />
          </div>
          {errors.skillCategory && <p className="text-red-400 text-[10px]" role="alert">{errors.skillCategory}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="reg-experience" className="field-label font-inter uppercase"><Calendar className="w-3.5 h-3.5 text-[#333]" aria-hidden="true" /> {t('registration.labelExp')}</label>
          <input id="reg-experience" type="number" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="0" min="0" max="50" aria-required="true" aria-invalid={!!errors.experience} className={`field-input ${formData.experience > 0 ? 'filled' : ''} ${errors.experience ? '!border-red-500/50' : ''}`} />
          {errors.experience && <p className="text-red-400 text-[10px]" role="alert">{errors.experience}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="reg-city" className="field-label font-inter uppercase"><MapPin className="w-3.5 h-3.5 text-[#333]" aria-hidden="true" /> {t('registration.labelCity')}</label>
          <input id="reg-city" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Mumbai" aria-required="true" aria-invalid={!!errors.city} className={`field-input ${formData.city ? 'filled' : ''} ${errors.city ? '!border-red-500/50' : ''}`} />
          {errors.city && <p className="text-red-400 text-[10px]" role="alert">{errors.city}</p>}
        </div>
        <div className="form-field field-bio">
          <label htmlFor="reg-bio" className="field-label font-inter uppercase"><FileText className="w-3.5 h-3.5 text-[#333]" aria-hidden="true" /> Short Bio <span className="ml-auto text-[10px] text-[#444]" aria-live="polite">{(formData.bio || '').length}/150</span></label>
          <textarea id="reg-bio" name="bio" value={formData.bio} onChange={handleInputChange} rows="3" maxLength={150} placeholder={t('registration.bioPlaceholder')} aria-required="true" aria-invalid={!!errors.bio} className={`field-input resize-none ${formData.bio.length >= 10 ? 'filled' : ''} ${errors.bio ? '!border-red-500/50' : ''}`} />
          {errors.bio && <p className="text-red-400 text-[10px]" role="alert">{errors.bio}</p>}
        </div>
      </div>

      {/* Submit Area */}
      <AnimatePresence mode="wait">
        {txResult ? (
          <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status" aria-label={t('registration.successLabel', 'Credential minted successfully')} style={{ border: '1px solid rgba(22,163,74,0.15)', backgroundColor: 'rgba(22,163,74,0.03)', padding: '24px', textAlign: 'center', marginTop: '36px', borderRadius: '6px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', borderRadius: '50%' }}>
              <CheckCircle2 style={{ width: '24px', height: '24px', color: '#16A34A' }} aria-hidden="true" />
            </div>
            <h3 className="font-clash" style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px', color: '#fff' }}>Credential Minted!</h3>
            <p className="font-inter" style={{ fontSize: '10px', color: 'rgba(22,163,74,0.5)', marginBottom: '16px' }}>Sealed on Stellar</p>
            <a href={explorerTxUrl(txResult.hash)} target="_blank" rel="noopener noreferrer" aria-label={t('registration.viewExplorerLabel', 'View transaction on Stellar Explorer')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', textDecoration: 'none', transition: 'color 0.2s', borderRadius: '4px' }}>
              <ExternalLink style={{ width: '12px', height: '12px' }} aria-hidden="true" /> {t('registration.viewOnExplorer')}
            </a>
          </motion.div>
        ) : (
          <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Gasless Banner */}
            <div className="gasless-banner" role="status">
              <div className="gasless-title font-inter uppercase"><Zap className="w-3.5 h-3.5" aria-hidden="true" /> {t('registration.gaslessTransaction')}</div>
              <div className="gasless-subtitle font-inter">{t('registration.gaslessDesc')}</div>
            </div>
            {/* Mint Button */}
            <button onClick={handleMint} disabled={isMinting || filled !== 5} className="mint-btn font-inter btn-glow" aria-label={isMinting ? t('registration.mintingLabel', 'Minting in progress') : t('registration.mintBtnLabel', 'Mint credential on-chain')} style={{ width: '100%', marginTop: '16px' }}>
              {isMinting ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> {t('registration.btnMinting')}</> : filled === 5 ? <><ShieldCheck className="w-4 h-4" aria-hidden="true" /> {t('registration.btnSubmit')}</> : <span>{t('registration.completeAllFields')}</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {errors._submit && <div className="font-inter" role="alert" style={{ marginTop: '12px', padding: '10px 14px', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(239,68,68,0.8)', fontSize: '10px', borderRadius: '4px' }}><AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} aria-hidden="true" /> {errors._submit}</div>}
    </motion.div>
  </>
);

export default RegistrationForm;

RegistrationForm.propTypes = {
  /** Current form field values object. */
  formData: PropTypes.shape({
    fullName: PropTypes.string,
    skillCategory: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    city: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
  /** Validation error messages keyed by field name. */
  errors: PropTypes.object.isRequired,
  /** Whether a mint transaction is in progress. */
  isMinting: PropTypes.bool.isRequired,
  /** Transaction result object, or null if not yet minted. */
  txResult: PropTypes.object,
  /** Count of filled form fields (0–5). */
  filled: PropTypes.number.isRequired,
  /** Input change handler callback. */
  handleInputChange: PropTypes.func.isRequired,
  /** Mint submit handler callback. */
  handleMint: PropTypes.func.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};
