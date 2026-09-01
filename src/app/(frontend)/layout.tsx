import React from 'react'
import './token.css'
import './styles.css'

import { Piede, Testata } from './guscio'

export const metadata = {
  title: 'AKM Italia',
  description: 'Il registro pubblico dei centri, degli istruttori e dei percorsi AKM Italia.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <Testata />
        <main>{children}</main>
        <Piede />
      </body>
    </html>
  )
}
