import Link from 'next/link'
import React from 'react'

export type VoceCentro = { nome: string; citta: string; provincia?: string | null }

/**
 * Il footer e' una directory, non un richiamo all'azione: link in grassetto,
 * blocco alto, fondo carbone, nessun bottone. Le righe senza dato non lasciano
 * etichette vuote: spariscono.
 *
 * Le voci puntano a rotte, non ad ancore: il footer e' globale e #percorsi
 * esiste solo in home, quindi da /istruttori quei link non portavano da nessuna
 * parte. L'unica ancora rimasta e' assoluta.
 */
export function Pie({
  nome,
  testo,
  centri,
  contatti,
  ragioneSociale,
  partitaIva,
}: {
  nome: string
  testo?: string | null
  centri: VoceCentro[]
  contatti?: { email?: string | null; telefono?: string | null }
  ragioneSociale?: string | null
  partitaIva?: string | null
}) {
  const anno = new Date().getFullYear()

  return (
    <footer className="pie" id="pie">
      <div className="contenitore">
        <div className="pie__griglia">
          <div>
            <p className="pie__titolo">{nome}</p>
            {testo ? <p className="testo">{testo}</p> : null}
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
                <Link className="pie__link" href="/#prima-volta">
                  La prima lezione
                </Link>
              </li>
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
          </div>

          {centri.length > 0 ? (
            <div>
              <p className="pie__titolo">Dove si pratica</p>
              <ul className="pie__citta">
                {centri.map((c) => (
                  <li key={c.nome}>
                    {c.citta}
                    {c.provincia ? ` (${c.provincia})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="pie__coda">
          <span>
            © {anno} {ragioneSociale || nome}
          </span>
          {partitaIva ? <span>Partita IVA {partitaIva}</span> : null}
        </div>
      </div>
    </footer>
  )
}
