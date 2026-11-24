import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, CheckCircle2, Plus, Send, Store } from 'lucide-react';
import { useI18n, type TKey } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { Field, describedBy } from '../components/ui/Field';
import { Handoff } from '../components/ui/Handoff';
import { QrCode } from '../components/ui/QrCode';
import { Mark } from '../components/ui/Logo';
import { REGIONS, getRegion } from '../data/regions';
import { isValidOmaniMobile } from '../lib/phone';
import { writeJSON } from '../lib/storage';
import { formatOmaniPhone } from '../lib/format';
import { SITE_URL } from '../config/site';
import { track } from '../lib/track';

const schema = z.object({
  company: z.string().trim().min(2, 'partners.errCompany'),
  name: z.string().trim().min(3, 'auth.errName'),
  phone: z.string().refine(isValidOmaniMobile, 'confirm.errors.phone'),
  email: z.union([z.literal(''), z.string().email('partners.errEmail')]),
  region: z.string().min(1, 'confirm.errors.governorate'),
  count: z.string().trim().optional(),
  message: z.string().trim().max(600).optional(),
});
type Values = z.infer<typeof schema>;

function PartnerForm({ kind }: { kind: 'retail' | 'landlord' }) {
  const { t, loc } = useI18n();
  const [message, setMessage] = useState<string | null>(null);
  const p = kind === 'retail' ? 'pr' : 'pl';
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { company: '', name: '', phone: '', email: '', region: '', count: '', message: '' },
  });
  const err = (k?: string) => (k ? t(k as TKey) : undefined);
  const onSubmit = (v: Values) => {
    const msg = t(kind === 'retail' ? 'partners.waRetail' : 'partners.waLandlord', {
      company: v.company,
      name: v.name,
      phone: formatOmaniPhone(v.phone),
      region: loc(getRegion(v.region)!.name),
      count: v.count || '-',
      message: v.message || '-',
    });
    writeJSON(`partner-${kind}`, { ...v, at: new Date().toISOString() });
    track('partner_request', { kind });
    setMessage(msg);
  };
  if (message)
    return (
      <Handoff
        title={t('partners.doneTitle')}
        text={t('partners.doneText')}
        message={message}
        subject={kind === 'retail' ? 'Retail partner request' : 'Property partner request'}
        from={`partners-${kind}`}
      />
    );
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={t(kind === 'retail' ? 'partners.formRetail' : 'partners.formLandlord')}
    >
      <Field id={`${p}-company`} label={t('partners.company')} error={err(errors.company?.message)}>
        <input
          id={`${p}-company`}
          className="input"
          autoComplete="organization"
          aria-invalid={!!errors.company}
          aria-describedby={describedBy(`${p}-company`, errors.company?.message)}
          {...register('company')}
        />
      </Field>
      <Field id={`${p}-name`} label={t('partners.contactName')} error={err(errors.name?.message)}>
        <input
          id={`${p}-name`}
          className="input"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy(`${p}-name`, errors.name?.message)}
          {...register('name')}
        />
      </Field>
      <Field id={`${p}-phone`} label={t('partners.phone')} error={err(errors.phone?.message)}>
        <input
          id={`${p}-phone`}
          type="tel"
          dir="ltr"
          inputMode="numeric"
          className="input"
          placeholder="+968 9XXX XXXX"
          aria-invalid={!!errors.phone}
          aria-describedby={describedBy(`${p}-phone`, errors.phone?.message)}
          {...register('phone')}
        />
      </Field>
      <Field
        id={`${p}-email`}
        label={t('partners.email')}
        error={err(errors.email?.message)}
        optional
        optionalLabel={t('common.optional')}
      >
        <input
          id={`${p}-email`}
          type="email"
          dir="ltr"
          className="input"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={describedBy(`${p}-email`, errors.email?.message)}
          {...register('email')}
        />
      </Field>
      <Field id={`${p}-region`} label={t('partners.region')} error={err(errors.region?.message)}>
        <select
          id={`${p}-region`}
          className="input"
          aria-invalid={!!errors.region}
          aria-describedby={describedBy(`${p}-region`, errors.region?.message)}
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
      <Field
        id={`${p}-count`}
        label={t(kind === 'retail' ? 'partners.branches' : 'partners.units')}
        optional
        optionalLabel={t('common.optional')}
      >
        <input id={`${p}-count`} type="number" min={1} inputMode="numeric" className="input" {...register('count')} />
      </Field>
      <Field
        id={`${p}-message`}
        label={t('partners.message')}
        optional
        optionalLabel={t('common.optional')}
        className="sm:col-span-2"
      >
        <textarea id={`${p}-message`} className="input" {...register('message')} />
      </Field>
      <p className="text-sm text-muted sm:col-span-2">{t('common.consent')}</p>
      <button type="submit" className="btn btn-primary sm:col-span-2 sm:w-fit">
        <Send className="flip-rtl size-4" aria-hidden="true" />
        {t('partners.submit')}
      </button>
    </form>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="m-0 mt-5 list-none space-y-2.5 p-0">
      {items.map((x) => (
        <li key={x} className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
          {x}
        </li>
      ))}
    </ul>
  );
}

export default function Partners() {
  const { t, tl } = useI18n();
  return (
    <>
      <Seo title={t('meta.partners.title')} description={t('meta.partners.description')} />
      <PageHero title={t('partners.title')} sub={t('partners.sub')} crumbs={[{ label: t('home.callouts.partnerCta') }]} />

      <section className="section" aria-labelledby="retail-h">
        <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="grid size-14 place-items-center rounded-2xl bg-brand-700 text-white">
              <Store className="size-7" aria-hidden="true" />
            </span>
            <h2 id="retail-h" className="mt-4 text-[1.75rem] font-extrabold">
              {t('partners.retailTitle')}
            </h2>
            <p className="mt-3 text-lg text-muted">{t('partners.retailText')}</p>
            <Points items={tl('partners.retailPoints')} />
            <div className="card mt-8 p-6">
              <h3 className="mb-4 text-lg font-bold">{t('partners.formRetail')}</h3>
              <PartnerForm kind="retail" />
            </div>
          </div>
          <div className="space-y-6">
            <figure
              className="m-0 mx-auto max-w-sm overflow-hidden rounded-[24px] border border-line bg-surface shadow-[var(--shadow-lg)]"
              data-qr-card
            >
              <div className="flex items-center gap-3 bg-gradient-to-br from-[#0B2C6E] to-[#1C5AA6] p-5 text-white">
                <Mark size={44} />
                <div>
                  <p className="font-heading text-xl font-extrabold">{t('partners.qrTitle')}</p>
                  <p className="text-sm text-white/85">{t('partners.qrText')}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 p-6">
                <div className="rounded-2xl border border-line p-2">
                  <QrCode value={`${SITE_URL}/services`} label={t('partners.qrText')} />
                </div>
                <p className="font-heading text-lg font-bold text-[#D4A84B]">{t('brand.closing')}</p>
              </div>
              <figcaption className="border-t border-line bg-surface-2 px-5 py-3 text-center text-xs text-muted">
                {t('partners.qrNote')}
              </figcaption>
            </figure>
            <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
              {[0, 1].map((i) => (
                <a
                  key={i}
                  href="#retail-h"
                  className="flex flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-line p-4 text-center text-muted no-underline hover:border-brand-500 hover:text-brand-700"
                >
                  <Plus className="size-6" aria-hidden="true" />
                  <span className="font-semibold text-ink">{t('partners.placeholderTitle')}</span>
                  <span className="text-xs">{t('partners.placeholderText')}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16" aria-labelledby="land-h">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="grid size-14 place-items-center rounded-2xl bg-gold text-[#0B2C6E]">
              <Building2 className="size-7" aria-hidden="true" />
            </span>
            <h2 id="land-h" className="mt-4 text-[1.75rem] font-extrabold">
              {t('partners.landlordTitle')}
            </h2>
            <p className="mt-3 text-lg text-muted">{t('partners.landlordText')}</p>
            <Points items={tl('partners.landlordPoints')} />
          </div>
          <div className="card p-6">
            <h3 className="mb-4 text-lg font-bold">{t('partners.formLandlord')}</h3>
            <PartnerForm kind="landlord" />
          </div>
        </div>
      </section>
    </>
  );
}
