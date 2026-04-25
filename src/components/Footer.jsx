import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TrustChainLogo from './TrustChainLogo';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer style={{ backgroundColor: '#050505', borderTop: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 1 }}>
      <style>{`
        .footer-link {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          display: block;
          margin-bottom: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer-link:hover {
          color: #ffffff;
          padding-left: 4px;
        }
        .footer-social {
          font-size: 11px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }
        .footer-social:hover {
          color: #ffffff;
        }
      `}</style>

      {/* Top Section: 4 Columns */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', padding: '64px 24px 48px' }} className="font-inter">
        
        {/* Col 1: Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <TrustChainLogo size={32} className="opacity-90" />
            <span className="font-clash font-bold text-lg tracking-widest text-white uppercase">
              TRUSTCHAIN
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', maxWidth: '260px' }}>
            Verified reputation for the informal economy, on Stellar.
          </p>
          <div style={{
            fontSize: '10px', color: '#00dc6e', letterSpacing: '1.5px', marginTop: '16px',
            backgroundColor: 'rgba(0,220,110,0.08)', border: '1px solid rgba(0,220,110,0.2)',
            padding: '4px 10px', display: 'inline-block', fontWeight: 'bold'
          }}>
            ● ON STELLAR TESTNET
          </div>
        </div>

        {/* Col 2: Platform */}
        <div>
          <h4 className="font-clash" style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', marginBottom: '16px', textTransform: 'uppercase' }}>
            Platform
          </h4>
          <Link to="/discover" className="footer-link">Find Workers</Link>
          <Link to="/explorer" className="footer-link">Explorer</Link>
          <Link to="/analytics" className="footer-link">Analytics</Link>
          <Link to="/dashboard" className="footer-link">Dashboard</Link>
          <Link to="/worker" className="footer-link">Worker Portal</Link>
        </div>

        {/* Col 3: Resources */}
        <div>
          <h4 className="font-clash" style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', marginBottom: '16px', textTransform: 'uppercase' }}>
            Resources
          </h4>
          <a href="https://github.com/OmcarSN/TrustChain" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href="https://developers.stellar.org/docs" target="_blank" rel="noopener noreferrer" className="footer-link">Stellar Docs</a>
          <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="footer-link">Freighter</a>
          <a href="https://soroban.stellar.org/" target="_blank" rel="noopener noreferrer" className="footer-link">Soroban</a>
        </div>

        {/* Col 4: Community */}
        <div>
          <h4 className="font-clash" style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', marginBottom: '16px', textTransform: 'uppercase' }}>
            Community
          </h4>
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/mission" className="footer-link">Mission</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '20px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '48px',
      }}>
        <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.2)', letterSpacing:'1px' }}>
          © 2026 TRUSTCHAIN PROTOCOL · STELLAR SOROBAN
        </span>
        <div style={{ display:'flex', gap:'24px' }}>
          <a style={{ fontSize:'11px', letterSpacing:'2px', color:'rgba(255,255,255,0.3)' }}>GH</a>
          <a style={{ fontSize:'11px', letterSpacing:'2px', color:'rgba(255,255,255,0.3)' }}>ST</a>
          <a style={{ fontSize:'11px', letterSpacing:'2px', color:'rgba(255,255,255,0.3)' }}>FR</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
