/**
 * Il 404 delle URL che non corrispondono a nessuna rotta. Next lo serve senza
 * passare da nessun layout, quindi il guscio del sito pubblico va rimontato a
 * mano: e' il prezzo dei due layout radice (pubblico e admin Payload).
 *
 * Il guscio ci sta e non si taglia: chi arriva da una vecchia URL WordPress
 * deve avere sotto gli occhi la testata, che e' la via d'uscita.
 */
import React from 'react'
import type { Metadata } from 'next'

import './(frontend)/token.css'
import './(frontend)/styles.css'

import { Piede, Testata } from './(frontend)/guscio'
import { NonTrovata, TITOLO } from './(frontend)/non-trovata'

export const metadata: Metadata = { title: TITOLO }

export default function GlobalNotFound() {
  return (
    <html lang="it">
      <body>
        <Testata />
        <main>
          <NonTrovata />
        </main>
        <Piede />
      </body>
    </html>
  )
}
