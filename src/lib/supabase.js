import { createClient } from '@supabase/supabase-js';

// Supabase anon key is a PUBLIC client key (not a secret).
// It is safe to include in the client bundle — access is governed by Row Level Security.
// Fallback values ensure the build works even if Vercel env vars aren't baked in at build time.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lvmbedzvyncvkewmgutk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bWJlZHp2eW5jdmtld21ndXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjA0MjUsImV4cCI6MjA2MzkzNjQyNX0.L-O5EucvLchUL8uZkRWu8_RIBhCco6m7iJT3EK4qA5A';

/**
 * Supabase client singleton.
 * Used across the app for all database reads/writes.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
