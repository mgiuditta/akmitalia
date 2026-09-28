import type { FormTexts } from '@/components/RequestForm'
import { readableAddress, published } from '@/components/data'
import { openPayload } from '@/components/payload'
import { extraItems, type FormOptions } from '@/app/(frontend)/contatti/validation'

/**
 * Quello che serve a <RequestForm> fuori da /contatti: i centri attivi, i corsi,
 * i testi e gli interruttori del global Contatti, con gli stessi ripieghi della
 * pagina del modulo. La scheda del centro lo monta in pagina con il centro gia'
 * scelto.
 *
 * ponytail: e' la stessa lettura che fa contatti/page.tsx. Nel prototipo resta
 * duplicata per non toccare una rotta che gli altri prototipi condividono; se la
 * direzione passa, /contatti legge da qui e la copia sparisce.
 */
export async function requestFormSetup() {
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

  const form = contacts?.modulo
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
    texts,
    options,
    centers: centers.docs.map((s) => ({
      id: s.id,
      slug: s.slug,
      nome: s.nome,
      citta: s.indirizzo?.citta ?? '',
      indirizzo: readableAddress(s.indirizzo),
      palestra: s.palestra ?? null,
      mapsUrl: s.mapsUrl ?? null,
    })),
    courses: courses.docs.map((c) => ({ id: c.id, nome: c.nome })),
  }
}
