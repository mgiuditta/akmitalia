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

/* Il dato sotto ogni voce e' un conteggio reale, non un sottotitolo scritto a
   mano: «presenza prima del marchio». Il verde sta solo sul dato vivo. */
function dati(c: ConteggiBarra): Record<string, Pick<VoceMenu, 'dato' | 'vivo'>> {
  return {
    '/corsi': { dato: `${c.corsi} ${c.corsi === 1 ? 'corso' : 'corsi'}` },
    '/centri': { dato: `${c.centri} attivi`, vivo: true },
    '/istruttori': {
      dato: `${c.istruttori} ${c.istruttori === 1 ? 'qualificato' : 'qualificati'}`,
    },
  }
}

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
    <header className="barra">
      <div className="contenitore barra__griglia">
        <Link className="barra__marchio" href="/">
          {stemma ? (
            <Image
              className="barra__stemma"
              src={stemma.url}
              alt=""
              width={36}
              height={36}
              priority
            />
          ) : null}
          <span className="barra__lockup">
            <span className="barra__nome">{marchio}</span>
            {paese ? <span className="barra__paese">{paese}</span> : null}
          </span>
        </Link>

        <nav className="barra__nav" aria-label="Principale">
          <ul className="barra__voci">
            {voci.map((voce) => (
              <li key={voce.href}>
                <Link className="barra__voce" href={voce.href}>
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
