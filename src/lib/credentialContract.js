import {
  Contract,
  TransactionBuilder,
  nativeToScVal,
  Address,
  rpc,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import {
  CREDENTIAL_CONTRACT_ID,
  SOROBAN_URL,
  NETWORK_PASSPHRASE,
} from './networkConfig';
import * as freighter from './freighter';

const sorobanServer = new rpc.Server(SOROBAN_URL);

// Status labels
const STATUS_LABELS = ['Available', 'Busy', 'Inactive'];

/**
 * Helper: build, simulate, sign and submit a Soroban contract call.
 * @param {string} callerPublicKey - The wallet address calling the contract
 * @param {string} methodName - The contract method to invoke
 * @param {Array} args - ScVal arguments for the method
 * @returns {Promise<object>} The transaction result
 */
async function invokeContract(callerPublicKey, methodName, args) {
  if (!CREDENTIAL_CONTRACT_ID) {
    throw new Error('Credential contract ID is not configured');
  }

  const contract = new Contract(CREDENTIAL_CONTRACT_ID);
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
  if (!CREDENTIAL_CONTRACT_ID) {
    return null;
  }

  const contract = new Contract(CREDENTIAL_CONTRACT_ID);

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

export async function updateWorkerStatus(workerAddress, status) {
  // status: 0=Available, 1=Busy, 2=Inactive
  const args = [
    new Address(workerAddress).toScVal(),
    nativeToScVal(status, { type: 'u32' }),
  ];
  const { hash } = await invokeContract(workerAddress, 'update_status', args);
  return { hash };
}

export async function getWorkerStatus(workerAddress) {
  try {
    const result = await queryContract('get_status', [
      new Address(workerAddress).toScVal(),
    ]);

    if (!result) {
      return { status: 0, label: STATUS_LABELS[0] };
    }

    const statusVal = Number(result.value());
    return { status: statusVal, label: STATUS_LABELS[statusVal] || 'Unknown' };
  } catch (err) {
    console.warn('[credentialContract] Failed to read on-chain status:', err.message);
    return { status: 0, label: STATUS_LABELS[0] };
  }
}

export function isCredentialContractAvailable() {
  return !!CREDENTIAL_CONTRACT_ID;
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || 'Unknown';
}
