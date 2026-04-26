import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Menu, X, LogOut, LayoutDashboard, Languages } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../context/WalletContext';
import TrustChainLogo from './TrustChainLogo';

const Navbar = () => {
  const location = useLocation();
  const { walletAddress, isConnected, connect, disconnect } = useWallet();
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const truncate = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const navLinks = isConnected ? [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.discover', 'Find Workers'), path: '/discover' },
  ] : [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.discover', 'Find Workers'), path: '/discover' },
    { name: t('nav.howItWorks', 'How It Works'), path: '/how-it-works' },
  ];

  return (
    <>
      <nav 
        className="fixed top-0 left-0 w-full z-50 bg-[#050505]/95 backdrop-blur-md transition-all duration-300"
        style={{ animation: 'navSlideDown 0.6s cubic-bezier(0.16,1,0.3,1) forwards' }}
      >
        <style>{`
          @keyframes navSlideDown {
            from { transform: translateY(-100%); opacity: 0; }
            to   { transform: translateY(0);     opacity: 1; }
          }
          @keyframes gradientSlide {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .navbar-border-bottom {
            height: 1px;
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(0,220,110,0.3) 50%, rgba(255,255,255,0.1) 80%, transparent 100%);
            background-size: 200% auto;
            animation: gradientSlide 4s linear infinite;
            pointer-events: none;
            z-index: 0;
          }
        `}</style>
        <div className="navbar-border-bottom" />
        <div 
          className="h-[80px]"
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '100%', 
            boxSizing: 'border-box', 
            maxWidth: '1400px',
            margin: '0 auto',
            paddingLeft: '3vw',
            paddingRight: '3vw'
          }}
        >
          
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <TrustChainLogo size={36} />
            <div className="flex flex-col leading-none">
              <span className="font-clash font-bold text-white text-lg tracking-widest uppercase">
                TRUSTCHAIN
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-inter mt-0.5">
                {t('nav.verifiedEconomy', 'Verified Economy')}
              </span>
            </div>
          </Link>

          {/* Center Nav Links (Desktop) */}
          <div className="hidden md:flex items-center h-full" style={{ gap: '32px' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path && !link.path.includes('#');
              const isHash = link.path.includes('#');
              const LinkComp = isHash ? 'a' : Link;
              const linkProps = isHash ? { href: link.path } : { to: link.path };
              
              return (
                <LinkComp
                  key={link.path}
                  {...linkProps}
                  className="font-inter uppercase nav-link transition-all"
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    letterSpacing: '1.5px',
                    color: isActive ? '#ffffff' : '#666666',
                    borderBottom: isActive ? '1px solid #ffffff' : '1px solid transparent',
                    paddingBottom: '4px',
                    textDecoration: 'none'
                  }}
                >
                  {link.name}
                </LinkComp>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="relative h-full">
            {/* Language toggle */}
            <style>{`
              .lang-btn:hover { border-color: rgba(255,255,255,0.5) !important; color: #fff !important; }
              .wallet-btn:hover { background-color: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.3) !important; }
              .connect-btn-refine:hover { 
                background-color: rgba(255,255,255,0.06) !important; 
                border-color: rgba(255,255,255,0.5) !important; 
                color: #fff !important; 
              }
              @keyframes verifiedPulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(0,220,110,0.4); }
                50%       { box-shadow: 0 0 0 6px rgba(0,220,110,0); }
              }
              @keyframes dropdownOpen {
                from { opacity: 0; transform: translateY(-6px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              .nav-link:hover { color: #aaaaaa !important; }
              .dropdown-item { 
                padding: 10px 16px; 
                color: #aaaaaa; 
                font-size: 13px; 
                text-decoration: none; 
                display: block; 
                transition: all 0.2s ease; 
              }
              .dropdown-item:hover { background-color: #1a1a1a !important; color: #ffffff !important; }
              .dropdown-disconnect { color: #ef4444 !important; border-top: 1px solid #222222; }
              .dropdown-disconnect:hover { background-color: rgba(239,68,68,0.08) !important; color: #ff5555 !important; }
            `}</style>
            <button
              onClick={toggleLanguage}
              title="Toggle Language"
              className="lang-btn font-inter uppercase"
              style={{
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '7px 12px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '1.5px',
                cursor: 'pointer',
                borderRadius: '0',
                transition: 'all 0.2s ease',
              }}
            >
              {i18n.language === 'en' ? 'EN ▾' : 'HI ▾'}
            </button>

            {/* Desktop wallet button */}
            {isConnected ? (
              <div className="relative flex items-center h-full" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hidden sm:flex wallet-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '36px',
                    padding: '0 16px',
                    backgroundColor: isDropdownOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                    border: isDropdownOpen ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    borderRadius: '0',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#00dc6e',
                    boxShadow: '0 0 6px rgba(0,220,110,0.6)',
                    flexShrink: 0,
                    animation: 'verifiedPulse 2s ease infinite',
                  }} />
                  {truncate(walletAddress)}
                  <span style={{ 
                    fontSize: '10px', 
                    marginLeft: '4px',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    display: 'inline-block'
                  }}>
                    ▾
                  </span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        minWidth: '200px',
                        backgroundColor: '#111111',
                        border: '1px solid #222222',
                        borderRadius: '8px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                        zIndex: 1000,
                        overflow: 'hidden',
                        padding: '8px 0',
                        animation: 'dropdownOpen 0.15s ease forwards',
                      }}
                    >
                      <div style={{
                        padding: '10px 16px',
                        fontSize: '13px',
                        color: '#aaaaaa',
                        fontFamily: 'monospace',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ color: '#00dc6e', fontSize: '8px' }}>●</span>
                        {truncate(walletAddress)}
                      </div>
                      <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="dropdown-item font-inter">
                        {t('nav_dashboard')}
                      </Link>
                      <Link to="/worker" onClick={() => setIsDropdownOpen(false)} className="dropdown-item font-inter">
                        {t('nav_worker_portal')}
                      </Link>
                      <Link to="/how-it-works" onClick={() => setIsDropdownOpen(false)} className="dropdown-item font-inter">
                        {t('nav.howItWorks', 'How It Works')}
                      </Link>
                      <Link to="/analytics" onClick={() => setIsDropdownOpen(false)} className="dropdown-item font-inter">
                        {t('nav_analytics')}
                      </Link>
                      <Link to="/explorer" onClick={() => setIsDropdownOpen(false)} className="dropdown-item font-inter">
                        {t('nav_explorer')}
                      </Link>
                      <button
                        onClick={() => {
                          disconnect();
                          setIsDropdownOpen(false);
                        }}
                        className="dropdown-item dropdown-disconnect font-inter w-full text-left"
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        {t('nav_disconnect')}
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={connect}
                className="hidden sm:flex items-center justify-center gap-2 connect-btn-refine"
                style={{ 
                  height: '34px',
                  padding: '8px 18px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backgroundColor: 'transparent',
                  color: 'rgba(255,255,255,0.8)',
                  borderRadius: '0',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Wallet style={{ width: '12px', height: '12px' }} />
                {t('nav.connectWallet', 'Connect Wallet')}
              </button>
            )}

            {/* Hamburger menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 border border-white/10 rounded-[2px] hover:border-white/30 transition-all text-white relative z-[60]"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 z-[45]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#050505] border-l border-white/5 z-[55] flex flex-col"
            >
              <div className="px-8 pt-24 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <TrustChainLogo size={28} />
                  <span className="font-clash font-bold text-lg tracking-widest uppercase">TRUSTCHAIN</span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">{t('nav.navigationMenu', 'Navigation Menu')}</p>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: 'none' }}>
                <div className="space-y-1">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center gap-4 px-4 py-4 rounded-[2px] font-inter font-bold uppercase tracking-[0.15em] text-[11px] transition-all ${
                          location.pathname === link.path
                            ? 'bg-white text-black'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.name}
                        {location.pathname === link.path && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile Wallet Section */}
              <div className="px-6 py-6 border-t border-white/5">
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 border border-white/10 rounded-[2px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="font-mono text-xs text-white/60">{truncate(walletAddress)}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="w-full py-3.5 bg-white/5 border border-white/10 text-white rounded-[2px] font-bold uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2 hover:bg-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t('nav.dashboardBtn', 'Dashboard')}
                    </Link>
                    <Link
                      to="/how-it-works"
                      className="w-full py-3.5 bg-transparent border border-white/10 text-white/70 rounded-[2px] font-bold uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2 hover:bg-white/5 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.howItWorks', 'How It Works')}
                    </Link>
                    <button
                      onClick={() => {
                        disconnect();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3.5 border border-red-400/20 text-red-400/70 rounded-[2px] font-bold uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2 hover:bg-red-400/5"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav.disconnectWallet', 'Disconnect Wallet')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-4 bg-white text-black rounded-[2px] font-bold uppercase tracking-[0.15em] text-[11px] transition-all flex items-center justify-center gap-2 hover:opacity-85"
                  >
                    <Wallet className="w-4 h-4" />
                    {t('nav.connectFreighter', 'Connect Freighter')}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
