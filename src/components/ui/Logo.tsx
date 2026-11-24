import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';

export function Mark({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 320 320" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <rect width="320" height="320" rx="72" fill="#1C5AA6" />
      <path
        d="M60 170 L160 82 L260 170"
        fill="none"
        stroke="#D4A84B"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M88 160 V258 H232 V160" fill="none" stroke="#FFFFFF" strokeWidth="18" strokeLinejoin="round" />
      <path d="M118 196 A60 60 0 0 1 202 196" fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
      <path d="M136 214 A34 34 0 0 1 184 214" fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
      <circle cx="160" cy="236" r="11" fill="#D4A84B" />
    </svg>
  );
}

/** Brand logo. The wordmark is live text so the right font renders in both languages. */
export function Logo({
  variant = 'full',
  inverted = false,
  to = '/',
}: {
  variant?: 'full' | 'mark';
  inverted?: boolean;
  to?: string | null;
}) {
  const { t } = useI18n();
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <Mark size={variant === 'mark' ? 36 : 40} />
      {variant === 'full' && (
        <span className="flex flex-col leading-none">
          <span
            lang="en"
            dir="ltr"
            className={`font-heading text-[1.2rem] font-extrabold tracking-tight ${inverted ? 'text-white' : 'text-[#0B2C6E] [:root[data-theme=dark]_&]:text-white'}`}
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Mansoorah
          </span>
          <span
            lang="ar"
            dir="rtl"
            className="mt-1 text-[0.85rem] font-semibold text-[#D4A84B]"
            style={{ fontFamily: "'IBM Plex Sans Arabic', system-ui, sans-serif" }}
          >
            منصورة
          </span>
        </span>
      )}
    </span>
  );
  if (to === null) return content;
  return (
    <Link to={to} className="no-underline" aria-label={`${t('brand.name')} – ${t('nav.home')}`}>
      {content}
    </Link>
  );
}
