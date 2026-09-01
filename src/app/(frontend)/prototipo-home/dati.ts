/**
 * PROTOTIPO USA E GETTA — issue #17, «La home: il bivio e la prova».
 *
 * Solo forma dei dati, nessun layout: le tre varianti devono poter buttare via
 * la struttura l'una dell'altra, ma discutono tutte sugli stessi dati veri di
 * Payload (15 centri attivi, 3 corsi in bivio, i turni settimanali).
 */
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { GIORNI, comune, corso as disciplina, ore, palestra, turni } from '../centri/sede'

export type Voce = {
  corso: Corso
  attive: Sede[]
  /** I comuni dove il corso e' davvero in programma, in ordine alfabetico. */
  comuni: string[]
  slot: number
}

/** Il bivio: un corso marcato, con accanto quanto e' vero oggi (ADR 0003, #24). */
export function bivio(corsi: Corso[], sedi: Sede[]): Voce[] {
  return corsi.map((corso) => {
    const attive = sedi.filter((s) => turni(s).some((o) => disciplina(o)?.id === corso.id))
    const slot = attive.reduce(
      (n, s) => n + turni(s).filter((o) => disciplina(o)?.id === corso.id).length,
      0,
    )
    return {
      corso,
      attive,
      comuni: [...new Set(attive.map(comune))].sort((a, b) => a.localeCompare(b, 'it')),
      slot,
    }
  })
}

export type Turno = {
  sede: Sede
  comune: string
  palestra: string
  ore: string
  inizio: string
  corso: Corso | null
}

/** La settimana vera, giorno per giorno: la prova che la variante B mette in cima. */
export function settimana(sedi: Sede[]): [string, Turno[]][] {
  const per = new Map<string, Turno[]>(GIORNI.map((g) => [g, []]))
  for (const sede of sedi) {
    for (const o of turni(sede)) {
      for (const g of o.giorni ?? []) {
        per.get(g)?.push({
          sede,
          comune: comune(sede),
          palestra: palestra(sede),
          ore: ore(o),
          inizio: o.oraInizio ?? '',
          corso: disciplina(o),
        })
      }
    }
  }
  return [...per.entries()]
    .map(([g, t]) => [g, t.sort((a, b) => a.inizio.localeCompare(b.inizio))] as [string, Turno[]])
    .filter(([, t]) => t.length > 0)
}
