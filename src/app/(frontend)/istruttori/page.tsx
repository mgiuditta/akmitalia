import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { apriPayload } from '@/componenti/payload'
import { pubblicato } from '@/componenti/dati'
import { Figura } from '@/componenti/Figura'
import { metadatiPagina } from '@/componenti/seo'

/**
 * L'albo. Le credenziali sono prove, non decorazioni: nome, ruolo, grado e
 * qualifiche stanno in chiaro accanto ai centri dove la persona insegna.
 *
 * ponytail: solo l'indice, nessuna pagina di dettaglio. La bio esiste a CMS e
 * diventa una rotta quando qualcuno la chiede.
 */

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const payload = await apriPayload()
  const quanti = (await payload.count({ collection: 'istruttori', where: pubblicato })).totalDocs

  return metadatiPagina({
    titolo: 'Istruttori',
    descrizione: quanti
      ? `${quanti} istruttori e maestri AKM Italia: nome, qualifica, grado e centro dove insegnano. Qualifiche riconosciute CSEN-CONI, F.E.K.D.A. e P.T.D.`
      : 'Gli istruttori e i maestri AKM Italia: nome, qualifica, grado e centro dove insegnano. Qualifiche riconosciute CSEN-CONI, F.E.K.D.A. e P.T.D.',
    path: '/istruttori',
  })
}

const QUALIFICHE: Record<string, string> = {
  istruttore: 'Istruttore',
  trainer: 'Trainer',
  maestro: 'Maestro',
  'direttore-tecnico': 'Direttore tecnico',
  presidente: 'Presidente',
}

export default async function PaginaIstruttori() {
  const payload = await apriPayload()

  const [istruttori, impostazioni] = await Promise.all([
    payload.find({
      collection: 'istruttori',
      depth: 1,
      limit: 100,
      sort: 'ordine',
      where: pubblicato,
    }),
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
  ])

  return (
    <>
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <h1 className="display display--lg">Le qualifiche si contano</h1>
          {/* «Almeno quattro anni di percorso e un esame di abilitazione» era un
              numero presentato come fatto, senza riscontro in `data/`, in `docs/`
              ne' in PRODUCT.md. Qui sotto ogni riga dell'albo porta la qualifica
              e il grado di una persona con nome e cognome: quella e' la prova che
              il sito ha davvero. */}
          <p className="testo testata__testo">
            I docenti sono istruttori qualificati, tesserati e assicurati CSEN: qui sotto ognuno
            con nome, qualifica e grado. Le qualifiche AKM sono riconosciute da CSEN-CONI,
            F.E.K.D.A. e P.T.D.
          </p>
        </div>
      </section>

      {/* `priorita`: su queste pagine la banda e' l'LCP, la testata sopra e'
          tipografica e non ha niente da caricare. */}
      <Figura
        slot={impostazioni?.fotoPagine?.istruttori}
        etichetta="Foto della pagina Istruttori"
        formato="banda"
        misura="grande"
        sizes="100vw"
        priorita
      />

      <section className="sezione sezione--chiara" aria-labelledby="titolo-albo">
        <div className="contenitore">
          <h2 className="display display--sm titolo-elenco" id="titolo-albo">
            {istruttori.docs.length > 0
              ? `${istruttori.docs.length} istruttori e maestri`
              : 'L’albo'}
          </h2>

          {istruttori.docs.length > 0 ? (
            <ul className="albo">
              {istruttori.docs.map((istruttore) => {
                const sedi = (istruttore.sedi?.docs ?? []).filter(
                  (s): s is Exclude<typeof s, number> => typeof s === 'object' && s !== null,
                )

                return (
                  <li className="rivela istruttore" key={istruttore.id}>
                    {/* Il ritratto non sparisce quando manca: la griglia della
                        scheda lo prevede, e un segnaposto dice al cliente che
                        li' va caricata una foto. */}
                    <Figura
                      classe="istruttore__foto"
                      slot={istruttore.foto}
                      etichetta="Ritratto"
                      formato="quadro"
                      misura="piccola"
                      sizes="88px"
                    />

                    <h3 className="istruttore__nome">{istruttore.nome}</h3>
                    {istruttore.ruolo ? (
                      <p className="istruttore__ruolo">{istruttore.ruolo}</p>
                    ) : null}

                    <p className="dato">
                      {[
                        istruttore.qualifica ? QUALIFICHE[istruttore.qualifica] : null,
                        istruttore.grado,
                        istruttore.livello,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>

                    {(istruttore.credenziali ?? []).length > 0 ? (
                      <ul className="istruttore__voci">
                        {(istruttore.credenziali ?? []).map((c) => (
                          <li key={c.id ?? c.voce}>{c.voce}</li>
                        ))}
                      </ul>
                    ) : null}

                    {/* Il nome per esteso e non il solo comune: chi insegna in tre
                        centri di Milano aveva tre link scritti «Milano», uguali fra
                        loro e diversi di destinazione (DESIGN.md §7). E un centro
                        che ha chiuso la stagione lo dice qui, non solo nella sua
                        scheda: da qui si clicca. */}
                    {sedi.length > 0 ? (
                      <p className="dato">
                        Insegna a{' '}
                        {sedi.map((sede, i) => (
                          <React.Fragment key={sede.id}>
                            {i > 0 ? ', ' : ''}
                            <Link href={`/centri/${sede.slug}`}>{sede.nome}</Link>
                            {sede.attivo === false ? ' (non attivo)' : ''}
                          </React.Fragment>
                        ))}
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="testo vuoto">L’albo è in aggiornamento.</p>
          )}
        </div>
      </section>
    </>
  )
}
