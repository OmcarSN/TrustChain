import {
  isConnected,
  requestAccess
} from "@stellar/freighter-api";

export async function connectWallet() {
  try {
    // Step 1: Check if Freighter is installed
    const connected = await isConnected();
    
    if (!connected) {
      alert("Freighter wallet not found. Please install it from freighter.app");
      return null;
    }

    // Step 2: Request access from user (this also returns the address in v6)
    const result = await requestAccess();

    if (result.error) {
      alert("Connection failed: " + result.error);
      return null;
    }

    // Capture the public key (can be string or result.address)
    const publicKey = typeof result === 'string' ? result : result.address;

    if (!publicKey) {
      alert("Could not get wallet address. Please unlock Freighter and try again.");
      return null;
    }

    return publicKey;

  } catch (error) {
    console.error("Wallet connection error:", error);
    alert("Connection failed: " + error.message);
    return null;
  }
}
