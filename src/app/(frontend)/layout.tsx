import React from 'react'
import './token.css'
import './styles.css'

export const metadata = {
  title: 'AKM Italia',
  description: 'Il registro pubblico dei centri, degli istruttori e dei percorsi AKM Italia.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
