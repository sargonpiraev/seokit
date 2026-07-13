import type { CheckSeokitSpecCoverageOptions, SeokitSpecCoverageResult } from "./types.js";
import { discoverSeokitSpecRoutes, readNextPageRoutes } from "./manifest.js";

export function checkSeokitSpecCoverage(
  options: CheckSeokitSpecCoverageOptions = {},
): SeokitSpecCoverageResult {
  const appDir = options.appDir ?? "src/app";
  const projectRoot = options.projectRoot ?? process.cwd();
  const manifestRoutes = readNextPageRoutes({ buildDir: options.buildDir });
  const specRoutes = discoverSeokitSpecRoutes(projectRoot, appDir);

  const missingSpecs = manifestRoutes.filter((route) => !specRoutes.includes(route));
  const orphanSpecs = specRoutes.filter((route) => !manifestRoutes.includes(route));
  const warnings: string[] = [];

  for (const route of missingSpecs) {
    warnings.push(`Missing colocated page.seokit.spec.ts for Next page route ${route}`);
  }

  for (const route of orphanSpecs) {
    warnings.push(`Colocated seokit spec exists for route ${route}, but it is not present in Next build manifest`);
  }

  return {
    warnings,
    manifestRoutes,
    specRoutes,
    missingSpecs,
    orphanSpecs,
  };
}

export function formatSeokitSpecCoverageWarnings(result: SeokitSpecCoverageResult): string {
  if (result.warnings.length === 0) {
    return "Seokit spec coverage looks complete.";
  }

  return result.warnings.join("\n");
}
