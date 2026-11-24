/**
 * Omani mobile numbers: 8 digits starting with 7 or 9, optionally prefixed with +968 / 00968 / 968.
 */
export function normalizeOmaniMobile(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (digits.startsWith('00968')) digits = digits.slice(5);
  else if (digits.startsWith('968') && digits.length === 11) digits = digits.slice(3);
  if (!/^\d{8}$/.test(digits)) return null;
  if (!/^[79]/.test(digits)) return null;
  return digits;
}

export function isValidOmaniMobile(input: string): boolean {
  return normalizeOmaniMobile(input) !== null;
}
