import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { GenerationCard } from "@/components/generation-card";
import { JsonLd } from "@/components/json-ld";
import { PokemonCard } from "@/components/pokemon-card";
import { TypeCard } from "@/components/type-card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { itemListJsonLd, webSiteJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/metadata";
import {
  getPokemon,
  listDemoGenerations,
  listDemoPokemon,
  listDemoTypes,
} from "@/lib/pokeapi";
import { cn } from "@/lib/utils";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return buildPageMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tTypes = await getTranslations("types");
  const tGenerations = await getTranslations("generations");

  const [hero, catalog, types, generations] = await Promise.all([
    getPokemon("charizard", locale),
    listDemoPokemon(locale),
    listDemoTypes(locale),
    listDemoGenerations(locale),
  ]);

  const starters = catalog.filter((entry) =>
    ["bulbasaur", "charmander", "squirtle"].includes(entry.slug),
  );
  const featured = catalog.filter((entry) =>
    ["pikachu", "eevee", "charizard"].includes(entry.slug),
  );

  return (
    <main className="space-y-12">
      <JsonLd
        data={[
          webSiteJsonLd(locale),
          itemListJsonLd({
            name: t("featured"),
            locale,
            path: "",
            items: featured.map((entry) => ({
              name: entry.name,
              path: `pokemon/${entry.slug}`,
            })),
          }),
        ]}
      />
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-orange-500/15 via-background to-sky-500/10">
        <div className="grid items-center gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div className="space-y-5">
            <Badge variant="secondary">{t("featured")}</Badge>
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm tracking-wide uppercase">
                #{hero.id} ·{" "}
                {hero.types.map((type, index) => (
                  <span key={type}>
                    {index > 0 ? " / " : null}
                    <Link
                      href={`/${locale}/types/${type}`}
                      className="hover:text-foreground underline-offset-4 hover:underline"
                    >
                      {type}
                    </Link>
                  </span>
                ))}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {hero.name}
              </h1>
              <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
                {hero.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/pokemon/${hero.slug}`}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                {t("learnMore")}
              </Link>
              <Link
                href={`/${locale}/pokemon`}
                className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              >
                {t("cta")}
              </Link>
            </div>
          </div>

          {hero.imageUrl ? (
            <div className="relative mx-auto aspect-square w-full max-w-sm">
              <Image
                src={hero.imageUrl}
                alt={hero.name}
                fill
                priority
                sizes="(max-width: 768px) 80vw, 380px"
                className="object-contain drop-shadow-xl"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">{t("starters")}</h2>
          <Link
            href={`/${locale}/pokemon`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {t("viewAll")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {starters.map((entry) => (
            <PokemonCard key={entry.slug} locale={locale} pokemon={entry} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">{t("featured")}</h2>
          <Link
            href={`/${locale}/pokemon`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {t("viewAll")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((entry) => (
            <PokemonCard key={entry.slug} locale={locale} pokemon={entry} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">{t("types")}</h2>
          <Link
            href={`/${locale}/types`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {t("viewAllTypes")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {types.slice(0, 6).map((type) => (
            <TypeCard
              key={type.slug}
              locale={locale}
              type={type}
              pokemonCountLabel={tTypes("pokemonCount", {
                count: type.pokemonSlugs.length,
              })}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">{t("generations")}</h2>
          <Link
            href={`/${locale}/generations`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {t("viewAllGenerations")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {generations.map((generation) => (
            <GenerationCard
              key={generation.slug}
              locale={locale}
              generation={generation}
              regionLabel={tGenerations("region", {
                region: generation.mainRegion,
              })}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
