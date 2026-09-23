import { test, expect } from '@playwright/test'

/**
 * Il centro piu' vicino (docs/adr/0010). Due cose vanno difese: che la
 * posizione non venga mai chiesta da sola al caricamento, e che un rifiuto non
 * lasci la pagina senza elenco.
 */
test.describe('Il centro più vicino', () => {
  const button = /Trova il centro più vicino/i

  test('non chiede la posizione al caricamento', async ({ page, context }) => {
    let asked = false
    await context.grantPermissions([])
    await page.addInitScript(() => {
      const real = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation)
      ;(window as unknown as { __asked: boolean }).__asked = false
      navigator.geolocation.getCurrentPosition = ((...args: Parameters<typeof real>) => {
        ;(window as unknown as { __asked: boolean }).__asked = true
        return real(...args)
      }) as typeof real
    })

    await page.goto('http://localhost:3000/centri')
    await expect(page.getByRole('button', { name: button })).toBeVisible()
    asked = await page.evaluate(() => (window as unknown as { __asked: boolean }).__asked)
    expect(asked).toBe(false)
  })

  test('con la posizione riordina l’elenco e nomina il più vicino', async ({ page, context }) => {
    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: 45.4642, longitude: 9.19 })

    await page.goto('http://localhost:3000/centri')
    await page.getByRole('button', { name: button }).click()

    await expect(page.locator('#list-title')).toHaveText('I centri più vicini a te')
    await expect(page.getByText('Il più vicino a te')).toBeVisible()
    await expect(page.locator('.center__distance').first()).toContainText('km da te')
  })

  test('con il permesso negato l’elenco resta e l’errore è una frase', async ({ page, context }) => {
    /* Nessun permesso concesso: in Chromium la richiesta fallisce con
       PERMISSION_DENIED senza mostrare alcun prompt. */
    await context.clearPermissions()

    await page.goto('http://localhost:3000/centri')
    await page.getByRole('button', { name: button }).click()

    await expect(page.locator('.nearest__notice')).toContainText(/posizione/i)
    await expect(page.locator('#list-title')).toHaveText('Tutti i centri')
    expect(await page.locator('.center').count()).toBeGreaterThan(0)
  })
})
