import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Wallet, Menu, X, Check, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import TrustChainLogo from './TrustChainLogo';

const Navbar = () => {
  const location = useLocation();
  const { walletAddress, isConnected, connect, disconnect } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "";

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Workers', path: '/discover' },
    { name: 'Explorer', path: '/explorer' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Worker Portal', path: '/worker' },
  ];

  return (
    <>
      {/* ── Floating Glass Pill Navbar ─────────────────────────── */}
      <nav
        className="fixed z-50"
        style={{
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          maxWidth: '850px',
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-2 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Left — Logo */}
          <Link to="/" className="shrink-0 pl-1 group transition-transform hover:scale-105">
            <TrustChainLogo size={140} />
          </Link>

          {/* Center — Nav Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-gray-100/50"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    color: isActive ? '#ffffff' : '#4B5563', /* gray-600 */
                    background: isActive ? '#1E3A8A' : 'transparent',
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right — Wallet / Connect + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop wallet */}
            <AnimatePresence mode="wait">
              {isConnected ? (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="relative hidden sm:block"
                  ref={dropdownRef}
                >
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all bg-[#ECFDF5] border border-[#D1FAE5] text-[#10B981] hover:bg-[#D1FAE5] hover-lift btn-press"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" style={{ animation: 'pulse-dot 2s infinite' }} />
                      {truncate(walletAddress)}
                    </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 mt-3 w-52 rounded-2xl overflow-hidden shadow-xl z-[60]"
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                        }}
                      >
                        <Link
                          to="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-600 hover:text-navy-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <div className="border-t border-gray-100" />
                        <button
                          onClick={() => {
                            disconnect();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#EA580C] hover:bg-orange-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Disconnect
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.button
                  key="disconnected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  onClick={connect}
                  className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all hover:bg-blue-900 hover-lift btn-press"
                  style={{
                    background: '#1E3A8A', /* Navy Base */
                    color: '#ffffff',
                  }}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  Connect
                </motion.button>
              )}
            </AnimatePresence>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full transition-all text-gray-900 hover:bg-gray-100"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-5 h-5 text-gray-900" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-5 h-5 text-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[45]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm z-[55] flex flex-col"
              style={{
                background: '#FFFFFF',
                borderLeft: '1px solid #E5E7EB',
              }}
            >
              <div className="px-8 pt-20 pb-6 border-b border-gray-100">
                <div className="mb-2 transition-transform hover:scale-105">
                  <TrustChainLogo size={150} />
                </div>
                <p className="label-mono text-gray-500 mt-2">Navigation Menu</p>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: 'none' }}>
                <div className="space-y-2">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <Link
                        to={link.path}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold uppercase tracking-widest text-[11px] transition-all hover:bg-gray-50"
                        style={{
                          fontFamily: '"Inter", sans-serif',
                          color: location.pathname === link.path ? '#ffffff' : '#4B5563',
                          background: location.pathname === link.path ? '#1E3A8A' : 'transparent',
                        }}
                      >
                        {link.name}
                        {location.pathname === link.path && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile Wallet Section */}
              <div className="px-6 py-6 border-t border-gray-100">
                {isConnected ? (
                  <div className="space-y-3">
                    <div
                      className="flex items-center gap-3 px-5 py-4 rounded-2xl"
                      style={{
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: '#10B981',
                          animation: 'pulse-dot 2s ease-in-out infinite',
                        }}
                      />
                      <span className="font-mono text-xs text-gray-700">{truncate(walletAddress)}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="w-full py-4 rounded-2xl font-semibold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 hover:bg-blue-50"
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        color: '#1E3A8A',
                      }}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        disconnect();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-4 rounded-2xl font-semibold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 hover:bg-orange-50"
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        color: '#EA580C',
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-4 rounded-2xl font-semibold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 hover:bg-blue-900"
                    style={{
                      background: '#1E3A8A',
                      color: '#ffffff',
                      boxShadow: '0 4px 14px 0 rgba(30, 58, 138, 0.2)',
                    }}
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Freighter
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
