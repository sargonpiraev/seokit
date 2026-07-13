import type { Page } from "@playwright/test";

/**
 * meta name="twitter:image"
 *
 * Check that `twitter:image` matches the expected value.
 *
 * ## Why is this important?
 *
 * Image used in Twitter/X card previews.
 *
 * ## How to use this matcher?
 *
 * `toHaveTwitterImage(expected)` reads `meta[name="twitter:image"]` content.

 * ```typescript
 * await expect(page).toHaveTwitterImage(expected);
 * ```

 *
 * ## Further reading
 *
 * - [X Card markup](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup)
 */
export async function toHaveTwitterImage(page: Page, expected: string | RegExp) {
  const selector = 'meta[name="twitter:image"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected twitter:image: ${expected}\nReceived: ${actual}`,
  };
}
