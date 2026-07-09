import type { Page } from "@playwright/test";

/**
 * meta property="og:description"
 *
 * Check that `og:description` matches the expected value.
 *
 * ## Why is this important?
 *
 * Open Graph description used when the page is shared.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphDescription(expected)` reads `meta[property="og:description"]` content.

 * ```typescript
 * await expect(page).toHaveOpenGraphDescription(expected);
 * ```

 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphDescription(page: Page, expected: string | RegExp) {
  const selector = 'meta[property="og:description"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected og:description: ${expected}\nReceived: ${actual}`,
  };
}
