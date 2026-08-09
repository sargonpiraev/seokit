import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LocalizedPokemon } from "@/lib/pokeapi";

type PokemonCardProps = {
  locale: string;
  pokemon: LocalizedPokemon;
};

export function PokemonCard({ locale, pokemon }: PokemonCardProps) {
  return (
    <Card className="h-full transition-colors hover:border-primary/40">
      <Link
        href={`/${locale}/pokemon/${pokemon.slug}`}
        className="group block"
      >
        <CardHeader className="pb-2">
          <CardDescription>#{pokemon.id}</CardDescription>
          <CardTitle className="text-lg group-hover:underline">
            {pokemon.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pokemon.imageUrl ? (
            <div className="bg-muted relative mx-auto aspect-square w-28 overflow-hidden rounded-lg">
              <Image
                src={pokemon.imageUrl}
                alt={pokemon.name}
                fill
                sizes="112px"
                className="object-contain p-2"
              />
            </div>
          ) : null}
        </CardContent>
      </Link>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((type) => (
            <Link key={type} href={`/${locale}/types/${type}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {type}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
