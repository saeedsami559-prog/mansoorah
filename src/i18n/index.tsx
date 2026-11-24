import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import en from './en.json';
import type { L10n, Lang } from './types';
import { formatOMR } from '../lib/format';

type Dict = typeof en;
/** Every dot-path to a string (or string[]) leaf in en.json – gives `t()` compile-time key checking. */
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string | readonly unknown[] ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];
export type TKey = Leaves<Dict>;

const dictionaries: Record<Lang, unknown> = { en, ar: undefined };

/** Arabic is loaded on demand so English visitors don't download it (and vice versa it is cached). */
export async function loadLang(lang: Lang): Promise<void> {
  if (lang === 'ar' && !dictionaries.ar) dictionaries.ar = (await import('./ar.json')).default;
}
const STORAGE_KEY = 'mansoorah.v1.lang';

function lookup(dict: unknown, key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
      dict,
    );
}

export function detectLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ar' || stored === 'en') return stored;
  } catch {
    /* storage unavailable */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language || '' : '';
  return nav.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

interface I18n {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (l: Lang) => Promise<void>;
  toggle: () => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
  tl: (key: TKey) => string[];
  /** Array of objects (e.g. steps with title/text). */
  ta: <T = { title: string; text: string }>(key: TKey) => T[];
  loc: (value: L10n) => string;
  omr: (n: number) => string;
}

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children, initial }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLangState] = useState<Lang>(() => initial ?? detectLang());
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* language just won't persist */
    }
  }, [lang, dir]);

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) => {
      const value = lookup(dictionaries[lang], key) ?? lookup(dictionaries.en, key);
      let text = typeof value === 'string' ? value : key;
      if (vars) for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
      return text;
    },
    [lang],
  );

  const value = useMemo<I18n>(
    () => ({
      lang,
      dir,
      setLang: (l: Lang) => loadLang(l).then(() => setLangState(l)),
      toggle: () => {
        const next: Lang = lang === 'en' ? 'ar' : 'en';
        loadLang(next).then(() => setLangState(next));
      },
      t,
      tl: (key) => {
        const v = lookup(dictionaries[lang], key) ?? lookup(dictionaries.en, key);
        return Array.isArray(v) ? (v as string[]) : [];
      },
      ta: <T,>(key: TKey) => {
        const v = lookup(dictionaries[lang], key) ?? lookup(dictionaries.en, key);
        return Array.isArray(v) ? (v as T[]) : [];
      },
      loc: (v) => v[lang] ?? v.en,
      omr: (n) => formatOMR(n, lang),
    }),
    [lang, dir, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
