import type { Page } from "@playwright/test";

/**
 * meta name="robots"
 *
 * Check that `meta[name="robots"]` includes the expected index/follow tokens.
 *
 * ## Why is this important?
 *
 * Robots meta controls whether search engines may index the page and follow its links.
 *
 * ## How to use this matcher?
 *
 * `toHaveRobotsMeta({ index, follow })` reads `meta[name="robots"]` and checks for `index`/`noindex` and `follow`/`nofollow`.
 *
 * ```typescript
 * await expect(page).toHaveRobotsMeta({ index: true, follow: true });
 * ```
 *
 * ## Further reading
 *
 * - [Google Search Central — Robots meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
 */
export async function toHaveRobotsMeta(
  page: Page,
  expected: { index?: boolean; follow?: boolean },
) {
  const selector = 'meta[name="robots"]';
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
      `Expected robots meta tokens: ${missing.join(", ") || "<present>"}\nReceived: ${content}`,
  };
}
