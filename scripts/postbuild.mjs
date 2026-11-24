// Post-build for GitHub Pages:
// 1. writes a real index.html for every static route (deep links return 200, with per-route <title>/<meta>),
// 2. generates sitemap.xml and robots.txt.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import routes from './routes.json' with { type: 'json' };

const DIST = 'dist';
const SITE = 'https://saeedsami559-prog.github.io/mansoorah';
const today = new Date().toISOString().slice(0, 10);

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const { readdir } = await import('node:fs/promises');
const assets = await readdir(join(DIST, 'assets'));
const preloadFonts = ['inter-latin-400-normal', 'plus-jakarta-sans-latin-800-normal']
  .map((f) => assets.find((a) => a.startsWith(f) && a.endsWith('.woff2')))
  .filter(Boolean)
  .map((f) => `    <link rel="preload" href="/mansoorah/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n');
let shell = await readFile(join(DIST, 'index.html'), 'utf8');
shell = shell.replace('</head>', `${preloadFonts}\n  </head>`);
await writeFile(join(DIST, 'index.html'), shell);

for (const r of routes) {
  if (r.path === '/') continue;
  const url = `${SITE}${r.path}`;
  const html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(r.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escape(r.description)}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escape(r.title)}"`)
    .replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${escape(r.description)}"`,
    )
    .replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`);
  const dir = join(DIST, r.path);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html);
}

const indexable = routes.filter((r) => !r.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${indexable
  .map((r) => {
    const loc = `${SITE}${r.path === '/' ? '/' : r.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${loc}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${loc}?lang=ar"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>
    <priority>${r.path === '/' ? '1.0' : r.path.startsWith('/services') ? '0.9' : '0.6'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;
await writeFile(join(DIST, 'sitemap.xml'), sitemap);
await writeFile(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /mansoorah/book/\nDisallow: /mansoorah/booking/\nDisallow: /mansoorah/rate/\n\nSitemap: ${SITE}/sitemap.xml\n`,
);
console.log(`postbuild: ${routes.length - 1} route pages, sitemap with ${indexable.length} URLs`);
