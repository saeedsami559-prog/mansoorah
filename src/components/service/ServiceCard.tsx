import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import type { Service } from '../../data/services';
import { durationLabel } from '../../data/services';
import { useI18n } from '../../i18n';
import { ServiceArt } from './ServiceArt';
import { ServiceIcon } from './ServiceIcon';

export function ServiceCard({
  service,
  showImage = true,
  headingLevel = 3,
}: {
  service: Service;
  showImage?: boolean;
  headingLevel?: 2 | 3;
}) {
  const { t, loc, omr, lang } = useI18n();
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden" data-service={service.slug}>
      {showImage && (
        <div className="relative aspect-[400/220] overflow-hidden">
          <ServiceArt
            slug={service.slug}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute start-3 top-3 grid size-10 place-items-center rounded-xl bg-surface text-brand-700 shadow-sm [:root[data-theme=dark]_&]:text-brand-900">
            <ServiceIcon slug={service.slug} />
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {!showImage && (
          <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-brand-100 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900">
            <ServiceIcon slug={service.slug} className="size-6" />
          </span>
        )}
        <p className="mb-1 text-xs font-semibold tracking-wide text-muted uppercase [:root[dir=rtl]_&]:tracking-normal">
          {t(`categories.${service.category}`)}
        </p>
        <H className="text-[1.1rem] font-bold">
          <Link
            to={`/services/${service.slug}`}
            className="text-heading no-underline after:absolute after:inset-0 after:content-['']"
          >
            {loc(service.title)}
          </Link>
        </H>
        <p className="mt-2 line-clamp-2 text-[0.95rem] text-muted">{loc(service.short)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-muted">{t('common.from')}</p>
            <p
              className="font-heading text-xl font-extrabold text-brand-700 [:root[data-theme=dark]_&]:text-brand-900"
              data-price={service.price}
            >
              {omr(service.price)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Clock className="size-3.5" aria-hidden="true" />
              {durationLabel(service, lang)}
            </span>
            <span
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 [:root[data-theme=dark]_&]:text-brand-900"
              aria-hidden="true"
            >
              {t('common.viewDetails')}
              <ArrowRight className="flip-rtl size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
