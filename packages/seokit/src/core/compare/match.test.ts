import assert from "node:assert/strict";
import { test } from "node:test";
import { collectMatchDiffs, matchesExpected } from "./match.js";
import { matchJsonLd } from "../jsonld/match.js";
import { parseRobotsContent } from "../metadata/parse-robots.js";

test("matchesExpected deep-partial and RegExp", () => {
  assert.equal(matchesExpected({ a: 1, b: 2 }, { a: 1 }), true);
  assert.equal(matchesExpected("hello", /hel/), true);
  assert.equal(matchesExpected("hello", /x/), false);
});

test("collectMatchDiffs reports missing leaves", () => {
  const diffs = collectMatchDiffs(
    { title: "A", alternates: { canonical: "/a" } },
    { title: "B", alternates: { canonical: "https://example.com/a" } },
  );
  assert.ok(diffs.some((diff) => diff.path === "title"));
  assert.ok(diffs.some((diff) => diff.path === "alternates.canonical"));
});

test("parseRobotsContent", () => {
  assert.deepEqual(parseRobotsContent("index, follow"), { index: true, follow: true });
  assert.deepEqual(parseRobotsContent("noindex"), { index: false });
  assert.equal(parseRobotsContent(null), null);
});

test("matchJsonLd type and deep-partial", () => {
  const scripts = [
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Acme",
    }),
  ];
  assert.equal(matchJsonLd(scripts, "Organization").pass, true);
  assert.equal(matchJsonLd(scripts, [{ "@type": "Organization", name: "Acme" }]).pass, true);
  assert.equal(matchJsonLd(scripts, "Product").pass, false);
});
