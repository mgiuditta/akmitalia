/**
 * Testata e footer, gli unici due pezzi presenti su ogni pagina (#22).
 *
 * La navigazione e' editoriale — vive in `Impostazioni`, si riordina
 * trascinando — ma con un **nucleo fisso**: cio' che regge la conversione non
 * si espone a un errore di distrazione nell'admin, come `Richieste` non si
 * espone a una modifica a mano.
 */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Impostazioni, Contatti, Pagine } from '@/payload-types'

import stemma from './stemma.png'
import stile from './guscio.module.css'

type Voce = NonNullable<NonNullable<Impostazioni['navigazione']>['menu']>[number]

/** Le sezioni che sono codice, non contenuto. L'enum di `Impostazioni` le rispecchia. */
const ROTTE = {
  home: { href: '/', etichetta: 'Home' },
  centri: { href: '/centri', etichetta: 'Centri' },
  contatta: { href: '/contatta', etichetta: 'Contatta' },
} as const

/**
 * Il nucleo che non si toglie dall'admin.
 * ponytail: «contatta» entra qui quando la pagina esistera' (#19). Metterla
 * oggi sarebbe una voce di menu che porta a un 404.
 */
const NUCLEO: (keyof typeof ROTTE)[] = ['centri']

/** Torna `null` per una voce non risolvibile: una pagina cancellata sparisce, non rompe. */
export const risolvi = (v: Voce): { href: string; etichetta: string } | null => {
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

/** Il separatore lo mette il join, non la riga: un dato mancante non lascia un «·» orfano. */
const dati = (d: Impostazioni['datiFiscali']) =>
  [
    d?.ragioneSociale,
    d?.codiceFiscale && `C.F. ${d.codiceFiscale}`,
    d?.partitaIva && `P.IVA ${d.partitaIva}`,
  ]
    .filter(Boolean)
    .join(' · ')

const Voci = ({ voci }: { voci: Voce[] }) =>
  voci.map(risolvi).flatMap((r, i) =>
    r ? (
      <li key={i}>
        <Link href={r.href}>{r.etichetta}</Link>
      </li>
    ) : (
      []
    ),
  )

const impostazioni = async () => {
  const payload = await getPayload({ config: await config })
  const [imp, con] = await Promise.all([
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
    payload.findGlobal({ slug: 'contatti', depth: 0 }),
  ])
  return { imp: imp as Impostazioni, con: con as Contatti }
}

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
      <nav aria-label="Principale">
        <ul className={stile.menu}>
          {NUCLEO.map((r) => (
            <li key={r}>
              <Link href={ROTTE[r].href}>{ROTTE[r].etichetta}</Link>
            </li>
          ))}
          <Voci voci={imp.navigazione?.menu ?? []} />
        </ul>
      </nav>
    </header>
  )
}

export const Piede = async () => {
  const { imp, con } = await impostazioni()
  const social = (con.social ?? []).filter((s) => s.url)

  return (
    <footer className={stile.piede}>
      {imp.testoFooter ? <p className={stile.testo}>{imp.testoFooter}</p> : null}

      {imp.navigazione?.piede?.length ? (
        <nav aria-label="Footer">
          <ul className={stile.menu}>
            <Voci voci={imp.navigazione.piede} />
          </ul>
        </nav>
      ) : null}

      {social.length ? (
        <ul className={stile.menu}>
          {social.map((s, i) => (
            <li key={i}>
              <a href={s.url} rel="me noopener">
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
