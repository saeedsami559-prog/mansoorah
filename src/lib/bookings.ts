import { relativeISO } from './dates';

export type PaymentMethod = 'omannet' | 'card' | 'thawani' | 'cash';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Customer {
  name: string;
  phone: string;
  governorate: string;
  wilayat: string;
  area: string;
  street: string;
  house: string;
  landmark: string;
  notes: string;
  device: 'own' | 'help';
}

export interface Rating {
  stars: number;
  tags: string[];
  text: string;
  at: string;
}

export interface Booking {
  id: string;
  slug: string;
  techId: string;
  date: string; // YYYY-MM-DD
  slot: string; // HH:MM
  status: BookingStatus;
  total: number;
  payment: PaymentMethod;
  customer: Customer;
  createdAt: string;
  completedAt?: string;
  rating?: Rating;
  sample?: boolean;
}

/** Draft carried through the booking wizard. */
export interface BookingDraft {
  slug: string;
  techId?: string;
  date?: string;
  slot?: string;
  /** When set, the wizard reschedules this booking instead of creating a new one. */
  rescheduleId?: string;
}

export function newBookingId(now = new Date(), rand: () => number = Math.random, existing: string[] = []): string {
  for (let i = 0; i < 50; i++) {
    const n = String(Math.floor(rand() * 9000) + 1000);
    const id = `MNS-${now.getFullYear()}-${n}`;
    if (!existing.includes(id)) return id;
  }
  return `MNS-${now.getFullYear()}-${String(Date.now()).slice(-4)}`;
}

const SAMPLE_CUSTOMER: Customer = {
  name: 'Demo Customer',
  phone: '91234567',
  governorate: 'muscat',
  wilayat: 'seeb',
  area: 'Al Mawaleh South',
  street: 'Way 4521',
  house: '27',
  landmark: '',
  notes: '',
  device: 'own',
};

/** Two seeded sample bookings, generated relative to today so they never go stale. */
export function sampleBookings(now = new Date()): Booking[] {
  const year = now.getFullYear();
  return [
    {
      id: `MNS-${year}-0417`,
      slug: 'wifi-network',
      techId: 'khalid-alkindi',
      date: relativeISO(3, now),
      slot: '11:00',
      status: 'upcoming',
      total: 15,
      payment: 'cash',
      customer: SAMPLE_CUSTOMER,
      createdAt: relativeISO(-1, now),
      sample: true,
    },
    {
      id: `MNS-${year}-0392`,
      slug: 'smart-door-lock',
      techId: 'hamed-alhinai',
      date: relativeISO(-4, now),
      slot: '16:00',
      status: 'completed',
      total: 25,
      payment: 'omannet',
      customer: SAMPLE_CUSTOMER,
      createdAt: relativeISO(-9, now),
      completedAt: relativeISO(-4, now),
      sample: true,
    },
  ];
}

/** Merge stored bookings with seeds; stored patches for seeds win. */
export function mergeBookings(stored: Booking[], seedPatches: Record<string, Partial<Booking>>, now = new Date()): Booking[] {
  const seeds = sampleBookings(now).map((s) => ({ ...s, ...(seedPatches[s.id] ?? {}) }));
  const all = [...stored, ...seeds];
  return all.sort((a, b) => (a.date + a.slot < b.date + b.slot ? 1 : -1));
}

export function byStatus(list: Booking[], status: BookingStatus): Booking[] {
  const filtered = list.filter((b) => b.status === status);
  return status === 'upcoming' ? filtered.reverse() : filtered;
}
