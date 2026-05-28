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
 * Request body:  { innerTxXDR: string }
 * Response body: { feeBumpXDR: string } | { error: string }
 */

const MAX_BODY_SIZE = 10 * 1024; // 10 KB — generous limit for a single XDR

export default async function handler(req, res) {
  // ── Method guard ──────────────────────────────────────────────────
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── CORS — restrict to same-origin (Vercel serves API + client on same domain) ──
  res.setHeader("Access-Control-Allow-Origin", "*"); // Vercel same-origin by default
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
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
    const network = (process.env.VITE_STELLAR_NETWORK || "testnet").toLowerCase();
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
