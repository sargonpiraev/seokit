import type { Page } from "@playwright/test";

/**
 * meta name="twitter:description"
 *
 * Check that `twitter:description` matches the expected value.
 *
 * ## Why is this important?
 *
 * Description used in Twitter/X card previews.
 *
 * ## How to use this matcher?
 *
 * `toHaveTwitterDescription(expected)` reads `meta[name="twitter:description"]` content.

 * ```typescript
 * await expect(page).toHaveTwitterDescription(expected);
 * ```

 *
 * ## Further reading
 *
 * - [X Card markup](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup)
 */
export async function toHaveTwitterDescription(page: Page, expected: string | RegExp) {
  const selector = 'meta[name="twitter:description"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected twitter:description: ${expected}\nReceived: ${actual}`,
  };
}
