/**
 * Testata e footer, gli unici due pezzi presenti su ogni pagina (#22).
 *
 * La navigazione e' editoriale — vive in `Impostazioni`, si riordina
 * trascinando — ma con un **nucleo fisso** sopra e sotto: cio' che regge la
 * conversione e cio' che la legge impone non si espongono a un errore di
 * distrazione nell'admin, come `Richieste` non si espone a una modifica a mano.
 */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Impostazioni, Contatti, Pagine } from '@/payload-types'

import { Menu, type Destinazione } from './menu'
import stemma from './stemma.png'
import stile from './guscio.module.css'

type Voce = NonNullable<NonNullable<Impostazioni['navigazione']>['menu']>[number]

/** Le sezioni che sono codice, non contenuto. L'enum di `Impostazioni` le rispecchia. */
const ROTTE = {
  home: { href: '/', etichetta: 'Home' },
  centri: { href: '/centri', etichetta: 'Centri' },
  contatta: { href: '/contatta', etichetta: 'Contatta' },
  istruttori: { href: '/istruttori', etichetta: 'Istruttori' },
  privacy: { href: '/privacy', etichetta: 'Privacy' },
} as const

type Rotta = keyof typeof ROTTE

/**
 * Due nuclei, e sono due domande diverse (#29).
 *
 * Sopra sta la conversione, e nient'altro: la testata non e' una mappa del
 * sito, e' la barra che porta al dove e all'esito misurato. Il nucleo sta su
 * una riga anche a 320px, ma il nucleo non e' tutta la testata: `voci()` gli
 * accoda le voci editoriali, e quelle non hanno tetto. Sotto i 640px il menu
 * va quindi dietro un pulsante, che regge due voci come nove.
 *
 * Sotto sta cio' che deve esistere sempre: l'albo, che e' prova e non
 * orientamento, e l'informativa, che il cliente non puo' togliere per sbaglio.
 */
const NUCLEO: Rotta[] = ['centri', 'contatta']
const NUCLEO_PIEDE: Rotta[] = ['istruttori', 'privacy']

/** Torna `null` per una voce non risolvibile: una pagina cancellata sparisce, non rompe. */
export const risolvi = (v: Voce): Destinazione | null => {
  if (v.tipo === 'rotta' && v.rotta) {
    return { href: ROTTE[v.rotta].href, etichetta: v.etichetta || ROTTE[v.rotta].etichetta }
  }
  if (v.tipo === 'esterna' && v.url) return { href: v.url, etichetta: v.etichetta || v.url }
  if (v.tipo === 'interna' && v.pagina && typeof v.pagina === 'object') {
    const p = v.pagina as Pagine
    return p.path ? { href: p.path, etichetta: v.etichetta || p.titolo } : null
  }
  return null
}

/** Il nucleo davanti, l'editoriale dietro: l'ordine dell'admin non sposta la conversione. */
const voci = (nucleo: Rotta[], editoriali: Voce[] = []): Destinazione[] => [
  ...nucleo.map((r) => ROTTE[r]),
  ...editoriali.map(risolvi).filter((d): d is Destinazione => d !== null),
]

/** Il separatore lo mette il join, non la riga: un dato mancante non lascia un «·» orfano. */
const dati = (d: Impostazioni['datiFiscali']) =>
  [
    d?.ragioneSociale,
    d?.codiceFiscale && `C.F. ${d.codiceFiscale}`,
    d?.partitaIva && `P.IVA ${d.partitaIva}`,
  ]
    .filter(Boolean)
    .join(' · ')

/**
 * `cache` perche' testata e piede vivono su ogni pagina e chiedono le stesse
 * due cose: senza, sono quattro `findGlobal` per pagina invece di due.
 */
const impostazioni = React.cache(async () => {
  const payload = await getPayload({ config: await config })
  const [imp, con] = await Promise.all([
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
    payload.findGlobal({ slug: 'contatti', depth: 0 }),
  ])
  return { imp: imp as Impostazioni, con: con as Contatti }
})

export const Testata = async () => {
  const { imp } = await impostazioni()

  return (
    <header className={stile.testata}>
      {/* Lockup stemma + wordmark (#23, ADR 0004). Lo stemma da' il
          riconoscimento, il testo porta il nome: a 40px il microtesto
          dell'anello non si legge, e non deve, perche' non e' li' che il nome
          e' scritto. `alt` vuoto apposta: il nome e' gia' nel testo accanto,
          e ripeterlo lo farebbe leggere due volte a uno screen reader. */}
      <Link className={stile.wordmark} href="/">
        <Image alt="" className={stile.stemma} priority sizes="40px" src={stemma} />
        {imp.siteName}
      </Link>
      <Menu etichetta="Principale" panino voci={voci(NUCLEO, imp.navigazione?.menu ?? [])} />
    </header>
  )
}

export const Piede = async () => {
  const { imp, con } = await impostazioni()
  const social = (con.social ?? []).filter((s) => s.url)

  return (
    <footer className={stile.piede}>
      {imp.testoFooter ? <p className={stile.testo}>{imp.testoFooter}</p> : null}

      <Menu etichetta="Secondaria" voci={voci(NUCLEO_PIEDE, imp.navigazione?.piede ?? [])} />

      {social.length ? (
        <ul className={stile.menu}>
          {social.map((s, i) => (
            <li key={i}>
              <a className={stile.voce} href={s.url} rel="me noopener">
                {s.rete}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {/* I dati fiscali stanno qui e in un posto solo: duplicarli in un array
          editoriale sarebbe un secondo posto dove sbagliarli. */}
      <p className={stile.dati}>{dati(imp.datiFiscali)}</p>
    </footer>
  )
}
