import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { apriPayload } from '@/componenti/payload'
import { classeSuperficie, idDisciplina, ordinale, pubblicato, testiBivio } from '@/componenti/dati'
import { Figura } from '@/componenti/Figura'
import { metadatiPagina } from '@/componenti/seo'

/**
 * L'indice dei percorsi. Un percorso e' un corso marcato, non una collection
 * (docs/adr/0003): qui si elencano tutti i corsi, e quelli che stanno nel bivio
 * portano anche la loro domanda in prima persona.
 *
 * Ogni riga e' una fascia a tutta larghezza sul proprio ruolo di superficie
 * (`corso.superficie`), che e' il modo in cui DESIGN.md distingue un corso da
 * un altro: il sistema non ha accenti cromatici, quindi si cambia il valore del
 * fondo, e sempre con il nome scritto accanto (Regola dell'Etichetta).
 * E' lo stesso trattamento del bivio in home, senza il ripiegamento a fisarmonica:
 * qui la riga porta direttamente alla scheda.
 */

export const revalidate = 60

export const metadata: Metadata = metadatiPagina({
  titolo: 'Percorsi',
  descrizione:
    'I percorsi AKM Italia: difesa personale per adulti, Krav Maga Kids, antiaggressione. A chi si rivolgono, dove si praticano e in quanti centri.',
  path: '/corsi',
})

export default async function PaginaCorsi() {
  const payload = await apriPayload()

  const [corsi, sedi, impostazioni] = await Promise.all([
    payload.find({
      collection: 'corsi',
      depth: 1,
      limit: 50,
      sort: 'ordine',
      where: pubblicato,
    }),
    payload.find({
      collection: 'sedi',
      depth: 0,
      limit: 200,
      select: { orari: true },
      where: { and: [{ attivo: { equals: true } }, pubblicato] },
    }),
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
  ])

  // Quante sedi tengono un dato corso: la prova che un percorso non e' un'astrazione.
  const sediPerCorso = new Map<number, number>()
  for (const centro of sedi.docs) {
    const idCorsi = new Set(
      (centro.orari ?? [])
        .map((o) => idDisciplina(o.disciplina))
        .filter((id): id is number => id !== null),
    )
    for (const id of idCorsi) sediPerCorso.set(id, (sediPerCorso.get(id) ?? 0) + 1)
  }

  const bivio = testiBivio(impostazioni)

  return (
    <>
      <section className="section section--black masthead fork__head">
        <div className="container masthead__content">
          <h1 className="display display--lg">{bivio.titolo}</h1>
          <p className="text masthead__text">{bivio.testo}</p>
          {/* Il conteggio sta qui e non in una sezione sua: una fascia intera per
              una riga di titolo era un blocco vuoto fra due blocchi pieni. */}
          {corsi.docs.length > 0 ? (
            <p className="detail">{corsi.docs.length} percorsi, in ordine di lettura.</p>
          ) : null}
        </div>
      </section>

      {/* `priorita`: su queste pagine la banda e' l'LCP, la testata sopra e'
          tipografica e non ha niente da caricare. */}
      <Figura
        slot={impostazioni?.fotoPagine?.corsi}
        etichetta="Foto della pagina Percorsi"
        formato="banda"
        misura="grande"
        sizes="100vw"
        priorita
      />

      {corsi.docs.length > 0 ? (
        <ol className="fork" aria-label="I percorsi">
          {corsi.docs.map((corso, i) => {
                        const quante = sediPerCorso.get(corso.id) ?? 0
            const segno = typeof corso.immagine === 'object' ? corso.immagine : null

            return (
              <li className={`reveal path ${classeSuperficie(corso.superficie)}`} key={corso.id}>
                <Link className="container path__row" href={`/corsi/${corso.slug}`}>
                  <span className="path__index" aria-hidden="true">
                    {ordinale(i + 1)}
                  </span>

                  <span className="path__question">
                    <span className="display display--md">{corso.domanda || corso.nome}</span>
                    <span className="path__name">{corso.nome}</span>
                    <span className="text path__summary">{corso.sommario}</span>
                    {/* Un percorso che nessun centro attivo tiene non perde la riga
                        in silenzio: la riga c'e' e dice perche'. Il quadrato verde
                        resta al dato vivo, cioe' ai centri che lo tengono davvero. */}
                    <span className="path__tail">
                      {corso.aChiSiRivolge ? <span>{corso.aChiSiRivolge}</span> : null}
                      {quante > 0 ? (
                        <span className="status">
                          {quante} {quante === 1 ? 'centro lo tiene' : 'centri lo tengono'}
                        </span>
                      ) : (
                        <span>Non in calendario in questa stagione</span>
                      )}
                    </span>
                  </span>

                  {/* Il segno e' inchiostro su trasparente: sulle superfici scure
                      si inverte, non si nasconde. */}
                  {segno?.url ? (
                    <Image
                      className="path__mark-logo"
                      src={segno.url}
                      alt=""
                      width={96}
                      height={96}
                      sizes="96px"
                    />
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ol>
      ) : (
        <section className="section section--light">
          <p className="text empty container">
            I percorsi della stagione sono in aggiornamento. Scrivici e ti diciamo qual è quello
            che ti riguarda.
          </p>
        </section>
      )}

      {/* La chiusura. L'ultima riga del bivio ha il fondo che ha - dipende dal
          ruolo di superficie dell'ultimo corso - e quando capitava carbone la
          pagina finiva contro un piede carbone, separata da una riga #333: due
          superfici uguali dove doveva esserci il cambio di valore che chiude
          (Regola del Valore). Una fascia chiara chiude sempre, e porta l'azione
          che la pagina fin qui non aveva. */}
      <section className="section section--light" aria-labelledby="courses-tail-title">
        <div className="container">
          <span className="rule" aria-hidden="true" />
          <h2 className="display display--md step__title" id="courses-tail-title">
            Non sai quale è il tuo
          </h2>
          <p className="text first__lead">
            Scrivici in due righe cosa cerchi: ti diciamo quale percorso ti riguarda e in quale
            centro si tiene, senza impegno.
          </p>
          <p className="tail-action">
            <Link className="button button--primary" href="/contatti">
              Richiedi informazioni
            </Link>
            <Link className="button button--secondary" href="/centri">
              Vedi tutti i centri
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
