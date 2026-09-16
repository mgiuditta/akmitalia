'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'

/**
 * Quando una rotta non riesce a rendersi - Payload che non risponde, una query
 * che esplode - senza questo file usciva la pagina d'errore di serie di Next:
 * fuori dal sistema, in inglese, senza barra e senza un recapito alternativo,
 * anche su /contatti, che e' l'unico esito misurabile del sito.
 *
 * Il confine sta nel gruppo `(frontend)`, quindi barra e piede restano: chi
 * legge ha ancora la navigazione, i comuni del piede e i recapiti.
 *
 * `retry()` e' il prop di Next 16 (prima si chiamava `reset`): rifa' il fetch e
 * il render del sottoalbero. E' un bottone secondario perche' riprovare non e'
 * l'azione della pagina: l'azione resta scrivere.
 */

export default function Errore({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <p className="occhiello">Errore del sito</p>
          <h1 className="display display--lg">Qualcosa non ha risposto</h1>
          <p className="testo testata__testo">
            Non siamo riusciti a caricare questa pagina. Non è colpa di quello che hai fatto:
            riprova fra un momento, oppure scrivici e ti rispondiamo noi.
          </p>
          {error.digest ? <p className="dato">Riferimento tecnico: {error.digest}</p> : null}
        </div>
      </section>

      <section className="sezione sezione--chiara">
        <div className="contenitore">
          <p className="coda-azione">
            <button type="button" className="bottone bottone--secondario" onClick={() => retry()}>
              Riprova
            </button>
            <Link className="bottone bottone--primario" href="/contatti">
              Richiedi informazioni
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
