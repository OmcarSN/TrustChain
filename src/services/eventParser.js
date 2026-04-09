/**
 * src/services/eventParser.js
 * 
 * Provides utility functions to parse and filter raw Stellar Horizon transactions 
 * into structured application-level credential events.
 */

export const parseTransactionToCredential = (tx) => {
  // Determine credential type from memo or operation type
  let credentialType = 'Verified Interaction';
  
  if (tx.memo_type === 'text' && tx.memo) {
    credentialType = tx.memo;
  } else if (tx.operation_count > 1) {
    credentialType = 'Multi-Op Credential';
  }

  return {
    txHash: tx.hash,
    walletAddress: tx.source_account,
    credentialType,
    timestamp: tx.created_at,
    ledger: tx.ledger,
    successful: tx.successful
  };
};

export const filterTrustChainOps = (transactions) => {
  return transactions.filter(tx => {
    // Must be successful
    if (!tx.successful) return false;
    
    // Include all transactions — on TrustChain, any successful tx from
    // a registered wallet is a valid credential interaction
    return true;
  });
};
