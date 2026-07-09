import type { Page } from "@playwright/test";

/**
 * meta property="og:site_name"
 *
 * Check that `og:site_name` matches the expected value.
 *
 * ## Why is this important?
 *
 * Site name shown in Open Graph previews.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphSiteName(expected)` reads `meta[property="og:site_name"]` content.

 * ```typescript
 * await expect(page).toHaveOpenGraphSiteName(expected);
 * ```

 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphSiteName(page: Page, expected: string | RegExp) {
  const selector = 'meta[property="og:site_name"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected og:site_name: ${expected}\nReceived: ${actual}`,
  };
}
