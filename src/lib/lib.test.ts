import { describe, expect, it } from 'vitest';
import { formatOMR, formatOmaniPhone, formatNumber } from './format';
import { bookingTotal, packageSaving } from './pricing';
import { isValidOmaniMobile, normalizeOmaniMobile } from './phone';
import { availableSlots, bookingDays, canCancelFree, isSlotBookable, slotState, SLOTS } from './slots';
import { newBookingId, sampleBookings } from './bookings';
import { buildIcs } from './ics';
import { SERVICES, STARTER_PACKAGE, getService } from '../data/services';
import { TECHNICIANS, ratingBreakdown } from '../data/technicians';
import { toISODate } from './dates';

describe('price formatting', () => {
  it('uses Western digits and the right currency label', () => {
    expect(formatOMR(25, 'en')).toBe('25 OMR');
    expect(formatOMR(25, 'ar')).toBe('25 ر.ع.');
    expect(formatOMR(12.5, 'en')).toBe('12.5 OMR');
    expect(formatNumber(1250)).toBe('1,250');
  });
  it('formats Omani phone numbers', () => {
    expect(formatOmaniPhone('96891234567')).toBe('+968 9123 4567');
    expect(formatOmaniPhone('91234567')).toBe('+968 9123 4567');
  });
});

describe('booking total', () => {
  it('adds no VAT and no fees', () => {
    expect(bookingTotal(25)).toEqual({ servicePrice: 25, vat: 0, fees: 0, total: 25 });
    expect(bookingTotal(10).total).toBe(10);
  });
  it('rejects invalid prices', () => {
    expect(() => bookingTotal(-1)).toThrow();
    expect(() => bookingTotal(Number.NaN)).toThrow();
  });
  it('matches the catalogue prices from the brief', () => {
    const prices = Object.fromEntries(SERVICES.map((s) => [s.slug, s.price]));
    expect(prices).toEqual({
      'smart-door-lock': 25,
      'security-cameras': 30,
      'video-doorbell': 18,
      'smart-lighting': 20,
      'iot-hub': 20,
      'wifi-network': 15,
      'smart-ac-controller': 12,
      'tech-repair': 10,
    });
  });
  it('prices the starter package consistently with its parts', () => {
    const sum = STARTER_PACKAGE.components.reduce((n, slug) => n + (getService(slug)?.price ?? 0), 0);
    expect(sum).toBe(STARTER_PACKAGE.separatePrice);
    expect(packageSaving(STARTER_PACKAGE.price, STARTER_PACKAGE.separatePrice)).toBe(10);
  });
});

describe('Omani phone validation', () => {
  it.each(['91234567', '71234567', '+968 9123 4567', '00968 91234567', '968-9123-4567'])('accepts %s', (n) => {
    expect(isValidOmaniMobile(n)).toBe(true);
  });
  it.each(['', '1234567', '912345678', '81234567', '+971 501234567', 'abcdefgh', '24123456'])('rejects %s', (n) => {
    expect(isValidOmaniMobile(n)).toBe(false);
  });
  it('normalizes to 8 digits', () => {
    expect(normalizeOmaniMobile('+968 9123 4567')).toBe('91234567');
  });
});

describe('slot availability', () => {
  // Tuesday 1 Dec 2026, 08:00 local
  const now = new Date(2026, 11, 1, 8, 0);
  it('offers the next 14 days starting today', () => {
    const days = bookingDays(now);
    expect(days).toHaveLength(14);
    expect(days[0].iso).toBe('2026-12-01');
    expect(days[0].isToday).toBe(true);
    expect(days.filter((d) => d.isFriday)).toHaveLength(2);
  });
  it('limits Fridays to afternoon slots', () => {
    const friday = '2026-12-04';
    expect(slotState('hamed-alhinai', friday, '09:00', now)).toBe('closed');
    expect(slotState('hamed-alhinai', friday, '11:00', now)).toBe('closed');
    expect(['available', 'booked']).toContain(slotState('hamed-alhinai', friday, '16:00', now));
  });
  it('blocks same-day slots inside the 2-hour lead time', () => {
    const late = new Date(2026, 11, 1, 13, 0);
    expect(slotState('hamed-alhinai', '2026-12-01', '09:00', late)).toBe('past');
    expect(slotState('hamed-alhinai', '2026-12-01', '14:00', late)).toBe('past');
    expect(slotState('hamed-alhinai', '2026-12-01', '16:00', late)).not.toBe('past');
  });
  it('is deterministic and leaves most slots open', () => {
    const a = availableSlots('khalid-alkindi', '2026-12-02', now);
    const b = availableSlots('khalid-alkindi', '2026-12-02', now);
    expect(a).toEqual(b);
    const total = TECHNICIANS.flatMap((t) => bookingDays(now).flatMap((d) => SLOTS.map((s) => slotState(t.id, d.iso, s, now))));
    const booked = total.filter((s) => s === 'booked').length;
    expect(booked).toBeGreaterThan(0);
    expect(booked / total.length).toBeLessThan(0.35);
  });
  it('rejects unknown or unavailable slots', () => {
    expect(isSlotBookable('hamed-alhinai', '2026-12-02', '10:30', now)).toBe(false);
    expect(isSlotBookable('hamed-alhinai', '2026-12-04', '09:00', now)).toBe(false);
  });
  it('applies the 3-hour free cancellation rule', () => {
    expect(canCancelFree('2026-12-01', '14:00', 3, new Date(2026, 11, 1, 10, 0))).toBe(true);
    expect(canCancelFree('2026-12-01', '14:00', 3, new Date(2026, 11, 1, 11, 30))).toBe(false);
  });
});

describe('bookings', () => {
  it('creates MNS-YYYY-XXXX ids without collisions', () => {
    const now = new Date(2026, 10, 24);
    const id = newBookingId(now, () => 0.5);
    expect(id).toMatch(/^MNS-2026-\d{4}$/);
    let i = 0;
    const seq = [0.5, 0.5, 0.1];
    const next = newBookingId(now, () => seq[i++], [id]);
    expect(next).not.toBe(id);
  });
  it('seeds one future upcoming and one completed booking', () => {
    const now = new Date(2026, 10, 24, 9);
    const [upcoming, completed] = sampleBookings(now);
    expect(upcoming.status).toBe('upcoming');
    expect(upcoming.date > toISODate(now)).toBe(true);
    expect(completed.status).toBe('completed');
    expect(upcoming.total).toBe(getService(upcoming.slug)?.price);
    expect(completed.total).toBe(getService(completed.slug)?.price);
  });
});

describe('calendar export', () => {
  it('converts Oman time (UTC+4) to UTC', () => {
    const ics = buildIcs(
      {
        uid: 'MNS-2026-1234',
        title: 'Smart lock',
        description: 'Test',
        location: 'Seeb',
        date: '2026-12-02',
        slot: '09:00',
        durationMinutes: 90,
      },
      new Date(Date.UTC(2026, 10, 24)),
    );
    expect(ics).toContain('DTSTART:20261202T050000Z');
    expect(ics).toContain('DTEND:20261202T063000Z');
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
  });
});

describe('technicians', () => {
  it('has 10 fictional technicians with valid skills', () => {
    expect(TECHNICIANS).toHaveLength(10);
    const slugs = new Set(SERVICES.map((s) => s.slug));
    for (const t of TECHNICIANS) for (const s of t.skills) expect(slugs.has(s)).toBe(true);
  });
  it('every service has at least 3 technicians', () => {
    for (const s of SERVICES) expect(TECHNICIANS.filter((t) => t.skills.includes(s.slug)).length).toBeGreaterThanOrEqual(3);
  });
  it('rating breakdown sums to 100', () => {
    for (const t of TECHNICIANS) expect(ratingBreakdown(t).reduce((a, b) => a + b, 0)).toBe(100);
  });
});

describe('sample reviews', () => {
  it('every technician gets 5 complete reviews', async () => {
    const { reviewsFor } = await import('../data/reviews');
    for (const t of TECHNICIANS) {
      const r = reviewsFor(t);
      expect(r).toHaveLength(5);
      for (const x of r) {
        expect(x.text?.en).toBeTruthy();
        expect(x.name?.ar).toBeTruthy();
        expect(x.area?.en).toBeTruthy();
      }
    }
  });
});
