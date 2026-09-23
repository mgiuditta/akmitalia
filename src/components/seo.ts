import type { Metadata } from 'next'

/**
 * I metadati di una rotta pubblica, in un posto solo.
 *
 * Serve perche' Next non fonde `openGraph`: lo sostituisce. Una pagina che
 * dichiarava solo `title` e `description` ereditava dal layout l'openGraph
 * della home, quindi ogni scheda di centro condivisa diceva «AKM Italia» e
 * puntava a «/». Qui il titolo social si compone a mano - il `template` del
 * layout vale sul solo `<title>`, non sull'og:title - e l'indirizzo e' quello
 * della pagina.
 *
 * L'immagine non si dichiara: la porta `opengraph-image.tsx`, che vale per
 * tutte le rotte e legge quella caricata dall'admin.
 */
const NAME = 'AKM Italia'

export function pageMetadata({
  titolo: title,
  descrizione,
  path,
}: {
  titolo: string
  descrizione: string
  path: string
}): Metadata {
  const social = `${title} · ${NAME}`

  return {
    title,
    description: descrizione,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      siteName: NAME,
      title: social,
      description: descrizione,
      url: path,
    },
    twitter: { card: 'summary_large_image', title: social, description: descrizione },
  }
}
