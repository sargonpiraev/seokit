import { test, expect } from "./fixtures";
import {
  CWV_BUDGETS,
  enableCpuThrottle4x,
  installCwvCollectors,
  waitForInpSample,
} from "./lib/cwv";

test("home INP under CDP CPU 4x", async ({ page }) => {
  await installCwvCollectors(page);
  await enableCpuThrottle4x(page);

  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByRole("heading", { level: 1 }).click({ delay: 200 });
  await page.getByRole("link", { name: "Browse Pokédex" }).click({ delay: 200 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("heading", { level: 1 }).click({ delay: 200 });

  const metrics = await waitForInpSample(page);
  expect(metrics.inp, "expected an INP sample from interactions").not.toBeNull();
  expect(metrics.inp!).toBeLessThanOrEqual(CWV_BUDGETS.inpMs);
  expect(metrics.cls).toBeLessThanOrEqual(CWV_BUDGETS.cls);
});
