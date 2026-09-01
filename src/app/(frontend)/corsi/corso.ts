/**
 * Vocabolario della pagina corso. Nessun layout: quello sta nel modulo CSS.
 *
 * L'unica logica vera e' `dove()`: da quale centro tecnico si pratica un corso,
 * e in quale turno. Il dato non sta su `corsi` ma sugli **orari** delle sedi
 * (#10), quindi va ricostruito qui, e distinguendo i centri attivi da quelli
 * sospesi per la stagione — che restano nel registro e vanno nominati, non
 * fatti sparire (#9).
 */
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { type Orario, corso as disciplina, turni } from '../centri/sede'

export type Dove = { sede: Sede; turni: Orario[] }

export const voci = (a: { voce: string }[] | null | undefined) => (a ?? []).map((x) => x.voce)

/** I turni di *quel* corso in *quel* centro, ordinati per giorno di calendario. */
export function dove(sedi: Sede[], corso: Corso): { attive: Dove[]; sospese: Dove[] } {
  const con = sedi
    .map((sede) => ({ sede, turni: turni(sede).filter((o) => disciplina(o)?.id === corso.id) }))
    .filter((d) => d.turni.length > 0)
  return {
    attive: con.filter((d) => d.sede.attivo),
    sospese: con.filter((d) => !d.sede.attivo),
  }
}
