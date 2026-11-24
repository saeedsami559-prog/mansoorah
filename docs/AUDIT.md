# Pre-deploy audit — Mansoorah v1

**Result: PASS** (with the deployment caveat in §5)

## 1. READ
A bilingual (EN/AR, full RTL) static website for **Mansoorah**, a UTAS UNEP2109 student venture that connects Omani homeowners with verified Omani technicians for smart-home installation and tech maintenance at fixed OMR prices. It lets visitors browse 8 services and a package, pick a technician and slot, book (demo), manage and rate bookings, and lets technicians and partners apply — so the team can demo and validate the business before registration.

## 2. ANALYSE — brief vs. build
**Built as specified:** all routes in §7 (24 page types, 35 static URLs), EN/AR dictionaries with typed `t()`, exact catalogue prices and the 55 OMR package, booking wizard with step indicator, Friday-limited 14-day picker, `MNS-YYYY-XXXX` IDs, `.ics`, WhatsApp hand-offs, My Bookings tabs/actions, rating flow, 10 fictional technicians, Join (Free vs Pro), Partners (two forms, QR card), legal pages, credits, 404, demo banner, demo auth without stored passwords, light/dark themes, PWA, SEO (per-route titles, OG/Twitter, sitemap, robots, hreflang, `Service`/`FAQPage`/`ItemList`/`HowTo` JSON-LD, no `LocalBusiness`), Vitest + Playwright, GitHub Actions deploy workflow, compliance checklist, roadmap.

**Deviations (deliberate):**
| Brief | What we did | Why |
|---|---|---|
| Royalty-free photos from Unsplash/Pexels | Original SVG illustrations for every service and the package | Image APIs need keys and the CC0 alternatives were low quality; §9 allows SVG fallback. Lighter and on-brand. |
| Oman SVG map | Styled region cards | An accurate governorate map could not be guaranteed; §7.1 allows cards. |
| “All dates in the future” | Upcoming sample booking is in the future; the *completed* sample booking is necessarily in the past | Needed to demo the Rate flow. All dates are generated relative to today. |
| `noindex` on booking step | Booking step is indexable; confirm/success/my-bookings/rate/auth are `noindex` | The `/book/:slug` page has a unique, useful title; SEO gate ≥ 95. |
| framer-motion for scroll reveals | IntersectionObserver + CSS for reveals; framer-motion only for the success animation (lazy chunk) | Kept first-load JS small (≈112 KB gzip) and Lighthouse Performance ≥ 90. |
| Repo created with `gh repo create` | Owner must create the empty repo (see §5) | This cloud session cannot create repositories. |

**Added beyond the brief:** real scannable QR code on the partner card; demo “mark as completed” so the full journey can be tested; female technicians for households that prefer them; per-route static HTML so deep links return HTTP 200 with correct meta tags; error boundary; Arabic dictionary lazy-loaded; WebP screenshots; Lighthouse script and reports.

## 3. AUDIT — safety and honesty
- **Secrets/keys:** none in the repo (grep for keys, tokens, private keys: clean). No `.env` files.
- **Private emails/phones:** none. Contact values are explicit placeholders (`+968 0000 0000` is an impossible Omani number; `hello@mansoorah.example` uses a reserved domain). Input placeholders use the pattern `9XXX XXXX`.
- **Data sent without consent:** none. No backend, no analytics, no third-party scripts or font CDNs. Forms store locally and show a consent line; sending happens only when the visitor clicks a WhatsApp/e-mail button that opens their own app.
- **Payments:** none. Online methods are labelled “Demo – no real payment is taken”.
- **Passwords:** never stored (E2E test asserts the password and e-mail are absent from storage; only a SHA-256 hash of the e-mail is kept).
- **Fake legal claims:** none. No CR/licence numbers, Maroof badge, awards, press logos or partner brands. Footer says “Commercial registration: in progress”. Reviews are labelled “Sample reviews (prototype)”; technicians are labelled fictional, with illustrated avatars and names that are not the team’s.

## 4. DEBUG — one real booking at 390 px, both languages
Automated in `e2e/site.spec.ts` and run against the production build:
Home → mobile menu → Services → Smart Door Lock (25 OMR on card, detail and total) → choose technician, date, slot → confirm form (validation errors shown and announced, invalid phone rejected, governorate → wilayat) → Thawani demo label → terms → **Booking confirmed** with `MNS-2026-XXXX` and WhatsApp summary containing the ID → My Bookings → mark completed → Rate (star required, `5.0 / 5`) → thank-you. **Passed in EN and AR.**

Bugs found and fixed during the audit:
1. Technician profile pages crashed (signed bit-shift produced a negative array index in sample reviews) → fixed, unit test added, crawl test now fails on any page error, error boundary added.
2. Untouched form fields produced a generic “Required” message instead of the translated one → empty defaults on every form.
3. Blur-time validation shifted the submit button so clicks could miss → forms validate on submit, then live.
4. Header controls and booking date scroller overflowed at 390 px (CSS layer order, grid `min-width`) → fixed; overflow check runs on all 144 screenshots.
5. Duration ranges reversed in Arabic (“90–60”) → bidi isolate.
6. Lighthouse CLS 0.58 from the lazy-route fallback → full-height fallback, font preloads, lighter first load.

## 5. Gates
| Gate | Status |
|---|---|
| Build, typecheck, ESLint, Prettier | ✅ 0 errors |
| Vitest | ✅ 35/35 |
| Playwright E2E (EN+AR) | ✅ 7/7 |
| Lighthouse mobile (Home, Services, Service details, Booking) | ✅ Perf 90–92 · A11y 100 · BP 100 · SEO 100 |
| Accessibility (keyboard booking, focus rings, labels, `aria-live` errors/toasts, non-colour status) | ✅ |
| Visual QA (24 pages × 3 widths × 2 languages, no horizontal overflow) | ✅ |
| Content QA (one price per service, demo labels, no lorem ipsum, no broken links) | ✅ |
| **Deployment** | ⚠️ Blocked on the owner creating the empty `mansoorah` repository on GitHub — this session cannot create repositories. Workflow, Pages config and README are ready. |
