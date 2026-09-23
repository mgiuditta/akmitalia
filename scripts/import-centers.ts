/**
 * Importa corsi, istruttori e centri tecnici da `data/centri-tecnici.json`.
 * Rieseguibile: la chiave di upsert e lo `slug`, che e gia unico e indicizzato.
 *
 *   pnpm import:centers
 *
 * ponytail: nessun parser. La prosa della pagina Centri Tecnici e stata trascritta
 * a mano una volta sola (#10: da qui in poi la fonte di verita e Payload). Un parser
 * per un testo che non verra mai piu letto sarebbe codice da mantenere per niente.
 *
 * Non usa `legacy.wpId`: i centri non sono post WordPress, non hanno un id da agganciare.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { readFileSync } from 'fs'
import path from 'path'

type Row = Record<string, unknown> & { slug: string }

const data = JSON.parse(
  readFileSync(path.resolve(import.meta.dirname, '../data/centri-tecnici.json'), 'utf8'),
) as {
  corsi: Row[]
  istruttori: Row[]
  sedi: (Row & {
    orari?: { disciplina: string; docenti?: string[] }[]
  })[]
}

const payload = await getPayload({ config })

/** Crea o aggiorna per slug, e torna l id. Pubblicato: una bozza non si vede dal sito. */
const upsert = async (collection: 'corsi' | 'istruttori' | 'sedi', data: Row) => {
  const { docs } = await payload.find({
    collection,
    where: { slug: { equals: data.slug } },
    limit: 1,
    depth: 0,
    // Le bozze non escono da `find` senza questo, e l upsert ne creerebbe una seconda.
    draft: true,
    overrideAccess: true,
  })

  // `generateSlug: false` disattiva l hook che riscriverebbe lo slug da `nome`:
  // slugify() mangia gli accenti, e «Muggio» diventerebbe «muggi».
  const doc = { ...data, generateSlug: false, _status: 'published' } as never

  const saved = docs[0]
    ? await payload.update({ collection, id: docs[0].id, data: doc, overrideAccess: true })
    : await payload.create({ collection, data: doc, overrideAccess: true })

  return saved.id
}

const courses = new Map<string, number | string>()
for (const c of data.corsi) courses.set(c.slug, await upsert('corsi', c))

const instructors = new Map<string, number | string>()
for (const i of data.istruttori) instructors.set(i.slug, await upsert('istruttori', i))

/** Risolve uno slug in id, o esplode: uno slug scritto male qui diventerebbe un campo vuoto. */
const id = (map: Map<string, number | string>, slug: string, place: string) => {
  const v = map.get(slug)
  if (!v) throw new Error(`${place}: slug sconosciuto «${slug}»`)
  return v
}

for (const center of data.sedi) {
  const schedule = (center.orari ?? []).map((o) => ({
    ...o,
    disciplina: id(courses, o.disciplina, `${center.slug}/disciplina`),
    docenti: (o.docenti ?? []).map((d) => id(instructors, d, `${center.slug}/docente`)),
  }))

  // Vista aggregata: chi insegna in questo centro, dedotto dagli orari.
  const ownInstructors = [...new Set(schedule.flatMap((o) => o.docenti))]

  await upsert('sedi', { ...center, orari: schedule, istruttori: ownInstructors })
}

const count = async (collection: 'corsi' | 'istruttori' | 'sedi') =>
  (await payload.count({ collection, overrideAccess: true })).totalDocs

console.log(
  `corsi ${await count('corsi')} · istruttori ${await count('istruttori')} · centri ${await count('sedi')} (${data.sedi.filter((s) => s.attivo).length} attivi)`,
)

process.exit(0)
