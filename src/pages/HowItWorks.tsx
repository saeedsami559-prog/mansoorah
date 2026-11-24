import {
  BadgeCheck,
  CalendarClock,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  IdCard,
  MousePointerClick,
  ReceiptText,
  RotateCcw,
  Star,
  UserCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { Toc } from '../components/ui/Toc';
import { ButtonLink } from '../components/ui/primitives';
import { SITE_URL } from '../config/site';

const C_ICONS: LucideIcon[] = [MousePointerClick, UserCheck, ReceiptText, CalendarClock];
const T_ICONS: LucideIcon[] = [BadgeCheck, CalendarClock, Wrench, HandCoins];
const V_ICONS: LucideIcon[] = [IdCard, ClipboardCheck, Wrench, GraduationCap, Star];

function Steps({ items, icons }: { items: { title: string; text: string }[]; icons: LucideIcon[] }) {
  return (
    <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
      {items.map((s, i) => {
        const Icon = icons[i];
        return (
          <li key={s.title} className="card flex gap-4 p-5">
            <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900">
              <Icon className="size-6" aria-hidden="true" />
              <span className="absolute -end-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-gold text-xs font-bold text-[#0B2C6E]">
                {i + 1}
              </span>
            </span>
            <div>
              <h3 className="font-bold">{s.title}</h3>
              <p className="mt-1 text-muted">{s.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function HowItWorks() {
  const { t, ta } = useI18n();
  const toc = [
    { id: 'customers', label: t('how.customersTitle') },
    { id: 'technicians', label: t('how.techsTitle') },
    { id: 'verification', label: t('how.verifyTitle') },
    { id: 'guarantee', label: t('how.guaranteeTitle') },
    { id: 'price', label: t('how.priceTitle') },
    { id: 'cancellation', label: t('how.cancelTitle') },
    { id: 'payment', label: t('how.paymentTitle') },
  ];
  const customers = ta('how.customers');
  const promises: { id: string; icon: LucideIcon; title: string; text: string; link?: { to: string; label: string } }[] = [
    { id: 'guarantee', icon: HeartHandshake, title: t('how.guaranteeTitle'), text: t('how.guaranteeText') },
    {
      id: 'price',
      icon: CircleDollarSign,
      title: t('how.priceTitle'),
      text: t('how.priceText'),
      link: { to: '/services', label: t('nav.services') },
    },
    {
      id: 'cancellation',
      icon: RotateCcw,
      title: t('how.cancelTitle'),
      text: t('how.cancelText'),
      link: { to: '/cancellation-refund', label: t('legal.cancellationTitle') },
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: t('how.paymentTitle'),
      text: t('how.paymentText'),
      link: { to: '/privacy', label: t('legal.privacyTitle') },
    },
  ];
  return (
    <>
      <Seo
        title={t('meta.howItWorks.title')}
        description={t('meta.howItWorks.description')}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: t('how.customersTitle'),
          url: `${SITE_URL}/how-it-works`,
          step: customers.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.text })),
        }}
      />
      <PageHero title={t('how.title')} sub={t('how.sub')} crumbs={[{ label: t('nav.howItWorks') }]} />
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
        <div>
          <Toc items={toc} />
        </div>
        <div className="space-y-14">
          <section id="customers" className="scroll-mt-28" aria-labelledby="c-h">
            <h2 id="c-h" className="mb-5 text-2xl font-extrabold">
              {t('how.customersTitle')}
            </h2>
            <Steps items={customers} icons={C_ICONS} />
          </section>
          <section id="technicians" className="scroll-mt-28" aria-labelledby="t-h">
            <h2 id="t-h" className="mb-5 text-2xl font-extrabold">
              {t('how.techsTitle')}
            </h2>
            <Steps items={ta('how.techs')} icons={T_ICONS} />
          </section>
          <section id="verification" className="scroll-mt-28" aria-labelledby="v-h">
            <h2 id="v-h" className="mb-5 text-2xl font-extrabold">
              {t('how.verifyTitle')}
            </h2>
            <ol className="relative m-0 list-none space-y-5 p-0">
              <span className="absolute start-6 top-3 bottom-3 w-0.5 bg-line" aria-hidden="true" />
              {ta('how.verify').map((s, i) => {
                const Icon = V_ICONS[i];
                return (
                  <li key={s.title} className="relative flex gap-4">
                    <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-brand-700 text-white ring-4 ring-bg">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="card flex-1 p-4">
                      <h3 className="font-bold">{s.title}</h3>
                      <p className="text-muted">{s.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
          <div className="grid gap-5 md:grid-cols-2">
            {promises.map((p) => (
              <section key={p.id} id={p.id} className="card scroll-mt-28 p-6" aria-labelledby={`${p.id}-h`}>
                <p.icon className="size-8 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900" aria-hidden="true" />
                <h2 id={`${p.id}-h`} className="mt-3 text-xl font-bold">
                  {p.title}
                </h2>
                <p className="mt-2 text-muted">{p.text}</p>
                {p.link && (
                  <ButtonLink to={p.link.to} variant="ghost" size="sm" className="mt-3 !px-0">
                    {p.link.label}
                    <span aria-hidden="true" className="flip-rtl inline-block">
                      →
                    </span>
                  </ButtonLink>
                )}
              </section>
            ))}
          </div>
          <div className="card flex flex-col items-start gap-4 bg-gradient-to-br from-brand-100 to-surface p-7 md:flex-row md:items-center">
            <p className="flex-1 font-heading text-xl font-bold text-heading">{t('home.cta.title')}</p>
            <ButtonLink to="/services" size="lg">
              {t('nav.book')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
