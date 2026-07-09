import type { Page } from "@playwright/test";

/**
 * link rel="alternate" type
 *
 * Check that a typed alternate points to the expected URL.
 *
 * ## Why is this important?
 *
 * Typed alternates expose alternate formats such as RSS or Atom feeds.
 *
 * ## How to use this matcher?
 *
 * `toHaveAlternateType(type, expected)` reads `link[rel="alternate"][type="…"]` href.

 * ```typescript
 * await expect(page).toHaveAlternateType("application/rss+xml", feedUrl);
 * ```

 */
export async function toHaveAlternateType(page: Page, type: string, expected: string | RegExp) {
  const selector = `link[rel="alternate"][type="${type}"]`;
  const actual = await page.locator(selector).getAttribute("href");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected alternate type: ${expected}\nReceived: ${actual}`,
  };
}
