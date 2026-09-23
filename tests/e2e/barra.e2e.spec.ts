import { test, expect } from '@playwright/test'

/**
 * La macchina a stati del menu, non l'animazione. GSAP e' volutamente fuori:
 * un test sui tempi di una timeline e' un test che sfarfalla.
 *
 * Dal docs/adr/0008 la barra ha due presentazioni: sotto i 1024px le voci
 * stanno dietro il bottone, sopra stanno in riga e il bottone non esiste. I
 * due casi qui sotto sono quei due mondi. Se un giorno il desktop tornasse al
 * solo pannello, il `toBeVisible` del caso desktop lo dice subito.
 *
 * `toBeHidden` regge solo se il pannello chiuso esce davvero dall'albero di
 * accessibilita': se un giorno lo si chiudesse con la sola opacita', questo
 * test lo dice.
 */
test.describe('Menu telefono', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('si apre, mostra le voci, si chiude con Escape e restituisce il fuoco', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000')

    const bottone = page.getByRole('button', { name: /menu/i })
    const voce = page.locator('header').getByRole('link', { name: 'Istruttori' })

    await expect(bottone).toHaveAttribute('aria-expanded', 'false')
    await expect(voce).toBeHidden()

    await bottone.click()
    await expect(bottone).toHaveAttribute('aria-expanded', 'true')
    await expect(voce).toBeVisible()
    await expect(page.locator('#contenuto')).toHaveAttribute('inert', '')

    await page.keyboard.press('Escape')
    await expect(voce).toBeHidden()
    await expect(bottone).toBeFocused()
    await expect(page.locator('#contenuto')).not.toHaveAttribute('inert', '')
  })

  test('la barra resta alta 77px', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const barra = page.locator('header.header')
    expect((await barra.boundingBox())?.height).toBe(77)
  })
})

/* La CTA non si nasconde mai (docs/adr/0008), ma sulla pagina che indica
   ripeteva l'H1 sotto e portava dove si era gia': li' cambia parola e porta al
   modulo. Voce 39 dell'audit antislop 001. */
test.describe('La CTA sulla propria pagina', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('su /contatti porta al modulo invece di ripetere l’H1', async ({ page }) => {
    await page.goto('http://localhost:3000/contatti')

    const header = page.locator('header')
    await expect(header.getByRole('link', { name: 'Richiedi informazioni' })).toHaveCount(0)
    const cta = header.getByRole('link', { name: 'Vai al modulo' })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '#modulo')
    await expect(page.locator('#modulo')).toBeVisible()
  })

  test('altrove resta la richiesta', async ({ page }) => {
    await page.goto('http://localhost:3000/centri')
    await expect(
      page.locator('header').getByRole('link', { name: 'Richiedi informazioni' }),
    ).toBeVisible()
  })
})

test.describe('Barra desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('le voci sono in riga, il bottone del menu non esiste, un solo landmark', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000')

    const header = page.locator('header')
    await expect(header.getByRole('link', { name: 'Istruttori' })).toBeVisible()
    await expect(header.getByRole('link', { name: 'Contatti' })).toBeVisible()
    await expect(page.getByRole('button', { name: /menu/i })).toBeHidden()
    await expect(header.getByRole('navigation', { name: 'Principale' })).toHaveCount(1)
    await expect(header.getByRole('link', { name: 'Richiedi informazioni' })).toBeVisible()
  })

  test('la barra resta alta 77px', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const barra = page.locator('header.header')
    expect((await barra.boundingBox())?.height).toBe(77)
  })
})
