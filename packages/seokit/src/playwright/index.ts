import type { JsonLdExpected } from "../core/jsonld/match.js";
import type { MetadataExpected } from "../core/metadata/types.js";
import { toHaveJsonLd } from "./matchers/to-have-json-ld.js";
import { toHaveMetadata } from "./matchers/to-have-metadata.js";

const seokitMatchers = {
  toHaveMetadata,
  toHaveJsonLd,
};

export type SeokitMatchers = typeof seokitMatchers;

export const seokitMatcherNames = Object.keys(seokitMatchers) as (keyof SeokitMatchers)[];

type ExtendableExpect = {
  extend(matchers: SeokitMatchers): unknown;
};

export function extendSeokitExpect<TExpect extends ExtendableExpect>(
  baseExpect: TExpect,
): ReturnType<TExpect["extend"]> {
  return baseExpect.extend(seokitMatchers) as ReturnType<TExpect["extend"]>;
}

export { extractPageMetadata } from "./extract-metadata.js";

declare module "@playwright/test" {
  interface Matchers<R, T = unknown> {
    toHaveMetadata(expected: MetadataExpected): Promise<R>;
    toHaveJsonLd(expected: JsonLdExpected): Promise<R>;
  }
}
