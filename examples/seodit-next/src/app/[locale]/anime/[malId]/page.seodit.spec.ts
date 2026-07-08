import { expect as baseExpect, test } from "@playwright/test";
import { extendSeoditExpect } from "@sargonpiraev/seodit/playwright";
import {
  assertSeoditRouteBasics,
  createSeoditPageRoutes,
} from "@sargonpiraev/seodit/next";

import config from "@/seodit.next.config";
import { SITE_NAME } from "@/lib/metadata";

const expect = extendSeoditExpect(baseExpect);
const routes = createSeoditPageRoutes(config, import.meta.url, {
  params: [{ malId: "1" }],
});

for (const route of routes) {
  test(route.pathname, async ({ page, baseURL }) => {
    await page.goto(route.pathname);

    await assertSeoditRouteBasics(expect, page, route, baseURL);
    await expect(page).toHaveMetaTitle(/.+/);
    await expect(page).toHaveMetaDescription(/.+/);
    await expect(page).toHaveOpenGraphUrl(route.absoluteUrl(baseURL));
    await expect(page).toHaveOpenGraphSiteName(SITE_NAME);
    await expect(page).toHaveTwitterCard("summary_large_image");
    await expect(page).toHaveValidJsonLd();
    await expect(page).toHaveJsonLdType("TVSeries");
    await expect(page).toHaveJsonLdType("BreadcrumbList");
  });
}
