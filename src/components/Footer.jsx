import React from 'react';
import { Github, ExternalLink, Shield, Globe, ShieldCheck, Sparkles, Heart, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-white/[0.04] relative overflow-hidden">
      {/* Subtle top gradient line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/3 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 pb-8 border-b border-white/[0.04]">
          
          {/* Brand — takes more space */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-black tracking-tighter uppercase italic">Trust<span className="text-accent underline decoration-2 decoration-accent underline-offset-4">Chain</span></span>
                <span className="text-[7px] font-black uppercase tracking-[0.35em] text-white/25 mt-0.5">Verified Economy</span>
              </div>
            </Link>
            <p className="text-white/20 font-medium text-xs leading-relaxed max-w-[280px]">
              Revolutionizing informal economy credentials through decentralized, on-chain verified identity on the Stellar network.
            </p>
            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-1.5">
              {['Stellar', 'React', 'Vite', 'Freighter'].map(tech => (
                <span key={tech} className="px-2 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded text-[8px] font-bold text-white/20 uppercase tracking-wider">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20 mb-3">Platform</h4>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Register as Worker', path: '/worker' },
                { name: 'Find Workers', path: '/discover' },
                { name: 'Endorse Worker', path: '/endorse' },
                { name: 'Verify Credentials', path: '/verify' },
                { name: 'Analytics', path: '/analytics' },
              ].map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="text-white/25 hover:text-accent text-[11px] font-semibold transition-colors hover:translate-x-0.5 transform"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20 mb-3">Connect & Explore</h4>
            <div className="flex flex-col gap-2.5">
              <a href="https://github.com/OmcarSN/TrustChain" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-white/30 hover:text-white transition-all font-bold text-[11px] group">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-accent/20 transition-all">
                  <Github className="w-3.5 h-3.5" />
                </div>
                GitHub Repository
              </a>
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-white/30 hover:text-white transition-all font-bold text-[11px] group">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-accent/20 transition-all">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                Stellar Network
              </a>
              <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-white/30 hover:text-white transition-all font-bold text-[11px] group">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-accent/20 transition-all">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                Freighter Wallet
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-white/12 uppercase tracking-widest">© 2026 TrustChain Protocol</span>
            <div className="w-0.5 h-0.5 rounded-full bg-white/8" />
            <span className="text-[9px] font-bold text-white/12 uppercase tracking-widest flex items-center gap-1">
              Built with <Heart className="w-2.5 h-2.5 text-red-400/40 fill-red-400/40" /> on Stellar
            </span>
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
