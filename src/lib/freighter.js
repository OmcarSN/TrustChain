/**
 * Freighter Wallet Integration Layer
 * All methods are wrapped with timeout protection and handle
 * both old-style (raw values) and new-style (response objects) Freighter API returns.
 */

// Timeout wrapper — prevents hanging when Freighter isn't installed
function withTimeout(promise, ms = 3000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Freighter operation timed out')), ms)
    )
  ]);
}

// Lazy load the freighter API to avoid blocking module init
let freighterApi = null;
async function getFreighterApi() {
  if (!freighterApi) {
    try {
      freighterApi = await import('@stellar/freighter-api');
    } catch (e) {
      console.warn('Failed to load @stellar/freighter-api:', e);
      freighterApi = null;
    }
  }
  return freighterApi;
}

/**
 * Helper: Extract boolean from isConnected response.
 * Freighter v6 returns { isConnected: boolean } instead of just boolean.
 */
function extractIsConnected(result) {
  if (typeof result === 'boolean') return result;
  if (result && typeof result === 'object' && 'isConnected' in result) return result.isConnected;
  return !!result;
}

/**
 * Helper: Extract network string from getNetwork response.
 * Freighter v6 returns { network: string, networkPassphrase: string } instead of just string.
 */
function extractNetwork(result) {
  if (typeof result === 'string') return result;
  if (result && typeof result === 'object' && result.network) return result.network;
  if (result && typeof result === 'object' && result.networkPassphrase) return result.networkPassphrase;
  return null;
}

/**
 * Helper: Extract public key from requestAccess response.
 * Freighter v6 returns { address: string } instead of just string.
 */
function extractAddress(result) {
  if (typeof result === 'string') return result;
  if (result && typeof result === 'object') {
    if (result.address) return result.address;
    if (result.publicKey) return result.publicKey;
  }
  return null;
}

/**
 * 1. connectWallet()
 */
export async function connectWallet() {
  try {
    const api = await getFreighterApi();
    if (!api) {
      throw new Error("Freighter wallet not found. Please install it from freighter.app");
    }

    const rawConnected = await withTimeout(api.isConnected(), 3000);
    const isInstalled = extractIsConnected(rawConnected);
    if (!isInstalled) {
      throw new Error("Freighter wallet not found. Please install it from freighter.app");
    }

    const result = await withTimeout(api.requestAccess(), 30000);
    if (result && result.error) {
      throw new Error(`Freighter connection error: ${result.error}`);
    }

    const publicKey = extractAddress(result);
    if (!publicKey) {
      throw new Error("Could not retrieve your public key. Please ensure your wallet is unlocked.");
    }

    return publicKey;
  } catch (error) {
    console.error("Freighter Connection Error:", error);
    throw error;
  }
}

/**
 * 2. getWalletAddress()
 */
export async function getWalletAddress() {
  try {
    const api = await getFreighterApi();
    if (!api) return null;

    const rawConnected = await withTimeout(api.isConnected(), 2000);
    if (!extractIsConnected(rawConnected)) return null;
    
    const result = await withTimeout(api.requestAccess(), 5000);
    return extractAddress(result);
  } catch (error) {
    return null;
  }
}

/**
 * 3. isWalletConnected()
 */
export async function isWalletConnected() {
  try {
    const api = await getFreighterApi();
    if (!api) return false;
    const result = await withTimeout(api.isConnected(), 2000);
    return extractIsConnected(result);
  } catch {
    return false;
  }
}

/**
 * Returns the current network string (e.g., "TESTNET", "PUBLIC").
 */
export async function getFreighterNetwork() {
  try {
    const api = await getFreighterApi();
    if (!api) return null;
    const result = await withTimeout(api.getNetwork(), 2000);
    return extractNetwork(result);
  } catch {
    return null;
  }
}

/**
 * 4. signTransaction(transactionXDR, networkPassphrase)
 */
export async function signTransaction(transactionXDR, networkPassphrase = "Test SDF Network ; September 2015") {
  try {
    const api = await getFreighterApi();
    if (!api) throw new Error("Freighter not available");

    console.log("[TrustChain] Requesting Freighter signature...");
    console.log("[TrustChain] XDR length:", transactionXDR?.length);

    let response;
    
    try {
      // Try new-style API first (Freighter v6+): positional args (xdr, opts)
      response = await api.signTransaction(transactionXDR, {
        networkPassphrase: networkPassphrase,
      });
    } catch (e1) {
      console.warn("[TrustChain] New-style signTransaction failed, trying object form:", e1);
      try {
        // Fallback: object-style API
        response = await api.signTransaction({
          xdr: transactionXDR,
          network: networkPassphrase,
          networkPassphrase: networkPassphrase,
        });
      } catch (e2) {
        console.warn("[TrustChain] Object-style signTransaction also failed:", e2);
        // Last resort: raw positional (oldest Freighter)
        response = await api.signTransaction(transactionXDR, networkPassphrase);
      }
    }

    console.log("[TrustChain] Freighter signTransaction response:", JSON.stringify(response));

    // Handle all known Freighter response formats
    if (typeof response === 'string' && response.length > 0) {
      return response;
    } else if (response && typeof response === 'object') {
      // Check for error in response
      if (response.error) {
        const errMsg = typeof response.error === 'string' 
          ? response.error 
          : (response.error.message || JSON.stringify(response.error));
        throw new Error(`Freighter signing error: ${errMsg}`);
      }
      // Various property names used across Freighter versions
      const signedXdr = response.signedTransaction 
        || response.signedTxXdr 
        || response.xdr 
        || response.signedXDR;
      if (signedXdr) {
        return signedXdr;
      }
    }
    
    throw new Error(
      "Signing failed: Freighter did not return a signed transaction. " +
      "Make sure you approve the popup in the Freighter extension. " +
      "Response was: " + JSON.stringify(response)
    );
  } catch (error) {
    console.error("Signing Error:", error);
    // Provide a friendlier message for common rejection cases
    if (error.message?.includes('User declined') || error.message?.includes('user rejected')) {
      throw new Error("Transaction cancelled — you rejected the signing request in Freighter.");
    }
    throw error;
  }
}
