import type { Page } from "@playwright/test";

/**
 * html lang="…"
 *
 * Check that the root `html[lang]` matches the page locale.
 *
 * ## Why is this important?
 *
 * The root `<html>` element declares the primary language of the page:
 *
 * ```html
 * <html lang="en">
 * ```
 *
 * The value is a [BCP 47](https://www.w3.org/International/articles/language-tags/) language tag — for example `en`, `ru`, or `pt-BR`. On a localized site, `/en/…` should render `lang="en"` and `/ru/…` should render `lang="ru"`.
 *
 * - **Screen readers** use `lang` to pick pronunciation and voice.
 * - **Browsers** use it for hyphenation, fonts, and translation hints.
 * - **Multilingual sites** should keep `lang` aligned with the locale in the URL.
 *
 * `lang` complements `hreflang` alternates — it does not replace them.
 *
 * ## How to use this matcher?
 *
 * `toHaveHtmlLang(expected)` reads `html[lang]` via a Playwright locator and compares it with the expected language tag.
 *
 * ```typescript
 * import { test, expect } from "@/test/seokit";
 *
 * test("/en", async ({ page }) => {
 *   await page.goto("/en");
 *   await expect(page).toHaveHtmlLang("en");
 * });
 * ```
 *
 * ## Further reading
 *
 * - [MDN — `lang` global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
 * - [W3C — Declaring language in HTML](https://www.w3.org/International/questions/qa-html-language-declarations)
 */
export async function toHaveHtmlLang(page: Page, expected: string | RegExp) {
  const actual = await page.locator("html").getAttribute("lang");
  const pass = typeof expected === "string" ? actual === expected : !!actual && expected.test(actual);

  return {
    pass,
    message: () => `Expected html lang: ${expected}\nReceived: ${actual}`,
  };
}
