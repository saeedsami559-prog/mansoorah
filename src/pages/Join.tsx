import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  BadgeCheck,
  CalendarCheck2,
  Check,
  CircleDollarSign,
  Crown,
  GraduationCap,
  IdCard,
  Minus,
  Rocket,
  Send,
  ShieldCheck,
  Smartphone,
  Wrench,
  ClipboardCheck,
} from 'lucide-react';
import { useI18n, type TKey } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { Field, describedBy } from '../components/ui/Field';
import { Handoff } from '../components/ui/Handoff';
import { SectionHeading } from '../components/ui/primitives';
import { SERVICES, getService } from '../data/services';
import { REGIONS, getRegion } from '../data/regions';
import { isValidOmaniMobile } from '../lib/phone';
import { writeJSON } from '../lib/storage';
import { RULES } from '../config/site';
import { formatOmaniPhone } from '../lib/format';
import { track } from '../lib/track';

const schema = z.object({
  name: z.string().trim().min(3, 'auth.errName'),
  phone: z.string().refine(isValidOmaniMobile, 'confirm.errors.phone'),
  region: z.string().min(1, 'confirm.errors.governorate'),
  skills: z.array(z.string()).min(1, 'join.errSkills'),
  years: z.coerce
    .number({ invalid_type_error: 'join.errYears' })
    .int('join.errYears')
    .min(0, 'join.errYears')
    .max(50, 'join.errYears'),
  cert: z.string().trim().max(400).optional(),
  omani: z.literal(true, { errorMap: () => ({ message: 'join.errOmani' }) }),
});
type Values = z.infer<typeof schema>;

const BENEFIT_ICONS = [CalendarCheck2, CircleDollarSign, ShieldCheck, Crown];
const REQ_ICONS = [BadgeCheck, IdCard, GraduationCap, Wrench, Smartphone];
const PROCESS_ICONS = [Send, IdCard, ClipboardCheck, GraduationCap, Rocket];

export default function Join() {
  const { t, tl, ta, loc, omr } = useI18n();
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', skills: [], region: '', cert: '' } as Partial<Values>,
  });
  const err = (k?: string) => (k ? t(k as TKey) : undefined);

  const features = tl('join.planFeatures');
  const example = getService('smart-door-lock')!.price;
  const pct = RULES.commissionMax;
  const commission = (example * pct) / 100;

  const onSubmit = (v: Values) => {
    const msg = t('join.waMessage', {
      name: v.name,
      phone: formatOmaniPhone(v.phone),
      region: loc(getRegion(v.region)!.name),
      skills: v.skills.map((s) => loc(getService(s)!.title)).join(', '),
      years: v.years,
      cert: v.cert || '-',
    });
    writeJSON('application', { ...v, at: new Date().toISOString() });
    track('technician_application', { region: v.region, skills: v.skills.length });
    setMessage(msg);
  };

  return (
    <>
      <Seo title={t('meta.join.title')} description={t('meta.join.description')} />
      <PageHero title={t('join.title')} sub={t('join.sub')} crumbs={[{ label: t('home.callouts.techCta') }]}>
        <a href="#apply" className="btn btn-white btn-lg mt-8">
          {t('join.cta')}
        </a>
      </PageHero>

      <section className="section" aria-labelledby="ben-h">
        <div className="container-x">
          <SectionHeading id="ben-h" title={t('join.benefitsTitle')} />
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {ta('join.benefits').map((b, i) => {
              const Icon = BENEFIT_ICONS[i];
              return (
                <li key={b.title} className="card p-6">
                  <Icon className="size-8 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
                  <p className="mt-2 text-muted">{b.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-surface py-16" aria-labelledby="req-h">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="req-h" className="mb-6 text-2xl font-extrabold">
              {t('join.reqTitle')}
            </h2>
            <ul className="m-0 list-none space-y-3 p-0">
              {tl('join.requirements').map((r, i) => {
                const Icon = REQ_ICONS[i];
                return (
                  <li key={r} className="card flex items-center gap-3 p-4">
                    <Icon
                      className="size-6 shrink-0 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900"
                      aria-hidden="true"
                    />
                    <span className="font-medium">{r}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-2xl font-extrabold">{t('join.processTitle')}</h2>
            <ol className="relative m-0 list-none space-y-6 p-0">
              <span className="absolute start-5 top-2 bottom-2 w-0.5 bg-line" aria-hidden="true" />
              {ta('join.process').map((p, i) => {
                const Icon = PROCESS_ICONS[i];
                return (
                  <li key={p.title} className="relative flex gap-4">
                    <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-brand-700 text-white ring-4 ring-surface">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-bold">
                        {i + 1}. {p.title}
                      </h3>
                      <p className="text-muted">{p.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="plans-h">
        <div className="container-x">
          <SectionHeading id="plans-h" center title={t('join.plansTitle')} />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {[
              { name: t('join.free'), price: t('join.freePrice'), included: [0, 1, 2], pro: false },
              { name: t('join.proName'), price: omr(RULES.proPlanPrice), included: [0, 1, 2, 3, 4, 5], pro: true },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`card relative p-7 ${plan.pro ? 'border-2 !border-gold shadow-[var(--shadow-lg)]' : ''}`}
              >
                {plan.pro && (
                  <span className="absolute -top-3 start-6 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-[#0B2C6E]">
                    <Crown className="size-3.5" aria-hidden="true" />
                    {t('common.pro')}
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-2">
                  <span className="font-heading text-4xl font-extrabold text-heading">{plan.price}</span>{' '}
                  <span className="text-muted">{t('join.perMonth')}</span>
                </p>
                <ul className="mt-6 list-none space-y-3 p-0">
                  {features.map((f, i) => {
                    const yes = plan.included.includes(i);
                    return (
                      <li key={f} className={`flex items-center gap-2 ${yes ? '' : 'text-muted'}`}>
                        {yes ? (
                          <Check className="size-5 text-success" aria-hidden="true" />
                        ) : (
                          <Minus className="size-5" aria-hidden="true" />
                        )}
                        <span>{f}</span>
                        <span className="sr-only">– {yes ? t('join.included') : t('join.notIncluded')}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="card mx-auto mt-10 max-w-4xl p-7" aria-labelledby="earn-h">
            <h3 id="earn-h" className="text-xl font-bold">
              {t('join.earningsTitle')}
            </h3>
            <p className="mt-2 text-muted">{t('join.earningsText')}</p>
            <div className="mt-5 rounded-2xl bg-surface-2 p-5">
              <p className="font-semibold">{t('join.example', { price: omr(example) })}</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">{t('book.servicePrice')}</dt>
                  <dd className="m-0 font-semibold">{omr(example)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">{t('join.commission', { pct })}</dt>
                  <dd className="m-0 font-semibold">− {omr(commission)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-base">
                  <dt className="font-bold">{t('join.youEarn')}</dt>
                  <dd className="m-0 font-heading text-xl font-extrabold text-success-ink">{omr(example - commission)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="bg-surface py-16" aria-labelledby="apply-h">
        <div className="container-x max-w-3xl">
          <h2 id="apply-h" className="text-2xl font-extrabold">
            {t('join.formTitle')}
          </h2>
          <p className="mt-2 text-muted">{t('join.formSub')}</p>
          {message ? (
            <div className="mt-6">
              <Handoff
                title={t('join.doneTitle')}
                text={t('join.doneText')}
                message={message}
                subject="Technician application"
                from="join"
              />
            </div>
          ) : (
            <form className="card mt-6 grid gap-4 p-6 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Field id="j-name" label={t('join.name')} error={err(errors.name?.message)}>
                <input
                  id="j-name"
                  className="input"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={describedBy('j-name', errors.name?.message)}
                  {...register('name')}
                />
              </Field>
              <Field id="j-phone" label={t('join.phone')} error={err(errors.phone?.message)} hint={t('confirm.phoneHint')}>
                <input
                  id="j-phone"
                  type="tel"
                  inputMode="numeric"
                  dir="ltr"
                  className="input"
                  placeholder="+968 9XXX XXXX"
                  aria-invalid={!!errors.phone}
                  aria-describedby={describedBy('j-phone', errors.phone?.message, 'x')}
                  {...register('phone')}
                />
              </Field>
              <Field id="j-region" label={t('join.region')} error={err(errors.region?.message)}>
                <select
                  id="j-region"
                  className="input"
                  aria-invalid={!!errors.region}
                  aria-describedby={describedBy('j-region', errors.region?.message)}
                  {...register('region')}
                >
                  <option value="">{t('confirm.select')}</option>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {loc(r.name)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="j-years" label={t('join.experience')} error={err(errors.years?.message)}>
                <input
                  id="j-years"
                  type="number"
                  min={0}
                  max={50}
                  inputMode="numeric"
                  className="input"
                  aria-invalid={!!errors.years}
                  aria-describedby={describedBy('j-years', errors.years?.message)}
                  {...register('years')}
                />
              </Field>
              <fieldset
                className="m-0 border-0 p-0 sm:col-span-2"
                aria-describedby={errors.skills ? 'j-skills-error' : undefined}
              >
                <legend className="field-label">{t('join.skills')}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SERVICES.map((s) => (
                    <label
                      key={s.slug}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-line p-2.5 text-sm has-[:checked]:border-brand-700 has-[:checked]:bg-brand-100/60"
                    >
                      <input type="checkbox" value={s.slug} className="check" {...register('skills')} />
                      {loc(s.title)}
                    </label>
                  ))}
                </div>
                <div aria-live="polite">
                  {errors.skills && (
                    <p id="j-skills-error" className="field-error">
                      <AlertCircle className="size-4" aria-hidden="true" />
                      {t('join.errSkills')}
                    </p>
                  )}
                </div>
              </fieldset>
              <Field
                id="j-cert"
                label={t('join.certificate')}
                optional
                optionalLabel={t('common.optional')}
                className="sm:col-span-2"
              >
                <textarea id="j-cert" className="input" placeholder={t('join.certificatePh')} {...register('cert')} />
              </Field>
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="check mt-0.5"
                    aria-invalid={!!errors.omani}
                    aria-describedby={errors.omani ? 'j-omani-error' : undefined}
                    {...register('omani')}
                  />
                  <span>{t('join.omani')}</span>
                </label>
                <div aria-live="polite">
                  {errors.omani && (
                    <p id="j-omani-error" className="field-error">
                      <AlertCircle className="size-4" aria-hidden="true" />
                      {t('join.errOmani')}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted sm:col-span-2">{t('common.consent')}</p>
              <button type="submit" className="btn btn-primary btn-lg sm:col-span-2 sm:w-fit">
                <Send className="flip-rtl size-5" aria-hidden="true" />
                {t('join.submit')}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
