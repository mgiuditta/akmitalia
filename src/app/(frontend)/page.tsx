import Link from 'next/link'
import React from 'react'

import { openPayload } from '@/components/payload'
import { disciplineId, provinceName, published, forkTexts, readableDays } from '@/components/data'
import { Figure } from '@/components/Figure'
import { fullName, joinNames, splitCenterName, upcomingLessons } from '@/components/lessons'

/**
 * Home, direzione A «Fenriz ripulito» (#62, #66). La stessa ossatura di oggi -
 * barra nera, Anton, spigolo vivo, alternanza nero/chiaro - con tre correzioni:
 *
 * 1. ogni sezione ha una composizione sua e nomina un luogo o una persona;
 * 2. il chiaro pesa quanto il nero: il nero resta alla barra, all'apertura e
 *    a un blocco solo, quello di chi insegna;
 * 3. il display compare una volta sola (l'H1, al massimo 96px), e nella prima
 *    schermata c'e' gia' una lezione vera: centro, giorno, ora, docente.
 *
 * Il copy editoriale sta nel global Impostazioni; le costanti qui sotto sono il
 * ripiego per un campo svuotato dall'admin. I dati (lezioni, centri, persone)
 * vengono dalle collection e non si scrivono mai a mano.
 */

/* Un minuto: la prossima lezione cambia durante la sera, e cosi' una modifica
   dall'admin si vede senza un rebuild. */
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

/* Niente numeri senza fonte (audit antislop 001, voce 10): restano il
   tesseramento, i riconoscimenti e le qualifiche scritte nell'albo. */
const DEFAULT_QUALIFICATIONS =
  'I docenti sono istruttori qualificati, tesserati e assicurati CSEN: nome, qualifica e grado di ognuno stanno nell’albo. Le qualifiche AKM sono riconosciute da CSEN-CONI, F.E.K.D.A. e P.T.D.'

/* Le qualifiche che nell'albo aprono l'elenco: chi ha un ruolo e le credenziali
   scritte si presenta con quelle, gli altri docenti con il nome. */
const LEADING = new Set(['presidente', 'direttore-tecnico', 'maestro'])
const DAYS = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom']
const dayIndex = (day?: string | null) => (day ? DAYS.indexOf(day) : DAYS.length)

const QUALIFICATION_LABEL: Record<string, string> = {
  presidente: 'Presidente',
  'direttore-tecnico': 'Direttore tecnico',
  maestro: 'Maestro',
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
    /* depth 1: la riga d'orario porta il corso e i docenti per nome. */
    payload.find({
      collection: 'sedi',
      depth: 1,
      limit: 200,
      sort: 'nome',
      /* Niente `select` qui: con `select` la Local API popola il corso della
         riga d'orario ma lascia i docenti come id, e la prima schermata perdeva
         il nome di chi insegna. */
      where: { and: [{ attivo: { equals: true } }, published] },
    }),
    payload.find({
      collection: 'istruttori',
      depth: 0,
      limit: 100,
      sort: 'ordine',
      select: { nome: true, nomeBreve: true, ruolo: true, qualifica: true, credenziali: true },
      where: published,
    }),
  ])

  const pathways = courses.docs
  const centers = centersFound.docs
  const instructors = instructorsFound.docs
  const lessons = upcomingLessons(centers)
  const next = lessons[0] ?? null
  /* Le due dopo, in altri centri: la prima schermata dice anche che la
     settimana e' piena, senza dirlo a parole. */
  const after = lessons.filter((l) => next && l.centerSlug !== next.centerSlug).slice(0, 2)

  // Per ogni corso, i centri che lo tengono: il bivio li nomina, non li conta soltanto.
  const centersByCourse = new Map<number, { slug: string; place: string }[]>()
  // Per ogni docente, i centri dove insegna.
  const placesByTeacher = new Map<number, Set<string>>()
  for (const center of centers) {
    const { place } = splitCenterName(center)
    const seen = new Set<number>()
    for (const slot of center.orari ?? []) {
      const id = disciplineId(slot.disciplina)
      if (id !== null && !seen.has(id)) {
        seen.add(id)
        centersByCourse.set(id, [...(centersByCourse.get(id) ?? []), { slug: center.slug, place }])
      }
      for (const t of slot.docenti ?? []) {
        const tid = typeof t === 'object' ? t.id : t
        placesByTeacher.set(tid, (placesByTeacher.get(tid) ?? new Set()).add(place))
      }
    }
  }

  const provinces = new Set(
    centers.map((c) => c.indirizzo?.provincia).filter((p): p is string => Boolean(p)),
  )

  const leading = instructors.filter((i) => i.qualifica && LEADING.has(i.qualifica))
  const others = instructors
    .filter((i) => !i.qualifica || !LEADING.has(i.qualifica))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'it'))

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

  /* «Con chi parli», in concreto: tre centri e chi ci insegna. I primi in
     ordine alfabetico, cosi' la riga non cambia a ogni visita. */
  const hosts = centers
    .map((c) => {
      const names = [
        ...new Set((c.orari ?? []).flatMap((o) => (o.docenti ?? []).map(fullName))),
      ].filter((n): n is string => Boolean(n))
      return { slug: c.slug, place: splitCenterName(c).place, names }
    })
    .filter((h) => h.names.length > 0)
    .slice(0, 3)

  /* Il copy dell'eroe sta in Impostazioni > eroe. La fotografia e il video
     dell'eroe non si mostrano: le foto di partenza sono generate (docs/adr/0012)
     e in questa direzione la prima schermata la tiene il dato vero, non
     un'immagine. */
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

  return (
    <>
      {/* ---------- apertura: il nero, il titolo, una lezione vera ---------- */}
      <section className="a-open" id="top" aria-labelledby="open-title">
        <div className="container a-open__grid">
          <div className="a-open__words">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="display a-display" id="open-title">
              {title}
            </h1>
            <p className="text">{row}</p>
            <div className="a-open__links">
              {primary.href.startsWith('#') ? (
                <a className="button button--secondary" href={primary.href}>
                  {primary.testo}
                </a>
              ) : (
                <Link className="button button--secondary" href={primary.href}>
                  {primary.testo}
                </Link>
              )}
              <Link className="button button--secondary" href={secondary.href}>
                {secondary.testo}
              </Link>
            </div>
          </div>

          {/* La lastra chiara dentro il nero: e' il dato, e sta sulla
              superficie del dato. Senza orari a DB non c'e' niente da
              promettere, e la lastra non si stampa. */}
          {next ? (
            <aside className="a-slab" aria-labelledby="next-title">
              <p className="a-slab__label" id="next-title">
                Prossima lezione
              </p>
              <p className="a-slab__when">
                {next.when === 'Oggi' || next.when === 'Domani' ? `${next.when}, ` : ''}
                {next.date}
              </p>
              <p className="a-slab__time">
                {next.start}-{next.end}
              </p>
              <p className="a-slab__place">
                <Link href={`/centri/${next.centerSlug}`}>{next.place}</Link>
                {next.gym ? <span>{next.gym}</span> : null}
              </p>
              <dl className="a-slab__facts">
                {next.teachers.length > 0 ? (
                  <div>
                    <dt>Docente</dt>
                    <dd>{joinNames(next.teachers)}</dd>
                  </div>
                ) : null}
                {next.courseName ? (
                  <div>
                    <dt>Corso</dt>
                    <dd>
                      {next.courseName}
                      {next.note ? ` · ${next.note}` : ''}
                    </dd>
                  </div>
                ) : null}
              </dl>
              {after.length > 0 ? (
                <ul className="a-slab__after" aria-label="Le lezioni dopo">
                  {after.map((l) => (
                    <li key={l.key}>
                      <span className="a-slab__after-time">
                        {l.when} {l.start}
                      </span>
                      <Link href={`/centri/${l.centerSlug}`}>{l.place}</Link>
                      {l.teachers.length > 0 ? <span>{joinNames(l.teachers)}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </aside>
          ) : null}
        </div>
      </section>

      {/* ---------- bivio: tre domande, e dove trovi la risposta ---------- */}
      {pathways.length > 0 ? (
        <section className="section section--light a-fork" id="percorsi" aria-labelledby="paths-title">
          <div className="container">
            <header className="a-head">
              <p className="eyebrow">{fork.occhiello}</p>
              <h2 className="a-title" id="paths-title">
                {fork.titolo}
              </h2>
              <p className="text">{fork.testo}</p>
            </header>

            <ol className="a-fork__rows">
              {pathways.map((course) => {
                const where = centersByCourse.get(course.id) ?? []
                const everywhere = centers.length > 0 && where.length === centers.length
                return (
                  <li key={course.id} className="a-fork__row">
                    <div className="a-fork__ask">
                      <h3>
                        <Link href={`/corsi/${course.slug}`}>{course.domanda || course.nome}</Link>
                      </h3>
                      <p className="a-fork__name">{course.nome}</p>
                    </div>
                    <p className="a-fork__summary">{course.sommario}</p>
                    <div className="a-fork__where">
                      {everywhere ? (
                        <p>
                          <strong>In tutti i {centers.length} centri.</strong>{' '}
                          <Link href="/centri">Vedi dove</Link>
                        </p>
                      ) : where.length > 0 ? (
                        <p>
                          <strong>
                            {where.length === 1 ? 'In un centro:' : `In ${where.length} centri:`}
                          </strong>{' '}
                          {where.map((w, i) => (
                            <React.Fragment key={w.slug}>
                              {i > 0 ? (i === where.length - 1 ? ' e ' : ', ') : ''}
                              <Link href={`/centri/${w.slug}`}>{w.place}</Link>
                            </React.Fragment>
                          ))}
                          .
                        </p>
                      ) : (
                        /* Zero centri non e' un dato da stampare («0 attivi»,
                           docs/adr/0013): si dice com'e' e si lascia la porta
                           aperta, con il percorso gia' scelto nel modulo. */
                        <p>
                          <strong>In questa stagione non è in calendario.</strong> Lascia comunque la
                          richiesta:{' '}
                          <Link href={`/contatti?corso=${encodeURIComponent(course.slug)}`}>
                            scrivici
                          </Link>
                          .
                        </p>
                      )}
                      {course.ingresso ? <p className="a-fork__entry">{course.ingresso}</p> : null}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ---------- i centri: nomi, giorni, ore ---------- */}
      <section className="section section--grey a-places" id="centri" aria-labelledby="centers-title">
        <div className="container">
          <header className="a-head a-head--row">
            <h2 className="a-title" id="centers-title">
              {centers.length > 0
                ? `${centers.length} centri in ${provinces.size} province`
                : 'I centri tecnici'}
            </h2>
            {provinces.size > 0 ? (
              <p className="text">
                {[...provinces].map(provinceName).sort((a, b) => a.localeCompare(b, 'it')).join(', ')}
                . Ogni centro con il suo giorno, la sua ora e chi insegna.
              </p>
            ) : null}
          </header>

          {centers.length > 0 ? (
            <ul className="a-places__list">
              {centers.map((center) => {
                const { place, gym } = splitCenterName(center)
                const slots = [...(center.orari ?? [])].sort(
                  (a, b) =>
                    dayIndex(a.giorni?.[0]) - dayIndex(b.giorni?.[0]) ||
                    a.oraInizio.localeCompare(b.oraInizio),
                )
                const who = [
                  ...new Set(slots.flatMap((o) => (o.docenti ?? []).map(fullName))),
                ].filter((n): n is string => Boolean(n))
                return (
                  <li key={center.id} className="a-place">
                    <Link className="a-place__name" href={`/centri/${center.slug}`}>
                      {place}
                    </Link>
                    {gym ? <span className="a-place__gym">{gym}</span> : null}
                    <ul className="a-place__slots">
                      {slots.map((slot) => (
                        <li key={slot.id}>
                          <span className="a-place__day">{readableDays(slot.giorni)}</span>{' '}
                          {slot.oraInizio}
                          {slot.note ? <span className="a-place__note"> · {slot.note}</span> : null}
                        </li>
                      ))}
                    </ul>
                    {who.length > 0 ? <p className="a-place__who">Con {joinNames(who)}</p> : null}
                  </li>
                )
              })}
            </ul>
          ) : null}

          <p className="tail-action">
            <Link className="button button--secondary" href="/centri">
              La mappa dei centri
            </Link>
            {/* Dice come arrivarci, non dove: la posizione la chiede /centri. */}
            <Link className="button button--secondary" href="/centri?vicino=1">
              Usa la mia posizione
            </Link>
          </p>
        </div>
      </section>

      {/* ---------- chi insegna: l'unico altro blocco nero ---------- */}
      {instructors.length > 0 ? (
        <section className="section section--black a-people" aria-labelledby="people-title">
          <div className="container a-people__grid">
            <header className="a-head">
              <span className="rule" aria-hidden="true" />
              <h2 className="a-title" id="people-title">
                Chi insegna
              </h2>
              <p className="text">{qualifications}</p>
              <p>
                <Link className="breadcrumb" href="/istruttori">
                  L’albo degli istruttori
                </Link>
              </p>
            </header>

            <div className="a-people__list">
              {leading.map((person) => {
                const places = [...(placesByTeacher.get(person.id) ?? [])].sort((a, b) =>
                  a.localeCompare(b, 'it'),
                )
                return (
                  <article key={person.id} className="a-person">
                    <h3 className="a-person__name">{person.nome}</h3>
                    <p className="a-person__role">
                      {person.ruolo ||
                        (person.qualifica ? QUALIFICATION_LABEL[person.qualifica] : '')}
                    </p>
                    {person.credenziali?.length ? (
                      <ul className="a-person__creds">
                        {person.credenziali.map((c) => (
                          <li key={c.id ?? c.voce}>{c.voce}</li>
                        ))}
                      </ul>
                    ) : null}
                    {places.length > 0 ? (
                      <p className="a-person__places">Insegna a {joinNames(places)}.</p>
                    ) : null}
                  </article>
                )
              })}

              {others.length > 0 ? (
                <p className="a-people__others">
                  <span>E nei centri:</span> {joinNames(others.map((o) => o.nome))}.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------- la prima sera ---------- */}
      <section className="section section--light a-first" id="prima-volta" aria-labelledby="first-title">
        <div className="container a-first__grid">
          <div className="a-first__side">
            <header className="a-head">
              <h2 className="a-title" id="first-title">
                Cosa succede quando entri
              </h2>
              <p className="text">
                La palestra intimidisce più del Krav Maga. Ecco cosa aspettarsi la prima sera, così
                non devi chiederlo.
              </p>
            </header>
            {/* Slot dichiarato (docs/adr/0012): la foto generata di partenza
                non si mostra, e il posto resta scritto per quando arriva
                quella vera. */}
            <Figure
              slot={null}
              label="Foto della sala in arrivo"
              format="wide"
              className="a-first__photo"
            />
          </div>

          <ol className="a-first__points">
            {firstTime.map((point, i) => (
              <li key={point.titolo} className="a-first__point">
                <h3>{point.titolo}</h3>
                <p>{point.testo}</p>
                {/* L'ultimo punto dice «con chi parli»: qui i nomi veri. */}
                {i === firstTime.length - 1 && hosts.length > 0 ? (
                  <ul className="a-first__hosts" aria-label="Per esempio">
                    {hosts.map((h) => (
                      <li key={h.slug}>
                        <Link href={`/centri/${h.slug}`}>{h.place}</Link>: {joinNames(h.names)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- chiusura: la richiesta parte gia' con il centro ---------- */}
      <section className="section section--grey a-close" aria-labelledby="step-title">
        <div className="container a-close__grid">
          <header className="a-head">
            <h2 className="a-title" id="step-title">
              {step.titolo}
            </h2>
            <p className="text">{step.testo}</p>
          </header>

          {/* Un form GET verso /contatti: scegliere il centro qui lo
              preseleziona nel modulo (?sede=), che e' la richiesta che
              PRODUCT.md misura. Senza JavaScript funziona uguale. */}
          <form className="a-close__form" action="/contatti" method="get">
            <div className="field">
              <label htmlFor="close-center">Il centro che ti resta comodo</label>
              <select id="close-center" name="sede" defaultValue="">
                <option value="">Non lo so ancora</option>
                {centers.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="button button--primary">
              {step.bottone}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
