import { Info } from 'lucide-react';
import { useI18n, type TKey } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { Toc } from '../components/ui/Toc';
import { ButtonLink } from '../components/ui/primitives';
import { LEGAL, LEGAL_UPDATED, type LegalDoc } from '../data/legal';
import { formatDate } from '../lib/format';

const META: Record<LegalDoc, { title: TKey; metaTitle: TKey; metaDesc: TKey }> = {
  privacy: { title: 'legal.privacyTitle', metaTitle: 'meta.privacy.title', metaDesc: 'meta.privacy.description' },
  terms: { title: 'legal.termsTitle', metaTitle: 'meta.terms.title', metaDesc: 'meta.terms.description' },
  cancellation: {
    title: 'legal.cancellationTitle',
    metaTitle: 'meta.cancellation.title',
    metaDesc: 'meta.cancellation.description',
  },
};

const OTHERS: { to: string; doc: LegalDoc }[] = [
  { to: '/privacy', doc: 'privacy' },
  { to: '/terms', doc: 'terms' },
  { to: '/cancellation-refund', doc: 'cancellation' },
];

export default function Legal({ doc }: { doc: LegalDoc }) {
  const { t, loc, lang } = useI18n();
  const sections = LEGAL[doc];
  const m = META[doc];
  return (
    <>
      <Seo title={t(m.metaTitle)} description={t(m.metaDesc)} />
      <PageHero
        title={t(m.title)}
        sub={t('common.lastUpdated', { date: formatDate(LEGAL_UPDATED, lang, { weekday: undefined }) })}
        crumbs={[{ label: t(m.title) }]}
        compact
      />
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
        <div>
          <Toc items={sections.map((s) => ({ id: s.id, label: loc(s.title) }))} />
        </div>
        <article className="prose-legal max-w-3xl">
          <p className="flex items-start gap-2 rounded-2xl border border-warning/30 bg-warning-bg p-4 font-medium text-warning">
            <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            {t('legal.intro')}
          </p>
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>{loc(s.title)}</h2>
              {s.paragraphs?.map((p) => <p key={p.en}>{loc(p)}</p>)}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b.en}>{loc(b)}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <nav aria-label={t('common.related')} className="mt-12 border-t border-line pt-6">
            <p className="mb-3 font-bold">{t('common.related')}</p>
            <div className="flex flex-wrap gap-2">
              {OTHERS.filter((o) => o.doc !== doc).map((o) => (
                <ButtonLink key={o.to} to={o.to} variant="secondary" size="sm">
                  {t(META[o.doc].title)}
                </ButtonLink>
              ))}
              <ButtonLink to="/faq" variant="secondary" size="sm">
                {t('faq.title')}
              </ButtonLink>
            </div>
          </nav>
        </article>
      </div>
    </>
  );
}
