import { test, expect } from "./fixtures";

test.describe("page type: landing", () => {
  test("desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "visual", "desktop only");
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveScreenshot("home-desktop.png", { fullPage: true });
  });

  test("mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "visual-mobile", "mobile only");
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveScreenshot("home-mobile.png", { fullPage: true });
  });
});
