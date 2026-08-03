import {
  Keypair,
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  BASE_FEE,
} from "@stellar/stellar-sdk";

/**
 * Vercel Serverless Function: POST /api/build-endorse
 *
 * Builds a sponsored endorsement transaction. The sponsor pays the reserve
 * for the ManageData operation so users with low XLM balance can still endorse.
 *
 * If the endorser's account doesn't have enough XLM for the new data entry
 * reserve, the sponsor tops it up automatically.
 *
 * Request body:  { endorserKey: string, dataKey: string, dataValue: string }
 * Response body: { txXDR: string } | { error: string }
 */

const MAX_BODY_SIZE = 10 * 1024;

export const config = { maxDuration: 30 };

// ── Rate Limiting ──────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10; // 10 endorsements per minute per IP
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// ── Allowed Origins ────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://trust-chain-mocha.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

function getCorsOrigin(reqOrigin) {
  if (ALLOWED_ORIGINS.includes(reqOrigin)) return reqOrigin;
  return ALLOWED_ORIGINS[0];
}

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────
  const origin = getCorsOrigin(req.headers.origin);
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // ── Method guard ──────────────────────────────────────────────────
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Rate limiting ────────────────────────────────────────────────
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  // ── Read env ──────────────────────────────────────────────────────
  const sponsorSecret = process.env.SPONSOR_SECRET;
  if (!sponsorSecret) {
    console.error("[build-endorse] SPONSOR_SECRET env var is not set.");
    return res.status(500).json({ error: "Sponsor not configured" });
  }

  const network = (process.env.STELLAR_NETWORK || "mainnet").toLowerCase();
  const isMainnet = network === "mainnet";
  const networkPassphrase = isMainnet ? Networks.PUBLIC : Networks.TESTNET;
  const horizonUrl = isMainnet
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org";

  // ── Validate body ────────────────────────────────────────────────
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > MAX_BODY_SIZE) {
    return res.status(413).json({ error: "Request body too large" });
  }

  const { endorserKey, dataKey, dataValue } = req.body || {};

  if (!endorserKey || typeof endorserKey !== "string" || endorserKey.length !== 56) {
    return res.status(400).json({ error: "Missing or invalid endorserKey" });
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

    // Check if endorser account needs a top-up for the new data entry reserve
    let needsTopUp = false;
    try {
      const userAccount = await horizonServer.loadAccount(endorserKey);
      const nativeBalance = parseFloat(
        userAccount.balances.find((b) => b.asset_type === "native")?.balance || "0"
      );
      // Minimum needed: (2 + subentryCount + 1) * 0.5 XLM
      const minNeeded = (2 + userAccount.subentry_count + 1) * 0.5;
      if (nativeBalance < minNeeded) {
        needsTopUp = true;
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return res.status(400).json({ error: "Endorser account does not exist on the network" });
      }
      throw err;
    }

    // Load the sponsor account (source of the transaction = fee payer)
    const sponsorAccount = await horizonServer.loadAccount(sponsorPublicKey);

    const builder = new TransactionBuilder(sponsorAccount, {
      fee: BASE_FEE,
      networkPassphrase,
    });

    // If the endorser doesn't have enough XLM for the new data entry reserve, top up
    if (needsTopUp) {
      builder.addOperation(
        Operation.payment({
          destination: endorserKey,
          asset: Asset.native(),
          amount: "1", // Top up with 1 XLM
        })
      );
    }

    // Add the ManageData operation with source = endorser's publicKey
    // This means the endorser must co-sign to authorize this operation
    builder.addOperation(
      Operation.manageData({
        name: dataKey,
        value: dataValue,
        source: endorserKey,
      })
    );

    builder.setTimeout(120);

    const transaction = builder.build();

    // Sign with sponsor key (authorizes fee payment + optional top-up)
    transaction.sign(sponsorKeypair);

    // Return partially signed XDR — endorser must co-sign via Freighter
    const txXDR = transaction.toXDR("base64");

    return res.status(200).json({ txXDR });
  } catch (err) {
    const safeMessage = (err.message || String(err)).replace(
      /S[A-Z0-9]{55}/g,
      "[REDACTED]"
    );
    console.error("[build-endorse] Error:", safeMessage);
    return res.status(500).json({ error: "Transaction build failed" });
  }
}
