import type { Corsi, Eventi, Impostazioni, Sedi } from '@/payload-types'

import { EVENT_TYPES } from '@/collections/Events'

/**
 * Le poche funzioni di lettura che ogni pagina rifa uguale: giorni scritti per
 * esteso, nome del docente, indirizzo in una riga. Stanno qui perche' erano gia'
 * duplicate fra home e pagine nuove, non perche' servisse un livello.
 */

const DAYS: Record<string, string> = {
  lun: 'Lunedì',
  mar: 'Martedì',
  mer: 'Mercoledì',
  gio: 'Giovedì',
  ven: 'Venerdì',
  sab: 'Sabato',
  dom: 'Domenica',
}

/** «Corso tecnico» da `corso-tecnico`: la categoria si scrive per esteso, sempre. */
export function typeLabel(kind: Eventi['tipo'] | null | undefined) {
  return EVENT_TYPES.find((t) => t.value === kind)?.label ?? ''
}

/** Dove si tiene un evento, in una parola: la citta' del centro, o la prima parte del luogo scritto. */
export function eventPlace(event: Pick<Eventi, 'sede' | 'luogo'>) {
  const center = typeof event.sede === 'object' ? event.sede : null
  if (center) return center.indirizzo?.citta || center.nome
  return (event.luogo ?? '').split(',')[0].trim()
}

/**
 * JSON-LD dentro uno <script>: un titolo che contenga «</script>» chiuderebbe
 * il tag. Il «<» diventa \u003c, che per JSON e' lo stesso carattere e per il
 * parser HTML no. Le stringhe vengono dal CMS e dall'import WordPress: non
 * sono nostre.
 */
export function jsonLd(data: unknown) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/** Solo le sedi pubblicate: la Local API scavalca l'access control. */
export const published = { _status: { equals: 'published' } }

export function readableDays(days?: (string | null)[] | null) {
  const items = (days ?? []).filter(Boolean).map((g) => DAYS[g as string] ?? (g as string))
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`
}

export function instructorName(i: unknown) {
  if (typeof i !== 'object' || i === null) return null
  const doc = i as { nome?: string; nomeBreve?: string }
  return doc.nomeBreve || doc.nome || null
}

export function readableAddress(address?: Sedi['indirizzo'] | null) {
  if (!address) return ''
  const row = [address.via, address.cap, address.citta].filter(Boolean).join(', ')
  return address.provincia ? `${row} (${address.provincia})` : row
}

/** L'id del corso di una riga di orario, con depth 0 o depth 2 indifferentemente. */
export function disciplineId(discipline: unknown): number | null {
  if (typeof discipline === 'number') return discipline
  if (typeof discipline === 'object' && discipline !== null) {
    const doc = discipline as { id?: number }
    return typeof doc.id === 'number' ? doc.id : null
  }
  return null
}

/** Il valore di superficie resta quello salvato a DB; la classe CSS e' in inglese. */
const SURFACES: Record<Corsi['superficie'], string> = {
  nero: 'black',
  carbone: 'charcoal',
  bianco: 'white',
  grigio: 'grey',
}

export function surfaceClass(surface: Corsi['superficie'] | null | undefined) {
  return `pathway--${SURFACES[surface ?? 'carbone']}`
}

export function ordinal(n: number) {
  return String(n).padStart(2, '0')
}

export type Coordinate = { lat: number; lng: number }

/**
 * Distanza in linea d'aria fra due punti, in chilometri (formula dell'emisenoverso).
 *
 * ponytail: la Terra come sfera. Su una regione larga 150 km l'errore rispetto
 * all'ellissoide sta sotto lo 0,5%, e serve a ordinare un elenco di quindici
 * centri, non a farci navigare.
 */
export function distanceKm(a: Coordinate, b: Coordinate) {
  const RADIUS = 6371
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * RADIUS * Math.asin(Math.min(1, Math.sqrt(s)))
}

/** «3,4 km» sotto i 10, «17 km» sopra: un decimale a 40 km e' finta precisione. */
export function readableDistance(km: number) {
  return `${km < 10 ? km.toFixed(1).replace('.', ',') : Math.round(km)} km`
}

/**
 * L'origine pubblica del sito. Serve a metadataBase, alla sitemap e al JSON-LD,
 * che vogliono URL assoluti. Il sito non e' ancora online: finche' la variabile
 * non e' impostata si sviluppa su localhost, e non si finge un dominio.
 */
export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}

/*
 * Le sigle di provincia scritte per esteso. La sigla resta il dato in Payload
 * (indice, filtro, campo a 2 lettere) e resta nell'indirizzo, dove un indirizzo
 * si scrive cosi': «Via Leopardi n.5, Bresso (MI)». Il nome per esteso e' per la
 * prosa - il footer, i filtri, il conteggio delle prove - dove «MB» non dice
 * niente a chi cerca «corsi a Monza».
 *
 * L'elenco e' quello dei capoluoghi italiani piu' i cantoni svizzeri di confine
 * (a Chiasso il campo porta TI). Una sigla sconosciuta torna se stessa: e' un
 * dizionario, non una validazione.
 */
const PROVINCES: Record<string, string> = {
  AG: 'Agrigento', AL: 'Alessandria', AN: 'Ancona', AO: "Valle d'Aosta", AP: 'Ascoli Piceno',
  AQ: "L'Aquila", AR: 'Arezzo', AT: 'Asti', AV: 'Avellino', BA: 'Bari', BG: 'Bergamo',
  BI: 'Biella', BL: 'Belluno', BN: 'Benevento', BO: 'Bologna', BR: 'Brindisi', BS: 'Brescia',
  BT: 'Barletta-Andria-Trani', BZ: 'Bolzano', CA: 'Cagliari', CB: 'Campobasso', CE: 'Caserta',
  CH: 'Chieti', CL: 'Caltanissetta', CN: 'Cuneo', CO: 'Como', CR: 'Cremona', CS: 'Cosenza',
  CT: 'Catania', CZ: 'Catanzaro', EN: 'Enna', FC: 'Forli-Cesena', FE: 'Ferrara', FG: 'Foggia',
  FI: 'Firenze', FM: 'Fermo', FR: 'Frosinone', GE: 'Genova', GO: 'Gorizia', GR: 'Grosseto',
  IM: 'Imperia', IS: 'Isernia', KR: 'Crotone', LC: 'Lecco', LE: 'Lecce', LI: 'Livorno',
  LO: 'Lodi', LT: 'Latina', LU: 'Lucca', MB: 'Monza e Brianza', MC: 'Macerata', ME: 'Messina',
  MI: 'Milano', MN: 'Mantova', MO: 'Modena', MS: 'Massa-Carrara', MT: 'Matera', NA: 'Napoli',
  NO: 'Novara', NU: 'Nuoro', OR: 'Oristano', PA: 'Palermo', PC: 'Piacenza', PD: 'Padova',
  PE: 'Pescara', PG: 'Perugia', PI: 'Pisa', PN: 'Pordenone', PO: 'Prato', PR: 'Parma',
  PT: 'Pistoia', PU: 'Pesaro e Urbino', PV: 'Pavia', PZ: 'Potenza', RA: 'Ravenna',
  RC: 'Reggio Calabria', RE: 'Reggio Emilia', RG: 'Ragusa', RI: 'Rieti', RM: 'Roma',
  RN: 'Rimini', RO: 'Rovigo', SA: 'Salerno', SI: 'Siena', SO: 'Sondrio', SP: 'La Spezia',
  SR: 'Siracusa', SS: 'Sassari', SU: 'Sud Sardegna', SV: 'Savona', TA: 'Taranto',
  TE: 'Teramo', TN: 'Trento', TO: 'Torino', TP: 'Trapani', TR: 'Terni', TS: 'Trieste',
  TV: 'Treviso', UD: 'Udine', VA: 'Varese', VB: 'Verbano-Cusio-Ossola', VC: 'Vercelli',
  VE: 'Venezia', VI: 'Vicenza', VR: 'Verona', VT: 'Viterbo', VV: 'Vibo Valentia',
  // Il campo accetta anche un cantone svizzero: a Chiasso la sigla e' TI.
  TI: 'Ticino',
}

/** «MB» -> «Monza e Brianza». Una sigla che non conosciamo torna com'e'. */
export function provinceName(code?: string | null) {
  if (!code) return ''
  return PROVINCES[code.trim().toUpperCase()] ?? code
}

/**
 * L'intestazione del bivio, uguale in home e in /corsi. Sta in Impostazioni >
 * bivio; i valori di serie sono il ripiego per un campo svuotato dall'admin.
 */
export function forkTexts(settings?: Pick<Impostazioni, 'bivio'> | null) {
  const b = settings?.bivio
  return {
    occhiello: b?.occhiello || 'Prima scelta',
    titolo: b?.titolo || 'Qual è il tuo momento',
    /* Tre momenti e non quattro: la formazione tecnica non ha un corso, quindi
       non ha una riga nel bivio (docs/adr/0003), e il testo che la annunciava
       era smentito dal «3 percorsi» stampato due centimetri sotto. Tornera'
       quando esistera' il corso che la porta. */
    testo:
      b?.testo ||
      'Capisci quale percorso risponde al tuo momento: sicurezza quotidiana, crescita dei ragazzi, antiaggressione.',
  }
}
