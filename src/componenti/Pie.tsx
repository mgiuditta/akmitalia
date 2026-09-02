import Link from 'next/link'
import React from 'react'

export type GruppoProvincia = { provincia: string; comuni: string[] }

/**
 * Il footer e' una directory, non un richiamo all'azione: link in grassetto,
 * blocco alto, fondo carbone, nessun bottone. Le righe senza dato non lasciano
 * etichette vuote: spariscono.
 *
 * Tre colonne e non due: la marca con i recapiti, le sezioni del sito, e i
 * comuni raggruppati per provincia scritta per esteso. Prima i recapiti stavano
 * in coda ai link di navigazione, nella stessa lista: un indirizzo email non e'
 * una sezione del sito, e messo li' leggeva come una voce di menu.
 *
 * Le voci puntano a rotte, non ad ancore: il footer e' globale e #percorsi
 * esiste solo in home, quindi da /istruttori quei link non portavano da nessuna
 * parte. L'unica ancora rimasta e' assoluta.
 */
export function Pie({
  nome,
  testo,
  province,
  contatti,
  ragioneSociale,
  partitaIva,
  legali = [],
}: {
  nome: string
  testo?: string | null
  province: GruppoProvincia[]
  contatti?: { email?: string | null; telefono?: string | null }
  ragioneSociale?: string | null
  partitaIva?: string | null
  legali?: { etichetta: string; href: string }[]
}) {
  const anno = new Date().getFullYear()

  return (
    <footer className="pie" id="pie">
      <div className="contenitore">
        {/* Il footer e' una sezione interna: il filetto la apre (docs/adr/0009). */}
        <span className="filetto pie__filetto" aria-hidden="true" />

        <div className="pie__griglia">
          <div className="pie__marca">
            <p className="display display--sm pie__nome">{nome}</p>
            {testo ? <p className="testo pie__testo">{testo}</p> : null}

            {contatti?.email || contatti?.telefono ? (
              <ul className="pie__recapiti">
                {contatti?.email ? (
                  <li>
                    <a className="pie__link" href={`mailto:${contatti.email}`}>
                      {contatti.email}
                    </a>
                  </li>
                ) : null}
                {contatti?.telefono ? (
                  <li>
                    <a className="pie__link" href={`tel:${contatti.telefono.replace(/\s/g, '')}`}>
                      {contatti.telefono}
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>

          <nav className="pie__colonna" aria-label="Sezioni del sito">
            <p className="pie__titolo">Il sito</p>
            <ul className="pie__voci">
              <li>
                <Link className="pie__link" href="/corsi">
                  I percorsi
                </Link>
              </li>
              <li>
                <Link className="pie__link" href="/centri">
                  I centri tecnici
                </Link>
              </li>
              <li>
                <Link className="pie__link" href="/istruttori">
                  Gli istruttori
                </Link>
              </li>
              <li>
                <Link className="pie__link" href="/eventi">
                  Gli eventi
                </Link>
              </li>
              <li>
                <Link className="pie__link" href="/#prima-volta">
                  La prima lezione
                </Link>
              </li>
              <li>
                <Link className="pie__link" href="/contatti">
                  Richiedi informazioni
                </Link>
              </li>
            </ul>
          </nav>

          {province.length > 0 ? (
            <div className="pie__colonna">
              <p className="pie__titolo">Dove si pratica</p>
              {/* Raggruppati per provincia scritta per esteso: «MB» non e' una
                  parola che qualcuno cerca, «Monza e Brianza» si'. */}
              <dl className="pie__province">
                {province.map((gruppo) => (
                  <div className="pie__provincia" key={gruppo.provincia}>
                    <dt>{gruppo.provincia}</dt>
                    <dd>{gruppo.comuni.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>

        <div className="pie__coda">
          <span>
            © {anno} {ragioneSociale || nome}
          </span>
          {partitaIva ? <span>Partita IVA {partitaIva}</span> : null}
          {/* Le legali stanno in coda, non nella directory sopra: sono un obbligo
              da assolvere, non una destinazione che qualcuno cerca. */}
          {legali.map((voce) => (
            <Link className="pie__link" href={voce.href} key={voce.href}>
              {voce.etichetta}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
