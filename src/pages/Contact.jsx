import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Globe, ExternalLink } from 'lucide-react';

/**
 * Contact — External links page for GitHub, Stellar, and Freighter.
 * Provides quick-access cards with hover animations to project resources
 * and a support text section below.
 *
 * @returns {React.ReactElement} The Contact page.
 */
const Contact = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#050505', overflow: 'hidden' }}>
      {/* Background Decorations */}
      <div className="tc-bg-grid" />
      <div className="tc-orb-green" />

      <div className="tc-page" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
      
        <h1 className="font-clash tc-heading-hero tc-mb-2xl reveal">
          <span className="text-gradient">{t('contact_us')}</span>
        </h1>

        <div className="tc-flex-col tc-mb-3xl reveal reveal-d1" style={{ gap: '16px' }}>
          {/* GitHub */}
          <a href="https://github.com/OmcarSN/TrustChain" target="_blank" rel="noopener noreferrer" className="glass-card hover-scale group" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(59,130,246,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Github className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px' }}>GitHub</p>
              <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>github.com/OmcarSN/TrustChain</p>
            </div>
          </a>

          {/* Stellar */}
          <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="glass-card hover-scale group" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Globe className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px' }}>Stellar</p>
              <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>stellar.org</p>
            </div>
          </a>

          {/* Freighter */}
          <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer" className="glass-card hover-scale group" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ExternalLink className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px' }}>Freighter</p>
              <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>freighter.app</p>
            </div>
          </a>

          {/* Stellar Expert (Sponsor) */}
          <a href="https://stellar.expert/explorer/public/account/GAPTP3YBWMIGE3GT3FDRAOOCLO6ZLZ2U7IIGK2VQBGDL2NLVAZX5E57A" target="_blank" rel="noopener noreferrer" className="glass-card hover-scale group" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ExternalLink className="w-5 h-5 text-green-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px', color: '#22c55e' }}>Sponsor Wallet (Explorer)</p>
              <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>View all Mainnet transactions</p>
            </div>
          </a>
        </div>

        <div className="section-divider" style={{ margin: '0 0 32px 0' }} />

        <div className="glass-card reveal reveal-d2" style={{ padding: '24px 28px' }}>
          <p className="font-inter tc-body-lg" style={{ fontSize: '16px' }}>
            {t('contact_support_text')}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Contact;
