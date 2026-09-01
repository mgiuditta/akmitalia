import { test, expect } from '@playwright/test'

test.describe('Home', () => {
  test('pone il bivio e nomina il territorio', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/AKM Italia/)
    await expect(page.locator('h1')).toHaveText('Si comincia da zero, e si comincia vicino a casa.')

    // Il bivio e' la ragione della pagina: una voce per corso marcato.
    const voci = page.locator('#bivio > li')
    await expect(voci).toHaveCount(3)

    // La prova sta dentro la voce, non in una sezione a parte (#17).
    await expect(voci.first()).toContainText('centri ·')

    // Il sigillo e' geometria, non contenuto: la pagina resta completa se
    // l'immagine facoltativa in `Impostazioni` viene svuotata (#35, #46).
    await expect(page.locator('svg circle')).not.toHaveCount(0)

    // L'unica azione piena porta ai centri, mai al form: il bivio viene prima.
    await expect(page.getByRole('link', { name: 'Trova il centro più vicino' })).toHaveAttribute(
      'href',
      '/centri',
    )
  })
})
