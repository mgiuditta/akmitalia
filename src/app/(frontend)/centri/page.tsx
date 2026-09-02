import type { Metadata } from 'next'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { Mappa, type PuntoMappa } from '@/componenti/Mappa'
import { SchedaCentro } from '@/componenti/SchedaCentro'
import { pubblicato } from '@/componenti/dati'

/**
 * L'elenco dei centri e' alfabetico per comune e senza sezioni, come stabilisce
 * docs/adr/0001: 27 centri su 40 stanno in provincia di Milano, raggruppare per
 * provincia produrrebbe un blocco enorme e cinque righe sparse. La provincia e'
 * un filtro e un'etichetta di riga.
 *
 * ponytail: il filtro e' un link con ?provincia=MI, non uno stato React. Il
 * server rifa la query, la pagina resta un server component e il filtro
 * funziona con la cronologia del browser e si puo' condividere.
 */

export const revalidate = 60

/* La descrizione porta il numero vero: «15 centri in 4 province» dice al
   visitatore, gia' dal risultato di ricerca, che l'elenco esiste davvero. */
export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: await config })
  const sedi = await payload.find({
    collection: 'sedi',
    depth: 0,
    limit: 300,
    select: { indirizzo: true },
    where: { and: [{ attivo: { equals: true } }, pubblicato] },
  })
  const province = new Set(
    sedi.docs.map((s) => s.indirizzo?.provincia).filter((p): p is string => Boolean(p)),
  )
  const quanti = sedi.totalDocs

  return {
    title: 'Centri tecnici',
    description: quanti
      ? `${quanti} centri tecnici AKM Italia in ${province.size} province: indirizzo, giorni, orari e docenti di ogni centro attivo.`
      : 'Dove si pratica Krav Maga con AKM Italia: indirizzo, giorni, orari e docenti di ogni centro tecnico attivo.',
    alternates: { canonical: '/centri' },
  }
}

export default async function PaginaCentri({
  searchParams,
}: {
  searchParams: Promise<{ provincia?: string }>
}) {
  const { provincia } = await searchParams
  const payload = await getPayload({ config: await config })

  const sedi = await payload.find({
    collection: 'sedi',
    depth: 2,
    limit: 200,
    sort: 'indirizzo.citta',
    where: { and: [{ attivo: { equals: true } }, pubblicato] },
  })

  const centri = sedi.docs
  const province = [
    ...new Set(centri.map((c) => c.indirizzo?.provincia).filter((p): p is string => Boolean(p))),
  ].sort()

  const scelta = provincia && province.includes(provincia) ? provincia : null
  const visibili = scelta ? centri.filter((c) => c.indirizzo?.provincia === scelta) : centri

  const punti: PuntoMappa[] = visibili
    .filter((c) => typeof c.coordinate?.lat === 'number' && typeof c.coordinate?.lng === 'number')
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      citta: c.indirizzo?.citta ?? '',
      slug: c.slug,
      lat: c.coordinate!.lat as number,
      lng: c.coordinate!.lng as number,
    }))

  return (
    <>
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <span className="filetto" aria-hidden="true" />
          <h1 className="display display--lg">
            {centri.length > 0 ? `${centri.length} centri, orari veri` : 'I centri tecnici'}
          </h1>
          <p className="testo testata__testo">
            Indirizzo, giorni, orario e docente di ogni centro attivo. In ordine alfabetico per
            comune, senza raggruppamenti: la provincia è scritta accanto alla città.
          </p>
        </div>
      </section>

      <section className="sezione sezione--chiara" aria-labelledby="titolo-elenco">
        <div className="contenitore">
          <h2 className="display display--sm titolo-elenco" id="titolo-elenco">
            {scelta ? `Centri in provincia di ${scelta}` : 'Tutti i centri'}
          </h2>

          {province.length > 1 ? (
            <nav className="filtri" aria-label="Filtra per provincia">
              <a className={`filtro${scelta ? '' : ' filtro--attivo'}`} href="/centri">
                Tutte ({centri.length})
              </a>
              {province.map((p) => (
                <a
                  key={p}
                  className={`filtro${scelta === p ? ' filtro--attivo' : ''}`}
                  href={`/centri?provincia=${p}`}
                >
                  {p} ({centri.filter((c) => c.indirizzo?.provincia === p).length})
                </a>
              ))}
            </nav>
          ) : null}

          {visibili.length > 0 ? (
            <div className="centri">
              {punti.length > 0 ? (
                <div className="centri__mappa">
                  <Mappa punti={punti} etichetta="Mappa dei centri tecnici AKM Italia" />
                  {punti.length < visibili.length ? (
                    <p className="dato mappa__nota">
                      {visibili.length - punti.length} centri non hanno ancora le coordinate: li
                      trovi qui sotto con indirizzo e orari.
                    </p>
                  ) : null}
                </div>
              ) : null}

              <ul className="centri__elenco">
                {visibili.map((centro) => (
                  <SchedaCentro key={centro.id} centro={centro} />
                ))}
              </ul>
            </div>
          ) : (
            <p className="testo vuoto">
              L’elenco dei centri attivi è in aggiornamento per la stagione. Scrivici e ti diciamo
              qual è il più vicino.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
