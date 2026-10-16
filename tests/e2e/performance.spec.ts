import { expect, test } from '@playwright/test';
import { decideConsent } from './helpers';

/**
 * Regression guards for scroll / hover smoothness. These check the causes of
 * jank that were fixed (not absolute fps, which depends on the machine).
 */
test.describe('scroll & hover performance guards', () => {
  test.beforeEach(async ({ context, baseURL }) => decideConsent(context, baseURL!));

  test('header does not flicker on slow, jittery scrolling', async ({ page }) => {
    test.setTimeout(120_000); // ~320 wheel steps
    await page.goto('/en/about');
    await page.evaluate(() => {
      const w = window as unknown as { __log: string[] };
      w.__log = [];
      const h = document.querySelector('[data-site-header]')!;
      new MutationObserver((records) =>
        records.forEach((r) =>
          w.__log.push(`${r.attributeName}:${h.hasAttribute(r.attributeName!)}`),
        ),
      ).observe(h, { attributes: true, attributeFilter: ['data-hidden', 'data-solid', 'class'] });
    });
    const wheel = async (dy: number, n: number) => {
      for (let i = 0; i < n; i++) {
        await page.mouse.wheel(0, dy);
        await page.waitForTimeout(16);
      }
    };
    await wheel(3, 150); // slow scroll down
    await wheel(-2, 10); // inertia bounce
    await wheel(2, 10);
    await wheel(4, 100);
    await wheel(-3, 30); // deliberate scroll up
    await wheel(3, 8); // jitter
    await wheel(-3, 8);
    await wheel(3, 8);
    await page.waitForTimeout(300);
    const log = await page.evaluate(() => (window as unknown as { __log: string[] }).__log);
    expect(log).toEqual(['data-solid:true', 'data-hidden:true', 'data-hidden:false']);
  });

  test('no full-page blend layers or per-word compositing hints', async ({ page }) => {
    await page.goto('/en');
    const offenders = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('body *')]
        .filter((el) => {
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          const big = r.width * r.height > window.innerWidth * window.innerHeight * 0.5;
          return big && cs.mixBlendMode !== 'normal';
        })
        .map((el) => el.className),
    );
    expect(offenders).toEqual([]);
    const promotedWords = await page
      .locator('.word-mask > span')
      .evaluateAll(
        (els) => els.filter((e) => getComputedStyle(e).willChange.includes('transform')).length,
      );
    expect(promotedWords).toBe(0);
  });

  test('hero entrance leaves no lingering animations or filters', async ({ page }) => {
    await page.goto('/en');
    await page.waitForTimeout(3500); // longest entrance is 2.4s + delays
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter(
          (a) =>
            a.playState === 'running' ||
            (a.playState === 'finished' &&
              (a.effect as KeyframeEffect)?.getComputedTiming().fill !== 'backwards'),
        )
        .map((a) => (a as CSSAnimation).animationName ?? 'unknown')
        .filter((n) => n !== 'scroll-cue'),
    );
    expect(running).toEqual([]);
    const filters = await page
      .locator('.hero-layer')
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).filter));
    expect(filters.every((f) => f === 'none')).toBe(true);
  });

  test('project hover does not re-render the list (GSAP-driven preview)', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'hover previews are desktop-only');
    await page.goto('/en');
    const first = page.locator('[data-row] a').first();
    await first.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(1500);
    const before = await page
      .locator('[data-row]')
      .first()
      .evaluate((el) => el.outerHTML);
    await first.hover();
    const card = page.locator('[data-preview-card]').first();
    await expect(card).toHaveCSS('opacity', '1');
    const after = await page
      .locator('[data-row]')
      .first()
      .evaluate((el) => el.outerHTML);
    expect(after).toBe(before); // markup untouched → no React re-render on hover
  });
});
