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
    for (const [percorso, titolo] of [
      ['/centri', /centri/i],
      ['/corsi', /momento/i],
      ['/contatti', /Richiedi informazioni/i],
      ['/istruttori', /./],
    ] as const) {
      const risposta = await page.goto(`http://localhost:3000${percorso}`)
      expect(risposta?.status(), percorso).toBe(200)
      await expect(page.locator('h1'), percorso).toHaveText(titolo)
    }
  })

  test('una pagina che non esiste resta un 404', async ({ page }) => {
    const risposta = await page.goto('http://localhost:3000/questa-non-esiste')
    expect(risposta?.status()).toBe(404)
  })

  test('il footer porta le voci legali', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    const pie = page.locator('#pie')
    await expect(pie.getByRole('link', { name: 'Privacy' })).toBeVisible()
    await expect(pie.getByRole('link', { name: 'Cookie' })).toBeVisible()
  })
})
