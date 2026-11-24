import { useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Circle, ListChecks, PartyPopper, Star } from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { ButtonLink, EmptyState } from '../components/ui/primitives';
import { Avatar } from '../components/technician/Avatar';
import { ServiceArt } from '../components/service/ServiceArt';
import { useBooking } from '../components/booking/BookingContext';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../components/auth/AuthContext';
import { getBookable, SERVICES } from '../data/services';
import { getTechnician } from '../data/technicians';
import { formatDate } from '../lib/format';
import { toISODate } from '../lib/dates';
import { track } from '../lib/track';

export default function RateService() {
  const { bookingId } = useParams();
  const { t, tl, loc, lang } = useI18n();
  const { getBooking, updateBooking, syncing } = useBooking();
  const toast = useToast();
  const { live, user, loading } = useAuth();
  const booking = getBooking(bookingId);
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  const header = (
    <PageHero
      title={t('rate.title')}
      sub={t('rate.sub')}
      crumbs={[{ label: t('nav.bookings'), to: '/bookings' }, { label: t('rate.title') }]}
      compact
    />
  );
  const seo = <Seo title={t('meta.rate.title')} description={t('meta.rate.description')} noindex />;

  if (live && (loading || syncing)) {
    return (
      <>
        {seo}
        {header}
        <p className="container-x py-12 text-center text-muted" role="status">
          {t('common.loading')}
        </p>
      </>
    );
  }
  if (live && !user) {
    return (
      <>
        {seo}
        {header}
        <div className="container-x py-12">
          <EmptyState
            icon={<ListChecks className="size-7" />}
            title={t('bookings.loginTitle')}
            text={t('bookings.loginText')}
            action={<ButtonLink to={`/login?next=${encodeURIComponent(`/rate/${bookingId}`)}`}>{t('nav.login')}</ButtonLink>}
          />
        </div>
      </>
    );
  }
  if (!booking || booking.status !== 'completed') {
    return (
      <>
        {seo}
        {header}
        <div className="container-x py-12">
          <EmptyState
            icon={<ListChecks className="size-7" />}
            title={!booking ? t('rate.notFound') : t('rate.notCompleted')}
            action={<ButtonLink to="/bookings">{t('nav.bookings')}</ButtonLink>}
          />
        </div>
      </>
    );
  }

  const item = getBookable(booking.slug)!;
  const tech = getTechnician(booking.techId)!;
  const labels = tl('rate.starLabels');
  const tagList = tl('rate.tags');
  const shown = hover || stars;
  const suggestion = SERVICES.find((s) => s.slug !== booking.slug && tech.skills.includes(s.slug)) ?? SERVICES[0];

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stars) {
      setError(true);
      document.getElementById('star-1')?.focus();
      return;
    }
    if (!(await updateBooking(booking.id, { rating: { stars, tags, text: text.trim(), at: toISODate(new Date()) } }))) {
      toast(t('bookings.updateError'), 'info');
      return;
    }
    track('rating_submitted', { stars });
    setDone(true);
  };

  const progress = tl('rate.steps');

  return (
    <>
      {seo}
      {header}
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        <aside aria-labelledby="prog-h" className="card h-fit p-5">
          <h2
            id="prog-h"
            className="mb-4 text-sm font-bold tracking-wide text-muted uppercase [:root[dir=rtl]_&]:tracking-normal"
          >
            {t('rate.progress')}
          </h2>
          <ol className="relative m-0 list-none space-y-5 p-0">
            {progress.map((label, i) => {
              const last = i === progress.length - 1;
              const complete = !last || done;
              return (
                <li key={label} className="relative flex items-center gap-3" aria-current={last && !done ? 'step' : undefined}>
                  {i < progress.length - 1 && (
                    <span className="absolute start-[11px] top-7 h-5 w-0.5 bg-success" aria-hidden="true" />
                  )}
                  {complete ? (
                    <CheckCircle2 className="size-6 shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <Circle className="size-6 shrink-0 fill-brand-700 text-brand-700" aria-hidden="true" />
                  )}
                  <span
                    className={`font-semibold ${last && !done ? 'text-brand-700 [:root[data-theme=dark]_&]:text-brand-900' : ''}`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </aside>

        <div className="space-y-6">
          <p className="flex items-center gap-2 rounded-2xl border border-success/30 bg-success-bg p-4 font-semibold text-success-ink">
            <CheckCircle2 className="size-5" aria-hidden="true" />
            {t('rate.completed')} · {t('rate.completedOn', { date: formatDate(booking.completedAt ?? booking.date, lang) })}
          </p>
          <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <ServiceArt slug={item.isPackage ? 'package' : item.slug} className="h-24 w-full rounded-xl sm:w-36" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted" dir="ltr">
                {booking.id}
              </p>
              <h2 className="text-lg font-bold">{loc(item.title)}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm">
                <Avatar name={loc(tech.name)} tone={tech.tone} gender={tech.gender} size={32} />
                <span className="font-semibold">{loc(tech.name)}</span>
              </p>
            </div>
          </div>

          {done || booking.rating ? (
            <section className="card p-8 text-center" aria-live="polite">
              <PartyPopper className="mx-auto size-12 text-gold" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-extrabold">{done ? t('rate.thanksTitle') : t('rate.already')}</h2>
              <p className="mx-auto mt-2 max-w-md text-muted">{t('rate.thanksText')}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <ButtonLink to={`/services/${suggestion.slug}`}>{t('rate.again')}</ButtonLink>
                <ButtonLink to="/bookings" variant="secondary">
                  {t('nav.bookings')}
                </ButtonLink>
              </div>
              <p className="mt-4 text-sm text-muted">{loc(suggestion.title)}</p>
            </section>
          ) : (
            <form onSubmit={submit} className="card space-y-6 p-5 md:p-7" noValidate>
              <fieldset className="m-0 border-0 p-0">
                <legend className="field-label !text-lg">{t('rate.starsLegend')}</legend>
                <div className="flex flex-wrap items-center gap-4">
                  <div
                    className="flex gap-1"
                    role="radiogroup"
                    aria-label={t('rate.starsLegend')}
                    onMouseLeave={() => setHover(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        id={`star-${n}`}
                        type="button"
                        role="radio"
                        aria-checked={stars === n}
                        aria-label={`${t('rate.star', { n })} – ${labels[n - 1]}`}
                        tabIndex={stars === n || (stars === 0 && n === 1) ? 0 : -1}
                        onMouseEnter={() => setHover(n)}
                        onClick={() => {
                          setStars(n);
                          setError(false);
                        }}
                        onKeyDown={(e) => {
                          const rtl = document.documentElement.dir === 'rtl';
                          const inc = e.key === (rtl ? 'ArrowLeft' : 'ArrowRight') || e.key === 'ArrowUp';
                          const dec = e.key === (rtl ? 'ArrowRight' : 'ArrowLeft') || e.key === 'ArrowDown';
                          if (inc || dec) {
                            e.preventDefault();
                            const next = Math.min(5, Math.max(1, (stars || 0) + (inc ? 1 : -1)));
                            setStars(next);
                            setError(false);
                            document.getElementById(`star-${next}`)?.focus();
                          }
                        }}
                        className="cursor-pointer rounded-lg p-1 transition-transform hover:scale-110"
                        data-star={n}
                      >
                        <Star
                          className={`size-10 ${n <= shown ? 'text-gold' : 'text-line'}`}
                          fill="currentColor"
                          strokeWidth={0}
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                  <span
                    className="rounded-full bg-brand-100 px-3 py-1 font-heading font-bold text-brand-700 [:root[data-theme=dark]_&]:text-brand-900"
                    data-testid="rating-chip"
                  >
                    {t('common.outOf5', { n: `${shown || 0}.0` })}
                  </span>
                  {shown > 0 && <span className="font-semibold text-muted">{labels[shown - 1]}</span>}
                </div>
                <div aria-live="polite">
                  {error && (
                    <p className="field-error">
                      <AlertCircle className="size-4" aria-hidden="true" />
                      {t('rate.needStars')}
                    </p>
                  )}
                </div>
              </fieldset>

              <fieldset className="m-0 border-0 p-0">
                <legend className="field-label">{t('rate.tagsLegend')}</legend>
                <div className="flex flex-wrap gap-2">
                  {tagList.map((tag) => {
                    const on = tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setTags((l) => (on ? l.filter((x) => x !== tag) : [...l, tag]))}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold transition-colors ${
                          on ? 'border-brand-700 bg-brand-700 text-on-brand' : 'border-line bg-surface hover:border-brand-500'
                        }`}
                      >
                        {on && <CheckCircle2 className="size-4" aria-hidden="true" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor="feedback" className="field-label">
                  {t('rate.feedback')} <span className="font-normal text-muted">({t('common.optional')})</span>
                </label>
                <textarea
                  id="feedback"
                  className="input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('rate.feedbackPh')}
                  maxLength={600}
                />
              </div>
              <p className="text-sm text-muted">{t('common.consent')}</p>
              <button type="submit" className="btn btn-primary btn-lg w-full sm:w-auto" data-testid="submit-rating">
                <Star className="size-5" aria-hidden="true" />
                {t('rate.submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
