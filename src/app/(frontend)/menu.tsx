'use client'
/**
 * Le voci di navigazione, in testata e nel piede.
 *
 * E' l'unico pezzo di guscio che sta sul client, e per due ragioni: la voce
 * corrente si marca, e dove sei lo sa solo il browser; e sotto i 640px la
 * testata ha un panino, che e' uno stato.
 */
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import stile from './guscio.module.css'

export type Destinazione = { href: string; etichetta: string }

/** L'id che lega il pulsante al menu che apre. Ce n'e' uno solo per pagina. */
const MENU = 'menu-principale'

/**
 * La scheda di un centro sta dentro «Centri», e la marca insieme a lei: chi
 * legge `/centri/abbiategrasso` e' in quella sezione. La home fa eccezione
 * perche' `/` e' prefisso di tutto.
 */
export const corrente = (href: string, percorso: string) =>
  href === '/' ? percorso === '/' : percorso === href || percorso.startsWith(`${href}/`)

/**
 * `panino` distingue le due testate: quella in alto ha un pulsante sotto i
 * 640px, il piede non ne ha bisogno perche' e' gia' in colonna e non compete
 * con nulla per lo spazio.
 */
export const Menu = ({
  etichetta,
  voci,
  panino = false,
}: {
  etichetta: string
  voci: Destinazione[]
  panino?: boolean
}) => {
  const percorso = usePathname()
  const [aperto, apri] = React.useState(false)
  const pulsante = React.useRef<HTMLButtonElement>(null)

  /* Il click sull'elenco chiude: la voce porta via dalla pagina, e trovare il
     pannello ancora aperto all'arrivo e' un residuo, non uno stato. */
  const elenco = (
    <ul className={stile.menu} id={panino ? MENU : undefined} onClick={() => apri(false)}>
      {voci.map((v, i) => (
        <li key={`${v.href}-${i}`}>
          <Link
            aria-current={corrente(v.href, percorso) ? 'page' : undefined}
            className={stile.voce}
            href={v.href}
          >
            {v.etichetta}
          </Link>
        </li>
      ))}
    </ul>
  )

  if (!panino) return <nav aria-label={etichetta}>{elenco}</nav>

  /* Pulsante e `nav` sono fratelli, non annidati: sotto i 640px vanno su due
     righe diverse della testata, e un `nav` che contenesse il pulsante non
     potrebbe stare sulla riga di sotto senza portarselo dietro. */
  return (
    <>
      <button
        aria-controls={MENU}
        aria-expanded={aperto}
        aria-label={aperto ? 'Chiudi il menu' : 'Apri il menu'}
        className={stile.panino}
        onClick={() => apri(!aperto)}
        ref={pulsante}
        type="button"
      >
        {/* `aria-hidden`: il nome del controllo e' gia' sul pulsante, e il
            disegno non aggiunge nulla da leggere. Tratto a 2px come le righe
            spesse del sistema, `currentColor` per ereditare l'inchiostro. */}
        <svg
          aria-hidden="true"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="square"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
        >
          {aperto ? (
            <path d="M5 5 19 19M19 5 5 19" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Esc chiude e riporta il fuoco al pulsante: chi apre con la tastiera
          non resta con il fuoco su un elemento che e' appena sparito. */}
      <nav
        aria-label={etichetta}
        className={stile.nav}
        data-aperto={aperto || undefined}
        onKeyDown={(e) => {
          if (e.key !== 'Escape') return
          apri(false)
          pulsante.current?.focus()
        }}
      >
        {elenco}
      </nav>
    </>
  )
}
