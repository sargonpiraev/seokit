export interface SeoditNextRouting {
  locales: readonly string[];
  defaultLocale: string;
}

export interface SeoditNextConfig<TRouting extends SeoditNextRouting = SeoditNextRouting> {
  routing: TRouting;
}

export type SeoditRouteParams = Record<string, string>;

export interface CreateSeoditPageRoutesOptions {
  params?: SeoditRouteParams[];
  appDir?: string;
  buildDir?: string;
}

export interface SeoditPageRouteAlternate {
  locale: string;
  url: string;
}

export interface SeoditPageRoute {
  locale: string;
  pathname: string;
  params: SeoditRouteParams;
  pattern: string;
  absoluteUrl(baseURL: string | undefined, pathname?: string): string;
  alternates(baseURL: string | undefined): SeoditPageRouteAlternate[];
  xDefaultUrl(baseURL: string | undefined): string;
}

export interface ReadNextPageRoutesOptions {
  buildDir?: string;
}

export interface InferRouteFromSpecOptions {
  appDir?: string;
  buildDir?: string;
}

export interface CheckSeoditSpecCoverageOptions {
  appDir?: string;
  buildDir?: string;
  projectRoot?: string;
}

export interface SeoditSpecCoverageResult {
  warnings: string[];
  manifestRoutes: string[];
  specRoutes: string[];
  missingSpecs: string[];
  orphanSpecs: string[];
}
