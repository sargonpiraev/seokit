import type { Metadata } from "next";

import { routing } from "@/i18n/routing";

export const SITE_NAME = "Seodit Example";

function pageUrl(locale: string, pagePath = "") {
  const normalizedPath = pagePath.replace(/^\//, "");
  return normalizedPath ? `/${locale}/${normalizedPath}` : `/${locale}`;
}

export function buildPageMetadata(input: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const normalizedPath = input.path.replace(/^\//, "");
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = pageUrl(locale, normalizedPath);
  }

  languages["x-default"] = pageUrl(routing.defaultLocale, normalizedPath);

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: pageUrl(input.locale, normalizedPath),
      languages,
    },
    openGraph: {
      type: "website",
      title: input.title,
      description: input.description,
      siteName: SITE_NAME,
      url: pageUrl(input.locale, normalizedPath),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}
