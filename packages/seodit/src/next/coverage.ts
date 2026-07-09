import type { CheckSeoditSpecCoverageOptions, SeoditSpecCoverageResult } from "./types.js";
import { discoverSeoditSpecRoutes, readNextPageRoutes } from "./manifest.js";

export function checkSeoditSpecCoverage(
  options: CheckSeoditSpecCoverageOptions = {},
): SeoditSpecCoverageResult {
  const appDir = options.appDir ?? "src/app";
  const projectRoot = options.projectRoot ?? process.cwd();
  const manifestRoutes = readNextPageRoutes({ buildDir: options.buildDir });
  const specRoutes = discoverSeoditSpecRoutes(projectRoot, appDir);

  const missingSpecs = manifestRoutes.filter((route) => !specRoutes.includes(route));
  const orphanSpecs = specRoutes.filter((route) => !manifestRoutes.includes(route));
  const warnings: string[] = [];

  for (const route of missingSpecs) {
    warnings.push(`Missing colocated page.seodit.spec.ts for Next page route ${route}`);
  }

  for (const route of orphanSpecs) {
    warnings.push(`Colocated seodit spec exists for route ${route}, but it is not present in Next build manifest`);
  }

  return {
    warnings,
    manifestRoutes,
    specRoutes,
    missingSpecs,
    orphanSpecs,
  };
}

export function formatSeoditSpecCoverageWarnings(result: SeoditSpecCoverageResult): string {
  if (result.warnings.length === 0) {
    return "Seodit spec coverage looks complete.";
  }

  return result.warnings.join("\n");
}
