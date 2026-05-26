import { createClient } from '@supabase/supabase-js';

// Supabase anon key is a PUBLIC client key (not a secret).
// It is safe to include in the client bundle — access is governed by Row Level Security.
// Fallback values ensure the build works even if Vercel env vars aren't baked in at build time.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lvmbedzvyncvkewmgutk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1eb6lJVw8NUspgplLHoNmQ_-3d3V8qL';

/**
 * Supabase client singleton.
 * Used across the app for all database reads/writes.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
