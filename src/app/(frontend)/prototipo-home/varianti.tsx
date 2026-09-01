/**
 * PROTOTIPO USA E GETTA — issue #17, «La home: il bivio e la prova».
 *
 * Tre home che non sono d'accordo su **cosa viene prima** e su **quale prova**:
 *
 *   A — il bivio secco: la domanda in cima, e la prova dentro la riga del bivio.
 *   B — l'albo aperto: la settimana vera per prima, il bivio dopo la prova.
 *   C — il posto prima del percorso: i 15 comuni per primi, il bivio dopo.
 *
 * Il copy e' **bozza marcata**: i fatti (comuni, turni, qualifiche) vengono da
 * Payload o dai campi `prova` gia' importati da #16, mai inventati qui.
 */
import React from 'react'
import Link from 'next/link'

import type { Sedi as Sede } from '@/payload-types'

import { GIORNO_LUNGO, Percorso, comune, palestra, turni, viaCorta } from '../centri/sede'
import type { Turno, Voce } from './dati'
import stile from './varianti.module.css'

export const nomeA = 'Il bivio secco'
export const nomeB = "L'albo aperto"
export const nomeC = 'Il posto prima del percorso'

export type Props = {
  voci: Voce[]
  settimana: [string, Turno[]][]
  sedi: Sede[]
  comuni: string[]
  slot: number
}

/** La prova attaccata a una voce del bivio: dove quel corso e' davvero in programma. */
function Programma({ v }: { v: Voce }) {
  if (!v.attive.length)
    return (
      <span className={stile.assente}>
        Nessun centro lo tiene in questa stagione. Scrivici: ti diciamo se e dove riparte.
      </span>
    )
  const primi = v.comuni.slice(0, 4).join(', ')
  return (
    <span className={stile.programma}>
      {v.attive.length} {v.attive.length === 1 ? 'centro' : 'centri'}: {primi}
      {v.comuni.length > 4 ? ` e altri ${v.comuni.length - 4}` : ''}
    </span>
  )
}

/* ------------------------------------------------------------------ A ----- */

/**
 * Il bivio e' la pagina. Nessuna riga di orientamento sopra: la prima cosa che
 * si legge e' la domanda, e la prova sta dentro la riga che la porta, non in una
 * sezione sua. Sotto, una sola riga di presenza e una sola di credenziali.
 */
export function VarianteA({ voci, comuni, slot }: Props) {
  return (
    <div className={stile.a}>
      <h1 className={stile.aTitolo}>Qual è il tuo momento?</h1>

      <ul className={stile.aBivio}>
        {voci.map((v) => (
          <li key={v.corso.id}>
            <Link className={stile.aVoce} href={`/corsi/${v.corso.slug}`}>
              <span className={stile.aDomanda}>{v.corso.domanda}</span>
              <span className={stile.aRiga}>
                <Percorso corso={v.corso} />
                <Programma v={v} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className={stile.aPresenza}>
        Ci si allena a {comuni.slice(0, -1).join(', ')} e {comuni.at(-1)}: {comuni.length} comuni,{' '}
        {slot} turni a settimana. <Link href="/centri">Indirizzi, giorni e orari</Link>.
      </p>
      <p className={stile.aProva}>
        I docenti sono diplomati dopo almeno quattro anni di percorso e un esame di abilitazione
        all&apos;insegnamento, e sono tesserati e assicurati CSEN.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ B ----- */

/**
 * L'albo aperto: la prima cosa in pagina e' la settimana vera, giorno per
 * giorno, con nomi di comuni e ore. La prova precede la scelta, e la scelta
 * arriva dopo, quando il visitatore ha gia' visto che il posto esiste.
 */
export function VarianteB({ voci, settimana, comuni, slot }: Props) {
  return (
    <div className={stile.b}>
      <header className={stile.bTesta}>
        <h1 className={stile.bTitolo}>Questa settimana si allena qui</h1>
        <p className={stile.bIntro}>
          {slot} turni in {comuni.length} comuni tra Milano, Monza, Lodi e Varese. Nessuna
          iscrizione per guardare: gli orari sono pubblici.
        </p>
      </header>

      <div className={stile.bSettimana}>
        {settimana.map(([g, turni]) => (
          <section className={stile.bGiorno} key={g}>
            <h2 className={stile.bNomeGiorno}>{GIORNO_LUNGO[g]}</h2>
            <ul className={stile.bTurni}>
              {turni.map((t, i) => (
                <li key={i}>
                  <Link className={stile.bTurno} href={`/centri/${t.sede.slug}`}>
                    <span className={stile.bOre}>{t.ore}</span>
                    <span className={stile.bDove}>
                      {t.comune}, {t.palestra}
                    </span>
                    <span className={stile.bCosa}>{t.corso?.nome}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className={stile.bBivio}>
        <h2 className={stile.bDomandaGruppo}>E tu, cosa cerchi?</h2>
        <ul>
          {voci.map((v) => (
            <li key={v.corso.id}>
              <Link className={stile.bVoce} href={`/corsi/${v.corso.slug}`}>
                <span className={stile.bDomanda}>{v.corso.domanda}</span>
                <span className={stile.bSommario}>{v.corso.sommario}</span>
                <Percorso corso={v.corso} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ C ----- */

/**
 * Il posto prima del percorso: la prima domanda non e' «cosa cerchi» ma «dove
 * sei», perche' PRODUCT.md dice che tutti cercano una sede raggiungibile e non
 * un marchio nazionale. Mette alla prova il Principio 2, che vuole il bivio per
 * primo: se questa vince, il Principio va riscritto o la home va spiegata.
 */
export function VarianteC({ voci, sedi, comuni }: Props) {
  return (
    <div className={stile.c}>
      <h1 className={stile.cTitolo}>Dove ti alleneresti?</h1>
      <p className={stile.cIntro}>
        Krav Maga per adulti, ragazzi e bambini in {sedi.length} centri tecnici e {comuni.length}{' '}
        comuni. Il centro più vicino, con i suoi orari, è il punto di partenza: il corso si sceglie
        dopo.
      </p>

      <ul className={stile.cComuni}>
        {sedi.map((s) => (
          <li key={s.id}>
            <Link className={stile.cComune} href={`/centri/${s.slug}`}>
              <span className={stile.cNome}>{comune(s)}</span>
              <span className={stile.cPalestra}>
                {palestra(s)} · {viaCorta(s)}
              </span>
              <span className={stile.cQuando}>
                {turni(s).length} {turni(s).length === 1 ? 'turno' : 'turni'} a settimana
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className={stile.cTutti}>
        <Link href="/centri">L&apos;elenco completo, con giorni, orari e docenti &rarr;</Link>
      </p>

      <section className={stile.cBivio}>
        <h2 className={stile.cGruppo}>Tre percorsi</h2>
        <ul>
          {voci.map((v) => (
            <li key={v.corso.id}>
              <Link className={stile.cVoce} href={`/corsi/${v.corso.slug}`}>
                <Percorso corso={v.corso} />
                <span className={stile.cDomanda}>{v.corso.domanda}</span>
                <Programma v={v} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
