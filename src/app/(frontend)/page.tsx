import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { idDisciplina, ordinale, provinciaEstesa, pubblicato } from '@/componenti/dati'
import { Figura } from '@/componenti/Figura'

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

const QUALIFICHE_DI_SERIE =
  'I docenti sono diplomati dopo almeno quattro anni di percorso e un esame di abilitazione all’insegnamento, tesserati e assicurati CSEN. Le qualifiche AKM sono riconosciute da CSEN-CONI, F.E.K.D.A. e P.T.D.'

export default async function Home() {
  const payload = await getPayload({ config: await config })

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

  const eroe = typeof impostazioni?.immagineHero === 'object' ? impostazioni.immagineHero : null
  const eroeUrl = eroe?.sizes?.hero?.url || eroe?.url || null

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
  const primaria = {
    testo: testi?.ctaPrimariaEtichetta || 'Scegli il tuo percorso',
    href: testi?.ctaPrimariaHref || '#percorsi',
  }
  const secondaria = {
    testo: testi?.ctaSecondariaEtichetta || 'Trova un centro',
    href: testi?.ctaSecondariaHref || '/centri',
  }

  return (
    <>
      <section className="eroe" id="top">
        {eroeUrl ? (
          <>
            <Image
              className="eroe__foto"
              src={eroeUrl}
              alt={eroe?.alt || ''}
              fill
              priority
              sizes="100vw"
            />
            <div className="eroe__velo" />
          </>
        ) : null}

        <div className="contenitore eroe__contenuto">
          <p className="occhiello">{occhiello}</p>
          <h1 className="display display--eroe eroe__titolo">{titolo}</h1>
          <p className="testo">{riga}</p>
          <div className="eroe__coda">
            {/* Un'ancora in pagina resta <a>: next/link su #percorsi rifarebbe la rotta. */}
            {primaria.href.startsWith('#') ? (
              <a className="bottone bottone--primario" href={primaria.href}>
                {primaria.testo}
              </a>
            ) : (
              <Link className="bottone bottone--primario" href={primaria.href}>
                {primaria.testo}
              </Link>
            )}
            <Link className="bottone bottone--secondario" href={secondaria.href}>
              {secondaria.testo}
            </Link>
          </div>
        </div>
      </section>

      {percorsi.length > 0 ? (
        <>
          <section
            className="sezione sezione--nera bivio__testa"
            id="percorsi"
            aria-labelledby="titolo-percorsi"
          >
            <div className="contenitore bivio__intestazione">
              <p className="occhiello">Il primo bivio</p>
              <h2 className="display display--md" id="titolo-percorsi">
                Qual è il tuo momento
              </h2>
              <p className="testo">
                Non serve sapere quale disciplina fa per te. Serve sapere perché sei qui: da lì si
                arriva al corso giusto e al centro che lo tiene.
              </p>
            </div>
          </section>

          <ol className="bivio">
            {percorsi.map((corso, i) => {
              const superficie = corso.superficie ?? 'carbone'
              const quante = sediPerCorso.get(corso.id) ?? 0

              return (
                <li key={corso.id} className={`rivela percorso percorso--${superficie}`}>
                  <details>
                    <summary className="contenitore percorso__testa">
                      <span className="percorso__indice" aria-hidden="true">
                        {ordinale(i + 1)}
                      </span>
                      <span className="percorso__domanda">
                        <span className="display display--md">{corso.domanda || corso.nome}</span>
                        <span className="percorso__nome">{corso.nome}</span>
                      </span>
                      <span className="percorso__segno" aria-hidden="true" />
                    </summary>

                    <div className="contenitore percorso__corpo">
                      <div>
                        <p className="testo">{corso.sommario}</p>
                        {corso.prova ? (
                          <p className="testo dato percorso__prova">{corso.prova}</p>
                        ) : null}
                        <p className="percorso__azione">
                          <Link className="bottone bottone--primario" href={`/corsi/${corso.slug}`}>
                            Vedi il percorso
                          </Link>
                        </p>
                      </div>

                      <dl className="percorso__fatti">
                        {corso.aChiSiRivolge ? (
                          <div className="percorso__fatto">
                            <dt>A chi si rivolge</dt>
                            <dd>{corso.aChiSiRivolge}</dd>
                          </div>
                        ) : null}
                        {corso.durata ? (
                          <div className="percorso__fatto">
                            <dt>Come funziona</dt>
                            <dd>{corso.durata}</dd>
                          </div>
                        ) : null}
                        {quante > 0 ? (
                          <div className="percorso__fatto">
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

          <section className="sezione sezione--nera">
            <p className="contenitore">
              <Link className="briciola" href="/corsi">
                Tutti i percorsi
              </Link>
            </p>
          </section>
        </>
      ) : null}

      <section className="sezione sezione--chiara" id="centri" aria-labelledby="titolo-centri">
        <div className="contenitore">
          <div className="centri__intestazione">
            <span className="filetto" aria-hidden="true" />
            <h2 className="display display--md" id="titolo-centri">
              {centri.length > 0
                ? `${centri.length} centri in ${province.size} province`
                : 'I centri tecnici'}
            </h2>
            <p className="testo">
              Ogni percorso finisce in una sede. Indirizzo, giorni, orario e docente di ogni centro
              stanno nella pagina dei centri, in ordine alfabetico per comune.
            </p>
          </div>

          {comuni.length > 0 ? (
            <ul className="comuni">
              {comuni.map((comune) => (
                <li className="comune" key={comune}>
                  {comune}
                </li>
              ))}
              {centri.length > comuni.length ? (
                <li className="comune comune--resto">
                  e altri {centri.length - comuni.length}
                </li>
              ) : null}
            </ul>
          ) : null}

          <p className="coda-azione">
            <Link className="bottone bottone--primario" href="/centri">
              Trova un centro
            </Link>
            {/* Il secondo bottone non ripete il primo: dice come arrivarci, non
                dove. La posizione la chiede /centri, che e' dove serve. */}
            <Link className="bottone bottone--secondario" href="/centri?vicino=1">
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

      <section className="sezione sezione--carbone" id="prima-volta" aria-labelledby="titolo-prima">
        <div className="contenitore prima">
          <div>
            <h2 className="display display--md" id="titolo-prima">
              Cosa succede quando entri
            </h2>
            <p className="testo prima__attacco">
              La palestra intimidisce più del Krav Maga. Ecco cosa aspettarsi la prima sera, così
              non devi chiederlo.
            </p>
          </div>

          <div className="prima__punti">
            {primaVolta.map((punto) => (
              <div key={punto.titolo} className="rivela prima__punto">
                <h3>{punto.titolo}</h3>
                <p className="testo">{punto.testo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sezione sezione--nera" aria-labelledby="titolo-prove">
        <div className="contenitore prove">
          <div>
            <h2 className="display display--md" id="titolo-prove">
              Le qualifiche si contano
            </h2>
            <p className="testo prima__attacco">{qualifiche}</p>
          </div>

          {/* Un numero a zero non e' una prova: la riga sparisce invece di dichiarare il vuoto. */}
          <dl className="prove__numeri">
            {centri.length > 0 ? (
              <div className="prova">
                <dt className="prova__valore">{centri.length}</dt>
                <dd className="prova__voce">centri tecnici attivi in questa stagione</dd>
              </div>
            ) : null}
            {istruttori.totalDocs > 0 ? (
              <div className="prova">
                <dt className="prova__valore">{istruttori.totalDocs}</dt>
                <dd className="prova__voce">istruttori e maestri con nome, cognome e qualifica</dd>
              </div>
            ) : null}
            {province.size > 0 ? (
              <div className="prova">
                <dt className="prova__valore">{province.size}</dt>
                <dd className="prova__voce">
                  province coperte: {[...province].map(provinciaEstesa).sort().join(', ')}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>
    </>
  )
}
