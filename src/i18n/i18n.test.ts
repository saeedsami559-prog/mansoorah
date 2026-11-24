import { describe, expect, it } from 'vitest';
import en from './en.json';
import ar from './ar.json';

function shape(node: unknown, prefix = ''): string[] {
  if (Array.isArray(node)) {
    return [`${prefix}[${node.length}]`, ...node.flatMap((v, i) => shape(v, `${prefix}[${i}]`))];
  }
  if (node && typeof node === 'object') {
    return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) => shape(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

function placeholders(node: unknown, prefix = ''): Record<string, string[]> {
  if (typeof node === 'string') return { [prefix]: (node.match(/\{\w+\}/g) ?? []).sort() };
  if (node && typeof node === 'object') {
    return Object.assign(
      {},
      ...Object.entries(node as Record<string, unknown>).map(([k, v]) => placeholders(v, `${prefix}.${k}`)),
    );
  }
  return {};
}

describe('i18n key parity', () => {
  it('every EN key exists in AR and vice versa (including array lengths)', () => {
    const a = shape(en).sort();
    const b = shape(ar).sort();
    expect(a.filter((k) => !b.includes(k))).toEqual([]);
    expect(b.filter((k) => !a.includes(k))).toEqual([]);
  });
  it('uses the same {placeholders} in both languages', () => {
    const pe = placeholders(en);
    const pa = placeholders(ar);
    for (const key of Object.keys(pe)) expect([key, pa[key]]).toEqual([key, pe[key]]);
  });
  it('has no empty strings or lorem ipsum', () => {
    const text = JSON.stringify([en, ar]);
    expect(text.toLowerCase()).not.toContain('lorem');
    expect(text).not.toMatch(/:\s*""/);
  });
});
