import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { PokemonCard } from "@/components/pokemon-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { routing } from "@/i18n/routing";
import {
  breadcrumbJsonLd,
  itemListJsonLd,
  thingJsonLd,
} from "@/lib/json-ld";
import { absolutePageUrl, buildPageMetadata } from "@/lib/metadata";
import {
  DEMO_GENERATIONS,
  getGeneration,
  getPokemon,
  getType,
  isDemoGeneration,
  isDemoType,
} from "@/lib/pokeapi";
import { cn } from "@/lib/utils";

type GenerationDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    DEMO_GENERATIONS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: GenerationDetailPageProps) {
  const { locale, slug } = await params;
  if (!isDemoGeneration(slug)) return {};

  const generation = await getGeneration(slug, locale);
  const t = await getTranslations({ locale, namespace: "generations" });

  return buildPageMetadata({
    locale,
    path: `generations/${slug}`,
    title: generation.name,
    description: t("detailDescription", { name: generation.name }),
  });
}

export default async function GenerationDetailPage({
  params,
}: GenerationDetailPageProps) {
  const { locale, slug } = await params;
  if (!isDemoGeneration(slug)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations("generations");
  const generation = await getGeneration(slug, locale);
  const pokemon = await Promise.all(
    generation.pokemonSlugs.map((name) => getPokemon(name, locale)),
  );
  const typeSlugs = [
    ...new Set(pokemon.flatMap((entry) => entry.types)),
  ].filter((name) => isDemoType(name));
  const types = await Promise.all(typeSlugs.map((name) => getType(name, locale)));

  const pageUrl = absolutePageUrl(locale, `generations/${slug}`);

  return (
    <main className="space-y-8">
      <JsonLd
        data={[
          thingJsonLd({
            name: generation.name,
            url: pageUrl,
          }),
          breadcrumbJsonLd([
            { name: t("homeCrumb"), locale, path: "" },
            { name: t("title"), locale, path: "generations" },
            { name: generation.name, url: pageUrl },
          ]),
          itemListJsonLd({
            name: t("pokemon"),
            locale,
            path: `generations/${slug}`,
            items: pokemon.map((entry) => ({
              name: entry.name,
              path: `pokemon/${entry.slug}`,
            })),
          }),
        ]}
      />

      <Link
        href={`/${locale}/generations`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
      >
        ← {t("backToList")}
      </Link>

      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">#{generation.id}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{generation.name}</h1>
        <p className="text-muted-foreground capitalize">
          {t("region", { region: generation.mainRegion })}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">{t("types")}</h2>
        <div className="flex flex-wrap gap-1.5">
          {types.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("none")}</p>
          ) : (
            types.map((type) => (
              <Link key={type.slug} href={`/${locale}/types/${type.slug}`}>
                <Badge variant="secondary" className="hover:bg-secondary/80">
                  {type.name}
                </Badge>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">{t("pokemon")}</h2>
        {pokemon.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("emptyPokemon")}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pokemon.map((entry) => (
              <PokemonCard key={entry.slug} locale={locale} pokemon={entry} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
