import type { Sedi } from '@/payload-types'

/**
 * Le poche funzioni di lettura che ogni pagina rifa uguale: giorni scritti per
 * esteso, nome del docente, indirizzo in una riga. Stanno qui perche' erano gia'
 * duplicate fra home e pagine nuove, non perche' servisse un livello.
 */

const GIORNI: Record<string, string> = {
  lun: 'Lunedì',
  mar: 'Martedì',
  mer: 'Mercoledì',
  gio: 'Giovedì',
  ven: 'Venerdì',
  sab: 'Sabato',
  dom: 'Domenica',
}

/** Solo le sedi pubblicate: la Local API scavalca l'access control. */
export const pubblicato = { _status: { equals: 'published' } }

export function giorniLeggibili(giorni?: (string | null)[] | null) {
  const voci = (giorni ?? []).filter(Boolean).map((g) => GIORNI[g as string] ?? (g as string))
  if (voci.length === 0) return ''
  if (voci.length === 1) return voci[0]
  return `${voci.slice(0, -1).join(', ')} e ${voci[voci.length - 1]}`
}

export function nomeIstruttore(i: unknown) {
  if (typeof i !== 'object' || i === null) return null
  const doc = i as { nome?: string; nomeBreve?: string }
  return doc.nomeBreve || doc.nome || null
}

export function indirizzoLeggibile(indirizzo?: Sedi['indirizzo'] | null) {
  if (!indirizzo) return ''
  const riga = [indirizzo.via, indirizzo.cap, indirizzo.citta].filter(Boolean).join(', ')
  return indirizzo.provincia ? `${riga} (${indirizzo.provincia})` : riga
}

/** L'id del corso di una riga di orario, con depth 0 o depth 2 indifferentemente. */
export function idDisciplina(disciplina: unknown): number | null {
  if (typeof disciplina === 'number') return disciplina
  if (typeof disciplina === 'object' && disciplina !== null) {
    const doc = disciplina as { id?: number }
    return typeof doc.id === 'number' ? doc.id : null
  }
  return null
}

export function ordinale(n: number) {
  return String(n).padStart(2, '0')
}

/**
 * L'origine pubblica del sito. Serve a metadataBase, alla sitemap e al JSON-LD,
 * che vogliono URL assoluti. Il sito non e' ancora online: finche' la variabile
 * non e' impostata si sviluppa su localhost, e non si finge un dominio.
 */
export function sitoUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}
