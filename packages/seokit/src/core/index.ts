export {
  collectMatchDiffs,
  formatMatchDiffs,
  formatValue,
  isRecord,
  matchesExpected,
} from "./compare/match.js";
export type { MatchDiff } from "./compare/match.js";

export type { MetadataExpected, PageMetadata } from "./metadata/index.js";
export { parseRobotsContent } from "./metadata/index.js";

export type { JsonLdExpected } from "./jsonld/index.js";
export { matchJsonLd, parseJsonLdScripts } from "./jsonld/index.js";
