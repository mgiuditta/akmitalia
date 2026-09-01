/**
 * DIREZIONE C — «La Prima Volta». PROTOTIPO USA E GETTA, issue #35.
 *
 * Tesi: PRODUCT.md dice che l'emozione bersaglio e' «sollievo competente» e che
 * il sito deve togliere paura, non aggiungerla. Questa direzione prende quel
 * principio alla lettera: la home risponde alla domanda che il visitatore ha
 * vergogna di fare — cosa succede la prima volta, cosa devo portare, sono fuori
 * posto — prima di chiedergli qualunque cosa. E' l'unica delle tre che ha una
 * sezione che le altre due non hanno.
 *
 * Le altre leve, per il confronto: famiglie **Bricolage Grotesque + Newsreader**
 * (due voci, AKM che parla e il testo che si legge con calma), palette **campi
 * di colore chiari a tutta larghezza, uno alla volta**, scala **grande e
 * distesa, misura lunga**, movimento **un lavaggio solo che entra da sinistra**.
 */
import React from 'react'
import Link from 'next/link'

import type { Dati, Voce } from './dati'
import stile from './primavolta.module.css'

export const nome = 'La Prima Volta'

const TARGET: Record<string, string> = {
  adulti: 'Adulti',
  ragazzi: 'Ragazzi',
  bambini: 'Bambini',
  donne: 'Donne',
  istruttori: 'Istruttori',
  'aziende-ffoo': 'Aziende e FFOO',
}

/**
 * COPY DA CONFERMARE COL CLIENTE. Le tre risposte qui sotto sono la sostanza di
 * questa direzione, e oggi sono scritte da noi: nessun campo di Payload le
 * contiene, e nessun documento del progetto le detta. Se la direzione vince,
 * diventano tre campi di `Impostazioni` e le parole le sceglie AKM.
 */
const PRIMA_VOLTA = [
  {
    titolo: 'Non serve essere allenati',
    testo:
      'Si comincia da fermi, con i movimenti di base, e si va al ritmo di chi sta imparando. Nessuno ti mette in coppia con chi tira forte.',
  },
  {
    titolo: 'Serve poco: maglietta, pantaloni comodi, acqua',
    testo:
      'Niente attrezzatura da comprare per provare. Guantini e paradenti servono più avanti, e te lo dice il docente quando è il momento.',
  },
  {
    titolo: 'La prima lezione è di prova',
    testo:
      'Vieni, guardi, provi. Se non è la cosa giusta per te lo capisci quella sera stessa, e non hai firmato niente.',
  },
]

/**
 * COPY DA CONFERMARE COL CLIENTE. La seconda frase cambia per percorso perche'
 * questa direzione parla a una persona alla volta: la stessa frase ripetuta tre
 * volte e' esattamente il riempitivo che fa sembrare un sito un template.
 * Nessun campo di Payload la contiene: se la direzione vince, diventa un campo
 * su `corsi` accanto a `domanda`.
 */
const RASSICURAZIONE: Record<string, string> = {
  adulti:
    'Si entra da principianti, in un gruppo di adulti che ha cominciato allo stesso modo, e la sala è quella della palestra di quartiere.',
  bambini:
    'Il gruppo è di soli bambini, si lavora sulla fiducia prima che sulla tecnica, e i genitori possono restare a guardare la prima volta.',
  donne:
    'Il gruppo è di sole donne e il programma parte dalle situazioni vere, non dallo sport da combattimento.',
}

function Risposta({ voce }: { voce: Voce }) {
  /* #24: il bivio dichiara che il corso esiste, non che parte lunedi'. */
  if (!voce.attive.length)
    return (
      <>
        {RASSICURAZIONE[voce.corso.target] ? `${RASSICURAZIONE[voce.corso.target]} ` : ''}
        In questa stagione però nessun centro lo tiene: il corso esiste e riparte quando si forma un
        gruppo, quindi scrivici e ti diciamo dove e quando.
      </>
    )
  const primi = voce.comuni.slice(0, 5).join(', ')
  const altri = voce.comuni.length - 5
  return (
    <>
      Si allena a {primi}
      {altri > 0 ? ` e in altri ${altri} comuni` : ''}. {RASSICURAZIONE[voce.corso.target] ?? ''}
    </>
  )
}

export function PrimaVolta({ dati }: { dati: Dati }) {
  const { voci, sedi, comuni, turni, istruttori } = dati

  return (
    <div className={stile.direzione}>
      <div className={stile.dentro}>
        <header className={stile.apertura}>
          <p className={stile.occhiello}>Krav Maga · Lombardia</p>
          <h1 className={stile.titolo}>Il primo passo è entrare. Il resto lo insegniamo noi.</h1>
          <p className={stile.sommario}>
            Corsi di difesa personale per adulti, ragazzi e bambini in {sedi.length} centri tecnici
            fra Milano, Monza, Lodi e Varese.
          </p>
        </header>
      </div>

      <h2 className={`${stile.dentro} ${stile.domanda}`}>Qual è il tuo momento?</h2>
      <ul className={stile.bivio}>
        {voci.map((voce) => (
          <li key={voce.corso.id}>
            {/* Un percorso alla volta prende il campo, e mai due insieme: e' il
                modo in cui questa direzione ha colore forte senza diventare una
                bandiera (Regola della Bandiera Smontata). */}
            <Link
              className={stile.voce}
              data-colore={voce.corso.colore ?? 'inchiostro'}
              href={`/corsi/${voce.corso.slug}`}
            >
              <span className={stile.corpoVoce}>
                <span className={stile.suaDomanda}>{voce.corso.domanda}</span>
                <span className={stile.risposta}>
                  <span className={stile.target}>
                    {TARGET[voce.corso.target] ?? voce.corso.target}
                  </span>
                  <Risposta voce={voce} />
                  {voce.turni.length ? (
                    <span className={stile.dettaglio}>
                      {voce.turni.length} turni a settimana in {voce.attive.length}{' '}
                      {voce.attive.length === 1 ? 'centro' : 'centri'}
                    </span>
                  ) : null}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Il Principio 5 di PRODUCT.md, reso una sezione invece che una promessa. */}
      <section className={stile.primaVolta}>
        <div className={stile.dentro}>
          <h2 className={stile.titoloSezione}>Cosa succede la prima volta che vieni</h2>
          <ul className={stile.punti}>
            {PRIMA_VOLTA.map((p) => (
              <li key={p.titolo}>
                <strong>{p.titolo}</strong>
                <span>{p.testo}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className={`${stile.dentro} ${stile.coda}`}>
        <p className={stile.presenza}>Ci si allena in {comuni.length} comuni della Lombardia.</p>
        <p className={stile.elenco}>
          {comuni.slice(0, -1).join(', ')} e {comuni.at(-1)}: {sedi.length} centri tecnici,{' '}
          {turni.length} turni a settimana, quasi tutti fra le 18 e le 22.
        </p>
        <p className={stile.azioni}>
          {/* L'unica azione piena della pagina, e non e' il form: il Principio 2
              vieta la richiesta di contatto prima che il bivio sia risolto. */}
          <Link className={stile.azione} href="/centri">
            Trova il centro più vicino
          </Link>
        </p>
        <p className={stile.credenziali}>
          I {istruttori} docenti dell&apos;albo sono diplomati dopo almeno quattro anni di percorso
          e un esame di abilitazione all&apos;insegnamento, e sono tesserati e assicurati CSEN.
        </p>
      </footer>
    </div>
  )
}
