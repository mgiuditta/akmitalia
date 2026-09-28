import Link from 'next/link'
import React from 'react'

import { placeLabels, project, type SignCenter } from './signage'

/**
 * Prototipo C, «La segnaletica» (#66): la rete dei centri come uno schema di
 * trasporti. Punti quadrati, il nome scritto accanto a ognuno, nessuna tile.
 *
 * Non e' Leaflet e non lo sostituisce: e' uno schema proiettato dalle
 * coordinate del DB, che si legge anche senza rete, pesa zero e non chiede
 * niente a nessun server di mappe. Dove serve la strada vera - la scheda di un
 * centro - resta CenterMap con le sue tile, e resta «Apri in Maps».
 *
 * Ogni punto e' un link alla scheda del centro: si raggiunge da tastiera, ha
 * un bersaglio da 44px e il nome del centro come nome accessibile. Il verde
 * dice presenza e sta solo accanto a un nome scritto (docs/adr/0005): dove il
 * nome non si stampa - a 390px, dove la mappa e' un'anteprima - il quadrato
 * torna bianco, e il verde resta al solo centro che porta il nome.
 *
 * Senza stato e senza hook: la usano sia la home, dentro la rete client che
 * conosce la posizione, sia la scheda del centro, che e' un componente server.
 */

/* Il Duomo e' il riferimento che chiunque a Milano sa collocare: un punto
   geografico, non un centro, e per questo cavo e senza link. */
const DUOMO = { lat: 45.4642, lng: 9.19 }
const DUOMO_NAME = 'Milano, Duomo'

export function NetworkMap({
  centers,
  label,
  focus = null,
  nearest = null,
  distances,
  me = null,
  compact = false,
  nominalWidth = 720,
}: {
  centers: SignCenter[]
  label: string
  /** Il centro della scheda: segno pieno, gli altri fanno da contesto. */
  focus?: number | null
  /** Il centro piu' vicino a chi ha dato la posizione. */
  nearest?: number | null
  distances?: Record<number, string>
  me?: { lat: number; lng: number } | null
  /** Anteprima: senza nomi se non quello che conta. */
  compact?: boolean
  /**
   * La larghezza in pixel a cui lo schema si legge di solito: i nomi restano a
   * 14px, quindi in unita' del disegno pesano di piu' su uno schema stretto, e
   * il calcolo delle posizioni deve saperlo.
   */
  nominalWidth?: number
}) {
  const located = centers.filter(
    (c): c is SignCenter & { lat: number; lng: number } =>
      typeof c.lat === 'number' && typeof c.lng === 'number',
  )
  if (located.length === 0) return null

  const p = project(located)
  const items = located.map((c) => {
    const lead = c.id === focus || c.id === nearest
    const suffix = c.id === nearest && distances?.[c.id] ? ` · ${distances[c.id]}` : ''
    return { id: c.id, x: p.x(c.lng), y: p.y(c.lat), text: `${c.sign}${suffix}`, lead }
  })
  const duomo = { x: p.x(DUOMO.lng), y: p.y(DUOMO.lat) }
  const unit = 1000 / nominalWidth
  // Il Duomo entra nel calcolo come un nome qualsiasi, cosi' nessun centro lo copre.
  const placement = placeLabels(
    [...items, { id: -1, x: duomo.x, y: duomo.y, text: DUOMO_NAME }],
    { charWidth: 8.2 * unit, height: 24 * unit, gap: 14 * unit },
  )

  const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`

  // «Sei qui» si disegna solo se cade dentro lo schema: fuori, la distanza
  // scritta sul cartello basta e un punto sul bordo mentirebbe.
  const meX = me ? p.x(me.lng) : null
  const meY = me ? p.y(me.lat) : null
  const meInside =
    meX !== null && meY !== null && meX >= 0 && meX <= p.width && meY >= 0 && meY <= p.height
  const target = items.find((i) => i.id === nearest)

  const scaleKm = 5

  /* Sull'anteprima stretta il nome va dal lato con piu' spazio, e mai sopra
     «Sei qui»: il centro piu' vicino si scrive dalla parte opposta a te. */
  const narrowSide = (item: { id: number; x: number }) => {
    if (item.id === nearest && meInside && meX !== null) return meX < item.x ? 'right' : 'left'
    return item.x > p.width / 2 ? 'left' : 'right'
  }

  return (
    <nav
      className={`net${compact ? ' net--compact' : ''}${focus !== null ? ' net--focus' : ''}`}
      aria-label={label}
      style={{ aspectRatio: `${p.width} / ${p.height}` }}
    >
      {/* L'unica linea dello schema: da te al centro piu' vicino, in linea
          d'aria. E' bianca come ogni linea di questa segnaletica. */}
      {meInside && target ? (
        <svg
          className="net__lines"
          viewBox={`0 0 ${p.width} ${p.height}`}
          aria-hidden="true"
          focusable="false"
        >
          <line x1={meX!} y1={meY!} x2={target.x} y2={target.y} />
        </svg>
      ) : null}

      <span
        className={`net__landmark net__landmark--${placement.get(-1) ?? 'right'}`}
        style={{ left: pct(duomo.x, p.width), top: pct(duomo.y, p.height) }}
        aria-hidden="true"
      >
        <span className="net__landmark-name">{DUOMO_NAME}</span>
      </span>

      {meInside ? (
        <span
          className="net__me"
          style={{ left: pct(meX!, p.width), top: pct(meY!, p.height) }}
        >
          <span className="net__me-name">Sei qui</span>
        </span>
      ) : null}

      <ul className="net__points">
        {items.map((item) => {
          const center = located.find((c) => c.id === item.id)!
          const side = placement.get(item.id) ?? 'right'
          const state =
            item.id === focus ? ' net__mark--focus' : item.id === nearest ? ' net__mark--nearest' : ''
          return (
            <li
              key={item.id}
              className="net__point"
              style={{ left: pct(item.x, p.width), top: pct(item.y, p.height) }}
            >
              <Link
                className={`net__mark net__mark--${side} net__mark--narrow-${narrowSide(item)}${state}`}
                href={`/centri/${center.slug}`}
                aria-current={item.id === focus ? 'page' : undefined}
              >
                <span className="net__square" aria-hidden="true" />
                <span className={`net__name${item.lead ? ' net__name--lead' : ''}`}>
                  {item.text}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      <span
        className="net__scale"
        style={{ inlineSize: pct(scaleKm * p.unitsPerKm, p.width) }}
        aria-hidden="true"
      >
        <span className="net__scale-label">{scaleKm} km</span>
      </span>
    </nav>
  )
}
