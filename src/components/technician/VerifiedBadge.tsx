import { useId, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { useI18n } from '../../i18n';

/** Verified badge with an accessible tooltip (hover, focus or tap). */
export function VerifiedBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <span className="relative z-10 inline-flex">
      <button
        type="button"
        className="inline-flex cursor-help items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 text-xs font-semibold text-success-ink"
        aria-describedby={id}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShow((s) => !s);
        }}
      >
        <BadgeCheck className="size-3.5" aria-hidden="true" />
        {!compact && t('common.verified')}
        {compact && <span className="sr-only">{t('common.verified')}</span>}
      </button>
      <span
        id={id}
        role="tooltip"
        className={`absolute bottom-full -start-2 z-30 mb-2 w-56 max-w-[calc(100vw-2.5rem)] rounded-xl bg-[#0E1A33] px-3 py-2 text-xs leading-relaxed font-medium text-white shadow-lg ${
          show ? 'block' : 'hidden'
        }`}
      >
        {t('common.verifiedTooltip')}
      </span>
    </span>
  );
}
