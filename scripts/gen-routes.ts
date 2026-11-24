// Generates scripts/routes.json (static routes + per-route EN meta) for the post-build step.
import { writeFileSync } from 'node:fs';
import en from '../src/i18n/en.json';
import { SERVICES } from '../src/data/services';
import { TECHNICIANS } from '../src/data/technicians';
import { REGIONS } from '../src/data/regions';

const fill = (s: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), s);
const m = en.meta;

const routes = [
  { path: '/', ...m.home },
  { path: '/services', ...m.services },
  ...SERVICES.map((s) => ({
    path: `/services/${s.slug}`,
    title: fill(m.service.title, { service: s.title.en, price: `${s.price} OMR` }),
    description: fill(m.service.description, { service: s.title.en, price: `${s.price} OMR` }),
  })),
  { path: '/technicians', ...m.technicians },
  ...TECHNICIANS.map((t) => ({
    path: `/technicians/${t.id}`,
    title: fill(m.technician.title, { name: t.name.en }),
    description: fill(m.technician.description, {
      name: t.name.en,
      region: REGIONS.find((r) => r.id === t.region)!.name.en,
      rating: t.rating,
    }),
  })),
  { path: '/bookings', ...m.bookings, noindex: true },
  { path: '/join', ...m.join },
  { path: '/partners', ...m.partners },
  { path: '/how-it-works', ...m.howItWorks },
  { path: '/about', ...m.about },
  { path: '/faq', ...m.faq },
  { path: '/contact', ...m.contact },
  { path: '/login', ...m.login, noindex: true },
  { path: '/signup', ...m.signup, noindex: true },
  { path: '/forgot-password', ...m.forgot, noindex: true },
  { path: '/privacy', ...m.privacy },
  { path: '/terms', ...m.terms },
  { path: '/cancellation-refund', ...m.cancellation },
  { path: '/credits', ...m.credits },
];
writeFileSync(new URL('./routes.json', import.meta.url), JSON.stringify(routes, null, 2));
console.log(`routes.json: ${routes.length} routes`);
