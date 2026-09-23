import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { openPayload } from '@/components/payload'
import { EventAgenda } from '@/components/EventAgenda'
import {
  dayKey,
  monthKey,
  eventDays,
  grid,
  monthRange,
  currentMonth,
  monthFromParam,
  previousMonth,
  nextMonth,
  monthName,
  readableSlot,
} from '@/components/calendar'
import { eventPlace, published } from '@/components/data'
import { Figure } from '@/components/Figure'
import { pageMetadata } from '@/components/seo'

/**
 * Il calendario: una griglia del mese resa dal server, con `?mese=2026-09`
 * nella URL e niente JavaScript (docs/adr/0014). Sotto la griglia l'agenda del
 * mese, che su telefono e' la vista vera. Niente viste giorno o lista, niente
 * ricerca, niente export: la scheda evento e l'agenda coprono i casi reali.
 */

export const revalidate = 60

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

export const metadata: Metadata = pageMetadata({
  titolo: 'Eventi',
  descrizione:
    'Stage, esami, presentazioni e feste di AKM Italia, mese per mese: data, orario e centro di ogni evento della stagione.',
  path: '/eventi',
})

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const { month: param } = await searchParams
  const month = monthFromParam(param)
  const { start, end } = monthRange(month)
  const payload = await openPayload()

  const [events, settings] = await Promise.all([
    payload.find({
      collection: 'eventi',
      depth: 1,
      limit: 200,
      sort: 'dataInizio',
      where: {
        and: [
          published,
          { dataInizio: { less_than: end.toISOString() } },
          {
            or: [
              { dataFine: { greater_than_equal: start.toISOString() } },
              { dataInizio: { greater_than_equal: start.toISOString() } },
            ],
          },
        ],
      },
    }),
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
  ])

  /* Un mese vuoto non lascia il visitatore a sfogliare a vuoto: gli dice
     qual e' il prossimo mese con qualcosa dentro. */
  const next =
    events.docs.length === 0
      ? await payload.find({
          collection: 'eventi',
          depth: 0,
          limit: 1,
          sort: 'dataInizio',
          select: { dataInizio: true },
          where: { and: [published, { dataInizio: { greater_than_equal: end.toISOString() } }] },
        })
      : null
  const upcomingMonth = next?.docs[0]
    ? monthFromParam(dayKey(next.docs[0].dataInizio).slice(0, 7))
    : null

  const byDay = new Map<string, typeof events.docs>()
  for (const event of events.docs) {
    for (const day of eventDays(event.dataInizio, event.dataFine)) {
      byDay.set(day, [...(byDay.get(day) ?? []), event])
    }
  }

  const today = dayKey(new Date())
  const thisMonth = monthKey(month)
  const weeks = grid(month)

  return (
    <>
      <section className="section section--black masthead">
        <div className="container masthead__content">
          <h1 className="display display--lg">Eventi</h1>
          <p className="text masthead__text">
            Stage, esami, presentazioni e feste della stagione, mese per mese. Ogni evento ha
            data, orario e centro: gli orari settimanali stanno nella scheda di ogni centro.
          </p>
        </div>
      </section>

      <Figure
        slot={settings?.fotoPagine?.eventi}
        label="Foto della pagina Eventi"
        format="band"
        measure="grande"
        sizes="100vw"
        priority
      />

      <section className="section section--light" aria-labelledby="month-title">
        <div className="container">
          <nav className="calendar__months" aria-label="Cambia mese">
            <Link className="calendar__jump" href={`/eventi?mese=${monthKey(previousMonth(month))}`}>
              Mese precedente
            </Link>
            <h2 className="display display--sm" id="month-title">
              {monthName(month)}
            </h2>
            <Link
              className="calendar__jump calendar__jump--next"
              href={`/eventi?mese=${monthKey(nextMonth(month))}`}
            >
              Mese successivo
            </Link>
          </nav>

          {/* Il mese vuoto lo dice prima della griglia, non dopo cinque righe di
              celle vuote: sotto la piega il messaggio e il rimando al prossimo
              mese non li vedeva nessuno. */}
          {events.docs.length === 0 ? (
            <p className="text empty empty--month">
              Nessun evento a {monthName(month)}.{' '}
              {upcomingMonth ? (
                <Link href={`/eventi?mese=${monthKey(upcomingMonth)}`}>
                  Il prossimo è a {monthName(upcomingMonth)}.
                </Link>
              ) : monthKey(currentMonth()) !== thisMonth ? (
                <Link href="/eventi">Torna al mese corrente.</Link>
              ) : null}
            </p>
          ) : null}

          <table className="calendar">
            <caption>Calendario di {monthName(month)}</caption>
            <thead>
              <tr>
                {DAYS.map((g) => (
                  <th key={g} scope="col">
                    {g}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={week[0]}>
                  {week.map((day) => {
                    const dayEvents = byDay.get(day) ?? []
                    const classes = [
                      'calendar__day',
                      day.slice(0, 7) !== thisMonth ? 'calendar__day--outside' : '',
                      day === today ? 'calendar__day--today' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                    return (
                      <td className={classes} key={day}>
                        <span className="calendar__number">{Number(day.slice(8))}</span>
                        {dayEvents.length > 0 ? (
                          <>
                            <div className="calendar__events">
                              {dayEvents.map((event) => {
                                const time = readableSlot(event.dataInizio, event.dataFine)
                                return (
                                  <Link
                                    className="calendar__event"
                                    href={`/eventi/${event.slug}`}
                                    key={event.id}
                                  >
                                    {/* In cella il posto viene prima del titolo: a settembre
                                        dieci celle dicono «Presentazione», e a distinguerle
                                        e' il centro. L'ora distingue le due dello stesso
                                        centro nello stesso giorno, che si leggevano uguali. */}
                                    <b className="calendar__place">{eventPlace(event)}</b>
                                    {time ? (
                                      <span className="calendar__time">{time} </span>
                                    ) : null}
                                    {event.titolo}
                                  </Link>
                                )
                              })}
                            </div>
                            {/* Sotto i 768px al posto dei titoli resta il quadrato di
                                docs/adr/0014: un segno, non un link da 6px moltiplicato
                                per gli eventi del giorno. Quello che c'e' lo dice
                                l'agenda qui sotto, che su telefono e' la vista vera. */}
                            <span className="calendar__mark" aria-hidden="true" />
                          </>
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {events.docs.length > 0 ? <EventAgenda events={events.docs} /> : null}
        </div>
      </section>
    </>
  )
}
