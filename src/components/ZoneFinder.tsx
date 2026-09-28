'use client'

import Link from 'next/link'
import React, { useId, useState } from 'react'

/**
 * «Dove abiti?» (prototipo D). Le zone di riferimento dei centri diventano uno
 * stradario: scrivi il quartiere o il comune e leggi la sera, la sala e il
 * docente che ti servono. I dati arrivano gia' pronti dal server; qui c'e' solo
 * il filtro. Senza JavaScript resta l'indice completo che la pagina stampa
 * sotto, dentro un <details>.
 */

export type ZoneCenter = {
  slug: string
  center: string
  host: string | null
  evenings: string[]
}

export type Zone = { zone: string; centers: ZoneCenter[] }

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export function ZoneFinder({ zones, examples }: { zones: Zone[]; examples: string[] }) {
  const [query, setQuery] = useState('')
  const id = useId()
  const q = fold(query)
  const found = q.length >= 2 ? zones.filter((z) => fold(z.zone).includes(q)).slice(0, 6) : []

  return (
    <div className="zf">
      <label className="zf__label" htmlFor={`${id}-q`}>
        Il tuo comune o quartiere
      </label>
      <input
        id={`${id}-q`}
        className="zf__input"
        type="search"
        autoComplete="address-level2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-describedby={`${id}-hint`}
      />
      <p className="zf__hint detail" id={`${id}-hint`}>
        Per esempio{' '}
        {examples.map((ex, i) => (
          <React.Fragment key={ex}>
            <button type="button" className="zf__example" onClick={() => setQuery(ex)}>
              {ex}
            </button>
            {i < examples.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </p>

      <div aria-live="polite">
        {q.length >= 2 && found.length === 0 ? (
          <p className="text zf__none">
            «{query.trim()}» non è fra le zone scritte nelle schede dei centri. Guarda l’elenco
            dei centri, o scrivici: ti diciamo qual è la sala più comoda.
          </p>
        ) : null}
        {found.length > 0 ? (
          <ul className="zf__results">
            {found.map((z) => (
              <li className="zf__result" key={z.zone}>
                <p className="zf__zone">{z.zone}</p>
                <ul className="zf__centers">
                  {z.centers.map((c) => (
                    <li key={c.slug}>
                      <Link className="zf__center" href={`/centri/${c.slug}`}>
                        <span className="zf__evening">{c.evenings.join(' · ')}</span>
                        <span className="zf__name">{c.center}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
