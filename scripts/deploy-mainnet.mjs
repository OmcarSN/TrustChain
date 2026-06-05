/**
 * deploy-mainnet.mjs — Deploy a Soroban contract instance from an already-uploaded WASM hash.
 * Uses longer timeouts than the free RPC endpoints default.
 *
 * Usage: node scripts/deploy-mainnet.mjs
 */
import pkg from "@stellar/stellar-sdk";
const {
  Keypair,
  TransactionBuilder,
  Networks,
  Operation,
  xdr,
  StrKey,
} = pkg;

import rpc from "@stellar/stellar-sdk/rpc";
import { execSync } from "child_process";
import { readFileSync } from "fs";

// ── Config ──────────────────────────────────────────────────────────
const RPC_URLS = [
  "https://mainnet.rpc.com",
  "https://soroban-rpc.mainnet.stellar.gateway.fm",
  "https://rpc.lightsail.network",
  "https://stellar.api.onfinality.io/public",
  "https://rpc.ankr.com/stellar_soroban",
];

const WASM_HASH = "461f06c4c0aa2069ed7c4c9fab88379a3e8e4773e5246d03c52754b9298d9311";
const NETWORK_PASSPHRASE = Networks.PUBLIC;

// Get secret key from stellar CLI
const secretKey = execSync("stellar keys show mainnet-deployer", { encoding: "utf8" }).trim();
const keypair = Keypair.fromSecret(secretKey);
const publicKey = keypair.publicKey();

console.log(`\n🔑 Deployer: ${publicKey}`);
console.log(`📦 WASM Hash: ${WASM_HASH}`);
console.log(`🌐 Network: Mainnet\n`);

// ── Try each RPC until one works ────────────────────────────────────
async function tryDeploy(rpcUrl) {
  console.log(`\n🔄 Trying RPC: ${rpcUrl}`);
  
  const server = new rpc.Server(rpcUrl, {
    allowHttp: false,
    timeout: 120, // 120 second timeout (vs default ~10s)
  });

  // 1. Load account
  console.log("  📋 Loading account...");
  const account = await server.getAccount(publicKey);
  console.log(`  ✅ Account loaded (sequence: ${account.sequenceNumber()})`);

  // 2. Build deploy transaction
  console.log("  🔨 Building deploy transaction...");
  const wasmHashBuffer = Buffer.from(WASM_HASH, "hex");

  const tx = new TransactionBuilder(account, {
    fee: "10000000", // 1 XLM max fee (will be refunded mostly)
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.invokeHostFunction({
        func: xdr.HostFunction.hostFunctionTypeCreateContract(
          new xdr.CreateContractArgs({
            contractIdPreimage:
              xdr.ContractIdPreimage.contractIdPreimageFromAddress(
                new xdr.ContractIdPreimageFromAddress({
                  address: xdr.ScAddress.scAddressTypeAccount(
                    xdr.PublicKey.publicKeyTypeEd25519(
                      keypair.rawPublicKey()
                    )
                  ),
                  salt: Buffer.alloc(32), // zero salt
                })
              ),
            executable: xdr.ContractExecutable.contractExecutableWasm(
              wasmHashBuffer
            ),
          })
        ),
        auth: [],
      })
    )
    .setTimeout(300)
    .build();

  // 3. Simulate
  console.log("  🧪 Simulating transaction (120s timeout)...");
  const simResponse = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(simResponse)) {
    throw new Error(`Simulation error: ${simResponse.error}`);
  }

  // 4. Prepare (apply simulation results)
  console.log("  ✅ Simulation succeeded!");
  const preparedTx = rpc.assembleTransaction(tx, simResponse).build();

  // 5. Sign
  preparedTx.sign(keypair);
  console.log("  🖊️  Transaction signed");

  // 6. Submit and wait
  console.log("  🌎 Submitting to Mainnet...");
  const sendResponse = await server.sendTransaction(preparedTx);
  console.log(`  📤 Status: ${sendResponse.status}`);

  if (sendResponse.status === "ERROR") {
    throw new Error(`Send error: ${JSON.stringify(sendResponse)}`);
  }

  // 7. Poll for result
  const txHash = sendResponse.hash;
  console.log(`  ⏳ Waiting for confirmation (hash: ${txHash})...`);

  let getResponse;
  for (let i = 0; i < 60; i++) {
    getResponse = await server.getTransaction(txHash);
    if (getResponse.status !== "NOT_FOUND") break;
    await new Promise((r) => setTimeout(r, 2000));
    process.stdout.write(".");
  }
  console.log("");

  if (getResponse.status === "SUCCESS") {
    // Extract contract ID from the result
    const resultVal = getResponse.resultMetaXdr
      .v3()
      .sorobanMeta()
      .returnValue();
    
    const contractBytes = resultVal.address().contractId();
    const contractId = StrKey.encodeContract(contractBytes);
    
    console.log(`\n🎉 CONTRACT DEPLOYED SUCCESSFULLY!`);
    console.log(`📜 Contract ID: ${contractId}`);
    console.log(`🔗 TX Hash: ${txHash}`);
    console.log(`🔗 https://stellar.expert/explorer/public/contract/${contractId}`);
    return contractId;
  } else {
    throw new Error(`Transaction failed: ${getResponse.status}`);
  }
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  for (const rpcUrl of RPC_URLS) {
    try {
      const contractId = await tryDeploy(rpcUrl);
      return contractId;
    } catch (err) {
      console.error(`  ❌ Failed with ${rpcUrl}: ${err.message}`);
      console.log("  ➡️  Trying next RPC...\n");
    }
  }
  console.error("\n❌ All RPCs failed. Please try again later.");
  process.exit(1);
}

main();
