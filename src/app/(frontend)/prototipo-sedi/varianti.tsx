/**
 * PROTOTIPO USA E GETTA — issue #8, «Elenco sedi e scheda sede: la prova del kit».
 *
 * Tre varianti che non discutono di colore ne' di corpo — quelli sono decisi in
 * #5, #6 e #7 — ma della **struttura**: dove sta il peso fra l'elenco e la
 * scheda, e qual e' l'asse primario dell'elenco.
 *
 *   A  Registro esteso    l'elenco e' il documento: gli orari stanno nella voce.
 *   B  Indice e documento l'elenco e' un indice di una riga; la scheda porta tutto.
 *   C  Per settimana      l'asse e' il quando: 26 turni, non 18 centri.
 *
 * I formattatori sono condivisi, il layout no: ogni variante e' libera di
 * buttare via quello delle altre.
 */
import React from 'react'
import s from './varianti.module.css'

// ---------------------------------------------------------------- vocabolario

const GIORNI = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'] as const
const GIORNO: Record<string, string> = {
  lun: 'Lun', mar: 'Mar', mer: 'Mer', gio: 'Gio', ven: 'Ven', sab: 'Sab', dom: 'Dom',
}
const GIORNO_LUNGO: Record<string, string> = {
  lun: 'Lunedi', mar: 'Martedi', mer: 'Mercoledi', gio: 'Giovedi',
  ven: 'Venerdi', sab: 'Sabato', dom: 'Domenica',
}
const QUALIFICA: Record<string, string> = {
  istruttore: 'Istruttore', trainer: 'Trainer', maestro: 'M°',
  'direttore-tecnico': 'Direttore tecnico', presidente: 'Presidente',
}
const TARGET: Record<string, string> = {
  adulti: 'Adulti', ragazzi: 'Ragazzi', bambini: 'Bambini',
  donne: 'Donne', istruttori: 'Istruttori', 'aziende-ffoo': 'Aziende e FFOO',
}

export type Sede = any

const comune = (x: Sede) => x.indirizzo?.citta ?? ''
/** Il nome su WordPress e' «Abbiategrasso - Dynamic Dance School»: il comune sta
 *  gia' nel suo campo, quindi nella voce si scrive una volta sola. */
const luogo = (x: Sede) =>
  x.palestra || x.nome.replace(new RegExp(`^\\s*${comune(x)}\\s*[-–]\\s*`, 'i'), '') || x.nome
const via = (x: Sede) =>
  [x.indirizzo?.via, [x.indirizzo?.cap, comune(x)].filter(Boolean).join(' ')]
    .filter(Boolean).join(', ')
/** Nell'elenco il comune sta gia' nell'etichetta della voce: ripeterlo nella via
 *  e' rumore. Nella scheda invece serve intero, perche' e' un indirizzo. */
const viaSenzaComune = (x: Sede) =>
  [x.indirizzo?.via, x.indirizzo?.cap].filter(Boolean).join(', ')

const turni = (x: Sede) => (x.orari ?? []) as any[]
const giorni = (o: any) => (o.giorni ?? []).map((g: string) => GIORNO[g] ?? g).join(' ')
const ore = (o: any) => `${o.oraInizio}–${o.oraFine}`
const docenti = (o: any) =>
  (o.docenti ?? []).map((d: any) => `${QUALIFICA[d.qualifica] ?? ''} ${d.nome}`.trim()).join(' · ')
const corso = (o: any) => o.disciplina
/** Regola dell'Etichetta Corta: nell'elenco l'etichetta porta il target, non il
 *  nome del corso, che e' lungo il doppio della riga. */
const etichetta = (c: any) => TARGET[c?.target] ?? '—'

/** I percorsi distinti di una sede: Binasco tiene Antibullismo e Adulti nello
 *  stesso centro, e mostrare solo il primo turno mente. */
const percorsi = (x: Sede) =>
  [...new Map(turni(x).map((o) => [corso(o)?.id, corso(o)])).values()].filter(Boolean)

const Percorso = ({ c }: { c: any }) =>
  c ? <span className={s.percorso} data-colore={c.colore ?? 'inchiostro'}>{etichetta(c)}</span> : null

const Sospeso = ({ x }: { x: Sede }) =>
  x.attivo ? null : <span className={s.sospeso}>Sospeso</span>

/** Le province presenti, con quante sedi ciascuna. #9: etichetta e filtro, mai
 *  intestazione di gruppo — 27 sedi su 40 stanno in MI e i gruppi non reggono. */
export function province(sedi: Sede[]) {
  const m = new Map<string, number>()
  for (const x of sedi) {
    const p = x.indirizzo?.provincia
    if (p) m.set(p, (m.get(p) ?? 0) + 1)
  }
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}

function Filtri({ sedi, prov }: { sedi: Sede[]; prov?: string }) {
  return (
    <ul className={s.filtri}>
      <li>
        <a className={s.filtro} href="?" aria-current={!prov}>Tutte · {sedi.length}</a>
      </li>
      {province(sedi).map(([p, n]) => (
        <li key={p}>
          <a className={s.filtro} href={`?prov=${p}`} aria-current={prov === p}>{p} · {n}</a>
        </li>
      ))}
    </ul>
  )
}

// ------------------------------------------------- A — Registro esteso ------

export const nomeA = 'Registro esteso'

export function VarianteA({ sedi, scheda, prov }: { sedi: Sede[]; scheda: Sede; prov?: string }) {
  return (
    <div className={s.pagina}>
      <h1 className={s.headline}>Centri tecnici</h1>
      <p className={`${s.body} ${s.prosa}`} style={{ marginTop: 'var(--spazio-3)' }}>
        Ogni voce porta gli orari con se': quando alleni, chi tiene la lezione, dove. Non c'e'
        niente dietro un click.
      </p>
      <Filtri sedi={sedi} prov={prov} />

      <div className={s.aElenco}>
        {sedi.map((x) => (
          <a className={s.aVoce} key={x.id} href={`?variant=a&sede=${x.slug}`}>
            <div className={s.aTesta}>
              <span className={`${s.label} ${s.aComune}`}>{comune(x)} · {x.indirizzo?.provincia}</span>
              {percorsi(x).map((c: any) => <Percorso c={c} key={c.id} />)}
              <Sospeso x={x} />
            </div>
            <div className={s.aNome}>{luogo(x)}</div>
            <div className={`${s.dato} ${s.aVia}`}>{viaSenzaComune(x)}</div>
            {turni(x).length ? (
              <div className={s.aTurni}>
                {turni(x).map((o, i) => (
                  <div className={s.aTurno} key={i}>
                    <span className={`${s.dato} ${s.aQuando}`}>{giorni(o)} {ore(o)}</span>
                    <span className={`${s.dato} ${s.aCosa}`}>
                      {corso(o)?.nome}{o.note ? ` (${o.note})` : ''}
                    </span>
                    {docenti(o) ? <span className={s.aChi}>{docenti(o)}</span> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className={`${s.dato} ${s.aVuoto}`}>
                Orari non ancora pubblicati — scrivici e ti diciamo quando si allena.
              </p>
            )}
          </a>
        ))}
      </div>

      <SchedaA x={scheda} />
    </div>
  )
}

function SchedaA({ x }: { x: Sede }) {
  return (
    <section style={{ marginTop: 'var(--spazio-10)', borderTop: '2px solid var(--inchiostro)', paddingTop: 'var(--spazio-7)' }}>
      <p className={s.label} style={{ color: 'var(--grafite)' }}>Scheda sede · {comune(x)} ({x.indirizzo?.provincia})</p>
      <h2 className={s.headline} style={{ marginTop: 'var(--spazio-2)' }}>{luogo(x)}</h2>
      <p className={`${s.dato} ${s.aVia}`}>{via(x)}</p>
      {x.mapsUrl ? <p className={s.dato} style={{ marginTop: 'var(--spazio-2)' }}><a href={x.mapsUrl}>Apri in Google Maps</a></p> : null}
      <h3 className={`${s.label} ${s.gruppo}`} style={{ color: 'var(--grafite)' }}>Quando si allena</h3>
      <div className={s.aTurni}>
        {turni(x).map((o, i) => (
          <div className={s.aTurno} key={i}>
            <span className={`${s.dato} ${s.aQuando}`}>{giorni(o)} {ore(o)}</span>
            <span className={`${s.dato} ${s.aCosa}`}>{corso(o)?.nome}{o.note ? ` (${o.note})` : ''}</span>
            {docenti(o) ? <span className={s.aChi}>{docenti(o)}</span> : null}
          </div>
        ))}
      </div>
    </section>
  )
}

// --------------------------------------------- B — Indice e documento -------

export const nomeB = 'Indice e documento'

export function VarianteB({ sedi, scheda, prov }: { sedi: Sede[]; scheda: Sede; prov?: string }) {
  const slot = sedi.reduce((n, x) => n + turni(x).length, 0)
  return (
    <div className={s.pagina}>
      <h1 className={s.headline}>Centri tecnici</h1>
      <p className={`${s.body} ${s.prosa}`} style={{ marginTop: 'var(--spazio-3)' }}>
        L'elenco serve a trovare il tuo comune in fretta. Tutto il resto sta nella scheda.
      </p>
      <Filtri sedi={sedi} prov={prov} />

      <div className={s.bIndice}>
        {sedi.map((x) => (
          <a className={s.bRiga} key={x.id} href={`?variant=b&sede=${x.slug}`}>
            <span className={s.bComune}>
              {comune(x)} <span className={s.bLuogo}>{luogo(x)}</span>
            </span>
            <span className={s.bCoda}>
              <span className={s.bProv}>{x.indirizzo?.provincia}</span>
              <span>{turni(x).length ? `${turni(x).length} ${turni(x).length === 1 ? 'turno' : 'turni'}` : 'da definire'}</span>
              <span><Sospeso x={x} /></span>
            </span>
          </a>
        ))}
      </div>
      <p className={`${s.meta} ${s.bTotali}`}>
        {sedi.length} centri · {sedi.filter((x) => x.attivo).length} attivi · {slot} turni settimanali
      </p>

      <SchedaB x={scheda} />
    </div>
  )
}

function SchedaB({ x }: { x: Sede }) {
  const perGiorno = GIORNI.map((g) => [g, turni(x).filter((o) => (o.giorni ?? []).includes(g))] as const)
    .filter(([, o]) => o.length)
  const discipline = [...new Map(turni(x).map((o) => [corso(o)?.id, corso(o)])).values()].filter(Boolean)
  return (
    <section className={s.bScheda} style={{ borderTop: '2px solid var(--inchiostro)', paddingTop: 'var(--spazio-7)' }}>
      <p className={s.label} style={{ color: 'var(--grafite)' }}>Scheda sede</p>
      <h2 className={s.headline} style={{ marginTop: 'var(--spazio-2)' }}>
        {comune(x)}, {luogo(x)}
      </h2>

      <h3 className={`${s.label} ${s.gruppo}`} style={{ color: 'var(--grafite)' }}>La settimana</h3>
      <div className={s.bTabella}>
      <table className={s.bSettimana}>
        <thead>
          <tr><th scope="col">Giorno</th><th scope="col">Ora</th><th scope="col">Corso e docente</th></tr>
        </thead>
        <tbody>
          {perGiorno.map(([g, os]) =>
            os.map((o, i) => (
              <tr key={`${g}${i}`}>
                <td className={s.bGiorno}>{i === 0 ? GIORNO_LUNGO[g] : ''}</td>
                <td>{ore(o)}</td>
                <td>
                  {corso(o)?.nome}{o.note ? ` (${o.note})` : ''}
                  {docenti(o) ? <div className={s.bChi}>{docenti(o)}</div> : null}
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
      </div>

      <h3 className={`${s.label} ${s.gruppo}`} style={{ color: 'var(--grafite)' }}>Dove e cosa</h3>
      <div className={s.bFatti}>
        <div className={s.bFatto}>
          <span className={s.bChiave}>Indirizzo</span>
          <span className={s.bValore}>
            {via(x)} ({x.indirizzo?.provincia})
            {x.mapsUrl ? <> · <a href={x.mapsUrl}>Apri in Google Maps</a></> : null}
          </span>
        </div>
        <div className={s.bFatto}>
          <span className={s.bChiave}>Cosa si pratica</span>
          <span className={s.bValore}>
            {discipline.map((c: any) => (
              <span key={c.id} style={{ display: 'block' }}>
                {c.nome} <Percorso c={c} />
              </span>
            ))}
          </span>
        </div>
        <div className={s.bFatto}>
          <span className={s.bChiave}>Chi insegna</span>
          <span className={s.bValore}>
            {[...new Set(turni(x).flatMap((o) => (o.docenti ?? []).map((d: any) => `${QUALIFICA[d.qualifica] ?? ''} ${d.nome}`.trim())))].join(' · ') || '—'}
          </span>
        </div>
        <div className={s.bFatto}>
          <span className={s.bChiave}>Stato</span>
          <span className={s.bValore}>{x.attivo ? 'Attivo' : 'Sospeso per la stagione'}</span>
        </div>
      </div>
    </section>
  )
}

// ----------------------------------------------- C — Per settimana ----------

export const nomeC = 'Per settimana'

export function VarianteC({ sedi, scheda, prov }: { sedi: Sede[]; scheda: Sede; prov?: string }) {
  const righe = sedi.flatMap((x) => turni(x).flatMap((o) => (o.giorni ?? []).map((g: string) => ({ g, o, x }))))
  return (
    <div className={s.pagina}>
      <h1 className={s.headline}>Quando si allena</h1>
      <p className={`${s.body} ${s.prosa}`} style={{ marginTop: 'var(--spazio-3)' }}>
        La stessa settimana vista dal lato dell'ora, non del luogo: la sera in cui puoi,
        e i centri aperti quella sera.
      </p>
      <Filtri sedi={sedi} prov={prov} />

      {GIORNI.map((g) => {
        const del = righe.filter((r) => r.g === g).sort((a, b) => a.o.oraInizio.localeCompare(b.o.oraInizio))
        if (!del.length) return null
        return (
          <section key={g}>
            <h2 className={s.cGiorno}>{GIORNO_LUNGO[g]} <span className={s.meta} style={{ fontWeight: 400 }}>· {del.length} turni</span></h2>
            <div className={s.cTurni}>
              {del.map(({ o, x }, i) => (
                <a className={s.cTurno} key={i} href={`?variant=c&sede=${x.slug}`}>
                  <span className={s.cOre}>{ore(o)}</span>
                  <span className={s.cCosa}>{corso(o)?.nome} <Percorso c={corso(o)} /></span>
                  <span className={s.cDove}>{comune(x)}, {luogo(x)} <span className={s.meta} style={{ display: 'inline' }}>({x.indirizzo?.provincia})</span></span>
                  {docenti(o) ? <span className={s.cChi}>{docenti(o)}</span> : null}
                </a>
              ))}
            </div>
          </section>
        )
      })}

      <h2 className={`${s.label} ${s.gruppo}`} style={{ color: 'var(--grafite)' }}>Tutti i centri, per comune</h2>
      <div className={s.cIndice}>
        {sedi.map((x) => (
          <a className={s.cVoceIndice} key={x.id} href={`?variant=c&sede=${x.slug}`}>
            <span>{comune(x)} <span style={{ color: 'var(--grafite)' }}>{luogo(x)}</span></span>
            <span className={s.meta}>{x.indirizzo?.provincia}</span>
          </a>
        ))}
      </div>

      <SchedaC x={scheda} />
    </div>
  )
}

function SchedaC({ x }: { x: Sede }) {
  const righe = turni(x).flatMap((o) => (o.giorni ?? []).map((g: string) => ({ g, o })))
  return (
    <section style={{ marginTop: 'var(--spazio-10)', borderTop: '2px solid var(--inchiostro)', paddingTop: 'var(--spazio-7)' }}>
      <p className={s.label} style={{ color: 'var(--grafite)' }}>Scheda sede</p>
      <h2 className={s.headline} style={{ marginTop: 'var(--spazio-2)' }}>{comune(x)}, {luogo(x)}</h2>
      <div className={s.cTurni} style={{ marginTop: 'var(--spazio-6)', borderTop: '1px solid var(--riga)' }}>
        {GIORNI.flatMap((g) =>
          righe.filter((r) => r.g === g).map(({ o }, i) => (
            <div className={s.cTurno} key={`${g}${i}`}>
              <span className={s.cOre}>{GIORNO[g]} {ore(o)}</span>
              <span className={s.cCosa}>{corso(o)?.nome}{o.note ? ` (${o.note})` : ''}</span>
              {docenti(o) ? <span className={s.cChi}>{docenti(o)}</span> : null}
            </div>
          )),
        )}
      </div>
      <p className={s.dato} style={{ marginTop: 'var(--spazio-6)' }}>
        {via(x)} ({x.indirizzo?.provincia})
        {x.mapsUrl ? <> · <a href={x.mapsUrl}>Apri in Google Maps</a></> : null}
      </p>
    </section>
  )
}
