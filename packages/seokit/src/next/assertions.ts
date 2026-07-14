import type { Page } from "@playwright/test";
import type { MetadataExpected } from "../core/metadata/types.js";
import type { SeokitPageRoute } from "./types.js";

export type SeokitRouteBasicsExpect = (actual: Page) => {
  toHaveMetadata(expected: MetadataExpected): Promise<unknown>;
};

export async function assertSeokitRouteBasics(
  expect: SeokitRouteBasicsExpect,
  page: Page,
  route: SeokitPageRoute,
  baseURL?: string,
): Promise<void> {
  const absolute = route.absoluteUrl(baseURL);
  const languages: Record<string, string> = {
    "x-default": route.xDefaultUrl(baseURL),
  };
  for (const alternate of route.alternates(baseURL)) {
    languages[alternate.locale] = alternate.url;
  }

  await expect(page).toHaveMetadata({
    lang: route.locale,
    alternates: {
      canonical: absolute,
      languages,
    },
  });
}
