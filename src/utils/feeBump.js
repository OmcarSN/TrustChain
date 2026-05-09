import { TransactionBuilder } from "@stellar/stellar-sdk";
import { logError } from "./monitor";

/**
 * @typedef {import("@stellar/stellar-sdk").Keypair} Keypair
 */

/**
 * Wraps an inner transaction in a fee bump transaction.
 * Uses TransactionBuilder.buildFeeBumpTransaction() — the correct SDK API.
 *
 * Fee bumping allows a sponsor account to pay the transaction fee on behalf
 * of a worker, enabling gasless credential minting and endorsement flows.
 *
 * @param {string} innerTxXDR - The base64-encoded XDR of the inner transaction
 * @param {Keypair} sponsorKeypair - The sponsor's signing keypair (fee source)
 * @param {string} networkPassphrase - The Stellar network passphrase (e.g. "Test SDF Network ; September 2015")
 * @returns {string|null} The base64-encoded fee bump transaction XDR, or null on failure
 */
export function buildFeeBumpTransaction(innerTxXDR, sponsorKeypair, networkPassphrase) {
  try {
    const innerTransaction = TransactionBuilder.fromXDR(innerTxXDR, networkPassphrase);
    
    // Correct SDK method: TransactionBuilder.buildFeeBumpTransaction
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair,        // feeSource (Keypair)
      "200",                 // baseFee
      innerTransaction,      // innerTx
      networkPassphrase      // networkPassphrase
    );

    feeBumpTx.sign(sponsorKeypair);
    // IMPORTANT: Must specify 'base64' encoding — without it, toXDR() returns
    // a raw Buffer which Horizon rejects with HTTP 400.
    return feeBumpTx.toXDR('base64');
  } catch (error) {
    logError(error, "buildFeeBumpTransaction");
    // Fallback: Return null to trigger direct submission in stellar.js
    return null; 
  }
}
