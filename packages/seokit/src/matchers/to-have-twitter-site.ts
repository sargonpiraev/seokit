import type { Page } from "@playwright/test";

/**
 * meta name="twitter:site"
 *
 * Check that `twitter:site` matches the expected value.
 *
 * ## Why is this important?
 *
 * Twitter/X @username of the site.
 *
 * ## How to use this matcher?
 *
 * `toHaveTwitterSite(expected)` reads `meta[name="twitter:site"]` content.

 * ```typescript
 * await expect(page).toHaveTwitterSite(expected);
 * ```

 *
 * ## Further reading
 *
 * - [X Card markup](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup)
 */
export async function toHaveTwitterSite(page: Page, expected: string | RegExp) {
  const selector = 'meta[name="twitter:site"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected twitter:site: ${expected}\nReceived: ${actual}`,
  };
}
