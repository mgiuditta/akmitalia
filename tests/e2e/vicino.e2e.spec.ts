import { test, expect } from '@playwright/test'

/**
 * Il centro piu' vicino (docs/adr/0010). Due cose vanno difese: che la
 * posizione non venga mai chiesta da sola al caricamento, e che un rifiuto non
 * lasci la pagina senza elenco.
 */
test.describe('Il centro più vicino', () => {
  const bottone = /Trova il centro più vicino/i

  test('non chiede la posizione al caricamento', async ({ page, context }) => {
    let chiesta = false
    await context.grantPermissions([])
    await page.addInitScript(() => {
      const vero = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation)
      ;(window as unknown as { __chiesta: boolean }).__chiesta = false
      navigator.geolocation.getCurrentPosition = ((...args: Parameters<typeof vero>) => {
        ;(window as unknown as { __chiesta: boolean }).__chiesta = true
        return vero(...args)
      }) as typeof vero
    })

    await page.goto('http://localhost:3000/centri')
    await expect(page.getByRole('button', { name: bottone })).toBeVisible()
    chiesta = await page.evaluate(() => (window as unknown as { __chiesta: boolean }).__chiesta)
    expect(chiesta).toBe(false)
  })

  test('con la posizione riordina l’elenco e nomina il più vicino', async ({ page, context }) => {
    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: 45.4642, longitude: 9.19 })

    await page.goto('http://localhost:3000/centri')
    await page.getByRole('button', { name: bottone }).click()

    await expect(page.locator('#titolo-elenco')).toHaveText('I centri più vicini a te')
    await expect(page.getByText('Il più vicino a te')).toBeVisible()
    await expect(page.locator('.centro__distanza').first()).toContainText('km da te')
  })

  test('con il permesso negato l’elenco resta e l’errore è una frase', async ({ page, context }) => {
    /* Nessun permesso concesso: in Chromium la richiesta fallisce con
       PERMISSION_DENIED senza mostrare alcun prompt. */
    await context.clearPermissions()

    await page.goto('http://localhost:3000/centri')
    await page.getByRole('button', { name: bottone }).click()

    await expect(page.locator('.vicino__avviso')).toContainText(/posizione/i)
    await expect(page.locator('#titolo-elenco')).toHaveText('Tutti i centri')
    expect(await page.locator('.centro').count()).toBeGreaterThan(0)
  })
})
