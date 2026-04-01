import React, { createContext, useContext, useState } from 'react';
import { isConnected, requestAccess } from '@stellar/freighter-api';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (typeof window !== 'undefined' && await isConnected()) {
        const result = await requestAccess();
        
        if (result.error) {
          throw new Error(result.error);
        }

        const publicKey = typeof result === 'string' ? result : result.address;
        setAddress(publicKey);
        return { success: true, address: publicKey };
      } else {
        return { success: false, error: 'Freighter not installed' };
      }
    } catch (e) {
      console.error(e);
      return { success: false, error: e.message || 'Connection failed' };
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress('');
  };

  return (
    <WalletContext.Provider value={{ address, isConnecting, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    return { address: '', isConnecting: false, connectWallet: () => {}, disconnectWallet: () => {} };
  }
  return context;
};
