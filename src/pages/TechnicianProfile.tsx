import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Award, Briefcase, CalendarPlus, CheckCircle2, Languages, MapPin } from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Avatar } from '../components/technician/Avatar';
import { AvailabilityLabel, RatingBars, SkillChips } from '../components/technician/TechCard';
import { VerifiedBadge } from '../components/technician/VerifiedBadge';
import { Badge, RatingStars } from '../components/ui/primitives';
import { getTechnician, ratingBreakdown } from '../data/technicians';
import { getRegion } from '../data/regions';
import { getService } from '../data/services';
import { reviewsFor } from '../data/reviews';
import NotFound from './NotFound';

export default function TechnicianProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, tl, loc, lang } = useI18n();
  const tech = getTechnician(id);
  const [svc, setSvc] = useState<string>(tech?.skills[0] ?? '');
  if (!tech) return <NotFound />;
  const name = loc(tech.name);
  const region = getRegion(tech.region)!;
  const reviews = reviewsFor(tech);

  return (
    <>
      <Seo
        title={t('meta.technician.title', { name })}
        description={t('meta.technician.description', { name, region: loc(region.name), rating: tech.rating })}
      />
      <div className="container-x pt-8">
        <Breadcrumbs items={[{ label: t('nav.technicians'), to: '/technicians' }, { label: name }]} />
      </div>
      <div className="container-x grid gap-8 pb-14 lg:grid-cols-[1fr_1.6fr]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="card overflow-hidden">
            <div className="hero-band h-24" aria-hidden="true" />
            <div className="relative -mt-12 px-6 pb-6">
              <Avatar
                name={name}
                tone={tech.tone}
                gender={tech.gender}
                size={96}
                className="ring-4 ring-surface"
                decorative={false}
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold">{name}</h1>
                {tech.pro && <Badge tone="gold">{t('common.pro')}</Badge>}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <VerifiedBadge />
                <span className="flex items-center gap-1.5 text-sm">
                  <RatingStars value={tech.rating} size={15} label={t('common.outOf5', { n: tech.rating })} />
                  <span className="font-bold">{tech.rating.toFixed(1)}</span>
                  <span className="text-muted">({t('common.reviewsCount', { n: tech.reviews })})</span>
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-muted">{t('techs.fictional')}</p>
              <div className="mt-3">
                <AvailabilityLabel techId={tech.id} />
              </div>
              <form
                className="mt-5 space-y-2 border-t border-line pt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate(`/book/${svc}?tech=${tech.id}`);
                }}
              >
                <label htmlFor="pf-svc" className="field-label">
                  {t('techs.chooseService', { name })}
                </label>
                <select id="pf-svc" className="input" value={svc} onChange={(e) => setSvc(e.target.value)}>
                  {tech.skills.map((s) => (
                    <option key={s} value={s}>
                      {loc(getService(s)!.title)}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary btn-lg w-full">
                  <CalendarPlus className="size-5" aria-hidden="true" />
                  {t('techs.bookWith', { name: name.split(' ')[0] })}
                </button>
              </form>
            </div>
          </section>

          <section className="card p-6" aria-labelledby="ver-h">
            <h2 id="ver-h" className="mb-4 text-lg font-bold">
              {t('techs.verification')}
            </h2>
            <ul className="m-0 list-none space-y-3 p-0">
              {tl('techs.checks').map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-success" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <div className="space-y-6">
          <section className="card p-6" aria-labelledby="about-h">
            <h2 id="about-h" className="text-lg font-bold">
              {t('techs.about')}
            </h2>
            <p className="mt-2 text-ink/90">{loc(tech.bio)}</p>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: MapPin,
                  k: t('techs.regions'),
                  v: `${loc(region.name)} – ${tech.wilayats.map((w) => loc(w)).join(lang === 'ar' ? '، ' : ', ')}`,
                },
                { icon: Award, k: t('techs.experience'), v: t('common.years', { n: tech.years }) },
                { icon: Briefcase, k: t('techs.jobsDone'), v: String(tech.jobs) },
                { icon: Languages, k: t('techs.languages'), v: loc(tech.languages) },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="flex gap-3 rounded-2xl bg-surface-2 p-4">
                  <Icon
                    className="mt-0.5 size-5 shrink-0 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-sm text-muted">{k}</dt>
                    <dd className="m-0 font-semibold">{v}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <h3 className="mt-6 mb-3 font-bold">{t('techs.skills')}</h3>
            <SkillChips skills={tech.skills} max={10} />
          </section>

          <section className="card p-6" aria-labelledby="br-h">
            <h2 id="br-h" className="mb-4 text-lg font-bold">
              {t('techs.breakdown')}
            </h2>
            <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
              <div className="text-center">
                <p className="font-heading text-5xl font-extrabold text-heading">{tech.rating.toFixed(1)}</p>
                <RatingStars value={tech.rating} label={t('common.outOf5', { n: tech.rating })} />
                <p className="mt-1 text-sm text-muted">{t('common.reviewsCount', { n: tech.reviews })}</p>
              </div>
              <RatingBars values={ratingBreakdown(tech)} />
            </div>
          </section>

          <section aria-labelledby="rv-h">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 id="rv-h" className="text-lg font-bold">
                {t('techs.reviews')}
              </h2>
              <span
                className="rounded-full border border-line bg-surface px-3 py-1 text-sm font-semibold text-muted"
                data-demo-label
              >
                {t('common.sampleReviews')}
              </span>
            </div>
            <ul className="m-0 grid list-none gap-4 p-0">
              {reviews.map((r, i) => (
                <li key={i} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{loc(r.name)}</span>
                    <span className="text-sm text-muted">
                      {r.weeksAgo === 1 ? t('techs.weekAgo') : t('techs.weeksAgo', { n: r.weeksAgo })}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                    <RatingStars value={r.rating} size={14} label={t('common.outOf5', { n: r.rating })} />
                    {loc(getService(r.service)!.title)} · {loc(r.area)}
                  </div>
                  <p className="mt-3">{loc(r.text)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
