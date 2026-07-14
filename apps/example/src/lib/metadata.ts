import type { Metadata } from "next";

import { routing } from "@/i18n/routing";

export const SITE_NAME = "Pokédex";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4100";

const OG_LOCALE: Record<(typeof routing.locales)[number], string> = {
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
};

/** Path-only URL: `/en/pokemon` (used by Next metadataBase + relative alternates). */
export function pagePath(locale: string, pagePath = "") {
  const normalizedPath = pagePath.replace(/^\//, "");
  return normalizedPath ? `/${locale}/${normalizedPath}` : `/${locale}`;
}

/** Absolute URL: `http://localhost:4100/en/pokemon`. */
export function absolutePageUrl(locale: string, pagePathValue = "") {
  return new URL(pagePath(locale, pagePathValue), SITE_URL).toString();
}

export function alternateLanguages(pagePathValue = "") {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = pagePath(locale, pagePathValue);
  }

  languages["x-default"] = pagePath(routing.defaultLocale, pagePathValue);
  return languages;
}

/** Absolute hreflang map for sitemaps. */
export function absoluteAlternateLanguages(pagePathValue = "") {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = absolutePageUrl(locale, pagePathValue);
  }

  languages["x-default"] = absolutePageUrl(routing.defaultLocale, pagePathValue);
  return languages;
}

export function buildPageMetadata(input: {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string | null;
}): Metadata {
  const normalizedPath = input.path.replace(/^\//, "");
  const canonical = pagePath(input.locale, normalizedPath);
  const locale = input.locale as (typeof routing.locales)[number];
  const ogLocale = OG_LOCALE[locale];

  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: {
      canonical,
      languages: alternateLanguages(normalizedPath),
    },
    openGraph: {
      type: "website",
      title: input.title,
      description: input.description,
      siteName: SITE_NAME,
      url: canonical,
      locale: ogLocale,
      ...(input.image
        ? { images: [{ url: input.image, alt: input.title }] }
        : {}),
    },
    twitter: {
      card: input.image ? "summary_large_image" : "summary",
      title: input.title,
      description: input.description,
      ...(input.image ? { images: [input.image] } : {}),
    },
  };
}
