/**
 * PROTOTIPO USA E GETTA — issue #28, «L'anatomia di una pagina».
 *
 * Tre anatomie, ognuna applicata agli **stessi quattro provini**: due pagine che
 * esistono gia' su `main` (che l'anatomia deve saper riprodurre) e due che non
 * esistono ancora (che deve saper reggere). Se un'anatomia non copre il corpus,
 * e' sbagliata; se copre solo il corpus, non serve.
 */
import React from 'react'
import stile from './varianti.module.css'

export type Provino = {
  chiave: string
  /** Cosa e' questa pagina nel sito vero: serve al giudizio, non al layout. */
  nota: string
  occhiello: string
  titolo: string
  sommario: string
  /** La riga di numeri sotto il sommario. Vuota per le pagine senza dati propri. */
  fatti?: string
  azione?: string
  secondaria?: string
  /** Il corpo: sezioni con un titolo e delle righe. */
  sezioni: { titolo: string; righe: string[] }[]
  /** Il dato pratico che su `/corsi/[slug]` sta nella spalla. */
  spalla?: { chiave: string; valore: string }[]
  coda?: string
}

const Provini = ({ provini, children }: { provini: Provino[]; children: (p: Provino) => React.ReactNode }) => (
  <>
    {provini.map((p) => (
      <section key={p.chiave} className={stile.provino}>
        <p className={stile.etichetta}>{p.nota}</p>
        {children(p)}
      </section>
    ))}
  </>
)

/* ------------------------------------------------------------------ A ----- */

export const nomeA = 'Anatomia minima: titolo e sommario, il resto e’ della pagina'

/**
 * A — il vocabolario condiviso e' **due** cose sole: un titolo e un sommario.
 * Niente occhiello, niente fatti, niente azioni, niente spalla: quelle sono
 * scelte di quella pagina, non del sito. Una larghezza sola, il titolo sempre
 * Headline, perche' il Display e' un evento e non un default.
 */
export function VarianteA({ provini }: { provini: Provino[] }) {
  return (
    <Provini provini={provini}>
      {(p) => (
        <article className={stile.aPagina}>
          <h1 className={stile.aTitolo}>{p.titolo}</h1>
          <p className={stile.aSommario}>{p.sommario}</p>
          {p.sezioni.map((s) => (
            <div key={s.titolo}>
              <h2 className={stile.aSezione}>{s.titolo}</h2>
              <ul className={stile.aRighe}>
                {s.righe.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
          {/* Fatti, azione e spalla non hanno posto: chi li vuole se li scrive. */}
          {p.fatti ? <p className={stile.aFuori}>fuori anatomia: «{p.fatti}»</p> : null}
          {p.azione ? <p className={stile.aFuori}>fuori anatomia: azione «{p.azione}»</p> : null}
          {p.spalla ? <p className={stile.aFuori}>fuori anatomia: spalla, {p.spalla.length} voci</p> : null}
        </article>
      )}
    </Provini>
  )
}

/* ------------------------------------------------------------------ B ----- */

export const nomeB = 'Anatomia piena: apertura, corpo, spalla, coda'

/**
 * B — il vocabolario copre tutto quello che il corpus usa: occhiello, titolo,
 * sommario, fatti, azioni; corpo a sezioni; spalla facoltativa; coda. Ogni
 * pezzo e' facoltativo, quindi una pagina di sole parole usa due caselle su
 * otto — e la domanda del prototipo e' se le sei caselle vuote si notano.
 */
export function VarianteB({ provini }: { provini: Provino[] }) {
  return (
    <Provini provini={provini}>
      {(p) => (
        <article className={stile.bPagina}>
          <header className={stile.bApertura}>
            <p className={stile.bOcchiello}>{p.occhiello}</p>
            <h1 className={stile.bTitolo}>{p.titolo}</h1>
            <p className={stile.bSommario}>{p.sommario}</p>
            {p.fatti ? <p className={stile.bFatti}>{p.fatti}</p> : null}
            {p.azione ? (
              <p className={stile.bAzioni}>
                <span className={stile.bAzione}>{p.azione}</span>
                {p.secondaria ? <span className={stile.bSecondaria}>{p.secondaria}</span> : null}
              </p>
            ) : null}
          </header>

          <div className={p.spalla ? stile.bDue : undefined}>
            <div>
              {p.sezioni.map((s) => (
                <div key={s.titolo}>
                  <h2 className={stile.bSezione}>{s.titolo}</h2>
                  <ul className={stile.bRighe}>
                    {s.righe.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {p.spalla ? (
              <aside className={stile.bSpalla}>
                <p className={stile.bGruppo}>In pratica</p>
                {p.spalla.map((f) => (
                  <div key={f.chiave} className={stile.bFatto}>
                    <p className={stile.bChiave}>{f.chiave}</p>
                    <p className={stile.bValore}>{f.valore}</p>
                  </div>
                ))}
              </aside>
            ) : null}
          </div>

          {p.coda ? <p className={stile.bCoda}>{p.coda}</p> : null}
        </article>
      )}
    </Provini>
  )
}

/* ------------------------------------------------------------------ C ----- */

export const nomeC = 'Peso dichiarato: portale, documento, scheda'

/** Il peso decide larghezza, livello del titolo e presenza dell'occhiello. */
export type Peso = 'portale' | 'documento' | 'scheda'

/**
 * C — la pagina non sceglie otto pezzi: dichiara **un** attributo, il suo peso,
 * e l'anatomia ne deriva il resto. E' l'ipotesi che il corpus abbia gia' tre
 * pesi senza saperlo: la home e' larga 1040px con il titolo in Display,
 * l'elenco dei centri 78ch con il titolo in Headline, la pagina corso 100ch con
 * il Display e una spalla. Tre larghezze inventate una per volta, o tre pesi?
 */
export function VarianteC({ provini, peso }: { provini: Provino[]; peso: (p: Provino) => Peso }) {
  return (
    <Provini provini={provini}>
      {(p) => {
        const q = peso(p)
        return (
          <article className={`${stile.cPagina} ${stile[q]}`} data-peso={q}>
            <p className={stile.cPeso}>peso: {q}</p>
            {/* L'occhiello esiste solo sui pesi che nominano una sezione. */}
            {q !== 'documento' ? <p className={stile.cOcchiello}>{p.occhiello}</p> : null}
            <h1 className={stile.cTitolo}>{p.titolo}</h1>
            <p className={stile.cSommario}>{p.sommario}</p>
            {/* I fatti sono del portale: una scheda ha i suoi dati nel corpo,
                un documento non ne ha. */}
            {q === 'portale' && p.fatti ? <p className={stile.cFatti}>{p.fatti}</p> : null}
            {p.azione ? <p className={stile.cAzione}>{p.azione}</p> : null}

            <div className={q === 'scheda' && p.spalla ? stile.cDue : undefined}>
              <div>
                {p.sezioni.map((s) => (
                  <div key={s.titolo}>
                    <h2 className={stile.cSezione}>{s.titolo}</h2>
                    <ul className={stile.cRighe}>
                      {s.righe.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {q === 'scheda' && p.spalla ? (
                <aside className={stile.cSpalla}>
                  {p.spalla.map((f) => (
                    <div key={f.chiave} className={stile.cFatto}>
                      <p className={stile.cChiave}>{f.chiave}</p>
                      <p className={stile.cValore}>{f.valore}</p>
                    </div>
                  ))}
                </aside>
              ) : null}
            </div>

            {p.coda ? <p className={stile.cCoda}>{p.coda}</p> : null}
          </article>
        )
      }}
    </Provini>
  )
}
