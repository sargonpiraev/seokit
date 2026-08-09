import { test, expect } from "./fixtures";
import { mockAnalytics } from "./lib/analytics";

test("gtag SDK mock records analytics events", async ({ page }) => {
  const analytics = await mockAnalytics(page);

  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.evaluate(() => {
    const w = window as Window & { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", "pw_harness_smoke", { engagement_time_msec: 1 });
  });

  await expect
    .poll(async () => (await analytics.drainGtagCalls()).length)
    .toBeGreaterThan(0);
  await expect.poll(() => analytics.hits.length).toBeGreaterThan(0);
});
