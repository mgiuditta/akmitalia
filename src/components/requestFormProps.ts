import { extraItems, type FormOptions } from '@/app/(frontend)/contatti/validation'

import { published, readableAddress } from './data'
import { openPayload } from './payload'
import type { FormTexts } from './RequestForm'

/**
 * Prototipo C (#66): quello che serve a RequestForm fuori da /contatti. Sono
 * le stesse letture e gli stessi ripieghi di contatti/page.tsx, raccolti qui
 * perche' la scheda del centro porta il modulo in pagina. /contatti non e'
 * toccata dal prototipo: se la direzione passa, la pagina del modulo legge da
 * qui e la copia sparisce.
 */
export async function requestFormProps() {
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
    sedi: centers.docs.map((s) => ({
      id: s.id,
      slug: s.slug,
      nome: s.nome,
      citta: s.indirizzo?.citta ?? '',
      indirizzo: readableAddress(s.indirizzo),
      palestra: s.palestra ?? null,
      mapsUrl: s.mapsUrl ?? null,
    })),
    corsi: courses.docs.map((c) => ({ id: c.id, nome: c.nome })),
    texts,
    options,
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || null,
  }
}
