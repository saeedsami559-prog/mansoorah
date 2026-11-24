# Roadmap – from prototype (v1) to live service (v2)

v1 (this repo) is a static, bilingual prototype: no backend, no real payments, no real accounts, no personal data leaves the visitor’s browser.

## v2 path

| Area | Plan |
|---|---|
| Auth & database | **Supabase** (Postgres + Auth). Tables: `customers`, `technicians`, `services`, `bookings`, `ratings`, `payouts`. Row-level security so customers only see their bookings and technicians only their jobs. Phone OTP sign-in for Omani numbers. Host the project in a region that satisfies the PDPL review. |
| Booking engine | Real technician calendars replace the deterministic demo slots (`src/lib/slots.ts` keeps the same interface). Server-side check that a slot is still free at confirmation. |
| Payments | **Thawani checkout** (hosted page) + OmanNet through a bank acquirer; webhooks mark bookings as paid. Cash on completion stays. No card data touches Mansoorah. |
| Notifications | WhatsApp Business API templates for confirmation, day-before reminder and rating request (replaces the manual `wa.me` hand-off). |
| Admin dashboard | Booking queue, technician verification workflow (ID, background check, skills test, training), complaints, refunds, payouts, featured/Pro listings. |
| Technician mobile app | Job list, navigation, check-in/out, photos of completed work, earnings and weekly payout statements. |
| Analytics | Connect the existing `track()` hook to a privacy-friendly, cookieless tool after consent review. |
| Growth | Maintenance plans for families and landlords; more governorates (Ad Dakhiliyah, Ash Sharqiyah…); retailer QR referral tracking with real commissions. |
