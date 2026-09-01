/**
 * La home — «Il Sigillo», la direzione scelta in #35 fra tre prototipi guardati
 * sul contenuto vero.
 *
 * La pagina fa una cosa sola: porre il primo bivio, che il Principio 2 di
 * `PRODUCT.md` mette prima di qualunque richiesta di contatto. Sopra il bivio
 * c'e' un'apertura che toglie l'esperienza dai requisiti e nomina il territorio;
 * dentro ogni voce del bivio c'e' la prova, cioe' dove quel corso e' davvero in
 * programma. Niente sezione «numeri» a parte: la prova sta attaccata alla
 * scelta che deve sostenere.
 *
 * Cio' che #35 ha cambiato rispetto alla prima versione: il peso visivo. Lo
 * stemma non e' piu' solo un logo da 40px in testata, e' la **geometria della
 * pagina** — un anello a raggio di pagina regge l'apertura, e fra le voci del
 * bivio ci sono archi concentrici invece di fili dritti. Il bivio sta su un
 * campo verde pieno a tutta larghezza, che e' la superficie che al sito
 * mancava.
 *
 * La prova e' costruita, non scritta: i centri vengono dagli **orari** delle
 * sedi (#10), quindi un corso che nessuno tiene lo dice, invece di tacere (#24).
 * L'unica azione piena della pagina porta ai centri, mai al form: il bivio va
 * risolto prima.
 *
 * Le immagini arrivano da `Impostazioni` e sono facoltative per costruzione: se
 * il cliente le svuota, restano gli anelli disegnati e la pagina e' completa.
 */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Corsi as Corso, Impostazioni, Media, Sedi as Sede } from '@/payload-types'

import { TARGET, comune, turni } from './centri/sede'
import { type Voce, bivio } from './home'
import stile from './home.module.css'

export const metadata: Metadata = {
  title: 'AKM Italia — Krav Maga in Lombardia',
  description:
    'Krav Maga per adulti, ragazzi e bambini nei centri tecnici AKM Italia: dove si allena, quando, e con chi.',
}

/** Quanti comuni si nominano dentro una voce del bivio prima di contarli. */
const COMUNI_IN_VOCE = 4

/** L'url di una trama, solo se il campo e' popolato: e' facoltativa per scelta. */
const trama = (v: Media | number | null | undefined) =>
  v && typeof v === 'object' && v.url ? `url(${v.url})` : undefined

/** Il documento popolato, o `null`: a `depth: 1` una relazione vuota resta un id. */
const media = (v: Media | number | null | undefined) =>
  v && typeof v === 'object' ? v : null

/** L'arco che separa due voci: stessa curva dell'anello, raggio che cresce
 *  scendendo, cosi' i tre archi del bivio sono concentrici come i tre cerchi
 *  dello stemma. `i` e' la posizione nell'elenco, non un numero d'ordine. */
const Arco = ({ i }: { i: number }) => (
  <svg aria-hidden className={stile.arco} preserveAspectRatio="none" viewBox="0 0 1000 26">
    <path d={`M0 ${24 - i * 5} Q500 ${i * 6} 1000 ${24 - i * 5}`} />
  </svg>
)

function Programma({ voce }: { voce: Voce }) {
  if (!voce.centri)
    /* #24: il bivio dichiara che il corso esiste, non che parte lunedi'. */
    return (
      <span className={stile.assente}>
        Nessun centro lo tiene in questa stagione. Scrivici e ti diciamo dove riparte.
      </span>
    )
  const primi = voce.comuni.slice(0, COMUNI_IN_VOCE).join(', ')
  const altri = voce.comuni.length - COMUNI_IN_VOCE
  return (
    <span className={stile.programma}>
      {voce.centri} {voce.centri === 1 ? 'centro' : 'centri'} · {primi}
      {altri > 0 ? ` e altri ${altri}` : ''}
    </span>
  )
}

export default async function Home() {
  const payload = await getPayload({ config: await config })
  const [corsi, sedi, impostazioni] = await Promise.all([
    payload.find({ collection: 'corsi', where: { inBivio: { equals: true } }, limit: 20, depth: 0 }),
    payload.find({
      collection: 'sedi',
      where: { attivo: { equals: true } },
      limit: 200,
      depth: 2,
      sort: 'indirizzo.citta',
    }),
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
  ])

  const attive = sedi.docs as Sede[]
  const voci = bivio(corsi.docs as Corso[], attive)
  const comuni = [...new Set(attive.map(comune))].sort((a, b) => a.localeCompare(b, 'it'))
  const slot = attive.reduce((n, s) => n + turni(s).length, 0)
  const aspetto = (impostazioni as Impostazioni).aspetto
  const apertura = media(aspetto?.aperturaHome)

  return (
    <div
      className={stile.pagina}
      style={{ '--grana': trama(aspetto?.fondoCarta) } as React.CSSProperties}
    >
      <header className={stile.apertura}>
        {/* Il sigillo: gli anelli e, se c'e', la fotografia dentro di essi. Un
            centro solo, dichiarato dal CSS. Senza immagine restano gli anelli e
            l'apertura e' completa lo stesso. L'`alt` e' pieno e non vuoto,
            perche' l'immagine porta informazione — com'e' fatta davvero la sala
            dove si va — e non e' una trama. */}
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
          Krav Maga per adulti, ragazzi e bambini in {attive.length} centri tecnici fra Milano,
          Monza, Lodi e Varese. Il docente è diplomato, la prima lezione è di prova, e non serve
          essere allenati per farla.
        </p>
        <p className={stile.fatti}>
          {attive.length} centri attivi · {comuni.length} comuni · {slot} turni a settimana
        </p>
        <p className={stile.azioni}>
          {/* L'unica azione piena della home, e non e' il form: il Principio 2
              vieta la richiesta di contatto prima che il bivio sia risolto. */}
          <Link className={stile.azione} href="/centri">
            Trova il centro più vicino
          </Link>
          <a className={stile.secondaria} href="#bivio">
            Oppure parti dalla tua domanda
          </a>
        </p>
      </header>

      <section className={stile.campo}>
        <div className={stile.dentro}>
          <h2 className={stile.domanda}>Qual è il tuo momento?</h2>
          <ul className={stile.bivio} id="bivio">
            {voci.map((voce, i) => (
              <li key={voce.corso.id}>
                <Link className={stile.voce} href={`/corsi/${voce.corso.slug}`}>
                  <span className={stile.suaDomanda}>{voce.corso.domanda}</span>
                  <span className={stile.riga}>
                    {/* Regola dell'Etichetta Corta: dentro un elenco l'etichetta
                        porta il target, non il nome del corso, che e' lungo il
                        doppio della riga. La forma e' la pastiglia, che nessun
                        altro elemento della pagina usa. */}
                    <span className={stile.target} data-colore={voce.corso.colore ?? 'inchiostro'}>
                      {TARGET[voce.corso.target] ?? voce.corso.target}
                    </span>
                    <Programma voce={voce} />
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
          {slot} turni a settimana. <Link href="/centri">Indirizzi, giorni e orari</Link>.
        </p>
        <p className={stile.prova}>
          I docenti sono diplomati dopo almeno quattro anni di percorso e un esame di abilitazione
          all&apos;insegnamento, e sono tesserati e assicurati CSEN.
        </p>
      </footer>
    </div>
  )
}
