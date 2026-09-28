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
import { NetworkMap } from '@/components/NetworkMap'
import { Stops } from '@/components/CenterNetwork'
import { RequestForm } from '@/components/RequestForm'
import { requestFormProps } from '@/components/requestFormProps'
import { servedZones, splitName, toSignCenter } from '@/components/signage'

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

  /* La rete intera serve allo schema in testata: questo centro pieno, gli
     altri come contesto. Il modulo arriva con le sue letture, le stesse di
     /contatti. */
  const [network, form] = await Promise.all([
    payload.find({
      collection: 'sedi',
      depth: 0,
      limit: 200,
      select: { nome: true, slug: true, palestra: true, indirizzo: true, coordinate: true },
      where: { and: [{ attivo: { equals: true } }, published] },
    }),
    requestFormProps(),
  ])
  const noCourses = new Map<number, string>()
  const others = network.docs.map((c) => toSignCenter(c, noCourses))
  if (!others.some((c) => c.id === center.id)) others.push(toSignCenter(center, noCourses))

  const { sign, host } = splitName(center.nome)
  const zones = servedZones(center.descrizione)
  /* La descrizione oggi mescola due cose: le zone servite, che qui diventano
     la linea delle fermate, e le note su come si entra («Sopra il Lidl, primo
     piano»). Resta stampata solo la seconda. */
  const accessNote = (center.descrizione ?? '')
    .replace(/Il Centro Tecnico[^.]*punto di riferimento per le zone[^.]*\.?/i, '')
    .trim()
  const initialCenter = center.attivo
    ? (form.sedi.find((s) => s.slug === center.slug)?.id ?? null)
    : null

  const schedule = center.orari ?? []
  const instructors = (center.istruttori ?? []).filter((i) => typeof i === 'object')

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

      {/* Prototipo C, «La segnaletica» (#66): la testata e' il cartello della
          stazione. Il nome del posto in grande, la struttura sotto, la linea
          delle zone che serve, e a destra lo schema della rete con questo
          centro pieno. */}
      <section className="section section--black masthead station">
        <div className="container station__grid">
          <div className="station__sign">
            <Link className="breadcrumb" href="/centri">
              Torna ai centri
            </Link>
            <p className="station__kicker">
              {center.indirizzo?.provincia ? (
                <span className="sign__province">{center.indirizzo.provincia}</span>
              ) : null}
              <span className="eyebrow">Centro tecnico</span>
            </p>
            <h1 className="display display--hero station__title">{sign}</h1>
            <p className="station__host">{center.palestra || host}</p>
            {/* Un centro non attivo resta pubblicato e sparisce dagli elenchi,
                ma la sua scheda si apre lo stesso: lo dice a parole. */}
            {center.attivo ? (
              <p className="status">Attivo in questa stagione</p>
            ) : (
              <p className="text detail">
                Questo centro non è attivo in questa stagione: gli orari qui sotto sono quelli
                dell’ultima e non sono in corso. Scrivici e ti diciamo qual è il centro più vicino
                aperto.
              </p>
            )}
            {zones.length > 0 ? <Stops zones={zones} label="Punto di riferimento anche per" /> : null}
          </div>

          <div className="station__network">
            <NetworkMap
              centers={others}
              focus={center.id}
              nominalWidth={500}
              label={`${sign} nella rete dei centri AKM Italia`}
            />
          </div>
        </div>
      </section>

      <section className="section section--light timetable-section">
        <div className="container timetable-grid">
          <div className="timetable-main">
            <h2 className="display display--md">Orario</h2>
            {schedule.length > 0 && !center.attivo ? (
              <p className="detail">Programmazione dell’ultima stagione, non in corso.</p>
            ) : null}
            {schedule.length > 0 ? (
              <ol className="timetable">
                {schedule.map((slot) => {
                  const discipline = typeof slot.disciplina === 'object' ? slot.disciplina : null
                  const teachers = (slot.docenti ?? [])
                    .map(instructorName)
                    .filter(Boolean)
                    .join(', ')
                  return (
                    <li className="timetable__row" key={slot.id}>
                      <span className="display timetable__day">{readableDays(slot.giorni)}</span>
                      <span className="display timetable__time">
                        {slot.oraInizio}-{slot.oraFine}
                      </span>
                      <span className="timetable__what">
                        {discipline ? (
                          <Link href={`/corsi/${discipline.slug}`}>{discipline.nome}</Link>
                        ) : null}
                        {slot.note ? <span>{slot.note}</span> : null}
                        {teachers ? <span>Docente: {teachers}</span> : null}
                      </span>
                    </li>
                  )
                })}
              </ol>
            ) : (
              <p className="detail">Orari in aggiornamento per la stagione.</p>
            )}
          </div>

          <aside className="address-panel" aria-labelledby="address-title">
            <h2 className="address-panel__title" id="address-title">
              Indirizzo
            </h2>
            <p className="address-panel__street">
              {center.palestra ? (
                <>
                  <strong>{center.palestra}</strong>
                  <br />
                </>
              ) : null}
              {readableAddress(center.indirizzo)}
            </p>
            {accessNote ? <p className="detail address-panel__note">{accessNote}</p> : null}
            {center.mapsUrl ? (
              <p>
                <a
                  className="button button--secondary address-panel__maps"
                  href={center.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Apri in Maps <span className="arrow arrow--small" aria-hidden="true" />
                </a>
              </p>
            ) : null}
            {points.length > 0 ? (
              <CenterMap points={points} etichetta={`Dove si trova ${center.nome}`} />
            ) : null}
            <Figure
              slot={center.foto}
              label="Foto del centro in arrivo"
              format="wide"
              sizes="(min-width: 900px) 40vw, 100vw"
            />
          </aside>

          {/* Chi insegna e i prossimi eventi: sul telefono vengono dopo
              l'indirizzo, perche' orario e indirizzo sono le due cose che si
              cercano; sopra i 1000px stanno sotto l'orario. */}
          <div className="timetable-extra">
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
          </div>
        </div>
      </section>

      {/* Il modulo sta nella scheda e non dietro un link: la scheda e' la
          conversione (PRODUCT.md), e il centro arriva gia' scelto. Per un
          centro non attivo la richiesta parte senza sede, come prima. */}
      <section className="section section--grey" id="modulo" aria-labelledby="form-title">
        <div className="container request">
          <div>
            <h2 className="display display--md" id="form-title">
              {center.attivo ? `Scrivi a ${sign}` : 'Scrivici'}
            </h2>
            <p className="text request__lead">
              {center.attivo
                ? `Il centro è già scelto nel modulo: la richiesta arriva a chi tiene le lezioni a ${sign}. AKM non pubblica telefono né email per centro.`
                : 'Questo centro non è fra le scelte del modulo: scegli quello che ti resta comodo.'}
            </p>
          </div>
          <RequestForm
            sedi={form.sedi.map((c) => ({
              id: c.id,
              nome: c.nome,
              citta: c.citta,
              indirizzo: c.indirizzo,
              palestra: c.palestra,
              mapsUrl: c.mapsUrl,
            }))}
            corsi={form.corsi}
            texts={form.texts}
            options={form.options}
            initialCenter={initialCenter}
            turnstileSiteKey={form.turnstileSiteKey}
          />
        </div>
      </section>
    </>
  )
}
