import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { giorniLeggibili, idDisciplina, indirizzoLeggibile, pubblicato } from '@/componenti/dati'

/**
 * La pagina di un percorso. Finisce dove finisce ogni percorso: nell'elenco dei
 * centri che lo tengono, con gli orari di quel corso e nient'altro.
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
  return {
    title: corso.nome,
    description: corso.sommario,
    alternates: { canonical: `/corsi/${corso.slug}` },
  }
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
      and: [
        { attivo: { equals: true } },
        { 'orari.disciplina': { equals: corso.id } },
        pubblicato,
      ],
    },
  })

  const immagine = typeof corso.immagine === 'object' ? corso.immagine : null
  const immagineUrl = immagine?.sizes?.card?.url || immagine?.url || null

  const elenchi = [
    { titolo: 'Su cosa si lavora', voci: corso.focus },
    { titolo: 'Cosa ti porti a casa', voci: corso.risultati },
    { titolo: 'Adatto a', voci: corso.adattoA },
  ].filter((e) => (e.voci ?? []).length > 0)

  return (
    <>
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <Link className="briciola" href="/corsi">
            Torna ai percorsi
          </Link>
          <span className="filetto" aria-hidden="true" />
          <p className="occhiello">{corso.occhiello || 'Percorso'}</p>
          <h1 className="display display--lg">{corso.domanda || corso.nome}</h1>
          <p className="testo testata__testo">{corso.sommario}</p>
          {corso.aChiSiRivolge ? <p className="dato">{corso.aChiSiRivolge}</p> : null}
        </div>
      </section>

      <section className="sezione sezione--chiara">
        <div className="contenitore">
          {immagineUrl ? (
            <Image
              src={immagineUrl}
              alt={immagine?.alt || ''}
              width={800}
              height={800}
              sizes="(max-width: 800px) 100vw, 800px"
              style={{ height: 'auto' }}
            />
          ) : null}

          <dl className="corso__dati">
            {corso.durata ? (
              <div className="corso__dato">
                <dt>Come funziona</dt>
                <dd>{corso.durata}</dd>
              </div>
            ) : null}
            {corso.cadenza ? (
              <div className="corso__dato">
                <dt>Cadenza</dt>
                <dd>{corso.cadenza}</dd>
              </div>
            ) : null}
            {corso.ingresso ? (
              <div className="corso__dato">
                <dt>Come si entra</dt>
                <dd>{corso.ingresso}</dd>
              </div>
            ) : null}
          </dl>

          {corso.descrizione ? (
            <div className="ricco">
              <RichText data={corso.descrizione} />
            </div>
          ) : null}

          {elenchi.length > 0 ? (
            <div className="colonne colonne--tre">
              {elenchi.map((elenco) => (
                <div className="blocco" key={elenco.titolo}>
                  <h2>{elenco.titolo}</h2>
                  <ul className="elenco__voci">
                    {(elenco.voci ?? []).map((v) => (
                      <li key={v.id ?? v.voce}>{v.voce}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}

          {corso.prova ? (
            <p className="testo dato blocco">{corso.prova}</p>
          ) : null}
        </div>
      </section>

      <section className="sezione sezione--carbone" aria-labelledby="titolo-dove">
        <div className="contenitore">
          <div className="centri__intestazione">
            <span className="filetto" aria-hidden="true" />
            <h2 className="display display--md" id="titolo-dove">
              Dove si pratica
            </h2>
            <p className="testo">
              {sedi.docs.length > 0
                ? `${sedi.docs.length} ${sedi.docs.length === 1 ? 'centro tiene' : 'centri tengono'} questo percorso. Gli orari qui sotto sono solo quelli di ${corso.nome}.`
                : 'Questo percorso non è ancora in calendario in nessun centro. Scrivici e ti diciamo quando parte.'}
            </p>
          </div>

          {sedi.docs.length > 0 ? (
            <ul className="centri__elenco">
              {sedi.docs.map((sede) => {
                const suoi = (sede.orari ?? []).filter(
                  (o) => idDisciplina(o.disciplina) === corso.id,
                )

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

          {/* Il bottone porta ai centri, quindi si chiama come ogni altro bottone
              che porta ai centri. Il campo `azione` a CMS ("Chiedi informazioni")
              prometteva un form che non esiste ancora: torna quando esiste. */}
          <p className="coda-azione">
            <Link className="bottone bottone--primario" href="/centri">
              Trova un centro
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
