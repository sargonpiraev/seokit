import { getTranslations, setRequestLocale } from "next-intl/server";

import { GenerationCard } from "@/components/generation-card";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/metadata";
import { listDemoGenerations } from "@/lib/pokeapi";

type GenerationsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: GenerationsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "generations" });

  return buildPageMetadata({
    locale,
    path: "generations",
    title: t("title"),
    description: t("description"),
  });
}

export default async function GenerationsPage({ params }: GenerationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("generations");
  const generations = await listDemoGenerations(locale);

  return (
    <main className="space-y-6">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t("homeCrumb"), locale, path: "" },
            { name: t("title"), locale, path: "generations" },
          ]),
          itemListJsonLd({
            name: t("title"),
            locale,
            path: "generations",
            items: generations.map((generation) => ({
              name: generation.name,
              path: `generations/${generation.slug}`,
            })),
          }),
        ]}
      />
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {generations.map((generation) => (
          <GenerationCard
            key={generation.slug}
            locale={locale}
            generation={generation}
            regionLabel={t("region", { region: generation.mainRegion })}
          />
        ))}
      </div>
    </main>
  );
}
