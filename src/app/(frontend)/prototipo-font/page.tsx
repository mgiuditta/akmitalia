/**
 * PROTOTIPO USA E GETTA — issue #6, «Scelta font su dati sede veri».
 *
 * Tre varianti su una rotta, commutabili con `?variant=`: A Source Sans 3,
 * B Fira Sans, C Noto Sans (riserva). Le varianti qui NON sono strutturalmente
 * diverse, ed e' voluto: la domanda e' quale famiglia, quindi il layout resta
 * fisso e la font e' l'unica variabile. Un layout che cambia insieme alla font
 * renderebbe il confronto inutilizzabile.
 *
 * I dati sono i 18 centri veri importati in #11: nessun pangram, nessun lorem.
 *
 *   pnpm dev  →  http://localhost:3000/prototipo-font
 *   pnpm prototipo:font   (scarica prima i file font)
 */
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'

import { Switcher } from './Switcher'
import './prototipo.css'

const VARIANTI: [string, string][] = [
  ['a', 'Source Sans 3'],
  ['b', 'Fira Sans'],
  ['c', 'Noto Sans'],
]

const FONT: Record<string, string> = { a: 'source', b: 'fira', c: 'noto' }

const GIORNO: Record<string, string> = {
  lun: 'Lun',
  mar: 'Mar',
  mer: 'Mer',
  gio: 'Gio',
  ven: 'Ven',
  sab: 'Sab',
  dom: 'Dom',
}

const QUALIFICA: Record<string, string> = {
  istruttore: 'Istruttore',
  trainer: 'Trainer',
  maestro: 'M°',
  'direttore-tecnico': 'Direttore tecnico',
  presidente: 'Presidente',
}

/** Le tre prove che la ricerca #3 ha lasciato aperte, rese nelle tre famiglie insieme. */
const PROVE: [string, React.ReactNode][] = [
  [
    'Cifre in colonna: devono incolonnarsi perfettamente',
    <div className="righello" key="c">
      {'18:30 – 19:30\n20:15 – 21:45\n20:00 – 21:30\n11:11 – 10:00\n08:45 – 22:00'}
    </div>,
  ],
  [
    'Sigle a livello Label, maiuscoletto vero (all-small-caps)',
    <div className="label" key="s" style={{ fontSize: 15 }}>
      CSEN-CONI · F.E.K.D.A. · P.T.D. · MI · MB · LO · VA
    </div>,
  ],
  [
    'Nome proprio lungo a livello Title, accanto al dato',
    <div key="n">
      <div className="title">Milano Bisceglie / Lorenteggio, Palestra Piscina Cardellino</div>
      <div className="dato" style={{ color: 'var(--inchiostro-2)' }}>
        Via Cardellino n°3, Milano
      </div>
    </div>,
  ],
  [
    'Pesi reali, dal piu leggero al Display',
    <div className="pesi" key="p">
      <div className="p300">300 Pogliano Milanese, Centro Dance Time Studio</div>
      <div className="p400">400 Pogliano Milanese, Centro Dance Time Studio</div>
      <div className="p500">500 Pogliano Milanese, Centro Dance Time Studio</div>
      <div className="p600">600 Pogliano Milanese, Centro Dance Time Studio</div>
      <div className="p700">700 Pogliano Milanese, Centro Dance Time Studio</div>
      <div className="p900" style={{ fontSize: 26 }}>
        900 Trova il tuo centro
      </div>
    </div>,
  ],
  [
    'Maiuscoli accentati sotto un Display stretto (interlinea 1.05)',
    <div className="display" key="a" style={{ fontSize: 34 }}>
      MUGGIÒ È CHIUSO
    </div>,
  ],
]

export default async function PrototipoFont(props: {
  searchParams: Promise<{ variant?: string }>
}) {
  const { variant } = await props.searchParams
  const chiave = VARIANTI.some(([k]) => k === variant) ? variant! : 'a'
  const nomeFamiglia = VARIANTI.find(([k]) => k === chiave)![1]

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'sedi',
    limit: 100,
    depth: 2,
    sort: 'indirizzo.citta',
    overrideAccess: true,
  })
  const sedi = docs as any[]

  return (
    <div className="prototipo" data-font={FONT[chiave]}>
      <p className="label">Prototipo usa e getta · issue #6 · {sedi.length} centri veri da Payload</p>
      <h1 className="display">{nomeFamiglia}</h1>
      <p className="body" style={{ marginTop: 12 }}>
        Le frecce in basso, o i tasti ← →, cambiano famiglia. Il layout non cambia mai: cambia solo
        la font, cosi il confronto misura la font e non il layout. Scala e densita sono provvisorie,
        i valori esatti li decide un altro ticket.
      </p>

      <section className="sezione">
        <h2>I cinque livelli su contenuto vero</h2>
        <p className="nota">
          Display, Headline, Title, Body, Label come li definisce DESIGN.md. Il livello Title e dove
          vivono i nomi propri, il Label porta le sigle in maiuscoletto.
        </p>
        <div style={{ display: 'grid', gap: 20 }}>
          <div className="display">Trova il tuo centro</div>
          <div className="headline">Diciotto centri tecnici in Lombardia</div>
          <div className="title">Pontesesto Rozzano, Centro Tecnico Aisha</div>
          <div className="body">
            Il centro tecnico e il luogo dove si pratica, ed e l unita di conversione del sito. Ogni
            percorso finisce in un centro. Le lezioni sono settimanali e si entra durante l anno: la
            prima e una prova gratuita, in sede, con l istruttore che poi tiene il corso.
          </div>
          <div className="label">Istruttore · Krav Maga Master Teacher CSEN-CONI · MI</div>
        </div>
      </section>

      <section className="sezione">
        <h2>Elenco centri, righe a 1px</h2>
        <p className="nota">
          Diciotto nomi propri reali, di lunghezza molto diversa, con provincia in maiuscoletto e la
          colonna degli orari. E la prova piu dura: se una font regge questo, regge il sito.
        </p>
        <div className="elenco">
          {sedi.map((s) => (
            <div className="voce" key={s.id} data-attivo={String(s.attivo)}>
              <div className="title">{s.nome}</div>
              <div className="label">
                {s.indirizzo.provincia}
                {!s.attivo && ' · sospeso'}
              </div>
              <div className="indirizzo dato">
                {s.indirizzo.via}, {s.indirizzo.citta}
              </div>
              <div className="turni">
                {(s.orari ?? []).map((o: any, i: number) => (
                  <React.Fragment key={i}>
                    <div className="turno-giorno">{o.giorni.map((g: string) => GIORNO[g]).join(' ')}</div>
                    <div className="turno-ore">
                      {o.oraInizio} – {o.oraFine}
                    </div>
                    <div className="turno-corso">
                      {o.disciplina?.nome}
                      {o.note ? ` (${o.note})` : ''}
                    </div>
                    <div className="turno-docenti" style={{ gridColumn: '1 / -1', marginBottom: 8 }}>
                      {(o.docenti ?? [])
                        .map((d: any) => `${QUALIFICA[d.qualifica] ?? ''} ${d.nome}`.trim())
                        .join(' · ')}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sezione">
        <h2>La trappola delle cifre proporzionali</h2>
        <p className="nota">
          Sopra con `tabular-nums`, sotto senza. Source Sans 3 e Noto Sans sono tabulari di default e
          le due colonne restano identiche. Fira Sans e proporzionale di default: sotto, la colonna
          balla. E un errore silenzioso, si vede solo qui.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="label">con tabular-nums</div>
            <div className="righello">{'18:30\n20:15\n11:11\n08:45'}</div>
          </div>
          <div>
            <div className="label">senza (proportional)</div>
            <div className="righello proporzionale">{'18:30\n20:15\n11:11\n08:45'}</div>
          </div>
        </div>
      </section>

      <section className="sezione">
        <h2>Confronto affiancato, le tre famiglie insieme</h2>
        <p className="nota">
          Le cinque prove lasciate aperte dalla ricerca, rese contemporaneamente nelle tre candidate.
          Qui la barra in basso non serve: si guarda la differenza, non la si ricorda.
        </p>
        {PROVE.map(([titolo, nodo], i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <div className="label" style={{ marginBottom: 8 }}>
              {titolo}
            </div>
            <div className="affiancato">
              {(
                [
                  ['f-source', 'Source Sans 3'],
                  ['f-fira', 'Fira Sans'],
                  ['f-noto', 'Noto Sans'],
                ] as const
              ).map(([cls, nome]) => (
                <div className={`colonna ${cls}`} key={cls}>
                  <h3>{nome}</h3>
                  {nodo}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="sezione">
        <h2>Il costo, per la scala di pesi che questa pagina usa davvero</h2>
        <p className="nota">
          Cinque pesi in uso qui: 300, 400, 500, 600, 700, piu il 900 del Display. Le cifre sono
          quelle misurate nella ricerca, subset latin con tutte le feature conservate.
        </p>
        <div className="turni" style={{ gridTemplateColumns: 'auto auto 1fr' }}>
          <div className="title">Source Sans 3</div>
          <div className="dato">49,9 KB</div>
          <div className="dato" style={{ color: 'var(--inchiostro-2)' }}>
            un file variabile, 200-900, tutta la scala
          </div>
          <div className="title">Fira Sans</div>
          <div className="dato">circa 198 KB</div>
          <div className="dato" style={{ color: 'var(--inchiostro-2)' }}>
            sei statici da circa 33 KB, uno per peso
          </div>
          <div className="title">Noto Sans</div>
          <div className="dato">55,8 KB</div>
          <div className="dato" style={{ color: 'var(--inchiostro-2)' }}>
            variabile, dopo aver tolto l asse di larghezza
          </div>
        </div>
      </section>

      <Switcher varianti={VARIANTI} corrente={chiave} />
    </div>
  )
}
