import { defineConfig, devices } from "@playwright/test";
import type { NextcovConfig } from "nextcov";

type PlaywrightConfigWithNextcov = Parameters<typeof defineConfig>[0] & {
  nextcov?: NextcovConfig;
};

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4100";
const withCoverage = process.env.E2E_COVERAGE === "true";

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
  projects: [
    {
      name: "functional",
      testMatch: "**/*.functional.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "seo",
      testMatch: "**/*.seo.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "analytics",
      testMatch: "**/*.analytics.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual",
      testMatch: "**/*.visual.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual-mobile",
      testMatch: "**/*.visual.spec.ts",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "cwv",
      testMatch: "**/*.cwv.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
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
