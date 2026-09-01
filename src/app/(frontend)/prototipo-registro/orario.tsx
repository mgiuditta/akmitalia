/**
 * DIREZIONE B — «L'Orario». PROTOTIPO USA E GETTA, issue #35.
 *
 * Tesi: l'eroe della home e' la **settimana vera**. AKM non ha una fotografia
 * che nessun altro ha, ha 22 turni in 15 palestre, e messi su una griglia
 * dicono da soli la cosa che risponde all'obiezione piu' comune: si allena di
 * sera, fra le 18 e le 22, quando esci dal lavoro.
 *
 * Le altre leve, per il confronto: famiglia **Space Grotesk** (voce da
 * strumento, cifre disegnate per stare in colonna), palette **due
 * riempimenti pieni e ripetuti** invece di una tinta nuova, scala **piccola e
 * fitta**, movimento **la griglia che si compila in ordine d'orario**.
 */
import React from 'react'
import Link from 'next/link'

import { GIORNO_LUNGO } from '../centri/sede'
import type { Dati, Turno } from './dati'
import stile from './orario.module.css'

export const nome = "L'Orario"

/** La finestra dell'asse: 15:00-22:00, che e' quanto serve ai dati veri, con un
 *  quarto d'ora per riga. Se il cliente aggiunge un turno mattutino, la
 *  finestra si allarga da sola. */
const PASSO = 15
const ORE = [15, 16, 17, 18, 19, 20, 21, 22]

const TARGET: Record<string, string> = {
  adulti: 'Adulti',
  ragazzi: 'Ragazzi',
  bambini: 'Bambini',
  donne: 'Donne',
  istruttori: 'Istruttori',
  'aziende-ffoo': 'Aziende e FFOO',
}

const colonna = (t: Turno) => Math.floor((t.minuti - ORE[0] * 60) / PASSO) + 1
const quante = (t: Turno) => Math.max(2, Math.round(t.durata / PASSO))

/**
 * Il giovedi' ha Binasco e Bresso alle 18:30, e la griglia deve mostrarli
 * affiancati invece che uno sopra l'altro. Assegnazione golosa in ordine
 * d'orario: un turno prende la prima corsia libera a quell'ora, e il giorno
 * dichiara quante corsie ha usato.
 */
function corsie(giorno: Turno[]): Map<Turno, number> {
  const fine: number[] = []
  const di = new Map<Turno, number>()
  for (const t of giorno) {
    let c = fine.findIndex((f) => f <= t.minuti)
    if (c === -1) c = fine.length
    fine[c] = t.minuti + t.durata
    di.set(t, c)
  }
  return di
}

function Blocco({ t, i, corsia }: { t: Turno; i: number; corsia: number }) {
  return (
    <Link
      className={stile.turno}
      data-corso={t.corso?.target ?? 'adulti'}
      href={`/centri/${t.sede.slug}`}
      style={
        {
          gridColumn: `${colonna(t)} / span ${quante(t)}`,
          gridRow: corsia + 1,
          '--i': i,
        } as React.CSSProperties
      }
    >
      <span className={stile.dove}>{t.comune}</span>
      <span className={stile.quando}>{t.ore}</span> <span className={stile.chi}>{t.nota || t.palestra}</span>
    </Link>
  )
}

export function Orario({ dati }: { dati: Dati }) {
  const { voci, sedi, comuni, turni, settimana, istruttori } = dati
  /* L'ordine dell'animazione e' l'ordine d'orario di tutta la settimana, non
     quello della colonna: la griglia si compila come si legge un tabellone. */
  const ordine = new Map(
    [...turni]
      .sort((a, b) => a.minuti - b.minuti)
      .map((t, i) => [`${t.sede.id}-${t.giorno}-${t.inizio}`, i]),
  )
  const senza = voci.filter((v) => !v.attive.length)

  return (
    <div className={stile.direzione}>
      <div className={stile.dentro}>
        <header className={stile.apertura}>
          <p className={stile.occhiello}>Krav Maga · Lombardia</p>
          <h1 className={stile.titolo}>Quasi tutto succede fra le 18 e le 22.</h1>
          <p className={stile.sommario}>
            {turni.length} turni in {sedi.length} centri tecnici, da lunedì a sabato. Questa è la
            settimana vera: trova il giorno che ti resta libero, poi la palestra più vicina.
          </p>
        </header>

        <section aria-label="La settimana nei centri AKM" className={stile.settimana}>
          <div className={stile.scorre}>
            <div
              className={stile.telaio}
              style={
                {
                  '--quarti': ((ORE.at(-1) as number) - ORE[0]) * (60 / PASSO),
                } as React.CSSProperties
              }
            >
              <div className={`${stile.riga} ${stile.assi}`}>
                <div className={stile.angolo} />
                <div className={stile.assiOre}>
                  {/* Colonna esplicita: l'ultima etichetta e' piazzata a mano, e senza
                      questa le altre le si auto-collocano attorno finendo in una
                      colonna implicita di troppo. */}
                  {ORE.slice(0, -1).map((h, i) => (
                    <span className={stile.ora} key={h} style={{ gridColumn: i + 1 }}>
                      {String(h).padStart(2, '0')}:00
                    </span>
                  ))}
                  <span className={stile.oraFine}>{ORE.at(-1)}:00</span>
                </div>
              </div>

              {settimana.map(([g, t]) => {
                const c = corsie(t)
                return (
                  <div className={stile.riga} key={g}>
                    <div className={stile.giorno}>
                      {GIORNO_LUNGO[g] ?? g}
                      <span>
                        {t.length} {t.length === 1 ? 'turno' : 'turni'}
                      </span>
                    </div>
                    <div className={stile.pista}>
                      {t.map((x) => (
                        <Blocco
                          corsia={c.get(x) ?? 0}
                          i={ordine.get(`${x.sede.id}-${x.giorno}-${x.inizio}`) ?? 0}
                          key={`${x.sede.id}-${x.inizio}`}
                          t={x}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <p className={stile.legenda}>
          {/* Regola dell'Etichetta: il riempimento non porta mai l'informazione
              da solo, e i due riempimenti si distinguono anche in scala di grigi. */}
          <span className={stile.chiave}>
            <span className={stile.pastiglia} data-corso="adulti" /> Adulti e ragazzi
          </span>
          <span className={stile.chiave}>
            <span className={stile.pastiglia} data-corso="bambini" /> Bambini
          </span>
          <span>Ogni riquadro porta l&apos;orario, il comune e la palestra scritti.</span>
        </p>

        {/* ADR 0003, #24: in una griglia l'assenza si vede a occhio nudo, quindi
            va detta prima che sembri una dimenticanza. */}
        {senza.map((v) => (
          <p className={stile.assente} key={v.corso.id}>
            <strong>{v.corso.nome}</strong> non ha turni in questa stagione. Il corso esiste e
            riparte quando c&apos;è un gruppo:{' '}
            <Link href="/contatta">scrivici e ti diciamo dove e quando</Link>.
          </p>
        ))}

        <h2 className={stile.domanda}>Qual è il tuo momento?</h2>
        <ul className={stile.bivio}>
          {voci.map((v) => (
            <li key={v.corso.id}>
              <Link className={stile.voce} href={`/corsi/${v.corso.slug}`}>
                <span className={stile.suaDomanda}>{v.corso.domanda}</span>
                <span className={stile.conta}>
                  {v.turni.length
                    ? `${v.turni.length} turni · ${v.comuni.length} comuni`
                    : 'nessun turno in stagione'}
                </span>
                <span className={stile.target} data-colore={v.corso.colore ?? 'inchiostro'}>
                  {TARGET[v.corso.target] ?? v.corso.target}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className={stile.azioni}>
          {/* L'unica azione piena della pagina, e non e' il form: il Principio 2
              vieta la richiesta di contatto prima che il bivio sia risolto. */}
          <Link className={stile.azione} href="/centri">
            Indirizzi e schede dei {sedi.length} centri
          </Link>
        </p>

        <p className={stile.coda}>
          Ci si allena a {comuni.slice(0, -1).join(', ')} e {comuni.at(-1)}. I {istruttori} docenti
          dell&apos;albo sono diplomati dopo almeno quattro anni di percorso e un esame di
          abilitazione all&apos;insegnamento, e sono tesserati e assicurati CSEN.
        </p>
      </div>
    </div>
  )
}
