import { test, expect } from '@playwright/test'

test.describe('Home', () => {
  test('pone il bivio e nomina il territorio', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/AKM Italia/)
    await expect(page.locator('h1')).toHaveText('Difendersi si impara. Vicino a casa.')

    // Il bivio e' la ragione della pagina: una voce per corso marcato.
    const voci = page.locator('#bivio > li')
    await expect(voci).toHaveCount(3)

    // La prova sta dentro la voce, non in una sezione a parte (#17).
    await expect(voci.first()).toContainText('centri:')

    // L'unica azione piena porta ai centri, mai al form: il bivio viene prima.
    await expect(page.getByRole('link', { name: 'Trova il centro più vicino' })).toHaveAttribute(
      'href',
      '/centri',
    )
  })
})
