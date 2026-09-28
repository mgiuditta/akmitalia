import type { Sedi } from '@/payload-types'

import { disciplineId, readableAddress, readableDays } from './data'

/**
 * Prototipo C, «La segnaletica» (#66): le poche funzioni che trasformano un
 * centro del DB in un cartello. Nessuna dipendenza da Payload, cosi' le usano
 * sia le pagine server sia la rete dei centri, che e' un componente client.
 */

/** Un centro come lo legge la segnaletica: tutto serializzabile, niente relazioni. */
export type SignCenter = {
  id: number
  slug: string
  /** Il nome del cartello: «Pontesesto Rozzano», la parte del nome prima della palestra. */
  sign: string
  /** La struttura che ospita il centro: «Centro Tecnico Aisha». */
  host: string | null
  city: string
  province: string | null
  address: string
  lat: number | null
  lng: number | null
  /** I comuni e le zone di cui il centro e' punto di riferimento: le fermate della linea. */
  zones: string[]
  /** Righe d'orario gia' scritte: «Mercoledì», «20:30-22:00», «Krav Maga adulti». */
  slots: { id: string; days: string; time: string; course: string | null }[]
}

/**
 * «Milano Bisceglie / Lorenteggio - Palestra Piscina Cardellino» si divide in
 * cartello e palestra. Il nome resta il dato; la divisione e' solo di
 * composizione, e un nome senza trattino resta intero sul cartello.
 */
export function splitName(name: string) {
  const i = name.indexOf(' - ')
  if (i < 0) return { sign: name, host: null }
  return { sign: name.slice(0, i).trim(), host: name.slice(i + 3).trim() || null }
}

/**
 * Le zone servite stanno oggi nella descrizione del centro, in prosa: «... e'
 * inoltre il punto di riferimento per le zone di Fizzonasco, Quinto Stampi e
 * Opera.» Le si legge da li' invece di aggiungere un campo al DB condiviso;
 * una descrizione che non ha quella frase non ha fermate, e la linea non si
 * disegna. Il campo dedicato e' dichiarato nel NOTE.md del prototipo.
 */
export function servedZones(description?: string | null): string[] {
  if (!description) return []
  const match = description.match(/punto di riferimento per le zone(?:\s+di)?\s+([^.]+)/i)
  if (!match) return []
  const list = match[1].replace(/\s+e\s+(?=[^,]+$)/, ', ')
  return [...new Set(list.split(',').map((z) => z.trim()).filter(Boolean))]
}

/**
 * Da un centro del DB al suo cartello. I nomi dei corsi arrivano a parte,
 * perche' la home legge le sedi con depth 0 e la scheda con depth 2.
 */
export function toSignCenter(
  center: Pick<Sedi, 'id' | 'nome' | 'slug' | 'indirizzo'> &
    Partial<Pick<Sedi, 'palestra' | 'coordinate' | 'descrizione' | 'orari'>>,
  courseNames: Map<number, string>): SignCenter {
  const { sign, host } = splitName(center.nome)
  return {
    id: center.id,
    slug: center.slug,
    sign,
    host: center.palestra || host,
    city: center.indirizzo?.citta ?? '',
    province: center.indirizzo?.provincia ?? null,
    address: readableAddress(center.indirizzo),
    lat: typeof center.coordinate?.lat === 'number' ? center.coordinate.lat : null,
    lng: typeof center.coordinate?.lng === 'number' ? center.coordinate.lng : null,
    zones: servedZones(center.descrizione),
    slots: (center.orari ?? []).map((slot, i) => {
      const id = disciplineId(slot.disciplina)
      return {
        id: slot.id ?? String(i),
        days: readableDays(slot.giorni),
        time: `${slot.oraInizio}-${slot.oraFine}`,
        course: id === null ? null : (courseNames.get(id) ?? null),
      }
    }),
  }
}

/* ---------- proiezione ---------- */

/**
 * Proiezione equirettangolare con il coseno della latitudine media: su un'area
 * larga 40 km la deformazione non si vede, e serve a disegnare un diagramma di
 * punti e nomi, non a navigare. Per navigare c'e' «Apri in Maps».
 */
export type Projection = {
  width: number
  height: number
  x: (lng: number) => number
  y: (lat: number) => number
  /** Quante unita' del disegno fanno un chilometro, per la scala. */
  unitsPerKm: number
}

export function project(points: { lat: number; lng: number }[], width = 1000, pad = 70): Projection {
  const lats = points.map((p) => p.lat)
  const lngs = points.map((p) => p.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const k = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180)
  const spanX = Math.max((maxLng - minLng) * k, 0.01)
  const spanY = Math.max(maxLat - minLat, 0.01)
  const scale = (width - pad * 2) / Math.max(spanX, spanY)
  // L'area dei centri e' piu' alta che larga: il disegno resta quadrato e
  // centra i punti, cosi' a destra c'e' posto per i nomi.
  const height = width
  const offsetX = (width - spanX * scale) / 2
  const offsetY = (height - spanY * scale) / 2
  return {
    width,
    height,
    x: (lng) => offsetX + (lng - minLng) * k * scale,
    y: (lat) => offsetY + (maxLat - lat) * scale,
    // Un grado di latitudine sono circa 111,2 km.
    unitsPerKm: scale / 111.2,
  }
}

/**
 * Dove scrivere il nome accanto a ogni punto senza che due nomi si coprano.
 * Greedy e in unita' del disegno: prova a destra, a sinistra, sopra e sotto, e
 * tiene la prima posizione libera. La larghezza del testo e' stimata, non
 * misurata, perche' il calcolo gira anche sul server: il margine la copre.
 */
export type Placement = 'right' | 'left' | 'right-up' | 'right-down' | 'left-up' | 'left-down'

export function placeLabels(
  items: { id: number; x: number; y: number; text: string }[],
  { charWidth = 11.5, height = 34, gap = 18, width = 1000 } = {},
): Map<number, Placement> {
  type Box = { x0: number; y0: number; x1: number; y1: number }
  const boxes: Box[] = items.map((i) => ({ x0: i.x - 12, y0: i.y - 12, x1: i.x + 12, y1: i.y + 12 }))
  const result = new Map<number, Placement>()
  // Quanta superficie un nome copre di cio' che e' gia' sulla carta; uscire dal
  // disegno costa come coprire un nome intero.
  const cost = (a: Box) =>
    boxes.reduce(
      (sum, b) =>
        sum +
        Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) *
          Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)),
      0,
    ) + (a.x0 < 0 || a.x1 > width ? 100000 : 0)

  // Da sinistra a destra: i punti a ovest scelgono per primi e lasciano la
  // destra ai vicini.
  for (const item of [...items].sort((a, b) => a.x - b.x)) {
    const w = item.text.length * charWidth + 16
    const candidates: [Placement, Box][] = [
      ['right', { x0: item.x + gap, y0: item.y - height / 2, x1: item.x + gap + w, y1: item.y + height / 2 }],
      ['left', { x0: item.x - gap - w, y0: item.y - height / 2, x1: item.x - gap, y1: item.y + height / 2 }],
      ['right-up', { x0: item.x + gap, y0: item.y - height - 8, x1: item.x + gap + w, y1: item.y - 8 }],
      ['right-down', { x0: item.x + gap, y0: item.y + 8, x1: item.x + gap + w, y1: item.y + height + 8 }],
      ['left-up', { x0: item.x - gap - w, y0: item.y - height - 8, x1: item.x - gap, y1: item.y - 8 }],
      ['left-down', { x0: item.x - gap - w, y0: item.y + 8, x1: item.x - gap, y1: item.y + height + 8 }],
    ]
    let best = candidates[0]
    let bestCost = Infinity
    for (const candidate of candidates) {
      const c = cost(candidate[1])
      if (c < bestCost) {
        best = candidate
        bestCost = c
      }
    }
    boxes.push(best[1])
    result.set(item.id, best[0])
  }
  return result
}
