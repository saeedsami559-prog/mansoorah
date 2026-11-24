import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CheckCircle2, Mail, Send } from 'lucide-react';
import { useI18n, type TKey } from '../../i18n';
import { Seo } from '../../components/layout/Seo';
import { Field, describedBy } from '../../components/ui/Field';
import { AuthLayout } from './AuthLayout';

const schema = z.object({ email: z.string().trim().email('auth.errEmail') });
type Values = z.infer<typeof schema>;

export default function ForgotPassword() {
  const { t } = useI18n();
  const [sent, setSent] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '' } });
  const err = (k?: string) => (k ? t(k as TKey) : undefined);
  return (
    <>
      <Seo title={t('meta.forgot.title')} description={t('meta.forgot.description')} noindex />
      <AuthLayout title={t('auth.forgotTitle')} text={t('auth.forgotText')} crumb={t('auth.forgotTitle')}>
        <h1 className="text-[1.75rem] font-extrabold">{t('auth.forgotTitle')}</h1>
        <p className="mt-1 text-muted">{t('auth.forgotText')}</p>
        <div aria-live="polite">
          {sent && (
            <p className="mt-6 flex items-start gap-2 rounded-xl bg-success-bg p-4 text-sm font-medium text-success-ink">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              {t('auth.resetSent', { email: sent })}
            </p>
          )}
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit((v) => setSent(v.email))} noValidate>
          <Field id="f-email" label={t('auth.email')} error={err(errors.email?.message)}>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="f-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                placeholder={t('auth.emailPh')}
                className="input !ps-11"
                aria-invalid={!!errors.email}
                aria-describedby={describedBy('f-email', errors.email?.message)}
                {...register('email')}
              />
            </div>
          </Field>
          <button type="submit" className="btn btn-primary btn-lg w-full">
            <Send className="flip-rtl size-5" aria-hidden="true" />
            {t('auth.submitForgot')}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="inline-flex items-center gap-1 font-semibold">
            <ArrowLeft className="flip-rtl size-4" aria-hidden="true" />
            {t('auth.backToLogin')}
          </Link>
        </p>
        <p className="mt-4 text-center text-sm">
          {t('auth.noAccount')}{' '}
          <Link to="/signup" className="font-semibold">
            {t('auth.signupLink')}
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
