import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";

export type HtmlInput = string | CheerioAPI;

export function parseHtml(html: string): CheerioAPI {
  return cheerio.load(html);
}

export function toCheerio(input: HtmlInput): CheerioAPI {
  return typeof input === "string" ? parseHtml(input) : input;
}

export function getMetaTitle($: CheerioAPI): string | undefined {
  const title = $("title").first().text().trim();
  return title.length > 0 ? title : undefined;
}

export function getHtmlLang($: CheerioAPI): string | undefined {
  return $("html").first().attr("lang");
}

export function getMetaNameContent($: CheerioAPI, name: string): string | undefined {
  return $(`meta[name="${name}"]`).first().attr("content");
}

export function getMetaPropertyContent($: CheerioAPI, property: string): string | undefined {
  return $(`meta[property="${property}"]`).first().attr("content");
}

export function getLinkHref($: CheerioAPI, rel: string): string | undefined {
  return $(`link[rel="${rel}"]`).first().attr("href");
}

export function getCanonicalHref($: CheerioAPI): string | undefined {
  return getLinkHref($, "canonical");
}

export function getAlternateHref($: CheerioAPI, hreflang: string): string | undefined {
  let href: string | undefined;

  $('link[rel="alternate"]').each((_, element) => {
    if (href) return;
    const link = $(element);
    if (link.attr("hreflang") === hreflang) {
      href = link.attr("href");
    }
  });

  return href;
}

export function getAlternateMediaHref($: CheerioAPI, media: string): string | undefined {
  let href: string | undefined;

  $('link[rel="alternate"]').each((_, element) => {
    if (href) return;
    const link = $(element);
    if (link.attr("media") === media) {
      href = link.attr("href");
    }
  });

  return href;
}

export function getAlternateTypeHref($: CheerioAPI, type: string): string | undefined {
  let href: string | undefined;

  $('link[rel="alternate"]').each((_, element) => {
    if (href) return;
    const link = $(element);
    if (link.attr("type") === type) {
      href = link.attr("href");
    }
  });

  return href;
}
