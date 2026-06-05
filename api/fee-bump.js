import { Keypair, Networks } from "@stellar/stellar-sdk";
import { buildFeeBumpTransaction } from "../src/utils/feeBump.js";

/**
 * Vercel Serverless Function: POST /api/fee-bump
 *
 * Wraps a signed inner transaction in a fee-bump transaction using the
 * sponsor's secret key. The secret key is stored server-side only
 * (SPONSOR_SECRET env var, NO VITE_ prefix) and never reaches the browser.
 *
 * Uses the shared `buildFeeBumpTransaction` utility from src/utils/feeBump.js
 * to maintain a single source of truth for the fee-bump build logic.
 *
 * Security:
 * - CORS restricted to deployment origin
 * - In-memory rate limiting (10 req/min per IP)
 * - Network defaults to mainnet (production)
 *
 * Request body:  { innerTxXDR: string }
 * Response body: { feeBumpXDR: string } | { error: string }
 */

const MAX_BODY_SIZE = 10 * 1024; // 10 KB — generous limit for a single XDR

// ── Rate Limiting ──────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 requests per window per IP
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
  return ALLOWED_ORIGINS[0]; // default to production
}

export const config = { maxDuration: 30 };

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
    console.error("[fee-bump] SPONSOR_SECRET env var is not set.");
    return res.status(500).json({ error: "Sponsor not configured" });
  }

  // ── Validate body ────────────────────────────────────────────────
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > MAX_BODY_SIZE) {
    return res.status(413).json({ error: "Request body too large" });
  }

  const { innerTxXDR } = req.body || {};

  if (!innerTxXDR || typeof innerTxXDR !== "string") {
    return res.status(400).json({ error: "Missing or invalid innerTxXDR" });
  }

  // ── Build fee bump via shared utility ─────────────────────────────
  try {
    const network = (process.env.STELLAR_NETWORK || "mainnet").toLowerCase();
    const isMainnet = network === "mainnet";
    const networkPassphrase = isMainnet ? Networks.PUBLIC : Networks.TESTNET;

    const sponsorKeypair = Keypair.fromSecret(sponsorSecret);
    const feeBumpXDR = buildFeeBumpTransaction(
      innerTxXDR,
      sponsorKeypair,
      networkPassphrase
    );

    if (!feeBumpXDR) {
      return res.status(500).json({ error: "Fee bump build returned null" });
    }

    return res.status(200).json({ feeBumpXDR });
  } catch (err) {
    // Sanitize — never leak secret key material in error responses
    const safeMessage = (err.message || String(err)).replace(
      /S[A-Z0-9]{55}/g,
      "[REDACTED]"
    );
    console.error("[fee-bump] Error:", safeMessage);
    return res.status(500).json({ error: "Fee bump failed" });
  }
}
