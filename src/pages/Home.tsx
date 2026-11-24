import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gauge,
  HardHat,
  Lightbulb,
  LockKeyhole,
  MapPin,
  MessageCircle,
  MousePointerClick,
  Quote,
  ReceiptText,
  ShieldCheck,
  Star,
  UserCheck,
  Cctv,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { ArchesMotif, HouseLineArt } from '../components/layout/OmaniMotif';
import { ButtonLink, ExternalButton, RatingStars, SectionHeading } from '../components/ui/primitives';
import { Reveal } from '../components/ui/Reveal';
import { Accordion } from '../components/ui/Accordion';
import { ServiceCard } from '../components/service/ServiceCard';
import { PackageBanner } from '../components/service/PackageBanner';
import { TechCard } from '../components/technician/TechCard';
import { Avatar } from '../components/technician/Avatar';
import { SERVICES, getService } from '../data/services';
import { TECHNICIANS, rankTechnicians } from '../data/technicians';
import { REGIONS } from '../data/regions';
import { HOME_REVIEWS } from '../data/reviews';
import { ALL_FAQS } from '../data/faqs';
import { whatsappLink } from '../lib/whatsapp';
import { formatDate } from '../lib/format';
import { relativeISO } from '../lib/dates';
import { track } from '../lib/track';

const STEP_ICONS: LucideIcon[] = [MousePointerClick, UserCheck, ReceiptText, CalendarClock];
const PILLAR_ICONS: LucideIcon[] = [ShieldCheck, Star, ReceiptText, Zap];

function Hero() {
  const { t, loc, omr, lang } = useI18n();
  const tech = TECHNICIANS[0];
  const svc = getService('smart-door-lock')!;
  const chips: { icon: LucideIcon; key: Parameters<typeof t>[0]; cls: string }[] = [
    { icon: LockKeyhole, key: 'home.hero.chipLock', cls: '-top-12 -start-4 lg:-start-10' },
    { icon: Cctv, key: 'home.hero.chipCam', cls: '-top-12 -end-4 lg:-end-10 [animation-delay:1.2s]' },
    { icon: Wifi, key: 'home.hero.chipWifi', cls: '-bottom-12 -start-4 lg:-start-10 [animation-delay:2.1s]' },
    { icon: Lightbulb, key: 'home.hero.chipBulb', cls: '-bottom-12 -end-4 lg:-end-10 [animation-delay:0.6s]' },
  ];
  return (
    <section className="hero-band" aria-labelledby="hero-title">
      <HouseLineArt className="pointer-events-none absolute end-0 bottom-10 hidden w-[520px] opacity-80 lg:block" />
      <ArchesMotif className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full md:h-40" />
      <div className="container-x relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20">
            <MapPin className="size-4 text-[#D4A84B]" aria-hidden="true" />
            {t('home.hero.eyebrow')}
          </p>
          <h1 id="hero-title" className="mt-5 text-[2.35rem] leading-[1.12] font-extrabold sm:text-[3rem] lg:text-[3.75rem]">
            {t('home.hero.titleA')} <span className="text-[#F2D493]">{t('home.hero.titleB')}</span> {t('home.hero.titleC')}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">{t('home.hero.sub')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/services" variant="white" size="lg" onClick={() => track('cta_book', { from: 'hero' })}>
              {t('home.hero.cta')}
              <ArrowRight className="flip-rtl size-5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/services" variant="outline-white" size="lg">
              {t('home.hero.cta2')}
            </ButtonLink>
          </div>
          <ul className="mt-8 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
            {(['home.hero.tick1', 'home.hero.tick2', 'home.hero.tick3'] as const).map((k) => (
              <li key={k} className="flex items-center gap-2 text-[0.95rem] font-medium text-white">
                <CheckCircle2 className="size-5 text-[#D4A84B]" aria-hidden="true" />
                {t(k)}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[400px] sm:my-14" aria-hidden="true">
          <div className="rounded-[24px] bg-white p-5 text-[#0E1A33] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] [:root[data-theme=dark]_&]:bg-[#0F1D36] [:root[data-theme=dark]_&]:text-[#E6EDF8]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#5B6B85] [:root[data-theme=dark]_&]:text-[#A3B2CB]">
                {t('home.hero.cardTitle')}
              </p>
              <span className="rounded-full bg-[#E7F6EE] px-2.5 py-0.5 text-xs font-bold text-[#157347]">
                {t('bookings.status.upcoming')}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-[#EAF2FB] text-[#1C5AA6]">
                <LockKeyhole className="size-6" />
              </span>
              <div>
                <p className="font-heading font-bold">{loc(svc.title)}</p>
                <p className="text-sm text-[#5B6B85] [:root[data-theme=dark]_&]:text-[#A3B2CB]">
                  {formatDate(relativeISO(1), lang, { year: undefined })} · 11:00
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#F7F9FC] p-3 [:root[data-theme=dark]_&]:bg-[#132442]">
              <Avatar name={loc(tech.name)} tone={tech.tone} gender={tech.gender} size={44} />
              <div className="flex-1">
                <p className="font-semibold">{loc(tech.name)}</p>
                <p className="flex items-center gap-1 text-xs text-[#157347]">
                  <BadgeCheck className="size-3.5" />
                  {t('home.hero.cardTech')}
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-bold">
                <Star className="size-4 text-[#D4A84B]" fill="currentColor" strokeWidth={0} />
                {tech.rating}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-[#D9E2EF] pt-4 [:root[data-theme=dark]_&]:border-[#22365A]">
              <div>
                <p className="text-xs text-[#5B6B85] [:root[data-theme=dark]_&]:text-[#A3B2CB]">{t('home.hero.cardPrice')}</p>
                <p className="font-heading text-2xl font-extrabold text-[#1C5AA6] [:root[data-theme=dark]_&]:text-[#8DBCF7]">
                  {omr(svc.price)}
                </p>
              </div>
              <span className="rounded-xl bg-[#1C5AA6] px-4 py-2 text-sm font-semibold text-white">{t('common.bookNow')}</span>
            </div>
          </div>
          {chips.map(({ icon: Icon, key, cls }) => (
            <span
              key={key}
              className={`float-y absolute ${cls} hidden items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 text-sm font-semibold whitespace-nowrap text-[#0B2C6E] shadow-lg ring-1 ring-black/5 sm:inline-flex`}
            >
              <span className="grid size-7 place-items-center rounded-lg bg-[#EAF2FB] text-[#1C5AA6]">
                <Icon className="size-4" />
              </span>
              {t(key)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedTechs() {
  const { t } = useI18n();
  const ref = useRef<HTMLUListElement>(null);
  const featured = rankTechnicians(TECHNICIANS)
    .filter((x) => x.pro)
    .slice(0, 4);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const rtl = document.documentElement.dir === 'rtl' ? -1 : 1;
    el.scrollBy({ left: dir * rtl * (el.clientWidth * 0.8), behavior: 'smooth' });
  };
  return (
    <section className="section" aria-labelledby="techs-title">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            id="techs-title"
            eyebrow={t('home.techs.eyebrow')}
            title={t('home.techs.title')}
            sub={t('home.techs.sub')}
          />
          <div className="mb-10 flex gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm !px-2.5"
              onClick={() => scroll(-1)}
              aria-label={t('home.techs.prev')}
            >
              <ChevronLeft className="flip-rtl size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm !px-2.5"
              onClick={() => scroll(1)}
              aria-label={t('home.techs.next')}
            >
              <ChevronRight className="flip-rtl size-5" aria-hidden="true" />
            </button>
            <ButtonLink to="/technicians" variant="ghost" size="sm">
              {t('common.seeAll')}
              <ArrowRight className="flip-rtl size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
        <ul
          ref={ref}
          className="scrollbar-none -mx-4 flex list-none snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4"
          aria-label={t('home.techs.title')}
        >
          {featured.map((tech) => (
            <li key={tech.id} className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[calc(25%-15px)]">
              <TechCard tech={tech} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  const { t, ta, loc } = useI18n();
  const faqs = ALL_FAQS.filter((_, i) => [0, 3, 6, 9].includes(i));
  const steps = ta('home.how.steps');
  const pillars = ta('home.pillars.items');
  return (
    <>
      <Seo
        title={t('meta.home.title')}
        description={t('meta.home.description')}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Mansoorah',
          alternateName: 'منصورة',
          description: t('brand.tagline'),
          inLanguage: ['en', 'ar'],
        }}
      />
      <Hero />

      <section className="section" aria-labelledby="svc-title">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="svc-title"
              eyebrow={t('home.services.eyebrow')}
              title={t('home.services.title')}
              sub={t('home.services.sub')}
            />
            <ButtonLink to="/services" variant="secondary" className="mb-10">
              {t('common.seeAll')}
              <ArrowRight className="flip-rtl size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <li key={s.slug}>
                <Reveal delay={(i % 4) * 0.05} className="h-full">
                  <ServiceCard service={s} showImage={false} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container-x">
        <Reveal>
          <PackageBanner />
        </Reveal>
      </div>

      <section className="section" aria-labelledby="how-title">
        <div className="container-x">
          <SectionHeading id="how-title" center eyebrow={t('home.how.eyebrow')} title={t('home.how.title')} />
          <ol className="relative grid list-none gap-8 p-0 md:grid-cols-4 md:gap-6">
            <span
              className="absolute inset-x-[12%] top-8 hidden h-0.5 bg-gradient-to-r from-brand-100 via-brand-500/40 to-brand-100 md:block"
              aria-hidden="true"
            />
            {steps.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <li key={s.title} className="relative text-center">
                  <Reveal delay={i * 0.08}>
                    <span className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-brand-700 text-white shadow-[var(--shadow-lg)]">
                      <Icon className="size-7" aria-hidden="true" />
                      <span className="absolute -end-2 -top-2 grid size-7 place-items-center rounded-full bg-gold text-sm font-extrabold text-[#0B2C6E] ring-4 ring-bg">
                        {i + 1}
                      </span>
                    </span>
                    <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                    <p className="mx-auto mt-2 max-w-[16rem] text-muted">{s.text}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="why-title">
        <div className="container-x">
          <SectionHeading id="why-title" eyebrow={t('home.pillars.eyebrow')} title={t('home.pillars.title')} />
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => {
              const Icon = PILLAR_ICONS[i];
              return (
                <li key={p.title}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <div className="card h-full p-6">
                      <span className="grid size-12 place-items-center rounded-2xl bg-brand-100 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                      <p className="mt-2 text-muted">{p.text}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <FeaturedTechs />

      <section className="section bg-surface" aria-labelledby="cov-title">
        <div className="container-x">
          <SectionHeading
            id="cov-title"
            eyebrow={t('home.coverage.eyebrow')}
            title={t('home.coverage.title')}
            sub={t('home.coverage.sub')}
          />
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {REGIONS.map((r, i) => {
              const count = TECHNICIANS.filter((x) => x.region === r.id).length;
              return (
                <li key={r.id}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <Link
                      to={`/technicians?region=${r.id}`}
                      className="card card-hover relative flex h-full flex-col overflow-hidden p-6 text-ink no-underline"
                    >
                      <ArchesMotif
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full"
                        color="var(--brand-500)"
                        opacity={0.18}
                      />
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700 [:root[data-theme=dark]_&]:text-brand-900">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {t('home.coverage.launch')}
                      </span>
                      <h3 className="mt-3 text-xl font-bold">{loc(r.name)}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {r.wilayats
                          .map((w) => loc(w.name))
                          .slice(0, 4)
                          .join(' · ')}
                      </p>
                      <p className="relative mt-auto pt-6 text-sm font-semibold text-brand-700 [:root[data-theme=dark]_&]:text-brand-900">
                        {t('home.coverage.technicians', { n: count })}
                      </p>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="rev-title">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHeading id="rev-title" eyebrow={t('home.reviews.eyebrow')} title={t('home.reviews.title')} />
            <p
              className="mb-10 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm font-semibold text-muted"
              data-demo-label
            >
              {t('common.sampleReviews')}
            </p>
          </div>
          <ul className="grid list-none gap-5 p-0 md:grid-cols-3">
            {HOME_REVIEWS.map((r, i) => (
              <li key={i}>
                <Reveal delay={i * 0.08} className="h-full">
                  <figure className="card relative m-0 flex h-full flex-col p-6">
                    <Quote className="flip-rtl absolute end-5 top-5 size-8 text-brand-100" aria-hidden="true" />
                    <RatingStars value={r.rating} label={t('common.outOf5', { n: r.rating })} />
                    <blockquote className="m-0 mt-4 flex-1 text-[1.02rem] text-ink">“{loc(r.text)}”</blockquote>
                    <figcaption className="mt-5 border-t border-line pt-4 text-sm">
                      <span className="font-bold text-heading">{loc(r.name)}</span>
                      <span className="text-muted">
                        {' '}
                        · {loc(r.area)} · {loc(getService(r.service)!.title)}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="container-x grid gap-5 md:grid-cols-2"
        aria-label={`${t('home.callouts.techTitle')} / ${t('home.callouts.partnerTitle')}`}
      >
        <Reveal className="h-full">
          <div className="card flex h-full flex-col gap-4 bg-gradient-to-br from-brand-100 to-surface p-7 md:p-9">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-700 text-white">
              <HardHat className="size-6" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-extrabold">{t('home.callouts.techTitle')}</h2>
            <p className="text-muted">{t('home.callouts.techText')}</p>
            <ButtonLink to="/join" className="mt-auto w-fit">
              {t('home.callouts.techCta')}
              <ArrowRight className="flip-rtl size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="h-full">
          <div className="card flex h-full flex-col gap-4 p-7 md:p-9">
            <span className="grid size-12 place-items-center rounded-2xl bg-gold text-[#0B2C6E]">
              <Building2 className="size-6" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-extrabold">{t('home.callouts.partnerTitle')}</h2>
            <p className="text-muted">{t('home.callouts.partnerText')}</p>
            <ButtonLink to="/partners" variant="secondary" className="mt-auto w-fit">
              {t('home.callouts.partnerCta')}
              <ArrowRight className="flip-rtl size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading id="faq-title" eyebrow={t('home.faq.eyebrow')} title={t('home.faq.title')} />
            <ButtonLink to="/faq" variant="secondary" className="-mt-4">
              {t('home.faq.all')}
              <ArrowRight className="flip-rtl size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <Accordion items={faqs.map((f) => ({ q: loc(f.q), a: <p>{loc(f.a)}</p> }))} defaultOpen={0} />
        </div>
      </section>

      <section className="hero-band" aria-labelledby="cta-title">
        <ArchesMotif className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full" />
        <div className="container-x relative flex flex-col items-center py-16 text-center md:py-20">
          <Gauge className="size-10 text-[#D4A84B]" aria-hidden="true" />
          <h2 id="cta-title" className="mt-4 max-w-2xl text-[2rem] font-extrabold md:text-[2.5rem]">
            {t('home.cta.title')}
          </h2>
          <p className="mt-3 max-w-xl text-lg text-white/85">{t('home.cta.sub')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/services" variant="white" size="lg">
              {t('home.cta.button')}
            </ButtonLink>
            <ExternalButton
              href={whatsappLink(t('services.waMessage'))}
              variant="outline-white"
              size="lg"
              onClick={() => track('whatsapp_click', { from: 'home_cta' })}
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              {t('home.cta.whatsapp')}
            </ExternalButton>
          </div>
          <p className="mt-8 font-heading text-lg font-semibold text-[#F2D493]">{t('brand.closing')}</p>
        </div>
      </section>
    </>
  );
}
