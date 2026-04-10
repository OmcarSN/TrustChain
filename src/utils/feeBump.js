import { TransactionBuilder } from "@stellar/stellar-sdk";
import { logError } from "./monitor";

/**
 * Wraps an inner transaction in a fee bump transaction.
 * Uses TransactionBuilder.buildFeeBumpTransaction() — the correct SDK API.
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
    return feeBumpTx.toXDR();
  } catch (error) {
    logError(error, "buildFeeBumpTransaction");
    // Fallback: Return null to trigger direct submission in stellar.js
    return null; 
  }
}
