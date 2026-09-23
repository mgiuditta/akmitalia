import Link from 'next/link'
import React from 'react'

export type ProvinceGroup = { province: string; towns: string[] }

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
export function SiteFooter({
  name,
  text,
  provinces,
  contacts,
  companyName,
  vatNumber,
  legal = [],
}: {
  name: string
  text?: string | null
  provinces: ProvinceGroup[]
  contacts?: { email?: string | null; phone?: string | null }
  companyName?: string | null
  vatNumber?: string | null
  legal?: { label: string; href: string }[]
}) {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" id="footer">
      <div className="container">
        {/* Il footer e' una sezione interna: il filetto la apre (docs/adr/0009). */}
        <span className="rule footer__rule" aria-hidden="true" />

        <div className="footer__grid">
          <div className="footer__brand">
            <p className="display display--sm footer__name">{name}</p>
            {text ? <p className="text footer__text">{text}</p> : null}

            {contacts?.email || contacts?.phone ? (
              <ul className="footer__channels">
                {contacts?.email ? (
                  <li>
                    <a className="footer__link" href={`mailto:${contacts.email}`}>
                      {contacts.email}
                    </a>
                  </li>
                ) : null}
                {contacts?.phone ? (
                  <li>
                    <a className="footer__link" href={`tel:${contacts.phone.replace(/\s/g, '')}`}>
                      {contacts.phone}
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>

          <nav className="footer__column" aria-label="Sezioni del sito">
            <p className="footer__title">Il sito</p>
            <ul className="footer__items">
              <li>
                <Link className="footer__link" href="/corsi">
                  I percorsi
                </Link>
              </li>
              <li>
                <Link className="footer__link" href="/centri">
                  I centri tecnici
                </Link>
              </li>
              <li>
                <Link className="footer__link" href="/istruttori">
                  Gli istruttori
                </Link>
              </li>
              <li>
                <Link className="footer__link" href="/eventi">
                  Gli eventi
                </Link>
              </li>
              <li>
                <Link className="footer__link" href="/#prima-volta">
                  La prima lezione
                </Link>
              </li>
              <li>
                <Link className="footer__link" href="/contatti">
                  Richiedi informazioni
                </Link>
              </li>
            </ul>
          </nav>

          {provinces.length > 0 ? (
            <div className="footer__column">
              <p className="footer__title">Dove si pratica</p>
              {/* Raggruppati per provincia scritta per esteso: «MB» non e' una
                  parola che qualcuno cerca, «Monza e Brianza» si'. */}
              <dl className="footer__provinces">
                {provinces.map((group) => (
                  <div className="footer__province" key={group.province}>
                    <dt>{group.province}</dt>
                    <dd>{group.towns.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>

        <div className="footer__tail">
          <span>
            © {year} {companyName || name}
          </span>
          {vatNumber ? <span>Partita IVA {vatNumber}</span> : null}
          {/* Le legali stanno in coda, non nella directory sopra: sono un obbligo
              da assolvere, non una destinazione che qualcuno cerca. */}
          {legal.map((item) => (
            <Link className="footer__link" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
