import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { mergeBookings, type Booking, type BookingDraft } from '../../lib/bookings';
import { readJSON, writeJSON } from '../../lib/storage';
import { getSupabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';

interface BookingState {
  draft: BookingDraft | null;
  setDraft: (d: BookingDraft | null) => void;
  updateDraft: (patch: Partial<BookingDraft>) => void;
  bookings: Booking[];
  /** True while bookings are being fetched from the server. */
  syncing: boolean;
  addBooking: (b: Booking) => Promise<boolean>;
  updateBooking: (id: string, patch: Partial<Booking>) => Promise<boolean>;
  getBooking: (id: string | undefined) => Booking | undefined;
}

const Ctx = createContext<BookingState | null>(null);

interface Row {
  id: string;
  slug: string;
  tech_id: string;
  date: string;
  slot: string;
  status: Booking['status'];
  total: number | string;
  payment: Booking['payment'];
  customer: Booking['customer'];
  rating: Booking['rating'] | null;
  completed_at: string | null;
  created_at: string;
}

export function fromRow(r: Row): Booking {
  return {
    id: r.id,
    slug: r.slug,
    techId: r.tech_id,
    date: r.date,
    slot: r.slot,
    status: r.status,
    total: Number(r.total),
    payment: r.payment,
    customer: r.customer,
    rating: r.rating ?? undefined,
    completedAt: r.completed_at ?? undefined,
    createdAt: r.created_at.slice(0, 10),
  };
}

function toPatch(p: Partial<Booking>) {
  const out: Record<string, unknown> = {};
  if (p.status) out.status = p.status;
  if (p.date) out.date = p.date;
  if (p.slot) out.slot = p.slot;
  if (p.rating) out.rating = p.rating;
  if (p.completedAt) out.completed_at = p.completedAt;
  return out;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const { live, user } = useAuth();
  const [draft, setDraftState] = useState<BookingDraft | null>(() => readJSON<BookingDraft | null>('draft', null));
  // Demo mode storage
  const [stored, setStored] = useState<Booking[]>(() => readJSON<Booking[]>('bookings', []));
  const [patches, setPatches] = useState<Record<string, Partial<Booking>>>(() => readJSON('seedPatches', {}));
  // Live mode storage
  const [remote, setRemote] = useState<Booking[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => writeJSON('draft', draft), [draft]);
  useEffect(() => {
    if (!live) writeJSON('bookings', stored);
  }, [stored, live]);
  useEffect(() => {
    if (!live) writeJSON('seedPatches', patches);
  }, [patches, live]);

  // Load the signed-in user's bookings from the server.
  useEffect(() => {
    if (!live) return;
    if (!user) {
      setRemote([]);
      return;
    }
    let cancelled = false;
    setSyncing(true);
    getSupabase().then(async (sb) => {
      if (!sb) return;
      const { data } = await sb.from('bookings').select('*').eq('user_id', user.id).order('date', { ascending: false });
      if (!cancelled) {
        setRemote(((data as Row[] | null) ?? []).map(fromRow));
        setSyncing(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [live, user]);

  const bookings = useMemo(() => (live ? remote : mergeBookings(stored, patches)), [live, remote, stored, patches]);

  const setDraft = useCallback((d: BookingDraft | null) => setDraftState(d), []);
  const updateDraft = useCallback((patch: Partial<BookingDraft>) => setDraftState((d) => (d ? { ...d, ...patch } : d)), []);

  const addBooking = useCallback(
    async (b: Booking) => {
      if (!live) {
        setStored((list) => [b, ...list.filter((x) => x.id !== b.id)]);
        return true;
      }
      const sb = await getSupabase();
      if (!sb || !user) return false;
      const { error } = await sb.from('bookings').insert({
        id: b.id,
        user_id: user.id,
        slug: b.slug,
        tech_id: b.techId,
        date: b.date,
        slot: b.slot,
        status: 'upcoming',
        total: b.total,
        payment: b.payment,
        customer: b.customer,
      });
      if (error) return false;
      setRemote((list) => [b, ...list]);
      return true;
    },
    [live, user],
  );

  const updateBooking = useCallback(
    async (id: string, patch: Partial<Booking>) => {
      if (!live) {
        if (stored.some((b) => b.id === id)) setStored((list) => list.map((b) => (b.id === id ? { ...b, ...patch } : b)));
        else setPatches((p) => ({ ...p, [id]: { ...(p[id] ?? {}), ...patch } }));
        return true;
      }
      const sb = await getSupabase();
      if (!sb) return false;
      const { error } = await sb.from('bookings').update(toPatch(patch)).eq('id', id);
      if (error) return false;
      setRemote((list) => list.map((b) => (b.id === id ? { ...b, ...patch } : b)));
      return true;
    },
    [live, stored],
  );

  const getBooking = useCallback((id: string | undefined) => bookings.find((b) => b.id === id), [bookings]);

  const value = useMemo(
    () => ({ draft, setDraft, updateDraft, bookings, syncing, addBooking, updateBooking, getBooking }),
    [draft, setDraft, updateDraft, bookings, syncing, addBooking, updateBooking, getBooking],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking(): BookingState {
  const c = useContext(Ctx);
  if (!c) throw new Error('useBooking must be inside BookingProvider');
  return c;
}
