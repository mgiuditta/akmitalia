import type { Metadata } from 'next'
import React from 'react'

import { openPayload } from '@/components/payload'
import { CenterList } from '@/components/CenterList'
import { published } from '@/components/data'
import { Figure } from '@/components/Figure'
import { pageMetadata } from '@/components/seo'

/**
 * L'elenco dei centri e' alfabetico per comune e senza sezioni, come stabilisce
 * docs/adr/0001: 27 centri su 40 stanno in provincia di Milano, raggruppare per
 * provincia produrrebbe un blocco enorme e cinque righe sparse. La provincia e'
 * un filtro e un'etichetta di riga.
 *
 * ponytail: il filtro resta un link con ?provincia=MI e la URL resta la
 * verita', ma il click non torna al server: <ElencoCentri> riceve tutti i
 * centri e filtra in memoria, scrivendo la URL con pushState. Cronologia e
 * condivisione funzionano come prima, senza il flash del ricaricamento.
 */

export const revalidate = 60

/* La descrizione porta il numero vero: «15 centri in 4 province» dice al
   visitatore, gia' dal risultato di ricerca, che l'elenco esiste davvero. */
export async function generateMetadata(): Promise<Metadata> {
  const payload = await openPayload()
  const centers = await payload.find({
    collection: 'sedi',
    depth: 0,
    limit: 300,
    select: { indirizzo: true },
    where: { and: [{ attivo: { equals: true } }, published] },
  })
  const provinces = new Set(
    centers.docs.map((s) => s.indirizzo?.provincia).filter((p): p is string => Boolean(p)),
  )
  const total = centers.totalDocs

  return pageMetadata({
    titolo: 'Centri tecnici',
    descrizione: total
      ? `${total} centri tecnici AKM Italia in ${provinces.size} province: indirizzo, giorni, orari e docenti di ogni centro attivo.`
      : 'Dove si pratica Krav Maga con AKM Italia: indirizzo, giorni, orari e docenti di ogni centro tecnico attivo.',
    path: '/centri',
  })
}

export default async function CentersPage({
  searchParams,
}: {
  searchParams: Promise<{ provincia?: string }>
}) {
  /* Letto anche se il filtro lo applica il client: leggere searchParams rende
     la rotta dinamica, cosi' useSearchParams ha valori gia' in SSR e l'HTML di
     ?provincia=MI arriva filtrato al motore di ricerca e al primo paint. */
  await searchParams
  const payload = await openPayload()

  const [found, settings] = await Promise.all([
    payload.find({
      collection: 'sedi',
      depth: 2,
      limit: 200,
      sort: 'indirizzo.citta',
      where: { and: [{ attivo: { equals: true } }, published] },
    }),
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
  ])

  const centers = found.docs
  const provinces = [
    ...new Set(centers.map((c) => c.indirizzo?.provincia).filter((p): p is string => Boolean(p))),
  ].sort()

  return (
    <>
      <section className="section section--black masthead">
        <div className="container masthead__content">
          <h1 className="display display--lg">
            {centers.length > 0 ? `${centers.length} centri, orari veri` : 'I centri tecnici'}
          </h1>
          <p className="text masthead__text">
            Indirizzo, giorni, orario e docente di ogni centro attivo. In ordine alfabetico per
            comune, senza raggruppamenti: la provincia è scritta accanto alla città.
          </p>
        </div>
      </section>

      {/* Una banda a tutta larghezza fra la testata e l'elenco: stacca il nero
          dal chiaro e mostra dove si pratica prima di elencarlo. */}
      {/* `priority`: su queste pagine la banda e' l'LCP, la testata sopra e'
          tipografica e non ha niente da caricare. */}
      <Figure
        slot={settings?.fotoPagine?.centri}
        label="Foto della pagina Centri"
        format="band"
        measure="grande"
        sizes="100vw"
        priority
      />

      <section className="section section--light" aria-labelledby="list-title">
        <div className="container">
          <CenterList centers={centers} provinces={provinces} />
        </div>
      </section>
    </>
  )
}
