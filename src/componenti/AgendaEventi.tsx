import Link from 'next/link'
import React from 'react'

import type { Eventi } from '@/payload-types'

import { dataBreve, orarioLeggibile } from './calendario'
import { doveEvento, etichettaTipo } from './dati'

/**
 * Una riga per evento: data, orario, titolo, tipo e dove. E' la vista che
 * legge chi arriva da telefono, e quella che un centro mostra sotto gli orari.
 * Il tipo e il luogo sono scritti, non colorati (docs/adr/0005).
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

        return (
          <li className="agenda__riga" key={evento.id}>
            <time className="agenda__data" dateTime={evento.dataInizio}>
              {dataBreve(evento.dataInizio)}
            </time>
            <span className="agenda__ora">{orario}</span>
            <span>
              <Link className="agenda__titolo" href={`/eventi/${evento.slug}`}>
                {evento.titolo}
              </Link>
              <span className="agenda__meta">
                {etichettaTipo(evento.tipo)}
                {mostraLuogo && dove ? ` · ${dove}` : ''}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
