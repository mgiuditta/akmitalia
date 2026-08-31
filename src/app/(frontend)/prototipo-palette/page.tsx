/**
 * PROTOTIPO USA E GETTA — issue #5, «Palette risolta: sei ruoli in valori».
 *
 * Tre varianti su una rotta, commutabili con `?variant=`: A Foglio chiaro,
 * B Tesserino, C Inchiostro verde. Come per #6 il layout non cambia mai: la
 * variabile in prova e' il colore, e una struttura che cambia insieme renderebbe
 * il confronto inutilizzabile.
 *
 * Nessuno swatch astratto: i sei ruoli si giudicano su una voce di elenco vera,
 * su un'etichetta di percorso e su una CTA. I rapporti di contrasto sono calcolati,
 * non stimati (palette.mjs).
 *
 *   pnpm dev  →  http://localhost:3000/prototipo-palette
 *   node 'src/app/(frontend)/prototipo-palette/palette.mjs'   (solo la tabella)
 */
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'

import { Switcher } from './Switcher'
import { VARIANTI, cssDi, tabella, hexDi, oklchDi } from './palette.mjs'
import './prototipo.css'

const CHIAVI: [string, string][] = Object.entries(VARIANTI).map(([k, v]: any) => [k, v.nome])

const GIORNO: Record<string, string> = {
  lun: 'Lun', mar: 'Mar', mer: 'Mer', gio: 'Gio', ven: 'Ven', sab: 'Sab', dom: 'Dom',
}
const QUALIFICA: Record<string, string> = {
  istruttore: 'Istruttore',
  trainer: 'Trainer',
  maestro: 'M°',
  'direttore-tecnico': 'Direttore tecnico',
  presidente: 'Presidente',
}
const RUOLO: Record<string, string> = {
  carta: 'Carta',
  cartaAlta: 'Carta alta',
  inchiostro: 'Inchiostro',
  grafite: 'Grafite',
  riga: 'Riga',
  verde: 'Verde AKM',
  rosso: 'Rosso Mattone',
  errore: 'Rosso di sistema',
}

/** Il percorso di una sede: il corso della sua prima riga d'orario, che porta il colore. */
const percorsoDi = (sede: any) => sede.orari?.find((o: any) => o.disciplina?.nome)?.disciplina

export default async function PrototipoPalette(props: {
  searchParams: Promise<{ variant?: string }>
}) {
  const { variant } = await props.searchParams
  const chiave = CHIAVI.some(([k]) => k === variant) ? variant! : 'a'
  const { nome, strategia } = (VARIANTI as Record<string, any>)[chiave]
  const hex = hexDi(chiave)
  const oklch = oklchDi(chiave)
  const righe = tabella(chiave)
  const bocciate = righe.filter((r: any) => !r.passa).length

  const payload = await getPayload({ config: await config })
  const [{ docs: sedi }, { docs: corsi }] = await Promise.all([
    payload.find({ collection: 'sedi', limit: 100, depth: 2, sort: 'indirizzo.citta', overrideAccess: true }),
    payload.find({ collection: 'corsi', limit: 20, sort: 'ordine', overrideAccess: true }),
  ])

  return (
    <div className="prototipo">
      <style dangerouslySetInnerHTML={{ __html: cssDi(chiave) }} />

      <p className="label">
        Prototipo usa e getta · issue #5 · {(sedi as any[]).length} centri veri da Payload
      </p>
      <h1 className="display">{nome}</h1>
      <p className="body" style={{ marginTop: 12 }}>
        {strategia}
      </p>
      <p className="nota" style={{ marginTop: 16 }}>
        Le frecce in basso, o i tasti ← →, cambiano palette. Il layout non cambia mai: cambia solo il
        colore. Scala, pesi e densita sono provvisori, i valori esatti li decide il ticket seguente.
      </p>

      <section className="sezione">
        <h2>I sei ruoli sul contenuto, non su un quadrato</h2>
        <p className="nota">
          Il quadrato di colore mente: un verde giudicato su 44 px pieni non e il verde che vedrai
          sul sito, dove vive in un testo di 13 px e in un bottone. Qui sotto i valori, ma la
          decisione si prende nelle sezioni successive.
        </p>
        <div className="tessere">
          {Object.keys(RUOLO).map((k) => (
            <div className="tessera" key={k}>
              <div className="quadro" style={{ background: `var(--${k === 'cartaAlta' ? 'carta-alta' : k})` }} />
              <div className="label" style={{ color: 'var(--inchiostro)' }}>{RUOLO[k]}</div>
              <code>{hex[k]}</code>
              <code>{oklch[k]}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="sezione">
        <h2>Elenco centri: righe a 1px, un percorso per voce</h2>
        <p className="nota">
          La prova vera. Diciotto voci in fila, ognuna con la sua etichetta di percorso: il colore
          classifica, non decora. Nessuna banda, nessuna colonna colorata, nessun border-left: la
          Regola della Bandiera Smontata regge se scorrendo l elenco non vedi mai un tricolore.
        </p>
        <div className="elenco">
          {(sedi as any[]).map((s) => {
            const corso = percorsoDi(s)
            return (
              <div className="voce" key={s.id} data-attivo={String(s.attivo)}>
                <div className="title">{s.nome}</div>
                <div className="percorso" data-colore={corso?.colore ?? 'inchiostro'}>
                  {corso?.nome ?? 'Nessun orario'}
                </div>
                <div className="indirizzo dato">
                  {s.indirizzo.via}, {s.indirizzo.citta} ({s.indirizzo.provincia})
                  {!s.attivo && ' · sospeso'}
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
                      <div className="turno-docenti" style={{ marginBottom: 8 }}>
                        {(o.docenti ?? [])
                          .map((d: any) => `${QUALIFICA[d.qualifica] ?? ''} ${d.nome}`.trim())
                          .join(' · ')}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="sezione">
        <h2>Lo stesso elenco senza colore</h2>
        <p className="nota">
          Il test 3 del corpus: togli il colore alla pagina, le voci si distinguono ancora? Devono
          farlo per riga, peso e spazio. Se qui sotto l elenco perde struttura, la palette sta
          reggendo un lavoro che tocca alla tipografia.
        </p>
        <div className="elenco senza-colore">
          {(sedi as any[]).slice(0, 4).map((s) => {
            const corso = percorsoDi(s)
            return (
              <div className="voce" key={s.id}>
                <div className="title">{s.nome}</div>
                <div className="percorso" data-colore={corso?.colore ?? 'inchiostro'}>
                  {corso?.nome ?? 'Nessun orario'}
                </div>
                <div className="indirizzo dato">
                  {s.indirizzo.via}, {s.indirizzo.citta} ({s.indirizzo.provincia})
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="sezione">
        <h2>Il verde dove lavora davvero: la CTA</h2>
        <p className="nota">
          Il Verde AKM regge l azione primaria. Va giudicato pieno, con il testo Carta sopra, e come
          testo su fondo Carta: sono due contrasti diversi e devono passare entrambi.
        </p>
        <div className="foglio-alto" style={{ display: 'grid', gap: 16 }}>
          <div className="title">Pontesesto Rozzano, Centro Tecnico Aisha</div>
          <div className="dato" style={{ color: 'var(--grafite)' }}>
            Mar Gio · 20:30 – 22:00 · Krav Maga · Istruttore Dario Cuzzi
          </div>
          <div className="azioni">
            <a className="cta" href="#">Prenota una prova gratuita</a>
            <a className="cta-2" href="#">Scrivi al centro</a>
            <a className="link" href="#">Apri in Google Maps</a>
          </div>
        </div>
      </section>

      <section className="sezione">
        <h2>Due rossi che non devono somigliarsi</h2>
        <p className="nota">
          Il Rosso Mattone e un percorso, il rosso di sistema e un errore. Se a colpo d occhio sono
          lo stesso rosso, la Regola del Rosso Riservato e gia rotta: qui stanno affiancati apposta,
          ed e l unico punto della pagina dove succede.
        </p>
        <div className="foglio-alto" style={{ display: 'grid', gap: 24 }}>
          <div>
            <div className="percorso" data-colore="rosso" style={{ fontSize: 15 }}>
              Difesa dall aggressione
            </div>
            <div className="nota" style={{ margin: '6px 0 0' }}>
              etichetta di percorso, Rosso Mattone
            </div>
          </div>
          <div className="campo" data-errore="true">
            <label className="label" htmlFor="tel" style={{ color: 'var(--inchiostro)' }}>
              Telefono
            </label>
            <input id="tel" defaultValue="02 1234" />
            <div className="errore">Il numero e incompleto: servono almeno 9 cifre.</div>
          </div>
        </div>
      </section>

      <section className="sezione">
        <h2>I percorsi, uno alla volta</h2>
        <p className="nota">
          I {(corsi as any[]).length} corsi veri, ognuno con il suo ruolo di colore e la domanda del
          bivio. Non stanno in tre bande affiancate: stanno in un elenco, separati da righe, come
          ogni altra cosa nel sistema.
        </p>
        <div className="elenco">
          {(corsi as any[]).map((c) => (
            <div className="voce" key={c.id}>
              <div className="title">{c.nome}</div>
              <div className="percorso" data-colore={c.colore}>
                {RUOLO[c.colore] ?? c.colore}
              </div>
              <div className="indirizzo dato" style={{ color: 'var(--inchiostro)' }}>
                {c.domanda ?? c.sommario}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sezione">
        <h2>
          Contrasti calcolati, {righe.length} coppie, {bocciate === 0 ? 'nessuna bocciata' : `${bocciate} bocciate`}
        </h2>
        <p className="nota">
          Rapporti WCAG veri, calcolati convertendo oklch in sRGB (palette.mjs), non stimati a occhio.
          Il divisore non e testo: il minimo qui e 1,8:1, la soglia sotto cui una riga a 1px sparisce
          sul fondo (GOV.UK sta a circa 2,3:1).
        </p>
        <table className="contrasti">
          <thead>
            <tr>
              <th>Coppia</th>
              <th>Uso</th>
              <th className="num">Rapporto</th>
              <th className="num">Minimo</th>
              <th>Esito</th>
            </tr>
          </thead>
          <tbody>
            {righe.map((r: any) => (
              <tr key={`${r.fronte}-${r.sfondo}`}>
                <td>
                  {RUOLO[r.fronte]} su {RUOLO[r.sfondo]}
                </td>
                <td style={{ color: 'var(--grafite)' }}>{r.uso}</td>
                <td className="num">{r.rapporto.toFixed(2)}:1</td>
                <td className="num" style={{ color: 'var(--grafite)' }}>{r.min}:1</td>
                <td className="esito" data-passa={String(r.passa)}>
                  {r.passa ? 'passa' : 'BOCCIATA'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Switcher varianti={CHIAVI} corrente={chiave} />
    </div>
  )
}
