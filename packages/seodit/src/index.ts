export { extendSeoditExpect, seoditMatcherNames } from "./playwright/index.js";
export type { SeoditMatchers } from "./playwright/index.js";

export { toHaveAlternate } from "./matchers/to-have-alternate.js";
export { toHaveAlternateMedia } from "./matchers/to-have-alternate-media.js";
export { toHaveAlternateType } from "./matchers/to-have-alternate-type.js";
export { toHaveCanonical } from "./matchers/to-have-canonical.js";
export { toHaveGoogleBotMeta } from "./matchers/to-have-googlebot-meta.js";
export { toHaveHtmlLang } from "./matchers/to-have-html-lang.js";
export { toHaveJsonLd } from "./matchers/to-have-jsonld.js";
export { toHaveMetaDescription } from "./matchers/to-have-meta-description.js";
export { toHaveMetaName } from "./matchers/to-have-meta-name.js";
export { toHaveMetaTitle } from "./matchers/to-have-meta-title.js";
export { toHaveOpenGraphAudio } from "./matchers/to-have-open-graph-audio.js";
export { toHaveOpenGraphDescription } from "./matchers/to-have-open-graph-description.js";
export { toHaveOpenGraphImage } from "./matchers/to-have-open-graph-image.js";
export { toHaveOpenGraphImageAlt } from "./matchers/to-have-open-graph-image-alt.js";
export { toHaveOpenGraphImageSize } from "./matchers/to-have-open-graph-image-size.js";
export { toHaveOpenGraphLocale } from "./matchers/to-have-open-graph-locale.js";
export { toHaveOpenGraphSiteName } from "./matchers/to-have-open-graph-site-name.js";
export { toHaveOpenGraphTitle } from "./matchers/to-have-open-graph-title.js";
export { toHaveOpenGraphType } from "./matchers/to-have-open-graph-type.js";
export { toHaveOpenGraphUrl } from "./matchers/to-have-open-graph-url.js";
export { toHaveOpenGraphVideo } from "./matchers/to-have-open-graph-video.js";
export { toHaveRobotsMeta } from "./matchers/to-have-robots-meta.js";
export { toHaveSelfAlternate } from "./matchers/to-have-self-alternate.js";
export { toHaveTwitterCard } from "./matchers/to-have-twitter-card.js";
export { toHaveTwitterCreator } from "./matchers/to-have-twitter-creator.js";
export { toHaveTwitterDescription } from "./matchers/to-have-twitter-description.js";
export { toHaveTwitterImage } from "./matchers/to-have-twitter-image.js";
export { toHaveTwitterImageAlt } from "./matchers/to-have-twitter-image-alt.js";
export { toHaveTwitterSite } from "./matchers/to-have-twitter-site.js";
export { toHaveTwitterTitle } from "./matchers/to-have-twitter-title.js";
export { toHaveXDefaultAlternate } from "./matchers/to-have-x-default-alternate.js";

export {
  createSeoditPageRoutes,
  assertSeoditRouteBasics,
  checkSeoditSpecCoverage,
  formatSeoditSpecCoverageWarnings,
} from "./next/index.js";
export type {
  SeoditNextRouting,
  SeoditPageRoute,
  SeoditPageRouteAlternate,
  SeoditRouteParams,
  CreateSeoditPageRoutesOptions,
  CheckSeoditSpecCoverageOptions,
  SeoditSpecCoverageResult,
  SeoditRouteBasicsExpect,
} from "./next/index.js";
