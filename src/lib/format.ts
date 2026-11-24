import type { Lang } from '../i18n/types';

const numberFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 });

/** Prices always use Western digits (Section 8); the currency label is localized. */
export function formatNumber(n: number): string {
  return numberFmt.format(n);
}

export function formatOMR(amount: number, lang: Lang): string {
  const value = formatNumber(amount);
  return lang === 'ar' ? `${value} ر.ع.` : `${value} OMR`;
}

/** Display an Omani number as "+968 9123 4567". */
export function formatOmaniPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const local = digits.startsWith('968') ? digits.slice(3) : digits;
  if (local.length !== 8) return raw;
  return `+968 ${local.slice(0, 4)} ${local.slice(4)}`;
}

export function formatDate(iso: string, lang: Lang, opts: Intl.DateTimeFormatOptions = {}): string {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-OM-u-nu-latn' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  }).format(d);
}

/** "14:00" → "2:00 PM" / "2:00 م". */
export function formatSlot(slot: string, lang: Lang): string {
  const [h, m] = slot.split(':').map(Number);
  const d = new Date(2026, 0, 1, h, m);
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-OM-u-nu-latn' : 'en-US', { hour: 'numeric', minute: '2-digit' }).format(d);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return (first + last).toUpperCase();
}
