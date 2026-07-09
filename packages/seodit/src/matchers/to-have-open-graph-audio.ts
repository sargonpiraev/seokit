import type { Page } from "@playwright/test";

/**
 * meta property="og:audio"
 *
 * Check that `og:audio` matches the expected value.
 *
 * ## Why is this important?
 *
 * Audio URL used in Open Graph previews.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphAudio(expected)` reads `meta[property="og:audio"]` content.

 * ```typescript
 * await expect(page).toHaveOpenGraphAudio(expected);
 * ```

 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphAudio(page: Page, expected: string | RegExp) {
  const selector = 'meta[property="og:audio"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected og:audio: ${expected}\nReceived: ${actual}`,
  };
}
