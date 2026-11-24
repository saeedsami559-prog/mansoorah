import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  Banknote,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FlaskConical,
  Lock,
  MapPin,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { useI18n, type TKey } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Stepper } from '../components/ui/Stepper';
import { Field, describedBy } from '../components/ui/Field';
import { ButtonLink, EmptyState } from '../components/ui/primitives';
import { Avatar } from '../components/technician/Avatar';
import { ServiceArt } from '../components/service/ServiceArt';
import { useBooking } from '../components/booking/BookingContext';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../components/auth/AuthContext';
import { PriceLines, TrustStrip } from './BookTechnician';
import { getBookable } from '../data/services';
import { getTechnician } from '../data/technicians';
import { REGIONS, getRegion } from '../data/regions';
import { isValidOmaniMobile, normalizeOmaniMobile } from '../lib/phone';
import { isSlotBookable } from '../lib/slots';
import { newBookingId, type Booking, type PaymentMethod } from '../lib/bookings';
import { bookingTotal } from '../lib/pricing';
import { formatDate, formatSlot } from '../lib/format';
import { toISODate } from '../lib/dates';
import { track } from '../lib/track';
import NotFound from './NotFound';

const schema = z.object({
  name: z.string().trim().min(3, 'confirm.errors.name'),
  phone: z.string().refine(isValidOmaniMobile, 'confirm.errors.phone'),
  governorate: z.string().min(1, 'confirm.errors.governorate'),
  wilayat: z.string().min(1, 'confirm.errors.wilayat'),
  area: z.string().trim().min(2, 'confirm.errors.area'),
  street: z.string().trim().optional(),
  house: z.string().trim().min(1, 'confirm.errors.house'),
  landmark: z.string().trim().optional(),
  notes: z.string().trim().max(500).optional(),
  device: z.enum(['own', 'help']),
  payment: z.enum(['omannet', 'card', 'thawani', 'cash']),
  terms: z.literal(true, { errorMap: () => ({ message: 'confirm.errors.terms' }) }),
});
type FormValues = z.infer<typeof schema>;

export const PAYMENT_METHODS: { id: PaymentMethod; key: TKey; icon: LucideIcon; online: boolean }[] = [
  { id: 'omannet', key: 'confirm.payOmannet', icon: CreditCard, online: true },
  { id: 'card', key: 'confirm.payCard', icon: CreditCard, online: true },
  { id: 'thawani', key: 'confirm.payThawani', icon: Wallet, online: true },
  { id: 'cash', key: 'confirm.payCash', icon: Banknote, online: false },
];

export default function BookConfirm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { t, tl, loc, lang } = useI18n();
  const { draft, setDraft, addBooking, bookings } = useBooking();
  const { live, user, loading } = useAuth();
  const item = getBookable(slug);
  const valid = draft && draft.slug === slug && draft.techId && draft.date && draft.slot;
  const tech = getTechnician(draft?.techId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      area: '',
      street: '',
      house: '',
      landmark: '',
      notes: '',
      device: 'own',
      payment: 'cash',
      governorate: '',
      wilayat: '',
    } as Partial<FormValues>,
  });
  // Pre-fill contact details from the signed-in account.
  useEffect(() => {
    if (!user) return;
    if (user.name) setValue('name', user.name);
    if (user.phone) setValue('phone', user.phone);
  }, [user, setValue]);
  const governorate = watch('governorate');
  const payment = watch('payment');
  const wilayats = useMemo(() => getRegion(governorate)?.wilayats ?? [], [governorate]);

  if (!item) return <NotFound />;
  const title = loc(item.title);
  const err = (k?: string) => (k ? t(k as TKey) : undefined);

  if (!valid || !tech) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={<CalendarClock className="size-7" />}
          level={1}
          title={t('confirm.missingDraft')}
          action={<ButtonLink to={`/book/${item.slug}`}>{t('confirm.restart')}</ButtonLink>}
        />
      </div>
    );
  }

  if (live && !loading && !user) {
    const next = encodeURIComponent(`/book/${item.slug}/confirm`);
    return (
      <div className="container-x py-16">
        <Seo title={t('meta.confirm.title', { service: title })} description={t('meta.confirm.description')} noindex />
        <EmptyState
          icon={<User className="size-7" />}
          level={1}
          title={t('confirm.loginTitle')}
          text={t('confirm.loginText')}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <ButtonLink to={`/login?next=${next}`}>{t('nav.login')}</ButtonLink>
              <ButtonLink to={`/signup?next=${next}`} variant="secondary">
                {t('auth.signupLink')}
              </ButtonLink>
            </div>
          }
        />
      </div>
    );
  }

  const onSubmit = async (v: FormValues) => {
    if (!isSlotBookable(tech.id, draft.date!, draft.slot!)) {
      toast(t('book.slotTaken'), 'info');
      navigate(`/book/${item.slug}`);
      return;
    }
    const now = new Date();
    const taken = bookings.map((b) => b.id);
    const base: Omit<Booking, 'id'> = {
      slug: item.slug,
      techId: tech.id,
      date: draft.date!,
      slot: draft.slot!,
      status: 'upcoming',
      total: bookingTotal(item.price).total,
      payment: v.payment,
      customer: {
        name: v.name.trim(),
        phone: normalizeOmaniMobile(v.phone) ?? v.phone,
        governorate: v.governorate,
        wilayat: v.wilayat,
        area: v.area,
        street: v.street ?? '',
        house: v.house,
        landmark: v.landmark ?? '',
        notes: v.notes ?? '',
        device: v.device,
      },
      createdAt: toISODate(now),
    };
    // Retry with a fresh ID in the rare case it is already used by another customer.
    for (let attempt = 0; attempt < 4; attempt++) {
      const id = newBookingId(now, Math.random, taken);
      taken.push(id);
      if (await addBooking({ ...base, id })) {
        setDraft(null);
        track('booking_confirmed', { slug: item.slug, payment: v.payment, total: base.total });
        navigate(`/booking/${id}/success`);
        return;
      }
    }
    toast(t('confirm.saveError'), 'info');
  };

  const errorCount = Object.keys(errors).length;

  return (
    <>
      <Seo title={t('meta.confirm.title', { service: title })} description={t('meta.confirm.description')} noindex />
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { label: t('nav.services'), to: '/services' },
            { label: tl('book.steps')[1], to: `/book/${item.slug}` },
            { label: tl('book.steps')[2] },
          ]}
        />
        <Stepper current={3} />
        <h1 className="mt-6 text-[1.75rem] font-extrabold md:text-[2.25rem]">{t('confirm.title')}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="container-x grid gap-8 py-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 space-y-6">
          <div aria-live="assertive">
            {submitCount > 0 && errorCount > 0 && (
              <p
                className="flex items-center gap-2 rounded-xl border border-danger/40 bg-danger-bg p-3 text-sm font-semibold text-danger"
                role="alert"
              >
                <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
                {t('confirm.errors.summary')}
              </p>
            )}
          </div>

          <fieldset className="card m-0 p-5 md:p-6">
            <legend className="sr-only">{t('confirm.contact')}</legend>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <User className="size-5 text-brand-700" aria-hidden="true" />
              {t('confirm.contact')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label={t('confirm.name')} error={err(errors.name?.message)}>
                <input
                  id="name"
                  className="input"
                  autoComplete="name"
                  placeholder={t('confirm.namePh')}
                  aria-invalid={!!errors.name}
                  aria-describedby={describedBy('name', errors.name?.message)}
                  {...register('name')}
                />
              </Field>
              <Field id="phone" label={t('confirm.phone')} error={err(errors.phone?.message)} hint={t('confirm.phoneHint')}>
                <div className="flex" dir="ltr">
                  <span className="inline-flex items-center rounded-s-xl border-[1.5px] border-e-0 border-line bg-surface-2 px-3 text-sm font-semibold text-muted">
                    +968
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="9XXX XXXX"
                    className="input !rounded-s-none"
                    aria-invalid={!!errors.phone}
                    aria-describedby={describedBy('phone', errors.phone?.message, t('confirm.phoneHint'))}
                    {...register('phone')}
                  />
                </div>
              </Field>
            </div>
          </fieldset>

          <fieldset className="card m-0 p-5 md:p-6">
            <legend className="sr-only">{t('confirm.address')}</legend>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <MapPin className="size-5 text-brand-700" aria-hidden="true" />
              {t('confirm.address')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="governorate" label={t('confirm.governorate')} error={err(errors.governorate?.message)}>
                <select
                  id="governorate"
                  className="input"
                  aria-invalid={!!errors.governorate}
                  aria-describedby={describedBy('governorate', errors.governorate?.message)}
                  {...register('governorate', { onChange: () => setValue('wilayat', '') })}
                >
                  <option value="">{t('confirm.select')}</option>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {loc(r.name)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="wilayat" label={t('confirm.wilayat')} error={err(errors.wilayat?.message)}>
                <select
                  id="wilayat"
                  className="input"
                  disabled={!governorate}
                  aria-invalid={!!errors.wilayat}
                  aria-describedby={describedBy('wilayat', errors.wilayat?.message)}
                  {...register('wilayat')}
                >
                  <option value="">{t('confirm.select')}</option>
                  {wilayats.map((w) => (
                    <option key={w.id} value={w.id}>
                      {loc(w.name)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="area" label={t('confirm.area')} error={err(errors.area?.message)}>
                <input
                  id="area"
                  className="input"
                  autoComplete="address-level3"
                  placeholder={t('confirm.areaPh')}
                  aria-invalid={!!errors.area}
                  aria-describedby={describedBy('area', errors.area?.message)}
                  {...register('area')}
                />
              </Field>
              <Field id="street" label={t('confirm.street')} optional optionalLabel={t('common.optional')}>
                <input id="street" className="input" placeholder={t('confirm.streetPh')} {...register('street')} />
              </Field>
              <Field id="house" label={t('confirm.house')} error={err(errors.house?.message)}>
                <input
                  id="house"
                  className="input"
                  placeholder={t('confirm.housePh')}
                  aria-invalid={!!errors.house}
                  aria-describedby={describedBy('house', errors.house?.message)}
                  {...register('house')}
                />
              </Field>
              <Field id="landmark" label={t('confirm.landmark')} optional optionalLabel={t('common.optional')}>
                <input id="landmark" className="input" placeholder={t('confirm.landmarkPh')} {...register('landmark')} />
              </Field>
              <Field
                id="notes"
                label={t('confirm.notes')}
                optional
                optionalLabel={t('common.optional')}
                className="sm:col-span-2"
              >
                <textarea id="notes" className="input" placeholder={t('confirm.notesPh')} {...register('notes')} />
              </Field>
            </div>
            <fieldset className="m-0 mt-5 border-0 p-0">
              <legend className="field-label">{t('confirm.device')}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {(['own', 'help'] as const).map((d) => (
                  <label
                    key={d}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] border-line p-3 has-[:checked]:border-brand-700 has-[:checked]:bg-brand-100/60"
                  >
                    <input type="radio" value={d} className="check" {...register('device')} />
                    <span className="font-medium">{t(d === 'own' ? 'confirm.deviceOwn' : 'confirm.deviceHelp')}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </fieldset>

          <fieldset className="card m-0 p-5 md:p-6">
            <legend className="sr-only">{t('confirm.payment')}</legend>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Lock className="size-5 text-brand-700" aria-hidden="true" />
              {t('confirm.payment')}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m) => {
                const Icon = m.icon;
                return (
                  <label
                    key={m.id}
                    className="relative flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] border-line p-4 transition-colors has-[:checked]:border-brand-700 has-[:checked]:bg-brand-100/60"
                    data-payment={m.id}
                  >
                    <input type="radio" value={m.id} className="check mt-1" {...register('payment')} />
                    <span className="flex-1">
                      <span className="flex items-center gap-2 font-semibold">
                        <Icon className="size-5 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900" aria-hidden="true" />
                        {t(m.key)}
                      </span>
                      <span
                        className={`mt-1 flex items-center gap-1 text-xs font-medium ${m.online ? 'text-warning' : 'text-muted'}`}
                      >
                        {m.online ? (
                          <>
                            <FlaskConical className="size-3.5" aria-hidden="true" />
                            {t('confirm.demoPayment')}
                          </>
                        ) : (
                          t('confirm.payCashNote')
                        )}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {payment !== 'cash' && (
              <p
                className="mt-3 flex items-center gap-2 rounded-xl bg-warning-bg p-3 text-sm font-medium text-warning"
                role="note"
              >
                <FlaskConical className="size-4 shrink-0" aria-hidden="true" />
                {t('confirm.demoPayment')}
              </p>
            )}
          </fieldset>
          <p className="text-sm text-muted">{live ? t('common.consentLive') : t('common.consent')}</p>
        </div>

        <aside aria-labelledby="sum-h" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-line p-4">
              <ServiceArt slug={item.isPackage ? 'package' : item.slug} className="h-16 w-24 shrink-0 rounded-xl" />
              <div>
                <h2 id="sum-h" className="text-sm font-semibold text-muted">
                  {t('confirm.summary')}
                </h2>
                <p className="font-heading font-bold text-heading">{title}</p>
              </div>
            </div>
            <dl className="space-y-3 border-b border-line p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">{t('confirm.technician')}</dt>
                <dd className="m-0 flex items-center gap-2 font-semibold">
                  <Avatar name={loc(tech.name)} tone={tech.tone} gender={tech.gender} size={28} />
                  {loc(tech.name)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">{t('confirm.appointment')}</dt>
                <dd className="m-0 text-end font-semibold">
                  {formatDate(draft.date!, lang)} · <span dir="ltr">{formatSlot(draft.slot!, lang)}</span>
                </dd>
              </div>
              <div className="text-end">
                <Link to={`/book/${item.slug}`} className="text-xs font-semibold">
                  {t('confirm.edit')}
                </Link>
              </div>
            </dl>
            <div className="p-4">
              <PriceLines price={item.price} />
              <p className="mt-3 text-xs text-muted">{t('common.vatNote')}</p>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="check mt-0.5"
                  aria-invalid={!!errors.terms}
                  aria-describedby={errors.terms ? 'terms-error' : undefined}
                  {...register('terms')}
                />
                <span>
                  {(() => {
                    const [a, rest] = t('confirm.terms').split('{terms}');
                    const [b, c] = (rest ?? '').split('{cancellation}');
                    return (
                      <>
                        {a}
                        <Link to="/terms" target="_blank">
                          {t('confirm.termsLink')}
                        </Link>
                        {b}
                        <Link to="/cancellation-refund" target="_blank">
                          {t('confirm.cancellationLink')}
                        </Link>
                        {c}
                      </>
                    );
                  })()}
                </span>
              </label>
              <div aria-live="polite">
                {errors.terms && (
                  <p id="terms-error" className="field-error">
                    <AlertCircle className="size-4" aria-hidden="true" />
                    {t('confirm.errors.terms')}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg mt-5 w-full"
                disabled={isSubmitting}
                data-testid="confirm-booking"
              >
                <CheckCircle2 className="size-5" aria-hidden="true" />
                {isSubmitting ? t('confirm.submitting') : t('confirm.submit')}
              </button>
              <p className="mt-3 text-center text-xs text-muted">{t('common.cancelNote')}</p>
            </div>
          </div>
        </aside>
      </form>
      <TrustStrip />
    </>
  );
}
