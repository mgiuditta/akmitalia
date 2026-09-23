import type { Metadata } from 'next'
import React from 'react'

import { RequestForm, type FormTexts } from '@/components/RequestForm'
import { readableAddress, published } from '@/components/data'
import { openPayload } from '@/components/payload'
import { extraItems, type FormOptions } from './validation'
import { Figure } from '@/components/Figure'
import { pageMetadata } from '@/components/seo'

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

export const metadata: Metadata = pageMetadata({
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

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ corso?: string; sede?: string }>
}) {
  const { corso: courseSlug, sede: centerSlug } = await searchParams
  const payload = await openPayload()

  const [contacts, centers, courses] = await Promise.all([
    payload.findGlobal({ slug: 'contatti', depth: 1 }),
    payload.find({
      collection: 'sedi',
      depth: 0,
      limit: 200,
      sort: 'indirizzo.citta',
      select: { nome: true, slug: true, indirizzo: true, palestra: true, mapsUrl: true },
      where: { and: [{ attivo: { equals: true } }, published] },
    }),
    payload.find({
      collection: 'corsi',
      depth: 0,
      limit: 50,
      sort: 'ordine',
      select: { nome: true, slug: true },
      where: published,
    }),
  ])

  const form = contacts.modulo
  const choice = typeof form?.paginaPrivacy === 'object' ? form.paginaPrivacy : null

  /* Il consenso GDPR senza il link all'informativa e' un consenso che non si
     puo' leggere. Il campo del global e' il modo giusto di collegarla, ma il
     ripiego non e' lasciarlo vuoto: se nessuno l'ha scelta, si cerca la pagina
     pubblicata a /privacy, che `pnpm pages:legal` crea. */
  const privacy =
    choice ??
    (
      await payload.find({
        collection: 'pagine',
        depth: 0,
        limit: 1,
        select: { path: true },
        where: { and: [{ path: { equals: '/privacy' } }, published] },
      })
    ).docs[0] ??
    null

  const formTexts: FormTexts = {
    nota: form?.nota || 'Tutti i campi sono obbligatori, tranne percorso e messaggio.',
    etichettaConsenso:
      form?.etichettaConsenso ||
      'Autorizzo il trattamento dei dati personali secondo il Regolamento UE 2016/679, per essere ricontattato da AKM Italia.',
    etichettaInvio: form?.etichettaInvio || 'Invia la richiesta',
    privacy: privacy?.path ? { etichetta: 'Leggi l’informativa', href: privacy.path } : null,
  }

  const options: FormOptions = {
    dataNascita: form?.chiediDataNascita !== false,
    pathway: form?.chiediPercorso !== false,
    messaggio: form?.chiediMessaggio !== false,
    altreVoci: extraItems(form),
  }

  const initialCourse = courseSlug
    ? (courses.docs.find((c) => c.slug === courseSlug)?.id ?? null)
    : null

  /* Da una scheda centro o da un evento: il centro arriva gia' scelto, cosi' la
     richiesta che PRODUCT.md misura - quella con la sede selezionata - non
     dipende da chi ritrova il proprio comune in una select di quindici voci.
     Uno slug che non e' fra i centri attivi non preseleziona niente e non e' un
     errore: la select resta sul «Scegli un centro». */
  const initialCenter = centerSlug
    ? (centers.docs.find((s) => s.slug === centerSlug)?.id ?? null)
    : null

  const channels = Boolean(
    contacts.telefono || contacts.whatsapp || contacts.email || contacts.sedeLegale?.via,
  )
  const phone = contacts.telefono?.replace(/\s/g, '')
  const whatsapp = contacts.whatsapp?.replace(/[\s+]/g, '')
  const center = contacts.sedeLegale
  const address = [center?.via, [center?.cap, center?.citta].filter(Boolean).join(' '), center?.provincia]
    .filter(Boolean)
    .join(', ')

  return (
    <>
      <section className="section section--black masthead">
        <div className="container masthead__content">
          <h1 className="display display--lg">Richiedi informazioni</h1>
          <p className="text masthead__text">{contacts.introRichieste || INTRO}</p>
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
            <RequestForm
              sedi={centers.docs.map((s) => ({
                id: s.id,
                nome: s.nome,
                citta: s.indirizzo?.citta ?? '',
                indirizzo: readableAddress(s.indirizzo),
                palestra: s.palestra ?? null,
                mapsUrl: s.mapsUrl ?? null,
              }))}
              corsi={courses.docs.map((c) => ({ id: c.id, nome: c.nome }))}
              texts={formTexts}
              options={options}
              initialCourse={initialCourse}
              initialCenter={initialCenter}
              turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || null}
            />
          </div>

          <aside className="contact__channels" aria-label="Recapiti">
            <Figure
              className="contact__photo"
              slot={contacts.immagineContatti}
              label="Foto della pagina contatti"
              format="portrait"
              sizes="(min-width: 900px) 30vw, 100vw"
            />
            {/* AKM non pubblica un recapito per centro (CONTEXT.md, «Docente»), e
                finche' il global Contatti non e' compilato - cioe' subito dopo
                un'installazione pulita - qui non c'era niente: un <dl> vuoto e
                cinquecentocinquanta pixel di bianco. Uno stato vuoto si dichiara. */}
            {channels ? null : (
              <p className="text detail">
                Non pubblichiamo un recapito diretto: la richiesta qui accanto arriva a chi
                tiene le lezioni nel centro che scegli, e ti risponde quella persona.
              </p>
            )}
            <dl className="channels">
              {contacts.telefono ? (
                <div className="channel">
                  <dt>Telefono</dt>
                  <dd>
                    <a href={`tel:${phone}`}>{contacts.telefono}</a>
                  </dd>
                </div>
              ) : null}
              {contacts.whatsapp ? (
                <div className="channel">
                  <dt>WhatsApp</dt>
                  <dd>
                    <a href={`https://wa.me/${whatsapp}`} rel="noopener">
                      {contacts.whatsapp}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contacts.email ? (
                <div className="channel">
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                  </dd>
                </div>
              ) : null}
              {address ? (
                <div className="channel">
                  <dt>Sede legale</dt>
                  <dd>{address}</dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>
      </section>
    </>
  )
}
