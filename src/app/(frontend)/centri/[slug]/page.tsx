/**
 * Scheda di un centro tecnico — struttura B del prototipo di #8.
 *
 * Qui il peso sta sul documento: la settimana incolonnata, l'indirizzo che si
 * copia, cosa si pratica e chi insegna. E' quello che l'elenco non puo'
 * portare — la settimana intera, tutti i docenti, il link a Maps — non una
 * ripetizione della voce.
 *
 * Una sede sospesa resta raggiungibile per link diretto e lo dichiara: sparisce
 * dagli elenchi, non dal registro.
 */
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Sedi as Sede } from '@/payload-types'

import {
  GIORNI, GIORNO_LUNGO, Percorso, comune, corso, docenti, indirizzo, ore, palestra,
  percorsi, turni,
} from '../sede'
import stile from './scheda.module.css'

async function cerca(slug: string): Promise<Sede | null> {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'sedi',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const x = await cerca(slug)
  if (!x) return {}
  return {
    title: `${comune(x)}, ${palestra(x)} — AKM Italia`,
    description: `Krav Maga a ${comune(x)}: ${indirizzo(x)}. Giorni, orari e istruttori del centro.`,
  }
}

export default async function Scheda(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const x = await cerca(slug)
  if (!x) notFound()

  // Una riga per turno e per giorno: «Lun Mer 20:30» sono due righe di calendario.
  const righe = GIORNI.flatMap((g) =>
    turni(x)
      .filter((o) => (o.giorni ?? []).includes(g))
      .sort((a, b) => a.oraInizio.localeCompare(b.oraInizio))
      .map((o) => ({ g, o })),
  )
  const insegnano = [...new Set(turni(x).map(docenti).filter(Boolean).flatMap((s) => s.split(' · ')))]

  return (
    <div className={stile.pagina}>
      <Link className={stile.indietro} href="/centri">
        ← Tutti i centri
      </Link>

      <p className={stile.dove}>
        Centro tecnico · {comune(x)} ({x.indirizzo?.provincia})
      </p>
      <h1 className={stile.titolo}>
        {comune(x)}, {palestra(x)}
      </h1>
      {x.attivo ? null : <p className={stile.sospeso}>Sospeso per la stagione</p>}
      {x.descrizione ? <p className={stile.descrizione}>{x.descrizione}</p> : null}

      <h2 className={stile.gruppo}>La settimana</h2>
      {righe.length ? (
        <div className={stile.tabella}>
          <table className={stile.settimana}>
            <thead>
              <tr>
                <th scope="col">Giorno</th>
                <th scope="col">Ora</th>
                <th scope="col">Corso e docente</th>
              </tr>
            </thead>
            <tbody>
              {righe.map(({ g, o }, i) => (
                <tr key={`${g}-${o.id ?? i}`}>
                  {/* Il giorno si scrive una volta per blocco: la colonna resta
                      leggibile e il turno successivo si legge come suo. */}
                  <td className={stile.giorno}>{righe[i - 1]?.g === g ? '' : GIORNO_LUNGO[g]}</td>
                  <td>{ore(o)}</td>
                  <td>
                    {corso(o)?.nome}
                    {o.note ? ` (${o.note})` : ''}
                    {docenti(o) ? <div className={stile.docente}>{docenti(o)}</div> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* #10: mai una sezione che sparisce, sempre una riga onesta. */
        <p className={stile.senzaOrari}>
          Gli orari di questo centro non sono ancora pubblicati. Scrivici e ti diciamo quando si
          allena.
        </p>
      )}

      <h2 className={stile.gruppo}>Dove e cosa</h2>
      <dl>
        <div className={stile.fatto}>
          <dt className={stile.chiave}>Indirizzo</dt>
          <dd className={stile.valore}>
            {indirizzo(x)} ({x.indirizzo?.provincia})
            {x.mapsUrl ? (
              <>
                {' · '}
                <a href={x.mapsUrl} rel="noopener noreferrer" target="_blank">
                  Apri in Google Maps
                </a>
              </>
            ) : null}
          </dd>
        </div>

        {percorsi(x).length ? (
          <div className={stile.fatto}>
            <dt className={stile.chiave}>Cosa si pratica</dt>
            <dd className={stile.valore}>
              {percorsi(x).map((c) => (
                <span className={stile.disciplina} key={c.id}>
                  {c.nome} <Percorso corso={c} />
                </span>
              ))}
            </dd>
          </div>
        ) : null}

        {insegnano.length ? (
          <div className={stile.fatto}>
            <dt className={stile.chiave}>Chi insegna</dt>
            <dd className={stile.valore}>{insegnano.join(' · ')}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}
