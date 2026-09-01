/**
 * Pagina di un corso — struttura C del prototipo di #18.
 *
 * La pagina risponde alle due domande che PRODUCT.md attribuisce al visitatore
 * («funziona davvero?», «sono fuori posto?»), quindi i campi strutturati di
 * `corsi` diventano risposte a domande scritte, non una griglia di card
 * (anti-reference n.3). Il dato pratico — a chi, durata, dove si pratica, il
 * pulsante — sta nella spalla, che su desktop resta a vista mentre le risposte
 * scorrono, e su telefono e' semplicemente il blocco finale.
 *
 * La pagina non da' per scontato che i campi siano pieni (#16): l'antibullismo
 * non ha ne' focus, ne' risultati, ne' profili, e nessun corso ha `ingresso` o
 * `cadenza`. Un gruppo senza dato non si mostra vuoto, e un corso senza nessuna
 * risposta dice una riga onesta invece di fingere una pagina.
 */
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { GIORNO_LUNGO, comune, ore, palestra } from '../../centri/sede'
import { type Dove, dove, voci } from '../corso'
import stile from './pagina.module.css'

/** Quanti centri stanno nella spalla prima che diventi un secondo elenco sedi. */
const IN_SPALLA = 6

async function cerca(slug: string) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'corsi',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const corso = (docs[0] as Corso | undefined) ?? null
  if (!corso) return null

  // Il legame corso-sede vive sugli orari, non su `corsi`: si interroga di li'.
  const { docs: sedi } = await payload.find({
    collection: 'sedi',
    where: { 'orari.disciplina': { equals: corso.id } },
    limit: 200,
    depth: 2,
    sort: 'indirizzo.citta',
  })
  return { corso, ...dove(sedi as Sede[], corso) }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const trovato = await cerca(slug)
  if (!trovato) return {}
  return { title: `${trovato.corso.nome} — AKM Italia`, description: trovato.corso.sommario }
}

/** Le risposte che il corso puo' dare, nell'ordine in cui la paura si presenta. */
function domande(c: Corso): [string, React.ReactNode][] {
  const elenco = (a: string[], k: string) => (
    <ul className={stile.righe} key={k}>
      {a.map((v) => (
        <li key={v}>{v}</li>
      ))}
    </ul>
  )
  const out: [string, React.ReactNode][] = []
  if (voci(c.adattoA).length) out.push(['Sono fuori posto?', elenco(voci(c.adattoA), 'a')])
  if (voci(c.focus).length) out.push(['Cosa si impara?', elenco(voci(c.focus), 'f')])
  if (voci(c.risultati).length) out.push(['Cosa cambia dopo?', elenco(voci(c.risultati), 'r')])
  if (c.prova)
    out.push([
      'Funziona davvero? Chi insegna?',
      <p className={stile.prova} key="p">
        {c.prova}
      </p>,
    ])
  return out
}

function Centri({ attive, sospese }: { attive: Dove[]; sospese: Dove[] }) {
  if (!attive.length)
    /* Un corso puo' non essere in programma da nessuna parte: e' il caso vero
       dell'antiaggressione femminile, tenuta solo a Muggio', che e' sospesa.
       La riga e' provvisoria: la regola definitiva si decide in #24. */
    return (
      <p className={stile.senza}>
        Questo corso non e&apos; in programma in nessun centro tecnico in questa stagione. Scrivici:
        ti diciamo se e dove riparte.
        {sospese.length ? ` Ultimi centri che lo tenevano: ${sospese.map((d) => comune(d.sede)).join(', ')}.` : ''}
      </p>
    )

  return (
    <>
      <ul className={stile.centri}>
        {attive.slice(0, IN_SPALLA).map(({ sede, turni }) => (
          <li key={sede.id}>
            <Link className={stile.nomeCentro} href={`/centri/${sede.slug}`}>
              {comune(sede)}, {palestra(sede)}
            </Link>
            <div className={stile.orari}>
              {turni.map((o, i) => (
                <span className={stile.turno} key={o.id ?? i}>
                  {(o.giorni ?? []).map((g) => GIORNO_LUNGO[g]).join(' e ')} {ore(o)}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {attive.length > IN_SPALLA ? (
        <Link className={stile.tutti} href="/centri">
          Tutti i {attive.length} centri &rarr;
        </Link>
      ) : null}
      {sospese.length ? (
        <p className={stile.sospese}>
          Sospesi per la stagione: {sospese.map((d) => comune(d.sede)).join(', ')}.
        </p>
      ) : null}
    </>
  )
}

export default async function Pagina(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const trovato = await cerca(slug)
  if (!trovato) notFound()
  const { corso: c, attive, sospese } = trovato

  const risposte = domande(c)
  const pratica = ([
    ['A chi', c.aChiSiRivolge],
    ['Durata', c.durata],
    ['Ingresso', c.ingresso],
    ['Come si inizia', c.cadenza],
  ] as const).filter(([, v]) => Boolean(v))

  return (
    <article className={stile.pagina}>
      <header>
        {c.occhiello ? <p className={stile.occhiello}>{c.occhiello}</p> : null}
        <h1 className={stile.titolo}>{c.nome}</h1>
        <p className={stile.sommario}>{c.sommario}</p>
      </header>

      <div className={stile.due}>
        <div>
          {risposte.length ? (
            risposte.map(([q, a]) => (
              <section key={q}>
                <h2 className={stile.domanda}>{q}</h2>
                {a}
              </section>
            ))
          ) : (
            /* Antibullismo: la fonte del sito vecchio e' una riga sola (#16).
               Meglio dirlo che riempire la pagina di parole nostre. */
            <p className={stile.senza}>
              Di questo corso il sito non racconta ancora altro. Scrivici e ti spieghiamo
              com&apos;e&apos; fatta una lezione.
            </p>
          )}
        </div>

        <aside className={stile.spalla}>
          {pratica.length ? (
            <>
              <h2 className={stile.gruppo}>In pratica</h2>
              <dl>
                {pratica.map(([k, v]) => (
                  <div className={stile.fatto} key={k}>
                    <dt className={stile.chiave}>{k}</dt>
                    <dd className={stile.valore}>{v}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}

          <h2 className={stile.gruppo}>Dove si pratica</h2>
          <Centri attive={attive} sospese={sospese} />

          {/* La rotta del modulo arriva con #19: fino ad allora il pulsante
              punta a una pagina che non c'e' ancora. */}
          <Link className={stile.azione} href={`/contatta?corso=${c.slug}`}>
            {c.azione || 'Chiedi informazioni'}
          </Link>
          <p className={stile.nota}>
            Nessun impegno: e&apos; una richiesta di informazioni, non un&apos;iscrizione.
          </p>
        </aside>
      </div>
    </article>
  )
}
