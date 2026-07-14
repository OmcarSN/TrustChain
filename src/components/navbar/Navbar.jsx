import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../../context/WalletContext';
import TrustChainLogo from '../TrustChainLogo';
import DesktopNavLinks from './DesktopNavLinks';
import WalletDropdown from './WalletDropdown';
import MobileMenu from './MobileMenu';

/**
 * Navbar — Global navigation bar orchestrator.
 * Manages state for the wallet dropdown, mobile menu, route-change
 * handling, click-outside dismissal, and body-scroll-lock. Delegates
 * rendering to DesktopNavLinks, WalletDropdown, and MobileMenu
 * sub-components.
 *
 * @returns {React.ReactElement} The Navbar component.
 */
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
  const closeMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, []);

   
  useEffect(() => {
    closeMenus();
  }, [location.pathname, closeMenus]);

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
    { name: t('nav.discover', 'Find Workers'), path: '/discover' }
  ] : [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.discover', 'Find Workers'), path: '/discover' },
    { name: t('nav.howItWorks', 'How It Works'), path: '/how-it-works' }
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 navbar-glass transition-all duration-300"
        style={{ animation: 'navSlideDown 0.6s cubic-bezier(0.16,1,0.3,1) forwards' }}
        aria-label="Main navigation"
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
            height: 1px; width: 100%; position: absolute; bottom: 0; left: 0;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(0,220,110,0.3) 50%, rgba(255,255,255,0.1) 80%, transparent 100%);
            background-size: 200% auto;
            animation: gradientSlide 4s linear infinite;
            pointer-events: none; z-index: 0;
          }
          @keyframes verifiedPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(0,220,110,0.4); }
            50%       { box-shadow: 0 0 0 6px rgba(0,220,110,0); }
          }
          @keyframes dropdownOpen {
            from { opacity: 0; transform: translateY(-8px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .lang-btn { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
          .lang-btn:hover { border-color: rgba(255,255,255,0.5) !important; color: #fff !important; transform: translateY(-1px); }
          .wallet-btn { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
          .wallet-btn:hover { background-color: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.4) !important; transform: translateY(-1px); }
          .connect-btn-refine { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
          .connect-btn-refine:hover {
            background: linear-gradient(135deg, #22c55e, #16a34a) !important;
            border-color: rgba(34,197,94,0.6) !important;
            color: #ffffff !important; transform: translateY(-1px);
            box-shadow: 0 0 20px rgba(34,197,94,0.35), 0 4px 14px rgba(34,197,94,0.2);
          }
          .nav-link { position: relative; color: rgba(255,255,255,0.5); transition: color 0.3s ease; }
          .nav-link:hover { color: #ffffff; }
          .nav-link.active-link { color: #ffffff; }
          .nav-link::after {
            content: ''; position: absolute; bottom: -6px; left: 0; width: 100%; height: 2px;
            background-color: #00dc6e; transform: scaleX(0); transform-origin: right; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
          }
          .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }
          .nav-link.active-link::after { transform: scaleX(1); transform-origin: left; background-color: #ffffff; }
          .dropdown-item {
            padding: 11px 20px; color: rgba(255,255,255,0.55); font-size: 12px;
            letter-spacing: 1px; font-weight: 600; text-transform: uppercase;
            text-decoration: none; display: flex; align-items: center; gap: 10px; border-left: 2px solid transparent;
            transition: all 0.25s cubic-bezier(0.16,1,0.3,1); margin: 0 6px; border-radius: 6px;
          }
          .dropdown-item:hover { background: rgba(0,220,110,0.06) !important; color: #ffffff !important; padding-left: 24px; border-left: 2px solid #00dc6e; box-shadow: inset 0 0 20px rgba(0,220,110,0.03); }
          .dropdown-disconnect { color: #ef4444 !important; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 6px; padding-top: 12px; border-radius: 0 0 6px 6px; }
          .dropdown-disconnect:hover { background: rgba(239,68,68,0.08) !important; color: #ff5555 !important; border-left: 2px solid #ef4444; box-shadow: inset 0 0 20px rgba(239,68,68,0.03); }
        `}</style>
        <div className="navbar-border-bottom" aria-hidden="true" />
        <div
          className="h-[80px]"
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            width: '100%', boxSizing: 'border-box', maxWidth: '1400px',
            margin: '0 auto', paddingLeft: '3vw', paddingRight: '3vw'
          }}
        >
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="TrustChain home">
            <div className="transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110 group-hover:rotate-6">
              <TrustChainLogo size={36} />
            </div>
            <div className="flex flex-col leading-none transition-all duration-300 group-hover:opacity-80 group-hover:translate-x-1">
              <span className="font-clash font-bold text-lg tracking-widest uppercase" style={{ background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 50%, #22c55e 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TRUSTCHAIN</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-inter mt-0.5 group-hover:text-[#00dc6e] transition-colors duration-300">
                {t('nav.verifiedEconomy', 'Verified Economy')}
              </span>
            </div>
          </Link>

          {/* Center Nav Links (Desktop) */}
          <DesktopNavLinks navLinks={navLinks} location={location} />

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="relative h-full">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              title="Toggle Language"
              aria-label={`Switch language to ${i18n.language === 'en' ? 'Hindi' : 'English'}`}
              className="lang-btn font-inter uppercase"
              style={{
                height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '7px 14px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)',
                fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px',
                cursor: 'pointer', borderRadius: '8px',
              }}
            >
              {i18n.language === 'en' ? 'EN ▾' : 'HI ▾'}
            </button>

            {/* Desktop wallet button */}
            <WalletDropdown
              isConnected={isConnected}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              walletAddress={walletAddress}
              connect={connect}
              disconnect={disconnect}
              dropdownRef={dropdownRef}
              truncate={truncate}
              t={t}
            />

            {/* Hamburger menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 border border-white/10 rounded-[2px] hover:border-white/30 transition-all text-white relative z-[60]"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        navLinks={navLinks}
        location={location}
        isConnected={isConnected}
        walletAddress={walletAddress}
        connect={connect}
        disconnect={disconnect}
        truncate={truncate}
        t={t}
      />
    </>
  );
};

export default Navbar;
