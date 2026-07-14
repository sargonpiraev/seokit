import { expect, test } from "@/test/seokit";
import {
  fireType,
  hreflangLanguages,
  LOCALES,
  ORIGIN,
  pathname,
} from "@/test/seo-fixtures";

const SLUG = "fire";

for (const locale of LOCALES) {
  test(`${pathname(locale, `types/${SLUG}`)} SEO`, async ({ page }) => {
    const path = pathname(locale, `types/${SLUG}`);
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();

    const copy = fireType[locale];

    await expect(page).toHaveMetadata({
      lang: locale,
      title: copy.name,
      description: copy.description,
      alternates: {
        canonical: `${ORIGIN}${path}`,
        languages: hreflangLanguages(`types/${SLUG}`),
      },
    });

    await expect(page).toHaveJsonLd([
      {
        "@type": "Thing",
        name: copy.name,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: copy.homeCrumb },
          { "@type": "ListItem", position: 2, name: copy.listTitle },
          { "@type": "ListItem", position: 3, name: copy.name },
        ],
      },
    ]);
  });
}
