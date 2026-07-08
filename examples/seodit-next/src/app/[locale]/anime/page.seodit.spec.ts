import { expect as baseExpect, test } from "@playwright/test";
import { extendSeoditExpect } from "@sargonpiraev/seodit/playwright";
import { createSeoditPageRoutes } from "@sargonpiraev/seodit/next";

import config from "@/seodit.next.config";
import { SITE_NAME } from "@/lib/metadata";

const expect = extendSeoditExpect(baseExpect);
const routes = createSeoditPageRoutes(config, import.meta.url);

for (const route of routes) {
  test(route.pathname, async ({ page, baseURL }) => {
    await page.goto(route.pathname);

    await expect(page).toHaveHtmlLang(route.locale);
    await expect(page).toHaveMetaTitle(/.+/);
    await expect(page).toHaveMetaDescription(/.+/);
    await expect(page).toHaveCanonical(route.absoluteUrl(baseURL));
    await expect(page).toHaveSelfAlternate(route.locale, route.absoluteUrl(baseURL));
    await expect(page).toHaveXDefaultAlternate(route.xDefaultUrl(baseURL));

    for (const alternate of route.alternates(baseURL)) {
      await expect(page).toHaveAlternate(alternate.locale, alternate.url);
    }

    await expect(page).toHaveOpenGraphUrl(route.absoluteUrl(baseURL));
    await expect(page).toHaveOpenGraphSiteName(SITE_NAME);
    await expect(page).toHaveOpenGraphType("website");
    await expect(page).toHaveTwitterCard("summary_large_image");
    await expect(page).toHaveValidJsonLd();
    await expect(page).toHaveJsonLdType("Organization");
  });
}
