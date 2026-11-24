import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock,
  MapPin,
  ReceiptText,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  UsersRound,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Stepper } from '../components/ui/Stepper';
import { Badge, EmptyState } from '../components/ui/primitives';
import { Avatar } from '../components/technician/Avatar';
import { AvailabilityLabel, RatingInline, SkillChips } from '../components/technician/TechCard';
import { VerifiedBadge } from '../components/technician/VerifiedBadge';
import { ServiceArt } from '../components/service/ServiceArt';
import { useBooking } from '../components/booking/BookingContext';
import { useToast } from '../components/ui/Toast';
import { getBookable } from '../data/services';
import { availability, getTechnician, rankTechnicians, techniciansFor } from '../data/technicians';
import { REGIONS, getRegion } from '../data/regions';
import { bookingDays, isSlotBookable, slotState, SLOTS, type Slot } from '../lib/slots';
import { bookingTotal } from '../lib/pricing';
import { formatDate, formatSlot } from '../lib/format';
import { fromISODate } from '../lib/dates';
import { track } from '../lib/track';
import NotFound from './NotFound';

export function TrustStrip() {
  const { tl } = useI18n();
  const icons = [BadgeCheck, Star, ReceiptText];
  return (
    <section className="border-t border-line bg-surface">
      <ul className="container-x m-0 grid list-none gap-4 py-6 sm:grid-cols-3">
        {tl('book.trust').map((label, i) => {
          const Icon = icons[i];
          return (
            <li key={label} className="flex items-center justify-center gap-2 font-semibold text-heading">
              <Icon className="size-5 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900" aria-hidden="true" />
              {label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function PriceLines({ price }: { price: number }) {
  const { t, omr } = useI18n();
  const p = bookingTotal(price);
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between gap-3">
        <dt className="text-muted">{t('book.servicePrice')}</dt>
        <dd className="m-0 font-semibold">{omr(p.servicePrice)}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-muted">{t('book.fees')}</dt>
        <dd className="m-0 font-semibold">{t('book.free')}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-muted">{t('book.vat')}</dt>
        <dd className="m-0 font-semibold">{t('book.vatNone')}</dd>
      </div>
      <div className="flex justify-between gap-3 border-t border-line pt-3 text-base">
        <dt className="font-bold">{t('book.total')}</dt>
        <dd
          className="m-0 font-heading text-xl font-extrabold text-brand-700 [:root[data-theme=dark]_&]:text-brand-900"
          data-total={p.total}
        >
          {omr(p.total)}
        </dd>
      </div>
    </dl>
  );
}

export default function BookTechnician() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { t, tl, loc, lang } = useI18n();
  const { draft, setDraft, getBooking, updateBooking } = useBooking();
  const item = getBookable(slug);

  const rescheduleId = params.get('reschedule') ?? undefined;
  const rescheduling = rescheduleId ? getBooking(rescheduleId) : undefined;

  const [region, setRegion] = useState<string>(params.get('region') ?? 'all');
  const [minRating, setMinRating] = useState(false);
  const [todayOnly, setTodayOnly] = useState(false);

  const all = useMemo(() => (item ? rankTechnicians(techniciansFor(item.slug)) : []), [item]);
  const recommendedId = all[0]?.id;
  const techs = useMemo(
    () =>
      rescheduling
        ? all.filter((x) => x.id === rescheduling.techId)
        : all.filter(
            (x) =>
              (region === 'all' || x.region === region) &&
              (!minRating || x.rating >= 4.5) &&
              (!todayOnly || availability(x.id) === 'today'),
          ),
    [all, region, minRating, todayOnly, rescheduling],
  );

  const days = useMemo(() => bookingDays(), []);
  const restored = draft && draft.slug === slug && !rescheduleId ? draft : null;
  const [techId, setTechId] = useState<string | undefined>(rescheduling?.techId ?? params.get('tech') ?? restored?.techId);
  const [date, setDate] = useState<string>(restored?.date ?? days[0].iso);
  const [slot, setSlot] = useState<string | undefined>(restored?.slot);

  // Pick the first day with free slots once a technician is chosen.
  useEffect(() => {
    if (!techId) return;
    if (slot && isSlotBookable(techId, date, slot)) return;
    setSlot(undefined);
    if (!SLOTS.some((s) => slotState(techId, date, s) === 'available')) {
      const first = days.find((d) => SLOTS.some((s) => slotState(techId, d.iso, s) === 'available'));
      if (first) setDate(first.iso);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techId]);

  if (!item) return <NotFound />;
  const tech = getTechnician(techId);
  const title = loc(item.title);
  const ready = Boolean(tech && date && slot && isSlotBookable(tech.id, date, slot));

  const onContinue = async () => {
    if (!ready || !tech || !slot) return;
    if (rescheduling) {
      if (!(await updateBooking(rescheduling.id, { date, slot }))) {
        toast(t('bookings.updateError'), 'info');
        return;
      }
      track('booking_rescheduled', { id: rescheduling.id });
      toast(t('book.rescheduled', { date: formatDate(date, lang), time: formatSlot(slot, lang) }));
      navigate('/bookings');
      return;
    }
    setDraft({ slug: item.slug, techId: tech.id, date, slot });
    track('book_select_slot', { slug: item.slug, tech: tech.id });
    navigate(`/book/${item.slug}/confirm`);
  };

  return (
    <>
      <Seo title={t('meta.book.title', { service: title })} description={t('meta.book.description', { service: title })} />
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { label: t('nav.services'), to: '/services' },
            ...(item.isPackage ? [] : [{ label: title, to: `/services/${item.slug}` }]),
            { label: tl('book.steps')[1] },
          ]}
        />
        <Stepper current={2} />
        <h1 className="mt-6 text-[1.75rem] font-extrabold md:text-[2.25rem]">
          {rescheduling ? t('book.reschedulingTitle', { id: rescheduling.id }) : t('book.title')}
        </h1>
      </div>

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="techs-heading" className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="techs-heading" className="flex items-center gap-2 text-xl font-bold">
              <UsersRound className="size-5 text-brand-700" aria-hidden="true" />
              {t('book.found', { n: techs.length })}
            </h2>
          </div>

          {!rescheduling && (
            <fieldset className="card mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 p-4">
              <legend className="sr-only">{t('book.filters')}</legend>
              <SlidersHorizontal className="size-5 text-muted" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <label htmlFor="f-region" className="text-sm font-semibold">
                  {t('book.region')}
                </label>
                <select
                  id="f-region"
                  className="input !min-h-10 !w-auto !py-1.5 text-sm"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="all">{t('common.regionAll')}</option>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {loc(r.name)}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" className="check" checked={minRating} onChange={(e) => setMinRating(e.target.checked)} />
                {t('book.rating45')}
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" className="check" checked={todayOnly} onChange={(e) => setTodayOnly(e.target.checked)} />
                {t('book.today')}
              </label>
            </fieldset>
          )}

          {techs.length === 0 ? (
            <EmptyState
              icon={<UsersRound className="size-7" />}
              title={t('book.noTechs')}
              action={
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setRegion('all');
                    setMinRating(false);
                    setTodayOnly(false);
                  }}
                >
                  {t('book.resetFilters')}
                </button>
              }
            />
          ) : (
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="sr-only">{tl('book.steps')[1]}</legend>
              <ul className="m-0 grid list-none gap-4 p-0">
                {techs.map((x) => {
                  const selected = x.id === techId;
                  const reg = getRegion(x.region);
                  return (
                    <li key={x.id}>
                      <label
                        className={`card relative flex cursor-pointer gap-4 p-4 transition-all sm:p-5 ${
                          selected ? '!border-brand-700 bg-brand-100/50 ring-2 ring-brand-700/30' : 'hover:border-brand-500/50'
                        }`}
                        data-tech-option={x.id}
                      >
                        <input
                          type="radio"
                          name="technician"
                          value={x.id}
                          checked={selected}
                          onChange={() => setTechId(x.id)}
                          className="check mt-1 !size-5"
                          aria-label={t('book.chooseTech', { name: loc(x.name) })}
                        />
                        <Avatar name={loc(x.name)} tone={x.tone} gender={x.gender} size={56} />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-heading text-[1.05rem] font-bold text-heading">{loc(x.name)}</span>
                            <VerifiedBadge compact />
                            {x.id === recommendedId && <Badge tone="gold">{t('common.recommended')}</Badge>}
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <RatingInline rating={x.rating} reviews={x.reviews} />
                            <span className="inline-flex items-center gap-1 text-sm text-muted">
                              <MapPin className="size-4" aria-hidden="true" />
                              {reg && loc(reg.name)}
                            </span>
                          </span>
                          <span className="mt-2 block">
                            <SkillChips skills={x.skills} />
                          </span>
                          <span className="mt-2 flex flex-wrap items-center gap-3">
                            <AvailabilityLabel techId={x.id} />
                            <Link
                              to={`/technicians/${x.id}`}
                              className="relative z-10 text-sm font-semibold"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {t('techs.viewProfile')}
                            </Link>
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          )}
        </section>

        <aside aria-labelledby="summary-heading" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-line p-4">
              <ServiceArt slug={item.isPackage ? 'package' : item.slug} className="h-16 w-24 shrink-0 rounded-xl" />
              <div className="min-w-0">
                <h2 id="summary-heading" className="text-sm font-semibold text-muted">
                  {t('book.summary')}
                </h2>
                <p className="font-heading font-bold text-heading">{title}</p>
                {!rescheduling && (
                  <Link to={item.isPackage ? '/services' : `/services/${item.slug}`} className="text-xs font-semibold">
                    {t('book.changeService')}
                  </Link>
                )}
              </div>
            </div>

            <div className="p-4">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="mb-2 flex items-center gap-2 text-sm font-bold">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {t('book.date')}
                </legend>
                <div
                  className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
                  role="radiogroup"
                  aria-label={t('book.date')}
                >
                  {days.map((d) => {
                    const dt = fromISODate(d.iso);
                    const sel = d.iso === date;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        role="radio"
                        aria-checked={sel}
                        onClick={() => {
                          setDate(d.iso);
                          setSlot(undefined);
                        }}
                        className={`flex min-w-[62px] shrink-0 cursor-pointer flex-col items-center rounded-xl border px-2 py-2 text-center transition-colors ${
                          sel ? 'border-brand-700 bg-brand-700 text-on-brand' : 'border-line bg-surface hover:border-brand-500'
                        }`}
                        aria-label={`${formatDate(d.iso, lang)}${d.isFriday ? ` – ${t('book.friday')}` : ''}`}
                        data-date={d.iso}
                      >
                        <span className={`text-xs ${sel ? 'text-on-brand/85' : 'text-muted'}`}>
                          {new Intl.DateTimeFormat(lang === 'ar' ? 'ar-OM-u-nu-latn' : 'en-GB', { weekday: 'short' }).format(dt)}
                        </span>
                        <span className="font-heading text-lg leading-tight font-bold">{dt.getDate()}</span>
                        <span className={`text-[0.7rem] ${sel ? 'text-on-brand/85' : 'text-muted'}`}>
                          {d.isFriday
                            ? t('book.friday')
                            : new Intl.DateTimeFormat(lang === 'ar' ? 'ar-OM-u-nu-latn' : 'en-GB', { month: 'short' }).format(dt)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="m-0 mt-4 min-w-0 border-0 p-0">
                <legend className="mb-2 flex items-center gap-2 text-sm font-bold">
                  <Clock className="size-4" aria-hidden="true" />
                  {t('book.time')} · <span className="font-normal text-muted">{formatDate(date, lang)}</span>
                </legend>
                {!tech ? (
                  <p className="rounded-xl bg-surface-2 p-3 text-sm text-muted">{t('book.pickTech')}</p>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t('book.time')}>
                      {SLOTS.map((s: Slot) => {
                        const state = slotState(tech.id, date, s);
                        const sel = s === slot;
                        const disabled = state !== 'available';
                        const note =
                          state === 'booked'
                            ? t('book.booked')
                            : state === 'closed'
                              ? t('book.closed')
                              : state === 'past'
                                ? t('book.past')
                                : '';
                        return (
                          <button
                            key={s}
                            type="button"
                            role="radio"
                            aria-checked={sel}
                            disabled={disabled}
                            onClick={() => setSlot(s)}
                            className={`flex min-h-12 flex-col items-center justify-center rounded-xl border px-1 py-1.5 text-sm font-semibold transition-colors ${
                              sel
                                ? 'cursor-pointer border-brand-700 bg-brand-700 text-on-brand'
                                : disabled
                                  ? 'cursor-not-allowed border-dashed border-line bg-surface-2 text-muted'
                                  : 'cursor-pointer border-line bg-surface hover:border-brand-500'
                            }`}
                            data-slot={s}
                            data-state={state}
                          >
                            <span dir="ltr" className={disabled ? 'line-through decoration-1' : ''}>
                              {formatSlot(s, lang)}
                            </span>
                            {disabled && <span className="text-[0.68rem] font-medium">{note}</span>}
                          </button>
                        );
                      })}
                    </div>
                    {SLOTS.every((s) => slotState(tech.id, date, s) !== 'available') && (
                      <p className="mt-2 text-sm text-muted">{t('book.noSlots')}</p>
                    )}
                  </>
                )}
              </fieldset>

              <div className="mt-5 border-t border-line pt-4">
                {tech && (
                  <p className="mb-3 flex items-center gap-2 text-sm">
                    <ShieldCheck className="size-4 text-success" aria-hidden="true" />
                    <span className="font-semibold">{loc(tech.name)}</span>
                    {slot && (
                      <span className="text-muted">
                        · {formatDate(date, lang, { year: undefined })} · <span dir="ltr">{formatSlot(slot, lang)}</span>
                      </span>
                    )}
                  </p>
                )}
                <PriceLines price={rescheduling ? rescheduling.total : item.price} />
                <button
                  type="button"
                  className="btn btn-primary btn-lg mt-5 w-full"
                  disabled={!ready}
                  aria-disabled={!ready}
                  onClick={onContinue}
                  data-testid="continue"
                >
                  {rescheduling ? t('book.rescheduleSave') : t('common.continue')}
                  <ArrowRight className="flip-rtl size-5" aria-hidden="true" />
                </button>
                {!ready && (
                  <p className="mt-2 text-center text-xs text-muted" aria-live="polite">
                    {t('book.missing')}
                  </p>
                )}
                <p className="mt-3 text-center text-xs text-muted">{t('common.cancelNote')}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <TrustStrip />
    </>
  );
}
