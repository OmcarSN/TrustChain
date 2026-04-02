import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  BASE_FEE,
} from "@stellar/stellar-sdk";
import * as freighter from "./freighter";

// Initialize the Horizon server for Testnet
export const server = new Horizon.Server("https://horizon-testnet.stellar.org");
export const networkPassphrase = Networks.TESTNET;

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
 * Submits a signed transaction XDR to the network.
 */
export async function submitTransaction(signedXdr, retry = true) {
  try {
    const transaction = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
    const response = await server.submitTransaction(transaction);
    return response;
  } catch (error) {
    console.error("Submission Error:", error);
    
    // Retry logic for timeouts
    if (retry && (error.response?.status === 504 || error.message.includes("timeout"))) {
      console.log("Retrying transaction submission...");
      return submitTransaction(signedXdr, false);
    }

    // Extract error details if available
    const resultXdr = error.response?.data?.extras?.result_codes?.transaction;
    if (resultXdr) {
      throw new Error(`Transaction failed with code: ${resultXdr}`);
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
  // Truncate byte array and decode back (may lose partial chars)
  encoded = encoded.slice(0, maxBytes);
  const decoder = new TextDecoder('utf-8', { fatal: false });
  return decoder.decode(encoded).replace(/\uFFFD$/, '');
}

/**
 * Main function to mint a worker credential as multiple ManageData operations.
 * Each field is stored under a separate key (tc_name, tc_skill, etc.)
 * to stay within Stellar's 64-byte value limit per ManageData entry.
 */
export async function mintWorkerCredential(publicKey, data) {
  try {
    const account = await loadAccount(publicKey);
    
    // Map credential fields to ManageData keys (each value <= 64 bytes)
    const fields = {
      'tc_name':  truncateToBytes(data.name || '', 64),
      'tc_skill': truncateToBytes(data.skill || '', 64),
      'tc_city':  truncateToBytes(data.city || '', 64),
      'tc_exp':   truncateToBytes(String(data.experience || ''), 64),
      'tc_bio':   truncateToBytes(data.bio || '', 64),
    };

    // Build a transaction with one ManageData op per field
    const builder = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    });

    for (const [key, value] of Object.entries(fields)) {
      builder.addOperation(
        Operation.manageData({ name: key, value })
      );
    }

    const transaction = builder.setTimeout(30).build();

    // Sign with Freighter
    const signedXdr = await freighter.signTransaction(transaction.toXDR(), networkPassphrase);
    
    // Submit to Network
    const response = await submitTransaction(signedXdr);
    return response;
  } catch (error) {
    console.error("Minting Error:", error);
    throw error;
  }
}

/**
 * Fetches the worker credential for a given account.
 * Supports both formats:
 *   - New: separate keys (tc_name, tc_skill, tc_city, tc_exp, tc_bio)
 *   - Legacy: single key (trustchain_credential) with JSON value
 */
export async function fetchWorkerCredential(publicKey) {
  try {
    const account = await loadAccount(publicKey);
    const data = account.data_attr;

    // Try new multi-key format first
    if (data['tc_name']) {
      const decode = (key) => {
        const val = data[key];
        return val ? Buffer.from(val, 'base64').toString('utf-8') : '';
      };
      return {
        name:       decode('tc_name'),
        skill:      decode('tc_skill'),
        city:       decode('tc_city'),
        experience: decode('tc_exp'),
        bio:        decode('tc_bio'),
      };
    }

    // Fallback: legacy single-key format
    const credentialBase64 = data['trustchain_credential'];
    if (credentialBase64) {
      const credentialJson = Buffer.from(credentialBase64, 'base64').toString('utf-8');
      return JSON.parse(credentialJson);
    }

    throw new Error('No TrustChain credential found for this address.');
  } catch (error) {
    console.error('Fetch Credential Error:', error);
    if (error.message.includes('No TrustChain credential found')) {
      throw error;
    }
    throw new Error('Worker profile not found on Stellar network.');
  }
}

/**
 * Submits an endorsement as a ManageData operation.
 * Key: tce_[worker_short_addr]_[timestamp]
 * Value: JSON.stringify({endorser, worker, rating, jobType, feedback})
 */
export async function submitWorkerEndorsement(endorsementData, endorserAddress) {
  try {
    const account = await loadAccount(endorserAddress);
    const { worker, rating, jobType, feedback } = endorsementData;
    
    // Shorten the key to fit within 64-character limit
    // tce_ (4) + worker (56) + _ (1) + timestamp (13) = 74 chars. Still too long.
    // We'll use: tce_[worker_first_8]_[timestamp]
    const timestamp = Date.now();
    const shortWorker = worker.slice(0, 8);
    const key = `tce_${shortWorker}_${timestamp}`;
    
    // Build a compact value that fits within 64 bytes
    // Format: "rating|jobType|shortFeedback"
    const shortFeedback = (feedback || '').slice(0, 30);
    const value = truncateToBytes(`${rating}|${jobType}|${shortFeedback}`, 64);

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(
        Operation.manageData({
          name: key,
          value: value,
        })
      )
      .setTimeout(30)
      .build();

    const signedXdr = await freighter.signTransaction(transaction.toXDR(), networkPassphrase);
    const response = await submitTransaction(signedXdr);
    return response;
  } catch (error) {
    console.error("Endorsement Submission Error:", error);
    throw error;
  }
}
