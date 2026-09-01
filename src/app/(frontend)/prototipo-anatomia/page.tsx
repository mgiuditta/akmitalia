/**
 * PROTOTIPO USA E GETTA — issue #28, «L'anatomia di una pagina, estratta dalle
 * tre che esistono».
 *
 * Tre anatomie su una rotta, commutabili con `?variant=`. La variabile in prova
 * non e' l'aspetto — colore, font e scala sono chiusi da #5, #6 e #7 — ma
 * **quante caselle** ha il vocabolario condiviso e chi le sceglie.
 *
 * I provini sono cinque: tre riproducono l'apertura di pagine gia' su `main`
 * (l'anatomia deve saperle rifare senza perdere niente) e due sono pagine che
 * non esistono ancora, `/privacy` e `/istruttori`, che sono il caso magro —
 * sole parole, nessun dato proprio. Il dato e' vero, preso da Payload.
 *
 *   pnpm dev  →  http://localhost:3000/prototipo-anatomia
 *   ?variant=a|b|c
 */
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Corsi as Corso, Istruttori, Sedi as Sede } from '@/payload-types'

import { comune, turni } from '../centri/sede'
import { Switcher } from './Switcher'
import {
  type Peso,
  type Provino,
  VarianteA,
  VarianteB,
  VarianteC,
  nomeA,
  nomeB,
  nomeC,
} from './varianti'
import './prototipo.css'

const VARIANTI: [string, string][] = [
  ['a', nomeA],
  ['b', nomeB],
  ['c', nomeC],
]

/** Il peso di ogni provino nella variante C. Qui e' una mappa a mano: nel sito
 *  vero sarebbe un dato della rotta, ed e' esattamente cio' che si sta provando. */
const PESO: Record<string, Peso> = {
  home: 'portale',
  centri: 'documento',
  corso: 'scheda',
  privacy: 'documento',
  istruttori: 'documento',
}

const voci = (a: { voce: string }[] | null | undefined) => (a ?? []).map((x) => x.voce)

export default async function PrototipoAnatomia(props: {
  searchParams: Promise<{ variant?: string }>
}) {
  const { variant } = await props.searchParams
  const chiave = VARIANTI.some(([k]) => k === variant) ? variant! : 'a'

  const payload = await getPayload({ config: await config })
  const [corsi, sedi, istruttori] = await Promise.all([
    payload.find({ collection: 'corsi', where: { inBivio: { equals: true } }, limit: 20, depth: 0 }),
    payload.find({
      collection: 'sedi',
      where: { attivo: { equals: true } },
      limit: 200,
      depth: 2,
      sort: 'indirizzo.citta',
    }),
    payload.find({ collection: 'istruttori', limit: 30, depth: 0 }),
  ])

  const attive = sedi.docs as Sede[]
  const comuni = [...new Set(attive.map(comune))].sort((a, b) => a.localeCompare(b, 'it'))
  const slot = attive.reduce((n, s) => n + turni(s).length, 0)
  // Il corso con il nome piu' lungo: e' li' che il Display si rompe.
  const corso = [...(corsi.docs as Corso[])].sort((a, b) => b.nome.length - a.nome.length)[0]
  const nomi = (istruttori.docs as Istruttori[]).map((i) => i.nome).slice(0, 8)

  const provini: Provino[] = [
    {
      chiave: 'home',
      nota: 'corpus · la home, oggi su main (#17)',
      occhiello: 'Krav Maga in Lombardia',
      titolo: 'Difendersi si impara. Vicino a casa.',
      sommario: `Corsi per adulti, ragazzi e bambini in ${attive.length} centri tecnici tra Milano, Monza, Lodi e Varese. Non serve esperienza: si parte da zero, con un docente diplomato.`,
      fatti: `${attive.length} centri attivi · ${comuni.length} comuni · ${slot} turni a settimana`,
      azione: 'Trova il centro più vicino',
      secondaria: 'Oppure parti dalla tua domanda',
      sezioni: [
        {
          titolo: 'Qual è il tuo momento?',
          righe: (corsi.docs as Corso[]).map((c) => c.domanda ?? c.nome),
        },
      ],
      coda: `Ci si allena in ${comuni.length} comuni, ${slot} turni a settimana. I docenti sono diplomati dopo almeno quattro anni di percorso e un esame di abilitazione.`,
    },
    {
      chiave: 'centri',
      nota: 'corpus · l’elenco dei centri, oggi su main (#8)',
      occhiello: 'Dove si allena',
      titolo: 'Centri tecnici',
      sommario:
        'Dove si allena, quando, e con chi. Ogni voce porta i suoi orari: non c’è niente da aprire per sapere se un centro fa al caso tuo.',
      fatti: `${attive.length} centri · ${comuni.length} comuni`,
      sezioni: [
        {
          titolo: 'Tutti i centri',
          righe: attive.slice(0, 6).map((s) => `${comune(s)} — ${turni(s).length} turni`),
        },
      ],
    },
    {
      chiave: 'corso',
      nota: 'corpus · la pagina di un corso, oggi su main (#18)',
      occhiello: 'Percorso',
      titolo: corso?.nome ?? 'Krav Maga',
      sommario: corso?.sommario ?? '',
      azione: 'Chiedi informazioni',
      sezioni: [
        { titolo: 'Fa per te se', righe: voci(corso?.adattoA) },
        { titolo: 'Cosa si impara', righe: voci(corso?.focus) },
      ],
      spalla: [
        { chiave: 'A chi', valore: voci(corso?.adattoA)[0] ?? 'Adulti' },
        { chiave: 'Durata', valore: corso?.durata || 'non dichiarata' },
        { chiave: 'Dove', valore: `${attive.length} centri` },
      ],
    },
    {
      chiave: 'privacy',
      nota: 'non esiste · sole parole, nessun dato proprio',
      occhiello: 'Informativa',
      titolo: 'Privacy',
      sommario:
        'Come AKM Italia tratta i dati che ricevi quando mandi una richiesta di contatto, e per quanto tempo li tiene.',
      sezioni: [
        {
          titolo: 'Quali dati raccogliamo',
          righe: [
            'Cognome, nome, email e telefono, che scrivi tu nel modulo di richiesta.',
            'La sede e il percorso che hai indicato, per instradare la richiesta al responsabile giusto.',
            'Il momento in cui hai dato il consenso, registrato dal server.',
          ],
        },
        {
          titolo: 'Per quanto tempo',
          righe: ['Fino a che la richiesta non è chiusa, e comunque non oltre ventiquattro mesi.'],
        },
      ],
    },
    {
      chiave: 'istruttori',
      nota: 'non esiste · dato magro, undici nomi su tredici senza cognome (#17)',
      occhiello: 'Albo',
      titolo: 'Istruttori',
      sommario:
        'Chi insegna nei centri tecnici AKM Italia, con la qualifica e il centro in cui è in cattedra.',
      fatti: `${istruttori.totalDocs} istruttori`,
      sezioni: [{ titolo: 'In cattedra', righe: nomi }],
    },
  ]

  return (
    <div className="prototipo">
      <div className="prototipo-testata">
        <p>
          <strong>Prototipo #28 — l’anatomia di una pagina.</strong> Tre vocabolari a confronto
          sugli stessi cinque provini: tre dal corpus su <code>main</code>, due dalle pagine che non
          esistono ancora. Frecce ← → per cambiare variante.
        </p>
      </div>

      {chiave === 'a' ? <VarianteA provini={provini} /> : null}
      {chiave === 'b' ? <VarianteB provini={provini} /> : null}
      {chiave === 'c' ? <VarianteC provini={provini} peso={(p) => PESO[p.chiave]} /> : null}

      <Switcher varianti={VARIANTI} corrente={chiave} />
    </div>
  )
}
