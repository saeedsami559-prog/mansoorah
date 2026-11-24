import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, UsersRound } from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { TechCard } from '../components/technician/TechCard';
import { EmptyState } from '../components/ui/primitives';
import { SERVICES } from '../data/services';
import { REGIONS } from '../data/regions';
import { TECHNICIANS, availability, rankTechnicians } from '../data/technicians';

export default function Technicians() {
  const { t, loc } = useI18n();
  const [params, setParams] = useSearchParams();
  const service = params.get('service') ?? 'all';
  const region = params.get('region') ?? 'all';
  const rating = params.get('rating') ?? '0';
  const today = params.get('today') === '1';

  const set = (key: string, value: string, def: string) => {
    const next = new URLSearchParams(params);
    if (value === def) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const list = useMemo(
    () =>
      rankTechnicians(
        TECHNICIANS.filter(
          (x) =>
            (service === 'all' || x.skills.includes(service)) &&
            (region === 'all' || x.region === region) &&
            x.rating >= Number(rating) &&
            (!today || availability(x.id) === 'today'),
        ),
      ),
    [service, region, rating, today],
  );

  return (
    <>
      <Seo title={t('meta.technicians.title')} description={t('meta.technicians.description')} />
      <PageHero title={t('techs.title')} sub={t('techs.sub')} crumbs={[{ label: t('nav.technicians') }]} />
      <section className="container-x py-10">
        <fieldset className="card mb-6 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_auto] lg:items-end">
          <legend className="sr-only">{t('book.filters')}</legend>
          <SlidersHorizontal className="hidden size-5 self-center text-muted lg:block" aria-hidden="true" />
          <div>
            <label htmlFor="tf-service" className="field-label">
              {t('techs.filterService')}
            </label>
            <select id="tf-service" className="input" value={service} onChange={(e) => set('service', e.target.value, 'all')}>
              <option value="all">{t('common.serviceAll')}</option>
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {loc(s.title)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tf-region" className="field-label">
              {t('techs.filterRegion')}
            </label>
            <select id="tf-region" className="input" value={region} onChange={(e) => set('region', e.target.value, 'all')}>
              <option value="all">{t('common.regionAll')}</option>
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {loc(r.name)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tf-rating" className="field-label">
              {t('techs.filterRating')}
            </label>
            <select id="tf-rating" className="input" value={rating} onChange={(e) => set('rating', e.target.value, '0')}>
              <option value="0">{t('techs.any')}</option>
              <option value="4.5">4.5+</option>
              <option value="4.8">4.8+</option>
            </select>
          </div>
          <label className="flex min-h-[46px] cursor-pointer items-center gap-2 font-semibold">
            <input
              type="checkbox"
              className="check"
              checked={today}
              onChange={(e) => set('today', e.target.checked ? '1' : '0', '0')}
            />
            {t('book.today')}
          </label>
        </fieldset>
        <p className="mb-4 text-sm text-muted" aria-live="polite">
          {t('techs.count', { n: list.length })} · {t('techs.fictional')}
        </p>
        {list.length === 0 ? (
          <EmptyState
            icon={<UsersRound className="size-7" />}
            title={t('techs.empty')}
            action={
              <button type="button" className="btn btn-secondary" onClick={() => setParams({}, { replace: true })}>
                {t('book.resetFilters')}
              </button>
            }
          />
        ) : (
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((x) => (
              <li key={x.id}>
                <TechCard tech={x} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
