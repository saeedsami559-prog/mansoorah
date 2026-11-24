/**
 * Site-wide configuration. Values marked PLACEHOLDER have not been provided by the team yet;
 * they are listed under "Before launch" in README.md.
 */
export const DEMO_MODE = true;

/** WhatsApp number (digits only, country code first). */
export const WHATSAPP_NUMBER = '96894797747';
/** Support phone line. */
export const PHONE_NUMBER = '+96894797747';
/** Support mailbox. */
export const SUPPORT_EMAIL = 'saeedsami559@gmail.com';

/** PLACEHOLDER – reserved handles; links are only rendered once SOCIAL_LINKS_LIVE is true. */
export const SOCIAL = {
  instagram: 'mansoorah.om',
  x: 'mansoorah_om',
  tiktok: 'mansoorah.om',
  snapchat: 'mansoorah.om',
} as const;
export const SOCIAL_LINKS_LIVE = false;

export const GITHUB_OWNER = 'saeedsami559-prog';
export const REPO_NAME = 'mansoorah';
/** Public site origin + base path, used for canonical URLs, sitemap and Open Graph. */
export const SITE_URL = `https://${GITHUB_OWNER}.github.io/${REPO_NAME}`;
export const REPO_URL = `https://github.com/${GITHUB_OWNER}/${REPO_NAME}`;

export const WORKING_HOURS = { days: 'Sat–Thu', open: '08:00', close: '20:00' } as const;

/** Business rules surfaced in the UI. */
export const RULES = {
  freeCancellationHours: 3,
  commissionMin: 15,
  commissionMax: 20,
  proPlanPrice: 5,
  bookingWindowDays: 14,
  vatRate: 0, // Below Oman's VAT registration threshold – no VAT is charged.
} as const;

export const STORAGE_PREFIX = 'mansoorah.v1';

/**
 * Supabase project (accounts, bookings, admin). Both values are PUBLIC by design: the anon key only
 * allows what the row-level-security rules in supabase/schema.sql permit. Never put the service_role key here.
 * Leave empty to run the site in demo mode (everything stored in the visitor's browser).
 */
export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
/** True when real accounts are available. `VITE_BACKEND=off` forces demo mode (used by local tests). */
export const BACKEND_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) && import.meta.env.VITE_BACKEND !== 'off';
