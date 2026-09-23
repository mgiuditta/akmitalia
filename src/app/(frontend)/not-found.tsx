import Link from 'next/link'
import React from 'react'

/**
 * La 404 del sito pubblico. Prima non esisteva: usciva quella di serie di Next,
 * in inglese, senza barra e senza una via d'uscita, su un documento che dichiara
 * `lang="it"`.
 *
 * La catch-all di `[...path]` raccoglie ogni URL sconosciuta e chiama
 * `notFound()`, quindi questo file copre sia le schede che non esistono piu'
 * (un centro chiuso, un evento tolto) sia gli indirizzi mai esistiti.
 *
 * Dice la causa e apre le tre strade che il sito ha: i centri, i percorsi, la
 * richiesta. Nessun numerone «404» in Anton: la cifra non e' un'affermazione
 * del marchio, e chi arriva qui ha sbagliato indirizzo, non merito.
 */

/* Nessun `export const metadata` qui: Next lo legge solo da `global-not-found`,
   e su un not-found di segmento non avrebbe effetto. Il titolo lo mette la
   generateMetadata della rotta che ha chiamato notFound(); il `noindex` lo
   inietta Next da solo su una risposta 404. */

export default function NotFoundPage() {
  return (
    <>
      <section className="section section--black masthead">
        <div className="container masthead__content">
          <p className="eyebrow">Errore 404</p>
          <h1 className="display display--lg">Questa pagina non c’è</h1>
          <p className="text masthead__text">
            L’indirizzo è sbagliato, oppure la pagina è stata tolta: succede quando un centro
            chiude la stagione o un evento esce dal calendario.
          </p>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <h2 className="display display--sm list-title">Da qui si riparte</h2>
          <ul className="list__items list__items--wide">
            <li>
              <Link href="/centri">I centri tecnici, con indirizzo e orari</Link>
            </li>
            <li>
              <Link href="/corsi">I percorsi, per capire qual è il tuo</Link>
            </li>
            <li>
              <Link href="/eventi">Il calendario degli eventi</Link>
            </li>
            <li>
              <Link href="/">La home</Link>
            </li>
          </ul>

          <p className="tail-action">
            <Link className="button button--primary" href="/contatti">
              Richiedi informazioni
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
