import {
  Contract,
  TransactionBuilder,
  nativeToScVal,
  Address,
  rpc,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import {
  GOVERNANCE_CONTRACT_ID,
  SOROBAN_URL,
  NETWORK_PASSPHRASE,
} from './networkConfig';
import * as freighter from './freighter';

/**
 * GovernanceContract — Soroban client wrapper for the on-chain Governance contract.
 *
 * Provides functions to:
 * - Create proposals, vote, finalize, and execute
 * - Read proposals, council, vote tallies
 * - Pause/resume the contract (admin only)
 */

const sorobanServer = new rpc.Server(SOROBAN_URL);

// ── Proposal status labels ────────────────────────────────────
const STATUS_LABELS = ['Active', 'Passed', 'Rejected', 'Executed', 'Expired'];

// ── Proposal type labels ──────────────────────────────────────
const TYPE_LABELS = [
  'Admin Transfer',
  'Pause Contract',
  'Resume Contract',
  'Add Council Member',
  'Remove Council Member',
  'Update Quorum',
  'General',
];

/**
 * Helper: build, simulate, sign and submit a Soroban contract call.
 */
async function invokeContract(callerPublicKey, methodName, args) {
  if (!GOVERNANCE_CONTRACT_ID) {
    throw new Error('Governance contract ID is not configured');
  }

  const contract = new Contract(GOVERNANCE_CONTRACT_ID);
  const account = await sorobanServer.getAccount(callerPublicKey);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(methodName, ...args))
    .setTimeout(120)
    .build();

  const simulated = await sorobanServer.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  const assembled = rpc.assembleTransaction(tx, simulated).build();
  const signedXdr = await freighter.signTransaction(assembled.toXDR());
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);

  const response = await sorobanServer.sendTransaction(signedTx);
  if (response.status === 'ERROR') {
    throw new Error(`Transaction failed: ${response.errorResult?.toString() || 'Unknown'}`);
  }

  let result = response;
  while (result.status === 'PENDING' || result.status === 'NOT_FOUND') {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    result = await sorobanServer.getTransaction(response.hash);
  }

  if (result.status === 'FAILED') {
    throw new Error(`Transaction failed on-chain`);
  }

  return { hash: response.hash, result };
}

/**
 * Helper: read-only contract query (no signing needed).
 */
async function queryContract(methodName, args) {
  if (!GOVERNANCE_CONTRACT_ID) return null;

  const contract = new Contract(GOVERNANCE_CONTRACT_ID);
  const dummyKey = import.meta.env.VITE_SPONSOR_PUBLIC_KEY || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
  let account;
  try {
    account = await sorobanServer.getAccount(dummyKey);
  } catch {
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
  if (rpc.Api.isSimulationError(simulated) || !simulated.result) return null;

  return simulated.result.retval;
}

// ═══════════════════════════════════════════════════════════════
// WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Create a governance proposal. Council members only.
 */
export async function createProposal(proposerAddress, title, description, proposalType, targetAddress) {
  const args = [
    new Address(proposerAddress).toScVal(),
    nativeToScVal(title, { type: 'string' }),
    nativeToScVal(description, { type: 'string' }),
    nativeToScVal(proposalType, { type: 'u32' }),
    new Address(targetAddress).toScVal(),
  ];
  const { hash } = await invokeContract(proposerAddress, 'create_proposal', args);
  return { hash };
}

/**
 * Vote on an active proposal. Council members only.
 */
export async function voteOnProposal(voterAddress, proposalId, approve) {
  const args = [
    new Address(voterAddress).toScVal(),
    nativeToScVal(proposalId, { type: 'u32' }),
    nativeToScVal(approve, { type: 'bool' }),
  ];
  const { hash } = await invokeContract(voterAddress, 'vote', args);
  return { hash };
}

/**
 * Finalize a proposal after voting ends.
 */
export async function finalizeProposal(callerAddress, proposalId) {
  const args = [nativeToScVal(proposalId, { type: 'u32' })];
  const { hash } = await invokeContract(callerAddress, 'finalize_proposal', args);
  return { hash };
}

/**
 * Execute a passed proposal. Admin only.
 */
export async function executeProposal(adminAddress, proposalId) {
  const args = [nativeToScVal(proposalId, { type: 'u32' })];
  const { hash } = await invokeContract(adminAddress, 'execute_proposal', args);
  return { hash };
}

/**
 * Pause the governance contract. Admin only.
 */
export async function pauseGovernance(adminAddress) {
  const { hash } = await invokeContract(adminAddress, 'pause_contract', []);
  return { hash };
}

/**
 * Resume the governance contract. Admin only.
 */
export async function resumeGovernance(adminAddress) {
  const { hash } = await invokeContract(adminAddress, 'resume_contract', []);
  return { hash };
}

// ═══════════════════════════════════════════════════════════════
// READ OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get a proposal by ID.
 * @returns {Promise<object|null>}
 */
export async function getProposal(proposalId) {
  try {
    const result = await queryContract('get_proposal', [
      nativeToScVal(proposalId, { type: 'u32' }),
    ]);
    if (!result) return null;

    const fields = result.value();
    const proposal = {};
    for (const field of fields) {
      const key = field.key().value().toString();
      const val = field.val();
      if (key === 'id') proposal.id = Number(val.value());
      else if (key === 'proposer') proposal.proposer = Address.fromScVal(val).toString();
      else if (key === 'title') proposal.title = val.value().toString();
      else if (key === 'description') proposal.description = val.value().toString();
      else if (key === 'proposal_type') {
        proposal.proposalType = Number(val.value());
        proposal.proposalTypeName = TYPE_LABELS[proposal.proposalType] || 'Unknown';
      }
      else if (key === 'target_address') proposal.targetAddress = Address.fromScVal(val).toString();
      else if (key === 'created_at') proposal.createdAt = Number(val.value());
      else if (key === 'expires_at') proposal.expiresAt = Number(val.value());
      else if (key === 'status') {
        proposal.status = Number(val.value());
        proposal.statusName = STATUS_LABELS[proposal.status] || 'Unknown';
      }
      else if (key === 'executed_at') proposal.executedAt = Number(val.value());
    }
    return proposal;
  } catch (err) {
    console.warn('[governanceContract] Failed to read proposal:', err.message);
    return null;
  }
}

/**
 * Get total proposal count.
 */
export async function getProposalCount() {
  try {
    const result = await queryContract('get_proposal_count', []);
    return result ? Number(result.value()) : 0;
  } catch {
    return 0;
  }
}

/**
 * Get all proposals.
 */
export async function getAllProposals() {
  const count = await getProposalCount();
  const proposals = [];
  for (let i = 0; i < count; i++) {
    const p = await getProposal(i);
    if (p) proposals.push(p);
  }
  return proposals;
}

/**
 * Get vote tally for a proposal.
 */
export async function getVoteTally(proposalId) {
  try {
    const result = await queryContract('get_vote_tally', [
      nativeToScVal(proposalId, { type: 'u32' }),
    ]);
    if (!result) return null;

    const fields = result.value();
    const tally = {};
    for (const field of fields) {
      const key = field.key().value().toString();
      const val = field.val();
      if (key === 'yes_votes') tally.yesVotes = Number(val.value());
      else if (key === 'no_votes') tally.noVotes = Number(val.value());
      else if (key === 'total_eligible') tally.totalEligible = Number(val.value());
    }
    return tally;
  } catch {
    return null;
  }
}

/**
 * Get the council member list.
 */
export async function getCouncil() {
  try {
    const result = await queryContract('get_council', []);
    if (!result) return [];
    return result.value().map(v => Address.fromScVal(v).toString());
  } catch {
    return [];
  }
}

/**
 * Check if an address is a council member.
 */
export async function isCouncilMember(address) {
  try {
    const result = await queryContract('is_council_member', [
      new Address(address).toScVal(),
    ]);
    return result ? result.value() : false;
  } catch {
    return false;
  }
}

/**
 * Check if a voter has voted on a proposal.
 */
export async function hasVoted(proposalId, voterAddress) {
  try {
    const result = await queryContract('has_voted', [
      nativeToScVal(proposalId, { type: 'u32' }),
      new Address(voterAddress).toScVal(),
    ]);
    return result ? result.value() : false;
  } catch {
    return false;
  }
}

/**
 * Get the admin address.
 */
export async function getAdmin() {
  try {
    const result = await queryContract('get_admin', []);
    if (!result) return null;
    return Address.fromScVal(result).toString();
  } catch {
    return null;
  }
}

/**
 * Check if governance contract is paused.
 */
export async function isGovernancePaused() {
  try {
    const result = await queryContract('is_paused', []);
    return result ? result.value() : false;
  } catch {
    return false;
  }
}

/**
 * Get quorum percentage.
 */
export async function getQuorumPercent() {
  try {
    const result = await queryContract('get_quorum_percent', []);
    return result ? Number(result.value()) : 51;
  } catch {
    return 51;
  }
}

/**
 * Check if governance contract is available (ID is configured).
 */
export function isGovernanceContractAvailable() {
  return !!GOVERNANCE_CONTRACT_ID;
}

export { STATUS_LABELS, TYPE_LABELS };
