import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Search } from 'lucide-react';
import { useI18n, type TKey } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { ArchesMotif } from '../components/layout/OmaniMotif';
import { ButtonLink } from '../components/ui/primitives';
import { getService } from '../data/services';

const POPULAR: { to: string; key: TKey }[] = [
  { to: '/services', key: 'nav.services' },
  { to: '/services/smart-door-lock', key: 'nav.services' },
  { to: '/technicians', key: 'nav.technicians' },
  { to: '/how-it-works', key: 'nav.howItWorks' },
  { to: '/faq', key: 'faq.title' },
  { to: '/contact', key: 'contact.title' },
];

export default function NotFound() {
  const { t, loc } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  return (
    <>
      <Seo title={t('meta.notFound.title')} description={t('meta.notFound.description')} noindex />
      <section className="relative overflow-hidden">
        <ArchesMotif
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full"
          color="var(--brand-500)"
          opacity={0.15}
        />
        <div className="container-x relative flex flex-col items-center py-20 text-center">
          <span className="grid size-20 place-items-center rounded-3xl bg-brand-100 text-brand-700">
            <Compass className="size-10" aria-hidden="true" />
          </span>
          <p className="mt-6 font-heading text-6xl font-extrabold text-brand-700 [:root[data-theme=dark]_&]:text-brand-900">
            404
          </p>
          <h1 className="mt-2 text-[2rem] font-extrabold">{t('notFound.title')}</h1>
          <p className="mt-3 max-w-xl text-muted">{t('notFound.sub')}</p>
          <form
            role="search"
            className="relative mt-8 w-full max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/services${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
            }}
          >
            <label htmlFor="nf-search" className="sr-only">
              {t('notFound.search')}
            </label>
            <Search
              className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="nf-search"
              type="search"
              className="input !min-h-14 !rounded-2xl !ps-12 !pe-28"
              placeholder={t('services.searchPlaceholder')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm absolute end-2 top-1/2 -translate-y-1/2">
              {t('notFound.search')}
            </button>
          </form>
          <h2 className="mt-10 text-lg font-bold">{t('notFound.popular')}</h2>
          <ul className="mt-3 flex list-none flex-wrap justify-center gap-2 p-0">
            {POPULAR.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="chip no-underline hover:bg-brand-700 hover:text-white">
                  {p.to === '/services/smart-door-lock' ? loc(getService('smart-door-lock')!.title) : t(p.key)}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink to="/" className="mt-8">
            {t('notFound.home')}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
