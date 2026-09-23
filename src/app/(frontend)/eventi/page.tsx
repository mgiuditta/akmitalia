import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { apriPayload } from '@/componenti/payload'
import { AgendaEventi } from '@/componenti/AgendaEventi'
import {
  chiaveGiorno,
  chiaveMese,
  giorniDiUnEvento,
  griglia,
  intervalloMese,
  meseCorrente,
  meseDaParam,
  mesePrecedente,
  meseSuccessivo,
  nomeMese,
  orarioLeggibile,
} from '@/componenti/calendario'
import { doveEvento, pubblicato } from '@/componenti/dati'
import { Figura } from '@/componenti/Figura'
import { metadatiPagina } from '@/componenti/seo'

/**
 * Il calendario: una griglia del mese resa dal server, con `?mese=2026-09`
 * nella URL e niente JavaScript (docs/adr/0014). Sotto la griglia l'agenda del
 * mese, che su telefono e' la vista vera. Niente viste giorno o lista, niente
 * ricerca, niente export: la scheda evento e l'agenda coprono i casi reali.
 */

export const revalidate = 60

const GIORNI = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

export const metadata: Metadata = metadatiPagina({
  titolo: 'Eventi',
  descrizione:
    'Stage, esami, presentazioni e feste di AKM Italia, mese per mese: data, orario e centro di ogni evento della stagione.',
  path: '/eventi',
})

export default async function PaginaEventi({
  searchParams,
}: {
  searchParams: Promise<{ mese?: string }>
}) {
  const { mese: param } = await searchParams
  const mese = meseDaParam(param)
  const { inizio, fine } = intervalloMese(mese)
  const payload = await apriPayload()

  const [eventi, impostazioni] = await Promise.all([
    payload.find({
      collection: 'eventi',
      depth: 1,
      limit: 200,
      sort: 'dataInizio',
      where: {
        and: [
          pubblicato,
          { dataInizio: { less_than: fine.toISOString() } },
          {
            or: [
              { dataFine: { greater_than_equal: inizio.toISOString() } },
              { dataInizio: { greater_than_equal: inizio.toISOString() } },
            ],
          },
        ],
      },
    }),
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
  ])

  /* Un mese vuoto non lascia il visitatore a sfogliare a vuoto: gli dice
     qual e' il prossimo mese con qualcosa dentro. */
  const prossimo =
    eventi.docs.length === 0
      ? await payload.find({
          collection: 'eventi',
          depth: 0,
          limit: 1,
          sort: 'dataInizio',
          select: { dataInizio: true },
          where: { and: [pubblicato, { dataInizio: { greater_than_equal: fine.toISOString() } }] },
        })
      : null
  const meseProssimo = prossimo?.docs[0]
    ? meseDaParam(chiaveGiorno(prossimo.docs[0].dataInizio).slice(0, 7))
    : null

  const perGiorno = new Map<string, typeof eventi.docs>()
  for (const evento of eventi.docs) {
    for (const giorno of giorniDiUnEvento(evento.dataInizio, evento.dataFine)) {
      perGiorno.set(giorno, [...(perGiorno.get(giorno) ?? []), evento])
    }
  }

  const oggi = chiaveGiorno(new Date())
  const questoMese = chiaveMese(mese)
  const settimane = griglia(mese)

  return (
    <>
      <section className="section section--black masthead">
        <div className="container masthead__content">
          <h1 className="display display--lg">Eventi</h1>
          <p className="text masthead__text">
            Stage, esami, presentazioni e feste della stagione, mese per mese. Ogni evento ha
            data, orario e centro: gli orari settimanali stanno nella scheda di ogni centro.
          </p>
        </div>
      </section>

      <Figura
        slot={impostazioni?.fotoPagine?.eventi}
        etichetta="Foto della pagina Eventi"
        formato="banda"
        misura="grande"
        sizes="100vw"
        priorita
      />

      <section className="section section--light" aria-labelledby="month-title">
        <div className="container">
          <nav className="calendar__months" aria-label="Cambia mese">
            <Link className="calendar__jump" href={`/eventi?mese=${chiaveMese(mesePrecedente(mese))}`}>
              Mese precedente
            </Link>
            <h2 className="display display--sm" id="month-title">
              {nomeMese(mese)}
            </h2>
            <Link
              className="calendar__jump calendar__jump--next"
              href={`/eventi?mese=${chiaveMese(meseSuccessivo(mese))}`}
            >
              Mese successivo
            </Link>
          </nav>

          {/* Il mese vuoto lo dice prima della griglia, non dopo cinque righe di
              celle vuote: sotto la piega il messaggio e il rimando al prossimo
              mese non li vedeva nessuno. */}
          {eventi.docs.length === 0 ? (
            <p className="text empty empty--month">
              Nessun evento a {nomeMese(mese)}.{' '}
              {meseProssimo ? (
                <Link href={`/eventi?mese=${chiaveMese(meseProssimo)}`}>
                  Il prossimo è a {nomeMese(meseProssimo)}.
                </Link>
              ) : chiaveMese(meseCorrente()) !== questoMese ? (
                <Link href="/eventi">Torna al mese corrente.</Link>
              ) : null}
            </p>
          ) : null}

          <table className="calendar">
            <caption>Calendario di {nomeMese(mese)}</caption>
            <thead>
              <tr>
                {GIORNI.map((g) => (
                  <th key={g} scope="col">
                    {g}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settimane.map((settimana) => (
                <tr key={settimana[0]}>
                  {settimana.map((giorno) => {
                    const del = perGiorno.get(giorno) ?? []
                    const classi = [
                      'calendar__day',
                      giorno.slice(0, 7) !== questoMese ? 'calendar__day--outside' : '',
                      giorno === oggi ? 'calendar__day--today' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                    return (
                      <td className={classi} key={giorno}>
                        <span className="calendar__number">{Number(giorno.slice(8))}</span>
                        {del.length > 0 ? (
                          <>
                            <div className="calendar__events">
                              {del.map((evento) => {
                                const ora = orarioLeggibile(evento.dataInizio, evento.dataFine)
                                return (
                                  <Link
                                    className="calendar__event"
                                    href={`/eventi/${evento.slug}`}
                                    key={evento.id}
                                  >
                                    {/* In cella il posto viene prima del titolo: a settembre
                                        dieci celle dicono «Presentazione», e a distinguerle
                                        e' il centro. L'ora distingue le due dello stesso
                                        centro nello stesso giorno, che si leggevano uguali. */}
                                    <b className="calendar__place">{doveEvento(evento)}</b>
                                    {ora ? (
                                      <span className="calendar__time">{ora} </span>
                                    ) : null}
                                    {evento.titolo}
                                  </Link>
                                )
                              })}
                            </div>
                            {/* Sotto i 768px al posto dei titoli resta il quadrato di
                                docs/adr/0014: un segno, non un link da 6px moltiplicato
                                per gli eventi del giorno. Quello che c'e' lo dice
                                l'agenda qui sotto, che su telefono e' la vista vera. */}
                            <span className="calendar__mark" aria-hidden="true" />
                          </>
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {eventi.docs.length > 0 ? <AgendaEventi eventi={eventi.docs} /> : null}
        </div>
      </section>
    </>
  )
}
