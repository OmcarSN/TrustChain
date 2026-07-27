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
import { HORIZON_URL, SOROBAN_URL, NETWORK_PASSPHRASE, STELLAR_NETWORK, isTestnet } from "./stellar-config";
import { getWorker } from "./supabaseData";

// Initialize Network Servers
export const server = new Horizon.Server(HORIZON_URL);
export const sorobanServer = new rpc.Server(SOROBAN_URL);
export const networkPassphrase = NETWORK_PASSPHRASE;

/**
 * Loads account details from the Horizon server.
 */
export async function loadAccount(publicKey) {
  try {
    return await server.loadAccount(publicKey);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Account not found on ${STELLAR_NETWORK}. Please fund your account${isTestnet ? ' using Friendbot' : ''}.`);
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
 * Mint worker credential using the sponsored build-mint API.
 *
 * Flow:
 *  1. Frontend sends publicKey + credential data to /api/build-mint
 *  2. Backend checks if account exists; if not, prepends CreateAccount op
 *  3. Backend builds & sponsor-signs the transaction, returns partial XDR
 *  4. Frontend asks user to co-sign via Freighter (authorizes ManageData)
 *  5. Frontend submits the fully-signed transaction to the network
 *
 * This ensures minting works even when the user's account doesn't yet
 * exist on the Stellar ledger (common on mainnet for new users).
 */
export async function mintWorkerCredential(publicKey, data) {
  try {
    const dataKey = `tc_${publicKey.slice(0, 8)}`;
    const dataValue = truncateToBytes(data.skill || data.skillCategory || 'Worker', 64);

    // Step 1: Request the backend to build a sponsor-signed transaction
    let txXDR, accountCreated;
    try {
      const buildResponse = await fetch('/api/build-mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey, dataKey, dataValue }),
      });

      if (!buildResponse.ok) {
        let errMsg = `Build-mint API failed (${buildResponse.status})`;
        try {
          const errData = await buildResponse.json();
          if (errData.error) errMsg = errData.error;
        } catch(e) {}
        
        // If it's a definitive business logic rejection (e.g. 403 Unverified), bubble it up
        if (buildResponse.status === 403 || buildResponse.status === 400) {
          const backendErr = new Error(errMsg);
          backendErr.isBackendRejection = true;
          throw backendErr;
        }
        throw new Error(errMsg);
      }

      const resData = await buildResponse.json();
      txXDR = resData.txXDR;
      accountCreated = resData.accountCreated;

      if (!txXDR) throw new Error('Build-mint API returned empty transaction');
      if (accountCreated) console.log('[TrustChain] Sponsor is creating account for new user:', publicKey);
      
    } catch (apiError) {
      if (apiError.isBackendRejection) {
        throw apiError; // Throw immediately, don't fallback to self-funded
      }
      console.warn('Backend build-mint API unavailable. Falling back to local self-funded minting...', apiError.message);
      
      // Local fallback: Build self-funded transaction directly on the client
      const account = await loadAccount(publicKey);
      const builder = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase,
      });
      
      builder.addOperation(Operation.manageData({
        name: dataKey,
        value: dataValue,
        source: publicKey
      }));
      
      const tx = builder.setTimeout(300).build();
      txXDR = tx.toXDR();
      accountCreated = false;
    }

    // Step 2: User co-signs via Freighter (authorizes the ManageData operation)
    // If the user IS the sponsor, the backend already signed — skip Freighter co-sign
    const sponsorPubKey = import.meta.env.VITE_SPONSOR_PUBLIC_KEY || '';
    let finalXdr;
    if (sponsorPubKey && publicKey === sponsorPubKey) {
      console.log('[TrustChain] User is sponsor — skipping Freighter co-sign');
      finalXdr = txXDR; // already fully signed by backend
    } else {
      finalXdr = await freighter.signTransaction(txXDR, networkPassphrase);
    }

    // Step 3: Submit the fully-signed transaction
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
      .setTimeout(120);

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
