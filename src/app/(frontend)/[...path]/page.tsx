import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { pubblicato } from '@/componenti/dati'
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
  const payload = await getPayload({ config: await config })
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
  const payload = await getPayload({ config: await config })
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>
}): Promise<Metadata> {
  const { path } = await params
  const pagina = await trovaPagina(aPath(path))
  if (!pagina) return {}

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

  const eroe = typeof pagina.immagineHero === 'object' ? pagina.immagineHero : null
  const eroeUrl = eroe?.sizes?.hero?.url || eroe?.url || null
  const sezioni = pagina.sezioni ?? []

  return (
    <>
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          {pagina.occhiello ? <p className="occhiello">{pagina.occhiello}</p> : null}
          <h1 className="display display--lg">{pagina.titolo}</h1>
          {pagina.sommario ? <p className="testo testata__testo">{pagina.sommario}</p> : null}
        </div>
      </section>

      {eroeUrl ? (
        <Image
          className="editoriale__foto"
          src={eroeUrl}
          alt={eroe?.alt || ''}
          width={1600}
          height={700}
          sizes="100vw"
        />
      ) : null}

      <section className="sezione sezione--chiara">
        <div className="contenitore editoriale">
          {sezioni.length > 0 ? (
            sezioni.map((sezione, i) => (
              <section className="rivela editoriale__sezione" key={sezione.id ?? i}>
                {sezione.titolo ? <h2>{sezione.titolo}</h2> : null}
                <div className="ricco">
                  <RichText data={sezione.testo} />
                </div>
              </section>
            ))
          ) : (
            <p className="testo vuoto">Questa pagina è in aggiornamento.</p>
          )}
        </div>
      </section>
    </>
  )
}
