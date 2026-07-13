import type { Page } from "@playwright/test";

/**
 * meta property="og:image:alt"
 *
 * Check that `og:image:alt` matches the expected value.
 *
 * ## Why is this important?
 *
 * Accessible alt text for the Open Graph image.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphImageAlt(expected)` reads `meta[property="og:image:alt"]` content.

 * ```typescript
 * await expect(page).toHaveOpenGraphImageAlt(expected);
 * ```

 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphImageAlt(page: Page, expected: string | RegExp) {
  const selector = 'meta[property="og:image:alt"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected og:image:alt: ${expected}\nReceived: ${actual}`,
  };
}
