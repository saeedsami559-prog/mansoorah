import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AtSign, Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useI18n, type TKey } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { Field, describedBy } from '../components/ui/Field';
import { Handoff } from '../components/ui/Handoff';
import { PHONE_NUMBER, SOCIAL, SUPPORT_EMAIL, WHATSAPP_NUMBER } from '../config/site';
import { formatOmaniPhone } from '../lib/format';
import { whatsappLink } from '../lib/whatsapp';
import { isValidOmaniMobile } from '../lib/phone';
import { writeJSON } from '../lib/storage';
import { REGIONS } from '../data/regions';
import { track } from '../lib/track';

const schema = z.object({
  name: z.string().trim().min(3, 'auth.errName'),
  phone: z.string().refine(isValidOmaniMobile, 'confirm.errors.phone'),
  email: z.union([z.literal(''), z.string().email('auth.errEmail')]),
  topic: z.string(),
  message: z.string().trim().min(10, 'contact.errMessage'),
});
type Values = z.infer<typeof schema>;

export default function Contact() {
  const { t, tl, loc } = useI18n();
  const topics = tl('contact.topics');
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', email: '', topic: topics[0], message: '' },
  });
  const err = (k?: string) => (k ? t(k as TKey) : undefined);

  const onSubmit = (v: Values) => {
    const msg = t('contact.waMessage', { name: v.name, phone: formatOmaniPhone(v.phone), topic: v.topic, message: v.message });
    writeJSON('contact', { ...v, at: new Date().toISOString() });
    track('contact_form');
    setMessage(msg);
  };

  const channels = [
    {
      icon: MessageCircle,
      title: t('contact.whatsapp'),
      value: formatOmaniPhone(WHATSAPP_NUMBER),
      href: whatsappLink(''),
      ext: true,
      sub: t('contact.whatsappText'),
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      value: formatOmaniPhone(PHONE_NUMBER),
      href: `tel:${PHONE_NUMBER}`,
      ext: false,
      sub: t('contact.hoursText'),
    },
    {
      icon: Mail,
      title: t('contact.email'),
      value: SUPPORT_EMAIL,
      href: `mailto:${SUPPORT_EMAIL}`,
      ext: false,
      sub: t('contact.hoursText'),
    },
  ];

  return (
    <>
      <Seo title={t('meta.contact.title')} description={t('meta.contact.description')} />
      <PageHero title={t('contact.title')} sub={t('contact.sub')} crumbs={[{ label: t('contact.title') }]} />
      <div className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {channels.map((c) => (
            <a
              key={c.title}
              href={c.href}
              {...(c.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="card card-hover flex items-center gap-4 p-5 text-ink no-underline"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900">
                <c.icon className="size-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-muted">{c.title}</span>
                <span className="block font-heading text-lg font-bold" dir="ltr">
                  {c.value}
                </span>
                <span className="block text-sm text-muted">{c.sub}</span>
              </span>
            </a>
          ))}
          <div className="card p-5">
            <p className="flex items-center gap-2 font-bold">
              <Clock className="size-5 text-brand-700" aria-hidden="true" />
              {t('contact.hours')}
            </p>
            <p className="mt-2">{t('contact.hoursText')}</p>
            <p className="text-muted">{t('contact.hoursFri')}</p>
            <p className="mt-4 flex items-center gap-2 font-bold">
              <MapPin className="size-5 text-brand-700" aria-hidden="true" />
              {t('contact.regions')}
            </p>
            <p className="mt-2">{REGIONS.map((r) => loc(r.name)).join(' · ')}</p>
            <p className="mt-4 flex items-center gap-2 font-bold">
              <AtSign className="size-5 text-brand-700" aria-hidden="true" />
              {t('contact.social')}
            </p>
            <ul className="mt-2 grid list-none grid-cols-2 gap-1 p-0 text-sm" dir="ltr">
              <li>Instagram @{SOCIAL.instagram}</li>
              <li>X @{SOCIAL.x}</li>
              <li>TikTok @{SOCIAL.tiktok}</li>
              <li>Snapchat @{SOCIAL.snapchat}</li>
            </ul>
          </div>
        </div>

        <section className="card p-6 md:p-8" aria-labelledby="cf-h">
          <h2 id="cf-h" className="text-xl font-bold">
            {t('contact.formTitle')}
          </h2>
          {message ? (
            <div className="mt-5">
              <Handoff
                title={t('contact.doneTitle')}
                text={t('contact.doneText')}
                message={message}
                subject="Message to Mansoorah"
                from="contact"
              />
            </div>
          ) : (
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Field id="c-name" label={t('contact.name')} error={err(errors.name?.message)}>
                <input
                  id="c-name"
                  className="input"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={describedBy('c-name', errors.name?.message)}
                  {...register('name')}
                />
              </Field>
              <Field id="c-phone" label={t('contact.phoneField')} error={err(errors.phone?.message)}>
                <input
                  id="c-phone"
                  type="tel"
                  dir="ltr"
                  inputMode="numeric"
                  className="input"
                  placeholder="+968 9XXX XXXX"
                  aria-invalid={!!errors.phone}
                  aria-describedby={describedBy('c-phone', errors.phone?.message)}
                  {...register('phone')}
                />
              </Field>
              <Field id="c-email" label={t('contact.emailField')} error={err(errors.email?.message)}>
                <input
                  id="c-email"
                  type="email"
                  dir="ltr"
                  className="input"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy('c-email', errors.email?.message)}
                  {...register('email')}
                />
              </Field>
              <Field id="c-topic" label={t('contact.topic')}>
                <select id="c-topic" className="input" {...register('topic')}>
                  {topics.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="c-message" label={t('contact.message')} error={err(errors.message?.message)} className="sm:col-span-2">
                <textarea
                  id="c-message"
                  className="input"
                  aria-invalid={!!errors.message}
                  aria-describedby={describedBy('c-message', errors.message?.message)}
                  {...register('message')}
                />
              </Field>
              <p className="text-sm text-muted sm:col-span-2">{t('common.consent')}</p>
              <button type="submit" className="btn btn-primary btn-lg sm:col-span-2 sm:w-fit">
                <Send className="flip-rtl size-5" aria-hidden="true" />
                {t('contact.submit')}
              </button>
            </form>
          )}
        </section>
      </div>
    </>
  );
}
