import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Menu, type VoceMenu } from '@/componenti/Menu'

/**
 * Barra fissa, nera e opaca a ogni posizione di scroll: nessun bordo, nessun
 * blur, chiusa in fondo dal filetto tricolore. Il marchio e' un lockup a due
 * piani in Roboto: lo stemma resta emblema e la scritta non usa Anton, che
 * sotto i 33px viola la Regola dello Stacco Netto di DESIGN.md.
 *
 * 77px su ogni breakpoint, e in riga tre cose sole: marchio, CTA e bottone del
 * menu. Le voci non sono mai in barra - vivono nel pannello di <Menu>, che
 * sopra i 700px e' un foglio da destra e sotto copre lo schermo. La barra resta
 * una firma invece di diventare un pannello. Il perche' sta in docs/adr/0007,
 * che estende al desktop la decisione presa in docs/adr/0006 per il telefono.
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
function vociMenu(c: ConteggiBarra): VoceMenu[] {
  return [
    { href: '/corsi', testo: 'Percorsi', dato: `${c.corsi} ${c.corsi === 1 ? 'corso' : 'corsi'}` },
    { href: '/centri', testo: 'Centri', dato: `${c.centri} attivi`, vivo: true },
    {
      href: '/istruttori',
      testo: 'Istruttori',
      dato: `${c.istruttori} ${c.istruttori === 1 ? 'qualificato' : 'qualificati'}`,
    },
  ]
}

export function Barra({
  nome,
  stemma,
  conteggi,
}: {
  nome: string
  stemma?: { url: string; alt: string }
  conteggi: ConteggiBarra
}) {
  const [marchio, ...resto] = nome.split(' ')
  const paese = resto.join(' ')

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

        <Menu voci={vociMenu(conteggi)} cta={{ href: '/centri', testo: 'Trova un centro' }} />
      </div>
    </header>
  )
}
