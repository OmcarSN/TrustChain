import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWalletAddress, getFreighterNetwork, connectWallet } from '../lib/freighter';
import { ShieldAlert, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { NETWORK, FREIGHTER_NETWORK } from '../lib/networkConfig';

/**
 * WalletContext — React context for Freighter wallet state.
 * Provides wallet address, connection status, network info,
 * and connect/disconnect actions to the entire component tree.
 */
const WalletContext = createContext();

/**
 * useWallet — Convenience hook for consuming WalletContext.
 *
 * @returns {{walletAddress: string|null, isConnected: boolean, connect: Function, disconnect: Function, network: string|null, isWrongNetwork: boolean}}
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => useContext(WalletContext);

/**
 * WalletProvider — Context provider that manages Freighter wallet
 * connection lifecycle. Handles auto-reconnect on mount, periodic
 * network checking, and renders a global wrong-network warning banner.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child component tree.
 * @returns {React.ReactElement} The WalletProvider component.
 */
export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const checkNetwork = useCallback(async () => {
    try {
      const currentNetwork = await getFreighterNetwork();
      // Safety: ensure network is always a string or null
      const networkStr = (typeof currentNetwork === 'string') ? currentNetwork : null;
      setNetwork(networkStr);
      if (networkStr && networkStr.toUpperCase() !== FREIGHTER_NETWORK) {
        setIsWrongNetwork(true);
      } else {
        setIsWrongNetwork(false);
      }
    } catch {
      setNetwork(null);
      setIsWrongNetwork(false);
    }
  }, []);

  const connect = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
      localStorage.setItem('trustchain_wallet_connected', 'true');
      await checkNetwork();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
    setIsConnected(false);
    localStorage.removeItem('trustchain_wallet_connected');
  };

  // Auto-reconnect on mount (silent — no popup)
  useEffect(() => {
    const initWallet = async () => {
      const wasConnected = localStorage.getItem('trustchain_wallet_connected') === 'true';
      if (wasConnected) {
        const address = await getWalletAddress();
        if (address) {
          setWalletAddress(address);
          setIsConnected(true);
          // Only check network if we actually reconnected
          await checkNetwork();
        } else {
          // Wallet is locked or user revoked access — clear stale flag
          // so we don't keep trying (and potentially popup) on every page load
          localStorage.removeItem('trustchain_wallet_connected');
        }
      }
    };

    initWallet();
  }, [checkNetwork]);

  // Periodic network check — only when connected
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(checkNetwork, 5000);
    return () => clearInterval(interval);
  }, [isConnected, checkNetwork]);

  return (
    <WalletContext.Provider value={{ walletAddress, isConnected, connect, disconnect, network, isWrongNetwork }}>
      {children}
      
      {/* Global Network Warning */}
      <AnimatePresence>
        {isWrongNetwork && isConnected && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            role="alert"
            className="fixed top-0 left-0 right-0 z-[10000] flex items-center justify-center gap-4 py-3 px-6 text-white"
            style={{
              background: 'linear-gradient(180deg, rgba(30,10,10,0.96), rgba(20,7,7,0.96))',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(239,68,68,0.5)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(239,68,68,0.25), inset 0 1px 0 rgba(239,68,68,0.15)',
            }}
          >
            <ShieldAlert className="w-5 h-5 animate-pulse" style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.95)' }}>
              Action Required: Switch Freighter to <span className="underline decoration-2 underline-offset-4" style={{ color: '#FCA5A5', textDecorationColor: 'var(--color-danger)' }}>{NETWORK}</span> to use TrustChain.
            </p>
            <div
              className="flex items-center gap-2 ml-4 px-3 py-1 rounded-lg"
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.35)',
              }}
            >
               <span className="text-[9px] font-bold" style={{ color: '#FCA5A5' }}>CURRENT: {network || 'UNKNOWN'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </WalletContext.Provider>
  );
};

WalletProvider.propTypes = {
  /** Child component tree to wrap with wallet context. */
  children: PropTypes.node.isRequired,
};
