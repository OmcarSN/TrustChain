/**
 * @module networkConfig
 * Single source of truth for all Stellar network configuration.
 *
 * Controlled by ONE environment variable:
 *   VITE_STELLAR_NETWORK = 'testnet' | 'mainnet'
 *
 * Everything else — Horizon URL, Soroban RPC, passphrase, contract IDs,
 * explorer base URL, Freighter network name — is derived from this value.
 *
 * Per-network overrides are still possible via individual VITE_* env vars
 * (e.g., VITE_HORIZON_URL), but should rarely be needed.
 */
import { Networks } from '@stellar/stellar-sdk';

// ── Resolve network ────────────────────────────────────────────
const raw = (import.meta.env.VITE_STELLAR_NETWORK || 'testnet').toLowerCase();

/** @type {'mainnet' | 'testnet'} */
export const NETWORK = raw === 'mainnet' ? 'mainnet' : 'testnet';

// ── Boolean helpers ────────────────────────────────────────────
export const isMainnet = NETWORK === 'mainnet';
export const isTestnet = NETWORK === 'testnet';

// ── Network presets ────────────────────────────────────────────
const PRESETS = {
  mainnet: {
    horizonUrl: 'https://horizon.stellar.org',
    sorobanUrl: 'https://soroban-rpc.mainnet.stellar.gateway.fm',
    passphrase: Networks.PUBLIC,
    explorerBase: 'https://stellar.expert/explorer/public',
    freighterNetwork: 'PUBLIC',
    friendbotAvailable: false,
  },
  testnet: {
    horizonUrl: 'https://horizon-testnet.stellar.org',
    sorobanUrl: 'https://soroban-testnet.stellar.org',
    passphrase: Networks.TESTNET,
    explorerBase: 'https://stellar.expert/explorer/testnet',
    freighterNetwork: 'TESTNET',
    friendbotAvailable: true,
  },
};

const preset = PRESETS[NETWORK];

// ── Exported config (overridable via env vars) ─────────────────
/** Horizon REST API URL */
export const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || preset.horizonUrl;

/** Soroban JSON-RPC URL */
export const SOROBAN_URL = import.meta.env.VITE_SOROBAN_URL || preset.sorobanUrl;

/** Stellar network passphrase */
export const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || preset.passphrase;

/** Base URL for stellar.expert explorer links (no trailing slash) */
export const EXPLORER_BASE = preset.explorerBase;

/** Network name for Freighter API ('TESTNET' | 'PUBLIC') */
export const FREIGHTER_NETWORK = preset.freighterNetwork;

/** Whether the Stellar friendbot faucet is available on this network */
export const FRIENDBOT_AVAILABLE = preset.friendbotAvailable;

// ── Contract IDs ───────────────────────────────────────────────
/** Credential contract ID (Soroban) */
export const CREDENTIAL_CONTRACT_ID =
  import.meta.env.VITE_CREDENTIAL_CONTRACT_ID ||
  import.meta.env.VITE_SOROBAN_CONTRACT_ID ||
  import.meta.env.VITE_CONTRACT_ID ||
  '';

/** Reputation contract ID (Soroban) */
export const REPUTATION_CONTRACT_ID =
  import.meta.env.VITE_REPUTATION_CONTRACT_ID || '';

/** Governance contract ID (Soroban) */
export const GOVERNANCE_CONTRACT_ID =
  import.meta.env.VITE_GOVERNANCE_CONTRACT_ID || '';

/** Sponsor public key (safe for client bundle — indexer only) */
export const SPONSOR_PUBLIC_KEY =
  import.meta.env.VITE_SPONSOR_PUBLIC_KEY || '';

// ── Utility: build explorer links ──────────────────────────────
/**
 * Build a stellar.expert URL for a transaction.
 * @param {string} txHash - Transaction hash
 * @returns {string} Full explorer URL
 */
export const explorerTxUrl = (txHash) => `${EXPLORER_BASE}/tx/${txHash}`;

/**
 * Build a stellar.expert URL for an account.
 * @param {string} address - Stellar public key
 * @returns {string} Full explorer URL
 */
export const explorerAccountUrl = (address) => `${EXPLORER_BASE}/account/${address}`;
