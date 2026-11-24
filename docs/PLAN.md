# Mansoorah – build plan

## Sitemap
| Route | Page |
|---|---|
| `/` | Home (hero, services, package, how it works, pillars, technicians, coverage map, sample reviews, call-outs, FAQ preview, CTA) |
| `/services` · `/services/:slug` | Catalogue with search/tabs/sort · one SEO landing page per service (8) |
| `/book/:slug` → `/book/:slug/confirm` → `/booking/:id/success` | Booking wizard: specialist + slot → details + payment → confirmation |
| `/bookings` · `/rate/:bookingId` | My Bookings (upcoming/completed/cancelled) · rating flow |
| `/technicians` · `/technicians/:id` | Directory (10 fictional technicians) · profile |
| `/join` · `/partners` | Supply side (Free vs Pro) · retailers & property managers |
| `/how-it-works` · `/about` · `/faq` · `/contact` | Trust & safety · story/team/roadmap · 18 Q&As · contact |
| `/login` · `/signup` · `/forgot-password` | Demo auth |
| `/privacy` · `/terms` · `/cancellation-refund` · `/credits` · `*` | Legal, credits, 404 |

## Components
- **layout/**: Layout, Header (nav, language, theme, auth), Footer, DemoBanner, Breadcrumbs, Seo (title/meta/hreflang/JSON-LD), ScrollToTop, PageHero, OmaniMotif (arches & crenellations).
- **ui/**: Button, Card, Badge, Chip, Stepper, RatingStars, Accordion, Tabs, Modal, Toast, EmptyState, Skeleton, Field, Logo, Reveal (motion), Toc.
- **service/**: ServiceCard, ServiceArt (SVG illustrations), PackageBanner, PriceCard.
- **technician/**: TechCard, Avatar (generated SVG portrait), VerifiedBadge, RatingBars.
- **booking/**: BookingSummary, DatePicker, SlotPicker, PaymentMethods, TrustStrip, BookingCard.
- **home/**: Hero, HowItWorks, Pillars, Coverage (Oman SVG map), Testimonials, CalloutPair, FaqPreview, CtaBand.

## Data model (`src/data`)
- `Service { slug, category, price, priceNote?, duration{min,max}, popularity, icon, title/short/description: L10n, included[4], prepare[3], faq[3] }`
- `Technician { id, name: L10n, gender, regions[], skills: slug[], rating, reviews, years, jobs, availableToday, availableTomorrow, pro, bio: L10n }`
- `Region { id, name: L10n, wilayats: {id, name: L10n}[] }` – Muscat, Al Batinah North/South, Dhofar.
- `Booking { id, slug, techId, date (ISO), slot, customer{name, phone, governorate, wilayat, address…}, payment, status, total, createdAt, rating? }` stored in `localStorage` under `mansoorah.v1.*`.
- `Faq`, `Review`, `TeamMember` – localized `{ en, ar }` fields.

## Build phases
0. Scaffold, tokens, fonts, Logo, layout, i18n, routing, CI.
1. Home, Services, Service details.
2. Booking wizard, My Bookings, Rate.
3. Technicians, Join, Partners.
4. How It Works, About, FAQ, Contact, Auth, legal, 404, Credits.
5. SEO (per-route static HTML, sitemap, robots, JSON-LD, hreflang), PWA, performance, a11y, Arabic review.
6. Unit + E2E tests, screenshots, audit, deploy.

## Risks
| Risk | Mitigation |
|---|---|
| GitHub Pages SPA deep links 404 | Post-build writes a real `index.html` per static route + `404.html` redirect fallback for dynamic ids. |
| Cannot create the GitHub repo from this cloud session | Owner creates empty `mansoorah` repo; session attaches it and pushes; Pages enabled via repo-scoped API or Settings. |
| Stock photo APIs need keys | Original SVG illustrations (allowed fallback in §9); credited on `/credits`. |
| Arabic quality / RTL bugs | Logical CSS properties only, flipped directional icons, AR screenshots at 3 widths, key-parity test. |
| JS budget (< 250 KB gzip) | Route-level `lazy()`, manual chunks, lucide per-icon imports, framer-motion only in light places. |
| Misleading content | Demo banner, “Sample reviews” labels, fictional technicians with illustrated avatars, “Commercial registration: in progress”. |
