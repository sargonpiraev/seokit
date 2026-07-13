import { toHaveAlternate } from "../matchers/to-have-alternate.js";
import { toHaveAlternateMedia } from "../matchers/to-have-alternate-media.js";
import { toHaveAlternateType } from "../matchers/to-have-alternate-type.js";
import { toHaveCanonical } from "../matchers/to-have-canonical.js";
import { toHaveGoogleBotMeta } from "../matchers/to-have-googlebot-meta.js";
import { toHaveHtmlLang } from "../matchers/to-have-html-lang.js";
import { toHaveJsonLd } from "../matchers/to-have-jsonld.js";
import { toHaveMetaDescription } from "../matchers/to-have-meta-description.js";
import { toHaveMetaName } from "../matchers/to-have-meta-name.js";
import { toHaveMetaTitle } from "../matchers/to-have-meta-title.js";
import { toHaveOpenGraphAudio } from "../matchers/to-have-open-graph-audio.js";
import { toHaveOpenGraphDescription } from "../matchers/to-have-open-graph-description.js";
import { toHaveOpenGraphImage } from "../matchers/to-have-open-graph-image.js";
import { toHaveOpenGraphImageAlt } from "../matchers/to-have-open-graph-image-alt.js";
import { toHaveOpenGraphImageSize } from "../matchers/to-have-open-graph-image-size.js";
import { toHaveOpenGraphLocale } from "../matchers/to-have-open-graph-locale.js";
import { toHaveOpenGraphSiteName } from "../matchers/to-have-open-graph-site-name.js";
import { toHaveOpenGraphTitle } from "../matchers/to-have-open-graph-title.js";
import { toHaveOpenGraphType } from "../matchers/to-have-open-graph-type.js";
import { toHaveOpenGraphUrl } from "../matchers/to-have-open-graph-url.js";
import { toHaveOpenGraphVideo } from "../matchers/to-have-open-graph-video.js";
import { toHaveRobotsMeta } from "../matchers/to-have-robots-meta.js";
import { toHaveSelfAlternate } from "../matchers/to-have-self-alternate.js";
import { toHaveTwitterCard } from "../matchers/to-have-twitter-card.js";
import { toHaveTwitterCreator } from "../matchers/to-have-twitter-creator.js";
import { toHaveTwitterDescription } from "../matchers/to-have-twitter-description.js";
import { toHaveTwitterImage } from "../matchers/to-have-twitter-image.js";
import { toHaveTwitterImageAlt } from "../matchers/to-have-twitter-image-alt.js";
import { toHaveTwitterSite } from "../matchers/to-have-twitter-site.js";
import { toHaveTwitterTitle } from "../matchers/to-have-twitter-title.js";
import { toHaveXDefaultAlternate } from "../matchers/to-have-x-default-alternate.js";

const seokitMatchers = {
  toHaveMetaTitle,
  toHaveMetaDescription,
  toHaveMetaName,
  toHaveCanonical,
  toHaveSelfAlternate,
  toHaveAlternate,
  toHaveXDefaultAlternate,
  toHaveAlternateMedia,
  toHaveAlternateType,
  toHaveOpenGraphTitle,
  toHaveOpenGraphDescription,
  toHaveOpenGraphUrl,
  toHaveOpenGraphSiteName,
  toHaveOpenGraphType,
  toHaveOpenGraphLocale,
  toHaveOpenGraphImage,
  toHaveOpenGraphImageAlt,
  toHaveOpenGraphImageSize,
  toHaveOpenGraphVideo,
  toHaveOpenGraphAudio,
  toHaveTwitterCard,
  toHaveTwitterTitle,
  toHaveTwitterDescription,
  toHaveTwitterImage,
  toHaveTwitterImageAlt,
  toHaveTwitterSite,
  toHaveTwitterCreator,
  toHaveRobotsMeta,
  toHaveGoogleBotMeta,
  toHaveHtmlLang,
  toHaveJsonLd,
};

export type SeokitMatchers = typeof seokitMatchers;

export const seokitMatcherNames = Object.keys(seokitMatchers) as (keyof SeokitMatchers)[];

type ExtendableExpect = {
  extend(matchers: SeokitMatchers): unknown;
};

export function extendSeokitExpect<TExpect extends ExtendableExpect>(baseExpect: TExpect): ReturnType<TExpect["extend"]> {
  return baseExpect.extend(seokitMatchers) as ReturnType<TExpect["extend"]>;
}

declare module "@playwright/test" {
  interface Matchers<R, T = unknown> {
    toHaveMetaTitle(expected: string | RegExp): Promise<R>;
    toHaveMetaDescription(expected: string | RegExp): Promise<R>;
    toHaveMetaName(name: string, expected: string | RegExp): Promise<R>;
    toHaveCanonical(expected: string | RegExp): Promise<R>;
    toHaveSelfAlternate(locale: string, expected: string | RegExp): Promise<R>;
    toHaveAlternate(hreflang: string, expected: string | RegExp): Promise<R>;
    toHaveXDefaultAlternate(expected: string | RegExp): Promise<R>;
    toHaveAlternateMedia(media: string, expected: string | RegExp): Promise<R>;
    toHaveAlternateType(type: string, expected: string | RegExp): Promise<R>;
    toHaveOpenGraphTitle(expected: string | RegExp): Promise<R>;
    toHaveOpenGraphDescription(expected: string | RegExp): Promise<R>;
    toHaveOpenGraphUrl(expected: string | RegExp): Promise<R>;
    toHaveOpenGraphSiteName(expected: string | RegExp): Promise<R>;
    toHaveOpenGraphType(expected: string | RegExp): Promise<R>;
    toHaveOpenGraphLocale(expected: string | RegExp): Promise<R>;
    toHaveOpenGraphImage(expected: string | RegExp): Promise<R>;
    toHaveOpenGraphImageAlt(expected: string | RegExp): Promise<R>;
    toHaveOpenGraphImageSize(expected: { width?: number | string; height?: number | string }): Promise<R>;
    toHaveOpenGraphVideo(expected: string | RegExp): Promise<R>;
    toHaveOpenGraphAudio(expected: string | RegExp): Promise<R>;
    toHaveTwitterCard(expected: string | RegExp): Promise<R>;
    toHaveTwitterTitle(expected: string | RegExp): Promise<R>;
    toHaveTwitterDescription(expected: string | RegExp): Promise<R>;
    toHaveTwitterImage(expected: string | RegExp): Promise<R>;
    toHaveTwitterImageAlt(expected: string | RegExp): Promise<R>;
    toHaveTwitterSite(expected: string | RegExp): Promise<R>;
    toHaveTwitterCreator(expected: string | RegExp): Promise<R>;
    toHaveRobotsMeta(expected: { index?: boolean; follow?: boolean }): Promise<R>;
    toHaveGoogleBotMeta(expected: { index?: boolean; follow?: boolean }): Promise<R>;
    toHaveHtmlLang(expected: string | RegExp): Promise<R>;
    toHaveJsonLd(expected: Record<string, unknown>): Promise<R>;
  }
}
