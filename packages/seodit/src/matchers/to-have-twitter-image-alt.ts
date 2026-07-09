import type { Page } from "@playwright/test";

/**
 * meta name="twitter:image:alt"
 *
 * Check that `twitter:image:alt` matches the expected value.
 *
 * ## Why is this important?
 *
 * Accessible alt text for the Twitter/X card image.
 *
 * ## How to use this matcher?
 *
 * `toHaveTwitterImageAlt(expected)` reads `meta[name="twitter:image:alt"]` content.

 * ```typescript
 * await expect(page).toHaveTwitterImageAlt(expected);
 * ```

 *
 * ## Further reading
 *
 * - [X Card markup](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup)
 */
export async function toHaveTwitterImageAlt(page: Page, expected: string | RegExp) {
  const selector = 'meta[name="twitter:image:alt"]';
  const actual = await page.locator(selector).getAttribute("content");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected twitter:image:alt: ${expected}\nReceived: ${actual}`,
  };
}
