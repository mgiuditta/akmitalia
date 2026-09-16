import Link from 'next/link'
import React from 'react'

import type { Sedi } from '@/payload-types'
import { giorniLeggibili, indirizzoLeggibile, nomeIstruttore } from './dati'

/**
 * Una riga dell'elenco centri: nome, indirizzo, orari veri. Il dato sta a corpo
 * pieno e non si nasconde dietro un click, come vuole la Regola del Dato Nudo.
 *
 * Il quadrato verde di «Attivo in questa stagione» non e' piu' qui. L'elenco
 * contiene per costruzione i soli centri attivi, quindi quindici righe
 * portavano lo stesso segno e non distinguevano niente: un dato vivo che sta
 * ovunque non e' un dato, e' una decorazione. Il verde resta dove separa
 * davvero - la scheda del centro, che si apre anche per un centro chiuso - e
 * qui si dichiara solo l'eccezione, cioe' un centro non attivo che finisse in
 * elenco.
 *
 * `distanza` compare solo dopo che l'utente ha chiesto il centro piu' vicino:
 * fino ad allora la riga non sa dove sia chi legge.
 */
export function SchedaCentro({
  centro,
  titolo = 'h3',
  distanza = null,
  piuVicino = false,
}: {
  centro: Sedi
  titolo?: 'h2' | 'h3'
  distanza?: string | null
  piuVicino?: boolean
}) {
  const Titolo = titolo
  const orari = centro.orari ?? []

  return (
    <li className={`rivela centro${piuVicino ? ' centro--vicino' : ''}`}>
      {/* Il piu' vicino porta la parola, non solo la posizione nell'elenco. */}
      {piuVicino ? <p className="centro__vicino">Il più vicino a te</p> : null}
      <Titolo className="centro__nome">
        <Link className="centro__collegamento" href={`/centri/${centro.slug}`}>
          {centro.nome}
        </Link>
      </Titolo>

      <p className="centro__indirizzo">
        {indirizzoLeggibile(centro.indirizzo)}
        {distanza ? <span className="centro__distanza">a {distanza} da te</span> : null}
      </p>

      {orari.length > 0 ? (
        <div className="centro__orari">
          {orari.map((orario) => {
            const disciplina =
              typeof orario.disciplina === 'object' ? orario.disciplina?.nome : null
            const docenti = (orario.docenti ?? []).map(nomeIstruttore).filter(Boolean).join(', ')

            return (
              <div className="centro__orario" key={orario.id}>
                <span className="centro__giorni">{giorniLeggibili(orario.giorni)}</span>
                <span>
                  {orario.oraInizio}-{orario.oraFine}
                  {disciplina ? ` · ${disciplina}` : ''}
                  {docenti ? ` · Docente ${docenti}` : ''}
                  {orario.note ? ` · ${orario.note}` : ''}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="dato">Orari in aggiornamento.</p>
      )}

      {centro.attivo === false ? (
        <p className="dato">Non attivo in questa stagione: gli orari sono quelli dell’ultima.</p>
      ) : null}
    </li>
  )
}
