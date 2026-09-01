/**
 * PROTOTIPO USA E GETTA — issue #7, «Scala tipografica e densita: valori esatti».
 *
 * Tre insiemi di valori su una rotta, commutabili con `?variant=`: A Corpus,
 * B Annuario, C Segnaletica. Palette fissa, quella decisa in #5: la variabile
 * in prova sono i corpi, le interlinee e il ritmo verticale.
 *
 * La stessa schermata in tutte e tre, e sono i 18 centri veri: la densita si
 * giudica contando quante voci stanno in uno schermo, non guardando una scala
 * di corpi allineati.
 *
 *   pnpm dev  →  http://localhost:3000/prototipo-scala
 *   node 'src/app/(frontend)/prototipo-scala/scala.mjs'   (solo le verifiche)
 */
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'

import { Switcher } from './Switcher'
import { VARIANTI, cssDi, verifiche } from './scala.mjs'
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
const TARGET: Record<string, string> = {
  adulti: 'Adulti',
  ragazzi: 'Ragazzi',
  bambini: 'Bambini',
  donne: 'Donne',
  istruttori: 'Istruttori',
  'aziende-ffoo': 'Aziende e FFOO',
}

const corsoDi = (sede: any) => sede.orari?.find((o: any) => o.disciplina?.nome)?.disciplina

export default async function PrototipoScala(props: {
  searchParams: Promise<{ variant?: string }>
}) {
  const { variant } = await props.searchParams
  const chiave = CHIAVI.some(([k]) => k === variant) ? variant! : 'a'
  const { nome, strategia, scala, ritmo } = (VARIANTI as Record<string, any>)[chiave]
  const prove = verifiche(chiave)
  const bocciate = prove.filter((p: any) => !p.passa).length

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'sedi',
    limit: 100,
    depth: 2,
    sort: 'indirizzo.citta',
  })
  const sedi = docs as any[]
  const scheda = sedi.find((s) => (s.orari ?? []).length > 1) ?? sedi[0]

  return (
    <div className="prototipo">
      <style dangerouslySetInnerHTML={{ __html: cssDi(chiave) }} />

      <p className="label">Prototipo usa e getta · issue #7 · {sedi.length} centri veri da Payload</p>
      <h1 className="display">{nome}</h1>
      <p className="body" style={{ marginTop: 12 }}>{strategia}</p>
      <p className="nota" style={{ marginTop: 16 }}>
        Le frecce in basso, o i tasti ← →, cambiano scala. Palette e struttura non cambiano mai:
        cambiano solo corpi, interlinee e ritmo verticale. Voce {ritmo.voce}px, gruppo{' '}
        {ritmo.gruppoSopra}/{ritmo.gruppoSotto}, Dato nudo {scala.dato[0]}px su {scala.dato[1]}.
      </p>

      <section className="sezione">
        <h2>Elenco centri: la densita si conta, non si guarda</h2>
        <p className="nota">
          Quante voci vedi senza scorrere? E l unica domanda che questa pagina risponde meglio di
          una tabella di numeri. La riga a 1px e sempre la stessa, in tutte e tre le varianti: a
          cambiare e solo quanto respira la voce attorno.
        </p>
        <div className="elenco">
          {sedi.map((s) => {
            const corso = corsoDi(s)
            return (
              <div className="voce" key={s.id} data-attivo={String(s.attivo)}>
                <div className="title">{s.nome}</div>
                <div className="percorso" data-colore={corso?.colore ?? 'inchiostro'}>
                  {TARGET[corso?.target] ?? 'Nessun orario'}
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
                      <div className="turno-docenti">
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
        <h2>Scheda sede: chiave e valore, non prosa</h2>
        <p className="nota">
          La seconda pagina del kit. Qui la scala si misura sull incolonnamento: la chiave in peso
          700, il valore in cifre tabulari, le righe a 1px sempre uguali.
        </p>
        <h3 className="headline" style={{ marginBottom: ritmo.gruppoSotto }}>{scheda.nome}</h3>
        <dl className="scheda">
          <div>
            <dt>Indirizzo</dt>
            <dd>
              {scheda.indirizzo.via}, {scheda.indirizzo.cap} {scheda.indirizzo.citta} (
              {scheda.indirizzo.provincia})
            </dd>
            <dd>{scheda.mapsUrl && <a href={scheda.mapsUrl}>Apri in Maps</a>}</dd>
          </div>
          {(scheda.orari ?? []).map((o: any, i: number) => (
            <div key={i}>
              <dt>{o.giorni.map((g: string) => GIORNO[g]).join(' ')}</dt>
              <dd>
                {o.oraInizio} – {o.oraFine} · {o.disciplina?.nome}
                {o.note ? ` (${o.note})` : ''}
              </dd>
              <dd className="meta">
                {(o.docenti ?? [])
                  .map((d: any) => `${QUALIFICA[d.qualifica] ?? ''} ${d.nome}`.trim())
                  .join(' · ')}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="sezione">
        <h2>La misura: il tetto duro dei 70 caratteri</h2>
        <p className="nota">
          La riga rossa e a 70ch, il limite adottato dal corpus (piu severo del 75 di GOV.UK). Il
          bersaglio e 66. Se il testo qui sotto la supera, il problema e la griglia, non il font.
        </p>
        <div className="righello">
          <span className="marca">70ch</span>
          <p className="body">
            Il centro tecnico e il luogo dove si pratica, ed e l unita di conversione del sito. Ogni
            percorso finisce in un centro: le lezioni sono settimanali e si entra durante l anno, e
            la prima e una prova gratuita, in sede, con l istruttore che poi tiene il corso.
          </p>
        </div>
      </section>

      <section className="sezione">
        <h2>
          Verifiche del corpus, {prove.length} controlli,{' '}
          {bocciate === 0 ? 'nessuno bocciato' : `${bocciate} bocciati`}
        </h2>
        <p className="nota">
          I controlli che si decidono sui numeri soli, presi dai test di conformita di #2. Gli altri
          tre (misura, colore tolto, ombre) si guardano in pagina, non si calcolano.
        </p>
        <table className="verifiche">
          <tbody>
            {prove.map((p: any) => (
              <tr key={p.prova}>
                <td>{p.prova}</td>
                <td className="val">{p.valore}</td>
                <td className="esito" data-passa={String(p.passa)}>{p.passa ? 'passa' : 'BOCCIATO'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Switcher varianti={CHIAVI} corrente={chiave} />
    </div>
  )
}
