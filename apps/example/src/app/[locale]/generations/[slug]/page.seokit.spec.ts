import { expect, test } from "@/test/seokit";
import {
  generationI,
  hreflangLanguages,
  LOCALES,
  ORIGIN,
  pathname,
} from "@/test/seo-fixtures";

const SLUG = "i";

for (const locale of LOCALES) {
  test(`${pathname(locale, `generations/${SLUG}`)} SEO`, async ({ page }) => {
    const path = pathname(locale, `generations/${SLUG}`);
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();

    const copy = generationI[locale];

    await expect(page).toHaveMetadata({
      lang: locale,
      title: copy.name,
      description: copy.description,
      alternates: {
        canonical: `${ORIGIN}${path}`,
        languages: hreflangLanguages(`generations/${SLUG}`),
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
