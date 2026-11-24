import { useState } from 'react';
import { CalendarClock, CalendarX2, CheckCircle2, ClipboardList, MessageCircle, Star, XCircle } from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { Tabs } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { Badge, Button, ButtonLink, EmptyState, ExternalButton } from '../components/ui/primitives';
import { Avatar } from '../components/technician/Avatar';
import { ServiceArt } from '../components/service/ServiceArt';
import { useBooking } from '../components/booking/BookingContext';
import { useToast } from '../components/ui/Toast';
import { byStatus, type Booking, type BookingStatus } from '../lib/bookings';
import { getBookable } from '../data/services';
import { getTechnician } from '../data/technicians';
import { formatDate, formatSlot } from '../lib/format';
import { canCancelFree } from '../lib/slots';
import { whatsappLink } from '../lib/whatsapp';
import { toISODate } from '../lib/dates';
import { RULES } from '../config/site';
import { track } from '../lib/track';

const STATUS_TONE = { upcoming: 'brand', completed: 'success', cancelled: 'danger' } as const;
const STATUS_ICON = { upcoming: CalendarClock, completed: CheckCircle2, cancelled: XCircle } as const;

function BookingCard({
  b,
  onCancel,
  onComplete,
}: {
  b: Booking;
  onCancel: (b: Booking) => void;
  onComplete: (b: Booking) => void;
}) {
  const { t, loc, lang, omr } = useI18n();
  const item = getBookable(b.slug);
  const tech = getTechnician(b.techId);
  if (!item || !tech) return null;
  const Icon = STATUS_ICON[b.status];
  return (
    <article className="card flex flex-col gap-4 p-4 sm:flex-row sm:p-5" data-booking={b.id}>
      <ServiceArt
        slug={item.isPackage ? 'package' : item.slug}
        className="h-28 w-full shrink-0 rounded-xl object-cover sm:h-24 sm:w-36"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={STATUS_TONE[b.status]}>
            <Icon className="size-3.5" aria-hidden="true" />
            {t(`bookings.status.${b.status}`)}
          </Badge>
          <span className="text-xs font-semibold text-muted" dir="ltr">
            {b.id}
          </span>
          {b.sample && <Badge tone="neutral">{t('bookings.sampleNote')}</Badge>}
        </div>
        <h3 className="mt-2 text-lg font-bold">{loc(item.title)}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="flex items-center gap-2">
            <Avatar name={loc(tech.name)} tone={tech.tone} gender={tech.gender} size={26} />
            {loc(tech.name)}
          </span>
          <span className="flex items-center gap-1.5 text-muted">
            <CalendarClock className="size-4" aria-hidden="true" />
            {formatDate(b.date, lang)} · <span dir="ltr">{formatSlot(b.slot, lang)}</span>
          </span>
          <span className="font-semibold">
            {t('bookings.total')}: {omr(b.total)}
          </span>
        </div>
        {b.rating && (
          <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-gold-ink">
            <Star className="size-4 text-gold" fill="currentColor" strokeWidth={0} aria-hidden="true" />
            {t('bookings.rated', { n: b.rating.stars })}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {b.status === 'upcoming' && (
            <>
              <ButtonLink to={`/book/${b.slug}?reschedule=${b.id}`} variant="secondary" size="sm">
                <CalendarClock className="size-4" aria-hidden="true" />
                {t('bookings.reschedule')}
              </ButtonLink>
              <Button variant="danger" size="sm" onClick={() => onCancel(b)}>
                <CalendarX2 className="size-4" aria-hidden="true" />
                {t('bookings.cancel')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onComplete(b)}>
                <CheckCircle2 className="size-4" aria-hidden="true" />
                {t('bookings.simulate')}
              </Button>
            </>
          )}
          {b.status === 'completed' && !b.rating && (
            <ButtonLink to={`/rate/${b.id}`} size="sm">
              <Star className="size-4" aria-hidden="true" />
              {t('bookings.rate')}
            </ButtonLink>
          )}
          <ExternalButton
            href={whatsappLink(t('bookings.waMessage', { id: b.id, service: loc(item.title) }))}
            variant="secondary"
            size="sm"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {t('bookings.support')}
          </ExternalButton>
        </div>
      </div>
    </article>
  );
}

export default function MyBookings() {
  const { t } = useI18n();
  const { bookings, updateBooking } = useBooking();
  const toast = useToast();
  const [tab, setTab] = useState<BookingStatus>('upcoming');
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const list = byStatus(bookings, tab);

  const tabs = (['upcoming', 'completed', 'cancelled'] as const).map((id) => ({
    id,
    label: t(`bookings.tabs.${id}`),
    count: byStatus(bookings, id).length,
  }));
  const free = cancelling ? canCancelFree(cancelling.date, cancelling.slot, RULES.freeCancellationHours) : true;

  return (
    <>
      <Seo title={t('meta.bookings.title')} description={t('meta.bookings.description')} noindex />
      <PageHero title={t('bookings.title')} sub={t('bookings.sub')} crumbs={[{ label: t('nav.bookings') }]} compact />
      <section className="container-x py-10">
        <Tabs tabs={tabs} value={tab} onChange={setTab} label={t('bookings.title')} idBase="bk" />
        <div id="bk-panel" role="tabpanel" aria-labelledby={`bk-tab-${tab}`} className="mt-6">
          {list.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="size-7" />}
              title={t(`bookings.empty.${tab}`)}
              action={<ButtonLink to="/services">{t('bookings.emptyCta')}</ButtonLink>}
            />
          ) : (
            <ul className="m-0 grid list-none gap-4 p-0">
              {list.map((b) => (
                <li key={b.id}>
                  <BookingCard
                    b={b}
                    onCancel={setCancelling}
                    onComplete={(x) => {
                      updateBooking(x.id, { status: 'completed', completedAt: toISODate(new Date()) });
                      toast(t('bookings.completedToast', { id: x.id }));
                      track('booking_completed_demo', { id: x.id });
                      setTab('completed');
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Modal open={!!cancelling} onClose={() => setCancelling(null)} title={t('bookings.cancelTitle')}>
        <p className={`rounded-xl p-3 text-sm ${free ? 'bg-success-bg text-success-ink' : 'bg-warning-bg text-warning'}`}>
          {free ? t('bookings.cancelFree') : t('bookings.cancelLate')}
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={() => setCancelling(null)}>
            {t('bookings.keep')}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (!cancelling) return;
              updateBooking(cancelling.id, { status: 'cancelled' });
              toast(t('bookings.cancelled', { id: cancelling.id }), 'info');
              track('booking_cancelled', { id: cancelling.id, free });
              setCancelling(null);
            }}
          >
            {t('bookings.cancelConfirm')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
