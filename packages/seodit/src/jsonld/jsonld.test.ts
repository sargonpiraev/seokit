import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { assertJsonLdType, assertValidJsonLd, getJsonLdTypes } from "./index.js";

const html = `<!doctype html>
<html>
  <head>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Organization", "name": "Anidex" },
          { "@type": ["TVSeries", "CreativeWork"], "name": "Fullmetal Alchemist" }
        ]
      }
    </script>
  </head>
</html>`;

describe("JSON-LD assertions", () => {
  it("collects types from @graph and @type arrays", () => {
    assert.deepEqual(getJsonLdTypes(html), ["Organization", "TVSeries", "CreativeWork"]);
  });

  it("checks a single JSON-LD type", () => {
    assert.equal(assertJsonLdType(html, "Organization").length, 0);
    assert.equal(assertJsonLdType(html, "BreadcrumbList").length, 1);
  });

  it("reports invalid JSON-LD", () => {
    const invalid = `<script type="application/ld+json">{ invalid }</script>`;

    assert.equal(assertValidJsonLd(invalid).length, 1);
  });
});
