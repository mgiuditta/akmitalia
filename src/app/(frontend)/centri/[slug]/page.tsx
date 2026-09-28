import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import type { Corsi, Istruttori } from '@/payload-types'

import { openPayload } from '@/components/payload'
import { EventAgenda } from '@/components/EventAgenda'
import { CenterMap, type MapPoint } from '@/components/CenterMap'
import { readableDays, readableAddress, jsonLd, published, siteUrl } from '@/components/data'
import { Figure } from '@/components/Figure'
import { RequestForm } from '@/components/RequestForm'
import { fullName, joinNames, splitCenterName } from '@/components/lessons'
import { loadRequestForm } from '@/components/requestFormData'
import { pageMetadata } from '@/components/seo'

/**
 * Scheda di un centro tecnico, direzione A «Fenriz ripulito» (#62, #66): e' la
 * conversione. Nella prima schermata stanno l'indirizzo, gli orari e chi
 * insegna, su una lastra chiara dentro l'apertura nera, senza un click in
 * mezzo. Sotto, la persona, come arrivarci e il modulo con il centro gia'
 * scelto. Il display compare una volta sola: il nome del luogo.
 */

/* Il giorno per esteso, per raggruppare gli orari: «Giovedì» una volta, e
   sotto le lezioni di quel giorno. */
const DAY_ORDER = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom']

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
  const { place, gym } = splitCenterName(center)

  /* Il modulo sta nella scheda e non dietro un link: e' la richiesta con la
     sede selezionata che PRODUCT.md misura, e qui la sede e' gia' decisa.
     Un centro non attivo non e' fra le scelte del modulo: la richiesta parte
     senza sede, come faceva il link a /contatti. */
  const form = await loadRequestForm(payload)
  const initialCenter = center.attivo
    ? (form.centers.find((c) => c.id === center.id)?.id ?? null)
    : null

  /* Le lezioni raggruppate per giorno: chi guarda cerca «quando», e il giorno
     scritto una volta sola si legge prima di tre righe che lo ripetono. */
  const days = DAY_ORDER.map((day) => ({
    day,
    label: readableDays([day]),
    slots: schedule
      .filter((slot) => (slot.giorni ?? []).includes(day as never))
      .sort((a, b) => a.oraInizio.localeCompare(b.oraInizio)),
  })).filter((d) => d.slots.length > 0)

  /* Chi insegna qui: i docenti delle righe d'orario, per nome intero e con le
     credenziali dell'albo. Se le righe non ne portano, i docenti del centro. */
  const teacherDocs = new Map<number, Istruttori>()
  for (const slot of schedule) {
    for (const t of slot.docenti ?? []) if (typeof t === 'object') teacherDocs.set(t.id, t)
  }
  if (teacherDocs.size === 0) {
    for (const t of center.istruttori ?? []) if (typeof t === 'object') teacherDocs.set(t.id, t)
  }
  const teachers = [...teacherDocs.values()]

  /* Come si entra, corso per corso: il testo e' quello della scheda del corso
     (campo «Ingresso»), non una frase scritta qui. */
  const entries = [
    ...new Map(
      schedule
        .map((slot) => (typeof slot.disciplina === 'object' ? slot.disciplina : null))
        .filter((c): c is Corsi => Boolean(c?.ingresso))
        .map((c) => [c.id, c]),
    ).values(),
  ]
  const teacherNames = teachers.map((t) => fullName(t)).filter((n): n is string => Boolean(n))

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

      {/* ---------- apertura: il nome del luogo e la lastra dei dati ---------- */}
      <section className="a-open a-open--center" aria-labelledby="center-title">
        <div className="container a-open__grid">
          <div className="a-open__words">
            <Link className="breadcrumb" href="/centri">
              Torna ai centri
            </Link>
            <p className="eyebrow">Centro tecnico AKM Italia</p>
            <h1 className="display a-display" id="center-title">
              {place}
            </h1>
            {gym ? <p className="a-open__gym">{gym}</p> : null}
            {/* Un centro non attivo resta pubblicato e la sua scheda si apre
                lo stesso: lo dichiara a parole (Regola dell'Etichetta). */}
            {center.attivo ? (
              <p className="status">Attivo in questa stagione</p>
            ) : (
              <p className="text">
                Questo centro non è attivo in questa stagione: gli orari qui accanto sono quelli
                dell’ultima e non sono in corso. Scrivici e ti diciamo qual è il centro più vicino
                aperto.
              </p>
            )}
          </div>

          <div className="a-slab a-slab--center">
            <div className="a-slab__block">
              <h2 className="a-slab__label">Dove</h2>
              <p className="a-slab__address">
                {center.indirizzo?.via ? (
                  <>
                    {center.indirizzo.via}
                    <br />
                  </>
                ) : null}
                {[center.indirizzo?.cap, center.indirizzo?.citta].filter(Boolean).join(' ')}
                {center.indirizzo?.provincia ? ` (${center.indirizzo.provincia})` : ''}
              </p>
              {center.mapsUrl ? (
                <p>
                  <a
                    className="a-slab__maps"
                    href={center.mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Apri in Maps
                  </a>
                </p>
              ) : null}
            </div>

            <div className="a-slab__block">
              <h2 className="a-slab__label">
                {center.attivo ? 'Quando' : 'Quando, nell’ultima stagione'}
              </h2>
              {days.length > 0 ? (
                <div className="a-days">
                  {days.map((d) => (
                    <div key={d.day} className="a-day">
                      <p className="a-day__name">{d.label}</p>
                      <ul className="a-day__slots">
                        {d.slots.map((slot) => {
                          const course = typeof slot.disciplina === 'object' ? slot.disciplina : null
                          const who = (slot.docenti ?? [])
                            .map(fullName)
                            .filter((n): n is string => Boolean(n))
                          return (
                            <li key={slot.id} className="a-slot">
                              <span className="a-slot__time">
                                {slot.oraInizio}-{slot.oraFine}
                              </span>
                              <span className="a-slot__what">
                                {course ? (
                                  <Link href={`/corsi/${course.slug}`}>{course.nome}</Link>
                                ) : null}
                                {slot.note ? ` · ${slot.note}` : ''}
                              </span>
                              {who.length > 0 ? (
                                <span className="a-slot__who">Con {joinNames(who)}</span>
                              ) : null}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="detail">Orari in aggiornamento per la stagione.</p>
              )}
            </div>

            <p className="a-slab__action">
              {/* Secondario, non rosso: nella prima schermata il rosso resta
                  uno, quello della barra (audit antislop 001, voce 24). Il
                  rosso della scheda e' l'invio del modulo, qui sotto. */}
              <a className="button button--secondary" href="#richiesta">
                Scrivi al centro
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- la persona che ti accoglie ---------- */}
      {teachers.length > 0 ? (
        <section className="section section--light a-host" aria-labelledby="host-title">
          <div className="container a-host__grid">
            <header className="a-head">
              <h2 className="a-title" id="host-title">
                Chi ti accoglie a {place}
              </h2>
              {entries.length > 0 ? (
                <dl className="a-host__entries">
                  {entries.map((c) => (
                    <div key={c.id}>
                      <dt>{c.nome}</dt>
                      <dd>{c.ingresso}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </header>
            <div className="a-host__people">
              {teachers.map((t) => (
                <article key={t.id} className="a-person a-person--light">
                  <h3 className="a-person__name">{t.nome}</h3>
                  {t.ruolo ? <p className="a-person__role">{t.ruolo}</p> : null}
                  {t.credenziali?.length ? (
                    <ul className="a-person__creds">
                      {t.credenziali.map((c) => (
                        <li key={c.id ?? c.voce}>{c.voce}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
              <p>
                <Link className="breadcrumb" href="/istruttori">
                  L’albo degli istruttori
                </Link>
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------- come arrivarci ---------- */}
      <section className="section section--grey a-reach" aria-labelledby="reach-title">
        <div className="container a-reach__grid">
          <div className="a-reach__words">
            <h2 className="a-title" id="reach-title">
              Come arrivare a {place}
            </h2>
            <p className="a-reach__address">
              {center.palestra ? (
                <>
                  <strong>{center.palestra}</strong>
                  <br />
                </>
              ) : null}
              {readableAddress(center.indirizzo)}
            </p>
            {center.descrizione ? <p className="text">{center.descrizione}</p> : null}
            {center.mapsUrl ? (
              <p>
                <a
                  className="a-slab__maps"
                  href={center.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Apri in Maps
                </a>
              </p>
            ) : null}
            {/* Slot dichiarato (docs/adr/0012): il posto per la foto
                dell'ingresso resta scritto finche' non arriva quella vera. */}
            <Figure
              slot={center.foto}
              label="Foto del centro in arrivo"
              format="wide"
              measure="media"
              sizes="(min-width: 900px) 30vw, 100vw"
              className="a-reach__photo"
            />
          </div>
          {points.length > 0 ? (
            <div className="a-reach__map">
              <CenterMap points={points} etichetta={`Dove si trova ${center.nome}`} />
            </div>
          ) : null}
        </div>
      </section>

      {events.docs.length > 0 ? (
        <section className="section section--light a-events" aria-labelledby="events-title">
          <div className="container">
            <h2 className="a-title" id="events-title">
              Prossimi eventi a {place}
            </h2>
            <EventAgenda events={events.docs} showPlace={false} />
            <p>
              <Link className="breadcrumb" href="/eventi">
                Tutto il calendario
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      {/* ---------- il modulo, con il centro gia' scelto ---------- */}
      <section
        className="section section--light a-request"
        id="richiesta"
        aria-labelledby="request-title"
      >
        <div className="container a-request__grid">
          <header className="a-head">
            <span className="rule" aria-hidden="true" />
            <h2 className="a-title" id="request-title">
              {center.attivo ? `Scrivi al centro di ${place}` : 'Scrivici'}
            </h2>
            <p className="text">
              {center.attivo
                ? `Il centro è già scelto nel modulo. Ti risponde chi insegna qui${
                    teacherNames.length > 0 ? `: ${joinNames(teacherNames)}` : ''
                  }.`
                : 'Scegli un centro attivo nel modulo: ti risponde chi insegna lì.'}
            </p>
            <p className="detail">AKM non pubblica telefono né email per centro: il contatto passa da qui.</p>
          </header>
          <RequestForm
            sedi={form.centers}
            corsi={form.courses}
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
