import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LocalizedGeneration } from "@/lib/pokeapi";

type GenerationCardProps = {
  locale: string;
  generation: LocalizedGeneration;
  regionLabel: string;
};

export function GenerationCard({
  locale,
  generation,
  regionLabel,
}: GenerationCardProps) {
  return (
    <Link
      href={`/${locale}/generations/${generation.slug}`}
      className="group block"
    >
      <Card className="h-full transition-colors group-hover:border-primary/40">
        <CardHeader>
          <CardDescription>#{generation.id}</CardDescription>
          <CardTitle className="text-lg">{generation.name}</CardTitle>
          <CardDescription className="capitalize">{regionLabel}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
