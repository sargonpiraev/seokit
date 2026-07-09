import type { Page } from "@playwright/test";

/**
 * meta name="twitter:title"
 *
 * Check that `twitter:title` matches the expected value.
 *
 * ## Why is this important?
 *
 * Title used in Twitter/X card previews.
 *
 * ## How to use this matcher?
 *
 * `toHaveTwitterTitle(expected)` reads `meta[name="twitter:title"]` content.

 * ```typescript
 * await expect(page).toHaveTwitterTitle(expected);
 * ```

 *
 * ## Further reading
 *
 * - [X Card markup](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup)
 */
export async function toHaveTwitterTitle(page: Page, expected: string | RegExp) {
  const selector = 'meta[name="twitter:title"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected twitter:title: ${expected}\nReceived: ${actual}`,
  };
}
