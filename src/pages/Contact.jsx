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
    <div className="tc-page" style={{ maxWidth: '800px' }}>
      
      <h1 className="font-clash tc-heading-hero tc-mb-2xl">
        {t('contact_us')}
      </h1>

      <div className="tc-flex-col tc-mb-3xl" style={{ gap: '20px' }}>
        {/* GitHub */}
        <a href="https://github.com/OmcarSN/TrustChain" target="_blank" rel="noopener noreferrer" className="tc-flex tc-flex-gap group" style={{ textDecoration: 'none', alignItems: 'center' }}>
          <div className="tc-activity-icon" style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
            <Github className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px' }}>GitHub</p>
            <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>github.com/OmcarSN/TrustChain</p>
          </div>
        </a>

        {/* Stellar */}
        <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="tc-flex tc-flex-gap group" style={{ textDecoration: 'none', alignItems: 'center' }}>
          <div className="tc-activity-icon" style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
            <Globe className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px' }}>Stellar</p>
            <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>stellar.org</p>
          </div>
        </a>

        {/* Freighter */}
        <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer" className="tc-flex tc-flex-gap group" style={{ textDecoration: 'none', alignItems: 'center' }}>
          <div className="tc-activity-icon" style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
            <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-inter tc-label tc-mb-xs" style={{ letterSpacing: '2px' }}>Freighter</p>
            <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>freighter.app</p>
          </div>
        </a>
      </div>

      <div className="tc-divider-light" style={{ paddingTop: '24px' }}>
        <p className="font-inter tc-body-lg" style={{ fontSize: '16px' }}>
          {t('contact_support_text')}
        </p>
      </div>

    </div>
  );
};

export default Contact;
