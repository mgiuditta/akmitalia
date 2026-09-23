import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Navigazione } from '@/payload-types'
import { Menu, type MenuItem } from '@/components/Menu'

/**
 * Barra fissa, nera e opaca a ogni posizione di scroll: nessun bordo, nessun
 * blur, chiusa in fondo dal filetto tricolore. Il marchio e' un lockup a due
 * piani in Roboto: lo stemma resta emblema e la scritta non usa Anton, che
 * sotto i 33px viola la Regola dello Stacco Netto di DESIGN.md.
 *
 * 77px su ogni breakpoint. Sopra i 1024px in riga stanno marchio, voci e CTA:
 * la riga e' server, senza JavaScript. Sotto, in riga restano marchio, CTA e
 * bottone del menu, e le voci vivono nel pannello di <Menu>. Le due
 * navigazioni esistono entrambe nel DOM ma mai insieme nell'albero di
 * accessibilita': il CSS spegne l'una o l'altra con display: none. Il perche'
 * del ritorno della riga, che docs/adr/0007 aveva tolto, sta in docs/adr/0008.
 *
 * Voci e CTA arrivano dal global Navigazione: il cliente le cambia dall'admin.
 * I conteggi sotto le voci del pannello restano un fatto del codice, abbinati
 * per indirizzo: una voce con un indirizzo sconosciuto non ha dato, e va bene.
 *
 * Il componente resta server: l'unico stato del sito pubblico e' l'apertura del
 * menu, e vive dentro <Menu>. Nessun indicatore di pagina attiva: l'H1 dice gia'
 * dove sei.
 */

export type HeaderCounts = {
  courses: number
  centers: number
  instructors: number
}

/*
 * Il dato sotto ogni voce e' un conteggio reale, non un sottotitolo scritto a
 * mano: «presenza prima del marchio». Il verde sta solo sul dato vivo.
 *
 * Lo zero non e' un dato: e' quello che risponde il guscio prerenderizzato di
 * un build senza database (docs/adr/0013) nel minuto che precede la prima
 * rigenerazione. «0 attivi» col quadrato verde di presenza sarebbe un dato vivo
 * inventato, e un centro chiuso non e' la stessa cosa di un centro che non
 * sappiamo. Senza dato, niente riga: e' la regola che il menu applicava gia'
 * alle voci senza conteggio.
 */
function data(c: HeaderCounts): Record<string, Pick<MenuItem, 'detail' | 'live'>> {
  const rows: Record<string, Pick<MenuItem, 'detail' | 'live'>> = {}
  if (c.courses > 0) rows['/corsi'] = { detail: `${c.courses} ${c.courses === 1 ? 'corso' : 'corsi'}` }
  if (c.centers > 0) rows['/centri'] = { detail: `${c.centers} attivi`, live: true }
  if (c.instructors > 0) {
    rows['/istruttori'] = {
      detail: `${c.instructors} ${c.instructors === 1 ? 'qualificato' : 'qualificati'}`,
    }
  }
  return rows
}

const TRICOLOR = ['green', 'white', 'red'] as const

export function SiteHeader({
  name,
  crest,
  counts,
  navigation,
}: {
  name: string
  crest?: { url: string; alt: string }
  counts: HeaderCounts
  navigation: Navigazione
}) {
  const [brandMark, ...rest] = name.split(' ')
  const countryName = rest.join(' ')

  const countsByRoute = data(counts)
  const items: MenuItem[] = (navigation.voci ?? []).map((v) => ({
    href: v.href,
    text: v.etichetta,
    ...countsByRoute[v.href.replace(/\/$/, '') || '/'],
  }))
  const cta = { href: navigation.cta.href, text: navigation.cta.etichetta }

  return (
    <header className="header">
      <div className="container header__grid">
        <Link className="header__logo" href="/">
          {crest ? (
            <Image
              className="header__crest"
              src={crest.url}
              alt=""
              width={36}
              height={36}
              priority
            />
          ) : null}
          <span className="header__lockup">
            {/* Tricolore del cliente (PRODUCT.md): una lettera per colore, senza
                spazi fra gli span, cosi' lo screen reader legge una parola sola. */}
            <span className="header__name">
              {[...brandMark].map((letter, i) => (
                <span key={i} className={`header__letter header__letter--${TRICOLOR[i % 3]}`}>
                  {letter}
                </span>
              ))}
            </span>
            {countryName ? <span className="header__country">{countryName}</span> : null}
          </span>
        </Link>

        <nav className="header__nav" aria-label="Principale">
          <ul className="header__items">
            {items.map((item) => (
              <li key={item.href}>
                <Link className="header__item" href={item.href}>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Menu items={items} cta={cta} />
      </div>
    </header>
  )
}
