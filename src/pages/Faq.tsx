import { useMemo, useState } from 'react';
import { MessageCircle, Search, SearchX } from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { Accordion } from '../components/ui/Accordion';
import { Toc } from '../components/ui/Toc';
import { EmptyState, ExternalButton } from '../components/ui/primitives';
import { FAQ_GROUPS, ALL_FAQS } from '../data/faqs';
import { whatsappLink } from '../lib/whatsapp';

export default function Faq() {
  const { t, loc } = useI18n();
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return FAQ_GROUPS;
    return FAQ_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((f) => `${loc(f.q)} ${loc(f.a)}`.toLowerCase().includes(needle)),
    })).filter((g) => g.items.length);
  }, [q, loc]);
  return (
    <>
      <Seo
        title={t('meta.faq.title')}
        description={t('meta.faq.description')}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: ALL_FAQS.map((f) => ({
            '@type': 'Question',
            name: loc(f.q),
            acceptedAnswer: { '@type': 'Answer', text: loc(f.a) },
          })),
        }}
      />
      <PageHero title={t('faq.title')} sub={t('faq.sub')} crumbs={[{ label: t('faq.title') }]}>
        <div className="relative mt-8 max-w-xl">
          <label htmlFor="faq-search" className="sr-only">
            {t('faq.searchLabel')}
          </label>
          <Search
            className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="faq-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('faq.searchPh')}
            className="input !min-h-14 !rounded-2xl !border-transparent !ps-12 shadow-lg"
          />
        </div>
      </PageHero>
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
        <div>
          <Toc items={FAQ_GROUPS.map((g) => ({ id: `faq-${g.id}`, label: loc(g.title) }))} />
        </div>
        <div className="space-y-10" aria-live="polite">
          {groups.length === 0 && <EmptyState icon={<SearchX className="size-7" />} title={t('faq.empty')} />}
          {groups.map((g) => (
            <section key={g.id} id={`faq-${g.id}`} className="scroll-mt-28" aria-labelledby={`faq-${g.id}-h`}>
              <h2 id={`faq-${g.id}-h`} className="mb-4 text-xl font-extrabold">
                {loc(g.title)}
              </h2>
              <Accordion items={g.items.map((f) => ({ q: loc(f.q), a: <p>{loc(f.a)}</p> }))} />
            </section>
          ))}
          <div className="card flex flex-col items-start gap-4 p-6 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="text-lg font-bold">{t('faq.still')}</h2>
              <p className="text-muted">{t('faq.stillText')}</p>
            </div>
            <ExternalButton href={whatsappLink(t('faq.waMessage'))}>
              <MessageCircle className="size-5" aria-hidden="true" />
              {t('common.chatWhatsapp')}
            </ExternalButton>
          </div>
        </div>
      </div>
    </>
  );
}
