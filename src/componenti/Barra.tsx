import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Navigazione } from '@/payload-types'
import { Menu, type VoceMenu } from '@/componenti/Menu'

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

export type ConteggiBarra = {
  corsi: number
  centri: number
  istruttori: number
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
function dati(c: ConteggiBarra): Record<string, Pick<VoceMenu, 'dato' | 'vivo'>> {
  const righe: Record<string, Pick<VoceMenu, 'dato' | 'vivo'>> = {}
  if (c.corsi > 0) righe['/corsi'] = { dato: `${c.corsi} ${c.corsi === 1 ? 'corso' : 'corsi'}` }
  if (c.centri > 0) righe['/centri'] = { dato: `${c.centri} attivi`, vivo: true }
  if (c.istruttori > 0) {
    righe['/istruttori'] = {
      dato: `${c.istruttori} ${c.istruttori === 1 ? 'qualificato' : 'qualificati'}`,
    }
  }
  return righe
}

const TRICOLORE = ['green', 'white', 'red'] as const

export function Barra({
  nome,
  stemma,
  conteggi,
  navigazione,
}: {
  nome: string
  stemma?: { url: string; alt: string }
  conteggi: ConteggiBarra
  navigazione: Navigazione
}) {
  const [marchio, ...resto] = nome.split(' ')
  const paese = resto.join(' ')

  const conteggiPerRotta = dati(conteggi)
  const voci: VoceMenu[] = (navigazione.voci ?? []).map((v) => ({
    href: v.href,
    testo: v.etichetta,
    ...conteggiPerRotta[v.href.replace(/\/$/, '') || '/'],
  }))
  const cta = { href: navigazione.cta.href, testo: navigazione.cta.etichetta }

  return (
    <header className="header">
      <div className="container header__grid">
        <Link className="header__logo" href="/">
          {stemma ? (
            <Image
              className="header__crest"
              src={stemma.url}
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
              {[...marchio].map((lettera, i) => (
                <span key={i} className={`header__letter header__letter--${TRICOLORE[i % 3]}`}>
                  {lettera}
                </span>
              ))}
            </span>
            {paese ? <span className="header__country">{paese}</span> : null}
          </span>
        </Link>

        <nav className="header__nav" aria-label="Principale">
          <ul className="header__items">
            {voci.map((voce) => (
              <li key={voce.href}>
                <Link className="header__item" href={voce.href}>
                  {voce.testo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Menu voci={voci} cta={cta} />
      </div>
    </header>
  )
}
