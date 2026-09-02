import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { apriPayload } from '@/componenti/payload'
import { idDisciplina, ordinale, pubblicato, testiBivio } from '@/componenti/dati'
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
    'I percorsi AKM Italia: difesa personale per adulti, Krav Maga Kids, antiaggressione, formazione tecnica. A chi si rivolgono e dove si praticano.',
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
      <section className="sezione sezione--nera testata bivio__testa">
        <div className="contenitore testata__contenuto">
          <h1 className="display display--lg">{bivio.titolo}</h1>
          <p className="testo testata__testo">{bivio.testo}</p>
          {/* Il conteggio sta qui e non in una sezione sua: una fascia intera per
              una riga di titolo era un blocco vuoto fra due blocchi pieni. */}
          {corsi.docs.length > 0 ? (
            <p className="dato">{corsi.docs.length} percorsi, in ordine di lettura.</p>
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
        <ol className="bivio" aria-label="I percorsi">
          {corsi.docs.map((corso, i) => {
            const superficie = corso.superficie ?? 'carbone'
            const quante = sediPerCorso.get(corso.id) ?? 0
            const segno = typeof corso.immagine === 'object' ? corso.immagine : null

            return (
              <li className={`rivela percorso percorso--${superficie}`} key={corso.id}>
                <Link className="contenitore percorso__riga" href={`/corsi/${corso.slug}`}>
                  <span className="percorso__indice" aria-hidden="true">
                    {ordinale(i + 1)}
                  </span>

                  <span className="percorso__domanda">
                    <span className="display display--md">{corso.domanda || corso.nome}</span>
                    <span className="percorso__nome">{corso.nome}</span>
                    <span className="testo percorso__sommario">{corso.sommario}</span>
                    <span className="percorso__coda">
                      {corso.aChiSiRivolge ? <span>{corso.aChiSiRivolge}</span> : null}
                      {quante > 0 ? (
                        <span className="stato">
                          {quante} {quante === 1 ? 'centro lo tiene' : 'centri lo tengono'}
                        </span>
                      ) : null}
                    </span>
                  </span>

                  {/* Il segno e' inchiostro su trasparente: sulle superfici scure
                      si inverte, non si nasconde. */}
                  {segno?.url ? (
                    <Image
                      className="percorso__segno-marchio"
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
        <section className="sezione sezione--chiara">
          <p className="testo vuoto contenitore">
            I percorsi della stagione sono in aggiornamento. Scrivici e ti diciamo qual è quello
            che ti riguarda.
          </p>
        </section>
      )}

    </>
  )
}
