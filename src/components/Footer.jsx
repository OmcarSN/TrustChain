import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TrustChainLogo from './TrustChainLogo';

/**
 * Footer — Global site footer.
 * Renders a premium 4-column layout with branding, platform links, resources,
 * and community links, plus a bottom copyright bar with social links.
 *
 * @returns {React.ReactElement} The Footer component.
 */
const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer style={{ backgroundColor: '#05060A', position: 'relative', zIndex: 1 }}>
      {/* Gradient Top Border */}
      <div className="section-divider" />

      <style>{`
        .footer-link {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          display: block;
          margin-bottom: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer-link:hover {
          color: #7C93F2;
          padding-left: 4px;
        }
        .footer-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.4);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer-social-btn:hover {
          border-color: rgba(79,107,237,0.3);
          color: #7C93F2;
          background: rgba(79,107,237,0.05);
        }
      `}</style>

      {/* Top Section: 4 Columns */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', gap: '48px', padding: '64px 24px 48px' }} className="font-inter grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        
        {/* Col 1: Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <TrustChainLogo size={32} className="opacity-90" />
            <span className="font-clash font-bold text-lg tracking-widest text-white uppercase">
              TRUSTCHAIN
            </span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: 'rgba(255,255,255,0.4)', maxWidth: '260px' }}>
            {t('footer_tagline')}
          </p>
          <div style={{
            fontSize: '10px', color: '#7C93F2', letterSpacing: '1.5px', marginTop: '16px',
            background: 'rgba(79,107,237,0.08)', border: '1px solid rgba(79,107,237,0.2)',
            padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontWeight: 'bold', borderRadius: '100px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4F6BED', boxShadow: '0 0 6px rgba(79,107,237,0.5)' }} />
            {t('footer_testnet')}
          </div>
        </div>

        {/* Col 2: Platform */}
        <div>
          <h4 className="font-clash" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: '700', marginBottom: '20px' }}>
            {t('footer_platform')}
          </h4>
          <Link to="/discover" className="footer-link">{t('nav_find_workers')}</Link>
          <Link to="/explorer" className="footer-link">{t('nav_explorer')}</Link>
          <Link to="/analytics" className="footer-link">{t('nav_analytics')}</Link>
          <Link to="/dashboard" className="footer-link">{t('nav_dashboard')}</Link>
          <Link to="/worker" className="footer-link">{t('nav_worker_portal')}</Link>
        </div>

        {/* Col 3: Resources */}
        <div>
          <h4 className="font-clash" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: '700', marginBottom: '20px' }}>
            {t('resources', 'Resources')}
          </h4>
          <a href="https://github.com/OmcarSN/TrustChain" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href="https://developers.stellar.org/docs" target="_blank" rel="noopener noreferrer" className="footer-link">Stellar Docs</a>
          <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="footer-link">Freighter</a>
          <a href="https://soroban.stellar.org/" target="_blank" rel="noopener noreferrer" className="footer-link">Soroban</a>
        </div>

        {/* Col 4: Community */}
        <div>
          <h4 className="font-clash" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: '700', marginBottom: '20px' }}>
            {t('community', 'Community')}
          </h4>
          <Link to="/about" className="footer-link">{t('about', 'About')}</Link>
          <Link to="/mission" className="footer-link">{t('mission', 'Mission')}</Link>
          <Link to="/contact" className="footer-link">{t('contact', 'Contact')}</Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: '16px',
        maxWidth: '1200px', margin: '0 auto',
      }} className="sm:flex-row sm:items-center sm:justify-between">
        <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
          © 2026 TRUSTCHAIN PROTOCOL · BUILT ON STELLAR
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="https://x.com/TrustChainXLM" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="X / Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="https://github.com/OmcarSN/TrustChain" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="GitHub">💻</a>
          <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Stellar">⭐</a>
          <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Freighter">🔑</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
