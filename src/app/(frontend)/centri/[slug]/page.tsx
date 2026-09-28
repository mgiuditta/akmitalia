import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { openPayload } from '@/components/payload'
import { EventAgenda } from '@/components/EventAgenda'
import { CenterMap, type MapPoint } from '@/components/CenterMap'
import { readableAddress, readableDays, jsonLd, published, siteUrl } from '@/components/data'
import { Figure, urlMedia } from '@/components/Figure'
import { RequestForm } from '@/components/RequestForm'
import { pageMetadata } from '@/components/seo'
import { DAY_NAMES, buildWeek, lessonsLabel, placeName } from '@/components/board/week'
import { requestFormSetup } from '@/components/board/requestFormSetup'

/**
 * Scheda di un centro tecnico, direzione B «La bacheca della sala» (prototipo,
 * mappa #62, ticket #66). E' la conversione: l'orario e' il protagonista, e
 * indirizzo e docente si leggono nella prima schermata senza un click.
 *
 * Il modulo di richiesta sta in pagina, con questo centro gia' scelto, invece
 * del rimando a /contatti?sede=<slug>. La ragione: la scheda e' il punto in cui
 * la decisione e' gia' presa (sera, ora, docente), e il successo che PRODUCT.md
 * misura e' proprio la richiesta con la sede selezionata. Un passaggio di pagina
 * in piu', dal telefono e di sera, e' il punto in cui si perde. Il centro resta
 * cambiabile nella select, e il modulo e' lo stesso <RequestForm> di /contatti:
 * stessa validazione, stessa Server Action, stessi testi dal global Contatti.
 * Un centro non attivo non e' fra le scelte del modulo: li' resta il rimando.
 */

export const revalidate = 60

const SCHEMA_DAYS: Record<string, string> = {
  lun: 'Monday',
  mar: 'Tuesday',
  mer: 'Wednesday',
  gio: 'Thursday',
  ven: 'Friday',
  sab: 'Saturday',
  dom: 'Sunday',
}

const QUALIFICATIONS: Record<string, string> = {
  istruttore: 'istruttore',
  trainer: 'trainer',
  maestro: 'maestro',
  'direttore-tecnico': 'direttore tecnico',
  presidente: 'presidente',
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

  const payload = await openPayload()
  const now = new Date().toISOString()
  const [events, form] = await Promise.all([
    payload.find({
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
    }),
    requestFormSetup(),
  ])

  const schedule = center.orari ?? []
  const days = buildWeek([center]).filter((d) => d.lessons.length > 0)
  const lessonCount = days.reduce((n, d) => n + d.lessons.length, 0)

  /* I docenti di questo centro: prima chi tiene le righe dell'orario, poi chi e'
     legato al centro senza una riga. Qualifica o ruolo accanto al nome. */
  const people = new Map<number, { nome: string; detail: string }>()
  const addPerson = (p: unknown) => {
    if (typeof p !== 'object' || p === null) return
    const doc = p as { id: number; nome: string; ruolo?: string | null; qualifica?: string | null }
    if (people.has(doc.id)) return
    people.set(doc.id, {
      nome: doc.nome,
      detail: doc.ruolo || (doc.qualifica ? QUALIFICATIONS[doc.qualifica] : '') || '',
    })
  }
  schedule.forEach((slot) => (slot.docenti ?? []).forEach(addPerson))
  ;(center.istruttori ?? []).forEach(addPerson)
  const teachers = [...people.values()]

  /* La prima lezione in questo centro, corso per corso: il testo e' il campo
     «Ingresso» del corso, che dice come si comincia. */
  const courses = new Map<number, { nome: string; slug: string; ingresso: string }>()
  for (const slot of schedule) {
    const d = slot.disciplina
    if (typeof d === 'object' && d && d.ingresso && !courses.has(d.id)) {
      courses.set(d.id, { nome: d.nome, slug: d.slug ?? '', ingresso: d.ingresso })
    }
  }

  const allDays = [...new Set(schedule.flatMap((s) => s.giorni ?? []))]
  const place = placeName(center)
  const [, ...rest] = center.nome.split(' - ')
  const gym = rest.join(' - ') || center.palestra || ''
  const address = readableAddress(center.indirizzo)
  const inForm = center.attivo && form.centers.some((c) => c.id === center.id)

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(location) }} />

      {/* ---------- testata: chi, dove, quando, senza un click ---------- */}
      <section className="board board--white board-head" aria-labelledby="center-title">
        <div className="container board-head__grid">
          <div className="board-head__intro">
            <Link className="breadcrumb" href="/centri">
              Torna ai centri
            </Link>
            <h1 className="board-title board-title--page" id="center-title">
              <span className="board-center__place">{place}</span>
              {gym ? <span className="board-center__gym">{gym}</span> : null}
            </h1>
            {center.attivo ? (
              <p className="status">Attivo in questa stagione</p>
            ) : (
              <p className="board-lead">
                Questo centro non è attivo in questa stagione: l’orario qui sotto è quello
                dell’ultima e non è in corso. Scrivici e ti diciamo qual è il centro più vicino
                aperto.
              </p>
            )}
            {center.descrizione ? <p className="board-lead">{center.descrizione}</p> : null}
          </div>

          <dl className="board-facts">
            <div className="board-fact">
              <dt>Dove</dt>
              <dd>
                {center.palestra ? <span className="board-fact__strong">{center.palestra}</span> : null}
                <span>{address}</span>
                {center.mapsUrl ? (
                  <a
                    className="board-link"
                    href={center.mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Apri in Maps
                    <span className="board-sr"> (si apre in una nuova scheda)</span>
                  </a>
                ) : null}
              </dd>
            </div>
            {allDays.length > 0 ? (
              <div className="board-fact">
                <dt>Quando</dt>
                <dd>
                  <span className="board-fact__strong">{readableDays(allDays)}</span>
                  <span>
                    {lessonCount} {lessonsLabel(lessonCount)} a settimana
                  </span>
                </dd>
              </div>
            ) : null}
            {teachers.length > 0 ? (
              <div className="board-fact">
                <dt>{teachers.length === 1 ? 'Docente' : 'Docenti'}</dt>
                <dd>
                  {teachers.map((t) => (
                    <span key={t.nome}>
                      <span className="board-fact__strong">{t.nome}</span>
                      {t.detail ? `, ${t.detail}` : ''}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      {/* ---------- l'orario: il protagonista ---------- */}
      <section className="board board--grey" id="orario" aria-labelledby="schedule-title">
        <div className="container">
          <header className="board-section-head">
            <h2 className="board-title" id="schedule-title">
              Orario
            </h2>
            <p className="board-section-head__aside">
              {center.attivo
                ? 'Le lezioni sono settimanali, in giorno fisso, tutto l’anno.'
                : 'Programmazione dell’ultima stagione, non in corso.'}
            </p>
          </header>

          {days.length > 0 ? (
            <ol className="board-schedule">
              {days.map((day) => (
                <li className="board-schedule__day" key={day.key}>
                  <h3 className="board-schedule__title">
                    <span className="board-day__short board-day__short--xl" aria-hidden="true">
                      {DAY_NAMES[day.key].short}
                    </span>
                    <span className="board-day__long">{DAY_NAMES[day.key].long}</span>
                  </h3>
                  <ol className="board-schedule__lessons">
                    {day.lessons.map((lesson) => (
                      <li className="board-slot" key={lesson.key}>
                        <p className="board-slot__time">
                          <span className="board-slot__start">{lesson.start}</span>
                          <span className="board-slot__end">
                            fino alle{' '}
                            {lesson.end}
                          </span>
                        </p>
                        <div className="board-slot__body">
                          <p className="board-slot__course">
                            {lesson.course ? (
                              <Link href={`/corsi/${lesson.course.slug}`}>{lesson.course.name}</Link>
                            ) : null}
                          </p>
                          {lesson.note ? <p className="board-slot__note">{lesson.note}</p> : null}
                          {lesson.teachers.length > 0 ? (
                            <p className="board-slot__teacher">con {lesson.teachers.join(', ')}</p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          ) : (
            <p className="board-lead">Orari in aggiornamento per la stagione.</p>
          )}
        </div>
      </section>

      {/* ---------- il blocco nero: la prima lezione, qui ---------- */}
      {courses.size > 0 ? (
        <section className="board board--black" aria-labelledby="first-title">
          <div className="container">
            <header className="board-section-head">
              <h2 className="board-title" id="first-title">
                La prima lezione a {place}
              </h2>
            </header>
            <ol className="board-first board-first--center">
              {[...courses.values()].map((course) => (
                <li className="board-first__point" key={course.slug}>
                  <h3 className="board-first__title">{course.nome}</h3>
                  <p className="board-first__text">{course.ingresso}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {events.docs.length > 0 ? (
        <section className="board board--white" aria-labelledby="events-title">
          <div className="container">
            <header className="board-section-head">
              <h2 className="board-title" id="events-title">
                Prossimi eventi qui
              </h2>
              <p className="board-section-head__aside">
                <Link className="board-link board-link--inline" href="/eventi">
                  Tutto il calendario
                </Link>
              </p>
            </header>
            <EventAgenda events={events.docs} showPlace={false} />
          </div>
        </section>
      ) : null}

      {/* ---------- la richiesta, con il centro gia' scelto ---------- */}
      <section className="board board--white board-request" id="modulo" aria-labelledby="form-title">
        <div className="container board-request__grid">
          <div>
            <header className="board-request__head">
              <h2 className="board-title" id="form-title">
                Richiedi informazioni
              </h2>
              <p className="board-lead">
                {inForm
                  ? `Il centro è già scelto: la richiesta arriva a chi tiene le lezioni a ${place}.`
                  : 'Questo centro non è fra le scelte del modulo in questa stagione. Scrivici lo stesso: ti diciamo qual è il centro aperto più vicino.'}
              </p>
            </header>
            {inForm ? (
              <RequestForm
                sedi={form.centers}
                corsi={form.courses}
                texts={form.texts}
                options={form.options}
                initialCenter={center.id}
                turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || null}
              />
            ) : (
              <p className="board-actions">
                <Link className="button button--primary" href="/contatti">
                  Richiedi informazioni
                </Link>
              </p>
            )}
          </div>

          <aside className="board-request__aside" aria-labelledby="route-title">
            <h2 className="board-request__subtitle" id="route-title">
              Come arrivarci
            </h2>
            <p className="board-request__address">
              {center.palestra ? (
                <>
                  <strong>{center.palestra}</strong>
                  <br />
                </>
              ) : null}
              {address}
            </p>
            {center.mapsUrl ? (
              <p>
                <a className="board-link" href={center.mapsUrl} target="_blank" rel="noreferrer noopener">
                  Apri in Maps
                  <span className="board-sr"> (si apre in una nuova scheda)</span>
                </a>
              </p>
            ) : null}
            {points.length > 0 ? (
              <CenterMap points={points} etichetta={`Dove si trova ${center.nome}`} />
            ) : null}
            {/* La sala del centro: se il cliente l'ha caricata si vede, altrimenti
                lo slot si dichiara su carta, non su un riquadro nero, che in
                questa direzione e' riservato alla prima lezione. */}
            {urlMedia(center.foto) ? (
              <Figure slot={center.foto} label="Foto del centro" format="wide" sizes="(min-width: 900px) 35vw, 100vw" />
            ) : (
              <div className="board-photo" role="img" aria-label="Foto del centro: immagine non ancora caricata">
                <span>Foto del centro in arrivo</span>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
