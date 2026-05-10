/**
 * Decodes a Stellar transaction error into a human-friendly message.
 * Handles Error objects, Horizon API error responses, and string fallbacks.
 *
 * @param {Error|Object|string} error - The error to decode.
 * @returns {string} A user-friendly error message.
 */
export function decodeTransactionError(error) {
  // If it's a standard Error object with our already-parsed message
  if (error instanceof Error && error.message) {
    if (error.message.includes('User declined') || error.message.includes('cancelled')) {
      return "Transaction was cancelled in Freighter.";
    }
    return error.message;
  }

  // Handle Horizon API error response format
  if (error?.response?.data?.extras?.result_codes) {
    const codes = error.response.data.extras.result_codes;
    const txError = codes.transaction || '';
    const opErrors = codes.operations?.join(', ') || '';

    let friendlyMessage = "Transaction failed.";

    if (txError === 'tx_failed') {
      if (opErrors.includes('op_no_destination')) {
        friendlyMessage = "Destination account does not exist. It may need to be funded first.";
      } else if (opErrors.includes('op_underfunded')) {
        friendlyMessage = "Insufficient balance to complete the operation.";
      } else if (opErrors.includes('op_low_reserve')) {
        friendlyMessage = "Account does not have enough XLM to meet the minimum reserve requirement.";
      } else if (opErrors.includes('op_not_authorized')) {
        friendlyMessage = "You are not authorized to perform this operation.";
      } else if (opErrors.includes('op_bad_auth')) {
        friendlyMessage = "Transaction signature is invalid or missing.";
      } else {
        friendlyMessage = `Operation failed: ${opErrors}`;
      }
    } else if (txError === 'tx_bad_seq') {
      friendlyMessage = "Transaction sequence number is out of sync. Please try again.";
    } else if (txError === 'tx_insufficient_fee') {
      friendlyMessage = "Transaction fee is too low. The network might be busy.";
    } else if (txError) {
      friendlyMessage = `Transaction rejected: ${txError}`;
    }

    return friendlyMessage;
  }

  // Stringified error fallback
  const errorString = String(error);
  if (errorString.includes('op_no_destination')) {
    return "Destination account does not exist.";
  }

  return "An unexpected error occurred during the transaction.";
}
