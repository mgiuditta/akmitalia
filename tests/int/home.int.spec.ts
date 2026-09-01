import { describe, expect, it } from 'vitest'
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { bivio } from '@/app/(frontend)/home'

/**
 * `bivio` costruisce la prova che sta dentro la voce della home: quanti centri
 * tengono quel percorso e in quali comuni. I due casi che contano sono il
 * percorso senza centri attivi, che deve restare nel bivio (#24), e i tre
 * centri di Milano, che sono un comune solo.
 */
const corso = (id: number): Corso => ({ id, nome: `Corso ${id}` }) as Corso

const sede = (citta: string, disciplina: number): Sede =>
  ({
    id: citta.length * 10 + disciplina,
    nome: citta,
    indirizzo: { citta },
    orari: [{ disciplina: { id: disciplina }, giorni: ['lun'], oraInizio: '20:00', oraFine: '21:30' }],
  }) as unknown as Sede

describe('bivio', () => {
  it('conta i centri e nomina i comuni, senza ripetere Milano', () => {
    const [voce] = bivio(
      [corso(1)],
      [sede('Milano', 1), sede('Milano', 1), sede('Binasco', 1), sede('Bresso', 2)],
    )
    expect(voce.centri).toBe(3)
    expect(voce.comuni).toEqual(['Binasco', 'Milano'])
  })

  it('un percorso che nessuno tiene resta nel bivio, con zero centri', () => {
    const [voce] = bivio([corso(9)], [sede('Binasco', 1)])
    expect(voce.centri).toBe(0)
    expect(voce.comuni).toEqual([])
  })
})
