import { getPayload, type Field, type Payload } from 'payload'

import config from '@/payload.config'

/**
 * L'unico punto in cui le rotte pubbliche aprono Payload.
 *
 * Esiste per una ragione sola: `next build` prerenderizza tutte le pagine ISR
 * e per farlo interroga il database davvero. Nel rilascio su Coolify il
 * container che costruisce l'immagine non sta sulla rete dei servizi, e il
 * build si fermerebbe su «Failed to collect page data». Con `BUILD_SENZA_DB=1`
 * il build riceve un Payload che risponde vuoto, e le pagine si riempiono al
 * primo accesso: `revalidate` c'e' gia' su tutte. Vedi docs/adr/0013.
 *
 * Spenta la bandiera - build in locale, e ogni rilascio che il database ce
 * l'ha - qui non succede niente: si apre Payload e basta.
 */
const withoutDatabase =
  process.env.NEXT_PHASE === 'phase-production-build' && process.env.BUILD_SENZA_DB === '1'

/**
 * I valori che un global ha prima che qualcuno lo salvi.
 *
 * Non e' un'invenzione per il build: su un database appena migrato Payload
 * risponde esattamente cosi', ed e' lo stato in cui parte ogni primo rilascio.
 * Riprodurlo qui vuol dire che il guscio prerenderizzato ha il menu giusto, il
 * bottone giusto e il piede giusto; a mancare sono i soli dati di collection.
 *
 * ponytail: `row` e `group` e basta, che sono i contenitori che i nostri
 * global usano davvero. Un `tabs` in un global non verrebbe letto: se un
 * giorno servira', il caso si aggiunge qui.
 */
export function defaultValues(fields: Field[]): Record<string, unknown> {
  const doc: Record<string, unknown> = {}

  for (const field of fields) {
    // `row` non ha nome: i suoi campi stanno allo stesso livello del documento.
    if (!('name' in field)) {
      if ('fields' in field) Object.assign(doc, defaultValues(field.fields))
      continue
    }
    if ('defaultValue' in field && field.defaultValue !== undefined) {
      doc[field.name] = field.defaultValue
    } else if (field.type === 'group' && 'fields' in field) {
      doc[field.name] = defaultValues(field.fields)
    }
  }

  return doc
}

/** Le sole tre letture che le rotte pubbliche fanno. Le scritture stanno in
 *  `contatti/actions.ts`, che gira a runtime e non passa di qui. */
const isEmpty = {
  find: async () => ({
    docs: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 1,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  }),
  count: async () => ({ totalDocs: 0 }),
  findGlobal: async ({ slug }: { slug: string }) => {
    const global = (await config).globals.find((g) => g.slug === slug)
    return global ? defaultValues(global.fields) : {}
  },
} as unknown as Payload

export async function openPayload(): Promise<Payload> {
  if (withoutDatabase) return isEmpty
  return getPayload({ config: await config })
}
