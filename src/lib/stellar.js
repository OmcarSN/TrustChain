import {
  Address,
  Contract,
  Networks,
  TransactionBuilder,
  xdr,
  scVal, // scVal and other helper might be there or not
} from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc"; // Fixed import for v15+
import {
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const server = new Server(RPC_URL); // Changed from Rpc.Server to Server

const CREDENTIAL_CONTRACT_ID = import.meta.env.VITE_CREDENTIAL_CONTRACT_ID;
const REPUTATION_CONTRACT_ID = import.meta.env.VITE_REPUTATION_CONTRACT_ID;

/**
 * Connect to Freighter wallet and return public key.
 */
export async function connectFreighter() {
  if (!(await isConnected())) {
    throw new Error("Freighter wallet not found. Please install it.");
  }
  try {
    const result = await requestAccess();
    if (result.error) {
      throw new Error(result.error);
    }
    return typeof result === 'string' ? result : result.address;
  } catch (e) {
    throw new Error(e.message || "User rejected the connection request.");
  }
}

/**
 * Generic function to invoke a Soroban contract method.
 */
async function invokeContract(contractId, method, args, sourceAddress) {
  const contract = new Contract(contractId);
  const sourceAccount = await server.getAccount(sourceAddress);
  
  const tx = new TransactionBuilder(sourceAccount, {
    fee: "10000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(method, ...args)
    )
    .setTimeout(30)
    .build();

  // Simulate to get footprint and resource fees
  const simulation = await server.simulateTransaction(tx);
  // Important: in v15+ the result structure might differ
  if (simulation.error) {
    // Provide a cleaner error message from the simulation
    const errorMsg = simulation.error.message || JSON.stringify(simulation.error);
    throw new Error(`Simulation Failed: ${errorMsg}`);
  }

  // Assemble transaction from simulation
  const finalTx = TransactionBuilder.buildLazy(simulation, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  // Sign with Freighter
  const xdrTx = finalTx.toXDR();
  const result = await signTransaction(xdrTx, {
    network: NETWORK_PASSPHRASE,
  });

  if (result.error) {
    throw new Error(result.error);
  }

  const signedXdr = typeof result === 'string' ? result : (result.signedTransaction || result);

  // Submit to network
  const response = await server.sendTransaction(TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE));
  
  if (response.status === "ERROR") {
    throw new Error(`Transaction failed: ${JSON.stringify(response.errorResultXdr)}`);
  }

  // Poll for result
  let txResult = await server.getTransaction(response.hash);
  while (txResult.status === "NOT_FOUND" || txResult.status === "PROCESSING") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    txResult = await server.getTransaction(response.hash);
  }

  if (txResult.status === "FAILED") {
    throw new Error("Transaction execution failed on-chain.");
  }

  return response.hash;
}

/**
 * Issue a new worker credential.
 */
export async function issueCredential(workerData, address) {
  const args = [
    new Address(address).toScVal(),
    xdr.ScVal.scvString(workerData.fullName),
    xdr.ScVal.scvString(workerData.skillCategory),
    xdr.ScVal.scvString(workerData.city),
    xdr.ScVal.scvU32(parseInt(workerData.yearsExperience)),
    xdr.ScVal.scvString(workerData.bio),
  ];

  return await invokeContract(CREDENTIAL_CONTRACT_ID, "issue_credential", args, address);
}

/**
 * Submit a work endorsement.
 */
export async function submitEndorsement(endorsementData, address) {
  const args = [
    new Address(address).toScVal(),
    new Address(endorsementData.workerAddress).toScVal(),
    xdr.ScVal.scvU32(endorsementData.rating),
    xdr.ScVal.scvString(endorsementData.jobType),
    xdr.ScVal.scvString(endorsementData.feedback),
  ];

  return await invokeContract(REPUTATION_CONTRACT_ID, "submit_endorsement", args, address);
}

/**
 * Fetch worker reputation score.
 */
export async function getReputation(workerAddress) {
  try {
    const contract = new Contract(REPUTATION_CONTRACT_ID);
    // Use a read-only account if no address provided
    const tx = new TransactionBuilder(
        new Account(workerAddress || "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0"),
        { fee: "0", networkPassphrase: NETWORK_PASSPHRASE }
    )
        .addOperation(contract.call("get_reputation", new Address(workerAddress).toScVal()))
        .setTimeout(0)
        .build();

    const simulation = await server.simulateTransaction(tx);
    if (simulation.error || !simulation.result) {
        return { total_endorsements: 0, average_rating: 0 };
    }

    const scVal = simulation.result.retval;
    const obj = scVal.map();
    const getField = (key) => {
        const entry = obj.find(e => e.key().sym().toString() === key);
        return entry ? entry.val() : null;
    };

    return {
        total_endorsements: getField("total_endorsements").u32(),
        average_rating: getField("average_rating").u32(),
        last_updated: getField("last_updated")?.u64().toString() || "0",
    };
  } catch (e) {
    console.error("Error in getReputation:", e);
    return { total_endorsements: 0, average_rating: 0 };
  }
}

// Helper to provide a stub account for simulation
class Account {
  constructor(accountId, sequence) {
    this._accountId = accountId;
    this._sequence = sequence;
  }
  accountId() { return this._accountId; }
  sequenceNumber() { return this._sequence; }
  incrementSequenceNumber() { this._sequence = (BigInt(this._sequence) + 1n).toString(); }
}

/**
 * Fetch list of endorsements for a worker.
 */
export async function getEndorsements(workerAddress) {
  try {
    const contract = new Contract(REPUTATION_CONTRACT_ID);
    const tx = new TransactionBuilder(
        new Account(workerAddress, "0"),
        { fee: "0", networkPassphrase: NETWORK_PASSPHRASE }
    )
        .addOperation(contract.call("get_endorsements", new Address(workerAddress).toScVal()))
        .setTimeout(0)
        .build();

    const simulation = await server.simulateTransaction(tx);
    if (simulation.error || !simulation.result) return [];

    const vec = simulation.result.retval.vec();
    return vec.map((item) => {
        const obj = item.map();
        const getVal = (key) => {
            const entry = obj.find(e => e.key().sym().toString() === key);
            return entry ? entry.val() : null;
        };
        return {
            endorser: getVal("endorser_address").address().toString(),
            rating: getVal("rating").u32(),
            jobType: getVal("job_type").str().toString(),
            feedback: getVal("feedback").str().toString(),
            date: new Date(Number(getVal("timestamp").u64()) * 1000).toLocaleDateString(),
            txId: 'On-Chain',
        };
    });
  } catch (e) {
    console.error("Error in getEndorsements:", e);
    return [];
  }
}
