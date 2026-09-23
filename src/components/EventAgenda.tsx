import Link from 'next/link'
import React from 'react'

import type { Eventi } from '@/payload-types'

import { shortDate, readableSlot } from './calendar'
import { eventPlace, typeLabel } from './data'

/**
 * Una riga per evento: data, orario, titolo, tipo e dove. E' la vista che
 * legge chi arriva da telefono, e quella che un centro mostra sotto gli orari.
 * Il tipo e il luogo sono scritti, non colorati (docs/adr/0005).
 *
 * Un mese passato si sfoglia come ogni altro, e le sue righe dicono di essere
 * passate: scritto, in coda al tipo, non con una tinta o un'opacita'.
 */
export function EventAgenda({
  events,
  showPlace = true,
}: {
  events: Eventi[]
  /** Nella scheda di un centro il luogo e' il centro stesso: non si ripete. */
  showPlace?: boolean
}) {
  return (
    <ol className="agenda">
      {events.map((event) => {
        const place = eventPlace(event)
        const slot = readableSlot(event.dataInizio, event.dataFine)
        const ended = new Date(event.dataFine || event.dataInizio).getTime() < Date.now()

        return (
          <li className="agenda__row" key={event.id}>
            <time className="agenda__date" dateTime={event.dataInizio}>
              {shortDate(event.dataInizio)}
            </time>
            <span className="agenda__time">{slot}</span>
            <span>
              <Link className="agenda__title" href={`/eventi/${event.slug}`}>
                {event.titolo}
              </Link>
              <span className="agenda__meta">
                {typeLabel(event.tipo)}
                {showPlace && place ? ` · ${place}` : ''}
                {ended ? ' · Concluso' : ''}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
