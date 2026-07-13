import type { Page } from "@playwright/test";

/**
 * meta name="twitter:card"
 *
 * Check that `twitter:card` matches the expected value.
 *
 * ## Why is this important?
 *
 * Twitter card type such as summary_large_image.
 *
 * ## How to use this matcher?
 *
 * `toHaveTwitterCard(expected)` reads `meta[name="twitter:card"]` content.

 * ```typescript
 * await expect(page).toHaveTwitterCard(expected);
 * ```

 *
 * ## Further reading
 *
 * - [X Card markup](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup)
 */
export async function toHaveTwitterCard(page: Page, expected: string | RegExp) {
  const selector = 'meta[name="twitter:card"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected twitter:card: ${expected}\nReceived: ${actual}`,
  };
}
