import type {
  CreateSeokitPageRoutesOptions,
  SeokitNextRouting,
  SeokitPageRoute,
  SeokitRouteParams,
} from "./types.js";
import { inferRouteFromSpec } from "./manifest.js";

const LOCALE_PARAM = "locale";

/**
 * Expand colocated `page.seokit.spec.ts` into one case per next-intl locale.
 * Pass the same `routing` object you give to next-intl.
 */
export function createSeokitPageRoutes(
  routing: SeokitNextRouting,
  importMetaUrl: string,
  options: CreateSeokitPageRoutesOptions = {},
): SeokitPageRoute[] {
  const pattern = inferRouteFromSpec(importMetaUrl, {
    appDir: options.appDir,
    buildDir: options.buildDir,
  });

  const paramSets = options.params?.length ? options.params : [{}];
  const routes: SeokitPageRoute[] = [];

  for (const locale of routing.locales) {
    for (const paramSet of paramSets) {
      const params = { ...paramSet, [LOCALE_PARAM]: locale };
      const pathname = buildPathname(pattern, params);

      routes.push(createRouteCase(pattern, locale, pathname, params, routing, options.origin));
    }
  }

  return routes;
}

function createRouteCase(
  pattern: string,
  locale: string,
  pathname: string,
  params: SeokitRouteParams,
  routing: SeokitNextRouting,
  origin: string | undefined,
): SeokitPageRoute {
  const resolveOrigin = (baseURL?: string) => baseURL ?? origin;

  return {
    locale,
    pathname,
    params,
    pattern,
    absoluteUrl(baseURL, targetPathname = pathname) {
      return joinBaseUrl(resolveOrigin(baseURL), targetPathname);
    },
    alternates(baseURL) {
      return routing.locales.map((alternateLocale) => ({
        locale: alternateLocale,
        url: joinBaseUrl(
          resolveOrigin(baseURL),
          buildPathname(pattern, { ...params, [LOCALE_PARAM]: alternateLocale }),
        ),
      }));
    },
    xDefaultUrl(baseURL) {
      return joinBaseUrl(
        resolveOrigin(baseURL),
        buildPathname(pattern, { ...params, [LOCALE_PARAM]: routing.defaultLocale }),
      );
    },
  };
}

function buildPathname(pattern: string, params: SeokitRouteParams): string {
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
