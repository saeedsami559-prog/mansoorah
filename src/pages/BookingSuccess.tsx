import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { CalendarPlus, Copy, Gift, Home as HomeIcon, ListChecks, MessageCircle, Share2 } from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Stepper } from '../components/ui/Stepper';
import { Button, ButtonLink, EmptyState, ExternalButton } from '../components/ui/primitives';
import { Avatar } from '../components/technician/Avatar';
import { useBooking } from '../components/booking/BookingContext';
import { useToast } from '../components/ui/Toast';
import { getBookable } from '../data/services';
import { getTechnician } from '../data/technicians';
import { getRegion, getWilayat } from '../data/regions';
import { formatDate, formatSlot } from '../lib/format';
import { whatsappLink } from '../lib/whatsapp';
import { buildIcs, downloadFile } from '../lib/ics';
import { hash } from '../lib/slots';
import { track } from '../lib/track';
import { SITE_URL } from '../config/site';
import { PAYMENT_METHODS } from './BookConfirm';

export function AnimatedCheck() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 80 80"
      className="size-20"
      aria-hidden="true"
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
    >
      <circle cx="40" cy="40" r="38" fill="var(--success-bg)" />
      <circle cx="40" cy="40" r="28" fill="#1F9D61" />
      <motion.path
        d="M27 41 L36 50 L54 31"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="60"
        initial={reduce ? false : { strokeDashoffset: 60 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

export default function BookingSuccess() {
  const { id } = useParams();
  const { t, loc, lang, omr } = useI18n();
  const { getBooking } = useBooking();
  const toast = useToast();
  const booking = getBooking(id);
  const [copied, setCopied] = useState(false);

  if (!booking) {
    return (
      <div className="container-x py-16">
        <Seo title={t('meta.success.title')} description={t('meta.success.description')} noindex />
        <EmptyState
          icon={<ListChecks className="size-7" />}
          title={t('success.notFound')}
          action={<ButtonLink to="/bookings">{t('success.viewBookings')}</ButtonLink>}
        />
      </div>
    );
  }
  const item = getBookable(booking.slug)!;
  const tech = getTechnician(booking.techId)!;
  const date = formatDate(booking.date, lang);
  const time = formatSlot(booking.slot, lang);
  const region = getRegion(booking.customer.governorate);
  const wilayat = getWilayat(booking.customer.governorate, booking.customer.wilayat);
  const area = [booking.customer.area, wilayat && loc(wilayat.name), region && loc(region.name)]
    .filter(Boolean)
    .join(lang === 'ar' ? '، ' : ', ');
  const paymentLabel = t(PAYMENT_METHODS.find((p) => p.id === booking.payment)!.key);
  const waText = t('success.waMessage', {
    id: booking.id,
    service: loc(item.title),
    tech: loc(tech.name),
    date,
    time,
    area,
    total: omr(booking.total),
    payment: paymentLabel,
  });
  const code = `MNS-${(hash(booking.id) % 9000) + 1000}`;
  const shareText = t('success.referralShare', { url: SITE_URL, code });

  const addToCalendar = () => {
    const ics = buildIcs({
      uid: booking.id,
      title: `Mansoorah – ${item.title.en}`,
      description: `${booking.id} · ${tech.name.en} · ${booking.total} OMR`,
      location: [
        booking.customer.house,
        booking.customer.street,
        booking.customer.area,
        wilayat?.name.en,
        region?.name.en,
        'Oman',
      ]
        .filter(Boolean)
        .join(', '),
      date: booking.date,
      slot: booking.slot,
      durationMinutes: item.duration.max,
    });
    downloadFile(`${booking.id}.ics`, ics);
    track('add_to_calendar', { id: booking.id });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast(t('common.copied'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mansoorah', text: shareText, url: SITE_URL });
        track('referral_share', { method: 'native' });
      } catch {
        /* user cancelled */
      }
    } else {
      window.open(whatsappLink(shareText, ''), '_blank', 'noopener');
    }
  };

  return (
    <>
      <Seo title={t('meta.success.title')} description={t('meta.success.description')} noindex />
      <div className="container-x pt-8">
        <Breadcrumbs items={[{ label: t('nav.bookings'), to: '/bookings' }, { label: booking.id }]} />
        <Stepper current={5} />
      </div>
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-6 text-center md:p-10" aria-labelledby="ok-title">
          <div className="flex justify-center">
            <AnimatedCheck />
          </div>
          <h1 id="ok-title" className="mt-5 text-[2rem] font-extrabold">
            {t('success.title')}
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-muted">{t('success.sub', { tech: loc(tech.name), date, time })}</p>
          <p className="mt-6 text-sm font-semibold text-muted">{t('success.id')}</p>
          <p
            className="font-heading text-[1.75rem] font-extrabold tracking-wider text-brand-700 [:root[data-theme=dark]_&]:text-brand-900"
            dir="ltr"
            data-testid="booking-id"
          >
            {booking.id}
          </p>

          <dl className="mx-auto mt-6 max-w-md divide-y divide-line rounded-2xl border border-line text-start text-sm">
            {[
              [t('confirm.summary'), loc(item.title)],
              [t('confirm.technician'), loc(tech.name)],
              [t('confirm.appointment'), `${date} · ${time}`],
              [t('confirm.address'), area],
              [t('confirm.payment'), paymentLabel],
              [t('book.total'), omr(booking.total)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="m-0 text-end font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted">{t('common.vatNote')}</p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="secondary" onClick={addToCalendar}>
              <CalendarPlus className="size-5" aria-hidden="true" />
              {t('success.calendar')}
            </Button>
            <ExternalButton href={whatsappLink(waText)} onClick={() => track('whatsapp_click', { from: 'success' })}>
              <MessageCircle className="size-5" aria-hidden="true" />
              {t('success.whatsapp')}
            </ExternalButton>
          </div>
          <p className="mt-2 text-xs text-muted">{t('success.whatsappHint')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 border-t border-line pt-6">
            <ButtonLink to="/bookings">
              <ListChecks className="size-5" aria-hidden="true" />
              {t('success.viewBookings')}
            </ButtonLink>
            <ButtonLink to="/" variant="ghost">
              <HomeIcon className="size-5" aria-hidden="true" />
              {t('success.home')}
            </ButtonLink>
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-6" aria-labelledby="next-h">
            <h2 id="next-h" className="text-lg font-bold">
              {t('success.nextSteps')}
            </h2>
            <ol className="mt-4 list-none space-y-4 p-0">
              {(['success.next1', 'success.next2', 'success.next3'] as const).map((k, i) => (
                <li key={k} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <span>{t(k)}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
              <Avatar name={loc(tech.name)} tone={tech.tone} gender={tech.gender} size={44} />
              <div>
                <p className="font-semibold">{loc(tech.name)}</p>
                <p className="text-xs text-muted">{t('common.verifiedTooltip')}</p>
              </div>
            </div>
          </section>

          <section className="card overflow-hidden" aria-labelledby="ref-h" data-referral>
            <div className="bg-gradient-to-br from-[#0B2C6E] to-[#1C5AA6] p-6 text-white">
              <Gift className="size-8 text-[#D4A84B]" aria-hidden="true" />
              <h2 id="ref-h" className="mt-3 text-xl font-bold text-white">
                {t('success.referralTitle')}
              </h2>
              <p className="mt-1 text-sm text-white/85">{t('success.referralText')}</p>
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold text-muted">{t('success.referralCode')}</p>
              <p
                className="mt-1 rounded-xl border-2 border-dashed border-gold bg-surface-2 py-3 text-center font-heading text-2xl font-extrabold tracking-[0.2em]"
                dir="ltr"
              >
                {code}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={copyCode}>
                  <Copy className="size-4" aria-hidden="true" />
                  {copied ? t('common.copied') : t('common.copy')}
                </Button>
                <Button onClick={share}>
                  <Share2 className="size-4" aria-hidden="true" />
                  {t('common.share')}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
