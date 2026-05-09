import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * @typedef {Object} Feature
 * @property {string} step - Step number ("01", "02", "03")
 * @property {string} title - Step title
 * @property {string} description - Step description
 * @property {string} link - Route path
 * @property {string} linkText - CTA button text
 */

/** "How It Works" section with 3-step feature cards. */
const HowItWorks = ({ features, visible, t }) => (
  <section id="how-it-works" style={{ paddingTop: '80px', paddingBottom: '0px', paddingRight: '64px', paddingLeft: '24px', marginTop: '0px' }}>
    <style>{`
      .step-card-new { transition: all 0.3s ease; }
      .step-card-new:hover { border-color: rgba(255,255,255,0.15) !important; background-color: rgba(255,255,255,0.03) !important; }
    `}</style>

    <div style={{
      marginBottom: '48px', paddingLeft: '24px',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px'
    }}>
      <div>
        <p className="font-inter" style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', textTransform: 'uppercase' }}>
          {t('landing.howItWorks', 'How It Works')}
        </p>
        <h2 className="font-clash" style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff' }}>
          {t('landing.stepsTitleP1', 'Three Steps to')}{' '}{t('landing.stepsTitleP2', 'Trust')}
        </h2>
      </div>
      <Link to="/how-it-works" className="font-inter" style={{
        fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#00dc6e', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
        border: '1px solid rgba(0, 220, 110, 0.3)', padding: '10px 20px', transition: 'all 0.3s ease', backgroundColor: 'rgba(0, 220, 110, 0.05)'
      }}
      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 220, 110, 0.15)'; e.currentTarget.style.borderColor = '#00dc6e'; }}
      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 220, 110, 0.05)'; e.currentTarget.style.borderColor = 'rgba(0, 220, 110, 0.3)'; }}
      >
        {t('landing.viewDetailedGuide', 'VIEW DETAILED GUIDE')} <span>→</span>
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ position: 'relative', paddingBottom: '0px' }}>
      <div style={{ position: 'absolute', top: '50%', left: '33%', width: '34%', height: '1px', borderTop: '1px dashed rgba(255,255,255,0.08)', zIndex: 0, pointerEvents: 'none' }} />
      {features.map((feature, idx) => (
        <div key={idx} className="step-card-new" style={{
          padding: '32px 28px', paddingBottom: '32px',
          border: '1px solid rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.02)',
          display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: `opacity 0.6s ease ${idx * 0.1}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 0.1}s, border-color 0.3s ease, background-color 0.3s ease`,
        }}>
          <div className="font-clash" style={{ position: 'absolute', bottom: '-20px', right: '-10px', fontSize: '120px', fontWeight: '900', lineHeight: 1, color: 'rgba(255,255,255,0.03)', pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>{feature.step}</div>
          <p className="font-inter" style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.2)', marginBottom: '20px', textTransform: 'uppercase' }}>
            {t('landing.stepLabel')} {feature.step}
          </p>
          <h3 className="font-clash" style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '10px' }}>{feature.title}</h3>
          <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', flex: 1 }}>{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
);

HowItWorks.propTypes = {
  features: PropTypes.arrayOf(PropTypes.shape({
    step: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
  })).isRequired,
  visible: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default HowItWorks;
