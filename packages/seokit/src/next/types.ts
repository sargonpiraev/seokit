export interface SeokitNextRouting {
  locales: readonly string[];
  defaultLocale: string;
}

export type SeokitRouteParams = Record<string, string>;

export interface CreateSeokitPageRoutesOptions {
  /** Absolute origin for canonical / alternate URLs (e.g. `https://example.com`). */
  origin?: string;
  params?: SeokitRouteParams[];
  appDir?: string;
  buildDir?: string;
}

export interface SeokitPageRouteAlternate {
  locale: string;
  url: string;
}

export interface SeokitPageRoute {
  locale: string;
  pathname: string;
  params: SeokitRouteParams;
  pattern: string;
  /** Absolute URL. Uses `origin` from options when `baseURL` is omitted. */
  absoluteUrl(baseURL?: string, pathname?: string): string;
  alternates(baseURL?: string): SeokitPageRouteAlternate[];
  xDefaultUrl(baseURL?: string): string;
}

export interface ReadNextPageRoutesOptions {
  buildDir?: string;
}

export interface InferRouteFromSpecOptions {
  appDir?: string;
  buildDir?: string;
}

export interface CheckSeokitSpecCoverageOptions {
  appDir?: string;
  buildDir?: string;
  projectRoot?: string;
}

export interface SeokitSpecCoverageResult {
  warnings: string[];
  manifestRoutes: string[];
  specRoutes: string[];
  missingSpecs: string[];
  orphanSpecs: string[];
}
