'use client'

import React, { useActionState, useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import Script from 'next/script'

import { submitRequest } from '@/app/(frontend)/contatti/actions'
import {
  INITIAL_STATE,
  type RequestField,
  type FormOptions,
} from '@/app/(frontend)/contatti/validation'

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

type Center = {
  id: number
  nome: string
  citta: string
  /** Via, CAP, citta' e provincia in una riga: quello che si mostra scegliendo il centro. */
  indirizzo: string
  palestra: string | null
  mapsUrl: string | null
}
type Course = { id: number; nome: string }

export type FormTexts = {
  nota: string
  etichettaConsenso: string
  etichettaInvio: string
  privacy: { etichetta: string; href: string } | null
}

type Props = {
  sedi: Center[]
  corsi: Course[]
  texts: FormTexts
  options: FormOptions
  /** Il percorso preselezionato quando si arriva da /contatti?corso=<slug>. */
  initialCourse?: number | null
  /** Il centro preselezionato quando si arriva da /contatti?sede=<slug>. */
  initialCenter?: number | null
  /** La site key di Turnstile. Senza, il modulo ha solo il filtro invisibile. */
  turnstileSiteKey?: string | null
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, string>) => string
      reset: (id: string) => void
      remove: (id: string) => void
    }
  }
}

export function RequestForm(props: Props) {
  /* «Invia un'altra richiesta» rimonta il modulo: azzera anche lo stato di
     useActionState, che un reset del form da solo non tocca. */
  const [key, setKey] = useState(0)
  return <FormSection key={key} {...props} other={() => setKey((k) => k + 1)} />
}

function FormSection({
  sedi: centers,
  corsi: courses,
  texts,
  options,
  initialCourse,
  initialCenter,
  turnstileSiteKey,
  other,
}: Props & { other: () => void }) {
  const [state, send, inProgress] = useActionState(submitRequest, INITIAL_STATE)
  const [t, setT] = useState('')
  /* Arrivando da una scheda centro il centro e' gia' scelto, e con lui la nota
     che ne stampa l'indirizzo: la preselezione deve vedersi anche li', non solo
     nella select. */
  const [centerId, setCenterId] = useState(initialCenter ? String(initialCenter) : '')
  const notice = useRef<HTMLDivElement>(null)
  const turnstile = useRef<HTMLDivElement>(null)
  const turnstileId = useRef<string | null>(null)

  useEffect(() => {
    setT(String(Date.now()))
  }, [])

  useEffect(() => {
    if (state.messaggio && !state.ok) {
      notice.current?.focus()
      /* Un token Turnstile vale un invio solo: dopo un errore se ne chiede un altro. */
      if (turnstileId.current) window.turnstile?.reset(turnstileId.current)
    }
  }, [state])

  /* Il widget si monta a mano e si smonta con il modulo: `onReady` di
     next/script scatta a ogni montaggio, anche se lo script era gia' in pagina. */
  const mountTurnstile = () => {
    if (!turnstileSiteKey || !turnstile.current || turnstileId.current || !window.turnstile) return
    turnstileId.current = window.turnstile.render(turnstile.current, {
      sitekey: turnstileSiteKey,
      theme: 'light',
      language: 'it',
    })
  }
  useEffect(() => {
    mountTurnstile()
    return () => {
      if (turnstileId.current) window.turnstile?.remove(turnstileId.current)
      turnstileId.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Dopo un errore vince il centro che l'utente aveva scelto. */
  const chosenCenter = centers.find((s) => String(s.id) === (centerId || state.values.sede || ''))

  if (state.ok) {
    return (
      <div className="confirmation" role="status">
        <h3 className="display display--sm">Richiesta inviata</h3>
        <p className="text">{state.messaggio}</p>
        <button type="button" className="button button--secondary" onClick={other}>
          Invia un’altra richiesta
        </button>
      </div>
    )
  }

  /* Un default, non un campo controllato: dopo un errore vince quello che
     l'utente aveva scelto, non lo slug arrivato dalla URL. */
  const initial: Partial<Record<RequestField, string>> = {
    corso: initialCourse ? String(initialCourse) : '',
    sede: initialCenter ? String(initialCenter) : '',
  }

  const field = (name: RequestField) => ({
    id: name,
    name,
    defaultValue: state.values[name] ?? initial[name] ?? '',
    'aria-invalid': state.errors[name] ? true : undefined,
    'aria-describedby': state.errors[name] ? `error-${name}` : undefined,
  })

  const error = (name: RequestField) =>
    state.errors[name] ? (
      <p className="field__error" id={`error-${name}`}>
        {state.errors[name]}
      </p>
    ) : null

  return (
    <form className="form" action={send} noValidate aria-busy={inProgress}>
      {state.messaggio ? (
        <div ref={notice} tabIndex={-1} role="alert" className="form__notice">
          {state.messaggio}
        </div>
      ) : null}

      {texts.nota ? <p className="detail">{texts.nota}</p> : null}

      <div className="form__row">
        <div className="field">
          <label htmlFor="cognome">Cognome</label>
          <input type="text" autoComplete="family-name" {...field('cognome')} />
          {error('cognome')}
        </div>
        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input type="text" autoComplete="given-name" {...field('nome')} />
          {error('nome')}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="email" autoComplete="email" inputMode="email" {...field('email')} />
          {error('email')}
        </div>
        <div className="field">
          <label htmlFor="telefono">Telefono</label>
          <input type="tel" autoComplete="tel" inputMode="tel" {...field('telefono')} />
          {error('telefono')}
        </div>
      </div>

      <div className="form__row">
        {options.dataNascita ? (
          <div className="field">
            <label htmlFor="dataNascita">Data di nascita</label>
            <input type="date" autoComplete="bday" {...field('dataNascita')} />
            {error('dataNascita')}
          </div>
        ) : null}
        <div className="field">
          <label htmlFor="sede">Centro tecnico</label>
          <select
            {...field('sede')}
            aria-describedby={
              [state.errors.sede ? 'error-sede' : null, chosenCenter ? 'center-details' : null]
                .filter(Boolean)
                .join(' ') || undefined
            }
            onChange={(e) => setCenterId(e.target.value)}
          >
            <option value="">Scegli un centro</option>
            {centers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.citta ? `${s.citta}: ${s.nome}` : s.nome}
              </option>
            ))}
          </select>
          {error('sede')}
          {/* L'indirizzo del centro scelto, in chiaro: chi scrive sa gia' dove
              andra' (PRODUCT.md, «Cliccare un centro deve dare tutto»). */}
          {chosenCenter ? (
            <p className="field__note detail" id="center-details">
              {chosenCenter.palestra && chosenCenter.palestra !== chosenCenter.nome ? (
                <>
                  {chosenCenter.palestra}
                  <br />
                </>
              ) : null}
              {chosenCenter.indirizzo || chosenCenter.citta}
              {chosenCenter.mapsUrl ? (
                <>
                  <br />
                  <a className="breadcrumb" href={chosenCenter.mapsUrl} target="_blank" rel="noopener">
                    Apri in Maps
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>

      {options.pathway ? (
        <div className="field">
          <label htmlFor="corso">Percorso di interesse (facoltativo)</label>
          <select {...field('corso')}>
            <option value="">Nessuna preferenza</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
            {options.altreVoci.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {error('corso')}
        </div>
      ) : null}

      {options.messaggio ? (
        <div className="field">
          <label htmlFor="messaggio">Messaggio (facoltativo)</label>
          <textarea rows={5} {...field('messaggio')} />
          {error('messaggio')}
        </div>
      ) : null}

      <div className="field field--choice">
        <input
          type="checkbox"
          id="consenso"
          name="consenso"
          defaultChecked={state.values.consenso === 'on'}
          aria-invalid={state.errors.consenso ? true : undefined}
          aria-describedby={state.errors.consenso ? 'error-consenso' : undefined}
        />
        <label htmlFor="consenso">{texts.etichettaConsenso}</label>
        {/* Il link sta fuori dalla label: dentro, un click sull'informativa
            spunterebbe anche la casella. */}
        {texts.privacy ? (
          <p className="field__note">
            <Link className="breadcrumb" href={texts.privacy.href}>
              {texts.privacy.etichetta}
            </Link>
          </p>
        ) : null}
        {error('consenso')}
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
            onReady={mountTurnstile}
          />
          <div ref={turnstile} className="field field--turnstile" />
        </>
      ) : null}

      <p>
        <button type="submit" className="button button--primary" disabled={inProgress}>
          {inProgress ? 'Invio in corso' : texts.etichettaInvio}
        </button>
      </p>
    </form>
  )
}
