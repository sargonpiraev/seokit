import type { Page } from "@playwright/test";

/**
 * meta property="og:url"
 *
 * Check that `og:url` matches the expected value.
 *
 * ## Why is this important?
 *
 * Canonical Open Graph URL for the shared page.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphUrl(expected)` reads `meta[property="og:url"]` content.

 * ```typescript
 * await expect(page).toHaveOpenGraphUrl(expected);
 * ```

 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphUrl(page: Page, expected: string | RegExp) {
  const selector = 'meta[property="og:url"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected og:url: ${expected}\nReceived: ${actual}`,
  };
}
