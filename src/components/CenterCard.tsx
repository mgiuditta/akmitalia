import Link from 'next/link'
import React from 'react'

import type { Sedi } from '@/payload-types'
import { readableDays, readableAddress, instructorName } from './data'

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
 * `distance` compare solo dopo che l'utente ha chiesto il centro piu' vicino:
 * fino ad allora la riga non sa dove sia chi legge.
 */
export function CenterCard({
  center,
  title = 'h3',
  distance = null,
  nearest = false,
}: {
  center: Sedi
  title?: 'h2' | 'h3'
  distance?: string | null
  nearest?: boolean
}) {
  const Title = title
  const schedule = center.orari ?? []

  return (
    <li className={`reveal center${nearest ? ' center--nearest' : ''}`}>
      {/* Il piu' vicino porta la parola, non solo la posizione nell'elenco. */}
      {nearest ? <p className="center__nearest">Il più vicino a te</p> : null}
      <Title className="center__name">
        <Link className="center__link" href={`/centri/${center.slug}`}>
          {center.nome}
        </Link>
      </Title>

      <p className="center__address">
        {readableAddress(center.indirizzo)}
        {distance ? <span className="center__distance">a {distance} da te</span> : null}
      </p>

      {schedule.length > 0 ? (
        <div className="center__schedule">
          {schedule.map((slot) => {
            const discipline =
              typeof slot.disciplina === 'object' ? slot.disciplina?.nome : null
            const teachers = (slot.docenti ?? []).map(instructorName).filter(Boolean).join(', ')

            return (
              <div className="center__slot" key={slot.id}>
                <span className="center__days">{readableDays(slot.giorni)}</span>
                <span>
                  {slot.oraInizio}-{slot.oraFine}
                  {discipline ? ` · ${discipline}` : ''}
                  {teachers ? ` · Docente ${teachers}` : ''}
                  {slot.note ? ` · ${slot.note}` : ''}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="detail">Orari in aggiornamento.</p>
      )}

      {center.attivo === false ? (
        <p className="detail">Non attivo in questa stagione: gli orari sono quelli dell’ultima.</p>
      ) : null}
    </li>
  )
}
