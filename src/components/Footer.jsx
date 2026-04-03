import React from 'react';
import { Github, ExternalLink, Shield, Globe, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5 py-8 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/3 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-white/5 pb-8 items-start">
          {/* Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-black tracking-tighter uppercase italic">Trust<span className="text-accent underline decoration-2 decoration-accent underline-offset-4">Chain</span></span>
            </div>
            <p className="text-white/30 font-medium text-xs leading-relaxed max-w-[220px]">
              Revolutionizing informal economy credentials through on-chain verified identity.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">Connect & Explore</h4>
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
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">Technology Stack</h4>
            <p className="text-xs font-bold text-white/50">Built on Stellar Testnet</p>
            <p className="text-[11px] font-medium text-white/25">React + Vite · Freighter Wallet · ManageData Ops</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-white/15 uppercase tracking-widest">© 2026 TrustChain Protocol</span>
            <div className="w-1 h-1 rounded-full bg-white/8" />
            <span className="text-[9px] font-black text-white/15 uppercase tracking-widest">Sovereign Identity Foundation</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/5 border border-green-500/8 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] font-black text-green-500/50 uppercase tracking-widest">Stellar Testnet Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
