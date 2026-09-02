import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { apriPayload } from '@/componenti/payload'
import { dataLeggibile, orarioLeggibile } from '@/componenti/calendario'
import { etichettaTipo, indirizzoLeggibile, jsonLd, pubblicato, sitoUrl } from '@/componenti/dati'
import { Figura } from '@/componenti/Figura'
import { metadatiPagina } from '@/componenti/seo'

/**
 * La scheda di un evento: quando, dove, di che cosa si tratta e come
 * iscriversi. Stessa forma della scheda di un centro, senza la mappa: il
 * «dove» e' un link al centro, che la mappa ce l'ha gia'.
 */

export const revalidate = 60

async function trovaEvento(slug: string) {
  const payload = await apriPayload()
  const eventi = await payload.find({
    collection: 'eventi',
    depth: 2,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, pubblicato] },
  })
  return eventi.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await apriPayload()
  const eventi = await payload.find({
    collection: 'eventi',
    depth: 0,
    limit: 500,
    select: { slug: true },
    where: pubblicato,
  })
  return eventi.docs.map((evento) => ({ slug: evento.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const evento = await trovaEvento(slug)
  if (!evento) return {}

  const sede = typeof evento.sede === 'object' ? evento.sede : null
  return metadatiPagina({
    titolo: evento.titolo,
    descrizione:
      evento.estratto ||
      `${etichettaTipo(evento.tipo)} AKM Italia, ${dataLeggibile(evento.dataInizio, evento.dataFine)}${
        sede ? ` a ${sede.indirizzo?.citta ?? sede.nome}` : evento.luogo ? `, ${evento.luogo}` : ''
      }.`,
    path: `/eventi/${evento.slug}`,
  })
}

export default async function PaginaEvento({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [evento, impostazioni] = await Promise.all([
    trovaEvento(slug),
    (await apriPayload()).findGlobal({ slug: 'impostazioni', depth: 1 }),
  ])
  if (!evento) notFound()

  const sede = typeof evento.sede === 'object' ? evento.sede : null
  const corsi = (evento.corsi ?? []).filter((c) => typeof c === 'object')
  const orario = orarioLeggibile(evento.dataInizio, evento.dataFine)
  const quando = orario
    ? `${dataLeggibile(evento.dataInizio, evento.dataFine)}, ${orario}`
    : dataLeggibile(evento.dataInizio, evento.dataFine)

  /* Un evento datato in un luogo: senza JSON-LD un motore di ricerca deve
     indovinarlo dal testo, e quelli con la data li mostra come tali. */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: evento.titolo,
    url: `${sitoUrl()}/eventi/${evento.slug}`,
    startDate: evento.dataInizio,
    endDate: evento.dataFine || undefined,
    description: evento.estratto || undefined,
    organizer: { '@type': 'SportsOrganization', name: 'AKM Italia', url: sitoUrl() },
    location: sede
      ? {
          '@type': 'Place',
          name: sede.nome,
          url: `${sitoUrl()}/centri/${sede.slug}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: sede.indirizzo?.via || undefined,
            postalCode: sede.indirizzo?.cap || undefined,
            addressLocality: sede.indirizzo?.citta || undefined,
            addressRegion: sede.indirizzo?.provincia || undefined,
            addressCountry: 'IT',
          },
        }
      : evento.luogo
        ? { '@type': 'Place', name: evento.luogo }
        : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <Link className="briciola" href="/eventi">
            Torna al calendario
          </Link>
          <p className="occhiello">{etichettaTipo(evento.tipo)}</p>
          <h1 className="display display--md">{evento.titolo}</h1>
          <p className="testo dato">
            <time dateTime={evento.dataInizio}>{quando}</time>
          </p>
        </div>
      </section>

      {/* Senza una copertina propria l'evento prende la foto della pagina Eventi:
          cinquanta schede con lo stesso segnaposto grigio non dicono niente. */}
      <Figura
        slot={evento.copertina || impostazioni?.fotoPagine?.eventi}
        etichetta="Foto dell'evento"
        formato="banda"
        misura="grande"
        sizes="100vw"
      />

      <section className="sezione sezione--chiara">
        <div className="contenitore scheda">
          <div>
            {evento.estratto ? <p className="testo">{evento.estratto}</p> : null}
            {evento.descrizione ? (
              <div className="ricco">
                <RichText data={evento.descrizione} />
              </div>
            ) : null}
            {!evento.estratto && !evento.descrizione ? (
              <p className="dato">Il programma di questo evento è in aggiornamento.</p>
            ) : null}
          </div>

          <div>
            <div className="blocco">
              <h2>Dove</h2>
              {sede ? (
                <p className="dato">
                  <Link href={`/centri/${sede.slug}`}>{sede.nome}</Link>
                  <br />
                  {indirizzoLeggibile(sede.indirizzo)}
                </p>
              ) : (
                <p className="dato">{evento.luogo || 'Luogo da confermare.'}</p>
              )}
            </div>

            {corsi.length > 0 ? (
              <div className="blocco">
                <h2>Discipline</h2>
                <ul className="elenco__voci">
                  {corsi.map((corso) => (
                    <li key={corso.id}>
                      <Link href={`/corsi/${corso.slug}`}>{corso.nome}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="blocco">
              <h2>Quando</h2>
              <p className="dato">{quando}</p>
              <p>
                {evento.ctaLink ? (
                  <a
                    className="bottone bottone--primario"
                    href={evento.ctaLink}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Iscriviti
                  </a>
                ) : (
                  <Link className="bottone bottone--primario" href="/contatti">
                    Richiedi informazioni
                  </Link>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
