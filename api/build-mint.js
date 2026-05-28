import {
  Keypair,
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  BASE_FEE,
} from "@stellar/stellar-sdk";

/**
 * Vercel Serverless Function: POST /api/build-mint
 *
 * Builds a sponsored mint transaction. If the user's account doesn't exist
 * on the Stellar ledger, a CreateAccount operation is prepended so the
 * sponsor funds the account with the minimum reserve.
 *
 * The sponsor's SPONSOR_SECRET is kept server-side only (never in the browser).
 *
 * Request body:  { publicKey: string, dataKey: string, dataValue: string }
 * Response body: { txXDR: string, accountCreated: boolean } | { error: string }
 */

const MAX_BODY_SIZE = 10 * 1024; // 10 KB

export default async function handler(req, res) {
  // ── Method guard ──────────────────────────────────────────────────
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── CORS ──────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // ── Read env ──────────────────────────────────────────────────────
  const sponsorSecret = process.env.SPONSOR_SECRET;
  if (!sponsorSecret) {
    console.error("[build-mint] SPONSOR_SECRET env var is not set.");
    return res.status(500).json({ error: "Sponsor not configured" });
  }

  // Determine network from env (same var the frontend uses)
  const network = (process.env.VITE_STELLAR_NETWORK || "testnet").toLowerCase();
  const isMainnet = network === "mainnet";

  const networkPassphrase = isMainnet
    ? Networks.PUBLIC
    : Networks.TESTNET;

  const horizonUrl = isMainnet
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org";

  // ── Validate body ────────────────────────────────────────────────
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > MAX_BODY_SIZE) {
    return res.status(413).json({ error: "Request body too large" });
  }

  const { publicKey, dataKey, dataValue } = req.body || {};

  if (!publicKey || typeof publicKey !== "string" || publicKey.length !== 56) {
    return res.status(400).json({ error: "Missing or invalid publicKey" });
  }
  if (!dataKey || typeof dataKey !== "string") {
    return res.status(400).json({ error: "Missing or invalid dataKey" });
  }
  if (!dataValue || typeof dataValue !== "string") {
    return res.status(400).json({ error: "Missing or invalid dataValue" });
  }

  // ── Build transaction ─────────────────────────────────────────────
  try {
    const sponsorKeypair = Keypair.fromSecret(sponsorSecret);
    const sponsorPublicKey = sponsorKeypair.publicKey();
    const horizonServer = new Horizon.Server(horizonUrl);

    // Check if user account exists on the ledger
    let accountExists = true;
    try {
      await horizonServer.loadAccount(publicKey);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        accountExists = false;
      } else {
        throw err;
      }
    }

    // Load the sponsor account (source of the transaction = fee payer)
    const sponsorAccount = await horizonServer.loadAccount(sponsorPublicKey);

    const builder = new TransactionBuilder(sponsorAccount, {
      fee: BASE_FEE,
      networkPassphrase,
    });

    // If the user's account doesn't exist, create it with minimum reserve
    if (!accountExists) {
      builder.addOperation(
        Operation.createAccount({
          destination: publicKey,
          startingBalance: "1", // Minimum reserve to activate the account
        })
      );
    }

    // Add the ManageData operation with source = user's publicKey
    // This means the user must co-sign to authorize this operation
    builder.addOperation(
      Operation.manageData({
        name: dataKey,
        value: dataValue,
        source: publicKey,
      })
    );

    builder.setTimeout(120); // 2-minute timeout for user signing

    const transaction = builder.build();

    // Sign with sponsor key (authorizes fee payment + account creation)
    transaction.sign(sponsorKeypair);

    // Return partially signed XDR — user must co-sign via Freighter
    const txXDR = transaction.toXDR("base64");

    return res.status(200).json({
      txXDR,
      accountCreated: !accountExists,
    });
  } catch (err) {
    // Sanitize — never leak secret key material
    const safeMessage = (err.message || String(err)).replace(
      /S[A-Z0-9]{55}/g,
      "[REDACTED]"
    );
    console.error("[build-mint] Error:", safeMessage);
    return res.status(500).json({ error: `Transaction build failed: ${safeMessage}` });
  }
}
