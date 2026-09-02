'use client'

import React, { useActionState, useEffect, useRef, useState } from 'react'

import Link from 'next/link'

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
 */

type Sede = { id: number; nome: string; citta: string }
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
  altra,
}: Props & { altra: () => void }) {
  const [stato, invia, inCorso] = useActionState(inviaRichiesta, STATO_INIZIALE)
  const [t, setT] = useState('')
  const avviso = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setT(String(Date.now()))
  }, [])

  useEffect(() => {
    if (stato.messaggio && !stato.ok) avviso.current?.focus()
  }, [stato])

  if (stato.ok) {
    return (
      <div className="conferma" role="status">
        <h3 className="display display--sm">Richiesta inviata</h3>
        <p className="testo">{stato.messaggio}</p>
        <button type="button" className="bottone bottone--secondario" onClick={altra}>
          Invia un’altra richiesta
        </button>
      </div>
    )
  }

  /* Un default, non un campo controllato: dopo un errore vince quello che
     l'utente aveva scelto, non lo slug arrivato dalla URL. */
  const iniziale: Partial<Record<CampoRichiesta, string>> = {
    corso: corsoIniziale ? String(corsoIniziale) : '',
  }

  const campo = (nome: CampoRichiesta) => ({
    id: nome,
    name: nome,
    defaultValue: stato.valori[nome] ?? iniziale[nome] ?? '',
    'aria-invalid': stato.errori[nome] ? true : undefined,
    'aria-describedby': stato.errori[nome] ? `errore-${nome}` : undefined,
  })

  const errore = (nome: CampoRichiesta) =>
    stato.errori[nome] ? (
      <p className="campo__errore" id={`errore-${nome}`}>
        {stato.errori[nome]}
      </p>
    ) : null

  return (
    <form className="modulo" action={invia} noValidate aria-busy={inCorso}>
      {stato.messaggio ? (
        <div ref={avviso} tabIndex={-1} role="alert" className="modulo__avviso">
          {stato.messaggio}
        </div>
      ) : null}

      {testi.nota ? <p className="dato">{testi.nota}</p> : null}

      <div className="modulo__riga">
        <div className="campo">
          <label htmlFor="cognome">Cognome</label>
          <input type="text" autoComplete="family-name" {...campo('cognome')} />
          {errore('cognome')}
        </div>
        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input type="text" autoComplete="given-name" {...campo('nome')} />
          {errore('nome')}
        </div>
      </div>

      <div className="modulo__riga">
        <div className="campo">
          <label htmlFor="email">Email</label>
          <input type="email" autoComplete="email" inputMode="email" {...campo('email')} />
          {errore('email')}
        </div>
        <div className="campo">
          <label htmlFor="telefono">Telefono</label>
          <input type="tel" autoComplete="tel" inputMode="tel" {...campo('telefono')} />
          {errore('telefono')}
        </div>
      </div>

      <div className="modulo__riga">
        {opzioni.dataNascita ? (
          <div className="campo">
            <label htmlFor="dataNascita">Data di nascita</label>
            <input type="date" autoComplete="bday" {...campo('dataNascita')} />
            {errore('dataNascita')}
          </div>
        ) : null}
        <div className="campo">
          <label htmlFor="sede">Centro tecnico</label>
          <select {...campo('sede')}>
            <option value="">Scegli un centro</option>
            {sedi.map((s) => (
              <option key={s.id} value={s.id}>
                {s.citta ? `${s.citta}: ${s.nome}` : s.nome}
              </option>
            ))}
          </select>
          {errore('sede')}
        </div>
      </div>

      {opzioni.percorso ? (
        <div className="campo">
          <label htmlFor="corso">Percorso di interesse (facoltativo)</label>
          <select {...campo('corso')}>
            <option value="">Nessuna preferenza</option>
            {corsi.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
            <option value="stage">Stage o evento</option>
            <option value="altro">Altro</option>
          </select>
          {errore('corso')}
        </div>
      ) : null}

      {opzioni.messaggio ? (
        <div className="campo">
          <label htmlFor="messaggio">Messaggio (facoltativo)</label>
          <textarea rows={5} {...campo('messaggio')} />
          {errore('messaggio')}
        </div>
      ) : null}

      <div className="campo campo--scelta">
        <input
          type="checkbox"
          id="consenso"
          name="consenso"
          defaultChecked={stato.valori.consenso === 'on'}
          aria-invalid={stato.errori.consenso ? true : undefined}
          aria-describedby={stato.errori.consenso ? 'errore-consenso' : undefined}
        />
        <label htmlFor="consenso">{testi.etichettaConsenso}</label>
        {/* Il link sta fuori dalla label: dentro, un click sull'informativa
            spunterebbe anche la casella. */}
        {testi.privacy ? (
          <p className="campo__nota">
            <Link className="briciola" href={testi.privacy.href}>
              {testi.privacy.etichetta}
            </Link>
          </p>
        ) : null}
        {errore('consenso')}
      </div>

      <div className="campo campo--nascosto" aria-hidden="true">
        <label htmlFor="sito">Sito web</label>
        <input type="text" id="sito" name="sito" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="t" value={t} readOnly />

      <p>
        <button type="submit" className="bottone bottone--primario" disabled={inCorso}>
          {inCorso ? 'Invio in corso' : testi.etichettaInvio}
        </button>
      </p>
    </form>
  )
}
