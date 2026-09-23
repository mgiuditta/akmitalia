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
export type Format = 'wide' | 'square' | 'portrait' | 'band'

const CROP: Record<Format, string> = {
  wide: '16 / 9',
  square: '1 / 1',
  portrait: '3 / 4',
  band: '21 / 9',
}

/** La misura Payload piu' vicina al posto in cui lo slot vive. */
const SIZE = { piccola: 'thumbnail', media: 'card', grande: 'hero' } as const

export function urlMedia(slot: Slot, measure: keyof typeof SIZE = 'media') {
  if (typeof slot !== 'object' || slot === null) return null
  const name = SIZE[measure]
  const sizes = slot.sizes as Record<string, { url?: string | null } | undefined> | undefined
  return sizes?.[name]?.url || slot.url || null
}

export function Figure({
  slot,
  label,
  format = 'wide',
  measure = 'media',
  sizes = '100vw',
  priority = false,
  className,
}: {
  slot: Slot
  /** Che cosa ci va. Finisce nel segnaposto, scritto, quando lo slot e' vuoto. */
  label: string
  format?: Format
  measure?: keyof typeof SIZE
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const url = urlMedia(slot, measure)
  const alt = typeof slot === 'object' && slot ? slot.alt || '' : ''
  const caption = typeof slot === 'object' && slot ? slot.didascalia || '' : ''
  const crop = CROP[format]

  if (!url) {
    return (
      <div
        className={`placeholder${className ? ` ${className}` : ''}`}
        style={{ aspectRatio: crop }}
        /* E' un vuoto dichiarato, non un'immagine: chi legge con lo schermo
           sente l'etichetta una volta e non un file inesistente. */
        role="img"
        aria-label={`${label}: immagine non ancora caricata`}
      >
        <span className="placeholder__brand" aria-hidden="true">
          AKM
        </span>
        <span className="placeholder__item">{label}</span>
      </div>
    )
  }

  return (
    <figure className={`figure${className ? ` ${className}` : ''}`} style={{ aspectRatio: crop }}>
      <Image
        className="figure__photo"
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
      />
      {/* La didascalia si vede. Le fotografie di partenza sono generate
          (docs/adr/0012) e finora lo dicevano solo nel testo alternativo, cioe'
          a chi non le vede: sotto «Le qualifiche si contano» un istruttore
          generato si legge come un maestro dell'albo, e chi guarda ha diritto di
          sapere cos'e' che sta guardando quanto chi ascolta. Sta sovrapposta in
          fondo alla foto, che e' dove DESIGN.md §4 mette le didascalie, su una
          lastra piena: nessun velo, nessun vetro. */}
      {caption ? <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  )
}
