import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { apriPayload } from '@/componenti/payload'
import { AgendaEventi } from '@/componenti/AgendaEventi'
import { Mappa, type PuntoMappa } from '@/componenti/Mappa'
import {
  giorniLeggibili,
  indirizzoLeggibile,
  nomeIstruttore,
  pubblicato,
  sitoUrl,
} from '@/componenti/dati'
import { Figura } from '@/componenti/Figura'
import { metadatiPagina } from '@/componenti/seo'

/**
 * Scheda di un centro tecnico: e' la conversione. Indirizzo, orari, docenti e
 * come arrivarci stanno tutti qui, leggibili, senza un click in mezzo.
 */

export const revalidate = 60

/* I giorni di schema.org sono in inglese: la mappa serve solo al JSON-LD, il
   testo visibile resta quello di giorniLeggibili. */
const GIORNI_SCHEMA: Record<string, string> = {
  lun: 'Monday',
  mar: 'Tuesday',
  mer: 'Wednesday',
  gio: 'Thursday',
  ven: 'Friday',
  sab: 'Saturday',
  dom: 'Sunday',
}

async function trovaSede(slug: string) {
  const payload = await apriPayload()
  const sedi = await payload.find({
    collection: 'sedi',
    depth: 2,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, pubblicato] },
  })
  return sedi.docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await apriPayload()
  const sedi = await payload.find({
    collection: 'sedi',
    depth: 0,
    limit: 200,
    select: { slug: true },
    where: pubblicato,
  })
  return sedi.docs.map((sede) => ({ slug: sede.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const sede = await trovaSede(slug)
  if (!sede) return {}

  return metadatiPagina({
    titolo: sede.nome,
    descrizione:
      sede.descrizione ||
      `Krav Maga a ${sede.indirizzo?.citta}: ${indirizzoLeggibile(sede.indirizzo)}. Giorni, orari e docenti del centro tecnico AKM Italia.`,
    path: `/centri/${sede.slug}`,
  })
}

export default async function PaginaCentro({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sede = await trovaSede(slug)
  if (!sede) notFound()

  /* Gli eventi di questo centro da oggi in poi: uno stage e' datato e
     straordinario, l'orario e' ricorrente. Stanno sotto gli orari, non dentro. */
  const payload = await apriPayload()
  const adesso = new Date().toISOString()
  const eventi = await payload.find({
    collection: 'eventi',
    depth: 0,
    limit: 5,
    sort: 'dataInizio',
    where: {
      and: [
        pubblicato,
        { sede: { equals: sede.id } },
        {
          or: [
            { dataFine: { greater_than_equal: adesso } },
            { dataInizio: { greater_than_equal: adesso } },
          ],
        },
      ],
    },
  })

  const orari = sede.orari ?? []
  const istruttori = (sede.istruttori ?? []).filter((i) => typeof i === 'object')

  const discipline = new Map<number, string>()
  for (const orario of orari) {
    if (typeof orario.disciplina === 'object' && orario.disciplina) {
      discipline.set(orario.disciplina.id, orario.disciplina.nome)
    }
  }

  const punti: PuntoMappa[] =
    typeof sede.coordinate?.lat === 'number' && typeof sede.coordinate?.lng === 'number'
      ? [
          {
            id: sede.id,
            nome: sede.nome,
            citta: sede.indirizzo?.citta ?? '',
            slug: sede.slug,
            lat: sede.coordinate.lat,
            lng: sede.coordinate.lng,
          },
        ]
      : []

  /* Il centro e' un luogo fisico con indirizzo, coordinate e orari ricorrenti:
     senza JSON-LD un motore di ricerca deve indovinarlo dal testo. */
  const luogo = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: sede.nome,
    url: `${sitoUrl()}/centri/${sede.slug}`,
    sport: 'Krav Maga',
    address: {
      '@type': 'PostalAddress',
      streetAddress: sede.indirizzo?.via || undefined,
      postalCode: sede.indirizzo?.cap || undefined,
      addressLocality: sede.indirizzo?.citta || undefined,
      addressRegion: sede.indirizzo?.provincia || undefined,
      addressCountry: 'IT',
    },
    geo:
      typeof sede.coordinate?.lat === 'number' && typeof sede.coordinate?.lng === 'number'
        ? {
            '@type': 'GeoCoordinates',
            latitude: sede.coordinate.lat,
            longitude: sede.coordinate.lng,
          }
        : undefined,
    openingHoursSpecification: orari.flatMap((orario) =>
      (orario.giorni ?? [])
        .map((g) => GIORNI_SCHEMA[g as string])
        .filter(Boolean)
        .map((giorno) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: giorno,
          opens: orario.oraInizio,
          closes: orario.oraFine,
        })),
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(luogo) }}
      />
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <Link className="briciola" href="/centri">
            Torna ai centri
          </Link>
          <p className="occhiello">Centro tecnico</p>
          <h1 className="display display--md">{sede.nome}</h1>
          <p className="testo dato">{indirizzoLeggibile(sede.indirizzo)}</p>
          {sede.attivo ? <p className="stato">Attivo in questa stagione</p> : null}
        </div>
      </section>

      {/* La sala di questo centro, fra la testata e la scheda: chi sceglie dove
          allenarsi vuole vedere il posto prima degli orari. */}
      <Figura
        slot={sede.foto}
        etichetta="Foto del centro"
        formato="banda"
        misura="grande"
        sizes="100vw"
      />

      <section className="sezione sezione--chiara">
        <div className="contenitore scheda">
          <div>
            {sede.descrizione ? <p className="testo">{sede.descrizione}</p> : null}

            <div className="blocco">
              <h2>Orari</h2>
              {orari.length > 0 ? (
                <div className="orari">
                  {orari.map((orario) => {
                    const disciplina =
                      typeof orario.disciplina === 'object' ? orario.disciplina : null
                    const docenti = (orario.docenti ?? [])
                      .map(nomeIstruttore)
                      .filter(Boolean)
                      .join(', ')

                    return (
                      <div className="orari__riga" key={orario.id}>
                        <span className="orari__giorni">{giorniLeggibili(orario.giorni)}</span>
                        <span>
                          {orario.oraInizio}-{orario.oraFine}
                        </span>
                        <span>
                          {disciplina ? (
                            <Link href={`/corsi/${disciplina.slug}`}>{disciplina.nome}</Link>
                          ) : null}
                          {docenti ? ` · Docente ${docenti}` : ''}
                          {orario.note ? ` · ${orario.note}` : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="dato">Orari in aggiornamento per la stagione.</p>
              )}
            </div>

            {eventi.docs.length > 0 ? (
              <div className="blocco">
                <h2>Prossimi eventi qui</h2>
                <AgendaEventi eventi={eventi.docs} mostraLuogo={false} />
                <p>
                  <Link className="briciola" href="/eventi">
                    Tutto il calendario
                  </Link>
                </p>
              </div>
            ) : null}

            {discipline.size > 0 ? (
              <div className="blocco">
                <h2>Cosa si pratica qui</h2>
                <ul className="elenco__voci">
                  {[...discipline.values()].map((nome) => (
                    <li key={nome}>{nome}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {istruttori.length > 0 ? (
              <div className="blocco">
                <h2>Chi insegna</h2>
                <ul className="elenco__voci">
                  {istruttori.map((istruttore) => (
                    <li key={istruttore.id}>
                      {istruttore.nome}
                      {istruttore.ruolo ? ` · ${istruttore.ruolo}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div>
            {punti.length > 0 ? (
              <Mappa punti={punti} etichetta={`Dove si trova ${sede.nome}`} />
            ) : null}

            <div className="blocco">
              <h2>Come arrivarci</h2>
              <p className="dato">
                {sede.palestra ? `${sede.palestra}, ` : ''}
                {indirizzoLeggibile(sede.indirizzo)}
              </p>
              {sede.mapsUrl ? (
                <p>
                  <a
                    className="centro__maps"
                    href={sede.mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Apri su Google Maps
                  </a>
                </p>
              ) : null}
              <p>
                <Link className="bottone bottone--primario" href="/corsi">
                  Tutti i percorsi
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
