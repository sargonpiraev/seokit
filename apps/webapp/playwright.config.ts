import { defineConfig, devices } from "@playwright/test";
import type { NextcovConfig } from "nextcov";

type PlaywrightConfigWithNextcov = Parameters<typeof defineConfig>[0] & {
  nextcov?: NextcovConfig;
};

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4100";
const withCoverage = process.env.E2E_COVERAGE === "true";

const projectNames = [
  "functional",
  "seo",
  "analytics",
  "visual",
  "visual-mobile",
  "cwv",
] as const;

export const nextcov: NextcovConfig = {
  cdpPort: 9242,
  buildDir: ".next",
  outputDir: "coverage",
  sourceRoot: "./",
  include: ["src/**/*.{ts,tsx}"],
  exclude: ["**/*.test.ts", "**/*.spec.ts", "e2e/**"],
  reporters: ["html", "json", "text-summary"],
  log: false,
};

const projectDevices: Record<(typeof projectNames)[number], (typeof devices)[string]> = {
  functional: devices["Desktop Chrome"],
  seo: devices["Desktop Chrome"],
  analytics: devices["Desktop Chrome"],
  visual: devices["Desktop Chrome"],
  "visual-mobile": devices["Pixel 5"],
  cwv: devices["Desktop Chrome"],
};

const testMatchByProject: Record<(typeof projectNames)[number], string> = {
  functional: "**/*.functional.spec.ts",
  seo: "**/*.seo.spec.ts",
  analytics: "**/*.analytics.spec.ts",
  visual: "**/*.visual.spec.ts",
  "visual-mobile": "**/*.visual.spec.ts",
  cwv: "**/*.cwv.spec.ts",
};

const config: PlaywrightConfigWithNextcov = {
  testDir: ".",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: {
    toHaveScreenshot: {
      // Linux CI AA/font rasterization can drift ~dozen pixels vs baselines.
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL,
  },
  projects: projectNames.map((name) => ({
    name,
    testMatch: testMatchByProject[name],
    use: { ...projectDevices[name] },
  })),
  webServer: {
    command: "node scripts/start-server.mjs",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      NEXT_PUBLIC_SITE_URL: baseURL,
    },
  },
  ...(withCoverage ? { nextcov } : {}),
};

export default defineConfig(config);
