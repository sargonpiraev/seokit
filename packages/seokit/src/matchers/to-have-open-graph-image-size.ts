import type { Page } from "@playwright/test";

/**
 * og:image width / height
 *
 * Check that Open Graph image dimensions match the expected width and/or height.
 *
 * ## Why is this important?
 *
 * Explicit image dimensions help social platforms render previews without layout shifts and avoid cropping surprises.
 *
 * ## How to use this matcher?
 *
 * `toHaveOpenGraphImageSize({ width, height })` reads `og:image:width` and/or `og:image:height`.
 *
 * ```typescript
 * await expect(page).toHaveOpenGraphImageSize({ width: 1200, height: 630 });
 * ```
 *
 * ## Further reading
 *
 * - [Open Graph protocol](https://ogp.me/)
 */
export async function toHaveOpenGraphImageSize(
  page: Page,
  expected: { width?: number | string; height?: number | string },
) {
  const parts: string[] = [];

  if (expected.width !== undefined) {
    const actual = await page.locator('meta[property="og:image:width"]').getAttribute("content");
    const value = String(expected.width);
    if (actual !== value) parts.push(`width expected ${value}, received ${actual}`);
  }

  if (expected.height !== undefined) {
    const actual = await page.locator('meta[property="og:image:height"]').getAttribute("content");
    const value = String(expected.height);
    if (actual !== value) parts.push(`height expected ${value}, received ${actual}`);
  }

  const pass = parts.length === 0;

  return {
    pass,
    message: () => `Expected og:image size\n${parts.join("\n")}`,
  };
}
