import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, Search, SearchX, X } from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { Tabs } from '../components/ui/Tabs';
import { ServiceCard } from '../components/service/ServiceCard';
import { PackageBanner } from '../components/service/PackageBanner';
import { EmptyState, ExternalButton } from '../components/ui/primitives';
import { SERVICES, type ServiceCategory } from '../data/services';
import { whatsappLink } from '../lib/whatsapp';
import { track } from '../lib/track';
import { SITE_URL } from '../config/site';

type Cat = 'all' | ServiceCategory;
type Sort = 'popular' | 'price-asc' | 'price-desc';

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ً-ٰٟ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه');
}

export default function Services() {
  const { t, loc, lang } = useI18n();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const cat = (params.get('category') as Cat) || 'all';
  const sort = (params.get('sort') as Sort) || 'popular';

  const setParam = (key: string, value: string, def: string) => {
    const next = new URLSearchParams(params);
    if (value === def) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const needle = normalize(q.trim());
    const filtered = SERVICES.filter(
      (s) =>
        (cat === 'all' || s.category === cat) &&
        (!needle ||
          normalize(`${s.title.en} ${s.title.ar} ${s.short.en} ${s.short.ar} ${s.keywords.en} ${s.keywords.ar}`).includes(
            needle,
          )),
    );
    return [...filtered].sort((a, b) =>
      sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : b.popularity - a.popularity,
    );
  }, [q, cat, sort]);

  const tabs = [
    { id: 'all' as Cat, label: t('services.all'), count: SERVICES.length },
    { id: 'smart' as Cat, label: t('categories.smart'), count: SERVICES.filter((s) => s.category === 'smart').length },
    {
      id: 'maintenance' as Cat,
      label: t('categories.maintenance'),
      count: SERVICES.filter((s) => s.category === 'maintenance').length,
    },
  ];

  return (
    <>
      <Seo
        title={t('meta.services.title')}
        description={t('meta.services.description')}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: SERVICES.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: loc(s.title),
            url: `${SITE_URL}/services/${s.slug}${lang === 'ar' ? '?lang=ar' : ''}`,
          })),
        }}
      />
      <PageHero title={t('services.title')} sub={t('services.sub')} crumbs={[{ label: t('nav.services') }]}>
        <div className="relative mt-8 max-w-xl">
          <label htmlFor="svc-search" className="sr-only">
            {t('services.searchLabel')}
          </label>
          <Search
            className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="svc-search"
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setParam('q', e.target.value, '');
            }}
            placeholder={t('services.searchPlaceholder')}
            className="input !min-h-14 !rounded-2xl !border-transparent !ps-12 !text-base shadow-lg"
            autoComplete="off"
          />
        </div>
      </PageHero>

      <section className="container-x py-10" aria-labelledby="svc-list-title">
        <h2 id="svc-list-title" className="sr-only">
          {t('services.title')}
        </h2>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Tabs
            tabs={tabs}
            value={cat}
            onChange={(v) => setParam('category', v, 'all')}
            label={t('services.tabsLabel')}
            idBase="svc"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="svc-sort" className="text-sm font-semibold text-muted">
              {t('services.sortLabel')}
            </label>
            <select
              id="svc-sort"
              className="input !min-h-10 !w-auto !py-1.5 text-sm"
              value={sort}
              onChange={(e) => setParam('sort', e.target.value, 'popular')}
            >
              <option value="popular">{t('services.sortPopular')}</option>
              <option value="price-asc">{t('services.sortPriceLow')}</option>
              <option value="price-desc">{t('services.sortPriceHigh')}</option>
            </select>
          </div>
        </div>
        <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${cat}`}>
          <p className="mb-4 text-sm text-muted" aria-live="polite">
            {t('services.results', { n: list.length })}
          </p>
          {list.length === 0 ? (
            <EmptyState
              icon={<SearchX className="size-7" />}
              title={t('services.empty', { q })}
              text={t('services.emptyHint')}
              action={
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setQ('');
                    setParam('q', '', '');
                  }}
                >
                  <X className="size-4" aria-hidden="true" />
                  {t('services.clear')}
                </button>
              }
            />
          ) : (
            <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <li key={s.slug}>
                  <ServiceCard service={s} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="container-x">
        <PackageBanner compact />
      </div>

      <section className="container-x py-12">
        <div className="card flex flex-col items-start gap-5 bg-gradient-to-br from-success-bg to-surface p-6 md:flex-row md:items-center md:p-8">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#1a7f4b] text-white">
            <MessageCircle className="size-7" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{t('services.stripTitle')}</h2>
            <p className="mt-1 text-muted">{t('services.stripText')}</p>
          </div>
          <ExternalButton
            href={whatsappLink(t('services.waMessage'))}
            onClick={() => track('whatsapp_click', { from: 'services_strip' })}
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            {t('services.stripCta')}
          </ExternalButton>
        </div>
      </section>
    </>
  );
}
