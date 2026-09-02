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
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <h1 className="display display--lg">Eventi</h1>
          <p className="testo testata__testo">
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

      <section className="sezione sezione--chiara" aria-labelledby="titolo-mese">
        <div className="contenitore">
          <nav className="calendario__mesi" aria-label="Cambia mese">
            <Link className="calendario__salto" href={`/eventi?mese=${chiaveMese(mesePrecedente(mese))}`}>
              Mese precedente
            </Link>
            <h2 className="display display--sm" id="titolo-mese">
              {nomeMese(mese)}
            </h2>
            <Link
              className="calendario__salto calendario__salto--dopo"
              href={`/eventi?mese=${chiaveMese(meseSuccessivo(mese))}`}
            >
              Mese successivo
            </Link>
          </nav>

          <table className="calendario">
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
                      'calendario__giorno',
                      giorno.slice(0, 7) !== questoMese ? 'calendario__giorno--fuori' : '',
                      giorno === oggi ? 'calendario__giorno--oggi' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                    return (
                      <td className={classi} key={giorno}>
                        <span className="calendario__numero">{Number(giorno.slice(8))}</span>
                        {del.length > 0 ? (
                          <div className="calendario__eventi">
                            {del.map((evento) => (
                              <Link
                                className="calendario__evento"
                                href={`/eventi/${evento.slug}`}
                                key={evento.id}
                              >
                                {/* In cella il posto viene prima del titolo: a settembre
                                    dieci celle dicono «Presentazione», e a distinguerle
                                    e' il centro. */}
                                <b className="calendario__dove">{doveEvento(evento)}</b>
                                {evento.titolo}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {eventi.docs.length > 0 ? (
            <AgendaEventi eventi={eventi.docs} />
          ) : (
            <p className="testo vuoto">
              Nessun evento a {nomeMese(mese)}.{' '}
              {meseProssimo ? (
                <Link href={`/eventi?mese=${chiaveMese(meseProssimo)}`}>
                  Il prossimo è a {nomeMese(meseProssimo)}.
                </Link>
              ) : chiaveMese(meseCorrente()) !== questoMese ? (
                <Link href="/eventi">Torna al mese corrente.</Link>
              ) : null}
            </p>
          )}
        </div>
      </section>
    </>
  )
}
