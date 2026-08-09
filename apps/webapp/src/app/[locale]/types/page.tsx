import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { TypeCard } from "@/components/type-card";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/metadata";
import { listDemoTypes } from "@/lib/pokeapi";

type TypesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TypesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "types" });

  return buildPageMetadata({
    locale,
    path: "types",
    title: t("title"),
    description: t("description"),
  });
}

export default async function TypesPage({ params }: TypesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("types");
  const types = await listDemoTypes(locale);

  return (
    <main className="space-y-6">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t("homeCrumb"), locale, path: "" },
            { name: t("title"), locale, path: "types" },
          ]),
          itemListJsonLd({
            name: t("title"),
            locale,
            path: "types",
            items: types.map((type) => ({
              name: type.name,
              path: `types/${type.slug}`,
            })),
          }),
        ]}
      />
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((type) => (
          <TypeCard
            key={type.slug}
            locale={locale}
            type={type}
            pokemonCountLabel={t("pokemonCount", {
              count: type.pokemonSlugs.length,
            })}
          />
        ))}
      </div>
    </main>
  );
}
