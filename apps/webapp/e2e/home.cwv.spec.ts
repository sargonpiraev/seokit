import { test, expect } from "./fixtures";
import {
  CWV_BUDGETS,
  enableCpuThrottle4x,
  installCwvCollectors,
  readCwvMetrics,
} from "./lib/cwv";

test("home INP under CDP CPU 4x", async ({ page }) => {
  await installCwvCollectors(page);
  await enableCpuThrottle4x(page);

  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Same-document clicks so Event Timing / INP stay on this page.
  await page.getByRole("heading", { level: 1 }).click();
  await page.getByRole("link", { name: "Browse Pokédex" }).hover();
  await page.getByRole("heading", { level: 1 }).click();

  const metrics = await readCwvMetrics(page);
  expect(metrics.inp, "expected an INP sample from interactions").not.toBeNull();
  expect(metrics.inp!).toBeLessThanOrEqual(CWV_BUDGETS.inpMs);
  expect(metrics.cls).toBeLessThanOrEqual(CWV_BUDGETS.cls);
});
