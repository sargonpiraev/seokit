import type { Page } from "@playwright/test";

/**
 * meta name="googlebot"
 *
 * Check that `meta[name="googlebot"]` includes the expected index/follow tokens.
 *
 * ## Why is this important?
 *
 * Googlebot-specific robots directives override or refine the general robots meta for Google Search.
 *
 * ## How to use this matcher?
 *
 * `toHaveGoogleBotMeta({ index, follow })` reads `meta[name="googlebot"]` and checks for `index`/`noindex` and `follow`/`nofollow`.
 *
 * ```typescript
 * await expect(page).toHaveGoogleBotMeta({ index: true, follow: true });
 * ```
 *
 * ## Further reading
 *
 * - [Google Search Central — Robots meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
 */
export async function toHaveGoogleBotMeta(
  page: Page,
  expected: { index?: boolean; follow?: boolean },
) {
  const selector = 'meta[name="googlebot"]';
  const content = await page.locator(selector).getAttribute("content");
  const tokens = new Set(
    (content ?? "")
      .split(",")
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean),
  );
  const missing: string[] = [];

  if (expected.index !== undefined) {
    const token = expected.index ? "index" : "noindex";
    if (!tokens.has(token)) missing.push(token);
  }

  if (expected.follow !== undefined) {
    const token = expected.follow ? "follow" : "nofollow";
    if (!tokens.has(token)) missing.push(token);
  }

  const pass = content !== null && content.length > 0 && missing.length === 0;

  return {
    pass,
    message: () =>
      `Expected googlebot meta tokens: ${missing.join(", ") || "<present>"}\nReceived: ${content}`,
  };
}
