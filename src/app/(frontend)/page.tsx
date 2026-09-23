import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { apriPayload } from '@/componenti/payload'
import { classeSuperficie, idDisciplina, ordinale, provinciaEstesa, pubblicato, testiBivio } from '@/componenti/dati'
import { Figura } from '@/componenti/Figura'
import { VideoEroe } from '@/componenti/VideoEroe'

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

const PRIMA_VOLTA_DI_SERIE = [
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
const QUALIFICHE_DI_SERIE =
  'I docenti sono istruttori qualificati, tesserati e assicurati CSEN: nome, qualifica e grado di ognuno stanno nell’albo. Le qualifiche AKM sono riconosciute da CSEN-CONI, F.E.K.D.A. e P.T.D.'

export default async function Home() {
  const payload = await apriPayload()

  const [impostazioni, corsi, sedi, istruttori] = await Promise.all([
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
    payload.find({
      collection: 'corsi',
      depth: 0,
      limit: 20,
      sort: 'ordine',
      where: { and: [{ inBivio: { equals: true } }, pubblicato] },
    }),
    payload.find({
      collection: 'sedi',
      depth: 0,
      limit: 200,
      sort: 'indirizzo.citta',
      select: { nome: true, slug: true, indirizzo: true, orari: true },
      where: { and: [{ attivo: { equals: true } }, pubblicato] },
    }),
    payload.count({ collection: 'istruttori', where: pubblicato }),
  ])

  const percorsi = corsi.docs
  const centri = sedi.docs

  // Quante sedi tengono un dato corso: la prova che un percorso non e' un'astrazione.
  const sediPerCorso = new Map<number, number>()
  for (const centro of centri) {
    const idCorsi = new Set(
      (centro.orari ?? [])
        .map((o) => idDisciplina(o.disciplina))
        .filter((id): id is number => id !== null),
    )
    for (const id of idCorsi) sediPerCorso.set(id, (sediPerCorso.get(id) ?? 0) + 1)
  }

  // In home bastano i primi comuni in ordine alfabetico: l'elenco vero sta in /centri.
  const comuni = [
    ...new Set(centri.map((c) => c.indirizzo?.citta).filter((c): c is string => Boolean(c))),
  ]
    .sort()
    .slice(0, 8)

  const province = new Set(
    centri.map((c) => c.indirizzo?.provincia).filter((p): p is string => Boolean(p)),
  )

  const primaVolta = impostazioni?.home?.primaVolta?.length
    ? impostazioni.home.primaVolta
    : PRIMA_VOLTA_DI_SERIE
  const qualifiche = impostazioni?.home?.testoQualifiche || QUALIFICHE_DI_SERIE
  const bivio = testiBivio(impostazioni)
  const passo = {
    titolo: impostazioni?.home?.passoTitolo || 'Prossimo passo',
    testo:
      impostazioni?.home?.passoTesto ||
      'Vuoi capire se AKM fa per te? Scrivici: ti orientiamo sul corso e sulla sede più adatti al tuo obiettivo.',
    bottone: impostazioni?.home?.passoBottone || 'Richiedi informazioni',
  }

  const eroe = typeof impostazioni?.immagineHero === 'object' ? impostazioni.immagineHero : null
  const eroeUrl = eroe?.sizes?.hero?.url || eroe?.url || null
  const video = typeof impostazioni?.videoHero === 'object' ? impostazioni.videoHero : null
  const videoUrl = video?.url || null
  const didascalia = (videoUrl ? video?.didascalia : eroe?.didascalia) || null

  /* Il copy dell'eroe sta in Impostazioni > eroe, con i valori di serie come
     ripiego: un campo svuotato dall'admin non lascia un buco in home. */
  const testi = impostazioni?.eroe
  const occhiello = testi?.occhiello || 'Krav Maga · Milano, Monza e Brianza, Lodi, Varese'
  const titolo = testi?.titolo || 'Difendersi si impara'
  // Sotto le 20 parole: la coda «prima scegli il percorso, poi la sede»
  // ripeteva a parole quello che i due bottoni qui sotto gia' fanno.
  const riga =
    testi?.testo ||
    `${centri.length > 0 ? `${centri.length} centri tecnici attivi, lezioni` : 'Lezioni'} settimanali tutto l’anno, istruttori con nome e cognome.`
  /* L'ancora esiste solo se il bivio ha almeno una riga: senza percorsi -
     succede nel minuto di guscio senza elenchi di docs/adr/0013, e su un
     database appena migrato - il bottone principale non portava da nessuna
     parte. Allora punta all'indice dei percorsi, che e' una rotta vera. */
  const hrefPrimaria = testi?.ctaPrimariaHref || '#percorsi'
  const primaria = {
    testo: testi?.ctaPrimariaEtichetta || 'Scegli il tuo percorso',
    href: hrefPrimaria.startsWith('#') && percorsi.length === 0 ? '/corsi' : hrefPrimaria,
  }
  const secondaria = {
    testo: testi?.ctaSecondariaEtichetta || 'Trova un centro',
    href: testi?.ctaSecondariaHref || '/centri',
  }

  return (
    <>
      <section className="hero" id="top">
        {eroeUrl ? (
          <Image
            className="hero__photo"
            src={eroeUrl}
            alt={eroe?.alt || ''}
            fill
            priority
            sizes="100vw"
          />
        ) : null}
        {videoUrl ? <VideoEroe src={videoUrl} /> : null}
        {eroeUrl || videoUrl ? <div className="hero__scrim" /> : null}
        {/* Anche l'eroe dichiara la sua fotografia: e' generata come le altre
            (docs/adr/0012), e qui e' la prima cosa che si vede. Sta in basso
            a destra e non a sinistra, dove ci sono il titolo e i due inviti.
            Col video acceso la didascalia e' quella del video: dice cosa si
            vede, e cosa si vede non e' piu' la fotografia. */}
        {didascalia ? <p className="hero__caption">{didascalia}</p> : null}

        <div className="container hero__content">
          <p className="eyebrow">{occhiello}</p>
          <h1 className="display display--hero hero__title">{titolo}</h1>
          <p className="text">{riga}</p>
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
            {primaria.href.startsWith('#') ? (
              <a className="button button--secondary" href={primaria.href}>
                {primaria.testo}
              </a>
            ) : (
              <Link className="button button--secondary" href={primaria.href}>
                {primaria.testo}
              </Link>
            )}
            <Link className="button button--secondary" href={secondaria.href}>
              {secondaria.testo}
            </Link>
          </div>
        </div>
      </section>

      {percorsi.length > 0 ? (
        <>
          <section
            className="section section--black fork__head"
            id="percorsi"
            aria-labelledby="paths-title"
          >
            <div className="container fork__heading">
              <p className="eyebrow">{bivio.occhiello}</p>
              <h2 className="display display--md" id="paths-title">
                {bivio.titolo}
              </h2>
              <p className="text">{bivio.testo}</p>
              {/* Il rimando all'indice sta nell'intestazione del bivio: da solo
                  si prendeva una fascia intera - 220px di padding a 1440 - per
                  una riga da 14px, che e' spazio avanzato, non struttura. */}
              <Link className="breadcrumb" href="/corsi">
                Tutti i percorsi
              </Link>
            </div>
          </section>

          <ol className="fork">
            {percorsi.map((corso, i) => {
                            const quante = sediPerCorso.get(corso.id) ?? 0

              return (
                <li key={corso.id} className={`reveal path ${classeSuperficie(corso.superficie)}`}>
                  <details>
                    <summary className="container path__head">
                      <span className="path__index" aria-hidden="true">
                        {ordinale(i + 1)}
                      </span>
                      <span className="path__question">
                        <span className="display display--md">{corso.domanda || corso.nome}</span>
                        <span className="path__name">{corso.nome}</span>
                      </span>
                      <span className="path__mark" aria-hidden="true" />
                    </summary>

                    <div className="container path__body">
                      <div>
                        <p className="text">{corso.sommario}</p>
                        {corso.prova ? (
                          <p className="text detail path__trial">{corso.prova}</p>
                        ) : null}
                        <p className="path__action">
                          <Link className="button button--primary" href={`/corsi/${corso.slug}`}>
                            Vedi il percorso
                          </Link>
                        </p>
                      </div>

                      <dl className="path__facts">
                        {corso.aChiSiRivolge ? (
                          <div className="path__fact">
                            <dt>A chi si rivolge</dt>
                            <dd>{corso.aChiSiRivolge}</dd>
                          </div>
                        ) : null}
                        {corso.durata ? (
                          <div className="path__fact">
                            <dt>Come funziona</dt>
                            <dd>{corso.durata}</dd>
                          </div>
                        ) : null}
                        {quante > 0 ? (
                          <div className="path__fact">
                            <dt>Centri che lo tengono</dt>
                            <dd>
                              {quante} su {centri.length}
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
              {centri.length > 0
                ? `${centri.length} centri in ${province.size} province`
                : 'I centri tecnici'}
            </h2>
            <p className="text">
              Ogni percorso finisce in una sede. Indirizzo, giorni, orario e docente di ogni centro
              stanno nella pagina dei centri, in ordine alfabetico per comune.
            </p>
          </div>

          {comuni.length > 0 ? (
            <ul className="towns">
              {comuni.map((comune) => (
                <li className="town" key={comune}>
                  {comune}
                </li>
              ))}
              {centri.length > comuni.length ? (
                <li className="town town--rest">
                  e altri {centri.length - comuni.length}
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
      <Figura
        slot={impostazioni?.home?.immagineIngresso}
        etichetta="Foto di «Cosa succede quando entri»"
        formato="banda"
        misura="grande"
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
            {primaVolta.map((punto) => (
              <div key={punto.titolo} className="reveal first__point">
                <h3>{punto.titolo}</h3>
                <p className="text">{punto.testo}</p>
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
            <p className="text first__lead">{qualifiche}</p>
          </div>

          {/* Un numero a zero non e' una prova: la riga sparisce invece di dichiarare il vuoto. */}
          <dl className="trials__numbers">
            {centri.length > 0 ? (
              <div className="trial">
                <dt className="trial__value">{centri.length}</dt>
                <dd className="trial__item">centri tecnici attivi in questa stagione</dd>
              </div>
            ) : null}
            {istruttori.totalDocs > 0 ? (
              <div className="trial">
                <dt className="trial__value">{istruttori.totalDocs}</dt>
                <dd className="trial__item">istruttori e maestri con nome, cognome e qualifica</dd>
              </div>
            ) : null}
            {province.size > 0 ? (
              <div className="trial">
                <dt className="trial__value">{province.size}</dt>
                <dd className="trial__item">
                  province coperte: {[...province].map(provinciaEstesa).sort().join(', ')}
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
            {passo.titolo}
          </h2>
          <p className="text first__lead">{passo.testo}</p>
          <p className="tail-action">
            <Link className="button button--primary" href="/contatti">
              {passo.bottone}
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
