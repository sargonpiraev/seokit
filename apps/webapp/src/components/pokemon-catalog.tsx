"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LocalizedPokemon } from "@/lib/pokeapi";

type PokemonCatalogProps = {
  locale: string;
  pokemon: LocalizedPokemon[];
};

export function PokemonCatalog({ locale, pokemon }: PokemonCatalogProps) {
  const t = useTranslations("pokemon");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [generation, setGeneration] = useState<string>("all");

  const types = useMemo(
    () => [...new Set(pokemon.flatMap((entry) => entry.types))].sort(),
    [pokemon],
  );
  const generations = useMemo(
    () => [...new Set(pokemon.map((entry) => entry.generation))].sort(),
    [pokemon],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return pokemon.filter((entry) => {
      if (type !== "all" && !entry.types.includes(type)) return false;
      if (generation !== "all" && entry.generation !== generation) return false;
      if (!needle) return true;
      return (
        entry.name.toLowerCase().includes(needle) ||
        entry.slug.includes(needle)
      );
    });
  }, [pokemon, query, type, generation]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
        />

        <Select
          value={type}
          onValueChange={(value) => setType(value ?? "all")}
        >
          <SelectTrigger className="w-full" aria-label={t("filterType")}>
            <SelectValue placeholder={t("filterType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            {types.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={generation}
          onValueChange={(value) => setGeneration(value ?? "all")}
        >
          <SelectTrigger className="w-full" aria-label={t("filterGeneration")}>
            <SelectValue placeholder={t("filterGeneration")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            {generations.map((item) => (
              <SelectItem key={item} value={item}>
                {t("generationLabel", { gen: item.toUpperCase() })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <Card
              key={entry.slug}
              className="h-full transition-colors hover:border-primary/40"
            >
              <Link
                href={`/${locale}/pokemon/${entry.slug}`}
                className="group block"
              >
                <CardHeader className="pb-2">
                  <CardDescription>#{entry.id}</CardDescription>
                  <CardTitle className="text-xl group-hover:underline">
                    {entry.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entry.imageUrl ? (
                    <div className="bg-muted relative mx-auto aspect-square w-36 overflow-hidden rounded-lg">
                      <Image
                        src={entry.imageUrl}
                        alt={entry.name}
                        fill
                        sizes="144px"
                        className="object-contain p-2"
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Link>
              <CardContent className="space-y-2 pt-0">
                <Link
                  href={`/${locale}/generations/${entry.generation}`}
                  className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
                >
                  {t("generationLabel", {
                    gen: entry.generation.toUpperCase(),
                  })}
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {entry.types.map((item) => (
                    <Link key={item} href={`/${locale}/types/${item}`}>
                      <Badge variant="secondary" className="hover:bg-secondary/80">
                        {item}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
