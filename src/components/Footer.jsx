import React from 'react';
import { Github, ExternalLink, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TrustChainLogo from './TrustChainLogo';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden py-20 lg:py-32 text-center">

      {/* Light leaks */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: '-50px', right: '-50px',
          width: '400px', height: '400px',
          background: '#f97316',
          filter: 'blur(120px)',
          opacity: 0.05,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: '-50px', left: '-50px',
          width: '400px', height: '400px',
          background: '#1e3a8a',
          filter: 'blur(120px)',
          opacity: 0.06,
        }}
      />

      {/* Ghost brand mark */}
      <span className="font-clash font-bold text-[20vw] text-white/[0.03] absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none leading-none whitespace-nowrap">
        TC
      </span>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8" style={{ background: 'transparent' }}>
          <TrustChainLogo size={56} className="opacity-80" />
        </div>

        {/* Main CTA */}
        <a
          href="https://trust-chain.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <h2 className="font-clash text-3xl md:text-5xl font-bold tracking-tighter border-b border-white/20 pb-1 hover:opacity-60 hover:border-b-4 transition-all cursor-pointer">
            trust-chain.vercel.app
          </h2>
        </a>

        {/* Subtext */}
        <p className="text-sm font-inter font-light text-white/40 mt-6 max-w-md mx-auto">
          {t('footer.desc', 'Empowering the informal economy through verifiable on-chain credentials')}
        </p>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-inter">
              {t('footer.rights', '© 2024 TRUSTCHAIN')} · STELLAR SOROBAN
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/OmcarSN/TrustChain"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors font-inter flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              GITHUB
            </a>
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors font-inter flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              STELLAR
            </a>
            <a
              href="https://www.freighter.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors font-inter flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              FREIGHTER
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
