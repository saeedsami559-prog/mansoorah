import { useState } from 'react';
import { FlaskConical, X } from 'lucide-react';
import { useI18n } from '../../i18n';

const KEY = 'mansoorah.v1.bannerDismissed';

export function DemoBanner() {
  const { t } = useI18n();
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  });
  if (hidden) return null;
  return (
    <div className="bg-[#0B2C6E] text-white" role="note" data-demo-banner>
      <div className="container-x flex min-h-10 items-center justify-center gap-3 py-1.5 text-center text-[0.85rem] font-medium">
        <FlaskConical className="size-4 shrink-0 text-[#D4A84B]" aria-hidden="true" />
        <p>{t('banner.text')}</p>
        <button
          type="button"
          onClick={() => {
            setHidden(true);
            try {
              sessionStorage.setItem(KEY, '1');
            } catch {
              /* ignore */
            }
          }}
          className="ms-1 grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
          aria-label={t('banner.dismiss')}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
