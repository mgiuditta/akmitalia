/**
 * Parser degli accordion "Centri Tecnici" del WordPress (Live Composer, non Elementor).
 *
 * Ogni item ha una forma regolare:
 *
 *   <span class="dslc-accordion-title">ABBIATEGRASSO (MI)</span>
 *   ...
 *     Dynamic Dance School
 *     Via Alighieri n°110 - Abbiategrasso (MI)
 *     guarda su google maps            → <a href="https://maps.app.goo.gl/...">
 *     Krav Maga – Self Defense System (Adulti e Ragazzi)
 *     Giovedì dalle ore 20.00 alle ore 21.30
 *     Docente Istruttore Vittorio - Trainer Luca
 *
 * Quello che non rientra nello schema finisce in `daControllare`: l'output è un JSON
 * che si corregge a mano prima del seed, non un import automatico da fidarsi.
 */

export type OrarioEstratto = {
  disciplina: string
  giorni: string[]
  note?: string
  oraFine: string
  oraInizio: string
}

export type CentroEstratto = {
  attivo: boolean
  daControllare: string[]
  docenti: string[]
  indirizzo: string
  mapsUrl: null | string
  nome: string
  orari: OrarioEstratto[]
  palestra: string
  provincia: string
  slug: string
}

const GIORNI: Record<string, string> = {
  lunedì: 'lun',
  martedì: 'mar',
  mercoledì: 'mer',
  giovedì: 'gio',
  venerdì: 'ven',
  sabato: 'sab',
  domenica: 'dom',
}

const ENTITÀ: Record<string, string> = {
  '&#8211;': '–',
  '&#8217;': '’',
  '&agrave;': 'à',
  '&amp;': '&',
  '&egrave;': 'è',
  '&igrave;': 'ì',
  '&nbsp;': ' ',
  '&ograve;': 'ò',
  '&quot;': '"',
  '&ugrave;': 'ù',
}

const decodifica = (testo: string): string =>
  Object.entries(ENTITÀ)
    .reduce((acc, [entità, carattere]) => acc.split(entità).join(carattere), testo)
    .replace(/&#(\d+);/g, (_, codice) => String.fromCodePoint(Number(codice)))

export const slugifica = (testo: string): string =>
  decodifica(testo)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** "MILANO 1 – STAZIONE CENTRALE" → "Milano 1 – Stazione Centrale" */
const aMaiuscoleIniziali = (testo: string): string =>
  testo
    .toLowerCase()
    .replace(/(^|[\s–\-/(])([a-zà-ú])/g, (_, prefisso, lettera) => prefisso + lettera.toUpperCase())

const testoDaHtml = (html: string): string[] =>
  decodifica(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n')
    .map((riga) => riga.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

const ORARIO = /dalle ore/i
const DOCENTI = /^docent[ei]\b/i
const INFORMAZIONI = /per (maggiori )?informazioni/i

const parseOrario = (riga: string, disciplina: string): OrarioEstratto | null => {
  const ore = riga.match(/(\d{1,2})[.:](\d{2})/g)
  if (!ore || ore.length < 2) {
    return null
  }
  const giorni = Object.keys(GIORNI)
    .filter((giorno) => new RegExp(giorno, 'i').test(riga))
    .map((giorno) => GIORNI[giorno])
  const [oraInizio, oraFine] = ore.map((ora) => ora.replace('.', ':'))
  return { disciplina, giorni, oraFine, oraInizio }
}

/** "Istruttore Vittorio - Trainer Luca" → ["Istruttore Vittorio", "Trainer Luca"] */
const parseDocenti = (riga: string): string[] =>
  riga
    .replace(DOCENTI, '')
    .split(/\s+[-–]\s+|,/)
    .map((nome) => nome.trim())
    .filter(Boolean)

export const parseCentro = (titolo: string, contenutoHtml: string): CentroEstratto => {
  const intestazione = decodifica(titolo).trim()
  const conProvincia = intestazione.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  const nome = aMaiuscoleIniziali((conProvincia?.[1] ?? intestazione).trim())
  const provincia = (conProvincia?.[2] ?? '').trim().toUpperCase()

  const righe = testoDaHtml(contenutoHtml).filter((riga) => !INFORMAZIONI.test(riga))
  const mapsUrl = contenutoHtml.match(/href="(https?:\/\/[^"]*(?:goo\.gl|google\.[^"]*maps)[^"]*)"/i)?.[1] ?? null

  const orari: OrarioEstratto[] = []
  const docenti: string[] = []
  const daControllare: string[] = []
  let disciplinaCorrente = ''

  // Le prime due righe sono sempre palestra e indirizzo; il resto è a blocchi.
  const [palestra = '', indirizzo = '', ...resto] = righe

  for (const riga of resto) {
    if (/guarda su/i.test(riga)) {
      continue
    }
    if (DOCENTI.test(riga)) {
      docenti.push(...parseDocenti(riga))
      continue
    }
    if (ORARIO.test(riga)) {
      const orario = parseOrario(riga, disciplinaCorrente)
      if (orario && disciplinaCorrente && orario.giorni.length > 0) {
        orari.push(orario)
      } else {
        daControllare.push(riga)
      }
      continue
    }
    disciplinaCorrente = riga
  }

  if (!palestra || !indirizzo) {
    daControllare.push('Palestra o indirizzo mancanti nell’accordion.')
  }

  return {
    attivo: true,
    daControllare,
    docenti,
    indirizzo,
    mapsUrl,
    nome,
    orari,
    palestra,
    provincia,
    slug: slugifica(nome),
  }
}

export const parsePaginaCentri = (html: string): CentroEstratto[] => {
  const items = [
    ...html.matchAll(
      /<span class="dslc-accordion-title"[^>]*>([\s\S]*?)<\/span>([\s\S]*?)<!-- \.dslc-accordion-content -->/g,
    ),
  ]
  return items.map(([, titolo, contenuto]) => parseCentro(titolo, contenuto))
}

const RUOLI: Record<string, string> = {
  direttore: 'direttore-tecnico',
  istruttore: 'istruttore',
  maestro: 'maestro',
  presidente: 'presidente',
  trainer: 'trainer',
}

/** "Istruttore Vittorio" → { nome: 'Vittorio', ruolo: 'istruttore' }; ruolo `null` se non riconosciuto. */
export const parseDocente = (etichetta: string): { nome: string; ruolo: null | string } => {
  const [primo, ...resto] = etichetta.trim().split(/\s+/)
  const ruolo = RUOLI[primo?.toLowerCase() ?? '']
  return ruolo && resto.length > 0 ? { nome: resto.join(' '), ruolo } : { nome: etichetta.trim(), ruolo: null }
}

/** Dal link corto di Google Maps: `!3d<lat>!4d<lng>` nell'URL finale dopo i redirect. */
export const coordinateDaUrl = (urlFinale: string): null | { lat: number; lng: number } => {
  const preciso = urlFinale.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)
  const viewport = urlFinale.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  const trovato = preciso ?? viewport
  return trovato ? { lat: Number(trovato[1]), lng: Number(trovato[2]) } : null
}
