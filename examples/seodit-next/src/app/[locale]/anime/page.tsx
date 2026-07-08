import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/metadata";

type AnimePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AnimePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime" });

  return buildPageMetadata({
    locale,
    path: "anime",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AnimePage({ params }: AnimePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("anime");

  return (
    <main>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </main>
  );
}
