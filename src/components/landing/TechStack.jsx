import React from 'react';
import PropTypes from 'prop-types';

/** "Built With" technology showcase section. */
const TechStack = ({ visible, t }) => (
  <section style={{
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '60px', paddingBottom: '60px', paddingLeft: '64px', paddingRight: '64px',
    position: 'relative', overflow: 'hidden', marginTop: '60px',
  }}>
    <style>{`
      .tech-card-new { transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
      .tech-card-new:hover { transform: translateY(-4px); border: 1px solid rgba(255,255,255,0.2) !important; box-shadow: 0 12px 32px rgba(0,0,0,0.4); }
      .tech-card-new:hover .tech-icon { background-color: rgba(255,255,255,0.12) !important; }
    `}</style>

    {/* Scrolling ticker */}
    <div style={{ position: 'absolute', whiteSpace: 'nowrap', fontSize: '100px', fontWeight: '900', color: 'rgba(255,255,255,1)', opacity: 0.015, animation: 'ticker 25s linear infinite', top: '40%', transform: 'translateY(-50%)', zIndex: 0, pointerEvents: 'none', userSelect: 'none' }}>
      STELLAR · SOROBAN · REACT · FREIGHTER · RUST · STELLAR · SOROBAN · REACT · FREIGHTER · RUST ·
    </div>

    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
        <span style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: '900' }}>
          {t('landing.builtWith', 'BUILT WITH LEADING TECHNOLOGY')}
        </span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
      </div>
    </div>

    <div className="flex overflow-x-auto md:grid md:grid-cols-5 gap-4 pb-2 md:pb-0" style={{ gap: '16px' }}>
      {[
        { name: 'Stellar', abbr: 'ST', desc: t('landing.techBlockchain', 'Blockchain') },
        { name: 'Soroban', abbr: 'SR', desc: t('landing.techSmartContracts', 'Smart Contracts') },
        { name: 'React', abbr: 'RE', desc: t('landing.techFrontend', 'Frontend') },
        { name: 'Freighter', abbr: 'FR', desc: t('landing.techWallet', 'Wallet') },
        { name: 'Rust', abbr: 'RS', desc: t('landing.techBackend', 'Backend') },
      ].map((tech, i) => (
        <div key={i} className="tech-card-new min-w-[160px] md:min-w-0" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '24px 16px', textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.02)',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s, border-color 0.3s ease, background-color 0.3s ease`,
        }}>
          <div className="tech-icon font-clash" style={{
            width: '48px', height: '48px', marginBottom: '12px', backgroundColor: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.5)',
          }}>{tech.abbr}</div>
          <span className="font-inter" style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>{tech.name}</span>
          <span className="font-inter" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{tech.desc}</span>
        </div>
      ))}
    </div>
  </section>
);

TechStack.propTypes = {
  visible: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default TechStack;
