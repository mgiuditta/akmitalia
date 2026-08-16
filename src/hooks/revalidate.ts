import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Revalidation on-demand: il cliente salva e il sito è aggiornato subito,
 * senza aspettare la scadenza dell'ISR.
 *
 * `context.disableRevalidate` permette a seed e script di scrivere senza
 * rigenerare nulla — e impedisce i loop quando un hook ne innesca un altro.
 *
 * ponytail: si rigenera anche salvando una bozza. La pagina rilegge il
 * pubblicato, quindi nel peggiore dei casi si è speso un render.
 */

type ConSlug = { slug?: null | string }

const rigenera = (percorsi: string[]) => {
  new Set(percorsi).forEach((percorso) => revalidatePath(percorso))
}

export const revalidaCollezione = <T extends ConSlug>(
  percorsi: (doc: T) => string[],
): { afterChange: CollectionAfterChangeHook[]; afterDelete: CollectionAfterDeleteHook[] } => ({
  afterChange: [
    ({ doc, previousDoc, req: { context } }) => {
      if (!context.disableRevalidate) {
        // Anche i percorsi vecchi: se lo slug cambia, la vecchia URL va invalidata.
        rigenera([...percorsi(doc as T), ...(previousDoc ? percorsi(previousDoc as T) : [])])
      }
      return doc
    },
  ],
  afterDelete: [
    ({ doc, req: { context } }) => {
      if (!context.disableRevalidate) {
        rigenera(percorsi(doc as T))
      }
      return doc
    },
  ],
})

export const revalidaGlobal = (...percorsi: string[]): { afterChange: GlobalAfterChangeHook[] } => ({
  afterChange: [
    ({ doc, req: { context } }) => {
      if (!context.disableRevalidate) {
        rigenera(percorsi)
      }
      return doc
    },
  ],
})

/**
 * Per i globals che finiscono nel layout (logo, footer, contatti): cambia una riga,
 * cambiano tutte le pagine. Si rigenera tutto — sono modifiche rarissime.
 */
export const revalidaLayout = (): { afterChange: GlobalAfterChangeHook[] } => ({
  afterChange: [
    ({ doc, req: { context } }) => {
      if (!context.disableRevalidate) {
        revalidatePath('/', 'layout')
      }
      return doc
    },
  ],
})
