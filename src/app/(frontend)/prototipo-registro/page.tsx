/**
 * PROTOTIPO USA E GETTA — issue #35, «Tre direzioni per la home».
 *
 * Tre home complete e divergenti su una rotta sola, commutabili con `?variant=`,
 * sui dati veri di Payload: 15 centri attivi, 13 comuni, 22 turni, 3 corsi in
 * bivio di cui uno che nessun centro tiene.
 *
 * Qui **niente e' fisso**: ogni direzione porta la sua famiglia, la sua palette,
 * la sua scala, la sua idea di movimento e il suo peso visivo. Tre varianti
 * dello stesso registro sarebbero una variante sola.
 *
 *   pnpm dev  →  http://localhost:3000/prototipo-registro
 *   ?variant=a|b|c   (frecce ← → anche da tastiera)
 *
 * Restano fermi i punti fissi della mappa #34: tricolore, stemma e lockup in
 * testata, le quattro anti-reference di PRODUCT.md, WCAG 2.2 AA, niente foto
 * stock, niente terze parti. La testata e il piede sono quelli veri, ed e' il
 * motivo per cui le direzioni si giudicano qui dentro e non su una pagina vuota.
 */
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { dati as componi } from './dati'
import { Switcher } from './Switcher'
import { Orario, nome as nomeB } from './orario'
import { PrimaVolta, nome as nomeC } from './primavolta'
import { Sigillo, nome as nomeA } from './sigillo'
import './prototipo.css'

const VARIANTI: [string, string][] = [
  ['a', nomeA],
  ['b', nomeB],
  ['c', nomeC],
]

export const metadata = { title: 'Prototipo — tre direzioni per la home (#35)' }

export default async function PrototipoRegistro(props: {
  searchParams: Promise<{ variant?: string }>
}) {
  const { variant } = await props.searchParams
  const chiave = VARIANTI.some(([k]) => k === variant) ? variant! : 'a'

  const payload = await getPayload({ config: await config })
  const [corsi, sedi, istruttori] = await Promise.all([
    payload.find({ collection: 'corsi', where: { inBivio: { equals: true } }, limit: 20, depth: 0 }),
    payload.find({
      collection: 'sedi',
      where: { attivo: { equals: true } },
      limit: 200,
      depth: 2,
      sort: 'indirizzo.citta',
    }),
    payload.count({ collection: 'istruttori' }),
  ])

  const d = componi(corsi.docs as Corso[], sedi.docs as Sede[], istruttori.totalDocs)

  return (
    <div className="prototipo">
      <p className="prototipo-testata">
        <strong>Prototipo #35 — tre direzioni per la home.</strong> Ognuna porta una famiglia, una
        palette, una scala, un movimento e un peso visivo diversi. Commuta con ← → o con{' '}
        <code>?variant=a|b|c</code>. Dati veri: {d.sedi.length} centri, {d.comuni.length} comuni,{' '}
        {d.turni.length} turni.
      </p>

      {chiave === 'a' && <Sigillo dati={d} />}
      {chiave === 'b' && <Orario dati={d} />}
      {chiave === 'c' && <PrimaVolta dati={d} />}

      <Switcher corrente={chiave} varianti={VARIANTI} />
    </div>
  )
}
