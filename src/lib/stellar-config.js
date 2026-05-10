/**
 * @module stellar-config
 * Centralized Stellar network configuration.
 * Reads from env vars (VITE_*) with sensible defaults for TESTNET.
 * Exports network URLs, passphrase, and boolean flags for each network.
 */
import { Networks } from "@stellar/stellar-sdk";

const networkEnv = import.meta.env.VITE_STELLAR_NETWORK || 'TESTNET';

export const STELLAR_NETWORK = networkEnv.toUpperCase();

export const isTestnet = STELLAR_NETWORK === 'TESTNET';
export const isFuturenet = STELLAR_NETWORK === 'FUTURENET';
export const isPublic = STELLAR_NETWORK === 'PUBLIC';

export const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 
  (isFuturenet ? 'https://horizon-futurenet.stellar.org' : 'https://horizon-testnet.stellar.org');

export const SOROBAN_URL = import.meta.env.VITE_SOROBAN_URL || 
  (isFuturenet ? 'https://rpc-futurenet.stellar.org' : 'https://soroban-testnet.stellar.org');

export const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || 
  (isFuturenet ? Networks.FUTURENET : Networks.TESTNET);
