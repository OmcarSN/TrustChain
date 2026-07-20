import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Globe, ExternalLink, Twitter } from 'lucide-react';

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
    <div style={{ position: 'relative', minHeight: '100vh', background: '#05060A', overflow: 'hidden' }}>
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
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(79,107,237,0.2), rgba(124,147,242,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Github className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px' }}>GitHub</p>
              <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>github.com/OmcarSN/TrustChain</p>
            </div>
          </a>

          {/* X / Twitter */}
          <a href="https://x.com/TrustChainXLM" target="_blank" rel="noopener noreferrer" className="glass-card hover-scale group" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
            <div className="flex items-center justify-center bg-[#7C93F2]/10 group-hover:bg-[#7C93F2]/20 transition-colors" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', color: '#7C93F2' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div>
              <p className="font-clash font-bold text-white tracking-widest uppercase mb-1" style={{ fontSize: '12px' }}>X (Twitter)</p>
              <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>x.com/TrustChainXLM</p>
            </div>
          </a>

          {/* Stellar */}
          <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="glass-card hover-scale group" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(79,107,237,0.2), rgba(124,147,242,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Globe className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px' }}>Stellar</p>
              <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>stellar.org</p>
            </div>
          </a>

          {/* Freighter */}
          <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer" className="glass-card hover-scale group" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(124,147,242,0.2), rgba(61,86,201,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ExternalLink className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px' }}>Freighter</p>
              <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>freighter.app</p>
            </div>
          </a>

          {/* Stellar Expert (Sponsor) */}
          <a href="https://stellar.expert/explorer/public/account/GAPTP3YBWMIGE3GT3FDRAOOCLO6ZLZ2U7IIGK2VQBGDL2NLVAZX5E57A" target="_blank" rel="noopener noreferrer" className="glass-card hover-scale group" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(22,163,74,0.3), rgba(22,163,74,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ExternalLink className="w-5 h-5 text-green-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px', color: '#16A34A' }}>Sponsor Wallet (Explorer)</p>
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
