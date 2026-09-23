'use client'

import React, { useActionState, useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import Script from 'next/script'

import { inviaRichiesta } from '@/app/(frontend)/contatti/azioni'
import {
  STATO_INIZIALE,
  type CampoRichiesta,
  type OpzioniModulo,
} from '@/app/(frontend)/contatti/validazione'

/**
 * Il modulo di richiesta. Etichetta sopra ogni campo, errore in parole sotto
 * il campo e legato con aria-describedby, obbligatorio detto in testo e non
 * con un asterisco. `noValidate` spegne i fumetti del browser: la frase
 * dell'errore e' la nostra, uguale per chi vede e per chi ascolta.
 *
 * Testi e campi facoltativi arrivano dal global Contatti (gruppo «Il modulo di
 * richiesta»). Il set di campi resta codice: sono le colonne tipizzate di
 * `richieste`. Gli stessi interruttori li rilegge la Server Action, che non si
 * fida di quello che arriva da qui.
 *
 * Lo stato vive in useActionState: pending, errori e valori tornano tutti
 * dalla Server Action. React 19 svuota un form non controllato quando l'action
 * risponde, quindi i valori digitati si rimettono da `stato.valori`.
 *
 * Anti-bot non visivo (PRODUCT.md): il campo `sito` sta fuori schermo e fuori
 * dal tab, mai `display: none` perche' i bot lo hanno imparato; `t` e' il
 * momento in cui il browser ha montato il modulo. Senza JavaScript `t` non
 * esiste e la richiesta viene scartata in silenzio: il sito si affida gia' al
 * JavaScript per la mappa, e' un costo dichiarato.
 *
 * Il «non sono un robot» visibile e' Cloudflare Turnstile, e c'e' solo se la
 * chiave arriva dal server. Rendering esplicito e non implicito: lo script si
 * carica una volta, il modulo si rimonta a ogni «Invia un'altra richiesta».
 */

type Sede = {
  id: number
  nome: string
  citta: string
  /** Via, CAP, citta' e provincia in una riga: quello che si mostra scegliendo il centro. */
  indirizzo: string
  palestra: string | null
  mapsUrl: string | null
}
type Corso = { id: number; nome: string }

export type TestiModulo = {
  nota: string
  etichettaConsenso: string
  etichettaInvio: string
  privacy: { etichetta: string; href: string } | null
}

type Props = {
  sedi: Sede[]
  corsi: Corso[]
  testi: TestiModulo
  opzioni: OpzioniModulo
  /** Il percorso preselezionato quando si arriva da /contatti?corso=<slug>. */
  corsoIniziale?: number | null
  /** Il centro preselezionato quando si arriva da /contatti?sede=<slug>. */
  sedeIniziale?: number | null
  /** La site key di Turnstile. Senza, il modulo ha solo il filtro invisibile. */
  turnstileSiteKey?: string | null
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opzioni: Record<string, string>) => string
      reset: (id: string) => void
      remove: (id: string) => void
    }
  }
}

export function FormRichiesta(props: Props) {
  /* «Invia un'altra richiesta» rimonta il modulo: azzera anche lo stato di
     useActionState, che un reset del form da solo non tocca. */
  const [chiave, setChiave] = useState(0)
  return <Modulo key={chiave} {...props} altra={() => setChiave((k) => k + 1)} />
}

function Modulo({
  sedi,
  corsi,
  testi,
  opzioni,
  corsoIniziale,
  sedeIniziale,
  turnstileSiteKey,
  altra,
}: Props & { altra: () => void }) {
  const [stato, invia, inCorso] = useActionState(inviaRichiesta, STATO_INIZIALE)
  const [t, setT] = useState('')
  /* Arrivando da una scheda centro il centro e' gia' scelto, e con lui la nota
     che ne stampa l'indirizzo: la preselezione deve vedersi anche li', non solo
     nella select. */
  const [idSede, setIdSede] = useState(sedeIniziale ? String(sedeIniziale) : '')
  const avviso = useRef<HTMLDivElement>(null)
  const turnstile = useRef<HTMLDivElement>(null)
  const idTurnstile = useRef<string | null>(null)

  useEffect(() => {
    setT(String(Date.now()))
  }, [])

  useEffect(() => {
    if (stato.messaggio && !stato.ok) {
      avviso.current?.focus()
      /* Un token Turnstile vale un invio solo: dopo un errore se ne chiede un altro. */
      if (idTurnstile.current) window.turnstile?.reset(idTurnstile.current)
    }
  }, [stato])

  /* Il widget si monta a mano e si smonta con il modulo: `onReady` di
     next/script scatta a ogni montaggio, anche se lo script era gia' in pagina. */
  const montaTurnstile = () => {
    if (!turnstileSiteKey || !turnstile.current || idTurnstile.current || !window.turnstile) return
    idTurnstile.current = window.turnstile.render(turnstile.current, {
      sitekey: turnstileSiteKey,
      theme: 'light',
      language: 'it',
    })
  }
  useEffect(() => {
    montaTurnstile()
    return () => {
      if (idTurnstile.current) window.turnstile?.remove(idTurnstile.current)
      idTurnstile.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Dopo un errore vince il centro che l'utente aveva scelto. */
  const sedeScelta = sedi.find((s) => String(s.id) === (idSede || stato.valori.sede || ''))

  if (stato.ok) {
    return (
      <div className="confirmation" role="status">
        <h3 className="display display--sm">Richiesta inviata</h3>
        <p className="text">{stato.messaggio}</p>
        <button type="button" className="button button--secondary" onClick={altra}>
          Invia un’altra richiesta
        </button>
      </div>
    )
  }

  /* Un default, non un campo controllato: dopo un errore vince quello che
     l'utente aveva scelto, non lo slug arrivato dalla URL. */
  const iniziale: Partial<Record<CampoRichiesta, string>> = {
    corso: corsoIniziale ? String(corsoIniziale) : '',
    sede: sedeIniziale ? String(sedeIniziale) : '',
  }

  const campo = (nome: CampoRichiesta) => ({
    id: nome,
    name: nome,
    defaultValue: stato.valori[nome] ?? iniziale[nome] ?? '',
    'aria-invalid': stato.errori[nome] ? true : undefined,
    'aria-describedby': stato.errori[nome] ? `error-${nome}` : undefined,
  })

  const errore = (nome: CampoRichiesta) =>
    stato.errori[nome] ? (
      <p className="field__error" id={`error-${nome}`}>
        {stato.errori[nome]}
      </p>
    ) : null

  return (
    <form className="form" action={invia} noValidate aria-busy={inCorso}>
      {stato.messaggio ? (
        <div ref={avviso} tabIndex={-1} role="alert" className="form__notice">
          {stato.messaggio}
        </div>
      ) : null}

      {testi.nota ? <p className="detail">{testi.nota}</p> : null}

      <div className="form__row">
        <div className="field">
          <label htmlFor="cognome">Cognome</label>
          <input type="text" autoComplete="family-name" {...campo('cognome')} />
          {errore('cognome')}
        </div>
        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input type="text" autoComplete="given-name" {...campo('nome')} />
          {errore('nome')}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="email" autoComplete="email" inputMode="email" {...campo('email')} />
          {errore('email')}
        </div>
        <div className="field">
          <label htmlFor="telefono">Telefono</label>
          <input type="tel" autoComplete="tel" inputMode="tel" {...campo('telefono')} />
          {errore('telefono')}
        </div>
      </div>

      <div className="form__row">
        {opzioni.dataNascita ? (
          <div className="field">
            <label htmlFor="dataNascita">Data di nascita</label>
            <input type="date" autoComplete="bday" {...campo('dataNascita')} />
            {errore('dataNascita')}
          </div>
        ) : null}
        <div className="field">
          <label htmlFor="sede">Centro tecnico</label>
          <select
            {...campo('sede')}
            aria-describedby={
              [stato.errori.sede ? 'error-sede' : null, sedeScelta ? 'center-details' : null]
                .filter(Boolean)
                .join(' ') || undefined
            }
            onChange={(e) => setIdSede(e.target.value)}
          >
            <option value="">Scegli un centro</option>
            {sedi.map((s) => (
              <option key={s.id} value={s.id}>
                {s.citta ? `${s.citta}: ${s.nome}` : s.nome}
              </option>
            ))}
          </select>
          {errore('sede')}
          {/* L'indirizzo del centro scelto, in chiaro: chi scrive sa gia' dove
              andra' (PRODUCT.md, «Cliccare un centro deve dare tutto»). */}
          {sedeScelta ? (
            <p className="field__note detail" id="center-details">
              {sedeScelta.palestra && sedeScelta.palestra !== sedeScelta.nome ? (
                <>
                  {sedeScelta.palestra}
                  <br />
                </>
              ) : null}
              {sedeScelta.indirizzo || sedeScelta.citta}
              {sedeScelta.mapsUrl ? (
                <>
                  <br />
                  <a className="breadcrumb" href={sedeScelta.mapsUrl} target="_blank" rel="noopener">
                    Apri in Maps
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>

      {opzioni.percorso ? (
        <div className="field">
          <label htmlFor="corso">Percorso di interesse (facoltativo)</label>
          <select {...campo('corso')}>
            <option value="">Nessuna preferenza</option>
            {corsi.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
            {opzioni.altreVoci.map((voce) => (
              <option key={voce} value={voce}>
                {voce}
              </option>
            ))}
          </select>
          {errore('corso')}
        </div>
      ) : null}

      {opzioni.messaggio ? (
        <div className="field">
          <label htmlFor="messaggio">Messaggio (facoltativo)</label>
          <textarea rows={5} {...campo('messaggio')} />
          {errore('messaggio')}
        </div>
      ) : null}

      <div className="field field--choice">
        <input
          type="checkbox"
          id="consenso"
          name="consenso"
          defaultChecked={stato.valori.consenso === 'on'}
          aria-invalid={stato.errori.consenso ? true : undefined}
          aria-describedby={stato.errori.consenso ? 'error-consenso' : undefined}
        />
        <label htmlFor="consenso">{testi.etichettaConsenso}</label>
        {/* Il link sta fuori dalla label: dentro, un click sull'informativa
            spunterebbe anche la casella. */}
        {testi.privacy ? (
          <p className="field__note">
            <Link className="breadcrumb" href={testi.privacy.href}>
              {testi.privacy.etichetta}
            </Link>
          </p>
        ) : null}
        {errore('consenso')}
      </div>

      <div className="field field--hidden" aria-hidden="true">
        <label htmlFor="sito">Sito web</label>
        <input type="text" id="sito" name="sito" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="t" value={t} readOnly />

      {turnstileSiteKey ? (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={montaTurnstile}
          />
          <div ref={turnstile} className="field field--turnstile" />
        </>
      ) : null}

      <p>
        <button type="submit" className="button button--primary" disabled={inCorso}>
          {inCorso ? 'Invio in corso' : testi.etichettaInvio}
        </button>
      </p>
    </form>
  )
}
