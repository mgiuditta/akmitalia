import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { openPayload } from '@/components/payload'
import { readableDate, readableSlot } from '@/components/calendar'
import { typeLabel, readableAddress, jsonLd, published, siteUrl } from '@/components/data'
import { Figure } from '@/components/Figure'
import { pageMetadata } from '@/components/seo'

/**
 * La scheda di un evento: quando, dove, di che cosa si tratta e come
 * iscriversi. Stessa forma della scheda di un centro, senza la mappa: il
 * «dove» e' un link al centro, che la mappa ce l'ha gia'.
 */

export const revalidate = 60

async function findEvent(slug: string) {
  const payload = await openPayload()
  const events = await payload.find({
    collection: 'eventi',
    depth: 2,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, published] },
  })
  return events.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await openPayload()
  const events = await payload.find({
    collection: 'eventi',
    depth: 0,
    limit: 500,
    select: { slug: true },
    where: published,
  })
  return events.docs.map((event) => ({ slug: event.slug }))
}

/* Quando la scheda non c'e' la rotta chiama notFound() e rende not-found.tsx:
   il titolo del documento lo decide comunque questa funzione, e «AKM Italia»
   su una pagina che dice «questa pagina non c'e'» e' una riga che si contraddice. */
const TITLE_404 = { title: 'Pagina non trovata' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await findEvent(slug)
  if (!event) return TITLE_404

  const center = typeof event.sede === 'object' ? event.sede : null
  return pageMetadata({
    titolo: event.titolo,
    descrizione:
      event.estratto ||
      `${typeLabel(event.tipo)} AKM Italia, ${readableDate(event.dataInizio, event.dataFine)}${
        center ? ` a ${center.indirizzo?.citta ?? center.nome}` : event.luogo ? `, ${event.luogo}` : ''
      }.`,
    path: `/eventi/${event.slug}`,
  })
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await findEvent(slug)
  if (!event) notFound()

  const center = typeof event.sede === 'object' ? event.sede : null
  const courses = (event.corsi ?? []).filter((c) => typeof c === 'object')
  const slot = readableSlot(event.dataInizio, event.dataFine)
  const when = slot
    ? `${readableDate(event.dataInizio, event.dataFine)}, ${slot}`
    : readableDate(event.dataInizio, event.dataFine)

  /* Trentacinque eventi su cinquantasette sono gia' passati, e la scheda li
     mostrava come se fossero da fare: «in aggiornamento», «Luogo da confermare»
     e un bottone rosso «Richiedi informazioni» sotto una data dell'anno scorso.
     Un evento concluso resta in archivio e lo dichiara. Il confronto e' con la
     fine, dove c'e': uno stage di tre giorni e' in corso anche il secondo. */
  const ended = new Date(event.dataFine || event.dataInizio).getTime() < Date.now()

  /* Un evento datato in un luogo: senza JSON-LD un motore di ricerca deve
     indovinarlo dal testo, e quelli con la data li mostra come tali. */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.titolo,
    url: `${siteUrl()}/eventi/${event.slug}`,
    startDate: event.dataInizio,
    endDate: event.dataFine || undefined,
    description: event.estratto || undefined,
    organizer: { '@type': 'SportsOrganization', name: 'AKM Italia', url: siteUrl() },
    location: center
      ? {
          '@type': 'Place',
          name: center.nome,
          url: `${siteUrl()}/centri/${center.slug}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: center.indirizzo?.via || undefined,
            postalCode: center.indirizzo?.cap || undefined,
            addressLocality: center.indirizzo?.citta || undefined,
            addressRegion: center.indirizzo?.provincia || undefined,
            addressCountry: 'IT',
          },
        }
      : event.luogo
        ? { '@type': 'Place', name: event.luogo }
        : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <section className="section section--black masthead">
        <div className="container masthead__content">
          <Link className="breadcrumb" href="/eventi">
            Torna al calendario
          </Link>
          <p className="eyebrow">
            {typeLabel(event.tipo)}
            {ended ? ' · Concluso' : ''}
          </p>
          <h1 className="display display--md">{event.titolo}</h1>
          <p className="text detail">
            <time dateTime={event.dataInizio}>{when}</time>
          </p>
        </div>
      </section>

      {/*
        La banda c'e' solo se questo evento ha la sua fotografia. Il ripiego sulla
        foto della pagina Eventi partiva da una ragione giusta - cinquanta schede
        con lo stesso segnaposto grigio non dicono niente - e arrivava allo stesso
        posto: cinquantasette schede con la stessa fotografia non dicono niente
        uguale, e intanto 558px di foto ripetuta spingevano data, luogo e bottone
        sotto la piega. Un evento non e' una pagina indice: la sua copertina e' un
        dato, non uno slot di composizione, e un dato che manca non si stampa
        (docs/adr/0012).
      */}
      {event.copertina ? (
        <Figure
          slot={event.copertina}
          label="Foto dell'evento"
          format="band"
          measure="grande"
          sizes="100vw"
        />
      ) : null}

      <section className="section section--light">
        <div className="container card">
          <div>
            {event.estratto ? <p className="text">{event.estratto}</p> : null}
            {event.descrizione ? (
              <div className="rich">
                <RichText data={event.descrizione} />
              </div>
            ) : null}
            {!event.estratto && !event.descrizione ? (
              <p className="detail">
                {ended
                  ? 'Di questo evento restano la data, il tipo e il luogo: il programma non è stato archiviato.'
                  : 'Il programma di questo evento è in aggiornamento.'}
              </p>
            ) : null}
          </div>

          <div>
            <div className="block">
              <h2>Dove</h2>
              {center ? (
                <p className="detail">
                  <Link href={`/centri/${center.slug}`}>{center.nome}</Link>
                  <br />
                  {readableAddress(center.indirizzo)}
                </p>
              ) : (
                /* «Da confermare» e' una promessa: su un evento passato non c'e'
                   piu' niente da confermare, il luogo semplicemente non e' stato
                   registrato nell'import. */
                <p className="detail">
                  {event.luogo || (ended ? 'Luogo non registrato.' : 'Luogo da confermare.')}
                </p>
              )}
            </div>

            {courses.length > 0 ? (
              <div className="block">
                <h2>Discipline</h2>
                <ul className="list__items">
                  {courses.map((course) => (
                    <li key={course.id}>
                      <Link href={`/corsi/${course.slug}`}>{course.nome}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Il blocco «Quando» ristampava parola per parola la data che sta
                nella testata, tre centimetri sopra: qui resta l'azione, che e'
                l'unica cosa che la colonna aveva da aggiungere.
                Su un evento concluso l'azione non e' iscriversi: e' vedere cosa
                c'e' adesso. La richiesta parte con il centro gia' scelto, dove
                l'evento ne aveva uno. */}
            <div className="block">
              {ended ? (
                <>
                  <h2>Questo evento è concluso</h2>
                  <p className="detail">
                    Resta in archivio per chi cerca cos’è successo. Gli appuntamenti aperti
                    stanno nel calendario.
                  </p>
                  <p>
                    <Link className="button button--secondary" href="/eventi">
                      Vedi il calendario
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <h2>Come si partecipa</h2>
                  <p>
                    {event.ctaLink ? (
                      <a
                        className="button button--primary"
                        href={event.ctaLink}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Iscriviti
                      </a>
                    ) : (
                      <Link
                        className="button button--primary"
                        href={center ? `/contatti?sede=${encodeURIComponent(center.slug)}` : '/contatti'}
                      >
                        Richiedi informazioni
                      </Link>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
