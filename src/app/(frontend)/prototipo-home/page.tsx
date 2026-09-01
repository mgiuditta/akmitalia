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
import { VarianteA, VarianteB, VarianteC, nomeA, nomeB, nomeC } from './varianti'
import './prototipo.css'

const VARIANTI: [string, string][] = [
  ['a', nomeA],
  ['b', nomeB],
  ['c', nomeC],
]

export default async function PrototipoHome(props: {
  searchParams: Promise<{ variant?: string }>
}) {
  const { variant } = await props.searchParams
  const chiave = VARIANTI.some(([k]) => k === variant) ? variant! : 'a'

  const payload = await getPayload({ config: await config })
  const [corsi, sedi] = await Promise.all([
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
  ])

  const attive = sedi.docs as Sede[]
  const dati = {
    voci: bivio(corsi.docs as Corso[], attive),
    settimana: settimana(attive),
    sedi: attive,
    comuni: [...new Set(attive.map(comune))].sort((a, b) => a.localeCompare(b, 'it')),
    slot: attive.reduce((n, s) => n + turni(s).length, 0),
  }

  return (
    <div className="prototipo">
      <p className="prototipo-testata">
        <strong>Prototipo usa e getta · issue #17</strong> — {attive.length} centri attivi e{' '}
        {dati.voci.length} corsi in bivio, veri, da Payload. Le frecce in basso, o i tasti ← →,
        cambiano home. Il kit non cambia mai: cambia <strong>cosa viene prima</strong> e{' '}
        <strong>quale prova</strong>. Testata e footer sono quelli veri.
      </p>

      {chiave === 'a' && <VarianteA {...dati} />}
      {chiave === 'b' && <VarianteB {...dati} />}
      {chiave === 'c' && <VarianteC {...dati} />}

      <Switcher varianti={VARIANTI} corrente={chiave} />
    </div>
  )
}
