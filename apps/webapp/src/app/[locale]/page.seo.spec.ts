import { expect, test } from "@/test/seokit";
import {
  home,
  hreflangLanguages,
  LOCALES,
  ORIGIN,
  pathname,
  SITE_NAME,
} from "@/test/seo-fixtures";

for (const locale of LOCALES) {
  test(`${pathname(locale)} SEO`, async ({ page }) => {
    const path = pathname(locale);
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();

    const copy = home[locale];

    await expect(page).toHaveMetadata({
      lang: locale,
      title: copy.title,
      description: copy.description,
      alternates: {
        canonical: `${ORIGIN}${path}`,
        languages: hreflangLanguages(),
      },
    });

    await expect(page).toHaveJsonLd([
      { "@type": "Organization", name: SITE_NAME, url: ORIGIN },
      { "@type": "WebSite", name: SITE_NAME, inLanguage: locale },
      { "@type": "ItemList" },
    ]);
  });
}
