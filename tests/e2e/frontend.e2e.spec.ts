import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('la home apre e si presenta', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Krav Maga/)
    await expect(page.locator('h1').first()).toHaveText('Difendersi si impara')
  })

  /* Il filtro per provincia cambia URL, titolo ed elenco senza ricaricare:
     una variabile messa su window prima del click deve sopravvivere. */
  test('il filtro dei centri non ricarica la pagina e regge il tasto indietro', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/centri')
    const filtri = page.getByRole('navigation', { name: 'Filtra per provincia' })
    const filtro = filtri.getByRole('link', { name: /^MI \(/ })
    test.skip((await filtro.count()) === 0, 'Nessun centro in provincia di Milano nel database')

    await page.evaluate(() => {
      ;(window as unknown as { __vivo: number }).__vivo = 1
    })
    await filtro.click()

    await expect(page).toHaveURL(/\/centri\?provincia=MI$/)
    await expect(page.locator('#titolo-elenco')).toHaveText('Centri in provincia di MI')
    expect(await page.evaluate(() => (window as unknown as { __vivo?: number }).__vivo)).toBe(1)

    await page.goBack()
    await expect(page).toHaveURL(/\/centri$/)
    await expect(page.locator('#titolo-elenco')).toHaveText('Tutti i centri')
  })

  test('la pagina contatti mostra il modulo con le etichette', async ({ page }) => {
    await page.goto('http://localhost:3000/contatti')

    await expect(page.locator('h1')).toHaveText('Richiedi informazioni')
    await expect(page.getByLabel('Cognome')).toBeVisible()
    await expect(page.getByLabel('Centro tecnico')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Invia la richiesta' })).toBeVisible()
  })
})
