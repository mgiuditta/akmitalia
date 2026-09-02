'use client'

import React, { useEffect, useRef } from 'react'

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
 * ponytail: niente react-leaflet. Una dipendenza sola e un useEffect. Leaflet
 * si importa dentro l'effetto perche' il modulo tocca `window` e questo
 * componente viene comunque renderizzato lato server.
 *
 * La mappa non e' mai l'unico accesso al dato: docs/adr/0002 resta valido e le
 * sedi senza coordinate restano nell'elenco, spariscono solo di qui.
 */

export type PuntoMappa = {
  id: number
  nome: string
  citta: string
  slug: string
  lat: number
  lng: number
}

const TILE = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUZIONE =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

/* Centro della Lombardia: il fallback quando nessun punto ha coordinate. */
const RIPIEGO: [number, number] = [45.55, 9.2]

function fuga(testo: string) {
  return testo.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)
}

export function Mappa({ punti, etichetta }: { punti: PuntoMappa[]; etichetta: string }) {
  const contenitore = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nodo = contenitore.current
    if (!nodo) return

    let mappa: import('leaflet').Map | null = null
    let annullato = false

    const fermo = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    void import('leaflet').then(({ default: L }) => {
      if (annullato || !nodo) return

      mappa = L.map(nodo, {
        // Non rubare lo scroll di pagina: lo zoom passa dai controlli o dal pinch.
        scrollWheelZoom: false,
        zoomAnimation: !fermo,
        fadeAnimation: !fermo,
        attributionControl: true,
      })

      // Il prefisso di serie porta una bandiera SVG: resta il credito, va via il segno.
      mappa.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a>')
      L.tileLayer(TILE, { attribution: ATTRIBUZIONE, maxZoom: 19 }).addTo(mappa)

      // Marker quadrato: la Regola dello Spigolo vale anche qui, nessun pin tondo.
      const icona = L.divIcon({
        className: 'mappa__segno',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, -8],
      })

      for (const punto of punti) {
        L.marker([punto.lat, punto.lng], { icon: icona, title: punto.nome })
          .addTo(mappa)
          .bindPopup(
            `<strong>${fuga(punto.nome)}</strong><br>${fuga(punto.citta)}<br><a href="/centri/${fuga(punto.slug)}">Vedi il centro</a>`,
          )
      }

      if (punti.length === 1) {
        mappa.setView([punti[0].lat, punti[0].lng], 15)
      } else if (punti.length > 1) {
        mappa.fitBounds(
          L.latLngBounds(punti.map((p) => [p.lat, p.lng] as [number, number])).pad(0.15),
        )
      } else {
        mappa.setView(RIPIEGO, 9)
      }
    })

    return () => {
      annullato = true
      mappa?.remove()
    }
  }, [punti])

  return <div className="mappa" ref={contenitore} role="application" aria-label={etichetta} />
}
