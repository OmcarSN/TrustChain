import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Wallet, Menu, X, Check, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';

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
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Worker Portal', path: '/worker' },
    { name: 'Endorse', path: '/endorse' },
    { name: 'Verify', path: '/verify' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/40 group-hover:scale-110 transition-transform duration-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight uppercase italic underline-offset-4 decoration-accent">Trust<span className="text-accent underline decoration-2">Chain</span></span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 mt-1">Verified Economy</span>
            </div>
          </Link>

          {/* Center Nav Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  location.pathname === link.path 
                    ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 relative">
            {/* Desktop wallet button */}
            {isConnected ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hidden sm:flex px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all items-center gap-3 group"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span>{truncate(walletAddress)}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-52 bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[60]"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/5 transition-colors flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <div className="border-t border-white/5" />
                      <button 
                        onClick={() => {
                          disconnect();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={connect}
                className="hidden sm:flex px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all items-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Wallet className="w-4 h-4 text-accent relative z-10" />
                <span className="relative z-10">Connect Wallet</span>
              </button>
            )}
            
            {/* Hamburger menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white relative z-[60]"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#0f0f18] border-l border-white/10 z-[55] flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="px-8 pt-20 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-black uppercase italic tracking-tight">Trust<span className="text-accent">Chain</span></span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Navigation Menu</p>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-2">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${
                          location.pathname === link.path
                            ? 'bg-accent text-white shadow-lg shadow-accent/20'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
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
              <div className="px-6 py-6 border-t border-white/5">
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <span className="font-mono text-xs text-white/60">{truncate(walletAddress)}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="w-full py-4 bg-accent/10 border border-accent/20 text-accent rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        disconnect();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
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
                    className="w-full py-5 bg-accent hover:bg-accent-hover text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-2xl shadow-accent/30"
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
