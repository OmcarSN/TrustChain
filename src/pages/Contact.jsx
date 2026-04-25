import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Globe, ExternalLink } from 'lucide-react';

const Contact = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ paddingTop: '120px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh', paddingBottom: '80px' }}>
      
      <h1 className="font-clash" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', color: '#ffffff', marginBottom: '40px', textTransform: 'uppercase' }}>
        {t('contact.title', 'Contact Us')}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
        {/* GitHub */}
        <a href="https://github.com/OmcarSN/TrustChain" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }} className="group">
          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
            <Github className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-inter uppercase" style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px', fontWeight: 'bold' }}>GitHub</p>
            <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>github.com/trustchain</p>
          </div>
        </a>

        {/* Stellar */}
        <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }} className="group">
          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
            <Globe className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-inter uppercase" style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px', fontWeight: 'bold' }}>Stellar</p>
            <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>stellar.org</p>
          </div>
        </a>

        {/* Freighter */}
        <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }} className="group">
          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
            <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-inter uppercase" style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px', fontWeight: 'bold' }}>Freighter</p>
            <p className="font-inter text-white/60 group-hover:text-white transition-colors" style={{ fontSize: '15px' }}>freighter.app</p>
          </div>
        </a>
      </div>

      <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8' }} className="font-inter">
          For support or partnerships, reach out via GitHub.
        </p>
      </div>

    </div>
  );
};

export default Contact;
