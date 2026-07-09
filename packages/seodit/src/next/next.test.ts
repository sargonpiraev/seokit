import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  manifestKeyToRoutePattern,
  readNextPageRoutes,
  specFileToManifestKey,
} from "./manifest.js";
import { createSeoditPageRoutes } from "./routes.js";
import { checkSeoditSpecCoverage } from "./coverage.js";
import {
  assertSeoditRouteBasics,
  type SeoditRouteBasicsExpect,
} from "./assertions.js";

const fixtureDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "__fixtures__");
const routing = {
  locales: ["en", "ru"],
  defaultLocale: "en",
} as const;

describe("next manifest helpers", () => {
  it("maps colocated spec files to manifest keys", () => {
    const key = specFileToManifestKey("/project/src/app/[locale]/anime/page.seodit.spec.ts");
    assert.equal(key, "/[locale]/anime/page");
    assert.equal(manifestKeyToRoutePattern(key!), "/[locale]/anime");
  });

  it("reads page routes from Next build manifest", () => {
    const routes = readNextPageRoutes({ buildDir: fixtureDir });
    assert.deepEqual(routes, ["/", "/[locale]", "/[locale]/anime", "/[locale]/anime/[malId]"]);
  });
});

describe("createSeoditPageRoutes", () => {
  it("expands locales for static localized routes", () => {
    const specUrl = new URL("./__fixtures__/project/src/app/[locale]/anime/page.seodit.spec.ts", import.meta.url);
    const routes = createSeoditPageRoutes(routing, specUrl.href, {
      buildDir: fixtureDir,
      origin: "http://localhost:3000",
    });

    assert.deepEqual(
      routes.map((route) => route.pathname),
      ["/en/anime", "/ru/anime"],
    );
    assert.equal(routes[0]?.absoluteUrl(), "http://localhost:3000/en/anime");
    assert.deepEqual(routes[0]?.alternates(), [
      { locale: "en", url: "http://localhost:3000/en/anime" },
      { locale: "ru", url: "http://localhost:3000/ru/anime" },
    ]);
    assert.equal(routes[0]?.xDefaultUrl(), "http://localhost:3000/en/anime");
  });

  it("applies dynamic params for localized detail routes", () => {
    const specUrl = new URL(
      "./__fixtures__/project/src/app/[locale]/anime/[malId]/page.seodit.spec.ts",
      import.meta.url,
    );
    const routes = createSeoditPageRoutes(routing, specUrl.href, {
      buildDir: fixtureDir,
      params: [{ malId: "1" }],
    });

    assert.deepEqual(
      routes.map((route) => route.pathname),
      ["/en/anime/1", "/ru/anime/1"],
    );
  });

  it("asserts route basics with canonical and hreflang alternates", async () => {
    const specUrl = new URL("./__fixtures__/project/src/app/[locale]/anime/page.seodit.spec.ts", import.meta.url);
    const [route] = createSeoditPageRoutes(routing, specUrl.href, {
      buildDir: fixtureDir,
      origin: "http://localhost:3000",
    });
    const calls: string[] = [];
    const expect: SeoditRouteBasicsExpect = () => ({
      async toHaveHtmlLang(expected) {
        calls.push(`lang:${expected}`);
      },
      async toHaveCanonical(expected) {
        calls.push(`canonical:${expected}`);
      },
      async toHaveSelfAlternate(locale, expected) {
        calls.push(`self:${locale}:${expected}`);
      },
      async toHaveXDefaultAlternate(expected) {
        calls.push(`x-default:${expected}`);
      },
      async toHaveAlternate(locale, expected) {
        calls.push(`alternate:${locale}:${expected}`);
      },
    });

    await assertSeoditRouteBasics(expect, {} as never, route!);

    assert.deepEqual(calls, [
      "lang:en",
      "canonical:http://localhost:3000/en/anime",
      "self:en:http://localhost:3000/en/anime",
      "x-default:http://localhost:3000/en/anime",
      "alternate:en:http://localhost:3000/en/anime",
      "alternate:ru:http://localhost:3000/ru/anime",
    ]);
  });
});

describe("checkSeoditSpecCoverage", () => {
  it("warns when manifest routes are missing colocated specs", () => {
    const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "__fixtures__", "project");
    const result = checkSeoditSpecCoverage({
      projectRoot,
      buildDir: fixtureDir,
    });

    assert.ok(result.missingSpecs.includes("/[locale]"));
    assert.ok(result.warnings.some((warning) => warning.includes("/[locale]")));
  });
});
