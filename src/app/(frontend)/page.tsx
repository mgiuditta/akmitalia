import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { openPayload } from '@/components/payload'
import { surfaceClass, disciplineId, ordinal, provinceName, published, forkTexts } from '@/components/data'
import { Figure } from '@/components/Figure'
import { HeroVideo } from '@/components/HeroVideo'

/**
 * Home: orienta prima di convertire. Eroe, bivio dei percorsi, dove si pratica,
 * prima lezione, prove. Nessuna richiesta di contatto prima che il bivio sia risolto.
 *
 * L'elenco completo dei centri con tutti gli orari vive in /centri e il dettaglio
 * di ogni percorso in /corsi: qui restano il bivio e il rimando.
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

  const [settings, courses, centersFound, instructors] = await Promise.all([
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
      select: { nome: true, slug: true, indirizzo: true, orari: true },
      where: { and: [{ attivo: { equals: true } }, published] },
    }),
    payload.count({ collection: 'istruttori', where: published }),
  ])

  const pathways = courses.docs
  const centers = centersFound.docs

  // Quante sedi tengono un dato corso: la prova che un percorso non e' un'astrazione.
  const centersByCourse = new Map<number, number>()
  for (const center of centers) {
    const courseIds = new Set(
      (center.orari ?? [])
        .map((o) => disciplineId(o.disciplina))
        .filter((id): id is number => id !== null),
    )
    for (const id of courseIds) centersByCourse.set(id, (centersByCourse.get(id) ?? 0) + 1)
  }

  // In home bastano i primi comuni in ordine alfabetico: l'elenco vero sta in /centri.
  const towns = [
    ...new Set(centers.map((c) => c.indirizzo?.citta).filter((c): c is string => Boolean(c))),
  ]
    .sort()
    .slice(0, 8)

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

  const hero = typeof settings?.immagineHero === 'object' ? settings.immagineHero : null
  const heroUrl = hero?.sizes?.hero?.url || hero?.url || null
  const video = typeof settings?.videoHero === 'object' ? settings.videoHero : null
  const videoUrl = video?.url || null
  const caption = (videoUrl ? video?.didascalia : hero?.didascalia) || null

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
  /* L'ancora esiste solo se il bivio ha almeno una riga: senza percorsi -
     succede nel minuto di guscio senza elenchi di docs/adr/0013, e su un
     database appena migrato - il bottone principale non portava da nessuna
     parte. Allora punta all'indice dei percorsi, che e' una rotta vera. */
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
      <section className="hero" id="top">
        {heroUrl ? (
          <Image
            className="hero__photo"
            src={heroUrl}
            alt={hero?.alt || ''}
            fill
            priority
            sizes="100vw"
          />
        ) : null}
        {videoUrl ? <HeroVideo src={videoUrl} /> : null}
        {heroUrl || videoUrl ? <div className="hero__scrim" /> : null}
        {/* Anche l'eroe dichiara la sua fotografia: e' generata come le altre
            (docs/adr/0012), e qui e' la prima cosa che si vede. Sta in basso
            a destra e non a sinistra, dove ci sono il titolo e i due inviti.
            Col video acceso la didascalia e' quella del video: dice cosa si
            vede, e cosa si vede non e' piu' la fotografia. */}
        {caption ? <p className="hero__caption">{caption}</p> : null}

        <div className="container hero__content">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display display--hero hero__title">{title}</h1>
          <p className="text">{row}</p>
          <div className="hero__tail">
            {/*
              I due inviti dell'eroe sono secondari, non primari. Nella prima
              schermata il rosso e' uno solo ed e' la CTA in barra, che porta
              alla richiesta: l'unico esito misurabile del sito e l'unico
              bottone che docs/adr/0008 non lascia nascondere. A 390px il titolo
              resta a 48px e due masse rosse pesavano piu' del display, che e'
              quello che deve dare il saluto; docs/adr/0005 lo dice gia' come
              rimedio: ridurre quanti bottoni primari stanno nella stessa
              schermata. Questi due non sono l'azione della pagina, sono il
              primo bivio: portano a scegliere, non a convertire.

              Un'ancora in pagina resta <a>: next/link su #percorsi rifarebbe la rotta.
            */}
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
      </section>

      {pathways.length > 0 ? (
        <>
          <section
            className="section section--black fork__head"
            id="percorsi"
            aria-labelledby="paths-title"
          >
            <div className="container fork__heading">
              <p className="eyebrow">{fork.occhiello}</p>
              <h2 className="display display--md" id="paths-title">
                {fork.titolo}
              </h2>
              <p className="text">{fork.testo}</p>
              {/* Il rimando all'indice sta nell'intestazione del bivio: da solo
                  si prendeva una fascia intera - 220px di padding a 1440 - per
                  una riga da 14px, che e' spazio avanzato, non struttura. */}
              <Link className="breadcrumb" href="/corsi">
                Tutti i percorsi
              </Link>
            </div>
          </section>

          <ol className="fork">
            {pathways.map((course, i) => {
                            const howMany = centersByCourse.get(course.id) ?? 0

              return (
                <li key={course.id} className={`reveal path ${surfaceClass(course.superficie)}`}>
                  <details>
                    <summary className="container path__head">
                      <span className="path__index" aria-hidden="true">
                        {ordinal(i + 1)}
                      </span>
                      <span className="path__question">
                        <span className="display display--md">{course.domanda || course.nome}</span>
                        <span className="path__name">{course.nome}</span>
                      </span>
                      <span className="path__mark" aria-hidden="true" />
                    </summary>

                    <div className="container path__body">
                      <div>
                        <p className="text">{course.sommario}</p>
                        {course.prova ? (
                          <p className="text detail path__trial">{course.prova}</p>
                        ) : null}
                        <p className="path__action">
                          <Link className="button button--primary" href={`/corsi/${course.slug}`}>
                            Vedi il percorso
                          </Link>
                        </p>
                      </div>

                      <dl className="path__facts">
                        {course.aChiSiRivolge ? (
                          <div className="path__fact">
                            <dt>A chi si rivolge</dt>
                            <dd>{course.aChiSiRivolge}</dd>
                          </div>
                        ) : null}
                        {course.durata ? (
                          <div className="path__fact">
                            <dt>Come funziona</dt>
                            <dd>{course.durata}</dd>
                          </div>
                        ) : null}
                        {howMany > 0 ? (
                          <div className="path__fact">
                            <dt>Centri che lo tengono</dt>
                            <dd>
                              {howMany} su {centers.length}
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                    </div>
                  </details>
                </li>
              )
            })}
          </ol>

        </>
      ) : null}

      <section className="section section--light" id="centri" aria-labelledby="centers-title">
        <div className="container">
          <div className="centers__heading">
            <span className="rule" aria-hidden="true" />
            <h2 className="display display--md" id="centers-title">
              {centers.length > 0
                ? `${centers.length} centri in ${provinces.size} province`
                : 'I centri tecnici'}
            </h2>
            <p className="text">
              Ogni percorso finisce in una sede. Indirizzo, giorni, orario e docente di ogni centro
              stanno nella pagina dei centri, in ordine alfabetico per comune.
            </p>
          </div>

          {towns.length > 0 ? (
            <ul className="towns">
              {towns.map((town) => (
                <li className="town" key={town}>
                  {town}
                </li>
              ))}
              {centers.length > towns.length ? (
                <li className="town town--rest">
                  e altri {centers.length - towns.length}
                </li>
              ) : null}
            </ul>
          ) : null}

          <p className="tail-action">
            <Link className="button button--primary" href="/centri">
              Trova un centro
            </Link>
            {/* Il secondo bottone non ripete il primo: dice come arrivarci, non
                dove. La posizione la chiede /centri, che e' dove serve. */}
            <Link className="button button--secondary" href="/centri?vicino=1">
              Usa la mia posizione
            </Link>
          </p>
        </div>
      </section>

      {/* La sala prima del racconto della prima sera: chi non e' mai entrato in
          una palestra vuole vederla, non leggerla. */}
      <Figure
        slot={settings?.home?.immagineIngresso}
        label="Foto di «Cosa succede quando entri»"
        format="band"
        measure="grande"
        sizes="100vw"
      />

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
