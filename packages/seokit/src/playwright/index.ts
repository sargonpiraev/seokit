import type {
  ExpectMatcherState,
  MatcherReturnType,
} from "@playwright/test";
import type { JsonLdExpected } from "../core/jsonld/match.js";
import type { MetadataExpected } from "../core/metadata/types.js";
import { toHaveJsonLd } from "./matchers/to-have-json-ld.js";
import { toHaveMetadata } from "./matchers/to-have-metadata.js";

type SeokitMatcherFn = (
  this: ExpectMatcherState,
  receiver: unknown,
  ...args: never[]
) => MatcherReturnType | Promise<MatcherReturnType>;

const seokitMatchers = {
  toHaveMetadata,
  toHaveJsonLd,
} as unknown as {
  toHaveMetadata: SeokitMatcherFn;
  toHaveJsonLd: SeokitMatcherFn;
};

export type SeokitMatchers = typeof seokitMatchers;

export const seokitMatcherNames = Object.keys(seokitMatchers) as (keyof SeokitMatchers)[];

export function extendSeokitExpect<TExpect extends {
  extend: (matchers: SeokitMatchers) => unknown;
}>(baseExpect: TExpect): ReturnType<TExpect["extend"]> {
  return baseExpect.extend(seokitMatchers) as ReturnType<TExpect["extend"]>;
}

export { extractPageMetadata } from "./extract-metadata.js";

declare module "@playwright/test" {
  interface Matchers<R, T = unknown> {
    toHaveMetadata(expected: MetadataExpected): Promise<R>;
    toHaveJsonLd(expected: JsonLdExpected): Promise<R>;
  }
}
