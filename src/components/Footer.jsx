import React from 'react';
import { Github, ExternalLink, Globe, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TrustChainLogo from './TrustChainLogo';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5 relative overflow-hidden">
      {/* Top gradient accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/3 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-white/5 pb-8 items-start">
          {/* Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrustChainLogo size={28} />
              <span className="text-base font-black tracking-tighter uppercase italic">Trust<span className="text-accent underline decoration-2 decoration-accent underline-offset-4">Chain</span></span>
            </div>
            <p className="text-white/30 font-medium text-xs leading-relaxed max-w-[220px]">
              {t('footer.desc')}
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">{t('footer.connect')}</h4>
            <div className="flex flex-col gap-2">
              <a href="https://github.com/OmcarSN/TrustChain" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/35 hover:text-white transition-colors font-bold text-[11px] group">
                <Github className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> GitHub Repository
              </a>
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/35 hover:text-white transition-colors font-bold text-[11px] group">
                <ExternalLink className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /> Stellar Network
              </a>
              <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/35 hover:text-white transition-colors font-bold text-[11px] group">
                <Globe className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Freighter Wallet
              </a>
            </div>
          </div>

          {/* Tech */}
          <div className="space-y-3 text-left md:text-right">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">{t('footer.tech')}</h4>
            <p className="text-xs font-bold text-white/50">{t('footer.builtOn')}</p>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {['React', 'Vite', 'Soroban', 'Freighter'].map(tech => (
                <span key={tech} className="px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[9px] font-bold text-white/30 uppercase tracking-wider">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-white/15 uppercase tracking-widest">{t('footer.rights')}</span>
            <div className="w-1 h-1 rounded-full bg-white/8" />
            <span className="text-[9px] font-black text-white/15 uppercase tracking-widest">{t('footer.foundation')}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/5 border border-green-500/8 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] font-black text-green-500/50 uppercase tracking-widest">{t('footer.live')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
