import { expect, test, type Page } from '@playwright/test';

const consentCookie = async (page: Page) =>
  (await page.context().cookies()).find((c) => c.name === 'bm_consent');

test.describe('cookie consent', () => {
  test('banner offers equal choices and "reject" stores a denial @mobile', async ({ page }) => {
    await page.goto('/en');
    const banner = page.getByRole('region', { name: 'Cookies, honestly.' });
    await expect(banner).toBeVisible();
    const accept = banner.getByRole('button', { name: 'Accept all' });
    const reject = banner.getByRole('button', { name: 'Reject optional' });
    // Same visual weight: identical classes.
    expect(await accept.getAttribute('class')).toBe(await reject.getAttribute('class'));
    await reject.click();
    await expect(banner).toBeHidden();
    const c = await consentCookie(page);
    expect(decodeURIComponent(c!.value)).toMatch(/\|p0a0m0$/);
    expect((await page.context().cookies()).find((x) => x.name === 'bm_locale')).toBeUndefined();
    await page.reload();
    await expect(page.getByRole('region', { name: 'Cookies, honestly.' })).toHaveCount(0);
  });

  test('preferences can be granted and later withdrawn', async ({ page }) => {
    await page.goto('/pt-pt');
    await page.getByRole('button', { name: 'Personalizar' }).click();
    const dialog = page.getByRole('dialog', { name: 'Preferências de cookies' });
    await expect(dialog).toBeVisible();
    const prefSwitch = dialog.getByRole('switch', { name: 'Preferências' });
    await expect(prefSwitch).toHaveAttribute('aria-checked', 'false');
    await prefSwitch.click();
    await expect(prefSwitch).toHaveAttribute('aria-checked', 'true');
    await dialog.getByRole('button', { name: 'Guardar escolhas' }).click();
    await expect(dialog).toBeHidden();
    expect(decodeURIComponent((await consentCookie(page))!.value)).toMatch(/\|p1a0m0$/);
    expect((await page.context().cookies()).find((x) => x.name === 'bm_locale')?.value).toBe(
      'pt-pt',
    );

    // Withdraw from the footer control.
    await page.getByRole('button', { name: 'Definições de cookies' }).click();
    await expect(dialog).toBeVisible();
    await expect(prefSwitch).toHaveAttribute('aria-checked', 'true');
    await dialog.getByRole('button', { name: 'Rejeitar opcionais' }).click();
    expect(decodeURIComponent((await consentCookie(page))!.value)).toMatch(/\|p0a0m0$/);
    expect((await page.context().cookies()).find((x) => x.name === 'bm_locale')).toBeUndefined();
  });

  test('preferences dialog closes with Escape and returns focus', async ({ page }) => {
    await page.goto('/en');
    const trigger = page.getByRole('button', { name: 'Customise' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Cookie preferences' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    // Banner is back (no decision was made) and nothing was stored.
    await expect(page.getByRole('region', { name: 'Cookies, honestly.' })).toBeVisible();
    expect(await consentCookie(page)).toBeUndefined();
  });

  test('cookie policy opens in an accessible modal from the banner', async ({ page }) => {
    await page.goto('/en');
    await page
      .getByRole('region', { name: 'Cookies, honestly.' })
      .getByRole('button', { name: 'Cookie policy' })
      .click();
    const dialog = page.getByRole('dialog', { name: 'Cookie policy' });
    await expect(dialog).toBeVisible();
    await expect(
      dialog
        .getByRole('cell', { name: 'bm_consent' })
        .or(dialog.getByRole('rowheader', { name: 'bm_consent' })),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('no third-party requests and no cookies before consent', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (u.hostname !== 'localhost') external.push(r.url());
    });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    expect(external).toEqual([]);
    expect(await page.context().cookies()).toEqual([]);
  });
});
