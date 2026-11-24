import type { TKey } from '../../i18n';
import type { AuthError } from '../../components/auth/AuthContext';

export const AUTH_ERROR_KEY: Record<AuthError, TKey> = {
  invalid: 'auth.errInvalid',
  exists: 'auth.errExists',
  notConfirmed: 'auth.errNotConfirmed',
  weak: 'auth.errWeak',
  generic: 'auth.errGeneric',
};

/** Only allow same-site paths as a post-login destination. */
export function safeNext(raw: string | null, fallback: string): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : fallback;
}
