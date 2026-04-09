import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  BASE_FEE,
  Keypair,
  rpc
} from "@stellar/stellar-sdk";
import * as freighter from "./freighter";
import { buildFeeBumpTransaction } from "../utils/feeBump";
import { logError, logTransaction } from "../utils/monitor";

// Initialize Network Servers
export const server = new Horizon.Server("https://horizon-testnet.stellar.org");
export const sorobanServer = new rpc.Server("https://soroban-testnet.stellar.org");
export const networkPassphrase = Networks.TESTNET;

// Cache sponsor public key for the indexer to discover
try {
  const sponsorSecret = import.meta.env.VITE_SPONSOR_SECRET;
  if (sponsorSecret) {
    const sponsorPub = Keypair.fromSecret(sponsorSecret).publicKey();
    sessionStorage.setItem('trustchain_sponsor_pubkey', sponsorPub);
  }
} catch { /* ignore if invalid key */ }

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
    if (retry && (error.response?.status === 504 || error.message.includes("timeout"))) {
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
    
    // Attempt Fee Bump
    const sponsorSecret = import.meta.env.VITE_SPONSOR_SECRET;
    let finalXdr = signedXdr;
    
    if (sponsorSecret) {
      const sponsorKeypair = Keypair.fromSecret(sponsorSecret);
      const feeBumpXdr = buildFeeBumpTransaction(signedXdr, sponsorKeypair, networkPassphrase);
      if (feeBumpXdr) finalXdr = feeBumpXdr;
    }

    const response = await submitTransaction(finalXdr);
    logTransaction(response.hash, "Mint Credential", publicKey);
    return response;
  } catch (error) {
    console.error("Minting Error:", error);
    logError(error, `mintWorkerCredential(${publicKey})`);
    throw error;
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
      return {
        name: "Worker", // General placeholder
        skill: Buffer.from(val, 'base64').toString('utf-8'),
        experience: "Unknown",
        city: "Unknown",
        bio: ""
      };
    }
    throw new Error('No TrustChain credential found.');
  } catch (error) {
    throw error;
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
    throw error;
  }
}
