import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('la home apre e si presenta', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Krav Maga/)
    await expect(page.locator('h1').first()).toHaveText('Difendersi si impara')
  })
})
