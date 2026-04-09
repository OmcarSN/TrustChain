import { parseTransactionToCredential, filterTrustChainOps } from './eventParser';
import { logError } from '../utils/monitor';

const CONTRACT_ID = import.meta.env.VITE_CREDENTIAL_CONTRACT_ID || import.meta.env.VITE_CONTRACT_ID;
const HORIZON_URL = 'https://horizon-testnet.stellar.org';

const CACHE_KEY = 'trustchain_indexed_events';
const CACHE_TIME_KEY = 'trustchain_indexed_events_timestamp';
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

/**
 * Resolves the correct Horizon account to query.
 * Soroban contract IDs (C...) won't work with /accounts/ endpoint,
 * so we also try the sponsor wallet and connected wallet as fallbacks.
 */
function getIndexableAccounts() {
  const accounts = [];
  
  // If CONTRACT_ID starts with G, it's a valid Stellar account
  if (CONTRACT_ID && CONTRACT_ID.startsWith('G')) {
    accounts.push(CONTRACT_ID);
  }
  
  // Try sponsor wallet (the key that signs fee bumps — its public key has associated txs)
  const sponsorSecret = import.meta.env.VITE_SPONSOR_SECRET;
  if (sponsorSecret) {
    try {
      // Derive public key from the sponsor secret
      // We store it to avoid importing the full SDK here
      const cachedSponsorPub = sessionStorage.getItem('trustchain_sponsor_pubkey');
      if (cachedSponsorPub) {
        accounts.push(cachedSponsorPub);
      }
    } catch { /* ignore */ }
  }
  
  // Also check local worker registry for known wallet addresses
  try {
    const registry = JSON.parse(localStorage.getItem('trustchain_worker_registry') || '[]');
    registry.forEach(addr => {
      if (addr && addr.startsWith('G') && !accounts.includes(addr)) {
        accounts.push(addr);
      }
    });
  } catch { /* ignore */ }
  
  return accounts;
}

/**
 * Fetches transactions for a single Stellar account from Horizon.
 */
async function fetchTransactionsForAccount(accountId) {
  const allTransactions = [];
  let url = `${HORIZON_URL}/accounts/${accountId}/transactions?limit=200&order=desc`;
  
  try {
    while (url) {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          // Account doesn't exist on testnet yet
          return [];
        }
        // Don't throw on Bad Request — just return empty
        if (response.status === 400) {
          return [];
        }
        throw new Error(`Horizon API error: ${response.statusText}`);
      }

      const data = await response.json();
      const records = data._embedded ? data._embedded.records : [];
      
      if (records.length === 0) break;

      allTransactions.push(...records);

      if (records.length < 200) break;
      
      url = data._links?.next?.href;
      
      if (allTransactions.length > 2000) break; 
    }
  } catch (err) {
    console.warn(`Failed to fetch txs for ${accountId.slice(0,8)}...:`, err.message);
  }
  
  return allTransactions;
}

/**
 * Queries Horizon for all transactions involving TrustChain accounts,
 * parses them, and returns a structured array of credential events.
 * Falls back to local transaction logs if Horizon queries fail.
 */
export const fetchAllCredentialEvents = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cachedTime = sessionStorage.getItem(CACHE_TIME_KEY);
    const cachedData = sessionStorage.getItem(CACHE_KEY);

    if (cachedTime && cachedData && (Date.now() - parseInt(cachedTime, 10)) < CACHE_TTL_MS) {
      return JSON.parse(cachedData);
    }
  }

  try {
    const accounts = getIndexableAccounts();
    
    // Fetch transactions from all known accounts in parallel
    const txArrays = await Promise.all(
      accounts.map(acct => fetchTransactionsForAccount(acct))
    );
    
    // Merge and deduplicate by tx hash
    const txMap = new Map();
    txArrays.flat().forEach(tx => {
      if (!txMap.has(tx.hash)) {
        txMap.set(tx.hash, tx);
      }
    });
    
    let allTransactions = Array.from(txMap.values());
    
    // Sort by created_at descending
    allTransactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Filter for TrustChain-relevant operations (tc_ manage_data entries)
    const validOps = filterTrustChainOps(allTransactions);
    const parsedEvents = validOps.map(parseTransactionToCredential);

    // Also merge in local transaction logs for completeness
    const localEvents = getLocalTransactionEvents();
    const mergedEvents = mergeEvents(parsedEvents, localEvents);

    sessionStorage.setItem(CACHE_KEY, JSON.stringify(mergedEvents));
    sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

    return mergedEvents;

  } catch (err) {
    console.error("Indexer fetchAllCredentialEvents Error:", err);
    logError(err, 'fetchAllCredentialEvents');
    
    // Fallback: return local transaction events
    const localEvents = getLocalTransactionEvents();
    if (localEvents.length > 0) {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(localEvents));
      sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      return localEvents;
    }
    
    return [];
  }
};

/**
 * Gets credential events from local transaction monitor logs.
 */
function getLocalTransactionEvents() {
  try {
    const txLog = JSON.parse(localStorage.getItem('trustchain_txlog') || '[]');
    return txLog
      .filter(tx => tx.txHash && tx.wallet)
      .map(tx => ({
        txHash: tx.txHash,
        walletAddress: tx.wallet,
        credentialType: tx.type || 'Verified Interaction',
        timestamp: tx.timestamp,
        ledger: '—',
        successful: true,
      }));
  } catch {
    return [];
  }
}

/**
 * Merges on-chain events with local events, deduplicating by txHash.
 */
function mergeEvents(onChainEvents, localEvents) {
  const hashSet = new Set(onChainEvents.map(e => e.txHash));
  const unique = [...onChainEvents];
  
  localEvents.forEach(e => {
    if (!hashSet.has(e.txHash)) {
      unique.push(e);
      hashSet.add(e.txHash);
    }
  });
  
  // Sort by timestamp descending
  unique.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return unique;
}

export const fetchCredentialsByWallet = async (walletAddress) => {
  if (!walletAddress) return [];
  
  // First try to fetch directly from this wallet's Horizon data
  try {
    const directTxs = await fetchTransactionsForAccount(walletAddress);
    const validOps = filterTrustChainOps(directTxs);
    if (validOps.length > 0) {
      return validOps.map(parseTransactionToCredential);
    }
  } catch { /* fall through */ }
  
  // Fallback: filter all cached events
  const events = await fetchAllCredentialEvents(); 
  return events.filter(e => e.walletAddress === walletAddress);
};

export const fetchLatestLedger = async () => {
  try {
    const response = await fetch(`${HORIZON_URL}/ledgers?limit=1&order=desc`);
    if (!response.ok) throw new Error('Failed to fetch latest ledger');
    const data = await response.json();
    const latest = data._embedded.records[0];
    
    return {
      sequence: latest.sequence,
      closedAt: latest.closed_at
    };
  } catch (err) {
    console.error("Indexer fetchLatestLedger Error:", err);
    logError(err, 'fetchLatestLedger');
    throw err;
  }
};
