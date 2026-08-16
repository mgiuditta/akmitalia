import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Accademia Krav Maga Italia',
  title: 'AKM Italia',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="it">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
