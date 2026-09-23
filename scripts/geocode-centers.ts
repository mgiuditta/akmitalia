/**
 * Riempie `coordinate.lat/lng` delle sedi che ne sono prive, partendo
 * dall'indirizzo gia in CMS.
 *
 *   pnpm centers:geocode
 *
 * Nominatim di OpenStreetMap: gratis, nessuna chiave, nessun account. In cambio
 * chiede uno User-Agent identificativo e al massimo una richiesta al secondo.
 * Diciotto sedi sono venti secondi.
 *
 * ponytail: una tantum e idempotente. Non gira in build, non gira a runtime, e
 * salta le sedi che hanno gia le coordinate: docs/adr/0002 resta valido, le
 * coordinate restano opzionali e chi non si risolve si completa a mano.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const AGENT = 'akmitalia-geocodifica/1.0 (https://www.akmitalia.it)'
const PAUSE = 1100

const payload = await getPayload({ config })

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Gli indirizzi arrivano da WordPress e portano «n° 17/A», «(angolo Via Vitruvio)»
 * e iniziali puntate: Nominatim su quelle forme non trova niente. Si prova prima
 * la via normalizzata col civico, poi la sola via, che per un segno su una mappa
 * e abbastanza preciso.
 */
function variants(address: { via?: string | null; cap?: string | null; citta?: string | null }) {
  const city = address.citta ?? ''
  const street = (address.via ?? '')
    .replace(/\([^)]*\)/g, '') // «(angolo Via Vitruvio)»
    .replace(/\bn[°.\u00b0]?\s*/gi, '') // «n° 17», «n. 17»
    .replace(/(\d+)\s*[/\\]\s*\w+/g, '$1') // «22/24», «17/A»
    .replace(/\s+/g, ' ')
    .trim()

  const withoutNumber = street.replace(/\d+\s*$/, '').replace(/\b[A-Z]\.\s*/g, '').trim()

  return [
    [street, address.cap, city].filter(Boolean).join(', '),
    [withoutNumber, city].filter(Boolean).join(', '),
  ].filter((q) => q.length > city.length)
}

async function geocode(query: string, country: string) {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', country.toLowerCase())
  url.searchParams.set('q', query)

  const response = await fetch(url, { headers: { 'User-Agent': AGENT } })
  if (!response.ok) throw new Error(`Nominatim ha risposto ${response.status}`)

  const outcomes = (await response.json()) as { lat: string; lon: string }[]
  if (outcomes.length === 0) return null

  return { lat: Number(outcomes[0].lat), lng: Number(outcomes[0].lon) }
}

const centers = await payload.find({ collection: 'sedi', depth: 0, limit: 500, pagination: false })

const todo = centers.docs.filter(
  (center) => typeof center.coordinate?.lat !== 'number' || typeof center.coordinate?.lng !== 'number',
)

console.log(`${centers.docs.length} sedi, ${todo.length} senza coordinate.`)

const unresolved: string[] = []

for (const center of todo) {
  const attempts = variants(center.indirizzo ?? {})

  if (attempts.length === 0) {
    unresolved.push(`${center.nome} (indirizzo vuoto)`)
    continue
  }

  let point: { lat: number; lng: number } | null = null
  let error: string | null = null

  for (const query of attempts) {
    try {
      point = await geocode(query, center.indirizzo?.nazione ?? 'IT')
    } catch (e) {
      error = (e as Error).message
    }
    await wait(PAUSE)
    if (point) break
  }

  if (point) {
    await payload.update({
      collection: 'sedi',
      id: center.id,
      data: { coordinate: point },
      overrideAccess: true,
    })
    console.log(`  ${center.nome} → ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`)
  } else {
    unresolved.push(`${center.nome} (${error ?? attempts[0]})`)
  }
}

if (unresolved.length > 0) {
  console.log(`\n${unresolved.length} sedi da completare a mano dal pannello:`)
  for (const row of unresolved) console.log(`  - ${row}`)
}

console.log('\nFatto.')
process.exit(0)
