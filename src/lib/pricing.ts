import { RULES } from '../config/site';

export interface PriceBreakdown {
  servicePrice: number;
  vat: number;
  fees: number;
  total: number;
}

/** Fixed price per service: identical for every technician, no VAT, no booking fee. */
export function bookingTotal(servicePrice: number): PriceBreakdown {
  if (!Number.isFinite(servicePrice) || servicePrice < 0) throw new Error('Invalid service price');
  const vat = Math.round(servicePrice * RULES.vatRate * 1000) / 1000;
  return { servicePrice, vat, fees: 0, total: servicePrice + vat };
}

export function packageSaving(packagePrice: number, separatePrice: number): number {
  return Math.max(0, separatePrice - packagePrice);
}
