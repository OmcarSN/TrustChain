import {
  Contract,
  TransactionBuilder,
  nativeToScVal,
  Address,
  rpc,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import {
  REPUTATION_CONTRACT_ID,
  SOROBAN_URL,
  NETWORK_PASSPHRASE,
} from './networkConfig';
import * as freighter from './freighter';

/**
 * ReputationContract — Soroban client wrapper for the on-chain Reputation contract.
 *
 * Provides functions to:
 * - Submit endorsements on-chain
 * - Read reputation scores, trust tiers, and endorsements
 * - File and resolve disputes
 *
 * All write operations are signed via Freighter wallet.
 */

const sorobanServer = new rpc.Server(SOROBAN_URL);

// ── Trust tier labels ──────────────────────────────────────────
const TIER_LABELS = ['Bronze', 'Silver', 'Gold', 'Platinum'];

/**
 * Helper: build, simulate, sign and submit a Soroban contract call.
 * @param {string} callerPublicKey - The wallet address calling the contract
 * @param {string} methodName - The contract method to invoke
 * @param {Array} args - ScVal arguments for the method
 * @returns {Promise<object>} The transaction result
 */
async function invokeContract(callerPublicKey, methodName, args) {
  if (!REPUTATION_CONTRACT_ID) {
    throw new Error('Reputation contract ID is not configured');
  }

  const contract = new Contract(REPUTATION_CONTRACT_ID);
  const account = await sorobanServer.getAccount(callerPublicKey);

  // Build the transaction with the contract call
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(methodName, ...args))
    .setTimeout(120)
    .build();

  // Simulate to get the footprint and resource fees
  const simulated = await sorobanServer.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  // Assemble with the simulation result
  const assembled = rpc.assembleTransaction(tx, simulated).build();

  // Sign with Freighter
  const signedXdr = await freighter.signTransaction(assembled.toXDR());
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);

  // Submit and wait for confirmation
  const response = await sorobanServer.sendTransaction(signedTx);

  if (response.status === 'ERROR') {
    throw new Error(`Transaction submission failed: ${response.errorResult?.toString() || 'Unknown error'}`);
  }

  // Poll for result
  let result = response;
  while (result.status === 'PENDING' || result.status === 'NOT_FOUND') {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    result = await sorobanServer.getTransaction(response.hash);
  }

  if (result.status === 'FAILED') {
    throw new Error(`Transaction failed on-chain: ${result.resultXdr?.toString() || 'Unknown error'}`);
  }

  return { hash: response.hash, result };
}

/**
 * Helper: read-only contract query (no signing needed).
 * @param {string} methodName - The contract method to invoke
 * @param {Array} args - ScVal arguments
 * @returns {Promise<Object|null>} The return value from the contract
 */
async function queryContract(methodName, args) {
  if (!REPUTATION_CONTRACT_ID) {
    return null;
  }

  const contract = new Contract(REPUTATION_CONTRACT_ID);

  // Use a dummy source for read-only queries
  const dummyKey = import.meta.env.VITE_SPONSOR_PUBLIC_KEY || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
  let account;
  try {
    account = await sorobanServer.getAccount(dummyKey);
  } catch {
    // If dummy account doesn't exist, we cannot simulate — return null
    return null;
  }

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(methodName, ...args))
    .setTimeout(30)
    .build();

  const simulated = await sorobanServer.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simulated) || !simulated.result) {
    return null;
  }

  return simulated.result.retval;
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API — WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Submit an endorsement on-chain via the Reputation contract.
 * @param {string} endorserAddress - The endorser's wallet address
 * @param {string} workerAddress - The worker being endorsed
 * @param {number} rating - Rating 1-5
 * @param {string} jobType - Type of job (e.g., "Plumbing")
 * @param {string} feedbackText - Feedback text
 * @returns {Promise<{hash: string}>} Transaction hash
 */
export async function submitEndorsementOnChain(endorserAddress, workerAddress, rating, jobType, feedbackText) {
  const args = [
    new Address(endorserAddress).toScVal(),
    new Address(workerAddress).toScVal(),
    nativeToScVal(rating, { type: 'u32' }),
    nativeToScVal(jobType, { type: 'string' }),
    nativeToScVal(feedbackText, { type: 'string' }),
  ];

  const { hash } = await invokeContract(endorserAddress, 'submit_endorsement', args);
  return { hash };
}

/**
 * File a dispute against a specific endorsement.
 * @param {string} filerAddress - Who is filing the dispute
 * @param {string} workerAddress - The worker whose endorsement is disputed
 * @param {number} endorsementIndex - Index of the endorsement to dispute
 * @param {string} reason - Reason for the dispute
 * @returns {Promise<{hash: string}>}
 */
export async function fileDisputeOnChain(filerAddress, workerAddress, endorsementIndex, reason) {
  const args = [
    new Address(filerAddress).toScVal(),
    new Address(workerAddress).toScVal(),
    nativeToScVal(endorsementIndex, { type: 'u32' }),
    nativeToScVal(reason, { type: 'string' }),
  ];

  const { hash } = await invokeContract(filerAddress, 'file_dispute', args);
  return { hash };
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API — READ OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get the on-chain reputation score for a worker.
 * @param {string} workerAddress - Worker's Stellar address
 * @returns {Promise<{totalEndorsements: number, averageRating: number, weightedScore: number, trustTier: number, trustTierName: string, disputedCount: number}|null>}
 */
export async function getReputationOnChain(workerAddress) {
  try {
    const result = await queryContract('get_reputation', [
      new Address(workerAddress).toScVal(),
    ]);

    if (!result) return null;

    // Parse the ReputationScore struct from ScVal
    const fields = result.value();
    const score = {};
    for (const field of fields) {
      const key = field.key().value().toString();
      const val = field.val();
      if (key === 'total_endorsements') score.totalEndorsements = val.value();
      else if (key === 'average_rating') score.averageRating = Number(val.value()) / 100;
      else if (key === 'weighted_score') score.weightedScore = Number(val.value()) / 100;
      else if (key === 'trust_tier') score.trustTier = val.value();
      else if (key === 'disputed_count') score.disputedCount = val.value();
    }

    score.trustTierName = TIER_LABELS[score.trustTier] || 'Bronze';
    return score;
  } catch (err) {
    console.warn('[reputationContract] Failed to read on-chain reputation:', err.message);
    return null;
  }
}

/**
 * Get the trust tier for a worker (0=Bronze, 1=Silver, 2=Gold, 3=Platinum).
 * @param {string} workerAddress - Worker's Stellar address
 * @returns {Promise<{tier: number, name: string}|null>}
 */
export async function getTrustTierOnChain(workerAddress) {
  try {
    const result = await queryContract('get_trust_tier', [
      new Address(workerAddress).toScVal(),
    ]);
    if (!result) return null;

    const tier = Number(result.value());
    return { tier, name: TIER_LABELS[tier] || 'Bronze' };
  } catch (err) {
    console.warn('[reputationContract] Failed to read trust tier:', err.message);
    return null;
  }
}

/**
 * Get total endorsements across all workers.
 * @returns {Promise<number>}
 */
export async function getTotalEndorsementsOnChain() {
  try {
    const result = await queryContract('get_total_endorsements', []);
    if (!result) return 0;
    return Number(result.value());
  } catch {
    return 0;
  }
}

/**
 * Check if the reputation contract is currently paused.
 * @returns {Promise<boolean>}
 */
export async function isReputationPaused() {
  try {
    const result = await queryContract('is_paused', []);
    if (!result) return false;
    return result.value();
  } catch {
    return false;
  }
}

/**
 * Check if the reputation contract is available (contract ID is set).
 * @returns {boolean}
 */
export function isReputationContractAvailable() {
  return !!REPUTATION_CONTRACT_ID;
}
