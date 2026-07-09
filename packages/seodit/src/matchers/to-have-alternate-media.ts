import type { Page } from "@playwright/test";

/**
 * link rel="alternate" media
 *
 * Check that a media alternate points to the expected URL.
 *
 * ## Why is this important?
 *
 * Media alternates point crawlers to alternate representations such as AMP or print variants.
 *
 * ## How to use this matcher?
 *
 * `toHaveAlternateMedia(media, expected)` reads `link[rel="alternate"][media="…"]` href.

 * ```typescript
 * await expect(page).toHaveAlternateMedia("only screen and (max-width: 640px)", url);
 * ```

 */
export async function toHaveAlternateMedia(page: Page, media: string, expected: string | RegExp) {
  const selector = `link[rel="alternate"][media="${media}"]`;
  const actual = await page.locator(selector).getAttribute("href");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected alternate media: ${expected}\nReceived: ${actual}`,
  };
}
