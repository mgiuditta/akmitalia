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
 * Da un percorso si arriva con ?corso=<slug>: lo slug si risolve qui e la
 * select parte gia' sulla voce giusta. Leggere searchParams rende la rotta
 * dinamica, che e' quello che serve perche' la preselezione funzioni.
 */

export const revalidate = 60

export const metadata: Metadata = metadatiPagina({
  titolo: 'Richiedi informazioni',
  descrizione:
    'Chiedi informazioni su corsi e centri di Krav Maga AKM Italia a Milano, in Lombardia e in Canton Ticino: scegli il centro, lascia un recapito e ti ricontattiamo.',
  path: '/contatti',
})

const INTRO =
  'Puoi chiedere informazioni su centri e corsi di Krav Maga a Milano, in Lombardia e in Canton Ticino: scegli il centro che ti interessa, lascia un recapito e ti richiama chi tiene le lezioni in quel centro.'

export default async function PaginaContatti({
  searchParams,
}: {
  searchParams: Promise<{ corso?: string }>
}) {
  const { corso: slugCorso } = await searchParams
  const payload = await apriPayload()

  const [contatti, sedi, corsi] = await Promise.all([
    payload.findGlobal({ slug: 'contatti', depth: 1 }),
    payload.find({
      collection: 'sedi',
      depth: 0,
      limit: 200,
      sort: 'indirizzo.citta',
      select: { nome: true, indirizzo: true, palestra: true, mapsUrl: true },
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
  const privacy = typeof modulo?.paginaPrivacy === 'object' ? modulo.paginaPrivacy : null

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

  const telefono = contatti.telefono?.replace(/\s/g, '')
  const whatsapp = contatti.whatsapp?.replace(/[\s+]/g, '')
  const sede = contatti.sedeLegale
  const indirizzo = [sede?.via, [sede?.cap, sede?.citta].filter(Boolean).join(' '), sede?.provincia]
    .filter(Boolean)
    .join(', ')

  return (
    <>
      <section className="sezione sezione--nera testata">
        <div className="contenitore testata__contenuto">
          <h1 className="display display--lg">Richiedi informazioni</h1>
          <p className="testo testata__testo">{contatti.introRichieste || INTRO}</p>
        </div>
      </section>

      <section className="sezione sezione--chiara" aria-labelledby="titolo-modulo">
        <div className="contenitore contatto">
          <div>
            <h2 className="display display--sm titolo-elenco" id="titolo-modulo">
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
              turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || null}
            />
          </div>

          <aside className="contatto__recapiti" aria-label="Recapiti">
            <Figura
              classe="contatto__foto"
              slot={contatti.immagineContatti}
              etichetta="Foto della pagina contatti"
              formato="ritratto"
              sizes="(min-width: 900px) 30vw, 100vw"
            />
            <dl className="recapiti">
              {contatti.telefono ? (
                <div className="recapito">
                  <dt>Telefono</dt>
                  <dd>
                    <a href={`tel:${telefono}`}>{contatti.telefono}</a>
                  </dd>
                </div>
              ) : null}
              {contatti.whatsapp ? (
                <div className="recapito">
                  <dt>WhatsApp</dt>
                  <dd>
                    <a href={`https://wa.me/${whatsapp}`} rel="noopener">
                      {contatti.whatsapp}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contatti.email ? (
                <div className="recapito">
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${contatti.email}`}>{contatti.email}</a>
                  </dd>
                </div>
              ) : null}
              {indirizzo ? (
                <div className="recapito">
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
