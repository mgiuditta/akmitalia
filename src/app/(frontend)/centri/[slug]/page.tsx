import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { openPayload } from '@/components/payload'
import { EventAgenda } from '@/components/EventAgenda'
import { readableAddress, jsonLd, published, siteUrl } from '@/components/data'
import {
  DAY_NAMES,
  WEEK,
  dateInDays,
  daysUntil,
  descriptionWithoutZones,
  lessonsOf,
  minutesOf,
  placeName,
  referenceZones,
  romeNow,
  teacherRounds,
  type CenterLike,
  type DayKey,
  type Lesson,
} from '@/components/evenings'
import { Figure } from '@/components/Figure'
import { RequestForm, type FormTexts } from '@/components/RequestForm'
import { extraItems, type FormOptions } from '../../contatti/validation'
import { pageMetadata } from '@/components/seo'

/**
 * Scheda di un centro, prototipo D: «Ospiti di sera». E' la locandina della
 * serata: chi ospita, il giorno in grande, orari e docente, la prossima data
 * vera, da dove ci si arriva, «Apri in Maps», e il modulo gia' su questo centro
 * nella stessa pagina (la scelta e il perche' stanno nel NOTE.md del prototipo).
 */

export const revalidate = 60

/* I giorni di schema.org sono in inglese: la mappa serve solo al JSON-LD. */
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
  const [events, active, contacts, courses] = await Promise.all([
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
    payload.find({
      collection: 'sedi',
      depth: 1,
      limit: 200,
      sort: 'indirizzo.citta',
      where: { and: [{ attivo: { equals: true } }, published] },
    }),
    payload.findGlobal({ slug: 'contatti', depth: 1 }),
    payload.find({
      collection: 'corsi',
      depth: 0,
      limit: 50,
      sort: 'ordine',
      select: { nome: true, slug: true },
      where: published,
    }),
  ])

  const place = placeName(center)
  const lessons = lessonsOf(center as unknown as CenterLike)
  const today = romeNow()

  /* Le lezioni raggruppate per sera: il giorno si scrive una volta, in grande. */
  const byDay = WEEK.map((day) => ({
    day,
    lessons: lessons
      .filter((l) => l.day === day)
      .sort((a, b) => minutesOf(a.start) - minutesOf(b.start)),
  })).filter((d) => d.lessons.length > 0)

  /* La prossima lezione vera, per un centro attivo: «giovedì 1 ottobre, 20:30». */
  const next: (Lesson & { offset: number }) | null = center.attivo
    ? (lessons
        .map((l) => ({ ...l, offset: daysUntil(l.day as DayKey, minutesOf(l.end), today) }))
        .sort((a, b) => a.offset - b.offset || minutesOf(a.start) - minutesOf(b.start))[0] ??
      null)
    : null

  const zones = referenceZones(center.descrizione)
  const note = zones.length > 0 ? descriptionWithoutZones(center.descrizione) : center.descrizione

  /* Chi insegna qui, e in quali altre sale porta la serata. */
  const rounds = teacherRounds(active.docs as unknown as CenterLike[])
  const teachers = (center.istruttori ?? [])
    .filter((i) => typeof i === 'object' && i !== null)
    .map((i) => {
      const round = rounds.find((r) => r.id === i.id)
      const elsewhere = round
        ? [
            ...new Map(
              round.lessons
                .filter((l) => l.centerId !== center.id)
                .map((l) => [l.centerId, { slug: l.slug, town: l.town }]),
            ).values(),
          ]
        : []
      return { id: i.id, name: i.nome, role: i.ruolo, slug: i.slug, elsewhere }
    })

  /* Il modulo, con gli stessi testi e interruttori di /contatti. */
  const form = contacts.modulo
  const choice = typeof form?.paginaPrivacy === 'object' ? form.paginaPrivacy : null
  const privacy =
    choice ??
    (
      await payload.find({
        collection: 'pagine',
        depth: 0,
        limit: 1,
        select: { path: true },
        where: { and: [{ path: { equals: '/privacy' } }, published] },
      })
    ).docs[0] ??
    null
  const formTexts: FormTexts = {
    nota: form?.nota || 'Tutti i campi sono obbligatori, tranne percorso e messaggio.',
    etichettaConsenso:
      form?.etichettaConsenso ||
      'Autorizzo il trattamento dei dati personali secondo il Regolamento UE 2016/679, per essere ricontattato da AKM Italia.',
    etichettaInvio: form?.etichettaInvio || 'Invia la richiesta',
    privacy: privacy?.path ? { etichetta: 'Leggi l’informativa', href: privacy.path } : null,
  }
  const options: FormOptions = {
    dataNascita: form?.chiediDataNascita !== false,
    pathway: form?.chiediPercorso !== false,
    messaggio: form?.chiediMessaggio !== false,
    altreVoci: extraItems(form),
  }

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
    openingHoursSpecification: (center.orari ?? []).flatMap((slot) =>
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

      {/* La locandina: chi ospita, dove, e la sera in grande. Tutto leggibile
          senza un click, gia' nella prima schermata. */}
      <section className="section section--black ev-poster">
        <div className="container">
          <Link className="breadcrumb" href="/centri">
            Torna ai centri
          </Link>
          <div className="ev-poster__grid">
            <div>
              <p className="eyebrow ev-poster__host">
                {center.palestra ? `Centro tecnico AKM, ospite di ${center.palestra}` : 'Centro tecnico AKM'}
              </p>
              <h1 className="ev-poster__title">
                <span className="display ev-poster__place">{place}</span>
                {center.palestra ? (
                  <span className="ev-poster__room">{center.palestra}</span>
                ) : null}
              </h1>
              {center.attivo ? (
                <p className="status">Attivo in questa stagione</p>
              ) : (
                <p className="text detail">
                  Questo centro non è attivo in questa stagione: gli orari qui sotto sono quelli
                  dell’ultima e non sono in corso. Scrivici e ti diciamo qual è il centro più
                  vicino aperto.
                </p>
              )}

              {byDay.length > 0 ? (
                <div className="ev-nights">
                  {byDay.map((d) => (
                    <div className="ev-night" key={d.day}>
                      <p className="display ev-night__day">{DAY_NAMES[d.day]}</p>
                      <ul className="ev-night__list">
                        {d.lessons.map((l) => (
                          <li className="ev-night__row" key={`${l.day}-${l.start}`}>
                            <span className="ev-night__time">
                              {l.start}-{l.end}
                            </span>
                            <span className="ev-night__what">
                              <span className="ev-night__course">{l.course}</span>
                              {l.note ? <span className="detail">{l.note}</span> : null}
                            </span>
                            {l.teachers ? (
                              <span className="ev-night__teacher">con {l.teachers}</span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text detail">Orari in aggiornamento per la stagione.</p>
              )}

              {next ? (
                <p className="ev-poster__next">
                  <span className="ev-poster__next-label">La prossima sera</span>{' '}
                  {next.offset === 0 ? 'è oggi, ' : next.offset === 1 ? 'è domani, ' : 'è '}
                  {dateInDays(next.offset, today.now)}
                </p>
              ) : null}
            </div>

            <aside className="ev-address" aria-label="Dove si trova">
              <p className="ev-address__label">Indirizzo</p>
              <p className="ev-address__street">
                {center.palestra ? (
                  <>
                    {center.palestra}
                    <br />
                  </>
                ) : null}
                {readableAddress(center.indirizzo)}
              </p>
              {note ? <p className="detail ev-address__note">{note}</p> : null}
              <p className="ev-address__actions">
                {center.mapsUrl ? (
                  <a
                    className="button button--secondary ev-address__maps"
                    href={center.mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Apri in Maps
                  </a>
                ) : null}
                <a className="button button--secondary" href="#richiesta">
                  Scrivi a questo centro
                </a>
              </p>
              {zones.length > 0 ? (
                <div className="ev-address__zones">
                  <p className="ev-address__label">Ci arrivano anche da</p>
                  <ul className="ev-zones">
                    {zones.map((z) => (
                      <li key={z}>{z}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      {/* Chi insegna, e dove altro porta la serata; poi la sala che ospita. */}
      <section className="section section--light ev-host">
        <div className="container ev-host__grid">
          <div>
            {teachers.length > 0 ? (
              <>
                <h2 className="display display--sm">Chi insegna qui</h2>
                <ul className="ev-teachers">
                  {teachers.map((t) => (
                    <li className="ev-teacher" key={t.id}>
                      <p className="ev-teacher__name">{t.name}</p>
                      {t.role ? <p className="detail">{t.role}</p> : null}
                      {t.elsewhere.length > 0 ? (
                        <p className="detail ev-teacher__also">
                          Porta la serata anche a{' '}
                          {t.elsewhere.map((e, i) => (
                            <React.Fragment key={e.slug}>
                              {i > 0 ? (i === t.elsewhere.length - 1 ? ' e ' : ', ') : ''}
                              <Link href={`/centri/${e.slug}`}>{e.town}</Link>
                            </React.Fragment>
                          ))}
                          .
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {events.docs.length > 0 ? (
              <div className="ev-host__events">
                <h2 className="display display--sm">Prossimi eventi qui</h2>
                <EventAgenda events={events.docs} showPlace={false} />
              </div>
            ) : null}
          </div>

          {/* ADR-0012: lo slot si dichiara. Con la foto vera della sala, la
              mostra; senza, il segnaposto dice che cosa arrivera'. */}
          <Figure
            slot={center.foto}
            label="Foto della sala in arrivo"
            format="wide"
            sizes="(min-width: 900px) 45vw, 100vw"
            className="ev-host__photo"
          />
        </div>
      </section>

      {/* Il modulo nella scheda, con questo centro gia' scelto. Per un centro
          non attivo il centro non e' fra le scelte: la richiesta parte da
          /contatti, senza sede. */}
      <section className="section section--grey ev-request" id="richiesta" aria-labelledby="req-title">
        <div className="container ev-request__grid">
          <div className="ev-request__head">
            <span className="rule" aria-hidden="true" />
            <h2 className="display display--md" id="req-title">
              {center.attivo ? `Scrivi a ${place}` : 'Scrivici'}
            </h2>
            <p className="text">
              La prima lezione si concorda con il docente del centro. Non chiede di essere allenati
              per cominciare.
            </p>
            <p className="text detail">
              AKM non pubblica un telefono per ogni centro: la richiesta arriva a chi tiene le
              lezioni qui, e ti risponde quella persona.
            </p>
          </div>
          <div>
            {center.attivo ? (
              <RequestForm
                sedi={active.docs.map((s) => ({
                  id: s.id,
                  nome: s.nome,
                  citta: s.indirizzo?.citta ?? '',
                  indirizzo: readableAddress(s.indirizzo),
                  palestra: s.palestra ?? null,
                  mapsUrl: s.mapsUrl ?? null,
                }))}
                corsi={courses.docs.map((c) => ({ id: c.id, nome: c.nome }))}
                texts={formTexts}
                options={options}
                initialCenter={center.id}
                turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || null}
              />
            ) : (
              <p>
                <Link className="button button--primary" href="/contatti">
                  Richiedi informazioni
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
