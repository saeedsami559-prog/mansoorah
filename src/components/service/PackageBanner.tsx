import { CheckCircle2, Sparkles } from 'lucide-react';
import { STARTER_PACKAGE } from '../../data/services';
import { useI18n } from '../../i18n';
import { ButtonLink } from '../ui/primitives';
import { ServiceArt } from './ServiceArt';

export function PackageBanner({ compact = false }: { compact?: boolean }) {
  const { t, tl, loc, omr } = useI18n();
  const saving = STARTER_PACKAGE.separatePrice - STARTER_PACKAGE.price;
  return (
    <section
      aria-labelledby="pkg-title"
      className="relative overflow-hidden rounded-[22px] border border-[#D4A84B]/40 bg-gradient-to-br from-[#0B2C6E] to-[#1C5AA6] text-white shadow-[var(--shadow-lg)]"
      data-package
    >
      <div
        className={`grid items-center gap-6 ${compact ? 'p-6 md:grid-cols-[1.4fr_1fr]' : 'p-6 md:grid-cols-[1.3fr_1fr] md:p-10'}`}
      >
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-[#F2D493]">
            <Sparkles className="size-4" aria-hidden="true" />
            {t('home.package.eyebrow')}
          </p>
          <h2 id="pkg-title" className="mt-4 text-[1.75rem] font-extrabold text-white md:text-[2.25rem]">
            {loc(STARTER_PACKAGE.title)}
          </h2>
          <p className="mt-2 text-white/85">{loc(STARTER_PACKAGE.description)}</p>
          <ul className="mt-5 grid list-none gap-2 p-0 sm:grid-cols-2">
            {tl('home.package.items').map((item) => (
              <li key={item} className="flex items-start gap-2 text-[0.95rem]">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#D4A84B]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <div>
              <p className="font-heading text-[2.25rem] leading-none font-extrabold" data-price={STARTER_PACKAGE.price}>
                {omr(STARTER_PACKAGE.price)}
              </p>
              <p className="mt-1 text-sm text-white/75">
                <s>{omr(STARTER_PACKAGE.separatePrice)}</s>{' '}
                {t('home.package.instead', { price: omr(STARTER_PACKAGE.separatePrice) })}
              </p>
            </div>
            <span className="rounded-full bg-[#D4A84B] px-3 py-1 text-sm font-bold text-[#0B2C6E]">
              {t('home.package.save', { amount: omr(saving) })}
            </span>
          </div>
          <ButtonLink to="/book/new-home-smart-starter" variant="white" size="lg" className="mt-6">
            {t('home.package.cta')}
          </ButtonLink>
        </div>
        <div className="hidden overflow-hidden rounded-2xl ring-1 ring-white/20 md:block">
          <ServiceArt slug="package" className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
