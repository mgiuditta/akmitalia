import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { openPayload } from '@/components/payload'
import { published } from '@/components/data'
import { Figure } from '@/components/Figure'
import { pageMetadata } from '@/components/seo'

/**
 * L'albo. Le credenziali sono prove, non decorazioni: nome, ruolo, grado e
 * qualifiche stanno in chiaro accanto ai centri dove la persona insegna.
 *
 * ponytail: solo l'indice, nessuna pagina di dettaglio. La bio esiste a CMS e
 * diventa una rotta quando qualcuno la chiede.
 */

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const payload = await openPayload()
  const total = (await payload.count({ collection: 'istruttori', where: published })).totalDocs

  return pageMetadata({
    titolo: 'Istruttori',
    descrizione: total
      ? `${total} istruttori e maestri AKM Italia: nome, qualifica, grado e centro dove insegnano. Qualifiche riconosciute CSEN-CONI, F.E.K.D.A. e P.T.D.`
      : 'Gli istruttori e i maestri AKM Italia: nome, qualifica, grado e centro dove insegnano. Qualifiche riconosciute CSEN-CONI, F.E.K.D.A. e P.T.D.',
    path: '/istruttori',
  })
}

const QUALIFICATIONS: Record<string, string> = {
  istruttore: 'Istruttore',
  trainer: 'Trainer',
  maestro: 'Maestro',
  'direttore-tecnico': 'Direttore tecnico',
  presidente: 'Presidente',
}

export default async function InstructorsPage() {
  const payload = await openPayload()

  const [instructors, settings] = await Promise.all([
    payload.find({
      collection: 'istruttori',
      depth: 1,
      limit: 100,
      sort: 'ordine',
      where: published,
    }),
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
  ])

  return (
    <>
      <section className="section section--black masthead">
        <div className="container masthead__content">
          <h1 className="display display--lg">Le qualifiche si contano</h1>
          {/* «Almeno quattro anni di percorso e un esame di abilitazione» era un
              numero presentato come fatto, senza riscontro in `data/`, in `docs/`
              ne' in PRODUCT.md. Qui sotto ogni riga dell'albo porta la qualifica
              e il grado di una persona con nome e cognome: quella e' la prova che
              il sito ha davvero. */}
          <p className="text masthead__text">
            I docenti sono istruttori qualificati, tesserati e assicurati CSEN: qui sotto ognuno
            con nome, qualifica e grado. Le qualifiche AKM sono riconosciute da CSEN-CONI,
            F.E.K.D.A. e P.T.D.
          </p>
        </div>
      </section>

      {/* `priority`: su queste pagine la banda e' l'LCP, la testata sopra e'
          tipografica e non ha niente da caricare. */}
      <Figure
        slot={settings?.fotoPagine?.istruttori}
        label="Foto della pagina Istruttori"
        format="band"
        measure="grande"
        sizes="100vw"
        priority
      />

      <section className="section section--light" aria-labelledby="directory-title">
        <div className="container">
          <h2 className="display display--sm list-title" id="directory-title">
            {instructors.docs.length > 0
              ? `${instructors.docs.length} istruttori e maestri`
              : 'L’albo'}
          </h2>

          {instructors.docs.length > 0 ? (
            <ul className="directory">
              {instructors.docs.map((instructor) => {
                const centers = (instructor.sedi?.docs ?? []).filter(
                  (s): s is Exclude<typeof s, number> => typeof s === 'object' && s !== null,
                )

                return (
                  <li className="reveal instructor" key={instructor.id}>
                    {/* Il ritratto non sparisce quando manca: la griglia della
                        scheda lo prevede, e un segnaposto dice al cliente che
                        li' va caricata una foto. */}
                    <Figure
                      className="instructor__photo"
                      slot={instructor.foto}
                      label="Ritratto"
                      format="square"
                      measure="piccola"
                      sizes="88px"
                    />

                    <h3 className="instructor__name">{instructor.nome}</h3>
                    {instructor.ruolo ? (
                      <p className="instructor__role">{instructor.ruolo}</p>
                    ) : null}

                    <p className="detail">
                      {[
                        instructor.qualifica ? QUALIFICATIONS[instructor.qualifica] : null,
                        instructor.grado,
                        instructor.livello,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>

                    {(instructor.credenziali ?? []).length > 0 ? (
                      <ul className="instructor__items">
                        {(instructor.credenziali ?? []).map((c) => (
                          <li key={c.id ?? c.voce}>{c.voce}</li>
                        ))}
                      </ul>
                    ) : null}

                    {/* Il nome per esteso e non il solo comune: chi insegna in tre
                        centri di Milano aveva tre link scritti «Milano», uguali fra
                        loro e diversi di destinazione (DESIGN.md §7). E un centro
                        che ha chiuso la stagione lo dice qui, non solo nella sua
                        scheda: da qui si clicca. */}
                    {centers.length > 0 ? (
                      <p className="detail">
                        Insegna a{' '}
                        {centers.map((center, i) => (
                          <React.Fragment key={center.id}>
                            {i > 0 ? ', ' : ''}
                            <Link href={`/centri/${center.slug}`}>{center.nome}</Link>
                            {center.attivo === false ? ' (non attivo)' : ''}
                          </React.Fragment>
                        ))}
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text empty">L’albo è in aggiornamento.</p>
          )}
        </div>
      </section>
    </>
  )
}
