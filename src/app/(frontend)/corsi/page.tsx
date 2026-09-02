import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { idDisciplina, pubblicato } from '@/componenti/dati'

/**
 * L'indice dei percorsi. Un percorso e' un corso marcato, non una collection
 * (docs/adr/0003): qui si elencano tutti i corsi, e quelli che stanno nel bivio
 * portano anche la loro domanda in prima persona.
 */

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Percorsi',
  description:
    'I percorsi AKM Italia: difesa personale per adulti, Krav Maga Kids, antiaggressione, formazione tecnica. A chi si rivolgono e dove si praticano.',
  alternates: { canonical: '/corsi' },
}

export default async function PaginaCorsi() {
  const payload = await getPayload({ config: await config })

  const [corsi, sedi] = await Promise.all([
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

  return (
    <>
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <span className="filetto" aria-hidden="true" />
          <h1 className="display display--lg">Qual è il tuo momento</h1>
          <p className="testo testata__testo">
            Non serve sapere quale disciplina fa per te. Serve sapere perché sei qui: da lì si
            arriva al corso giusto e al centro che lo tiene.
          </p>
        </div>
      </section>

      <section className="sezione sezione--chiara" aria-labelledby="titolo-corsi">
        <div className="contenitore">
          <h2 className="display display--sm titolo-elenco" id="titolo-corsi">
            {corsi.docs.length > 0 ? `${corsi.docs.length} percorsi` : 'I percorsi'}
          </h2>

          {corsi.docs.length > 0 ? (
            <ul className="corsi">
              {corsi.docs.map((corso) => {
                const quante = sediPerCorso.get(corso.id) ?? 0

                const segno = typeof corso.immagine === 'object' ? corso.immagine : null

                return (
                  <li className="rivela corso" key={corso.id}>
                    {/* Il segno del percorso vive solo su superficie chiara: e'
                        inchiostro su trasparente e sul nero sparirebbe. */}
                    {segno?.url ? (
                      <Image
                        className="corso__segno"
                        src={segno.url}
                        alt=""
                        width={96}
                        height={96}
                        sizes="96px"
                      />
                    ) : null}
                    <div className="corso__testo">
                      <h3 className="corso__nome">
                        <Link href={`/corsi/${corso.slug}`}>{corso.domanda || corso.nome}</Link>
                      </h3>
                      <p className="testo">{corso.sommario}</p>
                    </div>

                    <div className="corso__coda">
                      <p>
                        <strong>{corso.nome}</strong>
                      </p>
                      {/* La categoria e' un dato della riga, non un'etichetta sopra il
                          titolo: tre micro-etichette in fila su una pagina di due
                          sezioni sono il ritmo templated che il sistema evita. */}
                      {corso.occhiello ? <p>{corso.occhiello}</p> : null}
                      {corso.aChiSiRivolge ? <p>{corso.aChiSiRivolge}</p> : null}
                      {quante > 0 ? (
                        <p className="stato">
                          {quante} {quante === 1 ? 'centro lo tiene' : 'centri lo tengono'}
                        </p>
                      ) : null}
                      <p>
                        <Link className="briciola" href={`/corsi/${corso.slug}`}>
                          Vedi il percorso
                        </Link>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="testo vuoto">
              I percorsi della stagione sono in aggiornamento. Scrivici e ti diciamo qual è quello
              che ti riguarda.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
