import type { CheerioAPI } from "cheerio";
import type { ExpectedValue, OpenGraphImageSizeExpectation, RobotsMetaExpectation, SeoIssue } from "../types.js";
import {
  getAlternateHref,
  getAlternateMediaHref,
  getAlternateTypeHref,
  getCanonicalHref,
  getHtmlLang,
  getMetaNameContent,
  getMetaPropertyContent,
  getMetaTitle,
  toCheerio,
  type HtmlInput,
} from "./extract.js";

function matchesExpected(actual: string | undefined, expected: ExpectedValue): boolean {
  if (actual === undefined) return false;
  return typeof expected === "string" ? actual === expected : expected.test(actual);
}

function makeValueIssue(input: {
  id: string;
  field: string;
  selector: string;
  actual: string | undefined;
  expected: ExpectedValue;
}): SeoIssue[] {
  if (matchesExpected(input.actual, input.expected)) return [];

  return [
    {
      id: input.id,
      field: input.field,
      selector: input.selector,
      severity: "error",
      message: `${input.field} did not match expected value`,
      expected: input.expected,
      actual: input.actual,
    },
  ];
}

function makePresenceIssue(input: {
  id: string;
  field: string;
  selector: string;
  actual: string | undefined;
}): SeoIssue[] {
  if (input.actual !== undefined && input.actual.length > 0) return [];

  return [
    {
      id: input.id,
      field: input.field,
      selector: input.selector,
      severity: "error",
      message: `${input.field} was not found`,
      actual: input.actual,
    },
  ];
}

function getRobotsTokens(content: string | undefined): Set<string> {
  return new Set(
    (content ?? "")
      .split(",")
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean),
  );
}

function assertRobotsTokens(input: {
  field: string;
  selector: string;
  content: string | undefined;
  expected: RobotsMetaExpectation;
}): SeoIssue[] {
  const presenceIssues = makePresenceIssue({
    id: `${input.field}.present`,
    field: input.field,
    selector: input.selector,
    actual: input.content,
  });

  if (presenceIssues.length > 0) return presenceIssues;

  const issues: SeoIssue[] = [];
  const tokens = getRobotsTokens(input.content);

  const expectedIndexToken = input.expected.index === undefined ? undefined : input.expected.index ? "index" : "noindex";
  const expectedFollowToken = input.expected.follow === undefined ? undefined : input.expected.follow ? "follow" : "nofollow";

  for (const token of [expectedIndexToken, expectedFollowToken]) {
    if (!token) continue;
    if (tokens.has(token)) continue;

    issues.push({
      id: `${input.field}.${token}`,
      field: input.field,
      selector: input.selector,
      severity: "error",
      message: `${input.field} did not include "${token}"`,
      expected: token,
      actual: input.content,
    });
  }

  return issues;
}

export function assertMetaTitle(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  const $ = toCheerio(input);
  return makeValueIssue({
    id: "title",
    field: "title",
    selector: "title",
    actual: getMetaTitle($),
    expected,
  });
}

export function assertMetaDescription(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  const $ = toCheerio(input);
  return makeValueIssue({
    id: "description",
    field: "description",
    selector: 'meta[name="description"]',
    actual: getMetaNameContent($, "description"),
    expected,
  });
}

export function assertMetaName(input: HtmlInput, name: string, expected: ExpectedValue): SeoIssue[] {
  const $ = toCheerio(input);
  return makeValueIssue({
    id: `meta.${name}`,
    field: `meta.${name}`,
    selector: `meta[name="${name}"]`,
    actual: getMetaNameContent($, name),
    expected,
  });
}

export function assertCanonical(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  const $ = toCheerio(input);
  return makeValueIssue({
    id: "alternates.canonical",
    field: "canonical",
    selector: 'link[rel="canonical"]',
    actual: getCanonicalHref($),
    expected,
  });
}

export function assertAlternate(input: HtmlInput, hreflang: string, expected: ExpectedValue): SeoIssue[] {
  const $ = toCheerio(input);
  return makeValueIssue({
    id: `alternates.languages.${hreflang}`,
    field: `alternate.${hreflang}`,
    selector: `link[rel="alternate"][hreflang="${hreflang}"]`,
    actual: getAlternateHref($, hreflang),
    expected,
  });
}

export function assertSelfAlternate(input: HtmlInput, locale: string, expected: ExpectedValue): SeoIssue[] {
  return assertAlternate(input, locale, expected);
}

export function assertXDefaultAlternate(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertAlternate(input, "x-default", expected);
}

export function assertAlternateMedia(input: HtmlInput, media: string, expected: ExpectedValue): SeoIssue[] {
  const $ = toCheerio(input);
  return makeValueIssue({
    id: `alternates.media.${media}`,
    field: `alternate.media.${media}`,
    selector: `link[rel="alternate"][media="${media}"]`,
    actual: getAlternateMediaHref($, media),
    expected,
  });
}

export function assertAlternateType(input: HtmlInput, type: string, expected: ExpectedValue): SeoIssue[] {
  const $ = toCheerio(input);
  return makeValueIssue({
    id: `alternates.types.${type}`,
    field: `alternate.type.${type}`,
    selector: `link[rel="alternate"][type="${type}"]`,
    actual: getAlternateTypeHref($, type),
    expected,
  });
}

export function assertOpenGraphProperty(input: HtmlInput, property: string, expected: ExpectedValue): SeoIssue[] {
  const $ = toCheerio(input);
  return makeValueIssue({
    id: `openGraph.${property}`,
    field: `openGraph.${property}`,
    selector: `meta[property="${property}"]`,
    actual: getMetaPropertyContent($, property),
    expected,
  });
}

export function assertOpenGraphTitle(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertOpenGraphProperty(input, "og:title", expected);
}

export function assertOpenGraphDescription(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertOpenGraphProperty(input, "og:description", expected);
}

export function assertOpenGraphUrl(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertOpenGraphProperty(input, "og:url", expected);
}

export function assertOpenGraphSiteName(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertOpenGraphProperty(input, "og:site_name", expected);
}

export function assertOpenGraphType(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertOpenGraphProperty(input, "og:type", expected);
}

export function assertOpenGraphLocale(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertOpenGraphProperty(input, "og:locale", expected);
}

export function assertOpenGraphImage(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertOpenGraphProperty(input, "og:image", expected);
}

export function assertOpenGraphImageAlt(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertOpenGraphProperty(input, "og:image:alt", expected);
}

export function assertOpenGraphImageSize(input: HtmlInput, expected: OpenGraphImageSizeExpectation): SeoIssue[] {
  const issues: SeoIssue[] = [];
  if (expected.width !== undefined) {
    issues.push(...assertOpenGraphProperty(input, "og:image:width", String(expected.width)));
  }
  if (expected.height !== undefined) {
    issues.push(...assertOpenGraphProperty(input, "og:image:height", String(expected.height)));
  }
  return issues;
}

export function assertOpenGraphVideo(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertOpenGraphProperty(input, "og:video", expected);
}

export function assertOpenGraphAudio(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertOpenGraphProperty(input, "og:audio", expected);
}

export function assertTwitterMeta(input: HtmlInput, name: string, expected: ExpectedValue): SeoIssue[] {
  const $ = toCheerio(input);
  return makeValueIssue({
    id: `twitter.${name}`,
    field: `twitter.${name}`,
    selector: `meta[name="${name}"]`,
    actual: getMetaNameContent($, name),
    expected,
  });
}

export function assertTwitterCard(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertTwitterMeta(input, "twitter:card", expected);
}

export function assertTwitterTitle(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertTwitterMeta(input, "twitter:title", expected);
}

export function assertTwitterDescription(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertTwitterMeta(input, "twitter:description", expected);
}

export function assertTwitterImage(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertTwitterMeta(input, "twitter:image", expected);
}

export function assertTwitterImageAlt(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertTwitterMeta(input, "twitter:image:alt", expected);
}

export function assertTwitterSite(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertTwitterMeta(input, "twitter:site", expected);
}

export function assertTwitterCreator(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  return assertTwitterMeta(input, "twitter:creator", expected);
}

export function assertRobotsMeta(input: HtmlInput, expected: RobotsMetaExpectation): SeoIssue[] {
  const $ = toCheerio(input);
  return assertRobotsTokens({
    field: "robots",
    selector: 'meta[name="robots"]',
    content: getMetaNameContent($, "robots"),
    expected,
  });
}

export function assertGoogleBotMeta(input: HtmlInput, expected: RobotsMetaExpectation): SeoIssue[] {
  const $ = toCheerio(input);
  return assertRobotsTokens({
    field: "googlebot",
    selector: 'meta[name="googlebot"]',
    content: getMetaNameContent($, "googlebot"),
    expected,
  });
}

export function assertHtmlLang(input: HtmlInput, expected: ExpectedValue): SeoIssue[] {
  const $ = toCheerio(input);
  return makeValueIssue({
    id: "html.lang",
    field: "html.lang",
    selector: "html[lang]",
    actual: getHtmlLang($),
    expected,
  });
}

export function getCheerioForAssertions(input: HtmlInput): CheerioAPI {
  return toCheerio(input);
}
