import type { Metadata } from 'next'
import { getPayload } from 'payload'
import React from 'react'

import { Barra } from '@/componenti/Barra'
import { pubblicato, sitoUrl } from '@/componenti/dati'
import { Pie } from '@/componenti/Pie'
import config from '@/payload.config'
import './styles.css'

/** Guscio del sito pubblico: legge i globali una volta e li passa a barra e footer. */
async function guscio() {
  const payload = await getPayload({ config: await config })

  const [impostazioni, contatti, sedi, corsi, istruttori] = await Promise.all([
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
    payload.findGlobal({ slug: 'contatti', depth: 0 }),
    payload.find({
      collection: 'sedi',
      depth: 0,
      limit: 200,
      sort: 'nome',
      // La Local API ignora l'access control: il filtro sul pubblicato va scritto.
      where: { and: [{ attivo: { equals: true } }, { _status: { equals: 'published' } }] },
      select: { nome: true, indirizzo: true },
    }),
    // Due conteggi per il menu. Quello dei centri e' gia' in totalDocs qui sopra.
    payload.count({ collection: 'corsi', where: pubblicato }),
    payload.count({ collection: 'istruttori', where: pubblicato }),
  ])

  return {
    impostazioni,
    contatti,
    sedi: sedi.docs,
    conteggi: {
      corsi: corsi.totalDocs,
      centri: sedi.totalDocs,
      istruttori: istruttori.totalDocs,
    },
  }
}

/**
 * Il footer elenca i comuni, non i centri: tre centri di Milano fanno una riga sola.
 * Quando /centri esistera' queste voci diventano link alla scheda.
 */
function citta(sedi: { nome: string; indirizzo?: { citta?: string | null; provincia?: string | null } | null }[]) {
  const viste = new Map<string, { nome: string; citta: string; provincia?: string | null }>()
  for (const s of sedi) {
    const nome = s.indirizzo?.citta
    if (!nome) continue
    const chiave = `${nome}|${s.indirizzo?.provincia ?? ''}`
    if (!viste.has(chiave)) {
      viste.set(chiave, { nome: chiave, citta: nome, provincia: s.indirizzo?.provincia })
    }
  }
  return [...viste.values()]
}

const DESCRIZIONE =
  'Krav Maga a Milano e provincia: centri tecnici con orari e istruttori, corsi per adulti, ragazzi e donne. Trova il centro piu vicino e chiedi una prova.'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: await config })
  const impostazioni = await payload.findGlobal({ slug: 'impostazioni', depth: 1 })
  const nome = impostazioni?.siteName || 'AKM Italia'
  const titolo = `${nome} · Krav Maga e difesa personale`
  const og = typeof impostazioni?.ogImage === 'object' ? impostazioni.ogImage : null
  const ogUrl = og?.sizes?.card?.url || og?.url || null

  return {
    metadataBase: new URL(sitoUrl()),
    title: { default: titolo, template: `%s · ${nome}` },
    description: DESCRIZIONE,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      siteName: nome,
      title: titolo,
      description: DESCRIZIONE,
      url: '/',
      images: ogUrl ? [{ url: ogUrl, alt: og?.alt || nome }] : undefined,
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { impostazioni, contatti, sedi, conteggi } = await guscio()

  const nome = impostazioni?.siteName || 'AKM Italia'
  const logo = typeof impostazioni?.logo === 'object' ? impostazioni.logo : null
  const stemma = logo?.url ? { url: logo.sizes?.thumbnail?.url || logo.url, alt: logo.alt || '' } : undefined

  /* Un'organizzazione sportiva con 15 palestre fisiche e' esattamente il caso
     d'uso di schema.org: senza questo, per un motore di ricerca il sito e' un
     testo qualsiasi. Le sedi hanno il loro SportsActivityLocation sulla scheda. */
  const base = sitoUrl()
  const ente = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: impostazioni?.datiFiscali?.ragioneSociale || nome,
    alternateName: nome,
    url: base,
    logo: logo?.url ? `${base}${logo.url}` : undefined,
    sport: 'Krav Maga',
    email: contatti?.email || undefined,
    telephone: contatti?.telefono || undefined,
    areaServed: [...new Set(sedi.map((s) => s.indirizzo?.citta).filter(Boolean))],
  }

  return (
    <html lang="it">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ente) }}
        />
        <a className="salta" href="#contenuto">
          Salta al contenuto
        </a>
        <Barra nome={nome} stemma={stemma} conteggi={conteggi} />
        <main id="contenuto">{children}</main>
        <Pie
          nome={nome}
          testo={impostazioni?.testoFooter}
          centri={citta(sedi)}
          contatti={{ email: contatti?.email, telefono: contatti?.telefono }}
          ragioneSociale={impostazioni?.datiFiscali?.ragioneSociale}
          partitaIva={impostazioni?.datiFiscali?.partitaIva}
        />
      </body>
    </html>
  )
}
