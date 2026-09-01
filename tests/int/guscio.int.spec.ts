import { describe, expect, it } from 'vitest'

import { risolvi } from '@/app/(frontend)/guscio'
import { corrente } from '@/app/(frontend)/menu'

/**
 * Il resolver e' l'unica logica del guscio: tre tipi di voce, e il caso che
 * conta davvero — una voce che non si risolve piu' sparisce, non rompe la
 * testata di tutto il sito.
 */
describe('risolvi', () => {
  it('una sezione fissa usa la rotta di codice, e l etichetta se c e', () => {
    expect(risolvi({ tipo: 'rotta', rotta: 'centri' })).toEqual({
      href: '/centri',
      etichetta: 'Centri',
    })
    expect(
      risolvi({ tipo: 'rotta', rotta: 'centri', etichetta: 'Dove ci alleniamo' })?.etichetta,
    ).toBe('Dove ci alleniamo')
  })

  it('una pagina interna usa il path calcolato e il titolo', () => {
    const pagina = { id: 1, titolo: 'Chi siamo', path: '/chi-siamo' }
    expect(risolvi({ tipo: 'interna', pagina } as never)).toEqual({
      href: '/chi-siamo',
      etichetta: 'Chi siamo',
    })
  })

  it('sparisce invece di rompere', () => {
    expect(risolvi({ tipo: 'rotta' })).toBeNull()
    expect(risolvi({ tipo: 'esterna' })).toBeNull()
    // Relazione non popolata (depth 0) o pagina cancellata: non c e un path.
    expect(risolvi({ tipo: 'interna', pagina: 42 } as never)).toBeNull()
  })
})

/**
 * La voce corrente. Il caso che rompe e' la home: `/` e' prefisso di ogni
 * altro percorso, e senza l'eccezione «Home» resterebbe marcata ovunque.
 */
describe('corrente', () => {
  it('la scheda di un centro marca la sezione che la contiene', () => {
    expect(corrente('/centri', '/centri')).toBe(true)
    expect(corrente('/centri', '/centri/abbiategrasso-dynamic-dance-school')).toBe(true)
  })

  it('la home si marca solo su se stessa', () => {
    expect(corrente('/', '/')).toBe(true)
    expect(corrente('/', '/centri')).toBe(false)
  })

  it('un prefisso di stringa non e un prefisso di percorso', () => {
    expect(corrente('/centri', '/centri-tecnici')).toBe(false)
  })
})
