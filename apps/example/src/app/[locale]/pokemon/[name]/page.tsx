import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routing } from "@/i18n/routing";
import { breadcrumbJsonLd, thingJsonLd } from "@/lib/json-ld";
import { absolutePageUrl, buildPageMetadata } from "@/lib/metadata";
import { DEMO_POKEMON, getPokemon, isDemoPokemon } from "@/lib/pokeapi";
import { cn } from "@/lib/utils";

type PokemonDetailPageProps = {
  params: Promise<{ locale: string; name: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    DEMO_POKEMON.map((name) => ({ locale, name })),
  );
}

export async function generateMetadata({ params }: PokemonDetailPageProps) {
  const { locale, name } = await params;
  if (!isDemoPokemon(name)) return {};

  const pokemon = await getPokemon(name, locale);
  const t = await getTranslations({ locale, namespace: "pokemon" });

  return buildPageMetadata({
    locale,
    path: `pokemon/${name}`,
    title: pokemon.name,
    description: t("detailDescription", { name: pokemon.name }),
    image: pokemon.imageUrl,
  });
}

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { locale, name } = await params;
  if (!isDemoPokemon(name)) notFound();

  setRequestLocale(locale);
  const pokemon = await getPokemon(name, locale);
  const t = await getTranslations("pokemon");
  const pageUrl = absolutePageUrl(locale, `pokemon/${name}`);

  return (
    <main className="space-y-6">
      <JsonLd
        data={[
          thingJsonLd({
            name: pokemon.name,
            description: pokemon.description,
            url: pageUrl,
            image: pokemon.imageUrl,
          }),
          breadcrumbJsonLd([
            { name: t("homeCrumb"), locale, path: "" },
            { name: t("title"), locale, path: "pokemon" },
            { name: pokemon.name, url: pageUrl },
          ]),
        ]}
      />

      <Link
        href={`/${locale}/pokemon`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
      >
        ← {t("backToList")}
      </Link>

      <Card>
        <CardHeader>
          <CardDescription>#{pokemon.id}</CardDescription>
          <CardTitle className="text-3xl tracking-tight">{pokemon.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-[200px_1fr] md:items-start">
          {pokemon.imageUrl ? (
            <div className="bg-muted relative mx-auto aspect-square w-48 overflow-hidden rounded-xl">
              <Image
                src={pokemon.imageUrl}
                alt={pokemon.name}
                fill
                sizes="192px"
                className="object-contain p-3"
                priority
              />
            </div>
          ) : null}
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{pokemon.description}</p>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("generation")}</p>
              <Link href={`/${locale}/generations/${pokemon.generation}`}>
                <Badge variant="secondary" className="hover:bg-secondary/80">
                  {t("generationLabel", {
                    gen: pokemon.generation.toUpperCase(),
                  })}
                </Badge>
              </Link>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("types")}</p>
              <div className="flex flex-wrap gap-1.5">
                {pokemon.types.map((type) => (
                  <Link key={type} href={`/${locale}/types/${type}`}>
                    <Badge variant="secondary" className="hover:bg-secondary/80">
                      {type}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
