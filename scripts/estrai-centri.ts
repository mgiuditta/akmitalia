/**
 * Estrae i centri tecnici dal WordPress e scrive `data/centri.json`.
 *
 * Gira una tantum, a mano: `pnpm tsx scripts/estrai-centri.ts`.
 * Il JSON prodotto è la fonte di verità della migrazione — si corregge a mano,
 * si diffa in git e si valida col cliente. Il seed legge quello, non il WordPress.
 *
 * Non tocca il database.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { coordinateDaUrl, parsePaginaCentri, type CentroEstratto } from './lib/parse-centri'

const PAGINA_CENTRI = 'https://www.akm-italia.it/wp-json/wp/v2/pages/7426'
const DESTINAZIONE = path.resolve(process.cwd(), 'data/centri.json')

/**
 * Corsi minimi per far girare il seed: le discipline citate negli orari.
 * Testi e immagini si scrivono poi nell'admin.
 */
const CORSI = [
  { nome: 'Krav Maga Adulti', ordine: 1, slug: 'krav-maga-adulti', target: 'adulti' },
  { nome: 'Antibullismo Bambini', ordine: 2, slug: 'antibullismo-bambini', target: 'bambini' },
  { nome: 'Donna Sicura', ordine: 3, slug: 'donna-sicura', target: 'donne' },
  { nome: 'Kick Boxing', ordine: 4, slug: 'kick-boxing', target: 'adulti' },
  { nome: 'Full Contact', ordine: 5, slug: 'full-contact', target: 'adulti' },
  { nome: 'Corsi Istruttori', ordine: 6, slug: 'corsi-istruttori', target: 'istruttori' },
  { nome: 'Corsi Speciali', ordine: 7, slug: 'corsi-speciali', target: 'aziende-ffoo' },
]

const risolviCoordinate = async (mapsUrl: null | string) => {
  if (!mapsUrl) {
    return null
  }
  try {
    const risposta = await fetch(mapsUrl, { redirect: 'follow' })
    return coordinateDaUrl(risposta.url)
  } catch (errore) {
    console.warn(`  coordinate non risolte da ${mapsUrl}: ${(errore as Error).message}`)
    return null
  }
}

/** Rilettura del JSON precedente: le correzioni fatte a mano non si buttano via. */
const precedente = (): {
  centri: Record<string, { lat: null | number; lng: null | number }>
  mappaturaDiscipline: Record<string, string>
} => {
  if (!existsSync(DESTINAZIONE)) {
    return { centri: {}, mappaturaDiscipline: {} }
  }
  const vecchio = JSON.parse(readFileSync(DESTINAZIONE, 'utf8')) as {
    centri: { lat: null | number; lng: null | number; slug: string }[]
    mappaturaDiscipline?: Record<string, string>
  }
  return {
    centri: Object.fromEntries(vecchio.centri.map((c) => [c.slug, { lat: c.lat, lng: c.lng }])),
    mappaturaDiscipline: vecchio.mappaturaDiscipline ?? {},
  }
}

const main = async () => {
  const risposta = await fetch(PAGINA_CENTRI)
  if (!risposta.ok) {
    throw new Error(`WordPress ha risposto ${risposta.status} su ${PAGINA_CENTRI}`)
  }
  const pagina = (await risposta.json()) as { content: { rendered: string } }
  const centri = parsePaginaCentri(pagina.content.rendered)

  if (centri.length === 0) {
    throw new Error('Nessun accordion trovato: il markup del WordPress è cambiato.')
  }

  const vecchio = precedente()
  const conCoordinate: (CentroEstratto & { lat: null | number; lng: null | number })[] = []
  for (const centro of centri) {
    const gia = vecchio.centri[centro.slug]
    // In serie e non in parallelo: sono venti richieste a Google, non c'è fretta.
    const coordinate = gia?.lat != null ? gia : await risolviCoordinate(centro.mapsUrl)
    conCoordinate.push({ ...centro, lat: coordinate?.lat ?? null, lng: coordinate?.lng ?? null })
  }

  const discipline = [...new Set(centri.flatMap((c) => c.orari.map((o) => o.disciplina)))].sort()

  const documento = {
    _generato: new Date().toISOString(),
    _istruzioni:
      'Rivedere a mano: nome, città, coordinate, mappaturaDiscipline e i campi in daControllare. ' +
      'Poi: pnpm seed --dry-run, quindi pnpm seed.',
    corsi: CORSI,
    // Etichetta WordPress → slug del corso. Il seed si ferma se una manca.
    mappaturaDiscipline: Object.fromEntries(
      discipline.map((etichetta) => [etichetta, vecchio.mappaturaDiscipline[etichetta] ?? '']),
    ),
    centri: conCoordinate.map((centro) => ({ ...centro, citta: centro.nome, cap: '' })),
  }

  mkdirSync(path.dirname(DESTINAZIONE), { recursive: true })
  writeFileSync(DESTINAZIONE, `${JSON.stringify(documento, null, 2)}\n`)

  const senzaCoordinate = conCoordinate.filter((c) => c.lat === null).length
  const daControllare = conCoordinate.filter((c) => c.daControllare.length > 0).length
  console.log(`${conCoordinate.length} centri → ${DESTINAZIONE}`)
  console.log(`  discipline distinte: ${discipline.length} (da mappare a mano)`)
  console.log(`  senza coordinate: ${senzaCoordinate}`)
  console.log(`  con righe da controllare: ${daControllare}`)
}

main().catch((errore) => {
  console.error(errore)
  process.exit(1)
})
