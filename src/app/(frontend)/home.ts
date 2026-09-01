/**
 * L'unica logica della home: da quali centri e' davvero tenuto ogni percorso.
 * Il legame corso-sede vive sugli **orari** (#10), non su `corsi`, quindi la
 * prova che compare accanto a una voce del bivio va ricostruita di li'.
 *
 * Un percorso senza centri attivi non e' un errore: e' il caso vero
 * dell'antiaggressione femminile, e il bivio dichiara che il corso esiste, non
 * che parte lunedi' (#24, ADR 0003).
 */
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { comune, corso as disciplina, turni } from './centri/sede'

export type Voce = { corso: Corso; centri: number; comuni: string[] }

export const bivio = (corsi: Corso[], sedi: Sede[]): Voce[] =>
  corsi.map((corso) => {
    const attive = sedi.filter((s) => turni(s).some((o) => disciplina(o)?.id === corso.id))
    return {
      corso,
      centri: attive.length,
      // I comuni, non le sedi: tre centri stanno a Milano, e ripeterlo tre
      // volte in una riga di prova la farebbe leggere come un errore.
      comuni: [...new Set(attive.map(comune))].sort((a, b) => a.localeCompare(b, 'it')),
    }
  })
