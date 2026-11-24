import type { SupabaseClient } from '@supabase/supabase-js';
import { BACKEND_ENABLED, SUPABASE_ANON_KEY, SUPABASE_URL } from '../config/site';

let client: Promise<SupabaseClient | null> | null = null;

/** Loads supabase-js on demand so it never weighs on the first page load. Returns null in demo mode. */
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!BACKEND_ENABLED) return Promise.resolve(null);
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'mansoorah.v1.session' },
    }),
  );
  return client;
}
