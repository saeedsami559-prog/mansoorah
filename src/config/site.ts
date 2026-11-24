/**
 * Site-wide configuration. Contact values marked PLACEHOLDER have not been provided by the team yet;
 * they are listed under "Before launch" in README.md. The placeholder phone uses an impossible Omani
 * number (+968 0000 0000) and a reserved `.example` e-mail domain, so no message can reach a stranger.
 */
export const DEMO_MODE = true;

/** PLACEHOLDER – replace with the real WhatsApp Business number (digits only, country code first). */
export const WHATSAPP_NUMBER = '96800000000';
/** PLACEHOLDER – replace with the real support line. */
export const PHONE_NUMBER = '+96800000000';
/** PLACEHOLDER – replace with the real support mailbox. */
export const SUPPORT_EMAIL = 'hello@mansoorah.example';

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
