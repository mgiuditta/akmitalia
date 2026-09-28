import type { Payload } from 'payload'

import type { FormTexts } from '@/components/RequestForm'
import { readableAddress, published } from '@/components/data'
import { extraItems, type FormOptions } from '@/app/(frontend)/contatti/validation'

/**
 * Quello che il modulo di richiesta vuole sapere prima di comporsi: i centri
 * attivi fra cui scegliere, i corsi, i testi e gli interruttori del global
 * Contatti. Lo leggevano solo /contatti; ora lo legge anche la scheda di un
 * centro, che il modulo lo porta dentro con il centro gia' scelto. Una lettura
 * sola, cosi' le due pagine non possono offrire due moduli diversi.
 */
export async function loadRequestForm(payload: Payload) {
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

  const texts: FormTexts = {
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

  return {
    contacts,
    /** Con lo slug, per risolvere ?sede=<slug>; il resto e' la forma che il modulo vuole. */
    centers: centers.docs.map((s) => ({
      id: s.id,
      slug: s.slug,
      nome: s.nome,
      citta: s.indirizzo?.citta ?? '',
      indirizzo: readableAddress(s.indirizzo),
      palestra: s.palestra ?? null,
      mapsUrl: s.mapsUrl ?? null,
    })),
    courses: courses.docs.map((c) => ({ id: c.id, slug: c.slug, nome: c.nome })),
    texts,
    options,
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || null,
  }
}
