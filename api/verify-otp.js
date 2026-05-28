import { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function: POST /api/verify-otp
 *
 * Validates an OTP via Twilio Verify API. On success, inserts the phone
 * into Supabase `verified_phones` to prevent reuse.
 *
 * Request body:  { phone: string, otp: string, walletAddress: string }
 * Response body: { success: true, verified: true } | { error: string }
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lvmbedzvyncvkewmgutk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = SERVICE_KEY ? createClient(
  SUPABASE_URL,
  SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      }
    }
  }
) : null;

const MAX_BODY_SIZE = 10 * 1024; // 10 KB

const E164_REGEX = /^\+[1-9]\d{1,14}$/;

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

  // ── Check Supabase client ─────────────────────────────────────────
  if (!supabase) {
    console.error("[verify-otp] SUPABASE_SERVICE_ROLE_KEY env var is not set.");
    return res.status(500).json({ error: "Database configuration error" });
  }

  // ── Read env ──────────────────────────────────────────────────────
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!twilioAccountSid || !twilioAuthToken || !verifyServiceSid) {
    console.error("[verify-otp] Twilio env vars are not fully configured.");
    return res.status(500).json({ error: "Verification service not configured" });
  }

  // ── Validate body ────────────────────────────────────────────────
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > MAX_BODY_SIZE) {
    return res.status(413).json({ error: "Request body too large" });
  }

  const { phone, otp, walletAddress } = req.body || {};

  if (!phone || typeof phone !== "string" || !E164_REGEX.test(phone)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid phone (must be E.164 format)" });
  }

  if (!otp || typeof otp !== "string" || !/^\d{4,8}$/.test(otp)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid OTP" });
  }

  if (!walletAddress || typeof walletAddress !== "string") {
    return res.status(400).json({ error: "Missing or invalid walletAddress" });
  }

  // ── Main logic ────────────────────────────────────────────────────
  try {
    // 1. Verify OTP via Twilio Verify API
    const checkUrl = `https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`;
    const twilioAuth = Buffer.from(
      `${twilioAccountSid}:${twilioAuthToken}`
    ).toString("base64");

    const twilioRes = await fetch(checkUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${twilioAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: phone,
        Code: otp,
      }).toString(),
    });

    const twilioData = await twilioRes.json();

    if (!twilioRes.ok || twilioData.status !== "approved") {
      if (twilioRes.status === 404) {
        return res.status(400).json({ error: "OTP has expired. Please request a new code." });
      }
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // 2. OTP is valid — upsert into verified_phones (upsert handles re-verification)
    const { error: insertError } = await supabase
      .from("verified_phones")
      .upsert({
        phone,
        wallet_address: walletAddress,
        verified_at: new Date().toISOString(),
      }, { onConflict: 'wallet_address' });

    if (insertError) {
      console.error("[verify-otp] Upsert verified_phones error:", insertError.message, insertError.details, insertError.hint);
      return res.status(500).json({ error: `Failed to save verification: ${insertError.message}` });
    }

    return res.status(200).json({ success: true, verified: true });
  } catch (err) {
    const safeMessage = (err.message || String(err)).replace(
      /S[A-Z0-9]{55}/g,
      "[REDACTED]"
    );
    console.error("[verify-otp] Error:", safeMessage);
    return res.status(500).json({ error: "OTP verification failed" });
  }
}
