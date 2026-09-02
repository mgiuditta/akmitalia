import type { MetadataRoute } from 'next'

import { apriPayload } from '@/componenti/payload'
import { pubblicato, sitoUrl } from '@/componenti/dati'

/**
 * La sitemap elenca le stesse rotte che il sito espone, niente di piu': le
 * pagine fisse, le schede pubblicate di corsi, centri ed eventi, e le pagine editoriali
 * che passano dalla rotta `[...path]` (docs/adr/0011). Un centro non attivo
 * resta pubblicato ma sparisce dagli elenchi, quindi sparisce anche da qui.
 *
 * ponytail: nessuna priorita' e nessuna frequenza. Google le ignora da anni e
 * ogni valore inventato sarebbe rumore.
 */

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = sitoUrl()
  const payload = await apriPayload()

  const [corsi, sedi, pagine, eventi] = await Promise.all([
    payload.find({
      collection: 'corsi',
      depth: 0,
      limit: 100,
      select: { slug: true, updatedAt: true },
      where: pubblicato,
    }),
    payload.find({
      collection: 'sedi',
      depth: 0,
      limit: 300,
      select: { slug: true, updatedAt: true },
      where: { and: [{ attivo: { equals: true } }, pubblicato] },
    }),
    payload.find({
      collection: 'pagine',
      depth: 0,
      limit: 500,
      select: { path: true, updatedAt: true },
      where: pubblicato,
    }),
    payload.find({
      collection: 'eventi',
      depth: 0,
      limit: 500,
      select: { slug: true, updatedAt: true },
      where: pubblicato,
    }),
  ])

  const fisse = ['', '/corsi', '/centri', '/istruttori', '/eventi', '/contatti'].map((rotta) => ({
    url: `${base}${rotta}`,
    lastModified: new Date(),
  }))

  return [
    ...fisse,
    ...corsi.docs.map((c) => ({
      url: `${base}/corsi/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
    })),
    ...sedi.docs.map((s) => ({
      url: `${base}/centri/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : undefined,
    })),
    ...eventi.docs.map((e) => ({
      url: `${base}/eventi/${e.slug}`,
      lastModified: e.updatedAt ? new Date(e.updatedAt) : undefined,
    })),
    ...pagine.docs
      .filter((p): p is typeof p & { path: string } => Boolean(p.path))
      .map((p) => ({
        url: `${base}${p.path}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      })),
  ]
}
