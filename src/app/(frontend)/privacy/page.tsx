/**
 * L'informativa privacy. **Struttura, e il testo e' una bozza marcata**: quello
 * vero non lo scrive un agente, viene dal cliente o da chi gli tiene la
 * privacy (ticket #20).
 *
 * Il testo non viene ancora da `Pagine`: quella collection sta per cambiare
 * forma (#32), e cablarla adesso vorrebbe dire farlo due volte.
 */
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { Apertura, Coda, Pagina, Sezione } from '../anatomia'

export const metadata: Metadata = {
  title: 'Privacy — AKM Italia',
  description: 'Come AKM Italia tratta i dati di chi manda una richiesta di contatto.',
  robots: { index: false },
}

export default function Privacy() {
  return (
    <Pagina peso="documento">
      <Apertura
        occhiello="Informativa"
        titolo="Privacy"
        sommario="Come AKM Italia tratta i dati che riceve quando mandi una richiesta di contatto, e per quanto tempo li tiene."
      />

      <Sezione
        titolo="Quali dati raccogliamo"
        righe={[
          'Cognome, nome, email e telefono: li scrivi tu nel modulo di richiesta.',
          'La sede e il percorso che hai indicato, per instradare la richiesta al responsabile giusto.',
          'Il messaggio che scrivi, se lo scrivi.',
          'Il momento in cui hai dato il consenso, registrato dal server.',
        ]}
      />

      <Sezione
        titolo="Cosa non raccogliamo"
        righe={[
          'Nessun cookie di terze parti, nessuno script di analisi, nessun pulsante social che ti segue.',
          'Nessuna data di nascita: serve all’iscrizione, che avviene di persona e fuori da questo sito.',
        ]}
      />

      <Sezione
        titolo="Chi li vede"
        righe={[
          'Il responsabile del centro tecnico che hai indicato.',
          'La segreteria di AKM Italia.',
        ]}
      />

      <Sezione
        titolo="Per quanto tempo"
        righe={[
          'Fino alla chiusura della richiesta, e comunque non oltre ventiquattro mesi.',
        ]}
      />

      <Sezione
        titolo="I tuoi diritti"
        righe={[
          'Puoi chiedere di vedere, correggere o cancellare i tuoi dati scrivendo alla segreteria.',
        ]}
      />

      <Coda>
        <strong>Bozza.</strong> Questo testo è una traccia scritta dalla struttura del modulo, non
        un’informativa validata: il testo definitivo è il ticket #20.{' '}
        <Link href="/contatta">Il modulo di richiesta</Link> è quello a cui si riferisce.
      </Coda>
    </Pagina>
  )
}
