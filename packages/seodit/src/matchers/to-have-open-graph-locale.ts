import type { Page } from "@playwright/test";

/**
 * meta property="og:locale"
 *
 * Check that `og:locale` matches the expected value.
 *
 * ## Why is this important?
 *
 * Locale of the Open Graph object.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphLocale(expected)` reads `meta[property="og:locale"]` content.

 * ```typescript
 * await expect(page).toHaveOpenGraphLocale(expected);
 * ```

 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphLocale(page: Page, expected: string | RegExp) {
  const selector = 'meta[property="og:locale"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected og:locale: ${expected}\nReceived: ${actual}`,
  };
}
