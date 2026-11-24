import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { mergeBookings, type Booking, type BookingDraft } from '../../lib/bookings';
import { readJSON, writeJSON } from '../../lib/storage';

interface BookingState {
  draft: BookingDraft | null;
  setDraft: (d: BookingDraft | null) => void;
  updateDraft: (patch: Partial<BookingDraft>) => void;
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  getBooking: (id: string | undefined) => Booking | undefined;
}

const Ctx = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<BookingDraft | null>(() => readJSON<BookingDraft | null>('draft', null));
  const [stored, setStored] = useState<Booking[]>(() => readJSON<Booking[]>('bookings', []));
  const [patches, setPatches] = useState<Record<string, Partial<Booking>>>(() => readJSON('seedPatches', {}));

  useEffect(() => writeJSON('draft', draft), [draft]);
  useEffect(() => writeJSON('bookings', stored), [stored]);
  useEffect(() => writeJSON('seedPatches', patches), [patches]);

  const bookings = useMemo(() => mergeBookings(stored, patches), [stored, patches]);

  const setDraft = useCallback((d: BookingDraft | null) => setDraftState(d), []);
  const updateDraft = useCallback((patch: Partial<BookingDraft>) => setDraftState((d) => (d ? { ...d, ...patch } : d)), []);
  const addBooking = useCallback((b: Booking) => setStored((list) => [b, ...list.filter((x) => x.id !== b.id)]), []);
  const updateBooking = useCallback(
    (id: string, patch: Partial<Booking>) => {
      if (stored.some((b) => b.id === id)) setStored((list) => list.map((b) => (b.id === id ? { ...b, ...patch } : b)));
      else setPatches((p) => ({ ...p, [id]: { ...(p[id] ?? {}), ...patch } }));
    },
    [stored],
  );
  const getBooking = useCallback((id: string | undefined) => bookings.find((b) => b.id === id), [bookings]);

  const value = useMemo(
    () => ({ draft, setDraft, updateDraft, bookings, addBooking, updateBooking, getBooking }),
    [draft, setDraft, updateDraft, bookings, addBooking, updateBooking, getBooking],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking(): BookingState {
  const c = useContext(Ctx);
  if (!c) throw new Error('useBooking must be inside BookingProvider');
  return c;
}
