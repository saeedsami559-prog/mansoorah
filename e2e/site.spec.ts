import { expect, test, type Page } from '@playwright/test';

async function setLang(page: Page, lang: 'en' | 'ar') {
  await page.addInitScript((l) => {
    try {
      if (!sessionStorage.getItem('e2e-init')) {
        localStorage.clear();
        localStorage.setItem('mansoorah.v1.lang', l);
        sessionStorage.setItem('e2e-init', '1');
      }
    } catch {
      /* ignore */
    }
  }, lang);
}

const L = {
  en: {
    services: 'Services',
    book: 'Book This Service',
    confirm: 'Confirm Booking',
    ok: 'Booking confirmed!',
    bookings: 'View My Bookings',
    completed: 'Completed',
    rate: 'Rate',
    submit: 'Submit Rating',
    thanks: 'Thank you for your rating!',
    menu: 'Open menu',
  },
  ar: {
    services: 'الخدمات',
    book: 'احجز هذه الخدمة',
    confirm: 'تأكيد الحجز',
    ok: 'تم تأكيد الحجز!',
    bookings: 'عرض حجوزاتي',
    completed: 'المكتملة',
    rate: 'تقييم',
    submit: 'إرسال التقييم',
    thanks: 'شكرًا لتقييمك!',
    menu: 'فتح القائمة',
  },
} as const;

for (const lang of ['en', 'ar'] as const) {
  test(`full booking journey (${lang})`, async ({ page }) => {
    const s = L[lang];
    await setLang(page, lang);
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Home → Services (via mobile menu)
    await page.getByRole('button', { name: s.menu }).click();
    await page.locator('#mobile-menu').getByRole('link', { name: s.services, exact: true }).click();
    await expect(page).toHaveURL(/\/services$/);

    // Services → Smart Door Lock (price consistent: 25 everywhere)
    const card = page.locator('[data-service="smart-door-lock"]');
    await expect(card.locator('[data-price]')).toHaveAttribute('data-price', '25');
    await card.getByRole('link').click();
    await expect(page).toHaveURL(/\/services\/smart-door-lock$/);
    await expect(page.locator('[data-price-card] [data-price]')).toHaveAttribute('data-price', '25');
    await page.getByRole('link', { name: s.book }).click();

    // Choose technician, date and time
    await expect(page).toHaveURL(/\/book\/smart-door-lock$/);
    await page.locator('[data-tech-option]').first().click();
    const slot = page.locator('[data-slot][data-state="available"]').first();
    await expect(slot).toBeVisible();
    await slot.click();
    await expect(page.locator('[data-total]')).toHaveAttribute('data-total', '25');
    await page.getByTestId('continue').click();

    // Details: validation errors first, then fill in
    await expect(page).toHaveURL(/\/confirm$/);
    await page.getByTestId('confirm-booking').click();
    await expect(page.getByRole('alert')).toBeVisible();
    await page.locator('#name').fill(lang === 'ar' ? 'عائشة الحارثية' : 'Aisha Al-Harthy');
    await page.locator('#phone').fill('8123');
    await page.locator('#area').click();
    await expect(page.locator('#phone-error')).toBeVisible();
    await page.locator('#phone').fill('9123 4567');
    await page.locator('#governorate').selectOption('muscat');
    await page.locator('#wilayat').selectOption('seeb');
    await page.locator('#area').fill(lang === 'ar' ? 'الموالح الجنوبية' : 'Al Mawaleh South');
    await page.locator('#house').fill('27');
    await page.locator('[data-payment="thawani"]').click();
    await expect(
      page
        .getByRole('note')
        .filter({ hasText: lang === 'ar' ? 'تجريبي' : 'Demo' })
        .first(),
    ).toBeVisible();
    await page.locator('input[name="terms"]').check();
    await page.getByRole('button', { name: s.confirm }).click();

    // Success
    await expect(page).toHaveURL(/\/booking\/MNS-\d{4}-\d{4}\/success$/);
    await expect(page.getByRole('heading', { name: s.ok })).toBeVisible();
    const id = (await page.getByTestId('booking-id').textContent())!.trim();
    expect(id).toMatch(/^MNS-\d{4}-\d{4}$/);
    const wa = page
      .locator('a[href^="https://wa.me/"]')
      .filter({ hasText: lang === 'ar' ? 'واتساب' : 'WhatsApp' })
      .first();
    expect(decodeURIComponent((await wa.getAttribute('href'))!)).toContain(id);
    await expect(page.locator('[data-referral]')).toBeVisible();

    // My Bookings → mark completed (demo) → Rate
    await page.getByRole('link', { name: s.bookings }).click();
    const mine = page.locator(`[data-booking="${id}"]`);
    await expect(mine).toBeVisible();
    await mine.getByRole('button', { name: lang === 'ar' ? 'تعيين كمكتمل (تجريبي)' : 'Mark as completed (demo)' }).click();
    await expect(page.getByRole('tab', { name: new RegExp(s.completed) })).toHaveAttribute('aria-selected', 'true');
    await page.locator(`[data-booking="${id}"]`).getByRole('link', { name: s.rate, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/rate/${id}$`));
    await page.getByRole('button', { name: s.submit }).click();
    await expect(page.locator('.field-error')).toBeVisible();
    await page.locator('[data-star="5"]').click();
    await expect(page.getByTestId('rating-chip')).toHaveText('5.0 / 5');
    await page.getByRole('button', { name: s.submit }).click();
    await expect(page.getByRole('heading', { name: s.thanks })).toBeVisible();
  });
}

test('keyboard-only booking selection works', async ({ page }) => {
  await setLang(page, 'en');
  await page.goto('./book/wifi-network');
  await page.locator('input[name="technician"]').first().focus();
  await page.keyboard.press('Space');
  await expect(page.locator('input[name="technician"]').first()).toBeChecked();
  const slot = page.locator('[data-slot][data-state="available"]').first();
  await slot.focus();
  await page.keyboard.press('Enter');
  await expect(slot).toHaveAttribute('aria-checked', 'true');
  await page.getByTestId('continue').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/confirm$/);
});

test('login validation and demo sign-in', async ({ page }) => {
  await setLang(page, 'en');
  await page.goto('./login');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByText('Enter a valid e-mail address.')).toBeVisible();
  await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible();
  await page.locator('#l-email').fill('aisha.harthy@example.com');
  await page.locator('#l-password').fill('secret-pass');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(page.locator('#l-password')).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page).toHaveURL(/\/bookings$/);
  const stored = await page.evaluate(() => localStorage.getItem('mansoorah.v1.auth') ?? '');
  expect(stored).not.toContain('secret-pass');
  expect(stored).not.toContain('aisha.harthy@example.com');
});

test('signup validation (AR)', async ({ page }) => {
  await setLang(page, 'ar');
  await page.goto('./signup');
  await page.locator('#s-password').fill('12345678');
  await page.locator('#s-confirm').fill('87654321');
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();
  await expect(page.getByText('كلمتا المرور غير متطابقتين.')).toBeVisible();
  await expect(page.getByText('يُرجى إدخال الاسم الكامل.')).toBeVisible();
  await expect(page.getByText('أدخل رقم هاتف عُماني صحيحًا (8 أرقام تبدأ بـ 7 أو 9).')).toBeVisible();
});

test('language toggle keeps you on the same page', async ({ page }) => {
  await setLang(page, 'en');
  await page.goto('./services/wifi-network');
  await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
  await expect(page).toHaveURL(/\/services\/wifi-network\/?$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('إعداد وتحسين شبكة الواي فاي المنزلية');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Home Wi-Fi Setup & Optimization');
});

test('no broken internal links, consistent prices, no lorem ipsum', async ({ page }) => {
  await setLang(page, 'en');
  const seen = new Set<string>();
  const queue = ['/mansoorah/'];
  const bad: string[] = [];
  const prices: Record<string, Set<string>> = {};
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`${page.url()}: ${e.message}`));
  while (queue.length) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await page.goto(`http://localhost:4173${path}`);
    expect(res?.status(), path).toBeLessThan(400);
    await page.waitForLoadState('networkidle');
    if (await page.getByRole('heading', { name: 'This page took a wrong turn' }).count()) bad.push(path);
    const body = (await page.locator('body').innerText()).toLowerCase();
    expect(body, path).not.toContain('lorem');
    expect(body, path).not.toContain('coming soon');
    for (const el of await page.locator('[data-service]').all()) {
      const slug = (await el.getAttribute('data-service'))!;
      const price = await el.locator('[data-price]').getAttribute('data-price');
      (prices[slug] ??= new Set()).add(price!);
    }
    const hrefs = await page
      .locator('a[href^="/mansoorah/"]')
      .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).pathname));
    for (const h of hrefs) if (!seen.has(h) && !queue.includes(h) && !/\/(book|booking|rate)\//.test(h)) queue.push(h);
  }
  expect(bad).toEqual([]);
  expect(errors).toEqual([]);
  expect(seen.size).toBeGreaterThan(30);
  for (const [slug, set] of Object.entries(prices)) expect([slug, set.size]).toEqual([slug, 1]);
});
