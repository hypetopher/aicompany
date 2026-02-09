import { createClient } from '@supabase/supabase-js';
import { getEnv } from './env.js';

let cached: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (cached) return cached;
  const url = getEnv('SUPABASE_URL');
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
