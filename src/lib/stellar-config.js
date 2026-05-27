/**
 * @module stellar-config
 * Backward-compatibility re-exports from networkConfig.
 * All new code should import from './networkConfig' directly.
 */
export {
  HORIZON_URL,
  SOROBAN_URL,
  NETWORK_PASSPHRASE,
  isTestnet,
  isMainnet,
  NETWORK as STELLAR_NETWORK,
} from './networkConfig';
