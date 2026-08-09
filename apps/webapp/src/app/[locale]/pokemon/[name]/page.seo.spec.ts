import { expect, test } from "@/test/seokit";
import {
  charmander,
  hreflangLanguages,
  LOCALES,
  ORIGIN,
  pathname,
} from "@/test/seo-fixtures";

const SLUG = "charmander";

for (const locale of LOCALES) {
  test(`${pathname(locale, `pokemon/${SLUG}`)} SEO`, async ({ page }) => {
    const path = pathname(locale, `pokemon/${SLUG}`);
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();

    const copy = charmander[locale];

    await expect(page).toHaveMetadata({
      lang: locale,
      title: copy.name,
      description: copy.description,
      alternates: {
        canonical: `${ORIGIN}${path}`,
        languages: hreflangLanguages(`pokemon/${SLUG}`),
      },
    });

    await expect(page).toHaveJsonLd([
      {
        "@type": "Thing",
        name: copy.name,
        url: `${ORIGIN}${path}`,
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
