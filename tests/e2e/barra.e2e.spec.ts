import { test, expect } from '@playwright/test'

/**
 * La macchina a stati del menu, non l'animazione. GSAP e' volutamente fuori:
 * un test sui tempi di una timeline e' un test che sfarfalla.
 *
 * Gli stessi due casi girano su telefono e su desktop perche' dal
 * docs/adr/0007 il menu e' uno solo: sopra i 700px cambia la larghezza del
 * pannello, non il comportamento. Se un giorno il desktop tornasse ad avere i
 * link in riga, il primo `toBeHidden` di questo file lo dice subito.
 *
 * `toBeHidden` regge solo se il pannello chiuso esce davvero dall'albero di
 * accessibilita': se un giorno lo si chiudesse con la sola opacita', questo
 * test lo dice.
 */
const schermi = [
  { nome: 'telefono', viewport: { width: 375, height: 812 } },
  { nome: 'desktop', viewport: { width: 1440, height: 900 } },
]

for (const schermo of schermi) {
  test.describe(`Menu ${schermo.nome}`, () => {
    test.use({ viewport: schermo.viewport })

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
      const barra = page.locator('header.barra')
      expect((await barra.boundingBox())?.height).toBe(77)
    })
  })
}
