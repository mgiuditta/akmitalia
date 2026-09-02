import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { pubblicato, sitoUrl } from '@/componenti/dati'

/**
 * La sitemap elenca le stesse rotte che il sito espone, niente di piu': le sei
 * pagine fisse e le schede pubblicate di corsi e centri. Un centro non attivo
 * resta pubblicato ma sparisce dagli elenchi, quindi sparisce anche da qui.
 *
 * ponytail: nessuna priorita' e nessuna frequenza. Google le ignora da anni e
 * ogni valore inventato sarebbe rumore.
 */

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = sitoUrl()
  const payload = await getPayload({ config: await config })

  const [corsi, sedi] = await Promise.all([
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
  ])

  const fisse = ['', '/corsi', '/centri', '/istruttori'].map((rotta) => ({
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
  ]
}
