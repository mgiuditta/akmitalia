/**
 * Importa gli eventi dal calendario del vecchio sito WordPress, via l'API REST
 * di The Events Calendar (`/wp-json/tribe/events/v1/events`), dal 2024 in poi.
 * Rieseguibile: la chiave di upsert e lo slug di WordPress.
 *
 *   pnpm import:events
 *
 * Punto di partenza, non fonte di verita': da qui in poi gli eventi si
 * scrivono dall'admin, e rilanciare lo script sovrascrive quello che il
 * cliente ha cambiato.
 *
 * ponytail: l'abbinamento al centro e' un'euristica sul nome del luogo (la
 * parte prima del trattino, o la citta'). Chi non trova un centro finisce in
 * `luogo` e in un elenco stampato alla fine: si sistemano dall'admin, sono
 * meno di dieci.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { EVENT_TYPES } from '../src/collections/Events'
import { fromRome } from '../src/components/calendar'
import { p, rich } from './lexical'

const ORIGIN =
  process.env.WP_EVENTI_URL || 'http://www.akm-italia.it/wp-json/tribe/events/v1/events'
const SINCE = process.env.WP_EVENTI_DAL || '2024-01-01'

type WpEvent = {
  id: number
  slug: string
  title: string
  description?: string
  excerpt?: string
  start_date: string
  end_date?: string
  all_day?: boolean
  website?: string
  categories?: { slug: string }[]
  venue?: { venue?: string; address?: string; city?: string } | unknown[]
}

type EventType = (typeof EVENT_TYPES)[number]['value']
const TYPES = new Set<string>(EVENT_TYPES.map((t) => t.value))

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)

const withoutHtml = (html: string) =>
  decode(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()

/* I paragrafi del testo WordPress, uno per <p> o per a capo. */
const paragraphs = (html: string) =>
  html
    .split(/<\/p>|<br\s*\/?>/i)
    .map(withoutHtml)
    .filter(Boolean)

/* «Pogliano M.se - "Centro Dance Time Studio"» -> «pogliano milanese» */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/["“”'’]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\bm\.se\b/g, 'milanese')
    .replace(/\s+/g, ' ')
    .trim()

const prefix = (name: string) => normalize(name.split(/\s[-–]\s/)[0] ?? name)

/* Il WordPress e' impostato su «UTC+0» ma scrive l'ora dell'orologio italiano:
   «2026-09-24 18:30:00» sono le 18:30 a Roma, e cosi' si legge. Un evento di
   tutto il giorno finisce alle 23:59:59: diventa la mezzanotte, che per il
   sito vuol dire «senza orario». */
const instant = (locale: string | undefined, allDay: boolean) => {
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/.exec(locale ?? '')
  if (!m) return null
  const [year, month, day, time, minute] = m.slice(1).map(Number)
  return (allDay ? fromRome(year, month, day) : fromRome(year, month, day, time, minute)).toISOString()
}

const payload = await getPayload({ config })

const centers = await payload.find({
  collection: 'sedi',
  depth: 0,
  limit: 300,
  select: { nome: true, indirizzo: true },
  draft: true,
  overrideAccess: true,
})

const byPrefix = new Map<string, number>()
const byCity = new Map<string, number[]>()
for (const center of centers.docs) {
  byPrefix.set(prefix(center.nome), center.id)
  const city = normalize(center.indirizzo?.citta ?? '')
  if (city) byCity.set(city, [...(byCity.get(city) ?? []), center.id])
}

/** L'id del centro, se il nome del luogo o la citta' lo identificano senza ambiguita'. */
const findCenter = (venue: WpEvent['venue']) => {
  if (!venue || Array.isArray(venue)) return null
  const name = venue.venue ?? ''
  const byName = byPrefix.get(prefix(name))
  if (byName) return byName
  const candidates = byCity.get(normalize(venue.city ?? '')) ?? byCity.get(prefix(name)) ?? []
  return candidates.length === 1 ? candidates[0] : null
}

const writtenLocation = (venue: WpEvent['venue']) => {
  if (!venue || Array.isArray(venue)) return null
  // «Riccione, Riccione»: il vecchio sito ripete la citta' come nome del luogo.
  const parts = [venue.venue?.replace(/["“”]/g, ''), venue.address, venue.city]
    .map((v) => (v ? withoutHtml(v) : ''))
    .filter(Boolean)
  return [...new Set(parts)].join(', ') || null
}

/* «Bresso – Presentazione ...» con il centro di Bresso gia' in relazione:
   il prefisso cade. Ogni trattino lungo residuo diventa un trattino. */
const cleanTitle = (title: string, centerId: number | null) => {
  let t = decode(title).trim()
  if (centerId) {
    const center = centers.docs.find((s) => s.id === centerId)
    const head = t.split(/\s[-–]\s/)[0]
    if (center && head && t.length > head.length && prefix(head) === prefix(center.nome)) {
      t = t.slice(head.length).replace(/^\s[-–]\s/, '')
    }
  }
  return t.replace(/\s[–—]\s/g, ' - ').replace(/[–—]/g, '-')
}

const download = async (page: number) => {
  const url = new URL(ORIGIN)
  url.searchParams.set('per_page', '50')
  url.searchParams.set('start_date', SINCE)
  url.searchParams.set('page', String(page))
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return (await response.json()) as { events: WpEvent[]; total_pages?: number }
}

const toAssign: string[] = []
let imported = 0

for (let page = 1, pages = 1; page <= pages; page++) {
  const body = await download(page)
  pages = body.total_pages ?? 1

  for (const e of body.events) {
    const center = findCenter(e.venue)
    const category = e.categories?.[0]?.slug
    const kind = (TYPES.has(category ?? '') ? category : 'presentazione') as EventType
    const texts = paragraphs(e.description ?? '')
    const startDate = instant(e.start_date, Boolean(e.all_day)) as string
    const endDate = instant(e.end_date, Boolean(e.all_day))
    const excerpt = (withoutHtml(e.excerpt ?? '') || texts[0] || '').slice(0, 300) || null

    const data = {
      titolo: cleanTitle(e.title, center),
      slug: e.slug,
      generateSlug: false,
      tipo: kind,
      dataInizio: startDate,
      // Una fine prima dell'inizio e' un refuso del vecchio sito, non una data.
      dataFine: endDate && endDate >= startDate ? endDate : null,
      sede: center,
      luogo: center ? null : writtenLocation(e.venue),
      estratto: excerpt,
      descrizione: texts.length > 0 ? rich(texts.map(p)) : null,
      ctaLink: e.website || null,
      _status: 'published' as const,
    }

    const { docs } = await payload.find({
      collection: 'eventi',
      where: { slug: { equals: e.slug } },
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true,
    })

    if (docs[0]) {
      await payload.update({ collection: 'eventi', id: docs[0].id, data, overrideAccess: true })
    } else {
      await payload.create({ collection: 'eventi', data, overrideAccess: true })
    }
    imported++
    if (!center) toAssign.push(`${e.start_date.slice(0, 10)}  ${data.titolo}  (${data.luogo ?? 'senza luogo'})`)
  }
}

console.log(`= ${imported} eventi importati`)
if (toAssign.length > 0) {
  console.log(`\nSenza un centro riconosciuto, da assegnare dall'admin (${toAssign.length}):`)
  for (const row of toAssign) console.log(`  ${row}`)
}
