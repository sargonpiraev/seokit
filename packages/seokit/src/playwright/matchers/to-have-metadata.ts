import type { MatcherReturnType, Page } from "@playwright/test";
import {
  collectMatchDiffs,
  formatMatchDiffs,
} from "../../core/compare/match.js";
import type { MetadataExpected } from "../../core/metadata/types.js";
import { extractPageMetadata } from "../extract-metadata.js";

export async function toHaveMetadata(
  page: Page,
  expected: MetadataExpected,
): Promise<MatcherReturnType> {
  const actual = await extractPageMetadata(page);
  const diffs = collectMatchDiffs(actual, expected);
  const pass = diffs.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? "Expected page metadata not to match, but it did"
        : `Expected page metadata to match:\n${formatMatchDiffs(diffs)}`,
  };
}
