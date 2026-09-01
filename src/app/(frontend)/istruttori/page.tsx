/**
 * L'albo degli istruttori. Struttura, non ancora contenuto: il dato in Payload
 * e' magro e lo dichiara invece di mascherarlo — undici istruttori su tredici
 * hanno il solo nome di battesimo e `credenziali` e' vuota per tutti (#17).
 *
 * Peso «documento»: si legge dall'alto in basso, non si consulta a salti.
 */
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Istruttori as Istruttore, Sedi as Sede } from '@/payload-types'

import { Apertura, Coda, Pagina, Sezione } from '../anatomia'
import stile from './albo.module.css'

export const metadata: Metadata = {
  title: 'Istruttori — AKM Italia',
  description: 'Chi insegna nei centri tecnici AKM Italia: qualifica, specializzazione e sedi.',
}

const QUALIFICA: Record<string, string> = {
  istruttore: 'Istruttore',
  trainer: 'Trainer',
  maestro: 'Maestro',
  'direttore-tecnico': 'Direttore tecnico',
  presidente: 'Presidente',
}

/**
 * `sedi` e' un campo **join**: il legame vive su `Sedi`, e qui torna paginato.
 * Si tiene solo cio' che `depth` ha davvero popolato, perche' un id nudo non
 * sa dire ne' il comune ne' lo slug.
 */
const sedi = (i: Istruttore): Sede[] =>
  ((i.sedi?.docs ?? []) as (number | Sede)[]).filter(
    (s): s is Sede => typeof s === 'object' && s !== null,
  )

export default async function Albo() {
  const payload = await getPayload({ config: await config })
  const { docs, totalDocs } = await payload.find({
    collection: 'istruttori',
    limit: 100,
    depth: 1,
    sort: 'ordine',
  })
  const albo = docs as Istruttore[]

  return (
    <Pagina peso="documento">
      <Apertura
        occhiello="Albo"
        titolo="Istruttori"
        sommario="Chi insegna nei centri tecnici AKM Italia. La qualifica viene dal percorso federale: quattro anni almeno, e un esame di abilitazione all'insegnamento."
        fatti={`${totalDocs} istruttori`}
      />

      <Sezione titolo="In cattedra">
        <ul className={stile.albo}>
          {albo.map((i) => {
            const dove = sedi(i)
            return (
              <li key={i.id} className={stile.voce}>
                <p className={stile.nome}>{i.nome}</p>
                {i.ruolo || i.qualifica ? (
                  <p className={stile.ruolo}>
                    {i.ruolo || QUALIFICA[i.qualifica ?? ''] || ''}
                    {i.livello ? ` · ${i.livello}` : ''}
                  </p>
                ) : null}
                {/* Principio 1: se una voce non nomina un luogo, sta vendendo
                    un'astrazione. Quando la sede manca, si dice. */}
                {dove.length ? (
                  <p className={stile.dove}>
                    {dove.map((s, n) => (
                      <React.Fragment key={s.id}>
                        {n > 0 ? ', ' : ''}
                        <Link href={`/centri/${s.slug}`}>{s.indirizzo?.citta ?? s.nome}</Link>
                      </React.Fragment>
                    ))}
                  </p>
                ) : (
                  <p className={stile.senza}>Nessun centro assegnato in questa stagione.</p>
                )}
              </li>
            )
          })}
        </ul>
      </Sezione>

      <Coda>
        I docenti sono tesserati e assicurati CSEN. Per sapere chi insegna in un centro preciso,{' '}
        <Link href="/centri">apri la sua scheda</Link>: gli orari portano il nome del docente di
        turno.
      </Coda>
    </Pagina>
  )
}
