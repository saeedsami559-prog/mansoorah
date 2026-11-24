import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck2,
  CalendarX2,
  CheckCircle2,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  Star,
  UsersRound,
  Wallet,
} from 'lucide-react';
import { useI18n, type TKey } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { Tabs } from '../components/ui/Tabs';
import { Badge, ButtonLink, EmptyState } from '../components/ui/primitives';
import { useToast } from '../components/ui/Toast';
import { useAuth, type Role } from '../components/auth/AuthContext';
import { fromRow } from '../components/booking/BookingContext';
import { getSupabase } from '../lib/supabase';
import { getBookable } from '../data/services';
import { getTechnician } from '../data/technicians';
import { getRegion, getWilayat } from '../data/regions';
import { formatDate, formatOmaniPhone, formatSlot } from '../lib/format';
import { whatsappLink } from '../lib/whatsapp';
import type { Booking, BookingStatus } from '../lib/bookings';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: Role;
  created_at: string;
}
interface Req {
  id: number;
  kind: 'technician' | 'partner-retail' | 'partner-landlord' | 'contact';
  payload: Record<string, unknown>;
  status: 'new' | 'done';
  created_at: string;
}
type Tab = 'bookings' | 'accounts' | 'requests';

const KIND_KEY: Record<Req['kind'], TKey> = {
  technician: 'admin.kindTechnician',
  'partner-retail': 'admin.kindRetail',
  'partner-landlord': 'admin.kindLandlord',
  contact: 'admin.kindContact',
};
const ROLE_KEY: Record<Role, TKey> = {
  customer: 'admin.roleCustomer',
  technician: 'admin.roleTechnician',
  admin: 'admin.roleAdmin',
};
const STATUS_TONE = { upcoming: 'brand', completed: 'success', cancelled: 'danger' } as const;

export default function Admin() {
  const { t, loc, lang, omr } = useI18n();
  const toast = useToast();
  const { live, user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>('bookings');
  const [q, setQ] = useState('');
  const [bookings, setBookings] = useState<(Booking & { userId: string })[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<Req[]>([]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const isAdmin = user?.role === 'admin';

  const load = useCallback(async () => {
    const sb = await getSupabase();
    if (!sb) return;
    setBusy(true);
    setFailed(false);
    const [b, p, r] = await Promise.all([
      sb.from('bookings').select('*').order('date', { ascending: false }),
      sb.from('profiles').select('*').order('created_at', { ascending: false }),
      sb.from('requests').select('*').order('created_at', { ascending: false }),
    ]);
    if (b.error || p.error || r.error) setFailed(true);
    setBookings(
      ((b.data as (Parameters<typeof fromRow>[0] & { user_id: string })[]) ?? []).map((row) => ({
        ...fromRow(row),
        userId: row.user_id,
      })),
    );
    setProfiles((p.data as Profile[]) ?? []);
    setRequests((r.data as Req[]) ?? []);
    setBusy(false);
  }, []);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  const setStatus = async (id: string, status: BookingStatus) => {
    const sb = await getSupabase();
    if (!sb) return;
    const patch: Record<string, unknown> = { status };
    if (status === 'completed') patch.completed_at = new Date().toISOString().slice(0, 10);
    const { error } = await sb.from('bookings').update(patch).eq('id', id);
    if (error) return toast(t('bookings.updateError'), 'info');
    setBookings((l) => l.map((b) => (b.id === id ? { ...b, status } : b)));
    toast(t('admin.updated'));
  };

  const markDone = async (id: number) => {
    const sb = await getSupabase();
    if (!sb) return;
    const { error } = await sb.from('requests').update({ status: 'done' }).eq('id', id);
    if (error) return toast(t('bookings.updateError'), 'info');
    setRequests((l) => l.map((r) => (r.id === id ? { ...r, status: 'done' } : r)));
    toast(t('admin.updated'));
  };

  const needle = q.trim().toLowerCase();
  const fb = useMemo(
    () => bookings.filter((b) => !needle || `${b.id} ${b.customer.name} ${b.customer.phone}`.toLowerCase().includes(needle)),
    [bookings, needle],
  );
  const fp = useMemo(
    () => profiles.filter((p) => !needle || `${p.full_name} ${p.email} ${p.phone}`.toLowerCase().includes(needle)),
    [profiles, needle],
  );
  const fr = useMemo(
    () => requests.filter((r) => !needle || JSON.stringify(r.payload).toLowerCase().includes(needle)),
    [requests, needle],
  );

  const header = <PageHero title={t('admin.title')} sub={t('admin.sub')} crumbs={[{ label: t('nav.admin') }]} compact />;
  const seo = <Seo title={t('meta.admin.title')} description={t('meta.admin.description')} noindex />;

  if (!live || loading || !isAdmin) {
    return (
      <>
        {seo}
        {header}
        <div className="container-x py-12">
          {loading ? (
            <p className="text-center text-muted" role="status">
              {t('common.loading')}
            </p>
          ) : (
            <EmptyState
              icon={<ShieldAlert className="size-7" />}
              title={!live ? t('admin.demo') : t('admin.notAllowed')}
              action={live && !user ? <ButtonLink to="/login?next=%2Fadmin">{t('nav.login')}</ButtonLink> : undefined}
            />
          )}
        </div>
      </>
    );
  }

  const stats = [
    { icon: ClipboardList, label: t('admin.statBookings'), value: String(bookings.length) },
    {
      icon: CalendarCheck2,
      label: t('admin.statUpcoming'),
      value: String(bookings.filter((b) => b.status === 'upcoming').length),
    },
    {
      icon: Wallet,
      label: t('admin.statRevenue'),
      value: omr(bookings.filter((b) => b.status === 'completed').reduce((n, b) => n + b.total, 0)),
    },
    { icon: UsersRound, label: t('admin.statCustomers'), value: String(profiles.length) },
    { icon: Inbox, label: t('admin.statRequests'), value: String(requests.filter((r) => r.status === 'new').length) },
  ];
  const tabs = [
    { id: 'bookings' as Tab, label: t('admin.tabBookings'), count: bookings.length },
    { id: 'accounts' as Tab, label: t('admin.tabAccounts'), count: profiles.length },
    { id: 'requests' as Tab, label: t('admin.tabRequests'), count: requests.length },
  ];
  const th = 'px-3 py-3 text-start text-xs font-bold tracking-wide text-muted uppercase [:root[dir=rtl]_&]:tracking-normal';
  const td = 'px-3 py-3 align-top';
  const date = (iso: string) => formatDate(iso.slice(0, 10), lang, { weekday: undefined });

  return (
    <>
      {seo}
      {header}
      <div className="container-x space-y-6 py-10">
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-5">
          {stats.map((s) => (
            <li key={s.label} className="card p-4">
              <s.icon className="size-5 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900" aria-hidden="true" />
              <p className="mt-2 font-heading text-2xl font-extrabold text-heading">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs tabs={tabs} value={tab} onChange={setTab} label={t('admin.title')} idBase="adm" />
          <div className="flex flex-1 items-center gap-2 sm:max-w-md">
            <div className="relative flex-1">
              <label htmlFor="adm-search" className="sr-only">
                {t('admin.search')}
              </label>
              <Search
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="adm-search"
                type="search"
                className="input !min-h-10 !ps-9 text-sm"
                placeholder={t('admin.search')}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => void load()} disabled={busy}>
              <RefreshCw className={`size-4 ${busy ? 'animate-spin' : ''}`} aria-hidden="true" />
              {t('common.refresh')}
            </button>
          </div>
        </div>
        {failed && (
          <p className="rounded-xl bg-danger-bg p-3 text-sm font-semibold text-danger" role="alert">
            {t('admin.loadError')}
          </p>
        )}

        <div id="adm-panel" role="tabpanel" aria-labelledby={`adm-tab-${tab}`} className="card min-w-0 overflow-x-auto">
          {tab === 'bookings' &&
            (fb.length === 0 ? (
              <EmptyState icon={<LayoutDashboard className="size-7" />} title={t('admin.empty')} />
            ) : (
              <table className="w-full min-w-[860px] border-collapse text-sm">
                <thead className="bg-surface-2">
                  <tr>
                    <th className={th}>{t('admin.colBooking')}</th>
                    <th className={th}>{t('admin.colCustomer')}</th>
                    <th className={th}>{t('admin.colWhen')}</th>
                    <th className={th}>{t('admin.colStatus')}</th>
                    <th className={th}>{t('admin.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {fb.map((b) => {
                    const item = getBookable(b.slug);
                    const tech = getTechnician(b.techId);
                    const region = getRegion(b.customer.governorate);
                    const wil = getWilayat(b.customer.governorate, b.customer.wilayat);
                    return (
                      <tr key={b.id} className="border-t border-line" data-admin-booking={b.id}>
                        <td className={td}>
                          <p className="font-semibold" dir="ltr">
                            {b.id}
                          </p>
                          <p>{item ? loc(item.title) : b.slug}</p>
                          <p className="text-muted">
                            {tech ? loc(tech.name) : b.techId} · {omr(b.total)}
                          </p>
                        </td>
                        <td className={td}>
                          <p className="font-semibold">{b.customer.name}</p>
                          <a
                            href={whatsappLink('', `968${b.customer.phone}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1"
                            dir="ltr"
                          >
                            <MessageCircle className="size-3.5" aria-hidden="true" />
                            {formatOmaniPhone(b.customer.phone)}
                          </a>
                          <p className="text-muted">
                            {[
                              b.customer.area,
                              b.customer.street,
                              b.customer.house,
                              wil && loc(wil.name),
                              region && loc(region.name),
                            ]
                              .filter(Boolean)
                              .join(lang === 'ar' ? '، ' : ', ')}
                          </p>
                          {b.customer.notes && <p className="text-muted italic">“{b.customer.notes}”</p>}
                        </td>
                        <td className={td}>
                          {formatDate(b.date, lang)}
                          <br />
                          <span dir="ltr">{formatSlot(b.slot, lang)}</span>
                        </td>
                        <td className={td}>
                          <Badge tone={STATUS_TONE[b.status]}>{t(`bookings.status.${b.status}`)}</Badge>
                          {b.rating && (
                            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-gold-ink">
                              <Star className="size-3.5 text-gold" fill="currentColor" strokeWidth={0} aria-hidden="true" />
                              {t('admin.rated', { n: b.rating.stars })}
                            </p>
                          )}
                        </td>
                        <td className={td}>
                          <div className="flex flex-wrap gap-1.5">
                            {b.status === 'upcoming' && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => void setStatus(b.id, 'completed')}
                                >
                                  <CheckCircle2 className="size-4" aria-hidden="true" />
                                  {t('admin.markCompleted')}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => void setStatus(b.id, 'cancelled')}
                                >
                                  <CalendarX2 className="size-4" aria-hidden="true" />
                                  {t('admin.markCancelled')}
                                </button>
                              </>
                            )}
                            {b.status !== 'upcoming' && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => void setStatus(b.id, 'upcoming')}
                              >
                                <RotateCcw className="size-4" aria-hidden="true" />
                                {t('admin.markUpcoming')}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ))}

          {tab === 'accounts' &&
            (fp.length === 0 ? (
              <EmptyState icon={<UsersRound className="size-7" />} title={t('admin.empty')} />
            ) : (
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead className="bg-surface-2">
                  <tr>
                    <th className={th}>{t('admin.colName')}</th>
                    <th className={th}>{t('admin.colEmail')}</th>
                    <th className={th}>{t('admin.colPhone')}</th>
                    <th className={th}>{t('admin.colRole')}</th>
                    <th className={th}>{t('admin.colJoined')}</th>
                  </tr>
                </thead>
                <tbody>
                  {fp.map((p) => (
                    <tr key={p.id} className="border-t border-line">
                      <td className={`${td} font-semibold`}>{p.full_name || '—'}</td>
                      <td className={td} dir="ltr">
                        <a href={`mailto:${p.email}`}>{p.email}</a>
                      </td>
                      <td className={td} dir="ltr">
                        {p.phone ? formatOmaniPhone(p.phone) : '—'}
                      </td>
                      <td className={td}>
                        <Badge tone={p.role === 'admin' ? 'gold' : p.role === 'technician' ? 'success' : 'brand'}>
                          {t(ROLE_KEY[p.role])}
                        </Badge>
                      </td>
                      <td className={td}>{date(p.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}

          {tab === 'requests' &&
            (fr.length === 0 ? (
              <EmptyState icon={<Inbox className="size-7" />} title={t('admin.empty')} />
            ) : (
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead className="bg-surface-2">
                  <tr>
                    <th className={th}>{t('admin.colType')}</th>
                    <th className={th}>{t('admin.colDetails')}</th>
                    <th className={th}>{t('admin.colDate')}</th>
                    <th className={th}>{t('admin.colStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {fr.map((r) => (
                    <tr key={r.id} className="border-t border-line">
                      <td className={`${td} font-semibold`}>{t(KIND_KEY[r.kind])}</td>
                      <td className={td}>
                        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                          {Object.entries(r.payload)
                            .filter(([, v]) => v !== '' && v !== null && v !== undefined && v !== true)
                            .map(([k, v]) => (
                              <div key={k} className="contents">
                                <dt className="text-muted">{k}</dt>
                                <dd className="m-0 break-words">{Array.isArray(v) ? v.join(', ') : String(v)}</dd>
                              </div>
                            ))}
                        </dl>
                      </td>
                      <td className={td}>{date(r.created_at)}</td>
                      <td className={td}>
                        {r.status === 'new' ? (
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => void markDone(r.id)}>
                            <CheckCircle2 className="size-4" aria-hidden="true" />
                            {t('admin.markDone')}
                          </button>
                        ) : (
                          <Badge tone="success">{t('admin.statusDone')}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
        </div>
        <p className="text-sm text-muted">
          <Link to="/bookings">{t('nav.bookings')}</Link>
        </p>
      </div>
    </>
  );
}
