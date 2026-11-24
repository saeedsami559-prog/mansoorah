import { STORAGE_PREFIX } from '../config/site';

/** localStorage wrapped in try/catch: private mode or blocked storage must never break the site. */
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}.${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}.${key}`, JSON.stringify(value));
  } catch {
    /* storage unavailable – demo state just won't persist */
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}.${key}`);
  } catch {
    /* ignore */
  }
}
