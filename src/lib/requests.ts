import { getSupabase } from './supabase';

export type RequestKind = 'technician' | 'partner-retail' | 'partner-landlord' | 'contact';

/**
 * Saves a form submission for the admin dashboard. In demo mode (no backend) it resolves to true
 * without sending anything; the WhatsApp/e-mail hand-off is always offered as well.
 */
export async function submitRequest(kind: RequestKind, payload: Record<string, unknown>, userId?: string): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return true;
  const { error } = await sb.from('requests').insert({ kind, payload, user_id: userId ?? null });
  return !error;
}
