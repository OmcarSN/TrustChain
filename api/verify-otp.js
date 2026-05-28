import { createClient } from "@supabase/supabase-js";

/**
 * Vercel Serverless Function: POST /api/verify-otp
 *
 * Validates a 6-digit OTP against the Supabase `otp_codes` table.
 * On success, inserts into `verified_phones` and cleans up the OTP record.
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

  if (!otp || typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid OTP (must be 6 digits)" });
  }

  if (!walletAddress || typeof walletAddress !== "string") {
    return res.status(400).json({ error: "Missing or invalid walletAddress" });
  }

  // ── Main logic ────────────────────────────────────────────────────
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 1. Look up the OTP record matching phone + otp_code + wallet_address
    const { data: otpRecord, error: lookupError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("phone", phone)
      .eq("otp_code", otp)
      .eq("wallet_address", walletAddress)
      .maybeSingle();

    if (lookupError) {
      console.error("[verify-otp] Supabase lookup error:", lookupError.message);
      return res.status(500).json({ error: "Database lookup failed" });
    }

    // 2. Not found → invalid OTP
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // 3. Check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    // 4. OTP is valid — insert into verified_phones
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

    // 5. Cleanup — delete the used OTP record
    const { error: deleteError } = await supabase
      .from("otp_codes")
      .delete()
      .eq("phone", phone);

    if (deleteError) {
      console.error("[verify-otp] OTP cleanup error:", deleteError.message);
      // Non-fatal — verification already succeeded
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
