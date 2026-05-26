import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[TrustChain] Supabase credentials missing — check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
}

/**
 * Supabase client singleton.
 * Used across the app for all database reads/writes.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
