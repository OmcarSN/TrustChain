import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, LogOut, LayoutDashboard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import TrustChainLogo from '../TrustChainLogo';

import PropTypes from 'prop-types';

/**
 * MobileMenu — Slide-out mobile navigation panel with backdrop overlay.
 * Renders nav links, wallet connection/disconnect actions, and a
 * dashboard shortcut. Includes focus trapping and Escape-key dismissal
 * for accessibility.
 *
 * @param {Object} props
 * @param {boolean} props.isMobileMenuOpen - Whether the menu is open.
 * @param {Function} props.setIsMobileMenuOpen - Toggle menu state.
 * @param {Array<{name: string, path: string}>} props.navLinks - Navigation links array.
 * @param {Object} props.location - React Router location object.
 * @param {boolean} props.isConnected - Whether a wallet is connected.
 * @param {string} props.walletAddress - Full Stellar wallet address.
 * @param {Function} props.connect - Connect wallet callback.
 * @param {Function} props.disconnect - Disconnect wallet callback.
 * @param {Function} props.truncate - Address truncation helper.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The MobileMenu component.
 */
const MobileMenu = ({
  isMobileMenuOpen, setIsMobileMenuOpen,
  navLinks, location,
  isConnected, walletAddress, connect, disconnect, truncate, t
}) => {
  const menuPanelRef = React.useRef(null);

  // Focus trap: move focus into menu when opened, Escape to close
  React.useEffect(() => {
    if (isMobileMenuOpen && menuPanelRef.current) {
      const firstLink = menuPanelRef.current.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }
  }, [isMobileMenuOpen]);

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsMobileMenuOpen(false);
    }
  }, [setIsMobileMenuOpen]);

  return (
  <AnimatePresence>
    {isMobileMenuOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[45]"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Panel */}
        <motion.div
          ref={menuPanelRef}
          onKeyDown={handleKeyDown}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed top-0 right-0 h-full w-full bg-[#050505]/95 backdrop-blur-2xl border-l border-white/10 z-[55] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.mobileMenuLabel', 'Mobile navigation menu')}
        >
          <div className="px-6 pt-[100px] pb-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrustChainLogo size={28} />
              <span className="font-clash font-bold text-lg tracking-widest uppercase text-white">TRUSTCHAIN</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#00dc6e]/70">{t('nav.navigationMenu', 'Navigation Menu')}</p>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto px-6 py-8" style={{ scrollbarWidth: 'none' }} aria-label={t('nav.mobileNavLabel', 'Mobile navigation links')}>
            <style>{`
              .mobile-nav-item { transition: all 0.25s cubic-bezier(0.16,1,0.3,1); border-left: 2px solid transparent; }
              .mobile-nav-item:hover:not(.active-mobile-link) {
                background-color: rgba(255,255,255,0.04);
                color: #ffffff !important;
                padding-left: 24px;
                border-left: 2px solid #00dc6e;
              }
              .active-mobile-link { 
                background-color: rgba(0,220,110,0.1); 
                color: #00dc6e !important; 
                border-left: 2px solid #00dc6e; 
                box-shadow: inset 0 0 12px rgba(0,220,110,0.05); 
              }
            `}</style>
            <div className="space-y-4" role="menu">
              {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      role="menuitem"
                      aria-current={isActive ? 'page' : undefined}
                      className={`mobile-nav-item flex items-center gap-4 px-4 py-4 rounded-[6px] font-inter font-bold uppercase tracking-[0.15em] text-[11px] ${isActive ? 'active-mobile-link' : 'text-white/50'}`}
                    >
                      {link.name}
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00dc6e] shadow-[0_0_8px_rgba(0,220,110,0.8)]" aria-hidden="true" />}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </nav>

          {/* Mobile Wallet Section */}
          <div className="px-6 py-8 border-t border-white/10">
            {isConnected ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 border border-white/10 rounded-[6px] bg-white/5">
                  <span className="w-2 h-2 rounded-full bg-[#00dc6e] shadow-[0_0_8px_rgba(0,220,110,0.6)]" aria-hidden="true" />
                  <span className="font-mono text-xs text-white/80">{truncate(walletAddress)}</span>
                </div>
                <Link to="/dashboard" className="w-full py-4 bg-white/10 border border-white/20 text-white rounded-[6px] font-bold uppercase tracking-[0.15em] text-[11px] transition-all flex items-center justify-center gap-2 hover:bg-white/15" onClick={() => setIsMobileMenuOpen(false)}>
                  <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> {t('nav.dashboardBtn', 'Dashboard')}
                </Link>
                <button onClick={() => { disconnect(); setIsMobileMenuOpen(false); }} aria-label={t('nav.disconnectLabel', 'Disconnect wallet')} className="w-full py-4 border border-red-500/30 text-red-400 rounded-[6px] font-bold uppercase tracking-[0.15em] text-[11px] transition-all flex items-center justify-center gap-2 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" aria-hidden="true" /> {t('nav.disconnectWallet', 'Disconnect Wallet')}
                </button>
              </div>
            ) : (
              <button onClick={() => { connect(); setIsMobileMenuOpen(false); }} aria-label={t('nav.connectMobileLabel', 'Connect Freighter wallet')} className="w-full py-4 text-white rounded-[6px] font-bold uppercase tracking-[0.15em] text-[11px] transition-all flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 20px rgba(34,197,94,0.3)', border: '1px solid rgba(34,197,94,0.5)' }}>
                <Wallet className="w-4 h-4" aria-hidden="true" /> {t('nav.connectFreighter', 'Connect Freighter')}
              </button>
            )}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
  );
};

export default MobileMenu;

MobileMenu.propTypes = {
  /** Whether the mobile menu is currently open. */
  isMobileMenuOpen: PropTypes.bool.isRequired,
  /** Toggle mobile menu open/close state. */
  setIsMobileMenuOpen: PropTypes.func.isRequired,
  /** Array of navigation link objects. */
  navLinks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  })).isRequired,
  /** React Router location object. */
  location: PropTypes.object.isRequired,
  /** Whether a wallet is currently connected. */
  isConnected: PropTypes.bool.isRequired,
  /** Full Stellar wallet address. */
  walletAddress: PropTypes.string,
  /** Connect wallet callback. */
  connect: PropTypes.func.isRequired,
  /** Disconnect wallet callback. */
  disconnect: PropTypes.func.isRequired,
  /** Address truncation helper function. */
  truncate: PropTypes.func.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};
