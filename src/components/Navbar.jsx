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

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.discover', 'Find Workers'), path: '/discover' },
    { name: t('nav.explorer', 'Explorer'), path: '/explorer' },
    { name: t('nav.analytics', 'Analytics'), path: '/analytics' },
    { name: t('nav.dashboard', 'Dashboard'), path: '/dashboard' },
    { name: t('nav.workerPortal', 'Worker Portal'), path: '/worker' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50" style={{ mixBlendMode: 'difference' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[80px] flex items-center justify-between">
          
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
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-inter text-[11px] font-bold uppercase tracking-[0.18em] transition-opacity duration-300 ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-white/20" />
                )}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 relative">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              title="Toggle Language"
              className="p-2.5 border border-white/10 rounded-[2px] hover:border-white/30 transition-all relative group flex items-center justify-center shrink-0"
            >
              <Languages className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white/10 rounded-[2px] border border-white/20 flex items-center justify-center text-[7px] font-bold tracking-wider">
                {i18n.language === 'en' ? 'EN' : 'HI'}
              </div>
            </button>

            {/* Desktop wallet button */}
            {isConnected ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hidden sm:flex items-center gap-2 border border-white/10 rounded-[2px] px-4 py-2.5 hover:border-white/30 transition-all"
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-[11px] tracking-[0.12em] font-mono text-white/70">
                    {truncate(walletAddress)}
                  </span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-[2px] overflow-hidden z-[60]"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        {t('nav.dashboardBtn', 'Dashboard')}
                      </Link>
                      <div className="border-t border-white/5" />
                      <button
                        onClick={() => {
                          disconnect();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-red-400/70 hover:bg-red-400/5 hover:text-red-400 transition-all flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {t('nav.disconnect', 'Disconnect')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={connect}
                className="hidden sm:flex items-center gap-2 border border-white/20 rounded-[2px] px-6 py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all duration-300"
              >
                <Wallet className="w-4 h-4" />
                {t('nav.connectWallet', 'Connect Wallet')}
              </button>
            )}

            {/* Hamburger menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 border border-white/10 rounded-[2px] hover:border-white/30 transition-all text-white relative z-[60]"
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
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t('nav.dashboardBtn', 'Dashboard')}
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
