import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Sezione } from '@/app/(frontend)/anatomia'

/**
 * L'unica regola dell'anatomia (#28) che non si vede guardando la pagina: una
 * sezione senza righe **non esiste**. Trovata dal prototipo sull'antibullismo,
 * che ha `adattoA` e `focus` vuoti (#16) e stampava un titolo con il nulla
 * sotto. La regola sta nel componente perche' una pagina se la dimentica.
 *
 * Niente jest-dom: il progetto non ce l'ha, e per queste asserzioni il DOM
 * nudo basta.
 */
describe('Sezione', () => {
  it('non esiste se le righe sono vuote', () => {
    const { container } = render(<Sezione titolo="Fa per te se" righe={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('non esiste nemmeno se le righe ci sono ma sono tutte vuote', () => {
    // Il caso vero: un array di Payload dove le voci sono state svuotate.
    const { container } = render(<Sezione titolo="Cosa si impara" righe={[null, '', undefined]} />)
    expect(container.innerHTML).toBe('')
  })

  it('scarta le righe vuote e tiene le piene', () => {
    const { container } = render(<Sezione titolo="Dove" righe={['Milano', '', 'Monza']} />)
    expect([...container.querySelectorAll('li')].map((li) => li.textContent)).toEqual([
      'Milano',
      'Monza',
    ])
  })

  it('con una riga sola esiste, titolo compreso', () => {
    const { container } = render(<Sezione titolo="Per quanto tempo" righe={['Ventiquattro mesi.']} />)
    expect(container.querySelector('h2')?.textContent).toBe('Per quanto tempo')
    expect(container.querySelectorAll('li')).toHaveLength(1)
  })

  it('senza `righe` non giudica: i figli sono di chi li passa', () => {
    const { container } = render(
      <Sezione titolo="In cattedra">
        <p>Vittorio Porreca</p>
      </Sezione>,
    )
    expect(container.textContent).toContain('Vittorio Porreca')
  })
})
