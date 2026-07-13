import type { Page } from "@playwright/test";

/**
 * link rel="canonical"
 *
 * Check that `link[rel="canonical"]` points to the expected absolute URL.
 *
 * ## Why is this important?
 *
 * Canonical annotations help search engines consolidate duplicate URLs and choose the preferred URL for indexing. Without a correct canonical, parameterized URLs, trailing-slash variants, and locale duplicates can split ranking signals.
 *
 * ## How to use this matcher?
 *
 * `toHaveCanonical(expected)` reads `link[rel="canonical"]` via a Playwright locator and compares its `href` with the expected absolute URL.
 *
 * ```typescript
 * import { test, expect } from "@/test/seokit";
 *
 * test("/en", async ({ page }) => {
 *   await page.goto("/en");
 *   await expect(page).toHaveCanonical(`${process.env.NEXT_PUBLIC_SITE_URL}/en`);
 * });
 * ```
 *
 * With `createSeokitPageRoutes`, keep the expectation explicit:
 *
 * ```typescript
 * await expect(page).toHaveCanonical(route.absoluteUrl(baseURL));
 * ```
 *
 * ## Further reading
 *
 * - [Google Search Central — Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
 * - [Google Search Central — Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
 */
export async function toHaveCanonical(page: Page, expected: string | RegExp) {
  const selector = 'link[rel="canonical"]';
  const actual = await page.locator(selector).getAttribute("href");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected canonical: ${expected}\nReceived: ${actual}`,
  };
}
