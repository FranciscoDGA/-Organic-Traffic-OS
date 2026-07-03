// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin client for server-side only. Bypasses RLS. NEVER expose to frontend.
// Only create client if env vars are configured
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }
  return supabaseAdmin;
}
