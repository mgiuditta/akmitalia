import { describe, expect, it } from 'vitest'
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { dove } from '@/app/(frontend)/corsi/corso'

/**
 * `dove` e' l'unica logica della pagina corso: il legame corso-sede vive sugli
 * orari, e i due casi che contano sono il centro che tiene *un altro* corso e
 * il centro sospeso, che va nominato e non fatto sparire (#9).
 * Nessun Payload da avviare: la funzione e' pura.
 */
const corso = { id: 1 } as Corso

const sede = (nome: string, attivo: boolean, disciplina: number): Sede =>
  ({
    id: nome.length + disciplina,
    nome,
    attivo,
    orari: [{ disciplina: { id: disciplina }, giorni: ['lun'], oraInizio: '20:00', oraFine: '21:30' }],
  }) as unknown as Sede

describe('dove', () => {
  it('tiene i centri che hanno un orario di quel corso, divisi per stagione', () => {
    const { attive, sospese } = dove(
      [sede('Binasco', true, 1), sede('Muggio', false, 1), sede('Bresso', true, 2)],
      corso,
    )
    expect(attive.map((d) => d.sede.nome)).toEqual(['Binasco'])
    expect(sospese.map((d) => d.sede.nome)).toEqual(['Muggio'])
  })

  it('un corso senza orari da nessuna parte non e un errore', () => {
    expect(dove([sede('Bresso', true, 2)], corso)).toEqual({ attive: [], sospese: [] })
  })
})
