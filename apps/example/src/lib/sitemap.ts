import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import {
  absoluteAlternateLanguages,
  absolutePageUrl,
  SITE_URL,
} from "@/lib/metadata";
import {
  DEMO_GENERATIONS,
  DEMO_POKEMON,
  DEMO_TYPES,
} from "@/lib/pokeapi";

export type SitemapId = { id: string };

const STATIC_PATHS = ["", "pokemon", "types", "generations"] as const;

export function generateStaticSitemapId(locale: string): SitemapId {
  return { id: `${locale}-static` };
}

export function generateEntitySitemapId(
  locale: string,
  entity: string,
  chunk: number,
): SitemapId {
  return { id: `${locale}-${entity}-${chunk}` };
}

export function parseSitemapId(rawId: string) {
  if (rawId.endsWith("-static")) {
    return {
      locale: rawId.slice(0, -"-static".length),
      entity: "static" as const,
      chunk: 0,
    };
  }

  const parts = rawId.split("-");
  const locale = parts[0]!;
  const chunk = Number(parts[parts.length - 1]);
  const entity = parts.slice(1, -1).join("-");

  return { locale, entity, chunk };
}

function entry(
  locale: string,
  pagePath: string,
  opts: Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority">,
): MetadataRoute.Sitemap[number] {
  return {
    url: absolutePageUrl(locale, pagePath),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: absoluteAlternateLanguages(pagePath),
    },
  };
}

export function generateAllSitemapIds(): SitemapId[] {
  const ids: SitemapId[] = [];

  for (const locale of routing.locales) {
    ids.push(generateStaticSitemapId(locale));
    ids.push(generateEntitySitemapId(locale, "pokemon", 0));
    ids.push(generateEntitySitemapId(locale, "types", 0));
    ids.push(generateEntitySitemapId(locale, "generations", 0));
  }

  return ids;
}

export function buildSitemapIndexXml(): string {
  const ids = generateAllSitemapIds();
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ids
  .map(
    (item) =>
      `  <sitemap><loc>${SITE_URL}/sitemap/${item.id}.xml</loc></sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;
}

function buildStaticUrlset(locale: string): MetadataRoute.Sitemap {
  return STATIC_PATHS.map((pagePath) =>
    entry(locale, pagePath, {
      changeFrequency: pagePath ? "daily" : "weekly",
      priority: pagePath ? 0.8 : 1,
    }),
  );
}

function buildPokemonUrlset(locale: string): MetadataRoute.Sitemap {
  return [...DEMO_POKEMON]
    .sort((a, b) => a.localeCompare(b))
    .map((name) =>
      entry(locale, `pokemon/${name}`, {
        changeFrequency: "weekly",
        priority: 0.7,
      }),
    );
}

function buildTypesUrlset(locale: string): MetadataRoute.Sitemap {
  return [...DEMO_TYPES]
    .sort((a, b) => a.localeCompare(b))
    .map((slug) =>
      entry(locale, `types/${slug}`, {
        changeFrequency: "weekly",
        priority: 0.6,
      }),
    );
}

function buildGenerationsUrlset(locale: string): MetadataRoute.Sitemap {
  return [...DEMO_GENERATIONS].map((slug) =>
    entry(locale, `generations/${slug}`, {
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );
}

const entityBuilders = {
  static: buildStaticUrlset,
  pokemon: buildPokemonUrlset,
  types: buildTypesUrlset,
  generations: buildGenerationsUrlset,
} as const;

export function buildSitemapById(id: string): MetadataRoute.Sitemap {
  const { locale, entity } = parseSitemapId(id);

  if (!(routing.locales as readonly string[]).includes(locale)) {
    throw new Error(`Unknown sitemap locale: ${locale}`);
  }

  const builder = entityBuilders[entity as keyof typeof entityBuilders];
  if (!builder) {
    throw new Error(`Unknown sitemap entity: ${entity}`);
  }

  return builder(locale);
}

export function serializeSitemapUrlset(entries: MetadataRoute.Sitemap): string {
  const urls = entries
    .map((item) => {
      const alternates = item.alternates?.languages
        ? Object.entries(item.alternates.languages)
            .map(
              ([lang, href]) =>
                `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`,
            )
            .join("\n")
        : "";
      const lastmod = item.lastModified
        ? `    <lastmod>${new Date(item.lastModified).toISOString()}</lastmod>\n`
        : "";
      const changefreq = item.changeFrequency
        ? `    <changefreq>${item.changeFrequency}</changefreq>\n`
        : "";
      const priority =
        item.priority === undefined
          ? ""
          : `    <priority>${item.priority}</priority>\n`;

      return `  <url>
    <loc>${item.url}</loc>
${lastmod}${changefreq}${priority}${alternates}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}
