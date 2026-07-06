import React from 'react';
import PropTypes from 'prop-types';

/**
 * TechStack — "Built With" technology showcase section on the Landing page.
 * Premium tech cards with gradient icons and hover effects.
 *
 * @param {Object} props
 * @param {boolean} props.visible - Whether the section has scrolled into view.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The TechStack component.
 */
const TechStack = ({ visible, t }) => {
  const techs = [
    { name: 'Stellar', icon: '✦', desc: t('landing.techBlockchain', 'Blockchain'), color: '#3b82f6' },
    { name: 'Soroban', icon: '◆', desc: t('landing.techSmartContracts', 'Smart Contracts'), color: '#f97316' },
    { name: 'React', icon: '⚛', desc: t('landing.techFrontend', 'Frontend'), color: '#61dafb' },
    { name: 'Freighter', icon: '🔑', desc: t('landing.techWallet', 'Wallet'), color: '#a855f7' },
    { name: 'Rust', icon: '⚙', desc: t('landing.techBackend', 'Backend'), color: '#ef4444' },
  ];

  return (
    <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      {/* Section Divider */}
      <div className="section-divider" style={{ marginBottom: '60px' }} />

      <div style={{
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08))' }} />
          <span className="font-inter" style={{
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', fontWeight: '700',
          }}>
            {t('landing.builtWith', 'BUILT WITH LEADING TECHNOLOGY')}
          </span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
        </div>
      </div>

      <div className="flex overflow-x-auto md:grid md:grid-cols-5 gap-4 pb-2 md:pb-0">
        {techs.map((tech, i) => (
          <div key={i} className="tech-card-premium min-w-[160px] md:min-w-0" style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
          }}>
            <div className="tech-icon-premium font-clash" style={{ color: tech.color }}>
              {tech.icon}
            </div>
            <span className="font-inter" style={{
              fontSize: '14px', fontWeight: '700', color: 'white',
              display: 'block', marginBottom: '4px',
            }}>{tech.name}</span>
            <span className="font-inter" style={{
              fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
            }}>{tech.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

TechStack.propTypes = {
  /** Whether the section is visible (from IntersectionObserver). */
  visible: PropTypes.bool.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};

export default TechStack;
