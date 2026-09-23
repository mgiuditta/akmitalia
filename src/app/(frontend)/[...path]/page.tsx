import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { apriPayload } from '@/componenti/payload'
import { pubblicato } from '@/componenti/dati'
import { Figura } from '@/componenti/Figura'
import { metadatiPagina } from '@/componenti/seo'

/**
 * Tutte le pagine editoriali passano da qui: privacy, cookie, chi siamo e le
 * pagine importate dal vecchio sito. La gerarchia sta in `parent`, la URL nel
 * campo `path` di src/collections/Pagine.ts, che e' salvato e indicizzato
 * proprio perche' questa rotta lo deve poter interrogare.
 *
 * Le rotte scritte a mano (/centri, /corsi, /contatti, /istruttori) vincono su
 * questa: in Next un segmento statico batte sempre una catch-all. Questa rotta
 * non ha bisogno di saperlo, ma il test e2e lo verifica lo stesso.
 *
 * ponytail: una rotta e nessun registro di blocchi. Le sezioni sono un titolo
 * e del testo ricco, che e' quello che le 39 pagine importate contengono.
 * Vedi docs/adr/0011.
 */

export const revalidate = 60

async function trovaPagina(path: string) {
  const payload = await apriPayload()
  const pagine = await payload.find({
    collection: 'pagine',
    depth: 1,
    limit: 1,
    where: { and: [{ path: { equals: path } }, pubblicato] },
  })
  return pagine.docs[0] ?? null
}

/** Il `path` a database ha lo slash davanti, i segmenti della rotta no. */
function aPath(segmenti: string[]) {
  return `/${segmenti.map(decodeURIComponent).join('/')}`
}

export async function generateStaticParams() {
  const payload = await apriPayload()
  const pagine = await payload.find({
    collection: 'pagine',
    depth: 0,
    limit: 500,
    select: { path: true },
    where: pubblicato,
  })

  return pagine.docs
    .map((pagina) => pagina.path)
    .filter((path): path is string => Boolean(path))
    .map((path) => ({ path: path.replace(/^\//, '').split('/') }))
}

/* Quando la scheda non c'e' la rotta chiama notFound() e rende not-found.tsx:
   il titolo del documento lo decide comunque questa funzione, e «AKM Italia»
   su una pagina che dice «questa pagina non c'e'» e' una riga che si contraddice. */
const TITOLO_404 = { title: 'Pagina non trovata' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>
}): Promise<Metadata> {
  const { path } = await params
  const pagina = await trovaPagina(aPath(path))
  if (!pagina) return TITOLO_404

  return metadatiPagina({
    titolo: pagina.meta?.title || pagina.titolo,
    descrizione: pagina.meta?.description || pagina.sommario || '',
    path: pagina.path ?? '/',
  })
}

export default async function PaginaEditoriale({
  params,
}: {
  params: Promise<{ path: string[] }>
}) {
  const { path } = await params
  const pagina = await trovaPagina(aPath(path))
  if (!pagina) notFound()

  const sezioni = pagina.sezioni ?? []

  return (
    <>
      <section className="section section--black masthead">
        <div className="container masthead__content">
          {pagina.occhiello ? <p className="eyebrow">{pagina.occhiello}</p> : null}
          <h1 className="display display--lg">{pagina.titolo}</h1>
          {pagina.sommario ? <p className="text masthead__text">{pagina.sommario}</p> : null}
        </div>
      </section>

      {/* Lo stesso slot di tutte le altre testate, non un <Image> a parte: cosi'
          quando la foto manca resta il segnaposto invece di un buco, che e'
          quello che docs/adr/0012 decide proprio per questa testata. */}
      <Figura
        slot={pagina.immagineHero}
        etichetta="Foto della testata"
        formato="banda"
        misura="grande"
        sizes="100vw"
      />

      <section className="section section--light">
        <div className="container editorial">
          {sezioni.length > 0 ? (
            sezioni.map((sezione, i) => (
              /* Niente `.rivela` qui: le sezioni di un'informativa non sono un
                 elenco, e l'entrata allo scroll le lasciava schiarite nella parte
                 bassa dello schermo invece di scandirle. Il repertorio del
                 movimento vale dove c'e' qualcosa da scandire. */
              <section className="editorial__section" key={sezione.id ?? i}>
                {sezione.titolo ? <h2>{sezione.titolo}</h2> : null}
                <div className="rich">
                  <RichText data={sezione.testo} />
                </div>
              </section>
            ))
          ) : (
            <p className="text empty">Questa pagina è in aggiornamento.</p>
          )}
        </div>
      </section>
    </>
  )
}
