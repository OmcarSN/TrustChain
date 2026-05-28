import { createClient } from "@supabase/supabase-js";

/**
 * Vercel Serverless Function: POST /api/send-otp
 *
 * Checks for duplicate phone numbers in Supabase, then sends an OTP
 * via Twilio Verify API (handles OTP generation, delivery, and expiry).
 *
 * Request body:  { phone: string, walletAddress: string }
 * Response body: { success: true, message: string } | { error: string }
 */

const MAX_BODY_SIZE = 10 * 1024; // 10 KB

// E.164 phone format: + followed by 1-15 digits
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
  const supabaseUrl = process.env.SUPABASE_URL || "https://lvmbedzvyncvkewmgutk.supabase.co";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    console.error("[send-otp] SUPABASE_SERVICE_ROLE_KEY env var is not set.");
    return res.status(500).json({ error: "Database configuration error" });
  }

  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!twilioAccountSid || !twilioAuthToken || !verifyServiceSid) {
    console.error("[send-otp] Twilio env vars are not fully configured.");
    return res.status(500).json({ error: "SMS service not configured" });
  }

  // ── Validate body ────────────────────────────────────────────────
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > MAX_BODY_SIZE) {
    return res.status(413).json({ error: "Request body too large" });
  }

  const { phone, walletAddress } = req.body || {};

  if (!phone || typeof phone !== "string" || !E164_REGEX.test(phone)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid phone (must be E.164 format, e.g. +91XXXXXXXXXX)" });
  }

  if (!walletAddress || typeof walletAddress !== "string") {
    return res.status(400).json({ error: "Missing or invalid walletAddress" });
  }

  // ── Main logic ────────────────────────────────────────────────────
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Check if phone is already verified
    const { data: existingPhone, error: lookupError } = await supabase
      .from("verified_phones")
      .select("phone")
      .eq("phone", phone)
      .maybeSingle();

    if (lookupError) {
      console.error("[send-otp] Supabase lookup error:", lookupError.message);
      return res.status(500).json({ error: "Database lookup failed" });
    }

    if (existingPhone) {
      return res
        .status(409)
        .json({ error: "This phone number has already been registered" });
    }

    // 2. Send OTP via Twilio Verify API
    const verifyUrl = `https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`;
    const twilioAuth = Buffer.from(
      `${twilioAccountSid}:${twilioAuthToken}`
    ).toString("base64");

    const twilioRes = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${twilioAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: phone,
        Channel: "sms",
      }).toString(),
    });

    if (!twilioRes.ok) {
      const twilioError = await twilioRes.text();
      console.error("[send-otp] Twilio Verify error:", twilioError);
      return res.status(500).json({ error: "Failed to send verification code" });
    }

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    const safeMessage = (err.message || String(err)).replace(
      /S[A-Z0-9]{55}/g,
      "[REDACTED]"
    );
    console.error("[send-otp] Error:", safeMessage);
    return res.status(500).json({ error: "OTP send failed" });
  }
}
