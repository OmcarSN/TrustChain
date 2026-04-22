import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWalletAddress, getFreighterNetwork, connectWallet } from '../lib/freighter';
import { ShieldAlert, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STELLAR_NETWORK } from '../lib/stellar-config';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

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
      if (networkStr && networkStr !== STELLAR_NETWORK) {
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
            className="fixed top-0 left-0 right-0 z-[10000] bg-red-600 text-white py-3 px-6 flex items-center justify-center gap-4 shadow-xl"
          >
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-widest">
              Action Required: Switch Freighter to <span className="underline decoration-2 underline-offset-4">{STELLAR_NETWORK}</span> to use TrustChain.
            </p>
            <div className="flex items-center gap-2 ml-4 bg-white/10 px-3 py-1 rounded-lg border border-white/20">
               <span className="text-[9px] font-bold">CURRENT: {network || 'UNKNOWN'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </WalletContext.Provider>
  );
};
