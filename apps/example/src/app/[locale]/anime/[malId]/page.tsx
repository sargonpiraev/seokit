import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { FIXTURE_ANIME, getFixtureAnimeDescription, getFixtureAnimeTitle } from "@/lib/fixtures";
import { buildPageMetadata } from "@/lib/metadata";

const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4100");

type AnimeDetailPageProps = {
  params: Promise<{ locale: string; malId: string }>;
};

export async function generateMetadata({ params }: AnimeDetailPageProps) {
  const { locale, malId } = await params;

  if (malId !== String(FIXTURE_ANIME.malId)) {
    return {};
  }

  return buildPageMetadata({
    locale,
    path: `anime/${malId}`,
    title: getFixtureAnimeTitle(locale),
    description: getFixtureAnimeDescription(locale),
  });
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { locale, malId } = await params;

  if (malId !== String(FIXTURE_ANIME.malId)) {
    notFound();
  }

  setRequestLocale(locale);
  const title = getFixtureAnimeTitle(locale);
  const description = getFixtureAnimeDescription(locale);

  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TVSeries",
            name: title,
            url: new URL(`/${locale}/anime/${malId}`, metadataBase).toString(),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: locale === "ru" ? "Главная" : "Home",
                item: new URL(`/${locale}`, metadataBase).toString(),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: locale === "ru" ? "Аниме" : "Anime",
                item: new URL(`/${locale}/anime`, metadataBase).toString(),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: title,
                item: new URL(`/${locale}/anime/${malId}`, metadataBase).toString(),
              },
            ],
          },
        ]}
      />
      <h1>{title}</h1>
      <p>{description}</p>
    </main>
  );
}
