/**
 * DIREZIONE A — «Il Sigillo». PROTOTIPO USA E GETTA, issue #35.
 *
 * Tesi: il peso visivo lo porta la **geometria del marchio**, non un'immagine.
 * Lo stemma e' un anello, e l'anello diventa la struttura: un quarto di
 * circonferenza a raggio di pagina dietro l'apertura, e archi concentrici al
 * posto dei fili dritti fra le voci del bivio.
 *
 * Le altre leve, per il confronto: famiglia **Archivo espansa** (la larghezza
 * viene dal microtesto dell'anello, e la strettezza sarebbe il riflesso da
 * palestra tattica), palette **quasi monocroma con un campo verde pieno a tutta
 * larghezza**, scala **monumentale**, movimento **l'anello che si chiude**.
 */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'

import type { Dati, Voce } from './dati'
import stile from './sigillo.module.css'

export const nome = 'Il Sigillo'

const TARGET: Record<string, string> = {
  adulti: 'Adulti',
  ragazzi: 'Ragazzi',
  bambini: 'Bambini',
  donne: 'Donne',
  istruttori: 'Istruttori',
  'aziende-ffoo': 'Aziende e FFOO',
}

/** L'arco che separa due voci: stessa curva dell'anello, raggio che cresce
 *  scendendo, cosi' i tre archi del bivio sono concentrici come i tre cerchi
 *  dello stemma. `i` e' la posizione nell'elenco, non un numero d'ordine. */
const Arco = ({ i }: { i: number }) => (
  <svg aria-hidden className={stile.arco} preserveAspectRatio="none" viewBox="0 0 1000 26">
    <path d={`M0 ${24 - i * 5} Q500 ${i * 6} 1000 ${24 - i * 5}`} />
  </svg>
)

function Prova({ voce }: { voce: Voce }) {
  /* #24: il bivio dichiara che il corso esiste, non che parte lunedi'. */
  if (!voce.attive.length)
    return (
      <span className={stile.assente}>
        Nessun centro lo tiene in questa stagione. Scrivici e ti diciamo dove riparte.
      </span>
    )
  const primi = voce.comuni.slice(0, 4).join(', ')
  const altri = voce.comuni.length - 4
  return (
    <span className={stile.prova}>
      {voce.attive.length} {voce.attive.length === 1 ? 'centro' : 'centri'} · {primi}
      {altri > 0 ? ` e altri ${altri}` : ''}
    </span>
  )
}

export function Sigillo({ dati, apertura }: { dati: Dati; apertura?: Media | null }) {
  const { voci, sedi, comuni, turni } = dati

  return (
    <div className={stile.direzione}>
      <header className={stile.apertura}>
        {/* La fotografia sta dentro il sigillo, non accanto: e' il disco che i
            due anelli esterni circondano. Facoltativa per costruzione — senza,
            restano gli anelli e l'apertura e' completa (mappa #34). L'`alt` e'
            pieno e non vuoto, perche' questa immagine porta informazione: com'e'
            fatta davvero la sala dove si va. */}
        <div className={stile.sigillo}>
          {apertura?.url ? (
            <div className={stile.foto}>
              <Image
                alt={apertura.alt ?? ''}
                height={apertura.height ?? 1200}
                priority
                sizes="(max-width: 720px) 72vw, min(46vw, 600px)"
                src={apertura.url}
                width={apertura.width ?? 1600}
              />
            </div>
          ) : null}

          <svg aria-hidden className={stile.anello} viewBox="0 0 1100 1100">
            <circle className={stile.spesso} cx="550" cy="550" r="470" />
            <circle cx="550" cy="550" r="540" />
            <circle cx="550" cy="550" r="392" />
            <circle
              className={apertura?.url ? stile.sopraFoto : undefined}
              cx="550"
              cy="550"
              r="318"
            />
          </svg>
        </div>

        <p className={stile.occhiello}>Krav Maga · Lombardia</p>
        <h1 className={stile.titolo}>Si comincia da zero, e si comincia vicino a casa.</h1>
        <p className={stile.sommario}>
          Krav Maga per adulti, ragazzi e bambini in {sedi.length} centri tecnici fra Milano, Monza,
          Lodi e Varese. Il docente è diplomato, la prima lezione è di prova, e non serve essere
          allenati per farla.
        </p>
        <p className={stile.azioni}>
          {/* L'unica azione piena della pagina, e non e' il form: il Principio 2
              vieta la richiesta di contatto prima che il bivio sia risolto. */}
          <Link className={stile.azione} href="/centri">
            Trova il centro più vicino
          </Link>
          <a className={stile.secondaria} href="#bivio-a">
            Oppure parti dalla tua domanda
          </a>
        </p>
      </header>

      <section className={stile.campo} id="bivio-a">
        <div className={stile.dentro}>
          <h2 className={stile.domanda}>Qual è il tuo momento?</h2>
          <ul className={stile.bivio}>
            {voci.map((voce, i) => (
              <li key={voce.corso.id}>
                <Link className={stile.voce} href={`/corsi/${voce.corso.slug}`}>
                  <span className={stile.suaDomanda}>{voce.corso.domanda}</span>
                  <span className={stile.riga}>
                    <span className={stile.target} data-colore={voce.corso.colore ?? 'inchiostro'}>
                      {TARGET[voce.corso.target] ?? voce.corso.target}
                    </span>
                    <Prova voce={voce} />
                  </span>
                </Link>
                <Arco i={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className={stile.coda}>
        <p className={stile.presenza}>
          Ci si allena a {comuni.slice(0, -1).join(', ')} e {comuni.at(-1)}: {comuni.length} comuni,{' '}
          {turni.length} turni a settimana. <Link href="/centri">Indirizzi, giorni e orari</Link>.
        </p>
        <p className={stile.credenziali}>
          I docenti sono diplomati dopo almeno quattro anni di percorso e un esame di abilitazione
          all&apos;insegnamento, e sono tesserati e assicurati CSEN.
        </p>
      </footer>
    </div>
  )
}
