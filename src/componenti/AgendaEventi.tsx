import Link from 'next/link'
import React from 'react'

import type { Eventi } from '@/payload-types'

import { dataBreve, orarioLeggibile } from './calendario'
import { doveEvento, etichettaTipo } from './dati'

/**
 * Una riga per evento: data, orario, titolo, tipo e dove. E' la vista che
 * legge chi arriva da telefono, e quella che un centro mostra sotto gli orari.
 * Il tipo e il luogo sono scritti, non colorati (docs/adr/0005).
 *
 * Un mese passato si sfoglia come ogni altro, e le sue righe dicono di essere
 * passate: scritto, in coda al tipo, non con una tinta o un'opacita'.
 */
export function AgendaEventi({
  eventi,
  mostraLuogo = true,
}: {
  eventi: Eventi[]
  /** Nella scheda di un centro il luogo e' il centro stesso: non si ripete. */
  mostraLuogo?: boolean
}) {
  return (
    <ol className="agenda">
      {eventi.map((evento) => {
        const dove = doveEvento(evento)
        const orario = orarioLeggibile(evento.dataInizio, evento.dataFine)
        const concluso = new Date(evento.dataFine || evento.dataInizio).getTime() < Date.now()

        return (
          <li className="agenda__row" key={evento.id}>
            <time className="agenda__date" dateTime={evento.dataInizio}>
              {dataBreve(evento.dataInizio)}
            </time>
            <span className="agenda__time">{orario}</span>
            <span>
              <Link className="agenda__title" href={`/eventi/${evento.slug}`}>
                {evento.titolo}
              </Link>
              <span className="agenda__meta">
                {etichettaTipo(evento.tipo)}
                {mostraLuogo && dove ? ` · ${dove}` : ''}
                {concluso ? ' · Concluso' : ''}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
