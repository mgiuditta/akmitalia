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

export const nomeA = 'bivio secco, senza hero'
export const nomeA1 = 'hero invito'
export const nomeA2 = 'hero editoriale'
export const nomeA3 = 'hero tesserino'
export const nomeB = "l'albo aperto"
export const nomeC = 'il posto prima del percorso'

export type Props = {
  voci: Voce[]
  settimana: [string, Turno[]][]
  sedi: Sede[]
  comuni: string[]
  slot: number
  istruttori: number
  /** Gli asset generati, per nome di file: vengono da `Media`, non dal codice. */
  asset: Record<string, string>
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

/** Il bivio: la parte di A che non e' in discussione, condivisa dalle quattro A. */
function BivioSecco({ voci, asset }: { voci: Voce[]; asset?: Record<string, string> }) {
  return (
    <ul className={stile.aBivio} id="bivio">
      {voci.map((v, i) => {
        const segno = asset?.[`akm-percorso-${i + 1}.png`]
        return (
        <li key={v.corso.id}>
          <Link className={stile.aVoce} href={`/corsi/${v.corso.slug}`}>
            {/* Decorativo: il percorso e' gia' scritto accanto (Regola dell'Etichetta),
                quindi il segno non porta informazione e va con `alt` vuoto. */}
            {segno ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className={stile.aSegno} height={32} src={segno} width={32} />
            ) : null}
            <span className={stile.aDomanda}>{v.corso.domanda}</span>
            <span className={stile.aRiga}>
              <Percorso corso={v.corso} />
              <Programma v={v} />
            </span>
          </Link>
        </li>
        )
      })}
    </ul>
  )
}

/** La coda di A: presenza e credenziali, una riga ciascuna. */
function CodaA({ comuni, slot }: { comuni: string[]; slot: number }) {
  return (
    <>
      <p className={stile.aPresenza}>
        Ci si allena a {comuni.slice(0, -1).join(', ')} e {comuni.at(-1)}: {comuni.length} comuni,{' '}
        {slot} turni a settimana. <Link href="/centri">Indirizzi, giorni e orari</Link>.
      </p>
      <p className={stile.aProva}>
        I docenti sono diplomati dopo almeno quattro anni di percorso e un esame di abilitazione
        all&apos;insegnamento, e sono tesserati e assicurati CSEN.
      </p>
    </>
  )
}

/**
 * A senza hero: la domanda e' la prima cosa in pagina. Resta come metro di
 * paragone, per vedere che cosa l'hero aggiunge e che cosa allontana.
 */
export function VarianteA({ voci, comuni, slot }: Props) {
  return (
    <div className={stile.a}>
      <h1 className={stile.aTitolo}>Qual è il tuo momento?</h1>
      <BivioSecco voci={voci} />
      <CodaA comuni={comuni} slot={slot} />
    </div>
  )
}

/* ----------------------------------------------------------------- A1 ----- */

/**
 * Hero invito: colonna sola, occhiello, titolo, una riga che toglie paura, tre
 * fatti e **una sola** azione primaria. L'azione non e' «chiedi informazioni»:
 * il Principio 2 vieta la richiesta di contatto prima che il bivio sia risolto,
 * quindi porta ai centri, che e' la seconda domanda del visitatore.
 */
export function VarianteA1({ voci, sedi, comuni, slot, asset }: Props) {
  const trama = asset['akm-trama-hero.webp']
  const carta = asset['akm-fondo-carta.webp']
  return (
    <div
      className={`${stile.a} ${carta ? stile.conCarta : ''}`}
      style={carta ? ({ '--carta-grana': `url(${carta})` } as React.CSSProperties) : undefined}
    >
      <header
        className={stile.h1Hero}
        style={trama ? ({ '--trama': `url(${trama})` } as React.CSSProperties) : undefined}
      >
        <p className={stile.h1Occhiello}>Krav Maga in Lombardia</p>
        <h1 className={stile.h1Titolo}>Difendersi si impara. Vicino a casa.</h1>
        <p className={stile.h1Testo}>
          Corsi per adulti, ragazzi e bambini in {sedi.length} centri tecnici tra Milano, Monza,
          Lodi e Varese. Non serve esperienza: si parte da zero, con un docente diplomato.
        </p>
        <p className={stile.h1Fatti}>
          {sedi.length} centri attivi · {comuni.length} comuni · {slot} turni a settimana
        </p>
        <p className={stile.h1Azioni}>
          <Link className={stile.h1Azione} href="/centri">
            Trova il centro più vicino
          </Link>
          <a className={stile.h1Secondaria} href="#bivio">
            Oppure parti dalla tua domanda
          </a>
        </p>
      </header>

      <h2 className={stile.aTitoloSecondo}>Qual è il tuo momento?</h2>
      <BivioSecco asset={asset} voci={voci} />
      <CodaA comuni={comuni} slot={slot} />
    </div>
  )
}

/* ----------------------------------------------------------------- A2 ----- */

/**
 * Hero editoriale: griglia asimmetrica, la frase grande a sinistra e il dato
 * nudo incolonnato a destra, separati da un filetto. Nessun bottone: l'invito
 * e' la frase, e la prima azione resta il bivio, che comincia subito sotto.
 */
export function VarianteA2({ voci, sedi, comuni, slot, istruttori }: Props) {
  const dati: [string, string][] = [
    ['Centri attivi', String(sedi.length)],
    ['Comuni', String(comuni.length)],
    ['Turni a settimana', String(slot)],
    ['Istruttori', String(istruttori)],
  ]
  return (
    <div className={stile.a}>
      <header className={stile.h2Hero}>
        <div>
          <h1 className={stile.h2Titolo}>Chi insegna, dove, e quando.</h1>
          <p className={stile.h2Testo}>
            AKM Italia tiene i suoi corsi di Krav Maga in {sedi.length} centri tecnici della
            Lombardia. Ogni centro ha i suoi giorni, i suoi orari e il suo docente, e sono scritti
            qui: non c&apos;è niente da chiedere per saperlo.
          </p>
        </div>
        <dl className={stile.h2Dati}>
          {dati.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <h2 className={stile.aTitoloSecondo}>Qual è il tuo momento?</h2>
      <BivioSecco voci={voci} />
      <CodaA comuni={comuni} slot={slot} />
    </div>
  )
}

/* ----------------------------------------------------------------- A3 ----- */

/**
 * Hero tesserino: l'intestazione di un documento, non di una campagna. Riga di
 * etichette in maiuscoletto, nome per esteso, una riga che dice cos&apos;e', e le
 * province scritte. E' la lettura piu' austera dell&apos;Albo, ed e' la meno
 * «invitante» delle tre: sta qui per misurare quanto invito serve davvero.
 */
export function VarianteA3({ voci, sedi, comuni, slot }: Props) {
  return (
    <div className={stile.a}>
      <header className={stile.h3Hero}>
        <p className={stile.h3Etichette}>Registro pubblico · Lombardia · MI · MB · LO · VA</p>
        <h1 className={stile.h3Titolo}>
          Krav Maga per adulti, ragazzi e donne, in {sedi.length} centri tecnici.
        </h1>
        <p className={stile.h3Testo}>
          Ogni centro con i suoi orari e il suo docente. Si comincia scegliendo la domanda che ti
          somiglia, o il centro più vicino.
        </p>
        <p className={stile.h3Fatti}>
          {sedi.length} centri · {comuni.length} comuni · {slot} turni a settimana ·{' '}
          <Link href="/centri">l&apos;elenco completo</Link>
        </p>
      </header>

      <h2 className={stile.aTitoloSecondo}>Qual è il tuo momento?</h2>
      <BivioSecco voci={voci} />
      <CodaA comuni={comuni} slot={slot} />
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
