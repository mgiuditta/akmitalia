import type { MetadataRoute } from 'next'

import { openPayload } from '@/components/payload'
import { published, siteUrl } from '@/components/data'

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
  const base = siteUrl()
  const payload = await openPayload()

  const [courses, centers, pages, events] = await Promise.all([
    payload.find({
      collection: 'corsi',
      depth: 0,
      limit: 100,
      select: { slug: true, updatedAt: true },
      where: published,
    }),
    payload.find({
      collection: 'sedi',
      depth: 0,
      limit: 300,
      select: { slug: true, updatedAt: true },
      where: { and: [{ attivo: { equals: true } }, published] },
    }),
    payload.find({
      collection: 'pagine',
      depth: 0,
      limit: 500,
      select: { path: true, updatedAt: true },
      where: published,
    }),
    payload.find({
      collection: 'eventi',
      depth: 0,
      limit: 500,
      select: { slug: true, updatedAt: true },
      where: published,
    }),
  ])

  const fixed = ['', '/corsi', '/centri', '/istruttori', '/eventi', '/contatti'].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }))

  return [
    ...fixed,
    ...courses.docs.map((c) => ({
      url: `${base}/corsi/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
    })),
    ...centers.docs.map((s) => ({
      url: `${base}/centri/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : undefined,
    })),
    ...events.docs.map((e) => ({
      url: `${base}/eventi/${e.slug}`,
      lastModified: e.updatedAt ? new Date(e.updatedAt) : undefined,
    })),
    ...pages.docs
      .filter((p): p is typeof p & { path: string } => Boolean(p.path))
      .map((p) => ({
        url: `${base}${p.path}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      })),
  ]
}
