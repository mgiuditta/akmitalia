/**
 * PROTOTIPO USA E GETTA — issue #18, «Pagina corso: dai campi strutturati alla pagina».
 *
 * Tre strutture per `/corsi/[slug]`. Colore (#5), font (#6) e scala (#7) sono
 * fissi: la variabile in prova e' **l'ordine e il peso** fra la prosa del corso
 * e l'elenco dei centri che lo tengono, e dove sta la chiamata al form.
 *
 * Tutte e tre reggono i vuoti veri di #16: l'antibullismo non ha `focus[]`,
 * `risultati[]` ne' `adattoA[]`; nessun corso ha `ingresso` ne' `cadenza`;
 * l'antiaggressione femminile ha zero centri attivi (la regola vera si decide
 * in #24, qui e' una riga onesta segnata come provvisoria).
 */
import React from 'react'
import Link from 'next/link'
import type { Corsi as Corso, Sedi as Sede } from '@/payload-types'

import { GIORNO_LUNGO, Percorso, comune, docenti, giorni, indirizzo, ore, palestra, type Orario } from '../centri/sede'
import stile from './varianti.module.css'

export type Dove = { sede: Sede; turni: Orario[] }
export type Props = { corso: Corso; attive: Dove[]; sospese: Dove[] }

export const nomeA = 'Registro: prosa, poi i centri, azione in fondo'
export const nomeB = 'Prima la sede: i centri in cima, un pulsante per centro'
export const nomeC = 'Domande: le due paure, con spalla di dato pratico'

/* ---------- pezzi minimi condivisi (foglie, non layout) ---------- */

const voci = (a: { voce: string }[] | null | undefined) => (a ?? []).map((x) => x.voce)

const contatta = (c: Corso, s?: Sede) =>
  `/contatta?corso=${c.slug}${s ? `&sede=${s.slug}` : ''}`

/** Il turno di *questo* corso in *quel* centro: «Lunedì e Mercoledì, 20:30–22:00». */
function Turni({ turni }: { turni: Orario[] }) {
  return (
    <>
      {turni.map((o, i) => (
        <span className={stile.turno} key={o.id ?? i}>
          {giorni(o)} {ore(o)}
          {docenti(o) ? <span className={stile.docente}> · {docenti(o)}</span> : null}
        </span>
      ))}
    </>
  )
}

/** #24 non e' ancora deciso: qui una riga onesta, marcata come provvisoria. */
function SenzaCentri() {
  return (
    <p className={stile.senza}>
      Questo corso non e&apos; in programma in nessun centro tecnico attivo in questa stagione.
      Scrivici: ti diciamo se e dove riparte. <em>(regola vera da decidere in #24)</em>
    </p>
  )
}

/* ---------- A · Registro ---------- */

export function VarianteA({ corso: c, attive, sospese }: Props) {
  return (
    <article className={stile.registro}>
      <Link className={stile.indietro} href="/">← Tutti i corsi</Link>

      <p className={stile.occhiello}>{c.occhiello || 'Corso'}</p>
      <h1 className={stile.titolo}>{c.nome}</h1>
      <p className={stile.sommario}>{c.sommario}</p>
      {c.aChiSiRivolge ? <p className={stile.aChi}>{c.aChiSiRivolge}</p> : null}

      {c.durata || c.ingresso || c.cadenza ? (
        <>
          <h2 className={stile.gruppo}>Come funziona</h2>
          <dl className={stile.fatti}>
            {([['Durata', c.durata], ['Ingresso', c.ingresso], ['Come si inizia', c.cadenza]] as const)
              .filter(([, v]) => Boolean(v))
              .map(([k, v]) => (
                <div className={stile.fatto} key={k}>
                  <dt className={stile.chiave}>{k}</dt>
                  <dd className={stile.valore}>{v}</dd>
                </div>
              ))}
          </dl>
        </>
      ) : null}

      {voci(c.focus).length ? (
        <>
          <h2 className={stile.gruppo}>Su cosa si lavora</h2>
          <ul className={stile.righe}>
            {voci(c.focus).map((v) => <li key={v}>{v}</li>)}
          </ul>
        </>
      ) : null}

      {voci(c.risultati).length ? (
        <>
          <h2 className={stile.gruppo}>Cosa si ottiene</h2>
          <ul className={stile.righe}>
            {voci(c.risultati).map((v) => <li key={v}>{v}</li>)}
          </ul>
        </>
      ) : null}

      {voci(c.adattoA).length ? (
        <>
          <h2 className={stile.gruppo}>Adatto a</h2>
          <ul className={stile.righe}>
            {voci(c.adattoA).map((v) => <li key={v}>{v}</li>)}
          </ul>
        </>
      ) : null}

      {c.prova ? (
        <>
          <h2 className={stile.gruppo}>Chi lo insegna</h2>
          <p className={stile.prova}>{c.prova}</p>
        </>
      ) : null}

      <h2 className={stile.gruppo}>Dove si pratica</h2>
      {attive.length ? (
        <ul className={stile.centri}>
          {attive.map(({ sede, turni }) => (
            <li className={stile.centro} key={sede.id}>
              <Link className={stile.nomeCentro} href={`/centri/${sede.slug}`}>
                {comune(sede)}, {palestra(sede)}
              </Link>
              <span className={stile.provincia}>({sede.indirizzo?.provincia})</span>
              <div className={stile.orari}><Turni turni={turni} /></div>
            </li>
          ))}
        </ul>
      ) : (
        <SenzaCentri />
      )}
      {sospese.length ? (
        <p className={stile.sospese}>
          Sospesi per la stagione: {sospese.map(({ sede }) => comune(sede)).join(', ')}.
        </p>
      ) : null}

      <p className={stile.azioneCoda}>
        <Link className={stile.pulsante} href={contatta(c)}>{c.azione || 'Chiedi informazioni'}</Link>
        <span className={stile.notaAzione}>
          Scegli il centro nel modulo. Nessun impegno: e&apos; una richiesta di informazioni.
        </span>
      </p>
    </article>
  )
}

/* ---------- B · Prima la sede ---------- */

export function VarianteB({ corso: c, attive, sospese }: Props) {
  return (
    <article className={stile.sedeprima}>
      <header className={stile.testa}>
        <Link className={stile.indietro} href="/">← Tutti i corsi</Link>
        <h1 className={stile.titolo}>{c.nome}</h1>
        <p className={stile.sommario}>{c.sommario}</p>
        <p className={stile.riga1}>
          <Percorso corso={c} />
          {c.aChiSiRivolge ? <span className={stile.aChiInline}>{c.aChiSiRivolge}</span> : null}
          {c.durata ? <span className={stile.aChiInline}>{c.durata}</span> : null}
        </p>
      </header>

      <h2 className={stile.gruppoForte}>
        {attive.length ? `${attive.length} centri tecnici lo tengono` : 'Dove si pratica'}
      </h2>
      {attive.length ? (
        <ul className={stile.centriGrandi}>
          {attive.map(({ sede, turni }) => (
            <li className={stile.centroGrande} key={sede.id}>
              <div>
                <Link className={stile.nomeCentroGrande} href={`/centri/${sede.slug}`}>
                  {comune(sede)}, {palestra(sede)}
                </Link>
                <div className={stile.indirizzo}>{indirizzo(sede)} ({sede.indirizzo?.provincia})</div>
                <div className={stile.orari}><Turni turni={turni} /></div>
              </div>
              <Link className={stile.pulsanteRiga} href={contatta(c, sede)}>
                {c.azione || 'Chiedi informazioni'}
                <span className={stile.soloScreenReader}> a {comune(sede)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <SenzaCentri />
      )}
      {sospese.length ? (
        <p className={stile.sospese}>
          Sospesi per la stagione: {sospese.map(({ sede }) => comune(sede)).join(', ')}.
        </p>
      ) : null}

      <div className={stile.coda}>
        {voci(c.focus).length ? (
          <section>
            <h2 className={stile.gruppo}>Su cosa si lavora</h2>
            <p className={stile.prosaLista}>{voci(c.focus).join('. ')}.</p>
          </section>
        ) : null}
        {voci(c.risultati).length ? (
          <section>
            <h2 className={stile.gruppo}>Cosa si ottiene</h2>
            <ul className={stile.righe}>{voci(c.risultati).map((v) => <li key={v}>{v}</li>)}</ul>
          </section>
        ) : null}
        {voci(c.adattoA).length ? (
          <section>
            <h2 className={stile.gruppo}>Adatto a</h2>
            <ul className={stile.righe}>{voci(c.adattoA).map((v) => <li key={v}>{v}</li>)}</ul>
          </section>
        ) : null}
        {c.prova ? (
          <section>
            <h2 className={stile.gruppo}>Chi lo insegna</h2>
            <p className={stile.prova}>{c.prova}</p>
          </section>
        ) : null}
      </div>
    </article>
  )
}

/* ---------- C · Domande, con spalla ---------- */

const DOMANDE = (c: Corso): [string, React.ReactNode][] => {
  const out: [string, React.ReactNode][] = []
  if (voci(c.adattoA).length)
    out.push(['Sono fuori posto?', <ul className={stile.righe} key="a">{voci(c.adattoA).map((v) => <li key={v}>{v}</li>)}</ul>])
  if (voci(c.focus).length)
    out.push(['Cosa si impara?', <ul className={stile.righe} key="f">{voci(c.focus).map((v) => <li key={v}>{v}</li>)}</ul>])
  if (voci(c.risultati).length)
    out.push(['Cosa cambia dopo?', <ul className={stile.righe} key="r">{voci(c.risultati).map((v) => <li key={v}>{v}</li>)}</ul>])
  if (c.prova) out.push(['Funziona davvero? Chi insegna?', <p className={stile.prova} key="p">{c.prova}</p>])
  return out
}

export function VarianteC({ corso: c, attive, sospese }: Props) {
  const domande = DOMANDE(c)
  return (
    <article className={stile.domande}>
      <header className={stile.testaC}>
        <Link className={stile.indietro} href="/">← Tutti i corsi</Link>
        <p className={stile.occhiello}>{c.occhiello || 'Corso'}</p>
        <h1 className={stile.titoloGrande}>{c.nome}</h1>
        <p className={stile.sommario}>{c.sommario}</p>
      </header>

      <div className={stile.due}>
        <div className={stile.corpo}>
          {domande.length ? (
            domande.map(([q, a]) => (
              <section className={stile.qa} key={q}>
                <h2 className={stile.domanda}>{q}</h2>
                {a}
              </section>
            ))
          ) : (
            /* Antibullismo: la fonte e' una riga sola. La pagina non finge. */
            <p className={stile.senza}>
              Di questo corso il sito non racconta ancora altro. Scrivici e ti spieghiamo com&apos;e&apos;
              fatta una lezione.
            </p>
          )}
        </div>

        <aside className={stile.spalla}>
          <h2 className={stile.gruppo}>In pratica</h2>
          <dl className={stile.fatti}>
            {([['A chi', c.aChiSiRivolge], ['Durata', c.durata], ['Ingresso', c.ingresso], ['Come si inizia', c.cadenza]] as const)
              .filter(([, v]) => Boolean(v))
              .map(([k, v]) => (
                <div className={stile.fatto} key={k}>
                  <dt className={stile.chiave}>{k}</dt>
                  <dd className={stile.valore}>{v}</dd>
                </div>
              ))}
          </dl>

          <h2 className={stile.gruppo}>Dove si pratica</h2>
          {attive.length ? (
            <>
              <ul className={stile.centriStretti}>
                {attive.slice(0, 6).map(({ sede, turni }) => (
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
              {attive.length > 6 ? (
                <Link className={stile.tutti} href="/centri">Tutti i {attive.length} centri →</Link>
              ) : null}
            </>
          ) : (
            <SenzaCentri />
          )}
          {sospese.length ? (
            <p className={stile.sospese}>
              Sospesi: {sospese.map(({ sede }) => comune(sede)).join(', ')}.
            </p>
          ) : null}

          <Link className={stile.pulsante} href={contatta(c)}>{c.azione || 'Chiedi informazioni'}</Link>
          <p className={stile.notaAzione}>Nessun impegno: e&apos; una richiesta di informazioni.</p>
        </aside>
      </div>
    </article>
  )
}
