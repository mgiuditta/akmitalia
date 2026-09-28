import { TIME_ZONE } from './calendar'
import { instructorName, disciplineId } from './data'

/**
 * Le serate di AKM, calcolate dagli orari veri (prototipo D, «Ospiti di sera»).
 *
 * AKM non ha una palestra sua: e' ospite, quasi sempre una sera a settimana, di
 * sale che di giorno fanno altro. Qui stanno i pochi calcoli che quella lettura
 * chiede: che giorno e' a Roma, qual e' la prossima sera con lezione, quando
 * cade la prossima lezione di un centro, chi porta la serata in piu' sale, e da
 * quali zone si arriva a un centro. Niente DOM, niente librerie.
 */

export const WEEK = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'] as const
export type DayKey = (typeof WEEK)[number]

const EN_TO_KEY: Record<string, DayKey> = {
  Mon: 'lun',
  Tue: 'mar',
  Wed: 'mer',
  Thu: 'gio',
  Fri: 'ven',
  Sat: 'sab',
  Sun: 'dom',
}

export const DAY_NAMES: Record<DayKey, string> = {
  lun: 'Lunedì',
  mar: 'Martedì',
  mer: 'Mercoledì',
  gio: 'Giovedì',
  ven: 'Venerdì',
  sab: 'Sabato',
  dom: 'Domenica',
}

/** Il momento presente a Roma: giorno della settimana e minuti dalla mezzanotte. */
export function romeNow(now: Date = new Date()) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })
  const p: Record<string, string> = {}
  for (const { type, value } of f.formatToParts(now)) p[type] = value
  const hour = Number(p.hour) % 24
  return { day: EN_TO_KEY[p.weekday] ?? 'lun', minutes: hour * 60 + Number(p.minute), now }
}

/** «20:30» o «20.30» in minuti. */
export function minutesOf(time?: string | null) {
  const m = /^(\d{1,2})[:.](\d{2})$/.exec(time ?? '')
  return m ? Number(m[1]) * 60 + Number(m[2]) : 0
}

/** La data a Roma fra `offset` giorni, scritta «martedì 29 settembre». */
export function dateInDays(offset: number, now: Date = new Date()) {
  const d = new Date(now.getTime() + offset * 86_400_000)
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d)
}

/** Giorni da oggi al prossimo `day`; zero se e' oggi e la lezione non e' finita. */
export function daysUntil(day: DayKey, endMinutes: number, today = romeNow()) {
  const from = WEEK.indexOf(today.day)
  const to = WEEK.indexOf(day)
  let offset = (to - from + 7) % 7
  if (offset === 0 && today.minutes >= endMinutes) offset = 7
  return offset
}

type Relation = unknown

export type SlotLike = {
  id?: string | null
  disciplina: Relation
  giorni?: (string | null)[] | null
  oraInizio: string
  oraFine: string
  docenti?: Relation[] | null
  note?: string | null
}

export type CenterLike = {
  id: number
  nome: string
  slug?: string | null
  palestra?: string | null
  descrizione?: string | null
  indirizzo?: { citta?: string | null } | null
  orari?: SlotLike[] | null
}

/** Una lezione pronta da stampare: la sala, l'ora, il corso, chi la tiene. */
export type Lesson = {
  centerId: number
  center: string
  town: string
  host: string | null
  slug: string
  day: DayKey
  start: string
  end: string
  course: string
  teachers: string
  note: string | null
}

/**
 * Il nome del posto, senza la sala: «Milano Affori» da «Milano Affori - Milano
 * Sport». Il nome del centro unisce comune e struttura ospitante (CONTEXT.md);
 * la citta' da sola non basta, perche' a Milano i centri sono tre.
 */
export function placeName(center: Pick<CenterLike, 'nome' | 'indirizzo'>) {
  const [first] = center.nome.split(' - ')
  return first?.trim() || center.indirizzo?.citta || center.nome
}

function courseName(d: Relation) {
  return typeof d === 'object' && d !== null ? ((d as { nome?: string }).nome ?? '') : ''
}

export function lessonsOf(center: CenterLike): Lesson[] {
  return (center.orari ?? []).flatMap((slot) =>
    (slot.giorni ?? [])
      .filter((g): g is DayKey => WEEK.includes(g as DayKey))
      .map((day) => ({
        centerId: center.id,
        center: center.nome,
        town: placeName(center),
        host: center.palestra || null,
        slug: center.slug ?? '',
        day,
        start: slot.oraInizio,
        end: slot.oraFine,
        course: courseName(slot.disciplina),
        teachers: (slot.docenti ?? []).map(instructorName).filter(Boolean).join(', '),
        note: slot.note || null,
      })),
  )
}

const byTime = (a: Lesson, b: Lesson) =>
  minutesOf(a.start) - minutesOf(b.start) || a.town.localeCompare(b.town, 'it')

/**
 * La prossima sera con lezione: oggi, se c'e' ancora una lezione non finita,
 * altrimenti il primo giorno dopo che ne ha. Sera per sera, tutte le sale.
 */
export function nextEvening(centers: CenterLike[], today = romeNow()) {
  const all = centers.flatMap(lessonsOf)
  for (let offset = 0; offset < 8; offset++) {
    const day = WEEK[(WEEK.indexOf(today.day) + offset) % 7]
    const lessons = all
      .filter((l) => l.day === day)
      .filter((l) => offset > 0 || minutesOf(l.end) > today.minutes)
      .sort(byTime)
    if (lessons.length > 0) return { offset, day, lessons }
  }
  return null
}

/**
 * Le zone di cui un centro e' punto di riferimento. Non esiste un campo: la
 * frase sta nella descrizione, scritta sempre allo stesso modo dall'import
 * («... e' inoltre il punto di riferimento per le zone di A, B e C.»). Se la
 * frase non c'e', non ci sono zone e la descrizione resta com'e'.
 */
export function referenceZones(description?: string | null): string[] {
  const m = /punto di riferimento per le zone\s+(?:di\s+)?([^.]+)\./i.exec(description ?? '')
  if (!m) return []
  return m[1]
    .split(/,\s*|\s+e\s+/)
    .map((z) => z.trim())
    .filter(Boolean)
}

/** La descrizione senza la frase delle zone, che la scheda stampa a parte. */
export function descriptionWithoutZones(description?: string | null) {
  return (description ?? '')
    .replace(/[^.]*punto di riferimento per le zone[^.]*\./i, '')
    .trim()
}

/** Una serata di un centro in una riga: «Giovedì 20:30». */
export function eveningsOf(center: CenterLike) {
  const lessons = lessonsOf(center).sort(
    (a, b) => WEEK.indexOf(a.day) - WEEK.indexOf(b.day) || byTime(a, b),
  )
  return lessons
}

/**
 * Chi porta la serata in piu' di una sala. Il docente e' un ruolo dell'orario
 * (CONTEXT.md): qui si raccolgono, persona per persona, le sere che tiene.
 */
export function teacherRounds(centers: CenterLike[]) {
  const map = new Map<
    number,
    { id: number; name: string; slug: string; role: string | null; lessons: Lesson[] }
  >()
  for (const center of centers) {
    for (const slot of center.orari ?? []) {
      for (const t of slot.docenti ?? []) {
        if (typeof t !== 'object' || t === null) continue
        const doc = t as { id: number; nome: string; slug?: string; ruolo?: string | null }
        const entry = map.get(doc.id) ?? {
          id: doc.id,
          name: doc.nome,
          slug: doc.slug ?? '',
          role: doc.ruolo || null,
          lessons: [],
        }
        for (const l of lessonsOf({ ...center, orari: [slot] })) entry.lessons.push(l)
        map.set(doc.id, entry)
      }
    }
  }
  return [...map.values()].map((t) => ({
    ...t,
    lessons: t.lessons.sort((a, b) => WEEK.indexOf(a.day) - WEEK.indexOf(b.day) || byTime(a, b)),
    centers: new Set(t.lessons.map((l) => l.centerId)).size,
  }))
}

/** I centri in cui un corso ha almeno un orario, e le loro citta'. */
export function centersForCourse(centers: CenterLike[], courseId: number) {
  const found = centers.filter((c) =>
    (c.orari ?? []).some((o) => disciplineId(o.disciplina) === courseId),
  )
  return {
    count: found.length,
    towns: [...new Set(found.map(placeName))].sort((a, b) =>
      a.localeCompare(b, 'it'),
    ),
  }
}
