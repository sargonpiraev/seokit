import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LocalizedType } from "@/lib/pokeapi";

type TypeCardProps = {
  locale: string;
  type: LocalizedType;
  pokemonCountLabel: string;
};

export function TypeCard({ locale, type, pokemonCountLabel }: TypeCardProps) {
  return (
    <Link href={`/${locale}/types/${type.slug}`} className="group block">
      <Card className="h-full transition-colors group-hover:border-primary/40">
        <CardHeader>
          <CardDescription>#{type.id}</CardDescription>
          <CardTitle className="text-lg capitalize">{type.name}</CardTitle>
          <CardDescription>{pokemonCountLabel}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
