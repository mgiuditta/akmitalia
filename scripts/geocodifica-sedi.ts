/**
 * Riempie `coordinate.lat/lng` delle sedi che ne sono prive, partendo
 * dall'indirizzo gia in CMS.
 *
 *   pnpm sedi:geocodifica
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

const AGENTE = 'akmitalia-geocodifica/1.0 (https://www.akmitalia.it)'
const PAUSA = 1100

const payload = await getPayload({ config })

function attendi(ms: number) {
  return new Promise((risolvi) => setTimeout(risolvi, ms))
}

/**
 * Gli indirizzi arrivano da WordPress e portano «n° 17/A», «(angolo Via Vitruvio)»
 * e iniziali puntate: Nominatim su quelle forme non trova niente. Si prova prima
 * la via normalizzata col civico, poi la sola via, che per un segno su una mappa
 * e abbastanza preciso.
 */
function varianti(indirizzo: { via?: string | null; cap?: string | null; citta?: string | null }) {
  const citta = indirizzo.citta ?? ''
  const via = (indirizzo.via ?? '')
    .replace(/\([^)]*\)/g, '') // «(angolo Via Vitruvio)»
    .replace(/\bn[°.\u00b0]?\s*/gi, '') // «n° 17», «n. 17»
    .replace(/(\d+)\s*[/\\]\s*\w+/g, '$1') // «22/24», «17/A»
    .replace(/\s+/g, ' ')
    .trim()

  const senzaCivico = via.replace(/\d+\s*$/, '').replace(/\b[A-Z]\.\s*/g, '').trim()

  return [
    [via, indirizzo.cap, citta].filter(Boolean).join(', '),
    [senzaCivico, citta].filter(Boolean).join(', '),
  ].filter((q) => q.length > citta.length)
}

async function geocodifica(query: string, nazione: string) {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', nazione.toLowerCase())
  url.searchParams.set('q', query)

  const risposta = await fetch(url, { headers: { 'User-Agent': AGENTE } })
  if (!risposta.ok) throw new Error(`Nominatim ha risposto ${risposta.status}`)

  const esiti = (await risposta.json()) as { lat: string; lon: string }[]
  if (esiti.length === 0) return null

  return { lat: Number(esiti[0].lat), lng: Number(esiti[0].lon) }
}

const sedi = await payload.find({ collection: 'sedi', depth: 0, limit: 500, pagination: false })

const daFare = sedi.docs.filter(
  (sede) => typeof sede.coordinate?.lat !== 'number' || typeof sede.coordinate?.lng !== 'number',
)

console.log(`${sedi.docs.length} sedi, ${daFare.length} senza coordinate.`)

const irrisolte: string[] = []

for (const sede of daFare) {
  const tentativi = varianti(sede.indirizzo ?? {})

  if (tentativi.length === 0) {
    irrisolte.push(`${sede.nome} (indirizzo vuoto)`)
    continue
  }

  let punto: { lat: number; lng: number } | null = null
  let errore: string | null = null

  for (const query of tentativi) {
    try {
      punto = await geocodifica(query, sede.indirizzo?.nazione ?? 'IT')
    } catch (e) {
      errore = (e as Error).message
    }
    await attendi(PAUSA)
    if (punto) break
  }

  if (punto) {
    await payload.update({
      collection: 'sedi',
      id: sede.id,
      data: { coordinate: punto },
      overrideAccess: true,
    })
    console.log(`  ${sede.nome} → ${punto.lat.toFixed(5)}, ${punto.lng.toFixed(5)}`)
  } else {
    irrisolte.push(`${sede.nome} (${errore ?? tentativi[0]})`)
  }
}

if (irrisolte.length > 0) {
  console.log(`\n${irrisolte.length} sedi da completare a mano dal pannello:`)
  for (const riga of irrisolte) console.log(`  - ${riga}`)
}

console.log('\nFatto.')
process.exit(0)
