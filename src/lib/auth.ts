/** SHA-256 hex digest, used in demo mode so no raw e-mail or password is stored. */
export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text.trim().toLowerCase());
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
