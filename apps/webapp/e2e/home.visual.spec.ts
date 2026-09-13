import { test, expect } from './fixtures'

test.describe('home.visual.spec.ts', { tag: '@visual' }, () => {
  test.describe('page type: landing', () => {
    test('desktop', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'desktop only')
      await page.goto('/en')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page).toHaveScreenshot('home-desktop.png', { fullPage: true })
    })

    test('mobile', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'mobile only')
      await page.goto('/en')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page).toHaveScreenshot('home-mobile.png', { fullPage: true })
    })
  })
})
