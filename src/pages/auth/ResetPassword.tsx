import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, KeyRound } from 'lucide-react';
import { useI18n, type TKey } from '../../i18n';
import { Seo } from '../../components/layout/Seo';
import { Field, describedBy } from '../../components/ui/Field';
import { useToast } from '../../components/ui/Toast';
import { AuthLayout } from './AuthLayout';
import { PasswordInput } from './PasswordInput';
import { useAuth } from '../../components/auth/AuthContext';
import { getSupabase } from '../../lib/supabase';
import { AUTH_ERROR_KEY } from './shared';

const schema = z
  .object({ password: z.string().min(8, 'auth.errPassword'), confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'auth.errMatch' });
type Values = z.infer<typeof schema>;

/** Landing page of the "reset password" e-mail link (Supabase signs the visitor in with a recovery session). */
export default function ResetPassword() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const { updatePassword } = useAuth();
  const [ready, setReady] = useState<boolean | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { password: '', confirm: '' } });
  const err = (k?: string) => (k ? t(k as TKey) : undefined);

  useEffect(() => {
    getSupabase().then(async (sb) => {
      if (!sb) return setReady(false);
      // Give supabase-js a moment to read the recovery token from the URL.
      for (let i = 0; i < 10; i++) {
        const { data } = await sb.auth.getSession();
        if (data.session) return setReady(true);
        await new Promise((r) => setTimeout(r, 300));
      }
      setReady(false);
    });
  }, []);

  const onSubmit = async (v: Values) => {
    setFormError(null);
    const res = await updatePassword(v.password);
    if (!res.ok) return setFormError(t(AUTH_ERROR_KEY[res.error]));
    toast(t('auth.passwordUpdated'));
    navigate('/bookings');
  };

  return (
    <>
      <Seo title={t('meta.reset.title')} description={t('meta.reset.description')} noindex />
      <AuthLayout title={t('auth.newPasswordTitle')} text={t('auth.newPasswordText')} crumb={t('auth.newPasswordTitle')}>
        <h1 className="text-[1.75rem] font-extrabold">{t('auth.newPasswordTitle')}</h1>
        <p className="mt-1 text-muted">{t('auth.newPasswordText')}</p>
        {ready === null && <p className="mt-6 text-muted">{t('common.loading')}</p>}
        {ready === false && (
          <div className="mt-6 rounded-2xl border border-warning/30 bg-warning-bg p-4 text-warning" role="alert">
            <p className="font-semibold">{t('auth.resetInvalid')}</p>
            <Link to="/forgot-password" className="btn btn-secondary btn-sm mt-3">
              {t('auth.submitForgot')}
            </Link>
          </div>
        )}
        {ready && (
          <>
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
              <Field id="r-password" label={t('auth.password')} error={err(errors.password?.message)}>
                <PasswordInput
                  id="r-password"
                  autoComplete="new-password"
                  placeholder={t('auth.passwordPh')}
                  aria-invalid={!!errors.password}
                  aria-describedby={describedBy('r-password', errors.password?.message)}
                  {...register('password')}
                />
              </Field>
              <Field id="r-confirm" label={t('auth.confirmPassword')} error={err(errors.confirm?.message)}>
                <PasswordInput
                  id="r-confirm"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirm}
                  aria-describedby={describedBy('r-confirm', errors.confirm?.message)}
                  {...register('confirm')}
                />
              </Field>
              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isSubmitting}>
                <KeyRound className="size-5" aria-hidden="true" />
                {t('auth.saveNewPassword')}
              </button>
            </form>
          </>
        )}
      </AuthLayout>
    </>
  );
}
