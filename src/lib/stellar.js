import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  BASE_FEE,
  rpc
} from "@stellar/stellar-sdk";
import * as freighter from "./freighter";
import { logError, logTransaction } from "../utils/monitor";
import { HORIZON_URL, SOROBAN_URL, NETWORK_PASSPHRASE } from "./stellar-config";
import { getWorker } from "./supabaseData";

// Initialize Network Servers
export const server = new Horizon.Server(HORIZON_URL);
export const sorobanServer = new rpc.Server(SOROBAN_URL);
export const networkPassphrase = NETWORK_PASSPHRASE;

/**
 * Requests a fee-bumped transaction from the server-side API.
 * The sponsor secret key is stored server-side only (never in the browser).
 *
 * @param {string} signedXdr - The base64-encoded signed inner transaction XDR
 * @returns {Promise<string|null>} The fee-bumped XDR, or null on failure
 */
async function requestFeeBump(signedXdr) {
  try {
    const response = await fetch('/api/fee-bump', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ innerTxXDR: signedXdr }),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.warn('Fee bump API error:', errData.error || response.statusText);
      return null;
    }
    const { feeBumpXDR } = await response.json();
    return feeBumpXDR || null;
  } catch (err) {
    console.warn('Fee bump request failed, submitting without sponsorship:', err.message);
    return null;
  }
}

/**
 * Loads account details from the Horizon server.
 */
export async function loadAccount(publicKey) {
  try {
    return await server.loadAccount(publicKey);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Account not found on Testnet. Please fund your account using Friendbot.");
    }
    throw error;
  }
}

/**
 * Polls Horizon until a transaction is fully indexed.
 */
export async function waitForTransaction(txHash, maxRetries = 10) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const tx = await server.transactions().transaction(txHash).call();
      if (tx && tx.successful) {
        return tx;
      }
    } catch {
      // 404 means not indexed yet
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    retries++;
  }
  console.warn(`Transaction ${txHash} not found by Horizon after ${maxRetries} retries, but it may have succeeded.`);
  return null;
}

/**
 * Submits a signed transaction XDR to the network.
 */
export async function submitTransaction(signedXdr, retry = true) {
  try {
    const transaction = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
    const response = await server.submitTransaction(transaction);
    
    // Ledger Latency Handling: Wait for it to be visible in Horizon
    if (response.hash) {
      await waitForTransaction(response.hash);
    }
    
    return response;
  } catch (error) {
    // Extract detailed Horizon error information for debugging
    if (error.response?.data?.extras?.result_codes) {
      const codes = error.response.data.extras.result_codes;
      console.error("Horizon result codes:", JSON.stringify(codes));
      const opErrors = codes.operations?.join(', ') || '';
      const txError = codes.transaction || '';
      const detail = [txError, opErrors].filter(Boolean).join(' — ');
      if (detail) {
        // We throw the raw error response so decodeTransactionError can parse it in UI
        const enhancedError = new Error(`Transaction failed: ${detail}`);
        enhancedError.response = error.response;
        throw enhancedError;
      }
    }
    console.error("Submission Error:", error);
    if (retry && (error.response?.status === 504 || error.message?.includes("timeout"))) {
      return submitTransaction(signedXdr, false);
    }
    throw error;
  }
}

/**
 * Truncates a string to fit within maxBytes (UTF-8).
 */
function truncateToBytes(str, maxBytes = 64) {
  const encoder = new TextEncoder();
  let encoded = encoder.encode(str);
  if (encoded.length <= maxBytes) return str;
  encoded = encoded.slice(0, maxBytes);
  const decoder = new TextDecoder('utf-8', { fatal: false });
  return decoder.decode(encoded).replace(/\uFFFD$/, '');
}

/**
 * Mint worker credential using native ManageData operations.
 * Stable and sponsor-able without Soroban contract deployment blocks.
 */
export async function mintWorkerCredential(publicKey, data) {
  try {
    const account = await loadAccount(publicKey);
    
    // We use native operations to ensure stability
    const op = Operation.manageData({
      name: `tc_${publicKey.slice(0, 8)}`,
      value: truncateToBytes(data.skill || data.skillCategory || 'Worker', 64)
    });

    const builder = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(30);
    
    const transaction = builder.build();
    const xdr = transaction.toEnvelope().toXDR('base64');
    const signedXdr = await freighter.signTransaction(xdr, networkPassphrase);
    
    // Attempt Fee Bump via server-side API (sponsor key never in browser)
    let finalXdr = signedXdr;
    try {
      const feeBumpXdr = await requestFeeBump(signedXdr);
      if (feeBumpXdr) finalXdr = feeBumpXdr;
    } catch {
      logError({ message: 'Fee bump request failed, submitting without sponsorship.' }, 'feeBumpAttempt');
    }

    const response = await submitTransaction(finalXdr);
    logTransaction(response.hash, "Mint Credential", publicKey);
    return response;
  } catch (error) {
    // Sanitize error output — strip any potential secret key references
    const safeMessage = (error.message || String(error)).replace(/S[A-Z0-9]{55}/g, '[REDACTED_SECRET]');
    console.error('Minting Error:', safeMessage);
    logError({ message: safeMessage, stack: error.stack }, `mintWorkerCredential(${publicKey})`);
    throw new Error(safeMessage);
  }
}

/**
 * Fetches the worker credential from Stellar Data attributes.
 */
export async function fetchWorkerCredential(publicKey) {
  try {
    const account = await loadAccount(publicKey);
    const data = account.data_attr;

    if (data[`tc_${publicKey.slice(0, 8)}`]) {
      const val = data[`tc_${publicKey.slice(0, 8)}`];
      const onChainSkill = atob(val);

      let localData = {};
      try {
        const workerData = await getWorker(publicKey);
        if (workerData) {
          localData = workerData;
        }
      } catch { /* ignore fetch errors */ }

      return {
        name: localData.name || "Worker",
        skill: localData.skill || onChainSkill || "Unknown",
        experience: localData.experience || "Unknown",
        city: localData.city || "Unknown",
        bio: localData.bio || "",
        timestamp: localData.timestamp || null
      };
    }
    throw new Error('No TrustChain credential found.');
  } catch (error) {
    if (error.message === 'No TrustChain credential found.') throw error;
    throw new Error(`Failed to fetch credential: ${error.message}`);
  }
}

/**
 * Submits an endorsement as a ManageData operation.
 */
export async function submitWorkerEndorsement(endorsementData, endorserAddress) {
  try {
    const account = await loadAccount(endorserAddress);
    const { worker, rating, jobType, feedback } = endorsementData;
    
    const key = `tce_${worker.slice(0, 8)}_${Date.now()}`;
    const value = truncateToBytes(`${rating}|${jobType}|${(feedback || '').slice(0, 30)}`, 64);

    const builder = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(Operation.manageData({ name: key, value }))
      .setTimeout(30);

    const transaction = builder.build();
    const signedXdr = await freighter.signTransaction(transaction.toXDR(), networkPassphrase);
    const response = await submitTransaction(signedXdr);
    
    logTransaction(response.hash, "Worker Endorsement", endorserAddress);
    return response;
  } catch (error) {
    logError({ message: error.message, stack: error.stack }, `submitWorkerEndorsement(${endorserAddress})`);
    throw error;
  }
}
