import type { Page } from "@playwright/test";
import {
  assertAlternate,
  assertAlternateMedia,
  assertAlternateType,
  assertCanonical,
  assertGoogleBotMeta,
  assertHtmlLang,
  assertMetaDescription,
  assertMetaName,
  assertMetaTitle,
  assertOpenGraphAudio,
  assertOpenGraphDescription,
  assertOpenGraphImage,
  assertOpenGraphImageAlt,
  assertOpenGraphImageSize,
  assertOpenGraphLocale,
  assertOpenGraphSiteName,
  assertOpenGraphTitle,
  assertOpenGraphType,
  assertOpenGraphUrl,
  assertOpenGraphVideo,
  assertRobotsMeta,
  assertSelfAlternate,
  assertTwitterCard,
  assertTwitterCreator,
  assertTwitterDescription,
  assertTwitterImage,
  assertTwitterImageAlt,
  assertTwitterSite,
  assertTwitterTitle,
  assertXDefaultAlternate,
} from "../html/index.js";
import { assertJsonLdType, assertValidJsonLd } from "../jsonld/index.js";
import type { ExpectedValue, OpenGraphImageSizeExpectation, RobotsMetaExpectation, SeoIssue } from "../types.js";

type MatcherContext = {
  isNot: boolean;
  utils: {
    printExpected(value: unknown): string;
    printReceived(value: unknown): string;
  };
};

type PageAssertion<TArgs extends unknown[]> = (html: string, ...args: TArgs) => SeoIssue[];

function isPage(received: unknown): received is Page {
  return typeof received === "object" && received !== null && "content" in received;
}

function formatIssue(issue: SeoIssue): string {
  const selector = issue.selector ? `\n  selector: ${issue.selector}` : "";
  const expected = issue.expected === undefined ? "" : `\n  expected: ${String(issue.expected)}`;
  const actual = issue.actual === undefined ? "\n  actual: <missing>" : `\n  actual: ${String(issue.actual)}`;
  return `- ${issue.message}${selector}${expected}${actual}`;
}

function createPageMatcher<TArgs extends unknown[]>(name: string, assertion: PageAssertion<TArgs>) {
  return async function matcher(this: MatcherContext, received: unknown, ...args: TArgs) {
    if (!isPage(received)) {
      return {
        pass: false,
        name,
        message: () => `${name} expects a Playwright Page`,
      };
    }

    const html = await received.content();
    const issues = assertion(html, ...args);
    const basePass = issues.length === 0;
    const pass = this.isNot ? !basePass : basePass;

    return {
      pass,
      name,
      expected: args,
      actual: issues,
      message: () => {
        if (this.isNot) {
          return `${name} unexpectedly matched`;
        }

        return [`${name} failed:`, ...issues.map(formatIssue)].join("\n");
      },
    };
  };
}

const seoditMatchers = {
  toHaveMetaTitle: createPageMatcher<[ExpectedValue]>("toHaveMetaTitle", assertMetaTitle),
  toHaveMetaDescription: createPageMatcher<[ExpectedValue]>("toHaveMetaDescription", assertMetaDescription),
  toHaveMetaName: createPageMatcher<[string, ExpectedValue]>("toHaveMetaName", assertMetaName),
  toHaveCanonical: createPageMatcher<[ExpectedValue]>("toHaveCanonical", assertCanonical),
  toHaveSelfAlternate: createPageMatcher<[string, ExpectedValue]>("toHaveSelfAlternate", assertSelfAlternate),
  toHaveAlternate: createPageMatcher<[string, ExpectedValue]>("toHaveAlternate", assertAlternate),
  toHaveXDefaultAlternate: createPageMatcher<[ExpectedValue]>("toHaveXDefaultAlternate", assertXDefaultAlternate),
  toHaveAlternateMedia: createPageMatcher<[string, ExpectedValue]>("toHaveAlternateMedia", assertAlternateMedia),
  toHaveAlternateType: createPageMatcher<[string, ExpectedValue]>("toHaveAlternateType", assertAlternateType),
  toHaveOpenGraphTitle: createPageMatcher<[ExpectedValue]>("toHaveOpenGraphTitle", assertOpenGraphTitle),
  toHaveOpenGraphDescription: createPageMatcher<[ExpectedValue]>(
    "toHaveOpenGraphDescription",
    assertOpenGraphDescription,
  ),
  toHaveOpenGraphUrl: createPageMatcher<[ExpectedValue]>("toHaveOpenGraphUrl", assertOpenGraphUrl),
  toHaveOpenGraphSiteName: createPageMatcher<[ExpectedValue]>("toHaveOpenGraphSiteName", assertOpenGraphSiteName),
  toHaveOpenGraphType: createPageMatcher<[ExpectedValue]>("toHaveOpenGraphType", assertOpenGraphType),
  toHaveOpenGraphLocale: createPageMatcher<[ExpectedValue]>("toHaveOpenGraphLocale", assertOpenGraphLocale),
  toHaveOpenGraphImage: createPageMatcher<[ExpectedValue]>("toHaveOpenGraphImage", assertOpenGraphImage),
  toHaveOpenGraphImageAlt: createPageMatcher<[ExpectedValue]>("toHaveOpenGraphImageAlt", assertOpenGraphImageAlt),
  toHaveOpenGraphImageSize: createPageMatcher<[OpenGraphImageSizeExpectation]>(
    "toHaveOpenGraphImageSize",
    assertOpenGraphImageSize,
  ),
  toHaveOpenGraphVideo: createPageMatcher<[ExpectedValue]>("toHaveOpenGraphVideo", assertOpenGraphVideo),
  toHaveOpenGraphAudio: createPageMatcher<[ExpectedValue]>("toHaveOpenGraphAudio", assertOpenGraphAudio),
  toHaveTwitterCard: createPageMatcher<[ExpectedValue]>("toHaveTwitterCard", assertTwitterCard),
  toHaveTwitterTitle: createPageMatcher<[ExpectedValue]>("toHaveTwitterTitle", assertTwitterTitle),
  toHaveTwitterDescription: createPageMatcher<[ExpectedValue]>("toHaveTwitterDescription", assertTwitterDescription),
  toHaveTwitterImage: createPageMatcher<[ExpectedValue]>("toHaveTwitterImage", assertTwitterImage),
  toHaveTwitterImageAlt: createPageMatcher<[ExpectedValue]>("toHaveTwitterImageAlt", assertTwitterImageAlt),
  toHaveTwitterSite: createPageMatcher<[ExpectedValue]>("toHaveTwitterSite", assertTwitterSite),
  toHaveTwitterCreator: createPageMatcher<[ExpectedValue]>("toHaveTwitterCreator", assertTwitterCreator),
  toHaveRobotsMeta: createPageMatcher<[RobotsMetaExpectation]>("toHaveRobotsMeta", assertRobotsMeta),
  toHaveGoogleBotMeta: createPageMatcher<[RobotsMetaExpectation]>("toHaveGoogleBotMeta", assertGoogleBotMeta),
  toHaveHtmlLang: createPageMatcher<[ExpectedValue]>("toHaveHtmlLang", assertHtmlLang),
  toHaveValidJsonLd: createPageMatcher<[]>("toHaveValidJsonLd", assertValidJsonLd),
  toHaveJsonLdType: createPageMatcher<[string]>("toHaveJsonLdType", assertJsonLdType),
};

export type SeoditMatchers = typeof seoditMatchers;

type ExtendableExpect = {
  extend(matchers: SeoditMatchers): unknown;
};

export function extendSeoditExpect<TExpect extends ExtendableExpect>(baseExpect: TExpect): ReturnType<TExpect["extend"]> {
  return baseExpect.extend(seoditMatchers) as ReturnType<TExpect["extend"]>;
}

declare module "@playwright/test" {
  interface Matchers<R, T = unknown> {
    toHaveMetaTitle(expected: ExpectedValue): Promise<R>;
    toHaveMetaDescription(expected: ExpectedValue): Promise<R>;
    toHaveMetaName(name: string, expected: ExpectedValue): Promise<R>;
    toHaveCanonical(expected: ExpectedValue): Promise<R>;
    toHaveSelfAlternate(locale: string, expected: ExpectedValue): Promise<R>;
    toHaveAlternate(hreflang: string, expected: ExpectedValue): Promise<R>;
    toHaveXDefaultAlternate(expected: ExpectedValue): Promise<R>;
    toHaveAlternateMedia(media: string, expected: ExpectedValue): Promise<R>;
    toHaveAlternateType(type: string, expected: ExpectedValue): Promise<R>;
    toHaveOpenGraphTitle(expected: ExpectedValue): Promise<R>;
    toHaveOpenGraphDescription(expected: ExpectedValue): Promise<R>;
    toHaveOpenGraphUrl(expected: ExpectedValue): Promise<R>;
    toHaveOpenGraphSiteName(expected: ExpectedValue): Promise<R>;
    toHaveOpenGraphType(expected: ExpectedValue): Promise<R>;
    toHaveOpenGraphLocale(expected: ExpectedValue): Promise<R>;
    toHaveOpenGraphImage(expected: ExpectedValue): Promise<R>;
    toHaveOpenGraphImageAlt(expected: ExpectedValue): Promise<R>;
    toHaveOpenGraphImageSize(expected: OpenGraphImageSizeExpectation): Promise<R>;
    toHaveOpenGraphVideo(expected: ExpectedValue): Promise<R>;
    toHaveOpenGraphAudio(expected: ExpectedValue): Promise<R>;
    toHaveTwitterCard(expected: ExpectedValue): Promise<R>;
    toHaveTwitterTitle(expected: ExpectedValue): Promise<R>;
    toHaveTwitterDescription(expected: ExpectedValue): Promise<R>;
    toHaveTwitterImage(expected: ExpectedValue): Promise<R>;
    toHaveTwitterImageAlt(expected: ExpectedValue): Promise<R>;
    toHaveTwitterSite(expected: ExpectedValue): Promise<R>;
    toHaveTwitterCreator(expected: ExpectedValue): Promise<R>;
    toHaveRobotsMeta(expected: RobotsMetaExpectation): Promise<R>;
    toHaveGoogleBotMeta(expected: RobotsMetaExpectation): Promise<R>;
    toHaveHtmlLang(expected: ExpectedValue): Promise<R>;
    toHaveValidJsonLd(): Promise<R>;
    toHaveJsonLdType(expectedType: string): Promise<R>;
  }
}
