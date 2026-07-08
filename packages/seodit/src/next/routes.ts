import type {
  CreateSeoditPageRoutesOptions,
  SeoditNextConfig,
  SeoditNextRouting,
  SeoditPageRoute,
  SeoditPageRouteAlternate,
  SeoditRouteParams,
} from "./types.js";
import { inferRouteFromSpec } from "./manifest.js";

const LOCALE_PARAM = "locale";

export function defineSeoditNextConfig<TRouting extends SeoditNextRouting>(
  config: SeoditNextConfig<TRouting>,
): SeoditNextConfig<TRouting> {
  return config;
}

export function createSeoditPageRoutes<TRouting extends SeoditNextRouting>(
  config: SeoditNextConfig<TRouting>,
  importMetaUrl: string,
  options: CreateSeoditPageRoutesOptions = {},
): SeoditPageRoute[] {
  const pattern = inferRouteFromSpec(importMetaUrl, {
    appDir: options.appDir,
    buildDir: options.buildDir,
  });

  const paramSets = options.params?.length ? options.params : [{}];
  const routes: SeoditPageRoute[] = [];

  for (const locale of config.routing.locales) {
    for (const paramSet of paramSets) {
      const params = { ...paramSet, [LOCALE_PARAM]: locale };
      const pathname = buildPathname(pattern, params);

      routes.push(createRouteCase(pattern, locale, pathname, params, config.routing));
    }
  }

  return routes;
}

function createRouteCase(
  pattern: string,
  locale: string,
  pathname: string,
  params: SeoditRouteParams,
  routing: SeoditNextRouting,
): SeoditPageRoute {
  return {
    locale,
    pathname,
    params,
    pattern,
    absoluteUrl(baseURL, targetPathname = pathname) {
      return joinBaseUrl(baseURL, targetPathname);
    },
    alternates(baseURL) {
      return routing.locales.map((alternateLocale) => ({
        locale: alternateLocale,
        url: joinBaseUrl(baseURL, buildPathname(pattern, { ...params, [LOCALE_PARAM]: alternateLocale })),
      }));
    },
    xDefaultUrl(baseURL) {
      return joinBaseUrl(
        baseURL,
        buildPathname(pattern, { ...params, [LOCALE_PARAM]: routing.defaultLocale }),
      );
    },
  };
}

function buildPathname(pattern: string, params: SeoditRouteParams): string {
  return pattern.replace(/\[([^\]]+)\]/g, (_match, paramName: string) => {
    const value = params[paramName];
    if (value === undefined) {
      throw new Error(`Missing route param "${paramName}" for pattern ${pattern}`);
    }

    return value;
  });
}

function joinBaseUrl(baseURL: string | undefined, pathname: string): string {
  if (!baseURL) {
    return pathname;
  }

  return new URL(pathname, baseURL).toString();
}

export function buildPathnameForPattern(pattern: string, params: SeoditRouteParams): string {
  return buildPathname(pattern, params);
}

export function createAlternateUrls(
  pattern: string,
  params: SeoditRouteParams,
  locales: readonly string[],
  baseURL: string | undefined,
): SeoditPageRouteAlternate[] {
  return locales.map((locale) => ({
    locale,
    url: joinBaseUrl(baseURL, buildPathname(pattern, { ...params, [LOCALE_PARAM]: locale })),
  }));
}
