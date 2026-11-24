# Connecting Mansoorah to Supabase (real accounts + admin)

Until these steps are done the site runs in **demo mode** (data stays in each visitor's browser).
Everything here is on Supabase's **free plan** — no card needed.

## 1. Create the project (≈ 3 min)
1. Go to https://supabase.com → **Start your project** → sign in with GitHub.
2. **New project** → name `mansoorah`, choose a strong database password (keep it to yourself), region closest to Oman (e.g. *Middle East* or *Central EU*), plan **Free** → **Create**.

## 2. Create the tables (≈ 1 min)
1. In the project: **SQL Editor** → **New query**.
2. Paste the whole content of [`supabase/schema.sql`](../supabase/schema.sql) → **Run**. You should see “Success. No rows returned”.

This creates `profiles`, `bookings` and `requests` with row-level security:
customers only see their own bookings; only the admin sees everything.
**`saeedsami559@gmail.com` automatically becomes the admin** when it signs up on the site.

## 3. Auth settings (≈ 1 min)
**Authentication → URL Configuration**
- **Site URL:** `https://saeedsami559-prog.github.io/mansoorah/`
- **Redirect URLs → Add URL:** `https://saeedsami559-prog.github.io/mansoorah/**`

**Authentication → Sign In / Providers → Email**
- Recommended while you start: turn **Confirm email** *off*. Supabase's built-in e-mail sender is limited to a few e-mails per hour; with confirmation on, new users may wait for the e-mail. Turn it back on once you connect your own SMTP (Authentication → Emails → SMTP settings).

## 4. Send the two public values
**Project Settings → API** (or **Data API**):
- **Project URL** – looks like `https://abcdxyz.supabase.co`
- **anon public** key – a long text starting with `eyJ…`

Both are **public by design** (they are visible in every visitor's browser; the security comes from the rules in step 2).
⚠️ **Never** share the `service_role` key or the database password.

They go into `.env.production` in the repo:
```
VITE_SUPABASE_URL=https://abcdxyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
Push → GitHub Actions rebuilds the site with real accounts.

## 5. Create the admin account
Open the live site → **Log in → Sign up** with `saeedsami559@gmail.com` and a password **you** choose → a **Admin** button appears in the header → `/admin`.
The password is never stored in the code or visible to anyone, including the developers.

To make another e-mail admin later, run in the SQL Editor:
```sql
update public.profiles set role = 'admin' where email = 'someone@example.com';
```
