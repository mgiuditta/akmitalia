import type { MetadataRoute } from 'next'

import { sitoUrl } from '@/componenti/dati'

/** L'admin e le API di Payload non sono contenuto pubblico e non vanno indicizzate. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${sitoUrl()}/sitemap.xml`,
  }
}
