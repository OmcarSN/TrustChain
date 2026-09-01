import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, LogOut, LayoutDashboard, Briefcase, HelpCircle, BarChart3, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import PropTypes from 'prop-types';

/**
 * WalletDropdown — Desktop wallet connection and actions dropdown.
 * When connected, renders a truncated wallet address button that toggles
 * a dropdown with navigation links and disconnect action. Supports
 * keyboard navigation (Escape, ArrowUp/Down, Tab wrapping).
 * When disconnected, renders a "Connect Wallet" button.
 *
 * @param {Object} props
 * @param {boolean} props.isConnected - Whether a wallet is connected.
 * @param {boolean} props.isDropdownOpen - Whether the dropdown is open.
 * @param {Function} props.setIsDropdownOpen - Toggle dropdown state.
 * @param {string} props.walletAddress - Full Stellar wallet address.
 * @param {Function} props.connect - Connect wallet callback.
 * @param {Function} props.disconnect - Disconnect wallet callback.
 * @param {Object} props.dropdownRef - React ref for click-outside detection.
 * @param {Function} props.truncate - Address truncation helper.
 * @param {Function} props.t - i18next translation function.
 * @returns {React.ReactElement} The WalletDropdown component.
 */
const WalletDropdown = ({
  isConnected, isDropdownOpen, setIsDropdownOpen,
  walletAddress, connect, disconnect, dropdownRef, truncate, t
}) => {
  const handleKeyDown = useCallback((e) => {
    if (!isDropdownOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsDropdownOpen(false);
      // Return focus to trigger button
      dropdownRef.current?.querySelector('button')?.focus();
      return;
    }

    const items = Array.from(dropdownRef.current?.querySelectorAll('[role="menuitem"]') || []);
    const currentIndex = items.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      items[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      items[prevIndex]?.focus();
    } else if (e.key === 'Tab' && !e.shiftKey && currentIndex === items.length - 1) {
      // Wrap focus to first item on last Tab
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'Tab' && e.shiftKey && currentIndex === 0) {
      // Wrap focus to last item on Shift+Tab at first
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }, [isDropdownOpen, setIsDropdownOpen, dropdownRef]);

  if (isConnected) {
    return (
      <div className="relative flex items-center h-full" ref={dropdownRef} onKeyDown={handleKeyDown}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`hidden sm:flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors cursor-pointer ${isDropdownOpen ? 'text-white' : ''}`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          aria-label={t('nav.walletMenuLabel', `Wallet menu for ${truncate(walletAddress)}`)}
        >
          <span className="tc-dot-pulse" aria-hidden="true" />
          <span>{truncate(walletAddress)}</span>
          <span style={{ fontSize: '10px', marginLeft: '2px', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)', display: 'inline-block', opacity: 0.6 }} aria-hidden="true">▾</span>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <div
              role="menu"
              aria-label={t('nav.walletDropdownLabel', 'Wallet actions')}
              className="tc-dropdown"
            >
              <div className="tc-dropdown-header">
                <span className="tc-dropdown-dot" aria-hidden="true" />
                {truncate(walletAddress)}
              </div>
              <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="dropdown-item font-inter" role="menuitem" tabIndex={0}><LayoutDashboard style={{ width: 14, height: 14, opacity: 0.5 }} />{t('nav_dashboard', 'Dashboard')}</Link>
              <Link to="/worker" onClick={() => setIsDropdownOpen(false)} className="dropdown-item font-inter" role="menuitem" tabIndex={0}><Briefcase style={{ width: 14, height: 14, opacity: 0.5 }} />{t('nav_worker_portal', 'Worker Portal')}</Link>
              <Link to="/how-it-works" onClick={() => setIsDropdownOpen(false)} className="dropdown-item font-inter" role="menuitem" tabIndex={0}><HelpCircle style={{ width: 14, height: 14, opacity: 0.5 }} />{t('nav.howItWorks', 'How It Works')}</Link>
              <Link to="/analytics" onClick={() => setIsDropdownOpen(false)} className="dropdown-item font-inter" role="menuitem" tabIndex={0}><BarChart3 style={{ width: 14, height: 14, opacity: 0.5 }} />{t('nav_analytics', 'Analytics')}</Link>
              <Link to="/explorer" onClick={() => setIsDropdownOpen(false)} className="dropdown-item font-inter" role="menuitem" tabIndex={0}><Search style={{ width: 14, height: 14, opacity: 0.5 }} />{t('nav_explorer', 'Explorer')}</Link>
              <button
                onClick={() => { disconnect(); setIsDropdownOpen(false); }}
                className="dropdown-item dropdown-disconnect font-inter w-full text-left"
                role="menuitem"
                tabIndex={0}
                style={{ background: 'none', cursor: 'pointer' }}
              >
                <LogOut style={{ width: 14, height: 14, opacity: 0.5 }} />{t('nav_disconnect', 'Disconnect Wallet')}
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="hidden sm:flex items-center justify-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors flex-shrink-0 cursor-pointer"
      aria-label={t('nav.connectWalletLabel', 'Connect Freighter wallet')}
    >
      <Wallet className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" aria-hidden="true" />
      <span className="whitespace-nowrap">{t('nav.connectWallet', 'Connect Wallet')}</span>
    </button>
  );
};

export default WalletDropdown;

WalletDropdown.propTypes = {
  /** Whether a wallet is currently connected. */
  isConnected: PropTypes.bool.isRequired,
  /** Whether the dropdown menu is open. */
  isDropdownOpen: PropTypes.bool.isRequired,
  /** Toggle dropdown open/close state. */
  setIsDropdownOpen: PropTypes.func.isRequired,
  /** Full Stellar wallet address string. */
  walletAddress: PropTypes.string,
  /** Connect wallet callback. */
  connect: PropTypes.func.isRequired,
  /** Disconnect wallet callback. */
  disconnect: PropTypes.func.isRequired,
  /** React ref for click-outside detection. */
  dropdownRef: PropTypes.object.isRequired,
  /** Address truncation helper function. */
  truncate: PropTypes.func.isRequired,
  /** i18next translation function. */
  t: PropTypes.func.isRequired,
};
