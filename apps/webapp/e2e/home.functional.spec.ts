import { test, expect } from "./fixtures";

test("home hero renders for default locale", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Browse Pokédex" }),
  ).toBeVisible();
});
