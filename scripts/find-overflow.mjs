// Debug helper: lists elements that stick out past the viewport. Usage: node scripts/find-overflow.mjs <url> [width]
import { chromium } from 'playwright';
const [url, width] = [process.argv[2], Number(process.argv[3] || 390)];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' });
const res = await p.evaluate((w) => {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.right > w + 1 && r.width > 0) {
      let hidden = false;
      for (let a = el.parentElement; a; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.overflowX !== 'visible') {
          hidden = true;
          break;
        }
      }
      if (!hidden)
        out.push(
          `${el.tagName}.${(el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0, 80)} right=${Math.round(r.right)}`,
        );
    }
  }
  return out.slice(0, 12);
}, width);
console.log(res.join('\n'));
await b.close();
