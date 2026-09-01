/**
 * Il corpo del 404 (#29). Vive in un file suo perche' ha due ingressi, ed e'
 * un vincolo di Next, non una scelta: `not-found.tsx` risponde alle rotte che
 * chiamano `notFound()` (uno slug di centro o di corso che non esiste),
 * `global-not-found.tsx` risponde alle URL che non corrispondono a niente.
 * Il sito ha due layout radice — il pubblico e quello dell'admin Payload — e
 * con due radici Next non sa quale guscio dare a una URL sconosciuta.
 *
 * Il censimento (#15) ha ucciso venti pagine WordPress e nessuna di quelle URL
 * avra' un redirect: questa pagina e' cio' che le riceve. Chi ci arriva non
 * cerca quella pagina, cerca una sede, e le due azioni sono quelle. Niente
 * ricerca, niente mappa del sito, e l'anatomia normale: un 404 travestito da
 * errore di sistema dice al visitatore che il sito e' rotto, e non lo e'.
 */
import React from 'react'
import Link from 'next/link'

import { Apertura, Azione, Coda, Pagina } from './anatomia'

export const TITOLO = 'Pagina non trovata — AKM Italia'

export const NonTrovata = () => (
  <Pagina peso="documento">
    <Apertura
      occhiello="Errore 404"
      titolo="Questa pagina non c'è"
      sommario="Il sito è stato rifatto e molti indirizzi vecchi non esistono più. Se ci sei arrivato da un link o da una ricerca, quasi sempre quello che cercavi è nella scheda di un centro."
    >
      <Azione href="/centri">Trova un centro</Azione>
      <Link href="/#bivio">Vedi i percorsi</Link>
    </Apertura>

    <Coda>
      Se cercavi qualcosa di preciso e non lo trovi, <Link href="/contatta">scrivici</Link>: la
      richiesta arriva al responsabile del centro che scegli.
    </Coda>
  </Pagina>
)
