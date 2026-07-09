import type { Page } from "@playwright/test";

/**
 * meta property="og:title"
 *
 * Check that `og:title` matches the expected value.
 *
 * ## Why is this important?
 *
 * Open Graph title used when the page is shared.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphTitle(expected)` reads `meta[property="og:title"]` content.

 * ```typescript
 * await expect(page).toHaveOpenGraphTitle(expected);
 * ```

 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphTitle(page: Page, expected: string | RegExp) {
  const selector = 'meta[property="og:title"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected og:title: ${expected}\nReceived: ${actual}`,
  };
}
