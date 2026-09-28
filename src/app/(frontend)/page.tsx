import Link from 'next/link'
import React from 'react'

import { openPayload } from '@/components/payload'
import {
  disciplineId,
  eventPlace,
  forkTexts,
  provinceName,
  published,
  typeLabel,
} from '@/components/data'
import { readableSlot, shortDate } from '@/components/calendar'
import { CenterNetwork, Stops } from '@/components/CenterNetwork'
import { splitName, toSignCenter } from '@/components/signage'

/**
 * Home, prototipo C «La segnaletica» (#66): orienta prima di convertire, con
 * due domande in fila. Prima «dove sei?» (lo schema della rete e i cartelli
 * dei centri), poi «qual è il tuo momento?» (i tre percorsi come cartelli di
 * direzione), poi i prossimi appuntamenti, la prima lezione e le prove.
 * Nessuna richiesta di contatto prima che le due domande abbiano risposta.
 *
 * Il copy editoriale (eroe, prima lezione, qualifiche) sta nel global
 * Impostazioni. Le costanti qui sotto sono il ripiego: un campo svuotato
 * dall'admin non lascia un buco in home.
 */

/* La home e' generata staticamente e ricontrollata ogni minuto: le sedi cambiano di
   stagione, non di secondo, e cosi' una modifica dall'admin si vede senza un rebuild. */
export const revalidate = 60

const DEFAULT_FIRST_TIME = [
  {
    titolo: 'Non serve essere allenati',
    testo:
      'Si comincia dal proprio passo. La prima lezione non è un test e nessuno ti mette a confronto con chi pratica da anni: si impara a muoversi, a tenere la distanza, a reagire.',
  },
  {
    titolo: 'Cosa portare',
    testo:
      'Pantaloni o pantaloncini comodi, una maglietta, scarpe da interno pulite e una bottiglia d’acqua. Guanti e protezioni servono più avanti, non alla prima lezione.',
  },
  {
    titolo: 'Quando si entra',
    testo:
      'Le lezioni sono settimanali e si tengono tutto l’anno. Non c’è un corso da aspettare a settembre: si entra durante la stagione, nel centro che ti resta comodo.',
  },
  {
    titolo: 'Con chi parli',
    testo:
      'Il referente è l’istruttore che tiene la lezione in quel centro. La richiesta che mandi arriva a lui, non a un centralino.',
  },
]

/* Niente numeri senza fonte: «almeno quattro anni di percorso e un esame di
   abilitazione» era un fatto presentato come tale e non ha riscontro in `data/`,
   in `docs/` ne' in PRODUCT.md, che nomina solo gli enti. Resta quello che il
   sito puo' dimostrare: il tesseramento e i riconoscimenti, e le qualifiche di
   ogni persona, che stanno scritte nell'albo una per una. Quando il cliente
   conferma il percorso di diploma, la frase torna con il suo numero. */
const DEFAULT_QUALIFICATIONS =
  'I docenti sono istruttori qualificati, tesserati e assicurati CSEN: nome, qualifica e grado di ognuno stanno nell’albo. Le qualifiche AKM sono riconosciute da CSEN-CONI, F.E.K.D.A. e P.T.D.'

export default async function Home() {
  const payload = await openPayload()

  const now = new Date().toISOString()
  const [settings, courses, centersFound, instructors, allCourses, events] = await Promise.all([
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
    payload.find({
      collection: 'corsi',
      depth: 0,
      limit: 20,
      sort: 'ordine',
      where: { and: [{ inBivio: { equals: true } }, published] },
    }),
    payload.find({
      collection: 'sedi',
      depth: 0,
      limit: 200,
      sort: 'indirizzo.citta',
      select: {
        nome: true,
        slug: true,
        palestra: true,
        indirizzo: true,
        orari: true,
        coordinate: true,
        descrizione: true,
      },
      where: { and: [{ attivo: { equals: true } }, published] },
    }),
    payload.count({ collection: 'istruttori', where: published }),
    // I nomi di tutti i corsi, non solo dei percorsi: servono alle righe d'orario dei cartelli.
    payload.find({
      collection: 'corsi',
      depth: 0,
      limit: 50,
      select: { nome: true },
      where: published,
    }),
    payload.find({
      collection: 'eventi',
      depth: 1,
      limit: 5,
      sort: 'dataInizio',
      where: { and: [published, { dataInizio: { greater_than_equal: now } }] },
    }),
  ])

  const pathways = courses.docs
  const centers = centersFound.docs

  const courseNames = new Map(allCourses.docs.map((c) => [c.id, c.nome]))
  const signs = centers
    .map((c) => toSignCenter(c, courseNames))
    .sort((x, y) => x.sign.localeCompare(y.sign, 'it'))
  const upcoming = events.docs

  // I comuni che tengono un dato corso: le fermate del cartello di direzione.
  const townsByCourse = new Map<number, string[]>()
  for (const sign of signs) {
    const center = centers.find((c) => c.id === sign.id)
    const courseIds = new Set(
      (center?.orari ?? [])
        .map((o) => disciplineId(o.disciplina))
        .filter((id): id is number => id !== null),
    )
    for (const id of courseIds) townsByCourse.set(id, [...(townsByCourse.get(id) ?? []), sign.sign])
  }

  const provinces = new Set(
    centers.map((c) => c.indirizzo?.provincia).filter((p): p is string => Boolean(p)),
  )

  const firstTime = settings?.home?.primaVolta?.length
    ? settings.home.primaVolta
    : DEFAULT_FIRST_TIME
  const qualifications = settings?.home?.testoQualifiche || DEFAULT_QUALIFICATIONS
  const fork = forkTexts(settings)
  const step = {
    titolo: settings?.home?.passoTitolo || 'Prossimo passo',
    testo:
      settings?.home?.passoTesto ||
      'Vuoi capire se AKM fa per te? Scrivici: ti orientiamo sul corso e sulla sede più adatti al tuo obiettivo.',
    bottone: settings?.home?.passoBottone || 'Richiedi informazioni',
  }

  /* Il copy dell'eroe sta in Impostazioni > eroe, con i valori di serie come
     ripiego: un campo svuotato dall'admin non lascia un buco in home. */
  const texts = settings?.eroe
  const eyebrow = texts?.occhiello || 'Krav Maga · Milano, Monza e Brianza, Lodi, Varese'
  const title = texts?.titolo || 'Difendersi si impara'
  // Sotto le 20 parole: la coda «prima scegli il percorso, poi la sede»
  // ripeteva a parole quello che i due bottoni qui sotto gia' fanno.
  const row =
    texts?.testo ||
    `${centers.length > 0 ? `${centers.length} centri tecnici attivi, lezioni` : 'Lezioni'} settimanali tutto l’anno, istruttori con nome e cognome.`
  /* I due inviti dell'eroe (Impostazioni > eroe > cta*) non si usano in
     questa direzione: l'eroe e' gia' la risposta a «trova un centro», e il
     bivio e' la sezione subito sotto. Restano nel global e nel NOTE.md. */

  return (
    <>
      {/* Prototipo C, «La segnaletica» (#66): l'eroe e' la rete dei centri.
          Niente foto in cima: la prima cosa che la home mostra e' dove si
          pratica, e la prima domanda che fa e' «dove sei?». La foto e il video
          dell'eroe restano nel global e tornano se la direzione non passa. */}
      <section className="section section--black signal" id="top" aria-labelledby="hero-title">
        <CenterNetwork centers={signs}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display display--lg signal__title" id="hero-title">
            {title}
          </h1>
          <p className="text">{row}</p>
        </CenterNetwork>
      </section>

      {pathways.length > 0 ? (
        <section className="section section--grey" id="percorsi" aria-labelledby="paths-title">
          <div className="container">
            <div className="where__question where__question--section">
              <span className="where__index" aria-hidden="true">
                2
              </span>
              <h2 className="display display--md" id="paths-title">
                {fork.titolo}
              </h2>
            </div>
            <p className="text directions__lead">{fork.testo}</p>

            {/* Tre cartelli di direzione: la domanda in prima persona e dove
                porta. I comuni che tengono il percorso sono le fermate; un
                percorso senza centri non stampa «0», lo dice e lascia la porta
                aperta alla richiesta. */}
            <ol className="directions">
              {pathways.map((course) => {
                const towns = townsByCourse.get(course.id) ?? []
                return (
                  <li key={course.id} className="direction">
                    <Link className="direction__head" href={`/corsi/${course.slug}`}>
                      <span className="direction__names">
                        <span className="display display--md">{course.domanda || course.nome}</span>
                        <span className="direction__name">{course.nome}</span>
                      </span>
                      <span className="arrow" aria-hidden="true" />
                    </Link>
                    <div className="direction__body">
                      {course.sommario ? <p className="text">{course.sommario}</p> : null}
                      {towns.length > 0 && towns.length === centers.length ? (
                        // In tutti i centri: l'elenco delle fermate sarebbe
                        // la rete intera, che sta gia' qui sopra.
                        <p className="stops__label">In tutti i {centers.length} centri</p>
                      ) : towns.length > 0 ? (
                        <Stops
                          zones={towns}
                          label={`In ${towns.length} ${towns.length === 1 ? 'centro' : 'centri'}`}
                        />
                      ) : (
                        <p className="direction__none">
                          In questa stagione non ha un centro attivo. Puoi lasciare comunque la
                          richiesta:{' '}
                          <Link href={`/contatti?corso=${encodeURIComponent(course.slug)}`}>
                            scrivici per questo percorso
                          </Link>
                          .
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
            <p>
              <Link className="breadcrumb" href="/corsi">
                Tutti i percorsi
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      {upcoming.length > 0 ? (
        <section className="section section--black" aria-labelledby="next-title">
          <div className="container">
            <h2 className="display display--md" id="next-title">
              Prossimi appuntamenti
            </h2>
            {/* Il tabellone delle partenze: data e ora grandi, il posto scritto
                per esteso, il tipo in parole (CONTEXT.md, «Evento»). */}
            <ol className="departures">
              {upcoming.map((event) => {
                const center = typeof event.sede === 'object' && event.sede ? event.sede : null
                const place = center ? splitName(center.nome).sign : eventPlace(event)
                return (
                  <li key={event.id}>
                    <Link className="departure" href={`/eventi/${event.slug}`}>
                      <time className="departure__date" dateTime={event.dataInizio}>
                        {shortDate(event.dataInizio)}
                      </time>
                      <span className="departure__time">
                        {readableSlot(event.dataInizio, event.dataFine)}
                      </span>
                      <span className="departure__place">{place}</span>
                      <span className="departure__type">{typeLabel(event.tipo)}</span>
                    </Link>
                  </li>
                )
              })}
            </ol>
            <p>
              <Link className="breadcrumb" href="/eventi">
                Tutto il calendario
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      <section className="section section--charcoal" id="prima-volta" aria-labelledby="first-title">
        <div className="container first">
          <div>
            <h2 className="display display--md" id="first-title">
              Cosa succede quando entri
            </h2>
            <p className="text first__lead">
              La palestra intimidisce più del Krav Maga. Ecco cosa aspettarsi la prima sera, così
              non devi chiederlo.
            </p>
          </div>

          <div className="first__points">
            {firstTime.map((point) => (
              <div key={point.titolo} className="reveal first__point">
                <h3>{point.titolo}</h3>
                <p className="text">{point.testo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--black" aria-labelledby="trials-title">
        <div className="container trials">
          <div>
            <h2 className="display display--md" id="trials-title">
              Le qualifiche si contano
            </h2>
            <p className="text first__lead">{qualifications}</p>
          </div>

          {/* Un numero a zero non e' una prova: la riga sparisce invece di dichiarare il vuoto. */}
          <dl className="trials__numbers">
            {centers.length > 0 ? (
              <div className="trial">
                <dt className="trial__value">{centers.length}</dt>
                <dd className="trial__item">centri tecnici attivi in questa stagione</dd>
              </div>
            ) : null}
            {instructors.totalDocs > 0 ? (
              <div className="trial">
                <dt className="trial__value">{instructors.totalDocs}</dt>
                <dd className="trial__item">istruttori e maestri con nome, cognome e qualifica</dd>
              </div>
            ) : null}
            {provinces.size > 0 ? (
              <div className="trial">
                <dt className="trial__value">{provinces.size}</dt>
                <dd className="trial__item">
                  province coperte: {[...provinces].map(provinceName).sort().join(', ')}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      {/* La chiusura: la home orienta prima di convertire, e questa e' l'unica
          richiesta di contatto dopo il bivio. Chiara prima del footer carbone:
          uno stacco di valore, non di tinta. Un bottone solo, con l'etichetta
          della barra: un intento, una parola. */}
      <section className="section section--light" aria-labelledby="step-title">
        <div className="container">
          {/* A 390px le tre sezioni finali collassavano sulla stessa composizione:
              display-md, paragrafo, elenco o bottone a sinistra, e cambiava solo
              il fondo. Le prime due hanno una forma propria - i punti con i
              filetti, i numerali in Anton - questa no: la chiusura si prende il
              filetto e il corpo grande, cosi' il ritmo torna a farsi anche con
              la scala e non con il solo fondo (RHYTHM 2). */}
          <span className="rule" aria-hidden="true" />
          <h2 className="display display--lg step__title" id="step-title">
            {step.titolo}
          </h2>
          <p className="text first__lead">{step.testo}</p>
          <p className="tail-action">
            <Link className="button button--primary" href="/contatti">
              {step.bottone}
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
