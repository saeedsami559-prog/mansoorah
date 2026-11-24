import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CalendarPlus, Clock, Info, Lightbulb, MessageCircle, ShieldCheck, Tag, XCircle } from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ServiceArt } from '../components/service/ServiceArt';
import { INCLUDED_ICONS, ServiceIcon } from '../components/service/ServiceIcon';
import { ServiceCard } from '../components/service/ServiceCard';
import { Accordion } from '../components/ui/Accordion';
import { ButtonLink, ExternalButton, SectionHeading } from '../components/ui/primitives';
import { TechCard } from '../components/technician/TechCard';
import { SERVICES, durationLabel, getService } from '../data/services';
import { rankTechnicians, techniciansFor } from '../data/technicians';
import { whatsappLink } from '../lib/whatsapp';
import { track } from '../lib/track';
import { SITE_URL } from '../config/site';
import NotFound from './NotFound';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { t, loc, omr, lang } = useI18n();
  const service = getService(slug);
  if (!service) return <NotFound />;
  const techs = rankTechnicians(techniciansFor(service.slug));
  const related = SERVICES.filter((s) => s.slug !== service.slug && s.category === service.category).slice(0, 3);
  const title = loc(service.title);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: title,
      serviceType: t(`categories.${service.category}`),
      description: loc(service.description),
      areaServed: ['Muscat', 'Al Batinah North', 'Al Batinah South', 'Dhofar'].map((n) => ({
        '@type': 'AdministrativeArea',
        name: n,
      })),
      provider: { '@type': 'Organization', name: 'Mansoorah', url: SITE_URL },
      offers: { '@type': 'Offer', price: service.price, priceCurrency: 'OMR', availability: 'https://schema.org/InStock' },
      url: `${SITE_URL}/services/${service.slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: service.faq.map((f) => ({
        '@type': 'Question',
        name: loc(f.q),
        acceptedAnswer: { '@type': 'Answer', text: loc(f.a) },
      })),
    },
  ];

  return (
    <>
      <Seo
        title={t('meta.service.title', { service: title, price: omr(service.price) })}
        description={t('meta.service.description', { service: title, price: omr(service.price) })}
        jsonLd={jsonLd}
      />
      <div className="container-x pt-8">
        <Breadcrumbs items={[{ label: t('nav.services'), to: '/services' }, { label: title }]} />
      </div>

      <section className="container-x grid gap-8 pb-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-[22px] border border-line shadow-[var(--shadow-md)]">
            <ServiceArt slug={service.slug} className="aspect-[400/240] w-full" label={title} />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="chip">
              <ServiceIcon slug={service.slug} className="size-4" />
              {t(`categories.${service.category}`)}
            </span>
          </div>
          <h1 className="mt-3 text-[2rem] font-extrabold md:text-[2.5rem]">{title}</h1>
          <p className="mt-4 text-lg text-ink/90">{loc(service.description)}</p>
          <p className="mt-3 flex items-start gap-2 text-sm text-muted">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {t('service.deviceNote')}
          </p>
        </div>

        <aside aria-label={t('common.fixedPrice')} className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 shadow-[var(--shadow-lg)]" data-price-card>
            <p className="text-sm font-semibold text-muted">{t('book.servicePrice')}</p>
            <p
              className="font-heading text-[2.5rem] leading-tight font-extrabold text-brand-700 [:root[data-theme=dark]_&]:text-brand-900"
              data-price={service.price}
            >
              {omr(service.price)}
            </p>
            {service.priceNote && <p className="mt-1 text-sm text-muted">{loc(service.priceNote)}</p>}
            <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-success-bg px-3 py-2 text-sm font-semibold text-success-ink">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {t('common.fixedPrice')}
            </p>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {[
                { icon: Clock, k: t('service.estTime'), v: durationLabel(service, lang) },
                { icon: Tag, k: t('service.type'), v: t(`categories.${service.category}`) },
                { icon: ShieldCheck, k: t('service.warranty'), v: loc(service.warranty) },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <dt className="flex items-center gap-2 text-muted">
                    <Icon className="size-4" aria-hidden="true" />
                    {k}
                  </dt>
                  <dd className="m-0 text-end font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink
              to={`/book/${service.slug}`}
              size="lg"
              className="mt-5 w-full"
              onClick={() => track('book_start', { slug: service.slug })}
            >
              <CalendarPlus className="size-5" aria-hidden="true" />
              {t('service.book')}
            </ButtonLink>
            <ExternalButton
              href={whatsappLink(t('service.waMessage', { service: title }))}
              variant="secondary"
              className="mt-2 w-full"
              onClick={() => track('whatsapp_click', { from: 'service', slug: service.slug })}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {t('service.waAsk')}
            </ExternalButton>
            <p className="mt-4 text-xs text-muted">{t('common.vatNote')}</p>
            <p className="mt-1 text-xs text-muted">{t('common.cancelNote')}</p>
          </div>
        </aside>
      </section>

      <section className="bg-surface py-14" aria-labelledby="inc-title">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="inc-title" className="mb-5 text-2xl font-extrabold">
              {t('service.included')}
            </h2>
            <ul className="grid list-none gap-3 p-0 sm:grid-cols-2">
              {service.included.map((it) => {
                const Icon = INCLUDED_ICONS[it.icon];
                return (
                  <li key={it.text.en} className="card flex items-start gap-3 p-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="pt-1.5 font-medium">{loc(it.text)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div>
              <h2 className="mb-4 text-xl font-bold">{t('service.notIncluded')}</h2>
              <ul className="list-none space-y-3 p-0">
                {service.notIncluded.map((x) => (
                  <li key={x.en} className="flex items-start gap-2">
                    <XCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
                    {loc(x)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-xl font-bold">{t('service.prepare')}</h2>
              <ol className="list-none space-y-3 p-0">
                {service.prepare.map((x, i) => (
                  <li key={x.en} className="flex items-start gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold text-xs font-bold text-[#0B2C6E]">
                      {i + 1}
                    </span>
                    <span>{loc(x)}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Lightbulb className="size-4" aria-hidden="true" />
                {t('common.cancelNote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-14" aria-labelledby="sfaq-title">
        <h2 id="sfaq-title" className="mb-5 text-2xl font-extrabold">
          {t('service.faq')}
        </h2>
        <Accordion items={service.faq.map((f) => ({ q: loc(f.q), a: <p>{loc(f.a)}</p> }))} />
      </section>

      <section className="container-x pb-14" aria-labelledby="stech-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading id="stech-title" title={t('service.technicians')} />
          <Link to={`/technicians?service=${service.slug}`} className="mb-10 inline-flex items-center gap-1 font-semibold">
            {t('service.allTechs', { n: techs.length })}
            <ArrowRight className="flip-rtl size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid list-none gap-5 p-0 md:grid-cols-3">
          {techs.slice(0, 3).map((tech) => (
            <li key={tech.id}>
              <TechCard tech={tech} />
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="bg-surface py-14" aria-labelledby="rel-title">
          <div className="container-x">
            <SectionHeading id="rel-title" eyebrow={t('common.related')} title={t('service.related')} />
            <ul className="grid list-none gap-5 p-0 md:grid-cols-3">
              {related.map((s) => (
                <li key={s.slug}>
                  <ServiceCard service={s} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
