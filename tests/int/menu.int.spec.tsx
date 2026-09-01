import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Menu } from '@/app/(frontend)/menu'

// `usePathname` e' l'unica cosa che il menu chiede al browser.
vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

const VOCI = [
  { href: '/centri', etichetta: 'Centri' },
  { href: '/contatta', etichetta: 'Contatta' },
]

const apri = () => screen.getByRole('button', { name: 'Apri il menu' })
const chiudi = () => screen.getByRole('button', { name: 'Chiudi il menu' })
const espanso = (b: HTMLElement) => b.getAttribute('aria-expanded')

afterEach(cleanup)

/**
 * Il panino non si prova col CSS — jsdom non ne applica — si prova col
 * contratto ARIA, che e' anche l'unica cosa che uno screen reader legge.
 */
describe('il panino della testata', () => {
  it('parte chiuso e punta all elenco che apre', () => {
    render(<Menu etichetta="Principale" panino voci={VOCI} />)

    expect(espanso(apri())).toBe('false')
    // `aria-controls` che punta a un id inesistente non e' un errore visibile:
    // e' un riferimento rotto che solo uno screen reader incontra.
    expect(document.getElementById(apri().getAttribute('aria-controls')!)).not.toBeNull()
  })

  it('apre, chiude, e cambia nome quando cambia stato', () => {
    render(<Menu etichetta="Principale" panino voci={VOCI} />)

    fireEvent.click(apri())
    expect(espanso(chiudi())).toBe('true')

    fireEvent.click(chiudi())
    expect(espanso(apri())).toBe('false')
  })

  it('Esc chiude e restituisce il fuoco al pulsante', () => {
    render(<Menu etichetta="Principale" panino voci={VOCI} />)
    const pulsante = apri()

    fireEvent.click(pulsante)
    const voce = screen.getByRole('link', { name: 'Centri' })
    voce.focus()
    fireEvent.keyDown(voce, { key: 'Escape' })

    expect(espanso(apri())).toBe('false')
    expect(document.activeElement).toBe(pulsante)
  })

  it('la voce cliccata chiude il pannello: non resta aperto sulla pagina nuova', () => {
    render(<Menu etichetta="Principale" panino voci={VOCI} />)

    fireEvent.click(apri())
    fireEvent.click(screen.getByRole('link', { name: 'Centri' }))

    expect(espanso(apri())).toBe('false')
  })

  it('regge le voci editoriali, che non hanno tetto', () => {
    const molte = Array.from({ length: 12 }, (_, i) => ({
      href: `/p${i}`,
      etichetta: `Voce ${i}`,
    }))
    render(<Menu etichetta="Principale" panino voci={molte} />)

    fireEvent.click(apri())
    expect(screen.getAllByRole('link')).toHaveLength(12)
  })

  it('il piede non ha pulsante: e gia in colonna, non compete per lo spazio', () => {
    render(<Menu etichetta="Secondaria" voci={VOCI} />)
    expect(screen.queryByRole('button')).toBeNull()
  })
})
