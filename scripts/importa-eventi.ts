/**
 * Importa gli eventi dal calendario del vecchio sito WordPress, via l'API REST
 * di The Events Calendar (`/wp-json/tribe/events/v1/events`), dal 2024 in poi.
 * Rieseguibile: la chiave di upsert e lo slug di WordPress.
 *
 *   pnpm importa:eventi
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

import { TIPI_EVENTO } from '../src/collections/Eventi'
import { daRoma } from '../src/componenti/calendario'
import { p, ricco } from './lexical'

const ORIGINE =
  process.env.WP_EVENTI_URL || 'http://www.akm-italia.it/wp-json/tribe/events/v1/events'
const DAL = process.env.WP_EVENTI_DAL || '2024-01-01'

type EventoWp = {
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

type Tipo = (typeof TIPI_EVENTO)[number]['value']
const TIPI = new Set<string>(TIPI_EVENTO.map((t) => t.value))

const ENTITA: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

const decodifica = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, nome) => ENTITA[nome.toLowerCase()] ?? m)

const senzaHtml = (html: string) =>
  decodifica(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()

/* I paragrafi del testo WordPress, uno per <p> o per a capo. */
const paragrafi = (html: string) =>
  html
    .split(/<\/p>|<br\s*\/?>/i)
    .map(senzaHtml)
    .filter(Boolean)

/* «Pogliano M.se - "Centro Dance Time Studio"» -> «pogliano milanese» */
const normalizza = (s: string) =>
  s
    .toLowerCase()
    .replace(/["“”'’]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\bm\.se\b/g, 'milanese')
    .replace(/\s+/g, ' ')
    .trim()

const prefisso = (nome: string) => normalizza(nome.split(/\s[-–]\s/)[0] ?? nome)

/* Il WordPress e' impostato su «UTC+0» ma scrive l'ora dell'orologio italiano:
   «2026-09-24 18:30:00» sono le 18:30 a Roma, e cosi' si legge. Un evento di
   tutto il giorno finisce alle 23:59:59: diventa la mezzanotte, che per il
   sito vuol dire «senza orario». */
const istante = (locale: string | undefined, tuttoIlGiorno: boolean) => {
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/.exec(locale ?? '')
  if (!m) return null
  const [anno, mese, giorno, ora, minuto] = m.slice(1).map(Number)
  return (tuttoIlGiorno ? daRoma(anno, mese, giorno) : daRoma(anno, mese, giorno, ora, minuto)).toISOString()
}

const payload = await getPayload({ config })

const sedi = await payload.find({
  collection: 'sedi',
  depth: 0,
  limit: 300,
  select: { nome: true, indirizzo: true },
  draft: true,
  overrideAccess: true,
})

const perPrefisso = new Map<string, number>()
const perCitta = new Map<string, number[]>()
for (const sede of sedi.docs) {
  perPrefisso.set(prefisso(sede.nome), sede.id)
  const citta = normalizza(sede.indirizzo?.citta ?? '')
  if (citta) perCitta.set(citta, [...(perCitta.get(citta) ?? []), sede.id])
}

/** L'id del centro, se il nome del luogo o la citta' lo identificano senza ambiguita'. */
const trovaSede = (venue: EventoWp['venue']) => {
  if (!venue || Array.isArray(venue)) return null
  const nome = venue.venue ?? ''
  const daNome = perPrefisso.get(prefisso(nome))
  if (daNome) return daNome
  const candidati = perCitta.get(normalizza(venue.city ?? '')) ?? perCitta.get(prefisso(nome)) ?? []
  return candidati.length === 1 ? candidati[0] : null
}

const luogoScritto = (venue: EventoWp['venue']) => {
  if (!venue || Array.isArray(venue)) return null
  // «Riccione, Riccione»: il vecchio sito ripete la citta' come nome del luogo.
  const parti = [venue.venue?.replace(/["“”]/g, ''), venue.address, venue.city]
    .map((v) => (v ? senzaHtml(v) : ''))
    .filter(Boolean)
  return [...new Set(parti)].join(', ') || null
}

/* «Bresso – Presentazione ...» con il centro di Bresso gia' in relazione:
   il prefisso cade. Ogni trattino lungo residuo diventa un trattino. */
const titoloPulito = (titolo: string, sedeId: number | null) => {
  let t = decodifica(titolo).trim()
  if (sedeId) {
    const sede = sedi.docs.find((s) => s.id === sedeId)
    const testa = t.split(/\s[-–]\s/)[0]
    if (sede && testa && t.length > testa.length && prefisso(testa) === prefisso(sede.nome)) {
      t = t.slice(testa.length).replace(/^\s[-–]\s/, '')
    }
  }
  return t.replace(/\s[–—]\s/g, ' - ').replace(/[–—]/g, '-')
}

const scarica = async (pagina: number) => {
  const url = new URL(ORIGINE)
  url.searchParams.set('per_page', '50')
  url.searchParams.set('start_date', DAL)
  url.searchParams.set('page', String(pagina))
  const risposta = await fetch(url)
  if (!risposta.ok) throw new Error(`${url}: HTTP ${risposta.status}`)
  return (await risposta.json()) as { events: EventoWp[]; total_pages?: number }
}

const daAssegnare: string[] = []
let importati = 0

for (let pagina = 1, pagine = 1; pagina <= pagine; pagina++) {
  const corpo = await scarica(pagina)
  pagine = corpo.total_pages ?? 1

  for (const e of corpo.events) {
    const sede = trovaSede(e.venue)
    const categoria = e.categories?.[0]?.slug
    const tipo = (TIPI.has(categoria ?? '') ? categoria : 'presentazione') as Tipo
    const testi = paragrafi(e.description ?? '')
    const dataInizio = istante(e.start_date, Boolean(e.all_day)) as string
    const dataFine = istante(e.end_date, Boolean(e.all_day))
    const estratto = (senzaHtml(e.excerpt ?? '') || testi[0] || '').slice(0, 300) || null

    const data = {
      titolo: titoloPulito(e.title, sede),
      slug: e.slug,
      generateSlug: false,
      tipo,
      dataInizio,
      // Una fine prima dell'inizio e' un refuso del vecchio sito, non una data.
      dataFine: dataFine && dataFine >= dataInizio ? dataFine : null,
      sede,
      luogo: sede ? null : luogoScritto(e.venue),
      estratto,
      descrizione: testi.length > 0 ? ricco(testi.map(p)) : null,
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
    importati++
    if (!sede) daAssegnare.push(`${e.start_date.slice(0, 10)}  ${data.titolo}  (${data.luogo ?? 'senza luogo'})`)
  }
}

console.log(`= ${importati} eventi importati`)
if (daAssegnare.length > 0) {
  console.log(`\nSenza un centro riconosciuto, da assegnare dall'admin (${daAssegnare.length}):`)
  for (const riga of daAssegnare) console.log(`  ${riga}`)
}
