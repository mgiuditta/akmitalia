import Link from 'next/link'
import React from 'react'

import { openPayload } from '@/components/payload'
import { published, forkTexts } from '@/components/data'
import { TIME_ZONE } from '@/components/calendar'
import {
  DAY_NAMES,
  centersForCourse,
  dateInDays,
  eveningsOf,
  nextEvening,
  placeName,
  referenceZones,
  romeNow,
  teacherRounds,
  type CenterLike,
  type Lesson,
} from '@/components/evenings'
import { ZoneFinder, type Zone } from '@/components/ZoneFinder'

/**
 * Home, prototipo D: «Ospiti di sera» (docs/prototipi/registro-d/NOTE.md).
 *
 * AKM non ha una palestra sua: e' ospite, quasi sempre una sera a settimana, di
 * sale che di giorno fanno altro. La home si apre sulla prossima sera con
 * lezione, calcolata dagli orari veri; poi chiede «dove abiti?» con le zone di
 * riferimento dei centri; poi le persone che portano la serata in piu' sale, le
 * presentazioni di inizio stagione, il bivio per chi domanda, la prima volta.
 *
 * Il copy editoriale resta in Impostazioni (eroe, bivio, primaVolta,
 * testoQualifiche, passo*), con le costanti di ripiego di sempre.
 */

/* Ogni minuto: «stasera» deve voltare pagina quando l'ultima lezione finisce. */
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

const eventDate = (iso: string) => {
  const d = new Date(iso)
  const f = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('it-IT', { timeZone: TIME_ZONE, ...o }).format(d)
  return {
    day: f({ day: 'numeric' }),
    month: f({ month: 'short' }).replace('.', ''),
    weekday: f({ weekday: 'long' }),
    time: f({ hour: '2-digit', minute: '2-digit' }),
  }
}

/** Le lezioni della stessa sera nella stessa sala stanno in una riga sola. */
function sameEvening(lessons: Lesson[]) {
  const groups: { day: Lesson['day']; centerId: number; slug: string; town: string; lessons: Lesson[] }[] = []
  for (const l of lessons) {
    const g = groups.find((x) => x.day === l.day && x.centerId === l.centerId)
    if (g) g.lessons.push(l)
    else groups.push({ day: l.day, centerId: l.centerId, slug: l.slug, town: l.town, lessons: [l] })
  }
  return groups
}

/** «Luca, Marco e Paolo». */
const list = (items: string[]) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} e ${items.at(-1)}`

export default async function Home() {
  const payload = await openPayload()
  const nowIso = new Date().toISOString()

  const [settings, courses, centersFound, events] = await Promise.all([
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
      depth: 1,
      limit: 200,
      sort: 'indirizzo.citta',
      where: { and: [{ attivo: { equals: true } }, published] },
    }),
    payload.find({
      collection: 'eventi',
      depth: 1,
      limit: 6,
      sort: 'dataInizio',
      where: {
        and: [
          published,
          { tipo: { equals: 'presentazione' } },
          { dataInizio: { greater_than_equal: nowIso } },
        ],
      },
    }),
  ])

  const pathways = courses.docs
  const centers = centersFound.docs as unknown as (CenterLike & { slug: string })[]
  const today = romeNow()
  const evening = nextEvening(centers, today)

  /* Lo stradario: ogni posto che ha un centro, piu' ogni zona scritta nelle
     schede, ognuno con le sale che lo servono e le loro sere per adulti. */
  const zoneMap = new Map<string, Zone>()
  for (const c of centers) {
    const evenings = [
      ...new Set(
        eveningsOf(c)
          // Nello stradario la sera e' quella degli adulti: i kids hanno la loro riga nel bivio.
          .filter((l) => !/kids/i.test(l.course))
          .map((l) => `${DAY_NAMES[l.day]} ${l.start}`),
      ),
    ]
    const entry = { slug: c.slug, center: c.nome, host: c.palestra ?? null, evenings }
    const names = [placeName(c), c.indirizzo?.citta, ...referenceZones(c.descrizione)].filter(
      (z): z is string => Boolean(z),
    )
    for (const name of new Set(names)) {
      const z = zoneMap.get(name) ?? { zone: name, centers: [] }
      if (!z.centers.some((x) => x.slug === c.slug)) z.centers.push(entry)
      zoneMap.set(name, z)
    }
  }
  const zones = [...zoneMap.values()].sort((a, b) => a.zone.localeCompare(b.zone, 'it'))
  /* Gli esempi sono le zone servite da piu' sale: mostrano subito che la
     risposta puo' essere piu' di una. */
  const examples = [...zones]
    .sort((a, b) => b.centers.length - a.centers.length || a.zone.localeCompare(b.zone, 'it'))
    .slice(0, 3)
    .map((z) => z.zone)

  const rounds = teacherRounds(centers)
  const travelling = rounds.filter((t) => t.centers > 1).sort((a, b) => b.centers - a.centers)
  const others = rounds
    .filter((t) => t.centers === 1)
    .map((t) => t.name)
    .sort((a, b) => a.localeCompare(b, 'it'))

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

  const whenLabel = evening
    ? evening.offset === 0
      ? 'Oggi'
      : evening.offset === 1
        ? 'Domani'
        : DAY_NAMES[evening.day]
    : null
  const rooms = evening ? new Set(evening.lessons.map((l) => l.centerId)).size : 0

  return (
    <>
      {/* 1. La prossima sera. La foto generata dell'eroe non si mostra: in primo
          piano c'e' il dato, non un'immagine (brief del prototipo). */}
      <section className="section section--black ev-hero" id="top" aria-labelledby="ev-title">
        <div className="container ev-hero__grid">
          <div className="ev-hero__intro">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="display ev-hero__title" id="ev-title">
              {title}
            </h1>
            <p className="text">{row}</p>
            <p className="ev-hero__links">
              <a className="button button--secondary" href="#dove">
                Dove abiti?
              </a>
              <Link className="button button--secondary" href="/centri">
                Tutti i centri
              </Link>
            </p>
          </div>

          {evening ? (
            <div className="ev-board">
              <p className="ev-board__when">
                <span className="status">{whenLabel}</span>
                <span className="ev-board__date">{dateInDays(evening.offset, today.now)}</span>
              </p>
              <h2 className="display ev-board__title">
                {rooms === 1 ? 'Si pratica in una sala' : `Si pratica in ${rooms} sale`}
              </h2>
              <ol className="ev-board__list">
                {evening.lessons.map((l) => (
                  <li key={`${l.centerId}-${l.start}`}>
                    <Link className="ev-board__row" href={`/centri/${l.slug}`}>
                      <span className="ev-board__time">{l.start}</span>
                      <span className="ev-board__where">
                        <span className="ev-board__town">{l.town}</span>
                        {l.host ? <span className="ev-board__host">da {l.host}</span> : null}
                      </span>
                      <span className="ev-board__who">
                        {l.course}
                        {l.note ? `, ${l.note.toLowerCase()}` : ''}
                        {l.teachers ? (
                          <>
                            <br />
                            con {l.teachers}
                          </>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      </section>

      {/* 2. Dove abiti: le zone di riferimento come stradario. */}
      {zones.length > 0 ? (
        <section className="section section--light ev-where" id="dove" aria-labelledby="dove-title">
          <div className="container ev-where__grid">
            <div>
              <span className="rule" aria-hidden="true" />
              <h2 className="display display--md" id="dove-title">
                Dove abiti?
              </h2>
              <p className="text">
                AKM non ha una palestra sua: in ogni comune è ospite di una sala, una scuola di
                danza, un istituto, un club, quasi sempre una sera a settimana. Ogni centro serve
                anche i quartieri e i comuni vicini. Scrivi il tuo.
              </p>
            </div>
            <div>
              <ZoneFinder zones={zones} examples={examples} />
              <details className="ev-index">
                <summary className="ev-index__summary">
                  Tutte le {zones.length} zone, dalla A alla Z
                </summary>
                <ul className="ev-index__list">
                  {zones.map((z) => (
                    <li key={z.zone} className="ev-index__item">
                      <span className="ev-index__zone">{z.zone}</span>
                      <span className="ev-index__to">
                        {z.centers.map((c, i) => (
                          <React.Fragment key={c.slug}>
                            {i > 0 ? ', ' : ''}
                            <Link href={`/centri/${c.slug}`}>{c.center.split(' - ')[0]}</Link>
                          </React.Fragment>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. Chi porta la serata: i docenti che tengono piu' di una sala. */}
      {travelling.length > 0 ? (
        <section className="section section--charcoal ev-people" aria-labelledby="people-title">
          <div className="container">
            <div className="ev-people__head">
              <h2 className="display display--md" id="people-title">
                Chi porta la serata
              </h2>
              <p className="text">{qualifications}</p>
            </div>
            <div className="ev-people__grid">
              {travelling.map((t) => (
                <article className="ev-person" key={t.id}>
                  <h3 className="display display--sm">{t.name}</h3>
                  <p className="detail ev-person__role">
                    {t.role ? `${t.role}. ` : ''}
                    Tiene {t.centers} sale, in {new Set(t.lessons.map((l) => l.day)).size} sere della settimana.
                  </p>
                  <ol className="ev-person__week">
                    {sameEvening(t.lessons).map((g) => (
                      <li key={`${g.centerId}-${g.day}`} className="ev-person__row">
                        <span className="ev-person__day">{DAY_NAMES[g.day]}</span>
                        <span className="ev-person__where">
                          <Link href={`/centri/${g.slug}`}>{g.town}</Link>
                          {g.lessons.map((l) => (
                            <span className="detail" key={l.start}>
                              {l.start} {l.course}
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
            {others.length > 0 ? (
              <p className="text ev-people__others">
                Nelle altre sale insegnano {list(others)}.{' '}
                <Link href="/istruttori">L’albo, con qualifica e grado di ognuno</Link>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 4. Le presentazioni: le prime sere della stagione. */}
      {events.docs.length > 0 ? (
        <section className="section section--grey ev-open" aria-labelledby="open-title">
          <div className="container">
            <h2 className="display display--md" id="open-title">
              Le prime sere della stagione
            </h2>
            <p className="text">La presentazione è la lezione aperta di inizio stagione.</p>
            <ol className="ev-open__list">
              {events.docs.map((e) => {
                const d = eventDate(e.dataInizio)
                const center = typeof e.sede === 'object' && e.sede ? e.sede : null
                return (
                  <li key={e.id}>
                    <Link className="ev-open__row" href={`/eventi/${e.slug}`}>
                      <span className="ev-open__date">
                        <span className="ev-open__day">{d.day}</span>
                        <span className="ev-open__month">{d.month}</span>
                      </span>
                      <span className="ev-open__what">
                        <span className="ev-open__place">
                          {center?.nome || (e.luogo ?? '').split(',')[0] || e.titolo}
                        </span>
                        <span className="detail">
                          {d.weekday}, ore {d.time}
                          {/antibullismo|bambin/i.test(e.titolo) ? ' · per bambini e ragazzi' : ''}
                        </span>
                      </span>
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

      {/* 5. Il bivio: chi domanda, e dove trova la sua sera. */}
      {pathways.length > 0 ? (
        <section className="section section--light ev-fork" id="percorsi" aria-labelledby="fork-title">
          <div className="container">
            <p className="eyebrow">{fork.occhiello}</p>
            <h2 className="display display--md" id="fork-title">
              {fork.titolo}
            </h2>
            <p className="text">{fork.testo}</p>
            <ol className="ev-fork__list">
              {pathways.map((course) => {
                const where = centersForCourse(centers, course.id)
                return (
                  <li className="ev-fork__row" key={course.id}>
                    <div>
                      <h3 className="ev-fork__question">
                        <Link href={`/corsi/${course.slug}`}>
                          «{course.domanda || course.nome}»
                        </Link>
                      </h3>
                      <p className="ev-fork__name">{course.nome}</p>
                    </div>
                    <div className="ev-fork__where">
                      {where.count === 0 ? (
                        <p className="text detail">
                          In questa stagione non è in calendario in nessun centro. Lascia comunque
                          la richiesta, con il percorso già scelto:{' '}
                          <Link href={`/contatti?corso=${course.slug}`}>scrivici</Link>.
                        </p>
                      ) : where.count === centers.length ? (
                        <p className="status">In tutti i {centers.length} centri</p>
                      ) : (
                        <>
                          <p className="status">
                            In {where.count} {where.count === 1 ? 'centro' : 'centri'}
                          </p>
                          <p className="detail ev-fork__towns">{list(where.towns)}</p>
                        </>
                      )}
                      {course.sommario ? <p className="text detail">{course.sommario}</p> : null}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      ) : null}

      {/* 6. La prima volta. */}
      <section className="section section--black ev-first" aria-labelledby="first-title">
        <div className="container">
          <h2 className="display display--md" id="first-title">
            Cosa succede quando entri
          </h2>
          <ol className="ev-first__list">
            {firstTime.map((point, i) => (
              <li key={point.titolo} className="ev-first__item">
                <span className="ev-first__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="ev-first__title">{point.titolo}</h3>
                <p className="text">{point.testo}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. La chiusura: un bottone solo, con l'etichetta della barra. */}
      <section className="section section--light ev-step" aria-labelledby="step-title">
        <div className="container ev-step__grid">
          <div>
            <span className="rule" aria-hidden="true" />
            <h2 className="display display--md" id="step-title">
              {step.titolo}
            </h2>
          </div>
          <div>
            <p className="text">{step.testo}</p>
            <p className="ev-step__action">
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
