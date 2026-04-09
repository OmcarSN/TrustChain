import { TransactionBuilder, FeeBumpTransaction } from "@stellar/stellar-sdk";
import { logError } from "./monitor";

/**
 * Wraps an inner transaction in a fee bump transaction.
 */
export function buildFeeBumpTransaction(innerTxXDR, sponsorKeypair, networkPassphrase) {
  try {
    const innerTransaction = TransactionBuilder.fromXDR(innerTxXDR, networkPassphrase);
    
    // Use the constructor approach but with better error handling
    const feeBumpTx = new FeeBumpTransaction(
      sponsorKeypair.publicKey(),
      "200", 
      innerTransaction,
      networkPassphrase
    );

    feeBumpTx.sign(sponsorKeypair);
    return feeBumpTx.toXDR();
  } catch (error) {
    logError(error, "buildFeeBumpTransaction");
    // Fallback: Return null to trigger direct submission in stellar.js
    return null; 
  }
}
