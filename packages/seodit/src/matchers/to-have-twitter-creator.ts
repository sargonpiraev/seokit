import type { Page } from "@playwright/test";

/**
 * meta name="twitter:creator"
 *
 * Check that `twitter:creator` matches the expected value.
 *
 * ## Why is this important?
 *
 * Twitter/X @username of the content creator.
 *
 * ## How to use this matcher?
 *
 * `toHaveTwitterCreator(expected)` reads `meta[name="twitter:creator"]` content.

 * ```typescript
 * await expect(page).toHaveTwitterCreator(expected);
 * ```

 *
 * ## Further reading
 *
 * - [X Card markup](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup)
 */
export async function toHaveTwitterCreator(page: Page, expected: string | RegExp) {
  const selector = 'meta[name="twitter:creator"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected twitter:creator: ${expected}\nReceived: ${actual}`,
  };
}
