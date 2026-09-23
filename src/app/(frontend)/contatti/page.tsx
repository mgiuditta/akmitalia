import type { Metadata } from 'next'
import React from 'react'

import { FormRichiesta, type TestiModulo } from '@/componenti/FormRichiesta'
import { indirizzoLeggibile, pubblicato } from '@/componenti/dati'
import { apriPayload } from '@/componenti/payload'
import { altreVoci, type OpzioniModulo } from './validazione'
import { Figura } from '@/componenti/Figura'
import { metadatiPagina } from '@/componenti/seo'

/**
 * La pagina del form: l'unico esito misurabile del sito (PRODUCT.md). Un
 * titolo, due righe, il modulo a sinistra e i recapiti a destra. Nessun
 * occhiello, nessun secondo bottone: chi e' qui ha gia' deciso.
 *
 * Testo d'apertura, destinatario, foto e i testi del modulo vengono dal global
 * Contatti: il cliente li cambia dall'admin. Il set di campi resta codice,
 * perche' sono le colonne della collection `richieste`.
 *
 * Da un percorso si arriva con ?corso=<slug>, da un centro o da un evento con
 * ?sede=<slug>: gli slug si risolvono qui e le select partono gia' sulla voce
 * giusta. Leggere searchParams rende la rotta dinamica, che e' quello che serve
 * perche' la preselezione funzioni.
 */

export const revalidate = 60

export const metadata: Metadata = metadatiPagina({
  titolo: 'Richiedi informazioni',
  descrizione:
    'Chiedi informazioni su corsi e centri di Krav Maga AKM Italia a Milano e in Lombardia: scegli il centro, lascia un recapito e ti ricontattiamo.',
  path: '/contatti',
})

/* Niente Canton Ticino finche' non c'e' un centro in Ticino: le province attive
   sono Lodi, Milano, Monza e Brianza, Varese, e la select non offre un centro
   ticinese. Il campo provincia accetta gia' la sigla TI: il giorno che una sede
   la porta, la frase torna. */
const INTRO =
  'Puoi chiedere informazioni su centri e corsi di Krav Maga a Milano e in Lombardia: scegli il centro che ti interessa, lascia un recapito e ti richiama chi tiene le lezioni in quel centro.'

export default async function PaginaContatti({
  searchParams,
}: {
  searchParams: Promise<{ corso?: string; sede?: string }>
}) {
  const { corso: slugCorso, sede: slugSede } = await searchParams
  const payload = await apriPayload()

  const [contatti, sedi, corsi] = await Promise.all([
    payload.findGlobal({ slug: 'contatti', depth: 1 }),
    payload.find({
      collection: 'sedi',
      depth: 0,
      limit: 200,
      sort: 'indirizzo.citta',
      select: { nome: true, slug: true, indirizzo: true, palestra: true, mapsUrl: true },
      where: { and: [{ attivo: { equals: true } }, pubblicato] },
    }),
    payload.find({
      collection: 'corsi',
      depth: 0,
      limit: 50,
      sort: 'ordine',
      select: { nome: true, slug: true },
      where: pubblicato,
    }),
  ])

  const modulo = contatti.modulo
  const scelta = typeof modulo?.paginaPrivacy === 'object' ? modulo.paginaPrivacy : null

  /* Il consenso GDPR senza il link all'informativa e' un consenso che non si
     puo' leggere. Il campo del global e' il modo giusto di collegarla, ma il
     ripiego non e' lasciarlo vuoto: se nessuno l'ha scelta, si cerca la pagina
     pubblicata a /privacy, che `pnpm pagine:legali` crea. */
  const privacy =
    scelta ??
    (
      await payload.find({
        collection: 'pagine',
        depth: 0,
        limit: 1,
        select: { path: true },
        where: { and: [{ path: { equals: '/privacy' } }, pubblicato] },
      })
    ).docs[0] ??
    null

  const testiModulo: TestiModulo = {
    nota: modulo?.nota || 'Tutti i campi sono obbligatori, tranne percorso e messaggio.',
    etichettaConsenso:
      modulo?.etichettaConsenso ||
      'Autorizzo il trattamento dei dati personali secondo il Regolamento UE 2016/679, per essere ricontattato da AKM Italia.',
    etichettaInvio: modulo?.etichettaInvio || 'Invia la richiesta',
    privacy: privacy?.path ? { etichetta: 'Leggi l’informativa', href: privacy.path } : null,
  }

  const opzioni: OpzioniModulo = {
    dataNascita: modulo?.chiediDataNascita !== false,
    percorso: modulo?.chiediPercorso !== false,
    messaggio: modulo?.chiediMessaggio !== false,
    altreVoci: altreVoci(modulo),
  }

  const corsoIniziale = slugCorso
    ? (corsi.docs.find((c) => c.slug === slugCorso)?.id ?? null)
    : null

  /* Da una scheda centro o da un evento: il centro arriva gia' scelto, cosi' la
     richiesta che PRODUCT.md misura - quella con la sede selezionata - non
     dipende da chi ritrova il proprio comune in una select di quindici voci.
     Uno slug che non e' fra i centri attivi non preseleziona niente e non e' un
     errore: la select resta sul «Scegli un centro». */
  const sedeIniziale = slugSede
    ? (sedi.docs.find((s) => s.slug === slugSede)?.id ?? null)
    : null

  const recapiti = Boolean(
    contatti.telefono || contatti.whatsapp || contatti.email || contatti.sedeLegale?.via,
  )
  const telefono = contatti.telefono?.replace(/\s/g, '')
  const whatsapp = contatti.whatsapp?.replace(/[\s+]/g, '')
  const sede = contatti.sedeLegale
  const indirizzo = [sede?.via, [sede?.cap, sede?.citta].filter(Boolean).join(' '), sede?.provincia]
    .filter(Boolean)
    .join(', ')

  return (
    <>
      <section className="section section--black masthead">
        <div className="container masthead__content">
          <h1 className="display display--lg">Richiedi informazioni</h1>
          <p className="text masthead__text">{contatti.introRichieste || INTRO}</p>
        </div>
      </section>

      {/* L'ancora della CTA in barra quando si e' gia' su questa pagina: li'
          «Richiedi informazioni» ripeteva l'H1 e portava dove si era gia'. */}
      <section className="section section--light" id="modulo" aria-labelledby="form-title">
        <div className="container contact">
          <div>
            <h2 className="display display--sm list-title" id="form-title">
              Scrivici
            </h2>
            <FormRichiesta
              sedi={sedi.docs.map((s) => ({
                id: s.id,
                nome: s.nome,
                citta: s.indirizzo?.citta ?? '',
                indirizzo: indirizzoLeggibile(s.indirizzo),
                palestra: s.palestra ?? null,
                mapsUrl: s.mapsUrl ?? null,
              }))}
              corsi={corsi.docs.map((c) => ({ id: c.id, nome: c.nome }))}
              testi={testiModulo}
              opzioni={opzioni}
              corsoIniziale={corsoIniziale}
              sedeIniziale={sedeIniziale}
              turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || null}
            />
          </div>

          <aside className="contact__channels" aria-label="Recapiti">
            <Figura
              classe="contact__photo"
              slot={contatti.immagineContatti}
              etichetta="Foto della pagina contatti"
              formato="ritratto"
              sizes="(min-width: 900px) 30vw, 100vw"
            />
            {/* AKM non pubblica un recapito per centro (CONTEXT.md, «Docente»), e
                finche' il global Contatti non e' compilato - cioe' subito dopo
                un'installazione pulita - qui non c'era niente: un <dl> vuoto e
                cinquecentocinquanta pixel di bianco. Uno stato vuoto si dichiara. */}
            {recapiti ? null : (
              <p className="text detail">
                Non pubblichiamo un recapito diretto: la richiesta qui accanto arriva a chi
                tiene le lezioni nel centro che scegli, e ti risponde quella persona.
              </p>
            )}
            <dl className="channels">
              {contatti.telefono ? (
                <div className="channel">
                  <dt>Telefono</dt>
                  <dd>
                    <a href={`tel:${telefono}`}>{contatti.telefono}</a>
                  </dd>
                </div>
              ) : null}
              {contatti.whatsapp ? (
                <div className="channel">
                  <dt>WhatsApp</dt>
                  <dd>
                    <a href={`https://wa.me/${whatsapp}`} rel="noopener">
                      {contatti.whatsapp}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contatti.email ? (
                <div className="channel">
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${contatti.email}`}>{contatti.email}</a>
                  </dd>
                </div>
              ) : null}
              {indirizzo ? (
                <div className="channel">
                  <dt>Sede legale</dt>
                  <dd>{indirizzo}</dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>
      </section>
    </>
  )
}
