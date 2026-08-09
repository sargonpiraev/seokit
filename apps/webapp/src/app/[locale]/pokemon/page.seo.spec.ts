import { expect, test } from "@/test/seokit";
import {
  hreflangLanguages,
  LOCALES,
  ORIGIN,
  pathname,
  pokemonList,
} from "@/test/seo-fixtures";

for (const locale of LOCALES) {
  test(`${pathname(locale, "pokemon")} SEO`, async ({ page }) => {
    const path = pathname(locale, "pokemon");
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();

    const copy = pokemonList[locale];

    await expect(page).toHaveMetadata({
      lang: locale,
      title: copy.title,
      description: copy.description,
      alternates: {
        canonical: `${ORIGIN}${path}`,
        languages: hreflangLanguages("pokemon"),
      },
    });

    await expect(page).toHaveJsonLd([
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: copy.homeCrumb },
          { "@type": "ListItem", position: 2, name: copy.title },
        ],
      },
      {
        "@type": "ItemList",
        name: copy.title,
      },
    ]);
  });
}
