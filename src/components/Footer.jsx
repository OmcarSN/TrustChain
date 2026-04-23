import React from 'react';
import { Github, ExternalLink, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TrustChainLogo from './TrustChainLogo';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#0a0a0a] relative overflow-hidden" style={{ paddingTop: '32px', paddingBottom: '32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6" style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '3vw', paddingRight: '3vw', width: '100%' }}>
        
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3 w-full md:w-1/3 justify-center md:justify-start">
          <TrustChainLogo size={32} className="opacity-90" />
          <span className="font-clash font-bold text-lg tracking-widest text-white uppercase">
            TRUSTCHAIN
          </span>
        </div>

        {/* Center: Copyright */}
        <div className="w-full md:w-1/3 flex justify-center text-center">
          <span className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-inter">
            {t('footer.rights', '© 2026 TRUSTCHAIN PROTOCOL')} · STELLAR SOROBAN
          </span>
        </div>

        {/* Right: Links */}
        <div className="w-full md:w-1/3 flex flex-wrap justify-center md:justify-end items-center gap-6">
          <a
            href="https://github.com/OmcarSN/TrustChain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors font-inter flex items-center gap-1.5 hover:underline underline-offset-4"
          >
            <Github className="w-3.5 h-3.5" />
            GITHUB
          </a>
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors font-inter flex items-center gap-1.5 hover:underline underline-offset-4"
          >
            <Globe className="w-3.5 h-3.5" />
            STELLAR
          </a>
          <a
            href="https://www.freighter.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors font-inter flex items-center gap-1.5 hover:underline underline-offset-4"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            FREIGHTER
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
