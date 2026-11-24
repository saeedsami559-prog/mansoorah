import { readJSON, removeKey, writeJSON } from './storage';

/**
 * Demo authentication. Passwords are never stored: we keep only the display name, role and a
 * SHA-256 hash of the e-mail as an opaque "signed in" flag.
 */
export interface DemoUser {
  name: string;
  role: 'customer' | 'technician';
  emailHash: string;
}

const KEY = 'auth';

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text.trim().toLowerCase());
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getUser(): DemoUser | null {
  return readJSON<DemoUser | null>(KEY, null);
}

export function saveUser(user: DemoUser): void {
  writeJSON(KEY, user);
  window.dispatchEvent(new Event('mansoorah-auth'));
}

export function signOut(): void {
  removeKey(KEY);
  window.dispatchEvent(new Event('mansoorah-auth'));
}
