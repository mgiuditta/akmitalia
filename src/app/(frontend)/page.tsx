/**
 * La home — struttura A1 del prototipo di #17, «il bivio secco con hero invito».
 *
 * La pagina fa una cosa sola: porre il primo bivio, che il Principio 2 di
 * `PRODUCT.md` mette prima di qualunque richiesta di contatto. Sopra il bivio
 * c'e' un hero che toglie l'esperienza dai requisiti e nomina il territorio;
 * dentro ogni voce del bivio c'e' la prova, cioe' dove quel corso e' davvero in
 * programma. Niente sezione «numeri» a parte: la prova sta attaccata alla
 * scelta che deve sostenere.
 *
 * La prova e' costruita, non scritta: i centri vengono dagli **orari** delle
 * sedi (#10), quindi un corso che nessuno tiene lo dice, invece di tacere (#24).
 * L'unica azione piena della pagina porta ai centri, mai al form: il bivio va
 * risolto prima.
 *
 * Le due trame di sfondo arrivano da `Impostazioni` e sono facoltative per
 * costruzione: se il cliente le svuota, resta la pagina tipografica.
 */
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Corsi as Corso, Impostazioni, Media, Sedi as Sede } from '@/payload-types'

import { Percorso, comune, turni } from './centri/sede'
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

function Programma({ voce }: { voce: Voce }) {
  if (!voce.centri)
    /* #24: il bivio dichiara che il corso esiste, non che parte lunedi'. */
    return (
      <span className={stile.assente}>
        Nessun centro lo tiene in questa stagione. Scrivici: ti diciamo se e dove riparte.
      </span>
    )
  const primi = voce.comuni.slice(0, COMUNI_IN_VOCE).join(', ')
  const altri = voce.comuni.length - COMUNI_IN_VOCE
  return (
    <span className={stile.programma}>
      {voce.centri} {voce.centri === 1 ? 'centro' : 'centri'}: {primi}
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

  return (
    <div
      className={stile.pagina}
      style={
        {
          '--trama': trama(aspetto?.tramaHero),
          '--grana': trama(aspetto?.fondoCarta),
        } as React.CSSProperties
      }
    >
      <header className={stile.hero}>
        <p className={stile.occhiello}>Krav Maga in Lombardia</p>
        <h1 className={stile.titolo}>Difendersi si impara. Vicino a casa.</h1>
        <p className={stile.testo}>
          Corsi per adulti, ragazzi e bambini in {attive.length} centri tecnici tra Milano, Monza,
          Lodi e Varese. Non serve esperienza: si parte da zero, con un docente diplomato.
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

      <h2 className={stile.domanda}>Qual è il tuo momento?</h2>
      <ul className={stile.bivio} id="bivio">
        {voci.map((voce) => (
          <li key={voce.corso.id}>
            <Link className={stile.voce} href={`/corsi/${voce.corso.slug}`}>
              <span className={stile.suaDomanda}>{voce.corso.domanda}</span>
              <span className={stile.riga}>
                <Percorso corso={voce.corso} />
                <Programma voce={voce} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className={stile.presenza}>
        Ci si allena a {comuni.slice(0, -1).join(', ')} e {comuni.at(-1)}: {comuni.length} comuni,{' '}
        {slot} turni a settimana. <Link href="/centri">Indirizzi, giorni e orari</Link>.
      </p>
      <p className={stile.prova}>
        I docenti sono diplomati dopo almeno quattro anni di percorso e un esame di abilitazione
        all&apos;insegnamento, e sono tesserati e assicurati CSEN.
      </p>
    </div>
  )
}
