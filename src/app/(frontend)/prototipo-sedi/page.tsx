/**
 * PROTOTIPO USA E GETTA — issue #8, «Elenco sedi e scheda sede: la prova del kit».
 *
 * Tre strutture su una rotta, commutabili con `?variant=`, sui centri veri di
 * Payload. Colore (#5), font (#6) e scala (#7) sono fissi: la variabile in prova
 * e' **dove sta il peso** fra l'elenco e la scheda, e qual e' l'asse dell'elenco.
 *
 *   pnpm dev  →  http://localhost:3000/prototipo-sedi
 *   ?variant=a|b|c   ?prov=MI   ?sede=<slug>
 */
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'

import { Switcher } from './Switcher'
import { VarianteA, VarianteB, VarianteC, nomeA, nomeB, nomeC, type Sede } from './varianti'
import './prototipo.css'

const VARIANTI: [string, string][] = [['a', nomeA], ['b', nomeB], ['c', nomeC]]

export default async function PrototipoSedi(props: {
  searchParams: Promise<{ variant?: string; prov?: string; sede?: string }>
}) {
  const { variant, prov, sede } = await props.searchParams
  const chiave = VARIANTI.some(([k]) => k === variant) ? variant! : 'a'

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'sedi',
    limit: 100,
    depth: 2,
    sort: 'indirizzo.citta',
  })
  const tutte = docs as Sede[]
  const sedi = prov ? tutte.filter((x) => x.indirizzo?.provincia === prov) : tutte
  // La scheda di default e' la sede piu' fitta: e' li' che la struttura si rompe.
  const scheda =
    tutte.find((x) => x.slug === sede) ??
    [...tutte].sort((a, b) => (b.orari?.length ?? 0) - (a.orari?.length ?? 0))[0]

  const props2 = { sedi, scheda, prov }

  return (
    <div className="prototipo">
      <p className="prototipo-testata">
        <strong>Prototipo usa e getta · issue #8</strong> — {tutte.length} centri veri da Payload.
        Le frecce in basso, o i tasti ← →, cambiano struttura. Colore, font e scala non cambiano
        mai: cambia dove sta il peso fra elenco e scheda. La scheda in fondo e'{' '}
        <strong>{scheda?.nome}</strong>; ogni voce dell&apos;elenco la commuta.
      </p>

      {chiave === 'a' && <VarianteA {...props2} />}
      {chiave === 'b' && <VarianteB {...props2} />}
      {chiave === 'c' && <VarianteC {...props2} />}

      <Switcher varianti={VARIANTI} corrente={chiave} />
    </div>
  )
}
