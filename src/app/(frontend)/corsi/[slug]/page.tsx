import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { giorniLeggibili, idDisciplina, indirizzoLeggibile, pubblicato } from '@/componenti/dati'
import { metadatiPagina } from '@/componenti/seo'

/**
 * La pagina di un percorso. Orienta, spiega, e finisce dove finisce ogni
 * percorso: nei centri che lo tengono e nel modulo, con il percorso gia'
 * scelto.
 *
 * I blocchi di mezzo esistono solo se il campo e' compilato, e le superfici si
 * alternano su quelli che restano: cosi' una scheda scarna non produce quattro
 * sezioni chiare di fila, e una piena non ripete due volte lo stesso ritmo.
 * E' la Regola del Valore applicata alla sequenza, non al singolo blocco.
 */

export const revalidate = 60

async function trovaCorso(slug: string) {
  const payload = await getPayload({ config: await config })
  const corsi = await payload.find({
    collection: 'corsi',
    depth: 1,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, pubblicato] },
  })
  return corsi.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: await config })
  const corsi = await payload.find({
    collection: 'corsi',
    depth: 0,
    limit: 50,
    select: { slug: true },
    where: pubblicato,
  })
  return corsi.docs.map((corso) => ({ slug: corso.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const corso = await trovaCorso(slug)
  if (!corso) return {}
  return metadatiPagina({
    titolo: corso.nome,
    descrizione: corso.sommario,
    path: `/corsi/${corso.slug}`,
  })
}

export default async function PaginaCorso({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const corso = await trovaCorso(slug)
  if (!corso) notFound()

  const payload = await getPayload({ config: await config })
  const sedi = await payload.find({
    collection: 'sedi',
    depth: 2,
    limit: 200,
    sort: 'indirizzo.citta',
    where: {
      and: [{ attivo: { equals: true } }, { 'orari.disciplina': { equals: corso.id } }, pubblicato],
    },
  })

  const centri = sedi.docs
  const segno = typeof corso.immagine === 'object' ? corso.immagine : null
  const segnoUrl = segno?.sizes?.thumbnail?.url || segno?.url || null

  const comeFunziona = [
    { voce: 'Come funziona', dato: corso.durata },
    { voce: 'Cadenza', dato: corso.cadenza },
    { voce: 'Come si entra', dato: corso.ingresso },
  ].filter((r): r is { voce: string; dato: string } => Boolean(r.dato))

  const focus = corso.focus ?? []
  const risultati = corso.risultati ?? []
  const adattoA = corso.adattoA ?? []

  /* Un blocco per campo compilato. L'ordine e' fisso, la superficie no: si
     alterna su quelli che esistono davvero. */
  const blocchi: { chiave: string; nodo: React.ReactNode }[] = []

  if (comeFunziona.length > 0) {
    blocchi.push({
      chiave: 'come',
      nodo: (
        <div className="contenitore">
          <h2 className="display display--sm titolo-elenco">Come si pratica</h2>
          <dl className="corso__dati">
            {comeFunziona.map((riga) => (
              <div className="corso__dato" key={riga.voce}>
                <dt>{riga.voce}</dt>
                <dd>{riga.dato}</dd>
              </div>
            ))}
          </dl>
        </div>
      ),
    })
  }

  if (corso.descrizione || focus.length > 0) {
    blocchi.push({
      chiave: 'descrizione',
      nodo: (
        <div className="contenitore corso__discorso">
          {corso.descrizione ? (
            <div className="ricco">
              <RichText data={corso.descrizione} />
            </div>
          ) : null}

          {focus.length > 0 ? (
            <div className="rivela">
              <h2 className="corso__sottotitolo">Su cosa si lavora</h2>
              {/* Etichette brevi in fila, non una terza colonna di un tris: e'
                  quello che il campo dichiara di essere. */}
              <ul className="etichette">
                {focus.map((v) => (
                  <li className="etichetta" key={v.id ?? v.voce}>
                    {v.voce}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ),
    })
  }

  if (risultati.length > 0) {
    blocchi.push({
      chiave: 'risultati',
      nodo: (
        <div className="contenitore">
          <h2 className="display display--sm titolo-elenco">Cosa ti porti a casa</h2>
          <ol className="numerati">
            {risultati.map((v, i) => (
              <li className="rivela numerato" key={v.id ?? v.voce}>
                <span className="numerato__indice" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{v.voce}</span>
              </li>
            ))}
          </ol>
        </div>
      ),
    })
  }

  if (adattoA.length > 0) {
    blocchi.push({
      chiave: 'adatto',
      nodo: (
        <div className="contenitore">
          <h2 className="display display--sm titolo-elenco">Questo percorso è per te se</h2>
          <ul className="elenco__voci elenco__voci--largo">
            {adattoA.map((v) => (
              <li key={v.id ?? v.voce}>{v.voce}</li>
            ))}
          </ul>
        </div>
      ),
    })
  }

  return (
    <>
      <section className="sezione sezione--nera testata testata--percorso">
        {/* Il segno e' inchiostro su trasparente: sul nero va invertito, come la
            fotografia dell'eroe entra nel sistema come valore e non come colore. */}
        {segnoUrl ? (
          <Image
            className="testata__segno"
            src={segnoUrl}
            alt=""
            width={400}
            height={400}
            sizes="400px"
            priority
          />
        ) : null}

        <div className="contenitore testata__contenuto">
          <Link className="briciola" href="/corsi">
            Torna ai percorsi
          </Link>
          <p className="occhiello">{corso.occhiello || 'Percorso'}</p>
          <h1 className="display display--lg">{corso.domanda || corso.nome}</h1>
          <p className="testo testata__testo">{corso.sommario}</p>

          <dl className="testata__fatti">
            <div>
              <dt>Il corso</dt>
              <dd>{corso.nome}</dd>
            </div>
            {corso.aChiSiRivolge ? (
              <div>
                <dt>A chi si rivolge</dt>
                <dd>{corso.aChiSiRivolge}</dd>
              </div>
            ) : null}
            {centri.length > 0 ? (
              <div>
                <dt>Dove si pratica</dt>
                <dd>
                  {centri.length} {centri.length === 1 ? 'centro' : 'centri'}
                </dd>
              </div>
            ) : null}
          </dl>

          <p className="testata__azione">
            <Link
              className="bottone bottone--primario"
              href={`/contatti?corso=${encodeURIComponent(corso.slug)}`}
            >
              {corso.azione || 'Chiedi una prova'}
            </Link>
          </p>
        </div>
      </section>

      {blocchi.map((blocco, i) => (
        <section
          className={`sezione sezione--${i % 2 === 0 ? 'chiara' : 'carbone'}`}
          key={blocco.chiave}
        >
          {blocco.nodo}
        </section>
      ))}

      {/* La prova sta da sola sul nero e a corpo grande: e' la riga che dimostra
          il percorso, non una nota in coda a una colonna. */}
      {corso.prova ? (
        <section className="sezione sezione--nera">
          <div className="contenitore">
            <p className="corso__prova">{corso.prova}</p>
          </div>
        </section>
      ) : null}

      <section className="sezione sezione--chiara" aria-labelledby="titolo-dove">
        <div className="contenitore">
          <div className="centri__intestazione">
            <span className="filetto" aria-hidden="true" />
            <h2 className="display display--md" id="titolo-dove">
              Dove si pratica
            </h2>
            <p className="testo">
              {centri.length > 0
                ? `${centri.length} ${centri.length === 1 ? 'centro tiene' : 'centri tengono'} questo percorso. Gli orari qui sotto sono solo quelli di ${corso.nome}.`
                : 'Questo percorso non è ancora in calendario in nessun centro. Scrivici e ti diciamo quando parte.'}
            </p>
          </div>

          {centri.length > 0 ? (
            <ul className="centri__elenco">
              {centri.map((sede) => {
                const suoi = (sede.orari ?? []).filter((o) => idDisciplina(o.disciplina) === corso.id)

                return (
                  <li className="rivela centro" key={sede.id}>
                    <h3 className="centro__nome">
                      <Link className="centro__collegamento" href={`/centri/${sede.slug}`}>
                        {sede.nome}
                      </Link>
                    </h3>
                    <p className="centro__indirizzo">{indirizzoLeggibile(sede.indirizzo)}</p>
                    <div className="centro__orari">
                      {suoi.map((orario) => (
                        <div className="centro__orario" key={orario.id}>
                          <span className="centro__giorni">{giorniLeggibili(orario.giorni)}</span>
                          <span>
                            {orario.oraInizio}-{orario.oraFine}
                            {orario.note ? ` · ${orario.note}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : null}

          {/* La pagina finisce dove finisce il percorso: nel modulo, con questo
              percorso gia' selezionato. */}
          <p className="coda-azione">
            <Link
              className="bottone bottone--primario"
              href={`/contatti?corso=${encodeURIComponent(corso.slug)}`}
            >
              {corso.azione || 'Chiedi una prova'}
            </Link>
            <Link className="bottone bottone--secondario" href="/centri">
              Vedi tutti i centri
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
