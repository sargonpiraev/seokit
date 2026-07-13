import type { Page } from "@playwright/test";

/**
 * meta property="og:image"
 *
 * Check that `og:image` matches the expected value.
 *
 * ## Why is this important?
 *
 * Primary image used in Open Graph previews.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphImage(expected)` reads `meta[property="og:image"]` content.

 * ```typescript
 * await expect(page).toHaveOpenGraphImage(expected);
 * ```

 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphImage(page: Page, expected: string | RegExp) {
  const selector = 'meta[property="og:image"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected og:image: ${expected}\nReceived: ${actual}`,
  };
}
