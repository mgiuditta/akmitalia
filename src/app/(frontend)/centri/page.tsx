import type { Metadata } from 'next'
import React from 'react'

import { apriPayload } from '@/componenti/payload'
import { ElencoCentri } from '@/componenti/ElencoCentri'
import { pubblicato } from '@/componenti/dati'
import { Figura } from '@/componenti/Figura'
import { metadatiPagina } from '@/componenti/seo'

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
  const payload = await apriPayload()
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

  return metadatiPagina({
    titolo: 'Centri tecnici',
    descrizione: quanti
      ? `${quanti} centri tecnici AKM Italia in ${province.size} province: indirizzo, giorni, orari e docenti di ogni centro attivo.`
      : 'Dove si pratica Krav Maga con AKM Italia: indirizzo, giorni, orari e docenti di ogni centro tecnico attivo.',
    path: '/centri',
  })
}

export default async function PaginaCentri({
  searchParams,
}: {
  searchParams: Promise<{ provincia?: string }>
}) {
  /* Letto anche se il filtro lo applica il client: leggere searchParams rende
     la rotta dinamica, cosi' useSearchParams ha valori gia' in SSR e l'HTML di
     ?provincia=MI arriva filtrato al motore di ricerca e al primo paint. */
  await searchParams
  const payload = await apriPayload()

  const [sedi, impostazioni] = await Promise.all([
    payload.find({
      collection: 'sedi',
      depth: 2,
      limit: 200,
      sort: 'indirizzo.citta',
      where: { and: [{ attivo: { equals: true } }, pubblicato] },
    }),
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
  ])

  const centri = sedi.docs
  const province = [
    ...new Set(centri.map((c) => c.indirizzo?.provincia).filter((p): p is string => Boolean(p))),
  ].sort()

  return (
    <>
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <h1 className="display display--lg">
            {centri.length > 0 ? `${centri.length} centri, orari veri` : 'I centri tecnici'}
          </h1>
          <p className="testo testata__testo">
            Indirizzo, giorni, orario e docente di ogni centro attivo. In ordine alfabetico per
            comune, senza raggruppamenti: la provincia è scritta accanto alla città.
          </p>
        </div>
      </section>

      {/* Una banda a tutta larghezza fra la testata e l'elenco: stacca il nero
          dal chiaro e mostra dove si pratica prima di elencarlo. */}
      {/* `priorita`: su queste pagine la banda e' l'LCP, la testata sopra e'
          tipografica e non ha niente da caricare. */}
      <Figura
        slot={impostazioni?.fotoPagine?.centri}
        etichetta="Foto della pagina Centri"
        formato="banda"
        misura="grande"
        sizes="100vw"
        priorita
      />

      <section className="sezione sezione--chiara" aria-labelledby="titolo-elenco">
        <div className="contenitore">
          <ElencoCentri centri={centri} province={province} />
        </div>
      </section>
    </>
  )
}
