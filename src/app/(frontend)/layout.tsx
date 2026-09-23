import type { Metadata } from 'next'
import React from 'react'

import { SiteHeader } from '@/components/SiteHeader'
import { jsonLd, provinceName, published, siteUrl } from '@/components/data'
import { SiteFooter } from '@/components/SiteFooter'
import { openPayload } from '@/components/payload'
import './styles.css'

/** Guscio del sito pubblico: legge i globali una volta e li passa a barra e footer. */
async function shell() {
  const payload = await openPayload()

  const [settings, contacts, navigation, centers, courses, instructors] = await Promise.all([
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
    payload.findGlobal({ slug: 'contatti', depth: 0 }),
    payload.findGlobal({ slug: 'navigazione', depth: 0 }),
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
    payload.count({ collection: 'corsi', where: published }),
    payload.count({ collection: 'istruttori', where: published }),
  ])

  return {
    impostazioni: settings,
    contatti: contacts,
    navigazione: navigation,
    sedi: centers.docs,
    conteggi: {
      courses: courses.totalDocs,
      centers: centers.totalDocs,
      instructors: instructors.totalDocs,
    },
  }
}

/**
 * Il footer elenca i comuni raggruppati per provincia, non i centri: tre centri
 * di Milano fanno una voce sola, e la provincia e' scritta per esteso perche' e'
 * quella la parola che qualcuno cerca.
 *
 * Le sedi senza provincia finiscono in un gruppo senza intestazione invece di
 * sparire: un comune senza sigla resta un posto dove si pratica.
 */
function townsByProvince(
  centers: { indirizzo?: { citta?: string | null; provincia?: string | null } | null }[],
) {
  const groups = new Map<string, Set<string>>()
  for (const s of centers) {
    const town = s.indirizzo?.citta
    if (!town) continue
    const province = provinceName(s.indirizzo?.provincia)
    const towns = groups.get(province) ?? new Set<string>()
    towns.add(town)
    groups.set(province, towns)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'it'))
    .map(([province, towns]) => ({
      province,
      towns: [...towns].sort((a, b) => a.localeCompare(b, 'it')),
    }))
}

const DESCRIPTION =
  'Krav Maga a Milano e provincia: centri tecnici con orari e istruttori, corsi per adulti, ragazzi e donne. Trova il centro piu vicino e chiedi una prova.'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await openPayload()
  const settings = await payload.findGlobal({ slug: 'impostazioni', depth: 0 })
  const name = settings?.siteName || 'AKM Italia'
  const title = `${name} · Krav Maga e difesa personale`

  /* Nessuna `images` qui: la porta opengraph-image.tsx, che vale per ogni rotta
     e legge l'immagine caricata in Impostazioni. Dichiarata qui sarebbe finita
     sulla sola home, perche' l'openGraph di una pagina figlia sostituisce
     quello del layout invece di fondersi. */
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s · ${name}` },
    description: DESCRIPTION,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      siteName: name,
      title,
      description: DESCRIPTION,
      url: '/',
    },
    twitter: { card: 'summary_large_image', title, description: DESCRIPTION },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { impostazioni: settings, contatti: contacts, navigazione: navigation, sedi: centers, conteggi: counts } = await shell()

  const name = settings?.siteName || 'AKM Italia'
  const logo = typeof settings?.logo === 'object' ? settings.logo : null
  const crest = logo?.url ? { url: logo.sizes?.thumbnail?.url || logo.url, alt: logo.alt || '' } : undefined

  /* Un'organizzazione sportiva con 15 palestre fisiche e' esattamente il caso
     d'uso di schema.org: senza questo, per un motore di ricerca il sito e' un
     testo qualsiasi. Le sedi hanno il loro SportsActivityLocation sulla scheda. */
  const base = siteUrl()
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: settings?.datiFiscali?.ragioneSociale || name,
    alternateName: name,
    url: base,
    logo: logo?.url ? `${base}${logo.url}` : undefined,
    sport: 'Krav Maga',
    email: contacts?.email || undefined,
    telephone: contacts?.telefono || undefined,
    areaServed: [...new Set(centers.map((s) => s.indirizzo?.citta).filter(Boolean))],
  }

  return (
    <html lang="it">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organization) }}
        />
        <a className="skip" href="#contenuto">
          Salta al contenuto
        </a>
        <SiteHeader name={name} crest={crest} counts={counts} navigation={navigation} />
        <main id="contenuto">{children}</main>
        <SiteFooter
          name={name}
          text={settings?.testoFooter}
          provinces={townsByProvince(centers)}
          contacts={{ email: contacts?.email, phone: contacts?.telefono }}
          companyName={settings?.datiFiscali?.ragioneSociale}
          vatNumber={settings?.datiFiscali?.partitaIva}
          legal={(navigation?.piede ?? []).map((l) => ({ label: l.etichetta, href: l.href }))}
        />
      </body>
    </html>
  )
}
