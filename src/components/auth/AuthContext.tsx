import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BACKEND_ENABLED, SITE_URL } from '../../config/site';
import { getSupabase } from '../../lib/supabase';
import { readJSON, removeKey, writeJSON } from '../../lib/storage';
import { sha256 } from '../../lib/auth';

export type Role = 'customer' | 'technician' | 'admin';

export interface Account {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
}

/** Error codes mapped to translated messages in the UI. */
export type AuthError = 'invalid' | 'exists' | 'notConfirmed' | 'weak' | 'generic';
type Result = { ok: true; needsConfirmation?: boolean } | { ok: false; error: AuthError };

interface AuthState {
  live: boolean;
  loading: boolean;
  user: Account | null;
  signIn: (email: string, password: string) => Promise<Result>;
  signUp: (input: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'customer' | 'technician';
  }) => Promise<Result>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<Result>;
  updatePassword: (password: string) => Promise<Result>;
}

const Ctx = createContext<AuthState | null>(null);
const DEMO_KEY = 'auth';

function mapError(message: string | undefined): AuthError {
  const m = (message ?? '').toLowerCase();
  if (m.includes('invalid login')) return 'invalid';
  if (m.includes('already registered') || m.includes('already exists')) return 'exists';
  if (m.includes('not confirmed')) return 'notConfirmed';
  if (m.includes('password')) return 'weak';
  return 'generic';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(() => (BACKEND_ENABLED ? null : readJSON<Account | null>(DEMO_KEY, null)));
  const [loading, setLoading] = useState(BACKEND_ENABLED);

  const loadProfile = useCallback(async (id: string, email: string, meta: Record<string, unknown>) => {
    const sb = await getSupabase();
    if (!sb) return;
    const { data } = await sb.from('profiles').select('full_name, phone, role').eq('id', id).maybeSingle();
    setUser({
      id,
      email,
      name: (data?.full_name as string) || (meta.full_name as string) || email.split('@')[0],
      phone: (data?.phone as string) || (meta.phone as string) || '',
      role: ((data?.role as Role) ?? 'customer') as Role,
    });
  }, []);

  useEffect(() => {
    if (!BACKEND_ENABLED) return;
    let unsub: (() => void) | undefined;
    getSupabase().then(async (sb) => {
      if (!sb) return setLoading(false);
      const { data } = await sb.auth.getSession();
      const s = data.session;
      if (s) await loadProfile(s.user.id, s.user.email ?? '', s.user.user_metadata ?? {});
      setLoading(false);
      const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
        if (session) void loadProfile(session.user.id, session.user.email ?? '', session.user.user_metadata ?? {});
        else setUser(null);
      });
      unsub = () => sub.subscription.unsubscribe();
    });
    return () => unsub?.();
  }, [loadProfile]);

  const signIn = useCallback<AuthState['signIn']>(
    async (email, password) => {
      const sb = await getSupabase();
      if (!sb) {
        // Demo mode: no password is stored, only a hash of the e-mail as the account id.
        const id = await sha256(email);
        const prev = readJSON<Account | null>(`account.${id}`, null);
        const acc: Account = prev ?? { id, email: '', name: email.split('@')[0], phone: '', role: 'customer' };
        writeJSON(DEMO_KEY, acc);
        setUser(acc);
        return { ok: true };
      }
      const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data.user) return { ok: false, error: mapError(error?.message) };
      await loadProfile(data.user.id, data.user.email ?? '', data.user.user_metadata ?? {});
      return { ok: true };
    },
    [loadProfile],
  );

  const signUp = useCallback<AuthState['signUp']>(
    async ({ email, password, name, phone, role }) => {
      const sb = await getSupabase();
      if (!sb) {
        const id = await sha256(email);
        const acc: Account = { id, email: '', name, phone, role };
        writeJSON(`account.${id}`, acc);
        writeJSON(DEMO_KEY, acc);
        setUser(acc);
        return { ok: true };
      }
      const { data, error } = await sb.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name, phone, role }, emailRedirectTo: `${SITE_URL}/login` },
      });
      if (error) return { ok: false, error: mapError(error.message) };
      // Supabase returns a user with no identities when the e-mail is already registered.
      if (data.user && data.user.identities && data.user.identities.length === 0) return { ok: false, error: 'exists' };
      if (!data.session) return { ok: true, needsConfirmation: true };
      await loadProfile(data.user!.id, data.user!.email ?? '', data.user!.user_metadata ?? {});
      return { ok: true };
    },
    [loadProfile],
  );

  const signOut = useCallback(async () => {
    const sb = await getSupabase();
    if (sb) await sb.auth.signOut();
    else removeKey(DEMO_KEY);
    setUser(null);
  }, []);

  const resetPassword = useCallback<AuthState['resetPassword']>(async (email) => {
    const sb = await getSupabase();
    if (!sb) return { ok: true };
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${SITE_URL}/reset-password` });
    return error ? { ok: false, error: mapError(error.message) } : { ok: true };
  }, []);

  const updatePassword = useCallback<AuthState['updatePassword']>(async (password) => {
    const sb = await getSupabase();
    if (!sb) return { ok: false, error: 'generic' };
    const { error } = await sb.auth.updateUser({ password });
    return error ? { ok: false, error: mapError(error.message) } : { ok: true };
  }, []);

  const value = useMemo(
    () => ({ live: BACKEND_ENABLED, loading, user, signIn, signUp, signOut, resetPassword, updatePassword }),
    [loading, user, signIn, signUp, signOut, resetPassword, updatePassword],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
}
