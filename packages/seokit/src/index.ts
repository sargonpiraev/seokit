export {
  extendSeokitExpect,
  extractPageMetadata,
  seokitMatcherNames,
} from "./playwright/index.js";
export type { SeokitMatchers } from "./playwright/index.js";

export {
  collectMatchDiffs,
  formatMatchDiffs,
  formatValue,
  isRecord,
  matchJsonLd,
  matchesExpected,
  parseJsonLdScripts,
  parseRobotsContent,
} from "./core/index.js";
export type {
  JsonLdExpected,
  MatchDiff,
  MetadataExpected,
  PageMetadata,
} from "./core/index.js";

export {
  createSeokitPageRoutes,
  assertSeokitRouteBasics,
  checkSeokitSpecCoverage,
  formatSeokitSpecCoverageWarnings,
} from "./next/index.js";
export type {
  SeokitNextRouting,
  SeokitPageRoute,
  SeokitPageRouteAlternate,
  SeokitRouteParams,
  CreateSeokitPageRoutesOptions,
  CheckSeokitSpecCoverageOptions,
  SeokitSpecCoverageResult,
  SeokitRouteBasicsExpect,
} from "./next/index.js";
