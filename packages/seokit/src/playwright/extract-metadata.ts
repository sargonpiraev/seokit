import type { Page } from "@playwright/test";
import { parseRobotsContent } from "../core/metadata/parse-robots.js";
import type { PageMetadata } from "../core/metadata/types.js";

type ExtractedMetadata = {
  lang: string | null;
  title: string | null;
  description: string | null;
  canonical: string | null;
  robotsContent: string | null;
  languages: Record<string, string>;
};

/** Read current document head into a Metadata-like object (no locator waits). */
export async function extractPageMetadata(page: Page): Promise<PageMetadata> {
  const extracted = await page.evaluate((): ExtractedMetadata => {
    const languages: Record<string, string> = {};
    for (const link of document.querySelectorAll('link[rel="alternate"][hreflang]')) {
      const hreflang = link.getAttribute("hreflang");
      const href = link.getAttribute("href");
      if (hreflang && href) languages[hreflang] = href;
    }

    return {
      lang: document.documentElement.getAttribute("lang"),
      title: document.querySelector("title")?.textContent?.trim() ?? null,
      description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      robotsContent: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
      languages,
    };
  });

  return {
    lang: extracted.lang,
    title: extracted.title,
    description: extracted.description,
    alternates: {
      canonical: extracted.canonical,
      languages: extracted.languages,
    },
    robots: parseRobotsContent(extracted.robotsContent),
  };
}
