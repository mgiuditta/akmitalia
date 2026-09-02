import Image from 'next/image'
import React from 'react'

import type { Media } from '@/payload-types'

/**
 * Uno slot immagine del sito. Riceve quello che Payload restituisce per un
 * campo `upload` e decide: se c'e' un file lo mostra, se non c'e' compone un
 * segnaposto.
 *
 * Il segnaposto non e' un rettangolo rotto e non e' un'icona di errore: e' una
 * superficie carbone con lo stemma in filigrana e scritto sopra che cosa ci va.
 * Serve a due lettori diversi e a entrambi dice il vero. Al visitatore dice che
 * li' andra' una fotografia e intanto non buca il ritmo della pagina; al
 * cliente, che apre il sito prima di aprire l'admin, dice quale campo compilare.
 *
 * Non e' in contrasto con la regola per cui una riga senza dato sparisce: quella
 * vale per un dato (un telefono, un orario), che se manca non esiste. Uno slot
 * editoriale invece esiste sempre, e' la composizione che lo prevede: toglierlo
 * cambierebbe la pagina, non la completerebbe.
 *
 * ponytail: nessuna variante di skeleton, nessun blur-up. Le immagini arrivano
 * dal disco del sito, non da una rete lenta.
 */

export type Slot = Media | number | null | undefined

/** Il formato dello slot. Decide l'aspect-ratio, del segnaposto e della foto. */
export type Formato = 'largo' | 'quadro' | 'ritratto' | 'banda'

const RITAGLIO: Record<Formato, string> = {
  largo: '16 / 9',
  quadro: '1 / 1',
  ritratto: '3 / 4',
  banda: '21 / 9',
}

/** La misura Payload piu' vicina al posto in cui lo slot vive. */
const MISURA = { piccola: 'thumbnail', media: 'card', grande: 'hero' } as const

export function urlMedia(slot: Slot, misura: keyof typeof MISURA = 'media') {
  if (typeof slot !== 'object' || slot === null) return null
  const nome = MISURA[misura]
  const sizes = slot.sizes as Record<string, { url?: string | null } | undefined> | undefined
  return sizes?.[nome]?.url || slot.url || null
}

export function Figura({
  slot,
  etichetta,
  formato = 'largo',
  misura = 'media',
  sizes = '100vw',
  priorita = false,
  classe,
}: {
  slot: Slot
  /** Che cosa ci va. Finisce nel segnaposto, scritto, quando lo slot e' vuoto. */
  etichetta: string
  formato?: Formato
  misura?: keyof typeof MISURA
  sizes?: string
  priorita?: boolean
  classe?: string
}) {
  const url = urlMedia(slot, misura)
  const alt = typeof slot === 'object' && slot ? slot.alt || '' : ''
  const ritaglio = RITAGLIO[formato]

  if (!url) {
    return (
      <div
        className={`segnaposto${classe ? ` ${classe}` : ''}`}
        style={{ aspectRatio: ritaglio }}
        /* E' un vuoto dichiarato, non un'immagine: chi legge con lo schermo
           sente l'etichetta una volta e non un file inesistente. */
        role="img"
        aria-label={`${etichetta}: immagine non ancora caricata`}
      >
        <span className="segnaposto__marca" aria-hidden="true">
          AKM
        </span>
        <span className="segnaposto__voce">{etichetta}</span>
      </div>
    )
  }

  return (
    <div className={`figura${classe ? ` ${classe}` : ''}`} style={{ aspectRatio: ritaglio }}>
      <Image
        className="figura__foto"
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priorita}
      />
    </div>
  )
}
