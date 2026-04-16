import React from 'react';
import { Github, ExternalLink, Shield, Globe, ShieldCheck, Sparkles, Heart, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrustChainLogo from './TrustChainLogo';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full filter pointer-events-none -z-10" style={{ background: 'rgba(30, 58, 138, 0.05)', blur: '120px' }} />

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 pb-10" style={{ borderBottom: '1px solid #E5E7EB' }}>
          
          {/* Brand */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="inline-flex flex-col gap-1 items-start group relative transition-transform hover:scale-105 origin-left">
              <TrustChainLogo size={180} />
            </Link>
            <p className="text-xs leading-relaxed max-w-[280px]" style={{ color: '#4B5563', fontWeight: 400 }}>
              Revolutionizing informal economy credentials through decentralized, on-chain verified identity on the Stellar network.
            </p>
            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-2">
              {['Stellar', 'React', 'Vite', 'Freighter'].map(tech => (
                <span key={tech} className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#4B5563' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="label-mono" style={{ color: '#6B7280' }}>Platform</h4>
            <div className="flex flex-col gap-2.5">
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
                  className="text-xs font-semibold transition-colors hover:translate-x-0.5 transform"
                  style={{ color: '#4B5563' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#1E3A8A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4B5563'}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="label-mono" style={{ color: '#6B7280' }}>Connect & Explore</h4>
            <div className="flex flex-col gap-3">
              <a href="https://github.com/OmcarSN/TrustChain" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-xs font-semibold group transition-colors" style={{ color: '#4B5563' }} onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#4B5563'}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}>
                  <Github className="w-4 h-4" />
                </div>
                GitHub Repository
              </a>
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-xs font-semibold group transition-colors" style={{ color: '#4B5563' }} onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#4B5563'}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}>
                  <Sparkles className="w-4 h-4" />
                </div>
                Stellar Network
              </a>
              <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-xs font-semibold group transition-colors" style={{ color: '#4B5563' }} onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#4B5563'}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}>
                  <Globe className="w-4 h-4" />
                </div>
                Freighter Wallet
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 label-mono" style={{ color: '#6B7280' }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#6B7280' }} /> © 2026 TrustChain
            </span>
            <div className="w-1 h-1 rounded-full" style={{ background: '#E5E7EB' }} />
            <span className="flex items-center gap-1.5 label-mono" style={{ color: '#6B7280' }}>
              Built with <Heart className="w-3 h-3 text-red-500 opacity-80" /> on Stellar
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981', animation: 'pulse-dot 2s infinite' }} />
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#059669' }}>Stellar Testnet Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
