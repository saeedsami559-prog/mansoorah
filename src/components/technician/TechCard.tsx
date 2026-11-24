import { Link } from 'react-router-dom';
import { CalendarCheck, MapPin, Star } from 'lucide-react';
import type { Technician } from '../../data/technicians';
import { availability } from '../../data/technicians';
import { getRegion } from '../../data/regions';
import { getService } from '../../data/services';
import { useI18n } from '../../i18n';
import { Avatar } from './Avatar';
import { VerifiedBadge } from './VerifiedBadge';
import { Badge } from '../ui/primitives';

export function AvailabilityLabel({ techId }: { techId: string }) {
  const { t } = useI18n();
  const a = availability(techId);
  const label =
    a === 'today' ? t('common.availableToday') : a === 'tomorrow' ? t('common.availableTomorrow') : t('common.availableLater');
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${a === 'today' ? 'text-success-ink' : 'text-muted'}`}>
      <CalendarCheck className="size-4" aria-hidden="true" />
      {label}
    </span>
  );
}

export function RatingInline({ rating, reviews }: { rating: number; reviews: number }) {
  const { t } = useI18n();
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Star className="size-4 text-gold" fill="currentColor" strokeWidth={0} aria-hidden="true" />
      <span className="font-bold text-ink">{rating.toFixed(1)}</span>
      <span className="text-muted">({t('common.reviewsCount', { n: reviews })})</span>
    </span>
  );
}

export function SkillChips({ skills, max = 3 }: { skills: string[]; max?: number }) {
  const { loc } = useI18n();
  return (
    <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {skills.slice(0, max).map((s) => {
        const svc = getService(s);
        return svc ? (
          <li key={s} className="chip !text-xs !font-medium">
            {loc(svc.title).replace(/\s*\(.*\)$/, '')}
          </li>
        ) : null;
      })}
    </ul>
  );
}

/** Directory card linking to the profile. */
export function TechCard({ tech }: { tech: Technician }) {
  const { t, loc, lang } = useI18n();
  const region = getRegion(tech.region);
  return (
    <article className="card card-hover relative flex h-full flex-col p-5" data-tech={tech.id}>
      <div className="flex items-start gap-4">
        <Avatar name={loc(tech.name)} tone={tech.tone} gender={tech.gender} size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[1.05rem] font-bold">
              <Link
                to={`/technicians/${tech.id}`}
                className="text-heading no-underline after:absolute after:inset-0 after:content-['']"
              >
                {loc(tech.name)}
              </Link>
            </h3>
            {tech.pro && <Badge tone="gold">{t('common.pro')}</Badge>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <VerifiedBadge />
            <RatingInline rating={tech.rating} reviews={tech.reviews} />
          </div>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
        <MapPin className="size-4 shrink-0" aria-hidden="true" />
        {region && loc(region.name)} · {tech.wilayats.map((w) => loc(w)).join(lang === 'ar' ? '، ' : ', ')}
      </p>
      <div className="mt-3">
        <SkillChips skills={tech.skills} />
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-sm">
        <AvailabilityLabel techId={tech.id} />
        <span className="text-muted">{t('common.years', { n: tech.years })}</span>
      </div>
    </article>
  );
}

export function RatingBars({ values }: { values: number[] }) {
  const { t } = useI18n();
  return (
    <ul className="m-0 list-none space-y-2 p-0">
      {values.map((v, i) => {
        const stars = 5 - i;
        return (
          <li key={stars} className="flex items-center gap-3 text-sm">
            <span className="w-14 shrink-0 text-muted">{t('rate.star', { n: stars })}</span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2" role="presentation">
              <span className="block h-full rounded-full bg-gold" style={{ width: `${v}%` }} />
            </span>
            <span className="w-10 shrink-0 text-end font-semibold">{v}%</span>
          </li>
        );
      })}
    </ul>
  );
}
