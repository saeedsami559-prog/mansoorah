import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, LogIn, Mail } from 'lucide-react';
import { useI18n, type TKey } from '../../i18n';
import { Seo } from '../../components/layout/Seo';
import { Field, describedBy } from '../../components/ui/Field';
import { useToast } from '../../components/ui/Toast';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../components/auth/AuthContext';
import { AUTH_ERROR_KEY, safeNext } from './shared';
import { PasswordInput } from './PasswordInput';
import { track } from '../../lib/track';

const schema = z.object({
  email: z.string().trim().email('auth.errEmail'),
  password: z.string().min(8, 'auth.errPassword'),
  remember: z.boolean().optional(),
});
type Values = z.infer<typeof schema>;

export default function Login() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const { signIn, live } = useAuth();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'), '/bookings');
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });
  const err = (k?: string) => (k ? t(k as TKey) : undefined);

  const onSubmit = async (v: Values) => {
    setFormError(null);
    const res = await signIn(v.email, v.password);
    if (!res.ok) {
      setFormError(t(AUTH_ERROR_KEY[res.error]));
      return;
    }
    track('login', { live });
    toast(t('auth.welcomeBackName', { name: v.email.split('@')[0] }));
    navigate(next);
  };

  return (
    <>
      <Seo title={t('meta.login.title')} description={t('meta.login.description')} noindex />
      <AuthLayout title={t('auth.welcomeBack')} text={t('auth.welcomeText')} crumb={t('auth.loginTitle')}>
        <h1 className="text-[1.75rem] font-extrabold">{t('auth.loginTitle')}</h1>
        <p className="mt-1 text-muted">{t('auth.welcomeText')}</p>
        <div aria-live="assertive">
          {formError && (
            <p
              role="alert"
              className="mt-5 flex items-center gap-2 rounded-xl border border-danger/40 bg-danger-bg p-3 text-sm font-semibold text-danger"
            >
              <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
              {formError}
            </p>
          )}
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field id="l-email" label={t('auth.email')} error={err(errors.email?.message)}>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="l-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                placeholder={t('auth.emailPh')}
                className="input !ps-11"
                aria-invalid={!!errors.email}
                aria-describedby={describedBy('l-email', errors.email?.message)}
                {...register('email')}
              />
            </div>
          </Field>
          <Field id="l-password" label={t('auth.password')} error={err(errors.password?.message)}>
            <PasswordInput
              id="l-password"
              autoComplete="current-password"
              placeholder={t('auth.passwordPh')}
              aria-invalid={!!errors.password}
              aria-describedby={describedBy('l-password', errors.password?.message)}
              {...register('password')}
            />
          </Field>
          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" className="check" {...register('remember')} />
              {t('auth.remember')}
            </label>
            <Link to="/forgot-password" className="font-semibold">
              {t('auth.forgot')}
            </Link>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isSubmitting}>
            <LogIn className="flip-rtl size-5" aria-hidden="true" />
            {t('auth.submitLogin')}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          {t('auth.noAccount')}{' '}
          <Link to={`/signup${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold">
            {t('auth.signupLink')}
          </Link>
        </p>
        <p className="mt-4 rounded-xl bg-surface-2 p-3 text-xs text-muted">{live ? t('auth.liveNote') : t('auth.demoNote')}</p>
      </AuthLayout>
    </>
  );
}
