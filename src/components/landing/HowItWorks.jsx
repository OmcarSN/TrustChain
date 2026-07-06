import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * HowItWorks — "Three Steps to Trust" section on the Landing page.
 * Premium step cards with gradient accents and connecting line.
 *
 * @param {Object} props
 * @param {Array<Feature>} props.features - Array of step feature objects.
 * @param {boolean} props.visible - Whether the section has scrolled into view.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The HowItWorks component.
 */
const HowItWorks = ({ features, visible, t }) => {
  const stepColors = ['#22c55e', '#3b82f6', '#a855f7'];
  const stepIcons = ['🛡️', '⭐', '🔍'];

  return (
    <section id="how-it-works" style={{ padding: '80px 24px 0', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        marginBottom: '48px',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px'
      }}>
        <div>
          <p className="font-inter" style={{
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#22c55e', fontWeight: '700', marginBottom: '12px',
          }}>
            {t('landing.howItWorks', 'How It Works')}
          </p>
          <h2 className="font-clash" style={{ fontSize: '2rem', fontWeight: '900', color: 'white' }}>
            {t('landing.stepsTitleP1', 'Three Steps to')}{' '}
            <span className="text-gradient">{t('landing.stepsTitleP2', 'Trust')}</span>
          </h2>
        </div>
        <Link to="/how-it-works" className="btn-outline-glow font-inter" style={{
          textDecoration: 'none', fontSize: '11px', padding: '10px 20px', borderRadius: '8px',
        }}>
          {t('landing.viewDetailedGuide', 'VIEW DETAILED GUIDE')} →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ position: 'relative' }}>

        {features.map((feature, idx) => (
          <div key={idx} className="step-card-premium" style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.6s ease ${idx * 0.15}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 0.15}s`,
            display: 'flex', flexDirection: 'column', zIndex: 1,
          }}>
            {/* Step Number with Gradient Circle */}
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${stepColors[idx]}20, ${stepColors[idx]}08)`,
              border: `1px solid ${stepColors[idx]}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', marginBottom: '20px',
            }}>
              {stepIcons[idx]}
            </div>

            {/* Step Label */}
            <p className="font-inter" style={{
              fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: stepColors[idx], fontWeight: '700', marginBottom: '12px',
            }}>
              {t('landing.stepLabel')} {feature.step}
            </p>

            {/* Title */}
            <h3 className="font-clash" style={{
              fontSize: '16px', fontWeight: '800', color: 'white', marginBottom: '12px',
            }}>{feature.title}</h3>

            {/* Description */}
            <p className="font-inter" style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', flex: 1,
            }}>{feature.description}</p>

            {/* Watermark Number */}
            <div className="font-clash" style={{
              position: 'absolute', bottom: '-15px', right: '-5px',
              fontSize: '100px', fontWeight: '900', lineHeight: 1,
              color: stepColors[idx], opacity: 0.04,
              pointerEvents: 'none', userSelect: 'none',
            }}>{feature.step}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

HowItWorks.propTypes = {
  /** Array of step feature objects with step, title, description, link, linkText. */
  features: PropTypes.arrayOf(PropTypes.shape({
    /** Step number string (e.g. "01"). */
    step: PropTypes.string.isRequired,
    /** Step heading title. */
    title: PropTypes.string.isRequired,
    /** Step description text. */
    description: PropTypes.string.isRequired,
    /** Route path for the step's CTA. */
    link: PropTypes.string.isRequired,
    /** CTA button text. */
    linkText: PropTypes.string.isRequired,
  })).isRequired,
  /** Whether the section is visible (from IntersectionObserver). */
  visible: PropTypes.bool.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default HowItWorks;
