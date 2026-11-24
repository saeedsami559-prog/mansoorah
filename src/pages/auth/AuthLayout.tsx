import { useEffect, useState, type ReactNode } from 'react';
import { BadgeCheck, ReceiptText, Zap } from 'lucide-react';
import { useI18n } from '../../i18n';
import { Logo } from '../../components/ui/Logo';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { ArchesMotif, HouseLineArt } from '../../components/layout/OmaniMotif';

const SLIDE_ICONS = [BadgeCheck, ReceiptText, Zap];

/** Two-panel auth layout: illustration panel with carousel dots + form panel. */
export function AuthLayout({
  title,
  text,
  crumb,
  children,
}: {
  title: string;
  text: string;
  crumb: string;
  children: ReactNode;
}) {
  const { t, tl } = useI18n();
  const slides = tl('auth.slides');
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, [slides.length]);
  const Icon = SLIDE_ICONS[i];
  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumbs items={[{ label: crumb }]} />
      <div className="card grid overflow-hidden lg:grid-cols-2">
        <div className="hero-band hidden flex-col justify-between p-10 lg:flex">
          <HouseLineArt className="pointer-events-none absolute end-0 bottom-16 w-[420px]" />
          <ArchesMotif className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full" />
          <Logo inverted to={null} />
          <div className="relative">
            <h2 className="text-[2.25rem] font-extrabold">{title}</h2>
            <p className="mt-3 max-w-sm text-lg text-white/85">{text}</p>
            <div
              className="mt-10 flex min-h-12 items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20"
              aria-live="polite"
            >
              <Icon className="size-6 text-[#D4A84B]" aria-hidden="true" />
              <span className="font-semibold">{slides[i]}</span>
            </div>
            <div className="mt-5 flex gap-2" role="group" aria-label={title}>
              {slides.map((s, n) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setI(n)}
                  aria-label={t('auth.slideLabel', { n: n + 1 })}
                  aria-current={n === i}
                  className={`h-2.5 cursor-pointer rounded-full transition-all ${n === i ? 'w-8 bg-[#D4A84B]' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </div>
          <p className="relative text-sm text-white/70">{t('brand.closing')}</p>
        </div>
        <div className="p-6 sm:p-10">{children}</div>
      </div>
    </div>
  );
}

export function GoogleButton() {
  const { t } = useI18n();
  const [note, setNote] = useState(false);
  return (
    <div>
      <button type="button" className="btn btn-secondary w-full" onClick={() => setNote(true)}>
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
          <path
            fill="#34A853"
            d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23z"
          />
          <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 10l3.7-2.9z" />
          <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z" />
        </svg>
        {t('auth.google')}
      </button>
      <div aria-live="polite">{note && <p className="mt-2 text-center text-xs text-muted">{t('auth.googleDemo')}</p>}</div>
    </div>
  );
}

export function Divider() {
  const { t } = useI18n();
  return (
    <div className="my-5 flex items-center gap-3 text-sm text-muted">
      <span className="h-px flex-1 bg-line" />
      {t('common.or')}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
