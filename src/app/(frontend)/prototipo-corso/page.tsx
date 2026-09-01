/**
 * PROTOTIPO USA E GETTA — issue #18, «Pagina corso: dai campi strutturati alla pagina».
 *
 * Tre strutture su una rotta, commutabili con `?variant=`, sui tre corsi veri di
 * Payload (#16) e sui 15 centri attivi. La rotta vera sara' `/corsi/[slug]`:
 * qui e' una rotta di prototipo per non occupare l'URL pubblica prima della scelta.
 *
 *   pnpm dev  →  http://localhost:3000/prototipo-corso
 *   ?variant=a|b|c   ?corso=<slug>
 */
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { corso as disciplina, turni } from '../centri/sede'
import { Switcher } from './Switcher'
import { VarianteA, VarianteB, VarianteC, nomeA, nomeB, nomeC, type Dove } from './varianti'
import './prototipo.css'

const VARIANTI: [string, string][] = [['a', nomeA], ['b', nomeB], ['c', nomeC]]

export default async function PrototipoCorso(props: {
  searchParams: Promise<{ variant?: string; corso?: string }>
}) {
  const { variant, corso: slug } = await props.searchParams
  const chiave = VARIANTI.some(([k]) => k === variant) ? variant! : 'a'

  const payload = await getPayload({ config: await config })
  const [corsi, sedi] = await Promise.all([
    payload.find({ collection: 'corsi', limit: 50, depth: 0, sort: 'ordine' }),
    payload.find({ collection: 'sedi', limit: 200, depth: 2, sort: 'indirizzo.citta' }),
  ])

  const tutti = corsi.docs as Corso[]
  const c = tutti.find((x) => x.slug === slug) ?? tutti[0]

  const dove: Dove[] = (sedi.docs as Sede[])
    .map((sede) => ({ sede, turni: turni(sede).filter((o) => disciplina(o)?.id === c.id) }))
    .filter((d) => d.turni.length > 0)
  const attive = dove.filter((d) => d.sede.attivo)
  const sospese = dove.filter((d) => !d.sede.attivo)

  const dati = { corso: c, attive, sospese }

  return (
    <div className="prototipo">
      <p className="prototipo-testata">
        <strong>Prototipo usa e getta · issue #18</strong> — i tre corsi veri di Payload. Le frecce
        in basso, o i tasti ← →, cambiano struttura; colore, font e scala non cambiano mai. La
        variabile in prova e&apos; dove sta il peso fra la prosa del corso e i centri che lo
        tengono, e dove sta la chiamata al form.
        <span className="prototipo-corsi">
          {tutti.map((x) => (
            <a
              key={x.id}
              href={`?variant=${chiave}&corso=${x.slug}`}
              aria-current={x.id === c.id ? 'true' : undefined}
            >
              {x.nome}
            </a>
          ))}
        </span>
        Ora in pagina: <strong>{c.nome}</strong> — {attive.length} centri attivi,{' '}
        {sospese.length} sospesi, {(c.focus ?? []).length} focus, {(c.risultati ?? []).length}{' '}
        risultati, {(c.adattoA ?? []).length} profili.
      </p>

      {chiave === 'a' && <VarianteA {...dati} />}
      {chiave === 'b' && <VarianteB {...dati} />}
      {chiave === 'c' && <VarianteC {...dati} />}

      <Switcher varianti={VARIANTI} corrente={chiave} />
    </div>
  )
}
