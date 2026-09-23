'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Mappa dei centri. Leaflet puro, nessuna chiave API, nessun cookie: le tile
 * sono quelle standard di OpenStreetMap, portate a monocromo scuro da un filtro
 * CSS sul solo riquadro delle tile. E' lo stesso trattamento della fotografia
 * dell'eroe: l'immagine entra nel sistema come valore, non come colore.
 *
 * Le CARTO Dark Matter sarebbero state gia' scure ma oggi chiedono una chiave.
 *
 * Il CSS di Leaflet e' importato da styles.css e non da qui: importato dal
 * componente arriverebbe dopo il foglio del sito e vincerebbe sugli override a
 * parita' di specificita', ridando al popup il suo aspetto di serie.
 *
 * ponytail: niente react-leaflet. Una dipendenza sola e due useEffect. Leaflet
 * si importa dentro l'effetto perche' il modulo tocca `window` e questo
 * componente viene comunque renderizzato lato server.
 *
 * Due effetti e non uno: la mappa e le tile nascono una volta, i marker
 * seguono `points`. Con un effetto solo ogni cambio di filtro in /centri
 * distruggeva la mappa e ricaricava le tile, e lo si vedeva.
 *
 * La mappa non e' mai l'unico accesso al dato: docs/adr/0002 resta valido e le
 * sedi senza coordinate restano nell'elenco, spariscono solo di qui.
 */

export type MapPoint = {
  id: number
  nome: string
  citta: string
  slug: string
  lat: number
  lng: number
  /** Riempita quando l'utente ha chiesto il centro piu' vicino. */
  distance?: string
}

type Leaflet = typeof import('leaflet')

const TILE = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

/* Centro della Lombardia: il fallback quando nessun punto ha coordinate. */
const FALLBACK: [number, number] = [45.55, 9.2]

function escapeHtml(text: string) {
  return text.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)
}

export function CenterMap({
  points,
  etichetta: label,
  near = null,
}: {
  points: MapPoint[]
  etichetta: string
  /** L'id del centro piu' vicino: prende il segno pieno e l'inquadratura. */
  near?: number | null
}) {
  const container = useRef<HTMLDivElement>(null)
  const leaflet = useRef<Leaflet | null>(null)
  const map = useRef<import('leaflet').Map | null>(null)
  const group = useRef<import('leaflet').LayerGroup | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const node = container.current
    if (!node) return

    let cancelled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    void import('leaflet').then(({ default: L }) => {
      if (cancelled) return

      const m = L.map(node, {
        // Non rubare lo scroll di pagina: lo zoom passa dai controlli o dal pinch.
        scrollWheelZoom: false,
        zoomAnimation: !reducedMotion,
        fadeAnimation: !reducedMotion,
        attributionControl: true,
      })

      // Il prefisso di serie porta una bandiera SVG: resta il credito, va via il segno.
      m.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a>')
      L.tileLayer(TILE, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(m)

      leaflet.current = L
      group.current = L.layerGroup().addTo(m)
      map.current = m
      setReady(true)
    })

    return () => {
      cancelled = true
      map.current?.remove()
      map.current = null
      group.current = null
      setReady(false)
    }
  }, [])

  useEffect(() => {
    const L = leaflet.current
    const m = map.current
    const g = group.current
    if (!ready || !L || !m || !g) return

    g.clearLayers()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /*
     * Marker quadrato: la Regola dello Spigolo vale anche qui, nessun pin tondo.
     * E' una targhetta su un'asta - il disegno sta tutto negli pseudo-elementi
     * in CSS - e l'ancora e' in fondo all'asta, non al centro del nodo: la punta
     * cade sulle coordinate, il quadrato le sta sopra. Prima il segno era
     * centrato sul punto e a zoom alto indicava l'isolato, non l'indirizzo.
     *
     * Il nodo e' 44x44, quasi tutto trasparente: e' il bersaglio minimo da dito,
     * non la misura del segno, che resta una targhetta da 14px in fondo al nodo
     * (il disegno sta in map.css). Il marker del centro piu' vicino porta il
     * nome del comune scritto accanto, perche' la Regola dell'Etichetta non
     * ammette un valore che parli da solo.
     */
    const icon = (point: MapPoint, first: boolean) =>
      L.divIcon({
        className: `map__mark${first ? ' map__mark--nearest' : ''}`,
        html: first ? `<span class="map__label">${escapeHtml(point.citta)}</span>` : '',
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -30],
      })

    points.forEach((point, i) => {
      const first = point.id === near
      const marker = L.marker([point.lat, point.lng], {
        icon: icon(point, first),
        title: point.nome,
        // Freccia e invio raggiungono il marker e ne aprono il popup.
        keyboard: true,
        zIndexOffset: first ? 1000 : 0,
      })
        .bindPopup(
          `<strong>${escapeHtml(point.nome)}</strong><br>${escapeHtml(point.citta)}${
            point.distance ? `<br>a ${escapeHtml(point.distance)} da te` : ''
          }<br><a href="/centri/${escapeHtml(point.slug)}">Vedi il centro</a>`,
        )
        .addTo(g)

      /* I marker entrano in sequenza: scandisce l'elenco dei centri, non
         intrattiene. Il ritardo lo porta il nodo, l'animazione sta in CSS e
         sparisce sotto prefers-reduced-motion. */
      if (!reducedMotion) {
        marker.getElement()?.style.setProperty('--delay', `${Math.min(i, 20) * 40}ms`)
      }
    })

    const first = points.find((p) => p.id === near)

    if (first) {
      // Chi ha chiesto il centro piu' vicino guarda quello, non tutta la regione.
      m.setView([first.lat, first.lng], 13, { animate: !reducedMotion })
    } else if (points.length === 1) {
      m.setView([points[0].lat, points[0].lng], 15)
    } else if (points.length > 1) {
      m.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])).pad(0.15))
    } else {
      m.setView(FALLBACK, 9)
    }
  }, [points, ready, near])

  return <div className="map" ref={container} role="application" aria-label={label} />
}
