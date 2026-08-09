import { expect, test } from "@/test/seokit";
import {
  generationsList,
  hreflangLanguages,
  LOCALES,
  ORIGIN,
  pathname,
} from "@/test/seo-fixtures";

for (const locale of LOCALES) {
  test(`${pathname(locale, "generations")} SEO`, async ({ page }) => {
    const path = pathname(locale, "generations");
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();

    const copy = generationsList[locale];

    await expect(page).toHaveMetadata({
      lang: locale,
      title: copy.title,
      description: copy.description,
      alternates: {
        canonical: `${ORIGIN}${path}`,
        languages: hreflangLanguages("generations"),
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
