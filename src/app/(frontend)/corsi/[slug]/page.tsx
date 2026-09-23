import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { openPayload } from '@/components/payload'
import { readableDays, disciplineId, readableAddress, published } from '@/components/data'
import { pageMetadata } from '@/components/seo'

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

async function findCourse(slug: string) {
  const payload = await openPayload()
  const courses = await payload.find({
    collection: 'corsi',
    depth: 1,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, published] },
  })
  return courses.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await openPayload()
  const courses = await payload.find({
    collection: 'corsi',
    depth: 0,
    limit: 50,
    select: { slug: true },
    where: published,
  })
  return courses.docs.map((course) => ({ slug: course.slug }))
}

/* Quando la scheda non c'e' la rotta chiama notFound() e rende not-found.tsx:
   il titolo del documento lo decide comunque questa funzione, e «AKM Italia»
   su una pagina che dice «questa pagina non c'e'» e' una riga che si contraddice. */
const TITLE_404 = { title: 'Pagina non trovata' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await findCourse(slug)
  if (!course) return TITLE_404
  return pageMetadata({
    titolo: course.nome,
    descrizione: course.sommario,
    path: `/corsi/${course.slug}`,
  })
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await findCourse(slug)
  if (!course) notFound()

  const payload = await openPayload()
  const found = await payload.find({
    collection: 'sedi',
    depth: 2,
    limit: 200,
    sort: 'indirizzo.citta',
    where: {
      and: [{ attivo: { equals: true } }, { 'orari.disciplina': { equals: course.id } }, published],
    },
  })

  const centers = found.docs
  const mark = typeof course.immagine === 'object' ? course.immagine : null
  const markUrl = mark?.sizes?.thumbnail?.url || mark?.url || null

  const howItWorks = [
    { item: 'Come funziona', detail: course.durata },
    { item: 'Cadenza', detail: course.cadenza },
    { item: 'Come si entra', detail: course.ingresso },
  ].filter((r): r is { item: string; detail: string } => Boolean(r.detail))

  const focus = course.focus ?? []
  const results = course.risultati ?? []
  const suitableFor = course.adattoA ?? []

  /* Un blocco per campo compilato. L'ordine e' fisso, la superficie no: si
     alterna su quelli che esistono davvero. */
  const blocks: { key: string; node: React.ReactNode }[] = []

  if (howItWorks.length > 0) {
    blocks.push({
      key: 'come',
      node: (
        <div className="container">
          <h2 className="display display--sm list-title">Come si pratica</h2>
          <dl className="course__details">
            {howItWorks.map((row) => (
              <div className="course__detail" key={row.item}>
                <dt>{row.item}</dt>
                <dd>{row.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      ),
    })
  }

  if (course.descrizione || focus.length > 0) {
    blocks.push({
      key: 'descrizione',
      node: (
        <div className="container course__prose">
          {/* Il blocco apriva con una schermata intera di Roboto 300 su carbone e
              il primo appiglio era un h2 da 22px a meta' altezza: nessun punto
              focale, e una sezione che apre sottovoce e' fuori registro a
              ENERGY 3. Il titolo che mancava e' quello che il blocco fa. */}
          <h2 className="display display--sm list-title">In che cosa consiste</h2>
          {course.descrizione ? (
            <div className="rich">
              <RichText data={course.descrizione} />
            </div>
          ) : null}

          {focus.length > 0 ? (
            <div className="reveal">
              <h2 className="course__subtitle">Su cosa si lavora</h2>
              {/* Etichette brevi in fila, non una terza colonna di un tris: e'
                  quello che il campo dichiara di essere. */}
              <ul className="labels">
                {focus.map((v) => (
                  <li className="label" key={v.id ?? v.voce}>
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

  if (results.length > 0) {
    blocks.push({
      key: 'risultati',
      node: (
        <div className="container">
          <h2 className="display display--sm list-title">Cosa ti porti a casa</h2>
          <ol className="numbered">
            {results.map((v, i) => (
              <li className="reveal numbered-item" key={v.id ?? v.voce}>
                <span className="numbered-item__index" aria-hidden="true">
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

  if (suitableFor.length > 0) {
    blocks.push({
      key: 'adatto',
      node: (
        <div className="container">
          <h2 className="display display--sm list-title">Questo percorso è per te se</h2>
          <ul className="list__items list__items--wide">
            {suitableFor.map((v) => (
              <li key={v.id ?? v.voce}>{v.voce}</li>
            ))}
          </ul>
        </div>
      ),
    })
  }

  return (
    <>
      <section className="section section--black masthead masthead--path">
        {/* Il segno e' inchiostro su trasparente: sul nero va invertito, come la
            fotografia dell'eroe entra nel sistema come valore e non come colore. */}
        {markUrl ? (
          <Image
            className="masthead__mark"
            src={markUrl}
            alt=""
            width={400}
            height={400}
            sizes="400px"
            priority
          />
        ) : null}

        <div className="container masthead__content">
          <Link className="breadcrumb" href="/corsi">
            Torna ai percorsi
          </Link>
          <p className="eyebrow">{course.occhiello || 'Percorso'}</p>
          <h1 className="display display--lg">{course.domanda || course.nome}</h1>
          <p className="text masthead__text">{course.sommario}</p>

          <dl className="masthead__facts">
            <div>
              <dt>Il corso</dt>
              <dd>{course.nome}</dd>
            </div>
            {course.aChiSiRivolge ? (
              <div>
                <dt>A chi si rivolge</dt>
                <dd>{course.aChiSiRivolge}</dd>
              </div>
            ) : null}
            {centers.length > 0 ? (
              <div>
                <dt>Dove si pratica</dt>
                <dd>
                  {centers.length} {centers.length === 1 ? 'centro' : 'centri'}
                </dd>
              </div>
            ) : null}
          </dl>

          <p className="masthead__action">
            <Link
              className="button button--primary"
              href={`/contatti?corso=${encodeURIComponent(course.slug)}`}
            >
              {course.azione || 'Chiedi una prova'}
            </Link>
          </p>
        </div>
      </section>

      {blocks.map((block, i) => (
        <section
          className={`section section--${i % 2 === 0 ? 'light' : 'charcoal'}`}
          key={block.key}
        >
          {block.node}
        </section>
      ))}

      {/* La prova sta da sola sul nero e a corpo grande: e' la riga che dimostra
          il percorso, non una nota in coda a una colonna. */}
      {course.prova ? (
        <section className="section section--black">
          <div className="container">
            <p className="course__trial">{course.prova}</p>
          </div>
        </section>
      ) : null}

      <section className="section section--light" aria-labelledby="place-title">
        <div className="container">
          <div className="centers__heading">
            <span className="rule" aria-hidden="true" />
            <h2 className="display display--md" id="place-title">
              Dove si pratica
            </h2>
            <p className="text">
              {centers.length > 0
                ? `${centers.length} ${centers.length === 1 ? 'centro tiene' : 'centri tengono'} questo percorso. Gli orari qui sotto sono solo quelli di ${course.nome}.`
                : 'Questo percorso non è ancora in calendario in nessun centro. Scrivici e ti diciamo quando parte.'}
            </p>
          </div>

          {centers.length > 0 ? (
            <ul className="centers__list">
              {centers.map((center) => {
                const own = (center.orari ?? []).filter((o) => disciplineId(o.disciplina) === course.id)

                return (
                  <li className="reveal center" key={center.id}>
                    <h3 className="center__name">
                      <Link className="center__link" href={`/centri/${center.slug}`}>
                        {center.nome}
                      </Link>
                    </h3>
                    <p className="center__address">{readableAddress(center.indirizzo)}</p>
                    <div className="center__schedule">
                      {own.map((slot) => (
                        <div className="center__slot" key={slot.id}>
                          <span className="center__days">{readableDays(slot.giorni)}</span>
                          <span>
                            {slot.oraInizio}-{slot.oraFine}
                            {slot.note ? ` · ${slot.note}` : ''}
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
          <p className="tail-action">
            <Link
              className="button button--primary"
              href={`/contatti?corso=${encodeURIComponent(course.slug)}`}
            >
              {course.azione || 'Chiedi una prova'}
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
