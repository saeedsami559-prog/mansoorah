import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HardHat, Home as HomeIcon, Mail, Phone, User, UserPlus } from 'lucide-react';
import { useI18n, type TKey } from '../../i18n';
import { Seo } from '../../components/layout/Seo';
import { Field, describedBy } from '../../components/ui/Field';
import { useToast } from '../../components/ui/Toast';
import { AuthLayout, Divider, GoogleButton } from './AuthLayout';
import { PasswordInput } from './PasswordInput';
import { saveUser, sha256 } from '../../lib/auth';
import { isValidOmaniMobile } from '../../lib/phone';
import { track } from '../../lib/track';

const schema = z
  .object({
    name: z.string().trim().min(3, 'auth.errName'),
    email: z.string().trim().email('auth.errEmail'),
    phone: z.string().refine(isValidOmaniMobile, 'confirm.errors.phone'),
    password: z.string().min(8, 'auth.errPassword'),
    confirm: z.string(),
    role: z.enum(['customer', 'technician']),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'auth.errMatch' });
type Values = z.infer<typeof schema>;

export default function Signup() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer', name: '', email: '', phone: '', password: '', confirm: '' },
  });
  const err = (k?: string) => (k ? t(k as TKey) : undefined);

  const onSubmit = async (v: Values) => {
    saveUser({ name: v.name.trim(), role: v.role, emailHash: await sha256(v.email) });
    track('signup_demo', { role: v.role });
    toast(t('auth.signedUp', { name: v.name.trim().split(' ')[0] }));
    navigate(v.role === 'technician' ? '/join' : '/services');
  };

  const iconInput = (Icon: typeof Mail) => (
    <Icon className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
  );

  return (
    <>
      <Seo title={t('meta.signup.title')} description={t('meta.signup.description')} noindex />
      <AuthLayout title={t('auth.joinTitle')} text={t('auth.joinText')} crumb={t('auth.signupTitle')}>
        <h1 className="text-[1.75rem] font-extrabold">{t('auth.signupTitle')}</h1>
        <p className="mt-1 text-muted">{t('auth.joinText')}</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <fieldset className="m-0 border-0 p-0">
            <legend className="field-label">{t('auth.role')}</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['customer', 'technician'] as const).map((r) => (
                <label
                  key={r}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-line p-3 font-semibold has-[:checked]:border-brand-700 has-[:checked]:bg-brand-100/60 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand-500"
                >
                  <input type="radio" value={r} className="sr-only" {...register('role')} />
                  {r === 'customer' ? (
                    <HomeIcon className="size-5" aria-hidden="true" />
                  ) : (
                    <HardHat className="size-5" aria-hidden="true" />
                  )}
                  {t(r === 'customer' ? 'auth.customer' : 'auth.technician')}
                </label>
              ))}
            </div>
          </fieldset>
          <Field id="s-name" label={t('auth.fullName')} error={err(errors.name?.message)}>
            <div className="relative">
              {iconInput(User)}
              <input
                id="s-name"
                autoComplete="name"
                className="input !ps-11"
                aria-invalid={!!errors.name}
                aria-describedby={describedBy('s-name', errors.name?.message)}
                {...register('name')}
              />
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="s-email" label={t('auth.email')} error={err(errors.email?.message)}>
              <div className="relative">
                {iconInput(Mail)}
                <input
                  id="s-email"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  placeholder={t('auth.emailPh')}
                  className="input !ps-11"
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy('s-email', errors.email?.message)}
                  {...register('email')}
                />
              </div>
            </Field>
            <Field id="s-phone" label={t('auth.mobile')} error={err(errors.phone?.message)}>
              <div className="relative">
                {iconInput(Phone)}
                <input
                  id="s-phone"
                  type="tel"
                  dir="ltr"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="+968 9XXX XXXX"
                  className="input !ps-11"
                  aria-invalid={!!errors.phone}
                  aria-describedby={describedBy('s-phone', errors.phone?.message)}
                  {...register('phone')}
                />
              </div>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="s-password" label={t('auth.password')} error={err(errors.password?.message)}>
              <PasswordInput
                id="s-password"
                autoComplete="new-password"
                placeholder={t('auth.passwordPh')}
                aria-invalid={!!errors.password}
                aria-describedby={describedBy('s-password', errors.password?.message)}
                {...register('password')}
              />
            </Field>
            <Field id="s-confirm" label={t('auth.confirmPassword')} error={err(errors.confirm?.message)}>
              <PasswordInput
                id="s-confirm"
                autoComplete="new-password"
                aria-invalid={!!errors.confirm}
                aria-describedby={describedBy('s-confirm', errors.confirm?.message)}
                {...register('confirm')}
              />
            </Field>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isSubmitting}>
            <UserPlus className="size-5" aria-hidden="true" />
            {t('auth.submitSignup')}
          </button>
        </form>
        <Divider />
        <GoogleButton />
        <p className="mt-6 text-center text-sm">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-semibold">
            {t('auth.loginLink')}
          </Link>
        </p>
        <p className="mt-4 rounded-xl bg-surface-2 p-3 text-xs text-muted">{t('auth.demoNote')}</p>
      </AuthLayout>
    </>
  );
}
