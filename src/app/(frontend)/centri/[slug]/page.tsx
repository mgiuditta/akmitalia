import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { openPayload } from '@/components/payload'
import { EventAgenda } from '@/components/EventAgenda'
import { CenterMap, type MapPoint } from '@/components/CenterMap'
import {
  readableDays,
  readableAddress,
  jsonLd,
  instructorName,
  published,
  siteUrl,
} from '@/components/data'
import { Figure } from '@/components/Figure'
import { pageMetadata } from '@/components/seo'

/**
 * Scheda di un centro tecnico: e' la conversione. Indirizzo, orari, docenti e
 * come arrivarci stanno tutti qui, leggibili, senza un click in mezzo.
 */

export const revalidate = 60

/* I giorni di schema.org sono in inglese: la mappa serve solo al JSON-LD, il
   testo visibile resta quello di giorniLeggibili. */
const SCHEMA_DAYS: Record<string, string> = {
  lun: 'Monday',
  mar: 'Tuesday',
  mer: 'Wednesday',
  gio: 'Thursday',
  ven: 'Friday',
  sab: 'Saturday',
  dom: 'Sunday',
}

async function findCenter(slug: string) {
  const payload = await openPayload()
  const centers = await payload.find({
    collection: 'sedi',
    depth: 2,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, published] },
  })
  return centers.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await openPayload()
  const centers = await payload.find({
    collection: 'sedi',
    depth: 0,
    limit: 200,
    select: { slug: true },
    where: published,
  })
  return centers.docs.map((center) => ({ slug: center.slug }))
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
  const center = await findCenter(slug)
  if (!center) return TITLE_404

  return pageMetadata({
    titolo: center.nome,
    descrizione:
      center.descrizione ||
      `Krav Maga a ${center.indirizzo?.citta}: ${readableAddress(center.indirizzo)}. Giorni, orari e docenti del centro tecnico AKM Italia.`,
    path: `/centri/${center.slug}`,
  })
}

export default async function CenterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const center = await findCenter(slug)
  if (!center) notFound()

  /* Gli eventi di questo centro da oggi in poi: uno stage e' datato e
     straordinario, l'orario e' ricorrente. Stanno sotto gli orari, non dentro. */
  const payload = await openPayload()
  const now = new Date().toISOString()
  const events = await payload.find({
    collection: 'eventi',
    depth: 0,
    limit: 5,
    sort: 'dataInizio',
    where: {
      and: [
        published,
        { sede: { equals: center.id } },
        {
          or: [
            { dataFine: { greater_than_equal: now } },
            { dataInizio: { greater_than_equal: now } },
          ],
        },
      ],
    },
  })

  const schedule = center.orari ?? []
  const instructors = (center.istruttori ?? []).filter((i) => typeof i === 'object')

  const disciplines = new Map<number, string>()
  for (const slot of schedule) {
    if (typeof slot.disciplina === 'object' && slot.disciplina) {
      disciplines.set(slot.disciplina.id, slot.disciplina.nome)
    }
  }

  const points: MapPoint[] =
    typeof center.coordinate?.lat === 'number' && typeof center.coordinate?.lng === 'number'
      ? [
          {
            id: center.id,
            nome: center.nome,
            citta: center.indirizzo?.citta ?? '',
            slug: center.slug,
            lat: center.coordinate.lat,
            lng: center.coordinate.lng,
          },
        ]
      : []

  /* Il centro e' un luogo fisico con indirizzo, coordinate e orari ricorrenti:
     senza JSON-LD un motore di ricerca deve indovinarlo dal testo. */
  const location = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: center.nome,
    url: `${siteUrl()}/centri/${center.slug}`,
    sport: 'Krav Maga',
    address: {
      '@type': 'PostalAddress',
      streetAddress: center.indirizzo?.via || undefined,
      postalCode: center.indirizzo?.cap || undefined,
      addressLocality: center.indirizzo?.citta || undefined,
      addressRegion: center.indirizzo?.provincia || undefined,
      addressCountry: 'IT',
    },
    geo:
      typeof center.coordinate?.lat === 'number' && typeof center.coordinate?.lng === 'number'
        ? {
            '@type': 'GeoCoordinates',
            latitude: center.coordinate.lat,
            longitude: center.coordinate.lng,
          }
        : undefined,
    openingHoursSpecification: schedule.flatMap((slot) =>
      (slot.giorni ?? [])
        .map((g) => SCHEMA_DAYS[g as string])
        .filter(Boolean)
        .map((day) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: day,
          opens: slot.oraInizio,
          closes: slot.oraFine,
        })),
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(location) }}
      />
      <section className="section section--black masthead">
        <div className="container masthead__content">
          <Link className="breadcrumb" href="/centri">
            Torna ai centri
          </Link>
          <p className="eyebrow">Centro tecnico</p>
          <h1 className="display display--md">{center.nome}</h1>
          <p className="text detail">{readableAddress(center.indirizzo)}</p>
          {/* Un centro non attivo resta pubblicato e sparisce dagli elenchi, ma la
              sua scheda si apre lo stesso: ci si arriva dall'albo, da un evento
              passato, da un vecchio link. Prima l'unico indizio era che mancava
              il quadrato verde, cioe' niente: un'assenza non e' un'etichetta
              (Regola dell'Etichetta). */}
          {center.attivo ? (
            <p className="status">Attivo in questa stagione</p>
          ) : (
            <p className="text detail">
              Questo centro non è attivo in questa stagione: gli orari qui sotto sono quelli
              dell’ultima e non sono in corso. Scrivici e ti diciamo qual è il centro più vicino
              aperto.
            </p>
          )}
        </div>
      </section>

      {/* La sala di questo centro, fra la testata e la scheda: chi sceglie dove
          allenarsi vuole vedere il posto prima degli orari. */}
      <Figure
        slot={center.foto}
        label="Foto del centro"
        format="band"
        measure="grande"
        sizes="100vw"
      />

      <section className="section section--light">
        <div className="container card">
          <div>
            {center.descrizione ? <p className="text">{center.descrizione}</p> : null}

            <div className="block">
              <h2>Orari</h2>
              {schedule.length > 0 && !center.attivo ? (
                <p className="detail">Programmazione dell’ultima stagione, non in corso.</p>
              ) : null}
              {schedule.length > 0 ? (
                <div className="schedule">
                  {schedule.map((slot) => {
                    const discipline =
                      typeof slot.disciplina === 'object' ? slot.disciplina : null
                    const teachers = (slot.docenti ?? [])
                      .map(instructorName)
                      .filter(Boolean)
                      .join(', ')

                    return (
                      <div className="schedule__row" key={slot.id}>
                        <span className="schedule__days">{readableDays(slot.giorni)}</span>
                        <span>
                          {slot.oraInizio}-{slot.oraFine}
                        </span>
                        <span>
                          {discipline ? (
                            <Link href={`/corsi/${discipline.slug}`}>{discipline.nome}</Link>
                          ) : null}
                          {teachers ? ` · Docente ${teachers}` : ''}
                          {slot.note ? ` · ${slot.note}` : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="detail">Orari in aggiornamento per la stagione.</p>
              )}
            </div>

            {events.docs.length > 0 ? (
              <div className="block">
                <h2>Prossimi eventi qui</h2>
                <EventAgenda events={events.docs} showPlace={false} />
                <p>
                  <Link className="breadcrumb" href="/eventi">
                    Tutto il calendario
                  </Link>
                </p>
              </div>
            ) : null}

            {disciplines.size > 0 ? (
              <div className="block">
                <h2>Cosa si pratica qui</h2>
                <ul className="list__items">
                  {[...disciplines.values()].map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {instructors.length > 0 ? (
              <div className="block">
                <h2>Chi insegna</h2>
                <ul className="list__items">
                  {instructors.map((instructor) => (
                    <li key={instructor.id}>
                      {instructor.nome}
                      {instructor.ruolo ? ` · ${instructor.ruolo}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div>
            {points.length > 0 ? (
              <CenterMap points={points} etichetta={`Dove si trova ${center.nome}`} />
            ) : null}

            <div className="block">
              <h2>Come arrivarci</h2>
              <p className="detail">
                {center.palestra ? `${center.palestra}, ` : ''}
                {readableAddress(center.indirizzo)}
              </p>
              {center.mapsUrl ? (
                <p>
                  <a
                    className="center__maps"
                    href={center.mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Apri su Google Maps
                  </a>
                </p>
              ) : null}
              {/* L'unico bottone rosso della scheda portava via dalla conversione:
                  PRODUCT.md misura il successo sulla richiesta con la sede
                  selezionata, e nessuna azione apriva il modulo con questo centro
                  gia' scelto. Ora l'azione e' quella, e l'indice dei percorsi
                  resta dov'e' sempre stato, in barra e nel menu.
                  Per un centro non attivo la richiesta parte senza sede: quel
                  centro non e' fra le scelte del modulo, e mandarci qualcuno
                  sarebbe una promessa che non possiamo tenere. */}
              <p className="tail-action">
                <Link
                  className="button button--primary"
                  href={
                    center.attivo ? `/contatti?sede=${encodeURIComponent(center.slug)}` : '/contatti'
                  }
                >
                  Richiedi informazioni
                </Link>
                <Link className="button button--secondary" href="/corsi">
                  Tutti i percorsi
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
