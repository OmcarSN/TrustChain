import { createClient } from "@supabase/supabase-js";

/**
 * Vercel Serverless Function: POST /api/verify-otp
 *
 * Validates an OTP via Twilio Verify API. On success, inserts the phone
 * into Supabase `verified_phones` to prevent reuse.
 *
 * Request body:  { phone: string, otp: string, walletAddress: string }
 * Response body: { success: true, verified: true } | { error: string }
 */

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

  // ── Read env ──────────────────────────────────────────────────────
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "https://lvmbedzvyncvkewmgutk.supabase.co";

  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "sb_publishable_1eb6lJVw8NUspgplLHoNmQ_-3d3V8qL";

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
    const checkUrl = `https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationChecks`;
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
      // Twilio returns status "pending" for wrong code, or 404 if expired
      if (twilioRes.status === 404) {
        return res.status(400).json({ error: "OTP has expired. Please request a new code." });
      }
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // 2. OTP is valid — insert into verified_phones
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error: insertError } = await supabase
      .from("verified_phones")
      .insert({
        phone,
        wallet_address: walletAddress,
        verified_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("[verify-otp] Insert verified_phones error:", insertError.message);
      return res.status(500).json({ error: "Failed to save verification" });
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
