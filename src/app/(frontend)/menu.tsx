'use client'
/**
 * Le voci di navigazione, in testata e nel piede.
 *
 * E' l'unico pezzo di guscio che sta sul client, e per una ragione sola: la
 * voce corrente si marca, e dove sei lo sa solo il browser. Le voci arrivano
 * gia' risolte, quindi `risolvi()` e le domande a Payload restano sul server.
 */
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import stile from './guscio.module.css'

export type Destinazione = { href: string; etichetta: string }

/**
 * La scheda di un centro sta dentro «Centri», e la marca insieme a lei: chi
 * legge `/centri/abbiategrasso` e' in quella sezione. La home fa eccezione
 * perche' `/` e' prefisso di tutto.
 */
export const corrente = (href: string, percorso: string) =>
  href === '/' ? percorso === '/' : percorso === href || percorso.startsWith(`${href}/`)

export const Menu = ({ etichetta, voci }: { etichetta: string; voci: Destinazione[] }) => {
  const percorso = usePathname()

  return (
    <nav aria-label={etichetta}>
      <ul className={stile.menu}>
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
    </nav>
  )
}
