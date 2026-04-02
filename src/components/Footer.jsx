import React from 'react';
import { Github, ExternalLink, Shield, Globe, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5 py-12 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-white/5 pb-12 items-start">
          
          {/* Logo Section */}
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-black tracking-tighter uppercase italic">Trust<span className="text-accent underline decoration-2 decoration-accent underline-offset-4">Chain</span></span>
             </div>
             <p className="text-white/40 font-medium text-sm leading-relaxed max-w-[240px]">
                Revolutionizing informal economy credentials through on-chain verified identity.
             </p>
          </div>

          {/* Social / Link Section */}
          <div className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Connect & Explore</h4>
             <div className="flex flex-col gap-3">
                <a href="https://github.com/Omcar/trustchain" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-bold text-xs group">
                   <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" /> GitHub Repository
                </a>
                <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-bold text-xs group">
                   <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /> Stellar Network
                </a>
                <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-bold text-xs group">
                   <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" /> Freighter Wallet
                </a>
             </div>
          </div>

          {/* Technology Section */}
          <div className="space-y-4 text-left md:text-right">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Technology Stack</h4>
             <p className="text-sm font-bold text-white/60">Built on Stellar Testnet</p>
             <p className="text-xs font-medium text-white/30">React + Vite · Freighter Wallet · ManageData Ops</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">© 2026 TrustChain Protocol</span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Sovereign Identity Foundation</span>
           </div>
           
           <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/5 border border-green-500/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black text-green-500/60 uppercase tracking-widest">Stellar Testnet Live</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
