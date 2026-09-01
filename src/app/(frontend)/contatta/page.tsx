/**
 * La richiesta di contatto — **struttura, non ancora comportamento**.
 *
 * I campi e i vincoli vengono dalla mappa della catena di conversione (#14):
 * un form solo, su una pagina sola, con sede e corso precompilati da
 * querystring quando si arriva da una scheda, e una voce di **non-scelta** su
 * entrambi, perche' chi arriva da un corso che nessun centro attivo tiene non
 * ha una sede da nominare (#24). Niente data di nascita: serve all'iscrizione,
 * che avviene dopo e fuori dal sito.
 *
 * Quello che **non** c'e' ancora, ed e' dei ticket #19 e #21: l'invio, la
 * validazione, gli errori, la conferma, l'honeypot con la time-trap, e le
 * parole editabili dal cliente. Qui c'e' il campo, non la sua vita.
 */
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { comune } from '../centri/sede'
import { Apertura, Coda, Pagina, Sezione } from '../anatomia'
import stile from './modulo.module.css'

export const metadata: Metadata = {
  title: 'Contatta AKM Italia',
  description: 'Manda una richiesta di informazioni al centro tecnico più vicino.',
}

/** La non-scelta e' una voce vera, non il placeholder vuoto di un `select`. */
const NON_SO = 'non-lo-so'

export default async function Contatta(props: {
  searchParams: Promise<{ sede?: string; corso?: string }>
}) {
  const { sede, corso } = await props.searchParams

  const payload = await getPayload({ config: await config })
  const [sedi, corsi] = await Promise.all([
    payload.find({
      collection: 'sedi',
      where: { attivo: { equals: true } },
      limit: 200,
      depth: 0,
      sort: 'indirizzo.citta',
    }),
    payload.find({ collection: 'corsi', limit: 20, depth: 0, sort: 'nome' }),
  ])

  return (
    <Pagina peso="documento">
      <Apertura
        occhiello="Richiesta"
        titolo="Chiedi informazioni"
        sommario="Dicci dove ti è comodo allenarti e cosa stai cercando. Ti risponde il responsabile di quel centro, non un call center. Non serve decidere niente adesso."
      />

      <Sezione titolo="I tuoi dati">
        {/* Nessuna `action`: l'invio e' #19, e un form che finge di inviare e'
            peggio di un form che dichiara di non farlo ancora. */}
        <form className={stile.modulo}>
          <p className={stile.campo}>
            <label htmlFor="cognome">Cognome</label>
            <input id="cognome" name="cognome" type="text" autoComplete="family-name" required />
          </p>
          <p className={stile.campo}>
            <label htmlFor="nome">Nome</label>
            <input id="nome" name="nome" type="text" autoComplete="given-name" required />
          </p>
          <p className={stile.campo}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </p>
          <p className={stile.campo}>
            <label htmlFor="telefono">Telefono</label>
            <input id="telefono" name="telefono" type="tel" autoComplete="tel" />
            <span className={stile.aiuto}>Facoltativo. Serve solo se preferisci una chiamata.</span>
          </p>

          <p className={stile.campo}>
            <label htmlFor="sede">Dove ti è comodo</label>
            <select id="sede" name="sede" defaultValue={sede ?? NON_SO}>
              <option value={NON_SO}>Non lo so ancora</option>
              {(sedi.docs as Sede[]).map((s) => (
                <option key={s.id} value={s.slug ?? String(s.id)}>
                  {comune(s)} — {s.nome}
                </option>
              ))}
            </select>
          </p>

          <p className={stile.campo}>
            <label htmlFor="corso">Cosa stai cercando</label>
            <select id="corso" name="corso" defaultValue={corso ?? NON_SO}>
              <option value={NON_SO}>Non lo so ancora</option>
              {(corsi.docs as Corso[]).map((c) => (
                <option key={c.id} value={c.slug ?? String(c.id)}>
                  {c.nome}
                </option>
              ))}
            </select>
          </p>

          <p className={stile.campo}>
            <label htmlFor="messaggio">Messaggio</label>
            <textarea id="messaggio" name="messaggio" rows={5} />
            <span className={stile.aiuto}>
              Facoltativo. Se hai una domanda precisa, scrivila: ti risponde chi insegna.
            </span>
          </p>

          <p className={stile.consenso}>
            <input id="consenso" name="consenso" type="checkbox" required />
            <label htmlFor="consenso">
              Ho letto l’<Link href="/privacy">informativa privacy</Link> e acconsento al
              trattamento dei miei dati per essere ricontattato.
            </label>
          </p>

          <p className={stile.azioni}>
            <button className={stile.invia} disabled type="submit">
              Manda la richiesta
            </button>
            <span className={stile.bozza}>Struttura: l’invio arriva con #19.</span>
          </p>
        </form>
      </Sezione>

      <Coda>
        Preferisci vedere prima dove si allena?{' '}
        <Link href="/centri">Indirizzi, giorni e orari di tutti i centri</Link>.
      </Coda>
    </Pagina>
  )
}
