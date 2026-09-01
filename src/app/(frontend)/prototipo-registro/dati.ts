/**
 * PROTOTIPO USA E GETTA — issue #35, «Tre direzioni per la home».
 *
 * Solo forma dei dati: le tre direzioni devono poter buttare via la struttura
 * l'una dell'altra, ma discutono tutte sugli stessi dati veri di Payload — 15
 * centri attivi, 13 comuni, 22 turni, 3 corsi in bivio, uno dei quali non e'
 * tenuto da nessuno. Mai lorem: se una direzione regge solo su dati inventati,
 * non regge.
 */
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { GIORNI, comune, corso as disciplina, ore, palestra, turni } from '../centri/sede'

export type Turno = {
  sede: Sede
  comune: string
  palestra: string
  giorno: string
  ore: string
  inizio: string
  /** Minuti dalla mezzanotte: serve a incolonnare, non a stampare. */
  minuti: number
  durata: number
  corso: Corso | null
  nota: string
}

export type Voce = {
  corso: Corso
  attive: Sede[]
  comuni: string[]
  turni: Turno[]
}

export type Dati = {
  voci: Voce[]
  sedi: Sede[]
  comuni: string[]
  province: string[]
  turni: Turno[]
  /** Giorno → turni, in ordine d'orario. Solo i giorni che hanno qualcosa. */
  settimana: [string, Turno[]][]
  istruttori: number
}

const minuti = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

/** Un turno per giorno: «gio 20:30» e «mar 20:30» sono due righe, non una. */
export function tutti(sedi: Sede[]): Turno[] {
  const out: Turno[] = []
  for (const sede of sedi) {
    for (const o of turni(sede)) {
      for (const g of o.giorni ?? []) {
        const inizio = o.oraInizio ?? '00:00'
        out.push({
          sede,
          comune: comune(sede),
          palestra: palestra(sede),
          giorno: g,
          ore: ore(o),
          inizio,
          minuti: minuti(inizio),
          durata: minuti(o.oraFine ?? inizio) - minuti(inizio),
          corso: disciplina(o),
          nota: o.note ?? '',
        })
      }
    }
  }
  return out
}

export function dati(corsi: Corso[], sedi: Sede[], istruttori: number): Dati {
  const turniTutti = tutti(sedi)
  const per = new Map<string, Turno[]>(GIORNI.map((g) => [g, []]))
  for (const t of turniTutti) per.get(t.giorno)?.push(t)

  return {
    // ADR 0003, #24: un percorso senza centri attivi non e' un errore, e' il
    // caso vero dell'antiaggressione femminile. Ogni direzione lo deve dire.
    voci: corsi.map((corso) => {
      const suoi = turniTutti.filter((t) => t.corso?.id === corso.id)
      const attive = sedi.filter((s) => turni(s).some((o) => disciplina(o)?.id === corso.id))
      return {
        corso,
        attive,
        comuni: [...new Set(attive.map(comune))].sort((a, b) => a.localeCompare(b, 'it')),
        turni: suoi,
      }
    }),
    sedi,
    comuni: [...new Set(sedi.map(comune))].sort((a, b) => a.localeCompare(b, 'it')),
    province: [...new Set(sedi.map((s) => s.indirizzo?.provincia).filter(Boolean) as string[])].sort(),
    turni: turniTutti,
    settimana: [...per.entries()]
      .map(([g, t]) => [g, t.sort((a, b) => a.minuti - b.minuti)] as [string, Turno[]])
      .filter(([, t]) => t.length > 0),
    istruttori,
  }
}
