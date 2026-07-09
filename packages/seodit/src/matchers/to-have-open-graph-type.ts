import type { Page } from "@playwright/test";

/**
 * meta property="og:type"
 *
 * Check that `og:type` matches the expected value.
 *
 * ## Why is this important?
 *
 * Open Graph object type such as website or article.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphType(expected)` reads `meta[property="og:type"]` content.

 * ```typescript
 * await expect(page).toHaveOpenGraphType(expected);
 * ```

 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphType(page: Page, expected: string | RegExp) {
  const selector = 'meta[property="og:type"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected og:type: ${expected}\nReceived: ${actual}`,
  };
}
