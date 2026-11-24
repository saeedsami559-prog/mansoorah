/**
 * Live-mode tests: the site is built with Supabase settings pointing at a fake project, and every
 * request to it is answered by an in-memory Supabase stand-in below. This checks the real account,
 * booking-sync and admin code paths without touching a real database.
 * Run with: LIVE_URL=http://localhost:4174/mansoorah/ npx playwright test e2e/live.spec.ts
 */
import { expect, test, type Page, type Route } from '@playwright/test';

const LIVE = process.env.LIVE_URL;
test.skip(!LIVE, 'LIVE_URL not set (build with VITE_SUPABASE_URL=https://fake.supabase.co)');

type Row = Record<string, unknown>;
const db = {
  users: [] as { id: string; email: string; password: string; meta: Row }[],
  profiles: [] as Row[],
  bookings: [] as Row[],
  requests: [] as Row[],
};
const ADMIN = 'saeedsami559@gmail.com';

function tokenFor(id: string) {
  // Unsigned JWT-shaped token (supabase-js only decodes it, never verifies it client-side).
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600, role: 'authenticated' })}.sig`;
}
function session(u: (typeof db.users)[number]) {
  return {
    access_token: tokenFor(u.id),
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: `r-${u.id}`,
    user: {
      id: u.id,
      aud: 'authenticated',
      role: 'authenticated',
      email: u.email,
      user_metadata: u.meta,
      identities: [{ id: u.id }],
      app_metadata: {},
    },
  };
}
function userFromAuth(route: Route) {
  const auth = route.request().headers()['authorization'] ?? '';
  const payload = auth.split('.')[1];
  if (!payload) return null;
  try {
    const sub = JSON.parse(Buffer.from(payload, 'base64url').toString()).sub as string;
    return db.users.find((u) => u.id === sub) ?? null;
  } catch {
    return null;
  }
}
const isAdmin = (id?: string) => db.profiles.some((p) => p.id === id && p.role === 'admin');

async function fakeSupabase(page: Page) {
  await page.route('https://fake.supabase.co/**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const json = (status: number, body: unknown) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    const body = req.postData() ? JSON.parse(req.postData()!) : {};
    const me = userFromAuth(route);

    if (url.pathname === '/auth/v1/signup') {
      if (db.users.some((u) => u.email === body.email)) return json(422, { msg: 'User already registered' });
      const u = { id: `u${db.users.length + 1}`, email: body.email, password: body.password, meta: body.data ?? {} };
      db.users.push(u);
      db.profiles.push({
        id: u.id,
        email: u.email,
        full_name: u.meta.full_name ?? '',
        phone: u.meta.phone ?? '',
        role: u.email === ADMIN ? 'admin' : u.meta.role === 'technician' ? 'technician' : 'customer',
        created_at: new Date().toISOString(),
      });
      return json(200, session(u));
    }
    if (url.pathname === '/auth/v1/token') {
      const u = db.users.find((x) => x.email === body.email && x.password === body.password);
      return u ? json(200, session(u)) : json(400, { error: 'invalid_grant', error_description: 'Invalid login credentials' });
    }
    if (url.pathname === '/auth/v1/user') return me ? json(200, session(me).user) : json(401, { msg: 'no user' });
    if (url.pathname === '/auth/v1/logout') return route.fulfill({ status: 204 });

    const table = url.pathname.replace('/rest/v1/', '') as 'profiles' | 'bookings' | 'requests';
    const rows = db[table];
    const eq = [...url.searchParams.entries()].filter(([, v]) => v.startsWith('eq.')).map(([k, v]) => [k, v.slice(3)]);
    const visible = (r: Row) =>
      table === 'requests' ? isAdmin(me?.id) : isAdmin(me?.id) || (table === 'profiles' ? r.id === me?.id : r.user_id === me?.id);
    const match = (r: Row) => eq.every(([k, v]) => String(r[k]) === v) && visible(r);

    if (req.method() === 'GET') {
      const found = rows.filter(match);
      if ((req.headers()['accept'] ?? '').includes('vnd.pgrst.object'))
        return found[0] ? json(200, found[0]) : json(406, { message: 'none' });
      return json(200, found);
    }
    if (req.method() === 'POST') {
      const items = Array.isArray(body) ? body : [body];
      for (const it of items) {
        if (table === 'bookings' && it.user_id !== me?.id) return json(403, { message: 'rls' });
        rows.push({ ...it, id: it.id ?? rows.length + 1, status: it.status ?? 'new', created_at: new Date().toISOString() });
      }
      return route.fulfill({ status: 201 });
    }
    if (req.method() === 'PATCH') {
      const target = rows.filter(match);
      if (table === 'bookings' && body.status === 'completed' && !isAdmin(me?.id))
        return json(400, { message: 'Only the admin can complete' });
      target.forEach((r) => Object.assign(r, body));
      return route.fulfill({ status: 204 });
    }
    return json(404, {});
  });
}

async function signUp(page: Page, email: string, name: string) {
  await page.goto(`${LIVE}signup`);
  await page.locator('#s-name').fill(name);
  await page.locator('#s-email').fill(email);
  await page.locator('#s-phone').fill('94797747');
  await page.locator('#s-password').fill('a-strong-pass');
  await page.locator('#s-confirm').fill('a-strong-pass');
  await page.locator('input[name="consent"]').check();
  await page.getByRole('button', { name: 'Create account' }).click();
}

test.describe.configure({ mode: 'serial' });

test('customer account: book, log out, log back in and the booking is still there; admin manages it', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('init')) {
      localStorage.clear();
      localStorage.setItem('mansoorah.v1.lang', 'en');
      sessionStorage.setItem('init', '1');
    }
  });
  await fakeSupabase(page);

  // Guests are asked to log in at the confirm step.
  await page.goto(`${LIVE}book/wifi-network`);
  await page.locator('[data-tech-option]').first().click();
  await page.locator('[data-slot][data-state="available"]').first().click();
  await page.getByTestId('continue').click();
  await expect(page.getByRole('heading', { name: 'Log in to confirm your booking' })).toBeVisible();

  // Sign up → returns to the confirm step with name and phone pre-filled.
  await page.getByRole('link', { name: 'Sign up' }).first().click();
  await page.locator('#s-name').fill('Aisha Al-Harthy');
  await page.locator('#s-email').fill('aisha@example.com');
  await page.locator('#s-phone').fill('91234567');
  await page.locator('#s-password').fill('a-strong-pass');
  await page.locator('#s-confirm').fill('a-strong-pass');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByText('Please accept the Privacy Notice to create an account.')).toBeVisible();
  await page.locator('input[name="consent"]').check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/book\/wifi-network\/confirm$/);
  await expect(page.locator('#name')).toHaveValue('Aisha Al-Harthy');

  await page.locator('#governorate').selectOption('muscat');
  await page.locator('#wilayat').selectOption('seeb');
  await page.locator('#area').fill('Al Mawaleh South');
  await page.locator('#house').fill('27');
  await page.locator('input[name="terms"]').check();
  await page.getByTestId('confirm-booking').click();
  await expect(page.getByRole('heading', { name: 'Booking confirmed!' })).toBeVisible();
  const id = (await page.getByTestId('booking-id').textContent())!.trim();
  expect(db.bookings.map((b) => b.id)).toContain(id);

  // No demo samples or demo "mark completed" button for real accounts.
  await page.goto(`${LIVE}bookings`);
  await expect(page.locator('[data-booking]')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Mark as completed (demo)' })).toHaveCount(0);

  // Log out → bookings hidden; wrong password rejected; log back in → booking is back.
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.locator('#mobile-menu').getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/\/mansoorah\/?$/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('mansoorah.v1.session'))).toBeNull();
  await page.goto(`${LIVE}bookings`);
  await expect(page.getByRole('heading', { name: 'Log in to see your bookings' })).toBeVisible();
  await page.goto(`${LIVE}login?next=%2Fbookings`);
  await page.locator('#l-email').fill('aisha@example.com');
  await page.locator('#l-password').fill('wrong-password');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Wrong e-mail or password.');
  await page.locator('#l-password').fill('a-strong-pass');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page).toHaveURL(/\/bookings$/);
  await expect(page.locator(`[data-booking="${id}"]`)).toBeVisible();

  // A non-admin cannot open the dashboard.
  await page.goto(`${LIVE}admin`);
  await expect(page.getByText('This page is for the Mansoorah admin only.')).toBeVisible();

  // Admin (the team e-mail) signs up, sees the booking and marks it completed.
  await page.evaluate(() => localStorage.removeItem('mansoorah.v1.session'));
  await signUp(page, ADMIN, 'Said Albalushi');
  await page.goto(`${LIVE}admin`);
  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();
  const row = page.locator(`[data-admin-booking="${id}"]`);
  await expect(row).toContainText('Aisha Al-Harthy');
  await row.getByRole('button', { name: 'Mark completed' }).click();
  await expect(row).toContainText('Completed');
  expect(db.bookings.find((b) => b.id === id)?.status).toBe('completed');
  await page.getByRole('tab', { name: /Accounts/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('aisha@example.com');

  // The customer can now rate it.
  await page.evaluate(() => localStorage.removeItem('mansoorah.v1.session'));
  await page.goto(`${LIVE}login?next=${encodeURIComponent(`/rate/${id}`)}`);
  await page.locator('#l-email').fill('aisha@example.com');
  await page.locator('#l-password').fill('a-strong-pass');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await page.locator('[data-star="5"]').click();
  await page.getByRole('button', { name: 'Submit Rating' }).click();
  await expect(page.getByRole('heading', { name: 'Thank you for your rating!' })).toBeVisible();
  expect((db.bookings.find((b) => b.id === id)?.rating as { stars: number }).stars).toBe(5);
});

test('contact form is saved for the admin', async ({ page }) => {
  await fakeSupabase(page);
  await page.goto(`${LIVE}contact`);
  await page.locator('#c-name').fill('Hilal Al-Rawahi');
  await page.locator('#c-phone').fill('92345678');
  await page.locator('#c-message').fill('I would like a quote for 10 apartments.');
  await page.getByRole('button', { name: 'Prepare message' }).click();
  await expect(page.getByText('Message ready')).toBeVisible();
  expect(db.requests.some((r) => r.kind === 'contact')).toBe(true);
});
