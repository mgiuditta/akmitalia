/**
 * PROTOTIPO USA E GETTA — issue #17, «La home: il bivio e la prova».
 *
 * Tre home su una rotta, commutabili con `?variant=`, sui dati veri di Payload.
 * Il kit (colore, font, scala) e' fisso e non e' in prova: la variabile e'
 * **cosa viene prima** — il bivio, la settimana o il posto — e **quale prova**
 * la home porta.
 *
 *   pnpm dev  →  http://localhost:3000/prototipo-home
 *   ?variant=a|b|c
 */
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { comune, turni } from '../centri/sede'
import { bivio, settimana } from './dati'
import { Switcher } from './Switcher'
import {
  VarianteA,
  VarianteA1,
  VarianteA2,
  VarianteA3,
  VarianteB,
  VarianteC,
  nomeA,
  nomeA1,
  nomeA2,
  nomeA3,
  nomeB,
  nomeC,
} from './varianti'
import './prototipo.css'

/* La struttura A ha vinto: la variabile in prova adesso e' **l'hero** sopra il
   bivio. `a` resta come metro di paragone, `b` e `c` come memoria del primo
   giro. Il primo della lista e' il default. */
const VARIANTI: [string, string][] = [
  ['a1', nomeA1],
  ['a2', nomeA2],
  ['a3', nomeA3],
  ['a', nomeA],
  ['b', nomeB],
  ['c', nomeC],
]

export default async function PrototipoHome(props: {
  searchParams: Promise<{ variant?: string }>
}) {
  const { variant } = await props.searchParams
  const chiave = VARIANTI.some(([k]) => k === variant) ? variant! : 'a1'

  const payload = await getPayload({ config: await config })
  const [corsi, sedi, istruttori] = await Promise.all([
    payload.find({
      collection: 'corsi',
      where: { inBivio: { equals: true } },
      limit: 20,
      depth: 0,
    }),
    payload.find({
      collection: 'sedi',
      where: { attivo: { equals: true } },
      limit: 200,
      depth: 2,
      sort: 'indirizzo.citta',
    }),
    payload.count({ collection: 'istruttori' }),
  ])

  const attive = sedi.docs as Sede[]
  const dati = {
    voci: bivio(corsi.docs as Corso[], attive),
    settimana: settimana(attive),
    sedi: attive,
    comuni: [...new Set(attive.map(comune))].sort((a, b) => a.localeCompare(b, 'it')),
    slot: attive.reduce((n, s) => n + turni(s).length, 0),
    istruttori: istruttori.totalDocs,
  }

  return (
    <div className="prototipo">
      <p className="prototipo-testata">
        <strong>Prototipo usa e getta · issue #17</strong> — {attive.length} centri attivi e{' '}
        {dati.voci.length} corsi in bivio, veri, da Payload. Le frecce in basso, o i tasti ← →,
        cambiano variante. La struttura A ha vinto: adesso in prova c&apos;è{' '}
        <strong>l&apos;hero</strong> sopra il bivio (A1, A2, A3), con la A senza hero come metro di
        paragone. B e C restano per memoria. Testata e footer sono quelli veri.
      </p>

      {chiave === 'a1' && <VarianteA1 {...dati} />}
      {chiave === 'a2' && <VarianteA2 {...dati} />}
      {chiave === 'a3' && <VarianteA3 {...dati} />}
      {chiave === 'a' && <VarianteA {...dati} />}
      {chiave === 'b' && <VarianteB {...dati} />}
      {chiave === 'c' && <VarianteC {...dati} />}

      <Switcher varianti={VARIANTI} corrente={chiave} />
    </div>
  )
}
