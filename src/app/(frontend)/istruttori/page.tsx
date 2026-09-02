import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { pubblicato } from '@/componenti/dati'

/**
 * L'albo. Le credenziali sono prove, non decorazioni: nome, ruolo, grado e
 * qualifiche stanno in chiaro accanto ai centri dove la persona insegna.
 *
 * ponytail: solo l'indice, nessuna pagina di dettaglio. La bio esiste a CMS e
 * diventa una rotta quando qualcuno la chiede.
 */

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: await config })
  const quanti = (await payload.count({ collection: 'istruttori', where: pubblicato })).totalDocs

  return {
    title: 'Istruttori',
    description: quanti
      ? `${quanti} istruttori e maestri AKM Italia: nome, qualifica, grado e centro dove insegnano. Qualifiche riconosciute CSEN-CONI, F.E.K.D.A. e P.T.D.`
      : 'Gli istruttori e i maestri AKM Italia: nome, qualifica, grado e centro dove insegnano. Qualifiche riconosciute CSEN-CONI, F.E.K.D.A. e P.T.D.',
    alternates: { canonical: '/istruttori' },
  }
}

const QUALIFICHE: Record<string, string> = {
  istruttore: 'Istruttore',
  trainer: 'Trainer',
  maestro: 'Maestro',
  'direttore-tecnico': 'Direttore tecnico',
  presidente: 'Presidente',
}

export default async function PaginaIstruttori() {
  const payload = await getPayload({ config: await config })

  const istruttori = await payload.find({
    collection: 'istruttori',
    depth: 1,
    limit: 100,
    sort: 'ordine',
    where: pubblicato,
  })

  return (
    <>
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <span className="filetto" aria-hidden="true" />
          <h1 className="display display--lg">Le qualifiche si contano</h1>
          <p className="testo testata__testo">
            I docenti sono diplomati dopo almeno quattro anni di percorso e un esame di abilitazione
            all’insegnamento, tesserati e assicurati CSEN. Le qualifiche AKM sono riconosciute da
            CSEN-CONI, F.E.K.D.A. e P.T.D.
          </p>
        </div>
      </section>

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
                const foto = typeof istruttore.foto === 'object' ? istruttore.foto : null
                const fotoUrl = foto?.sizes?.card?.url || foto?.url || null
                const sedi = (istruttore.sedi?.docs ?? []).filter(
                  (s): s is Exclude<typeof s, number> => typeof s === 'object' && s !== null,
                )

                return (
                  <li className="rivela istruttore" key={istruttore.id}>
                    {fotoUrl ? (
                      <Image
                        className="istruttore__foto"
                        src={fotoUrl}
                        alt={foto?.alt || ''}
                        width={176}
                        height={176}
                        sizes="88px"
                      />
                    ) : null}

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

                    {sedi.length > 0 ? (
                      <p className="dato">
                        Insegna a{' '}
                        {sedi.map((sede, i) => (
                          <React.Fragment key={sede.id}>
                            {i > 0 ? ', ' : ''}
                            <Link href={`/centri/${sede.slug}`}>{sede.indirizzo?.citta}</Link>
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
