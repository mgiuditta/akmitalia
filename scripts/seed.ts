/**
 * Popola corsi, docenti e centri da `data/centri.json`.
 *
 *   pnpm seed --dry-run   stampa cosa farebbe, senza scrivere
 *   pnpm seed             scrive
 *   pnpm seed altro.json  legge un altro file (default: data/centri.json)
 *
 * È rieseguibile: upsert per slug (per nome sui docenti). Eseguirlo due volte
 * non crea duplicati — i dati verranno corretti più volte prima del lancio.
 */
import 'dotenv/config'

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload, type Where } from 'payload'

import config from '../src/payload.config'
import { parseDocente } from './lib/parse-centri'

type Orario = { disciplina: string; giorni: string[]; note?: string; oraFine: string; oraInizio: string }

type Centro = {
  attivo: boolean
  cap?: string
  citta: string
  docenti: string[]
  indirizzo: string
  lat: null | number
  lng: null | number
  mapsUrl: null | string
  nome: string
  orari: Orario[]
  palestra: string
  provincia: string
  slug: string
}

type Dati = {
  centri: Centro[]
  corsi: { nome: string; ordine: number; slug: string; target: string }[]
  mappaturaDiscipline: Record<string, string>
}

const dryRun = process.argv.includes('--dry-run')
const sorgente = process.argv.slice(2).find((argomento) => !argomento.startsWith('--')) ?? 'data/centri.json'

const main = async () => {
  const dati = JSON.parse(readFileSync(path.resolve(process.cwd(), sorgente), 'utf8')) as Dati

  // Meglio fermarsi qui che scrivere in database un centro con orari senza disciplina.
  const nonMappate = Object.entries(dati.mappaturaDiscipline).filter(([, slug]) => !slug)
  if (nonMappate.length > 0) {
    throw new Error(
      `Discipline senza corrispondenza in mappaturaDiscipline:\n  ${nonMappate
        .map(([etichetta]) => etichetta)
        .join('\n  ')}`,
    )
  }
  const senzaCoordinate = dati.centri.filter((c) => c.lat === null || c.lng === null)
  if (senzaCoordinate.length > 0) {
    throw new Error(
      `Coordinate mancanti (servono ai dati strutturati):\n  ${senzaCoordinate
        .map((c) => c.slug)
        .join('\n  ')}`,
    )
  }

  const payload = await getPayload({ config })
  // Il seed non deve rigenerare il sito a ogni riga scritta.
  const context = { disableRevalidate: true }
  let creati = 0
  let aggiornati = 0

  const upsert = async (
    collection: 'centri' | 'corsi' | 'docenti',
    where: Where,
    data: Record<string, unknown>,
    etichetta: string,
  ): Promise<number | string> => {
    const esistente = (await payload.find({ collection, depth: 0, limit: 1, where })).docs[0]
    if (dryRun) {
      console.log(`  ${esistente ? 'aggiorna' : 'crea    '} ${collection}/${etichetta}`)
      return esistente?.id ?? `nuovo:${etichetta}`
    }
    if (esistente) {
      aggiornati += 1
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.update({ id: esistente.id, collection, context, data: data as any })
      return esistente.id
    }
    creati += 1
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const creato = await payload.create({ collection, context, data: data as any })
    return creato.id
  }

  // 1. corsi — gli orari dei centri ci puntano
  const idCorsi = new Map<string, number | string>()
  for (const corso of dati.corsi) {
    idCorsi.set(
      corso.slug,
      await upsert(
        'corsi',
        { slug: { equals: corso.slug } },
        { nome: corso.nome, slug: corso.slug, ordine: corso.ordine, target: corso.target },
        corso.slug,
      ),
    )
  }

  // 2. docenti — dedotti dalle stringhe degli accordion, deduplicati per nome
  const etichetteDocenti = [...new Set(dati.centri.flatMap((centro) => centro.docenti))]
  const idDocenti = new Map<string, number | string>()
  const ruoliSconosciuti: string[] = []
  for (const etichetta of etichetteDocenti) {
    const { nome, ruolo } = parseDocente(etichetta)
    if (!ruolo) {
      ruoliSconosciuti.push(etichetta)
      continue
    }
    idDocenti.set(etichetta, await upsert('docenti', { nome: { equals: nome } }, { nome, ruolo }, nome))
  }
  if (ruoliSconosciuti.length > 0) {
    throw new Error(
      `Docenti con ruolo non riconosciuto (correggerli in data/centri.json):\n  ${ruoliSconosciuti.join('\n  ')}`,
    )
  }

  // 3. centri
  for (const centro of dati.centri) {
    const orari = centro.orari.map((orario) => ({
      disciplina: idCorsi.get(dati.mappaturaDiscipline[orario.disciplina]),
      giorni: orario.giorni,
      note: orario.note,
      oraFine: orario.oraFine,
      oraInizio: orario.oraInizio,
    }))
    await upsert(
      'centri',
      { slug: { equals: centro.slug } },
      {
        attivo: centro.attivo,
        cap: centro.cap,
        citta: centro.citta,
        docenti: centro.docenti.map((etichetta) => idDocenti.get(etichetta)),
        indirizzo: centro.indirizzo,
        lat: centro.lat,
        lng: centro.lng,
        mapsUrl: centro.mapsUrl,
        nome: centro.nome,
        orari,
        palestra: centro.palestra,
        provincia: centro.provincia,
        slug: centro.slug,
      },
      centro.slug,
    )
  }

  console.log(
    dryRun
      ? '\nDry run: nessuna scrittura.'
      : `\nFatto: ${creati} creati, ${aggiornati} aggiornati.`,
  )
  process.exit(0)
}

main().catch((errore) => {
  console.error(errore instanceof Error ? errore.message : errore)
  process.exit(1)
})
