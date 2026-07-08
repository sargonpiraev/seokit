import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  assertAlternate,
  assertCanonical,
  assertHtmlLang,
  assertMetaDescription,
  assertMetaTitle,
  assertOpenGraphImage,
  assertOpenGraphTitle,
  assertRobotsMeta,
  assertTwitterCard,
  assertXDefaultAlternate,
} from "./assertions.js";

const html = `<!doctype html>
<html lang="en">
  <head>
    <title>Anime title | Anidex</title>
    <meta name="description" content="Anime description" />
    <link rel="canonical" href="https://anidex.tv/en/anime/5114" />
    <link rel="alternate" hreflang="en" href="https://anidex.tv/en/anime/5114" />
    <link rel="alternate" hreflang="ru" href="https://anidex.tv/ru/anime/5114" />
    <link rel="alternate" hreflang="x-default" href="https://anidex.tv/en/anime/5114" />
    <meta property="og:title" content="Anime title | Anidex" />
    <meta property="og:image" content="https://anidex.tv/og/anime/5114" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="robots" content="index, follow" />
  </head>
  <body></body>
</html>`;

describe("HTML SEO assertions", () => {
  it("passes matching granular metadata checks", () => {
    assert.equal(assertMetaTitle(html, "Anime title | Anidex").length, 0);
    assert.equal(assertMetaDescription(html, "Anime description").length, 0);
    assert.equal(assertCanonical(html, "https://anidex.tv/en/anime/5114").length, 0);
    assert.equal(assertAlternate(html, "ru", "https://anidex.tv/ru/anime/5114").length, 0);
    assert.equal(assertXDefaultAlternate(html, "https://anidex.tv/en/anime/5114").length, 0);
    assert.equal(assertOpenGraphTitle(html, "Anime title | Anidex").length, 0);
    assert.equal(assertOpenGraphImage(html, "https://anidex.tv/og/anime/5114").length, 0);
    assert.equal(assertTwitterCard(html, "summary_large_image").length, 0);
    assert.equal(assertRobotsMeta(html, { index: true, follow: true }).length, 0);
    assert.equal(assertHtmlLang(html, "en").length, 0);
  });

  it("reports a focused issue for a mismatch", () => {
    const issues = assertCanonical(html, "https://anidex.tv/en/anime/1");

    assert.equal(issues.length, 1);
    assert.equal(issues[0]?.field, "canonical");
    assert.equal(issues[0]?.actual, "https://anidex.tv/en/anime/5114");
  });
});
