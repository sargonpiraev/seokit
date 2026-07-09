import type { Page } from "@playwright/test";

/**
 * meta property="og:video"
 *
 * Check that `og:video` matches the expected value.
 *
 * ## Why is this important?
 *
 * Video URL used in Open Graph previews.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphVideo(expected)` reads `meta[property="og:video"]` content.

 * ```typescript
 * await expect(page).toHaveOpenGraphVideo(expected);
 * ```

 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphVideo(page: Page, expected: string | RegExp) {
  const selector = 'meta[property="og:video"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected og:video: ${expected}\nReceived: ${actual}`,
  };
}
