import { test, expect } from '@playwright/test'

/**
 * La rotta `[...path]` rende qualsiasi pagina editoriale (docs/adr/0011).
 * Quello che va difeso e' che non rubi le rotte scritte a mano: in Next un
 * segmento statico batte una catch-all, ma e' un comportamento del framework e
 * non del nostro codice, quindi lo verifica un test.
 */
test.describe('Pagine editoriali', () => {
  test('la privacy risponde e ha un titolo', async ({ page }) => {
    await page.goto('http://localhost:3000/privacy')
    await expect(page.locator('h1')).toHaveText('Privacy')
    await expect(page.getByRole('heading', { name: 'Quali dati raccogliamo' })).toBeVisible()
  })

  test('le rotte scritte a mano non finiscono nella catch-all', async ({ page }) => {
    for (const [pathway, title] of [
      ['/centri', /centri/i],
      ['/corsi', /momento/i],
      ['/contatti', /Richiedi informazioni/i],
      ['/istruttori', /./],
    ] as const) {
      const response = await page.goto(`http://localhost:3000${pathway}`)
      expect(response?.status(), pathway).toBe(200)
      await expect(page.locator('h1'), pathway).toHaveText(title)
    }
  })

  test('una pagina che non esiste resta un 404', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/questa-non-esiste')
    expect(response?.status()).toBe(404)
  })

  test('il footer porta le voci legali', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    const footer = page.locator('#footer')
    await expect(footer.getByRole('link', { name: 'Privacy' })).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Cookie' })).toBeVisible()
  })
})
