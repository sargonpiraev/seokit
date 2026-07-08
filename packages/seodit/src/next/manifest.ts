import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { InferRouteFromSpecOptions, ReadNextPageRoutesOptions } from "./types.js";

const RESERVED_PAGE_ROUTES = new Set(["/_not-found", "/_global-error"]);

export function getAppPathRoutesManifestPath(buildDir = ".next"): string {
  return path.join(buildDir, "app-path-routes-manifest.json");
}

export function readAppPathRoutesManifest(buildDir = ".next"): Record<string, string> {
  const manifestPath = getAppPathRoutesManifestPath(buildDir);
  return JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, string>;
}

export function isNextPageManifestKey(key: string): boolean {
  return key.endsWith("/page");
}

export function manifestKeyToRoutePattern(key: string): string {
  return key.slice(0, -"/page".length) || "/";
}

export function readNextPageRoutes(options: ReadNextPageRoutesOptions = {}): string[] {
  const manifest = readAppPathRoutesManifest(options.buildDir);
  const routes = new Set<string>();

  for (const [key, routePattern] of Object.entries(manifest)) {
    if (!isNextPageManifestKey(key)) continue;
    if (RESERVED_PAGE_ROUTES.has(routePattern)) continue;
    routes.add(routePattern);
  }

  return [...routes].sort();
}

export function specFileToManifestKey(specFilePath: string, appDir = "src/app"): string | undefined {
  const normalizedSpec = specFilePath.split(path.sep).join("/");
  const normalizedAppDir = appDir.split(path.sep).join("/");
  const marker = `/${normalizedAppDir}/`;

  const index = normalizedSpec.indexOf(marker);
  if (index === -1) return undefined;

  const relativePath = normalizedSpec.slice(index + marker.length);
  if (!relativePath.endsWith("/page.seodit.spec.ts")) return undefined;

  const routeDir = relativePath.slice(0, -"/page.seodit.spec.ts".length);
  return routeDir ? `/${routeDir}/page` : "/page";
}

export function inferRouteFromSpec(
  importMetaUrl: string,
  options: InferRouteFromSpecOptions = {},
): string {
  const appDir = options.appDir ?? "src/app";
  const buildDir = options.buildDir ?? ".next";
  const specFilePath = fileURLToPath(importMetaUrl);
  const manifestKey = specFileToManifestKey(specFilePath, appDir);

  if (!manifestKey) {
    throw new Error(`Could not map colocated seodit spec to a Next page route: ${specFilePath}`);
  }

  const manifest = readAppPathRoutesManifest(buildDir);
  const routePattern = manifest[manifestKey];

  if (!routePattern) {
    throw new Error(
      `No route found in ${getAppPathRoutesManifestPath(buildDir)} for manifest key ${manifestKey}`,
    );
  }

  return routePattern;
}

export function discoverSeoditSpecRoutes(projectRoot: string, appDir = "src/app"): string[] {
  const appRoot = path.join(projectRoot, appDir);
  const routes = new Set<string>();

  function walk(currentDir: string): void {
    if (!existsSync(currentDir)) return;

    for (const entry of readDirectoryEntries(currentDir)) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (entry.name !== "page.seodit.spec.ts") continue;

      const manifestKey = specFileToManifestKey(fullPath, appDir);
      if (!manifestKey) continue;

      routes.add(manifestKeyToRoutePattern(manifestKey));
    }
  }

  walk(appRoot);
  return [...routes].sort();
}

function readDirectoryEntries(directory: string) {
  return readdirSync(directory, { withFileTypes: true });
}
