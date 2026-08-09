import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { PokemonCatalog } from "@/components/pokemon-catalog";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/metadata";
import { listDemoPokemon } from "@/lib/pokeapi";

type PokemonListPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PokemonListPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pokemon" });

  return buildPageMetadata({
    locale,
    path: "pokemon",
    title: t("title"),
    description: t("description"),
  });
}

export default async function PokemonListPage({ params }: PokemonListPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pokemon");
  const pokemon = await listDemoPokemon(locale);

  return (
    <main className="space-y-6">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t("homeCrumb"), locale, path: "" },
            { name: t("title"), locale, path: "pokemon" },
          ]),
          itemListJsonLd({
            name: t("title"),
            locale,
            path: "pokemon",
            items: pokemon.map((entry) => ({
              name: entry.name,
              path: `pokemon/${entry.slug}`,
            })),
          }),
        ]}
      />
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <PokemonCatalog locale={locale} pokemon={pokemon} />
    </main>
  );
}
