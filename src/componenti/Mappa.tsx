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
 * seguono `punti`. Con un effetto solo ogni cambio di filtro in /centri
 * distruggeva la mappa e ricaricava le tile, e lo si vedeva.
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
  /** Riempita quando l'utente ha chiesto il centro piu' vicino. */
  distanza?: string
}

type Leaflet = typeof import('leaflet')

const TILE = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUZIONE =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

/* Centro della Lombardia: il fallback quando nessun punto ha coordinate. */
const RIPIEGO: [number, number] = [45.55, 9.2]

function fuga(testo: string) {
  return testo.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)
}

export function Mappa({
  punti,
  etichetta,
  vicino = null,
}: {
  punti: PuntoMappa[]
  etichetta: string
  /** L'id del centro piu' vicino: prende il segno pieno e l'inquadratura. */
  vicino?: number | null
}) {
  const contenitore = useRef<HTMLDivElement>(null)
  const leaflet = useRef<Leaflet | null>(null)
  const mappa = useRef<import('leaflet').Map | null>(null)
  const gruppo = useRef<import('leaflet').LayerGroup | null>(null)
  const [pronta, setPronta] = useState(false)

  useEffect(() => {
    const nodo = contenitore.current
    if (!nodo) return

    let annullato = false
    const fermo = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    void import('leaflet').then(({ default: L }) => {
      if (annullato) return

      const m = L.map(nodo, {
        // Non rubare lo scroll di pagina: lo zoom passa dai controlli o dal pinch.
        scrollWheelZoom: false,
        zoomAnimation: !fermo,
        fadeAnimation: !fermo,
        attributionControl: true,
      })

      // Il prefisso di serie porta una bandiera SVG: resta il credito, va via il segno.
      m.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a>')
      L.tileLayer(TILE, { attribution: ATTRIBUZIONE, maxZoom: 19 }).addTo(m)

      leaflet.current = L
      gruppo.current = L.layerGroup().addTo(m)
      mappa.current = m
      setPronta(true)
    })

    return () => {
      annullato = true
      mappa.current?.remove()
      mappa.current = null
      gruppo.current = null
      setPronta(false)
    }
  }, [])

  useEffect(() => {
    const L = leaflet.current
    const m = mappa.current
    const g = gruppo.current
    if (!pronta || !L || !m || !g) return

    g.clearLayers()

    const fermo = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /*
     * Marker quadrato: la Regola dello Spigolo vale anche qui, nessun pin tondo.
     * E' una targhetta su un'asta - il disegno sta tutto negli pseudo-elementi
     * in CSS - e l'ancora e' in fondo all'asta, non al centro del nodo: la punta
     * cade sulle coordinate, il quadrato le sta sopra. Prima il segno era
     * centrato sul punto e a zoom alto indicava l'isolato, non l'indirizzo.
     *
     * Il nodo e' 28x28: bersaglio da dito e area di focus visibile. Il marker
     * del centro piu' vicino porta il nome del comune scritto accanto, perche'
     * la Regola dell'Etichetta non ammette un valore che parli da solo.
     */
    const icona = (punto: PuntoMappa, primo: boolean) =>
      L.divIcon({
        className: `mappa__segno${primo ? ' mappa__segno--vicino' : ''}`,
        html: primo ? `<span class="mappa__etichetta">${fuga(punto.citta)}</span>` : '',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      })

    punti.forEach((punto, i) => {
      const primo = punto.id === vicino
      const marker = L.marker([punto.lat, punto.lng], {
        icon: icona(punto, primo),
        title: punto.nome,
        // Freccia e invio raggiungono il marker e ne aprono il popup.
        keyboard: true,
        zIndexOffset: primo ? 1000 : 0,
      })
        .bindPopup(
          `<strong>${fuga(punto.nome)}</strong><br>${fuga(punto.citta)}${
            punto.distanza ? `<br>a ${fuga(punto.distanza)} da te` : ''
          }<br><a href="/centri/${fuga(punto.slug)}">Vedi il centro</a>`,
        )
        .addTo(g)

      /* I marker entrano in sequenza: scandisce l'elenco dei centri, non
         intrattiene. Il ritardo lo porta il nodo, l'animazione sta in CSS e
         sparisce sotto prefers-reduced-motion. */
      if (!fermo) {
        marker.getElement()?.style.setProperty('--ritardo', `${Math.min(i, 20) * 40}ms`)
      }
    })

    const primo = punti.find((p) => p.id === vicino)

    if (primo) {
      // Chi ha chiesto il centro piu' vicino guarda quello, non tutta la regione.
      m.setView([primo.lat, primo.lng], 13, { animate: !fermo })
    } else if (punti.length === 1) {
      m.setView([punti[0].lat, punti[0].lng], 15)
    } else if (punti.length > 1) {
      m.fitBounds(L.latLngBounds(punti.map((p) => [p.lat, p.lng] as [number, number])).pad(0.15))
    } else {
      m.setView(RIPIEGO, 9)
    }
  }, [punti, pronta, vicino])

  return <div className="mappa" ref={contenitore} role="application" aria-label={etichetta} />
}
