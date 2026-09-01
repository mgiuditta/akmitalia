/**
 * Elenco dei centri tecnici — struttura A del prototipo di #8.
 *
 * L'elenco *e* il documento: ogni voce porta i suoi orari, e non c'e' niente
 * dietro un click. E' il Principio 3 di PRODUCT.md preso alla lettera: «un
 * elenco di citta senza dati e una barriera travestita da funzionalita».
 *
 * Alfabetico per comune, mai raggruppato per provincia (#9): 14 centri su 18
 * stanno in MI, e i gruppi non reggono su una distribuzione cosi.
 */
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

import {
  Percorso, comune, docenti, giorni, ore, palestra, percorsi, province, turni, viaCorta,
  corso,
} from './sede'
import stile from './elenco.module.css'

export const metadata: Metadata = {
  title: 'Centri tecnici — AKM Italia',
  description: 'Dove si allena il Krav Maga AKM Italia: indirizzi, giorni, orari e istruttori di ogni centro.',
}

export default async function Centri(props: { searchParams: Promise<{ prov?: string }> }) {
  const { prov } = await props.searchParams

  const payload = await getPayload({ config: await config })
  // `attivo` spento fa sparire il centro dagli elenchi, per la sua stessa
  // definizione in `Sedi.ts`; le bozze le esclude gia' l'access control.
  const { docs } = await payload.find({
    collection: 'sedi',
    where: { attivo: { equals: true } },
    limit: 200,
    depth: 2,
    sort: 'indirizzo.citta',
  })

  const tutti = docs
  const sedi = prov ? tutti.filter((x) => x.indirizzo?.provincia === prov) : tutti
  const slot = sedi.reduce((n, x) => n + turni(x).length, 0)

  return (
    <div className={stile.pagina}>
      <h1 className={stile.titolo}>Centri tecnici</h1>
      <p className={stile.intro}>
        Dove si allena, quando, e con chi. Ogni voce porta i suoi orari: non c&apos;è niente da
        aprire per sapere se un centro fa al caso tuo.
      </p>

      <ul className={stile.filtri}>
        <li>
          <Link className={stile.filtro} href="/centri" aria-current={!prov || undefined}>
            Tutte · {tutti.length}
          </Link>
        </li>
        {province(tutti).map(([p, n]) => (
          <li key={p}>
            <Link
              className={stile.filtro}
              href={`/centri?prov=${p}`}
              aria-current={prov === p || undefined}
            >
              {p} · {n}
            </Link>
          </li>
        ))}
      </ul>

      <p className={stile.conteggio}>
        {sedi.length} {sedi.length === 1 ? 'centro' : 'centri'} · {slot}{' '}
        {slot === 1 ? 'turno settimanale' : 'turni settimanali'}
      </p>

      {sedi.length === 0 ? (
        <p className={stile.vuoto}>
          Nessun centro in questa provincia. <Link href="/centri">Vedi tutti i centri</Link>.
        </p>
      ) : (
        <div className={stile.elenco}>
          {sedi.map((x) => (
            <Link className={stile.voce} key={x.id} href={`/centri/${x.slug}`}>
              <div className={stile.testa}>
                <span className={stile.dove}>
                  {comune(x)} · {x.indirizzo?.provincia}
                </span>
                {percorsi(x).map((c) => (
                  <Percorso corso={c} key={c.id} />
                ))}
              </div>
              <div className={stile.palestra}>{palestra(x)}</div>
              <div className={stile.via}>{viaCorta(x)}</div>

              {turni(x).length ? (
                <div className={stile.turni}>
                  {turni(x).map((o, i) => (
                    <div className={stile.turno} key={o.id ?? i}>
                      <span className={stile.quando}>
                        {giorni(o)} {ore(o)}
                      </span>
                      <span className={stile.cosa}>
                        {corso(o)?.nome}
                        {o.note ? ` (${o.note})` : ''}
                      </span>
                      {docenti(o) ? <span className={stile.chi}>{docenti(o)}</span> : null}
                    </div>
                  ))}
                </div>
              ) : (
                /* #10: mai una sezione che sparisce, sempre una riga onesta. */
                <p className={stile.senzaOrari}>
                  Orari non ancora pubblicati — scrivici e ti diciamo quando si allena.
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
