/**
 * Vocabolario e formattatori dei centri tecnici, piu' l'etichetta di percorso.
 * Nessun layout: quello sta nei moduli CSS delle due pagine, che sono
 * deliberatamente diversi (l'elenco porta i dati, la scheda li incolonna).
 */
import React from 'react'
import type { Sedi as Sede, Corsi as Corso, Istruttori as Istruttore } from '@/payload-types'

import stile from './Percorso.module.css'

export type Orario = NonNullable<Sede['orari']>[number]

export const GIORNI = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'] as const

export const GIORNO: Record<string, string> = {
  lun: 'Lun', mar: 'Mar', mer: 'Mer', gio: 'Gio', ven: 'Ven', sab: 'Sab', dom: 'Dom',
}

export const GIORNO_LUNGO: Record<string, string> = {
  lun: 'Lunedì', mar: 'Martedì', mer: 'Mercoledì', gio: 'Giovedì',
  ven: 'Venerdì', sab: 'Sabato', dom: 'Domenica',
}

const QUALIFICA: Record<string, string> = {
  istruttore: 'Istruttore', trainer: 'Trainer', maestro: 'M°',
  'direttore-tecnico': 'Direttore tecnico', presidente: 'Presidente',
}

export const TARGET: Record<string, string> = {
  adulti: 'Adulti', ragazzi: 'Ragazzi', bambini: 'Bambini',
  donne: 'Donne', istruttori: 'Istruttori', 'aziende-ffoo': 'Aziende e FFOO',
}

/** Le relazioni arrivano popolate a `depth: 2`; a depth 0 sarebbero id. */
const popolato = <T,>(v: T | number | null | undefined): T | null =>
  v && typeof v === 'object' ? (v as T) : null

export const comune = (x: Sede) => x.indirizzo?.citta ?? ''

/**
 * Il nome importato da WordPress e' «Abbiategrasso - Dynamic Dance School»: il
 * comune sta gia' nel suo campo, e ripeterlo nella voce e' rumore. `palestra`
 * quando c'e', altrimenti il nome ripulito del prefisso.
 */
export const palestra = (x: Sede) =>
  x.palestra || x.nome.replace(new RegExp(`^\\s*${comune(x)}\\s*[-–]\\s*`, 'i'), '') || x.nome

/** Nell'elenco il comune e' gia' nell'etichetta della voce. */
export const viaCorta = (x: Sede) =>
  [x.indirizzo?.via, x.indirizzo?.cap].filter(Boolean).join(', ')

/** Nella scheda serve intero, perche' e' un indirizzo che si copia. */
export const indirizzo = (x: Sede) =>
  [x.indirizzo?.via, [x.indirizzo?.cap, comune(x)].filter(Boolean).join(' ')]
    .filter(Boolean).join(', ')

export const turni = (x: Sede): Orario[] => x.orari ?? []

export const giorni = (o: Orario) => (o.giorni ?? []).map((g) => GIORNO[g] ?? g).join(' ')

export const ore = (o: Orario) => `${o.oraInizio}–${o.oraFine}`

export const corso = (o: Orario) => popolato<Corso>(o.disciplina)

/** Un turno puo' averne piu' d'uno: 7 slot su 26 ne hanno due o tre (#11). */
export const docenti = (o: Orario) =>
  (o.docenti ?? [])
    .map((d) => popolato<Istruttore>(d))
    .filter((d): d is Istruttore => Boolean(d))
    .map((d) => `${QUALIFICA[d.qualifica ?? ''] ?? ''} ${d.nome}`.trim())
    .join(' · ')

/** I percorsi distinti di un centro: Binasco tiene Antibullismo e Adulti insieme. */
export const percorsi = (x: Sede): Corso[] => {
  const m = new Map<number, Corso>()
  for (const o of turni(x)) {
    const c = corso(o)
    if (c) m.set(c.id, c)
  }
  return [...m.values()]
}

/** Le province presenti, con quante sedi ciascuna. #9: la provincia e' etichetta
 *  e filtro, mai intestazione di gruppo — l'elenco resta alfabetico per comune. */
export const province = (sedi: Sede[]): [string, number][] => {
  const m = new Map<string, number>()
  for (const x of sedi) {
    const p = x.indirizzo?.provincia
    if (p) m.set(p, (m.get(p) ?? 0) + 1)
  }
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], 'it'))
}

/**
 * Regola dell'Etichetta: nessun percorso e' identificabile dal solo colore, il
 * target e' sempre scritto. Regola dell'Etichetta Corta: nell'elenco si scrive
 * il target, non il nome del corso, che e' lungo il doppio della riga.
 * Il percorso Carta non ha colore proprio (#5): si distingue per bordo.
 */
export function Percorso({ corso: c }: { corso: Corso }) {
  return (
    <span className={stile.percorso} data-colore={c.colore ?? 'inchiostro'}>
      {TARGET[c.target] ?? c.target}
    </span>
  )
}
