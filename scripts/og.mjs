// Renders the 1200×630 Open Graph image with Playwright (uses the self-hosted fonts).
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const font = async (p) => (await readFile(p)).toString('base64');
const jakarta = await font('node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-800-normal.woff2');
const inter = await font('node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2');
const plex = await font('node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2');
const mark = await readFile('public/brand/mark.svg', 'utf8');

const html = `<!doctype html><html><head><style>
@font-face{font-family:J;src:url(data:font/woff2;base64,${jakarta})}
@font-face{font-family:I;src:url(data:font/woff2;base64,${inter})}
@font-face{font-family:P;src:url(data:font/woff2;base64,${plex})}
body{margin:0;width:1200px;height:630px;overflow:hidden;font-family:I;color:#fff;
background:radial-gradient(900px 400px at 90% -10%,rgba(0,112,192,.6),transparent 60%),radial-gradient(600px 300px at 0% 110%,rgba(212,168,75,.25),transparent 60%),linear-gradient(135deg,#0B2C6E,#1C5AA6);}
.wrap{padding:80px 90px;position:relative;height:100%;box-sizing:border-box}
.brand{display:flex;align-items:center;gap:24px}
.brand svg{width:120px;height:120px}
.name{font-family:J;font-size:64px;line-height:1}
.ar{font-family:P;font-size:40px;color:#D4A84B;margin-top:8px}
h1{font-family:J;font-size:56px;line-height:1.12;margin:64px 0 0;max-width:900px}
h1 span{color:#F2D493}
p{font-size:26px;color:rgba(255,255,255,.85);margin-top:24px}
.arches{position:absolute;left:0;right:0;bottom:0;opacity:.18}
</style></head><body><div class="wrap">
<div class="brand">${mark}<div><div class="name">Mansoorah</div><div class="ar">منصورة</div></div></div>
<h1>Connecting Omani Homes with <span>Trusted Local</span> Tech Experts</h1>
<p>Smart locks · Cameras · Wi-Fi · Smart lighting — fixed prices in OMR</p>
<svg class="arches" viewBox="0 0 1200 120" preserveAspectRatio="none"><g fill="none" stroke="#fff" stroke-width="2">
${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 120 + 14} 120 V70 Q${i * 120 + 14} 36 ${i * 120 + 60} 26 Q${i * 120 + 106} 36 ${i * 120 + 106} 70 V120"/>`).join('')}
</g></svg></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.waitForTimeout(300);
await page.screenshot({ path: 'public/brand/og-image.png' });
await browser.close();
console.log('og-image.png written');
