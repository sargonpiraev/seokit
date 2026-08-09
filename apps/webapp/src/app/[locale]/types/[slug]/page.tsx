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
  DEMO_TYPES,
  getPokemon,
  getType,
  isDemoType,
  listDemoTypes,
} from "@/lib/pokeapi";
import { cn } from "@/lib/utils";

type TypeDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    DEMO_TYPES.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: TypeDetailPageProps) {
  const { locale, slug } = await params;
  if (!isDemoType(slug)) return {};

  const type = await getType(slug, locale);
  const t = await getTranslations({ locale, namespace: "types" });

  return buildPageMetadata({
    locale,
    path: `types/${slug}`,
    title: type.name,
    description: t("detailDescription", { name: type.name }),
  });
}

export default async function TypeDetailPage({ params }: TypeDetailPageProps) {
  const { locale, slug } = await params;
  if (!isDemoType(slug)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations("types");

  const [type, catalogTypes] = await Promise.all([
    getType(slug, locale),
    listDemoTypes(locale),
  ]);
  const pokemon = await Promise.all(
    type.pokemonSlugs.map((name) => getPokemon(name, locale)),
  );

  const pageUrl = absolutePageUrl(locale, `types/${slug}`);
  const nameBySlug = new Map(catalogTypes.map((entry) => [entry.slug, entry.name]));

  const relationBadges = (slugs: string[]) => {
    const demo = slugs.filter((name) => isDemoType(name));
    if (demo.length === 0) {
      return <p className="text-muted-foreground text-sm">{t("none")}</p>;
    }
    return demo.map((name) => (
      <Link key={name} href={`/${locale}/types/${name}`}>
        <Badge variant="secondary" className="hover:bg-secondary/80">
          {nameBySlug.get(name) ?? name}
        </Badge>
      </Link>
    ));
  };

  return (
    <main className="space-y-8">
      <JsonLd
        data={[
          thingJsonLd({
            name: type.name,
            url: pageUrl,
          }),
          breadcrumbJsonLd([
            { name: t("homeCrumb"), locale, path: "" },
            { name: t("title"), locale, path: "types" },
            { name: type.name, url: pageUrl },
          ]),
          itemListJsonLd({
            name: t("pokemon"),
            locale,
            path: `types/${slug}`,
            items: pokemon.map((entry) => ({
              name: entry.name,
              path: `pokemon/${entry.slug}`,
            })),
          }),
        ]}
      />

      <Link
        href={`/${locale}/types`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
      >
        ← {t("backToList")}
      </Link>

      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">#{type.id}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{type.name}</h1>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">{t("strongAgainst")}</h2>
        <div className="flex flex-wrap gap-1.5">
          {relationBadges(type.doubleDamageTo)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">{t("weakAgainst")}</h2>
        <div className="flex flex-wrap gap-1.5">
          {relationBadges(type.doubleDamageFrom)}
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
