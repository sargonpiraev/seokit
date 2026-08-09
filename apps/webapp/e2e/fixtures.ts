import { test as base, expect } from "@playwright/test";
import { collectClientCoverage } from "nextcov/playwright";
import { nextcov } from "../playwright.config";

export const test = base.extend({
  coverage: [
    async ({ page }, use, testInfo) => {
      if (process.env.E2E_COVERAGE === "true") {
        await collectClientCoverage(page, testInfo, use, nextcov);
        return;
      }

      await use();
    },
    { scope: "test", auto: true },
  ],
});

export { expect };
