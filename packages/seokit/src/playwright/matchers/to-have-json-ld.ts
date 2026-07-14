import type { Page } from "@playwright/test";
import { matchJsonLd, type JsonLdExpected } from "../../core/jsonld/match.js";

export async function toHaveJsonLd(page: Page, expected: JsonLdExpected) {
  const scripts = await page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (script) => script.textContent ?? "",
    ),
  );
  const result = matchJsonLd(scripts, expected);

  return {
    pass: result.pass,
    message: () =>
      result.pass
        ? "Expected page JSON-LD not to match, but it did"
        : `Expected page JSON-LD to match\n${result.message}`,
  };
}
