// Visual QA: screenshots of every page at 390 / 768 / 1440 px in EN and AR → docs/screenshots/
// Usage: node scripts/screenshots.mjs [baseUrl] [--quick]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'http://localhost:4173/mansoorah';
const quick = process.argv.includes('--quick');
const only = process.argv
  .find((a) => a.startsWith('--only='))
  ?.slice(7)
  .split(',');
const PAGES = [
  ['home', '/'],
  ['services', '/services'],
  ['service-detail', '/services/smart-door-lock'],
  ['book', '/book/smart-door-lock'],
  ['confirm', '/book/smart-door-lock/confirm'],
  ['success', '/booking/SEED/success'],
  ['bookings', '/bookings'],
  ['rate', '/rate/SEED'],
  ['technicians', '/technicians'],
  ['technician-profile', '/technicians/hamed-alhinai'],
  ['join', '/join'],
  ['partners', '/partners'],
  ['how-it-works', '/how-it-works'],
  ['about', '/about'],
  ['faq', '/faq'],
  ['contact', '/contact'],
  ['login', '/login'],
  ['signup', '/signup'],
  ['forgot-password', '/forgot-password'],
  ['privacy', '/privacy'],
  ['terms', '/terms'],
  ['cancellation-refund', '/cancellation-refund'],
  ['credits', '/credits'],
  ['404', '/this-page-does-not-exist'],
].filter(([n]) => !only || only.includes(n));
const WIDTHS = quick ? [390, 1440] : [390, 768, 1440];
const LANGS = ['en', 'ar'];
const year = new Date().getFullYear();

await mkdir('docs/screenshots', { recursive: true });
const browser = await chromium.launch();
const problems = [];
for (const lang of LANGS) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await ctx.addInitScript(
      ([l]) => {
        try {
          localStorage.setItem('mansoorah.v1.lang', l);
          const today = new Date();
          const iso = (d) => d.toISOString().slice(0, 10);
          const t = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 12);
          localStorage.setItem(
            'mansoorah.v1.draft',
            JSON.stringify({ slug: 'smart-door-lock', techId: 'hamed-alhinai', date: iso(t), slot: '18:00' }),
          );
        } catch {
          /* storage unavailable */
        }
      },
      [lang],
    );
    const page = await ctx.newPage();
    for (const [name, path] of PAGES) {
      const p = path.replace('SEED', name === 'rate' ? `MNS-${year}-0392` : `MNS-${year}-0417`);
      await page.goto(`${base}${p}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(250);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) problems.push(`${lang} ${width} ${name}: horizontal overflow ${overflow}px`);
      await page.screenshot({ path: `docs/screenshots/${name}-${lang}-${width}.png`, fullPage: true });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(problems.length ? problems.join('\n') : 'No horizontal overflow detected');
