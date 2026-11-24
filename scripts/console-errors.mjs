// Debug helper: prints console errors for a URL. Usage: node scripts/console-errors.mjs <url>
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
p.on('console', (m) => m.type() === 'error' && console.log('console:', m.text().slice(0, 400)));
p.on('pageerror', (e) => console.log('pageerror:', e.message.slice(0, 400)));
await p.goto(process.argv[2], { waitUntil: 'networkidle' });
await b.close();
