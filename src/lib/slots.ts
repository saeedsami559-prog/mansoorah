import { addDays, fromISODate, toISODate } from './dates';

export const SLOTS = ['09:00', '11:00', '14:00', '16:00', '18:00'] as const;
export type Slot = (typeof SLOTS)[number];

/** Friday is a limited day: afternoon slots only. */
export const FRIDAY_SLOTS: readonly Slot[] = ['16:00', '18:00'];

export type SlotState = 'available' | 'booked' | 'past' | 'closed';

export interface DayOption {
  iso: string;
  isFriday: boolean;
  isToday: boolean;
}

export function bookingDays(now = new Date(), count = 14): DayOption[] {
  return Array.from({ length: count }, (_, i) => {
    const d = addDays(now, i);
    return { iso: toISODate(d), isFriday: d.getDay() === 5, isToday: i === 0 };
  });
}

/** Small deterministic hash so the same technician/day/slot is always "booked" in the demo. */
export function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Minimum lead time before a same-day visit can start. */
export const LEAD_TIME_HOURS = 2;

export function slotState(techId: string, iso: string, slot: Slot, now = new Date()): SlotState {
  const day = fromISODate(iso);
  if (day.getDay() === 5 && !FRIDAY_SLOTS.includes(slot)) return 'closed';
  if (iso === toISODate(now)) {
    const [h, m] = slot.split(':').map(Number);
    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m);
    if (start.getTime() - now.getTime() < LEAD_TIME_HOURS * 3600_000) return 'past';
  }
  if (iso < toISODate(now)) return 'past';
  return hash(`${techId}|${iso}|${slot}`) % 4 === 0 ? 'booked' : 'available';
}

export function availableSlots(techId: string, iso: string, now = new Date()): Slot[] {
  return SLOTS.filter((s) => slotState(techId, iso, s, now) === 'available');
}

export function isSlotBookable(techId: string, iso: string, slot: string, now = new Date()): boolean {
  return (SLOTS as readonly string[]).includes(slot) && slotState(techId, iso, slot as Slot, now) === 'available';
}

/** Free cancellation up to N hours before the visit. */
export function canCancelFree(iso: string, slot: string, hours: number, now = new Date()): boolean {
  const [h, m] = slot.split(':').map(Number);
  const day = fromISODate(iso);
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m);
  return start.getTime() - now.getTime() >= hours * 3600_000;
}
