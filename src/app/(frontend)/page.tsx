import Link from 'next/link'
import React from 'react'

import { openPayload } from '@/components/payload'
import { disciplineId, ordinal, provinceName, published, forkTexts } from '@/components/data'
import {
  DAY_NAMES,
  buildWeek,
  lessonsLabel,
  placeName,
  todayKey,
  type Lesson,
} from '@/components/board/week'

/**
 * Home, direzione B «La bacheca della sala» (prototipo, mappa #62, ticket #66).
 *
 * Il foglio dell'orario appeso all'ingresso della palestra, fatto bene: chi
 * arriva deve pensare «il giovedi' sera a Binasco c'e' una lezione, alle 20:30,
 * la tiene Vittorio Porreca» prima di pensare «Krav Maga». L'ordine della pagina
 * lo da' la settimana, lunedi'-sabato, e la settimana si calcola dagli orari dei
 * centri attivi: nessuna lezione e' scritta a mano.
 *
 * Chiaro per prima cosa. Il nero pieno sta in tre posti soli: la barra, il blocco
 * della prima lezione e il piede. Anton solo per i numeri e le sigle dei giorni;
 * i titoli sono Roboto in maiuscolo e minuscolo normale.
 *
 * Nessuna fotografia: le foto di partenza di Impostazioni sono generate e questa
 * direzione non ne ha bisogno. La pagina regge senza.
 */

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

const DEFAULT_QUALIFICATIONS =
  'I docenti sono istruttori qualificati, tesserati e assicurati CSEN: nome, qualifica e grado di ognuno stanno nell’albo. Le qualifiche AKM sono riconosciute da CSEN-CONI, F.E.K.D.A. e P.T.D.'

/* La qualifica e' un enum: sulla bacheca si scrive in minuscolo, sotto il nome. */
const QUALIFICATIONS: Record<string, string> = {
  istruttore: 'Istruttore',
  trainer: 'Trainer',
  maestro: 'Maestro',
  'direttore-tecnico': 'Direttore tecnico',
  presidente: 'Presidente',
}

function LessonCell({ lesson }: { lesson: Lesson }) {
  return (
    <li className="board-lesson">
      <p className="board-lesson__time">
        <span className="board-lesson__start">{lesson.start}</span>
        <span className="board-lesson__end">
          fino alle{' '}
          {lesson.end}
        </span>
      </p>
      <div className="board-lesson__body">
        <h4 className="board-lesson__place">
          <Link href={`/centri/${lesson.centerSlug}`}>{lesson.place}</Link>
        </h4>
        {lesson.gym ? <p className="board-lesson__gym">{lesson.gym}</p> : null}
        <p className="board-lesson__course">
          {lesson.course?.name}
          {lesson.note ? <span className="board-lesson__note">{lesson.note}</span> : null}
        </p>
        {lesson.teachers.length > 0 ? (
          <p className="board-lesson__teacher">con {lesson.teachers.join(', ')}</p>
        ) : null}
      </div>
    </li>
  )
}

export default async function Home() {
  const payload = await openPayload()

  const [settings, courses, centersFound, instructorsFound] = await Promise.all([
    payload.findGlobal({ slug: 'impostazioni', depth: 0 }),
    payload.find({
      collection: 'corsi',
      depth: 0,
      limit: 20,
      sort: 'ordine',
      where: { and: [{ inBivio: { equals: true } }, published] },
    }),
    payload.find({
      collection: 'sedi',
      depth: 1,
      limit: 200,
      sort: 'indirizzo.citta',
      /* Niente `select` qui: con `select` i docenti di ogni riga d'orario (una
         relazione hasMany dentro un array) tornano vuoti. */
      where: { and: [{ attivo: { equals: true } }, published] },
    }),
    payload.find({
      collection: 'istruttori',
      depth: 0,
      limit: 100,
      sort: 'ordine',
      select: { nome: true, ruolo: true, qualifica: true, slug: true },
      where: published,
    }),
  ])

  const pathways = courses.docs
  const centers = centersFound.docs
  const names = new Map(instructorsFound.docs.map((i) => [i.id, i.nome]))
  const week = buildWeek(centers, names)
  const lessons = week.flatMap((d) => d.lessons)
  const today = todayKey()

  /* Quali centri tengono un corso: la prova che un percorso non e' un'astrazione. */
  const centersByCourse = new Map<number, string[]>()
  for (const center of centers) {
    const ids = new Set(
      (center.orari ?? [])
        .map((o) => disciplineId(o.disciplina))
        .filter((id): id is number => id !== null),
    )
    for (const id of ids) {
      centersByCourse.set(id, [...(centersByCourse.get(id) ?? []), placeName(center)])
    }
  }

  /* Chi insegna, contato sulla bacheca: quante lezioni a settimana e dove. Chi
     non ha lezioni in calendario non entra qui (resta nell'albo): qui si legge
     chi trovi in sala questa settimana. */
  const teaching = instructorsFound.docs
    .map((person) => {
      const own = lessons.filter((l) => l.teachers.includes(person.nome))
      return { person, lessons: own.length, places: [...new Set(own.map((l) => l.place))] }
    })
    .filter((t) => t.lessons > 0)
    .sort((a, b) => b.lessons - a.lessons || a.person.nome.localeCompare(b.person.nome, 'it'))

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

  const texts = settings?.eroe
  const eyebrow = texts?.occhiello || 'Krav Maga · Milano, Monza e Brianza, Lodi, Varese'
  const title = texts?.titolo || 'Difendersi si impara'
  const row =
    texts?.testo ||
    `${centers.length > 0 ? `${centers.length} centri tecnici attivi, lezioni` : 'Lezioni'} settimanali tutto l’anno, istruttori con nome e cognome.`
  const primaryHref = texts?.ctaPrimariaHref || '#percorsi'
  const primary = {
    testo: texts?.ctaPrimariaEtichetta || 'Scegli il tuo percorso',
    href: primaryHref.startsWith('#') && pathways.length === 0 ? '/corsi' : primaryHref,
  }
  const secondary = {
    testo: texts?.ctaSecondariaEtichetta || 'Trova un centro',
    href: texts?.ctaSecondariaHref || '/centri',
  }
  const centersWord = centers.length === 1 ? 'centro' : 'centri'

  return (
    <>
      {/* ---------- testata: il titolo del foglio e l'indice dei giorni ---------- */}
      <section className="board board--white board-head" aria-labelledby="board-title">
        <div className="container board-head__grid">
          <div className="board-head__intro">
            <p className="board-eyebrow">{eyebrow}</p>
            <h1 className="board-title board-title--page" id="board-title">
              {title}
            </h1>
            <p className="board-lead">{row}</p>
            {/* Due inviti secondari, come oggi: nella prima schermata il rosso
                resta uno, la CTA in barra (docs/adr/0005, audit voce 24). */}
            <p className="board-actions">
              {primary.href.startsWith('#') ? (
                <a className="button button--secondary" href={primary.href}>
                  {primary.testo}
                </a>
              ) : (
                <Link className="button button--secondary" href={primary.href}>
                  {primary.testo}
                </Link>
              )}
              <Link className="board-link" href={secondary.href}>
                {secondary.testo}
              </Link>
            </p>
          </div>

          {lessons.length > 0 ? (
            <nav className="board-index" aria-labelledby="board-index-label">
              <p className="board-index__label" id="board-index-label">
                La settimana, in {centers.length} {centersWord}
              </p>
              <ol className="board-index__days">
                {week.map((day) => (
                  <li key={day.key}>
                    <a className="board-index__day" href={`#giorno-${day.key}`}>
                      <span className="board-index__short" aria-hidden="true">
                        {DAY_NAMES[day.key].short}
                      </span>
                      <span className="board-sr">{DAY_NAMES[day.key].long}: </span>
                      <span className="board-index__count">
                        {day.lessons.length > 0
                          ? `${day.lessons.length} ${lessonsLabel(day.lessons.length)}`
                          : 'nessuna lezione'}
                      </span>
                      {day.key === today ? <span className="board-today">Oggi</span> : null}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
        </div>
      </section>

      {/* ---------- la settimana: il cuore della bacheca ---------- */}
      {lessons.length > 0 ? (
        <section className="board board--grey board-week" id="settimana" aria-labelledby="week-title">
          <div className="container">
            <header className="board-section-head">
              <h2 className="board-title" id="week-title">
                La settimana
              </h2>
              <p className="board-section-head__aside">
                {lessons.length} {lessonsLabel(lessons.length)} in {centers.length} {centersWord}, in
                ordine di giorno e di ora. Il nome del centro porta a indirizzo, orari e richiesta.
              </p>
            </header>

            <ol className="board-days">
              {week.map((day) => (
                <li
                  className={`board-day${day.key === today ? ' board-day--today' : ''}`}
                  key={day.key}
                  id={`giorno-${day.key}`}
                >
                  <div className="board-day__head">
                    <h3 className="board-day__title">
                      <span className="board-day__short" aria-hidden="true">
                        {DAY_NAMES[day.key].short}
                      </span>
                      <span className="board-day__long">{DAY_NAMES[day.key].long}</span>
                    </h3>
                    <p className="board-day__count">
                      {day.lessons.length > 0
                        ? `${day.lessons.length} ${lessonsLabel(day.lessons.length)}`
                        : 'Nessuna lezione'}
                    </p>
                    {day.key === today ? <p className="board-today">Oggi</p> : null}
                  </div>
                  {day.lessons.length > 0 ? (
                    <ol className="board-day__lessons">
                      {day.lessons.map((lesson) => (
                        <LessonCell lesson={lesson} key={lesson.key} />
                      ))}
                    </ol>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ---------- il bivio, come righe di un programma di stagione ---------- */}
      {pathways.length > 0 ? (
        <section className="board board--white" id="percorsi" aria-labelledby="paths-title">
          <div className="container">
            <header className="board-section-head">
              <h2 className="board-title" id="paths-title">
                {fork.titolo}
              </h2>
              <p className="board-section-head__aside">
                {fork.testo}{' '}
                <Link className="board-link board-link--inline" href="/corsi">
                  Tutti i percorsi
                </Link>
              </p>
            </header>

            <ol className="board-paths">
              {pathways.map((course, i) => {
                const where = centersByCourse.get(course.id) ?? []
                const everywhere = where.length > 1 && where.length === centers.length
                return (
                  <li className="board-path" key={course.id}>
                    <span className="board-path__index" aria-hidden="true">
                      {ordinal(i + 1)}
                    </span>
                    <div className="board-path__question">
                      <h3 className="board-path__title">
                        <Link href={`/corsi/${course.slug}`}>{course.domanda || course.nome}</Link>
                      </h3>
                      <p className="board-path__name">{course.nome}</p>
                    </div>
                    <p className="board-path__summary">{course.sommario}</p>
                    <div className="board-path__where">
                      {where.length > 0 ? (
                        <>
                          <p className="board-path__count">
                            <span className="board-path__number">{where.length}</span>
                            <span>
                              {everywhere
                                ? 'centri, cioè tutti'
                                : where.length === 1
                                  ? 'centro'
                                  : 'centri'}
                            </span>
                          </p>
                          {!everywhere ? (
                            <p className="board-path__places">{where.join(', ')}</p>
                          ) : null}
                        </>
                      ) : (
                        /* Un percorso senza centro attivo non stampa «0»: dice
                           com'e' e lascia comunque la porta aperta. */
                        <p className="board-path__places">
                          In questa stagione non ha un centro in calendario.{' '}
                          <Link
                            className="board-link board-link--inline"
                            href={`/contatti?corso=${encodeURIComponent(course.slug ?? '')}`}
                          >
                            Lascia comunque una richiesta
                          </Link>
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ---------- il blocco nero: la prima lezione ---------- */}
      <section className="board board--black" id="prima-volta" aria-labelledby="first-title">
        <div className="container">
          <header className="board-section-head">
            <h2 className="board-title" id="first-title">
              La prima lezione
            </h2>
            <p className="board-section-head__aside">
              La palestra intimidisce più del Krav Maga. Ecco cosa aspettarsi la prima sera, così non
              devi chiederlo.
            </p>
          </header>
          <ol className="board-first">
            {firstTime.map((point, i) => (
              <li className="board-first__point" key={point.titolo}>
                <span className="board-first__index" aria-hidden="true">
                  {ordinal(i + 1)}
                </span>
                <h3 className="board-first__title">{point.titolo}</h3>
                <p className="board-first__text">{point.testo}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- chi insegna, contato sulla bacheca ---------- */}
      <section className="board board--white" aria-labelledby="teachers-title">
        <div className="container">
          <header className="board-section-head">
            <h2 className="board-title" id="teachers-title">
              Chi tiene le lezioni
            </h2>
            <p className="board-section-head__aside">
              {qualifications}{' '}
              <Link className="board-link board-link--inline" href="/istruttori">
                L’albo degli istruttori
              </Link>
            </p>
          </header>

          {teaching.length > 0 ? (
            <ol className="board-teachers">
              {teaching.map(({ person, lessons: n, places }) => {
                const qualification =
                  person.ruolo || (person.qualifica ? QUALIFICATIONS[person.qualifica] : '')
                return (
                  <li className="board-teacher" key={person.id}>
                    <p className="board-teacher__count">
                      <span className="board-teacher__number">{n}</span>
                      <span className="board-teacher__unit">
                        {lessonsLabel(n)} a settimana
                      </span>
                    </p>
                    <h3 className="board-teacher__name">{person.nome}</h3>
                    {qualification ? <p className="board-teacher__role">{qualification}</p> : null}
                    <p className="board-teacher__places">{places.join(', ')}</p>
                  </li>
                )
              })}
            </ol>
          ) : null}

          {provinces.size > 0 ? (
            <p className="board-provinces">
              Province: {[...provinces].map(provinceName).sort().join(', ')}.
            </p>
          ) : null}
        </div>
      </section>

      {/* ---------- la chiusura: un bottone rosso, uno solo ---------- */}
      <section className="board board--grey board-step" aria-labelledby="step-title">
        <div className="container board-step__grid">
          <h2 className="board-title board-title--page" id="step-title">
            {step.titolo}
          </h2>
          <div>
            <p className="board-lead">{step.testo}</p>
            <p className="board-actions">
              <Link className="button button--primary" href="/contatti">
                {step.bottone}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
