import type { Page } from "@playwright/test";
import type { SeokitPageRoute } from "./types.js";

export type SeokitRouteBasicsExpect = (actual: Page) => {
  toHaveHtmlLang(expected: string): Promise<unknown>;
  toHaveCanonical(expected: string): Promise<unknown>;
  toHaveSelfAlternate(locale: string, expected: string): Promise<unknown>;
  toHaveXDefaultAlternate(expected: string): Promise<unknown>;
  toHaveAlternate(hreflang: string, expected: string): Promise<unknown>;
};

export async function assertSeokitRouteBasics(
  expect: SeokitRouteBasicsExpect,
  page: Page,
  route: SeokitPageRoute,
  baseURL?: string,
): Promise<void> {
  await expect(page).toHaveHtmlLang(route.locale);
  await expect(page).toHaveCanonical(route.absoluteUrl(baseURL));
  await expect(page).toHaveSelfAlternate(
    route.locale,
    route.absoluteUrl(baseURL),
  );
  await expect(page).toHaveXDefaultAlternate(route.xDefaultUrl(baseURL));

  for (const alternate of route.alternates(baseURL)) {
    await expect(page).toHaveAlternate(alternate.locale, alternate.url);
  }
}
