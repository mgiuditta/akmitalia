import type { Metadata } from 'next'
import React from 'react'

import { RequestForm } from '@/components/RequestForm'
import { openPayload } from '@/components/payload'
import { loadRequestForm } from '@/components/requestFormData'
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
  const { contacts, centers, courses, texts: formTexts, options, turnstileSiteKey } =
    await loadRequestForm(payload)

  const initialCourse = courseSlug
    ? (courses.find((c) => c.slug === courseSlug)?.id ?? null)
    : null

  /* Da una scheda centro o da un evento: il centro arriva gia' scelto, cosi' la
     richiesta che PRODUCT.md misura - quella con la sede selezionata - non
     dipende da chi ritrova il proprio comune in una select di quindici voci.
     Uno slug che non e' fra i centri attivi non preseleziona niente e non e' un
     errore: la select resta sul «Scegli un centro». */
  const initialCenter = centerSlug
    ? (centers.find((s) => s.slug === centerSlug)?.id ?? null)
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
              sedi={centers}
              corsi={courses}
              texts={formTexts}
              options={options}
              initialCourse={initialCourse}
              initialCenter={initialCenter}
              turnstileSiteKey={turnstileSiteKey}
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
