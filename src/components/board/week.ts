import type { Sedi } from '@/payload-types'

/**
 * La settimana della bacheca: le righe di orario di tutti i centri attivi,
 * rimesse in ordine per giorno e per ora. Niente di scritto a mano: se un
 * centro cambia sera dall'admin, la home cambia con lui al primo ricontrollo.
 *
 * Un orario con piu' giorni (lun e gio) diventa due lezioni, una per giorno:
 * sulla bacheca si legge per sera, non per riga di programmazione.
 */

export const DAY_KEYS = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'] as const
export type DayKey = (typeof DAY_KEYS)[number]

/** Sigla e nome per esteso. La sigla va in Anton, il nome resta scritto accanto. */
export const DAY_NAMES: Record<DayKey, { short: string; long: string }> = {
  lun: { short: 'Lun', long: 'Lunedì' },
  mar: { short: 'Mar', long: 'Martedì' },
  mer: { short: 'Mer', long: 'Mercoledì' },
  gio: { short: 'Gio', long: 'Giovedì' },
  ven: { short: 'Ven', long: 'Venerdì' },
  sab: { short: 'Sab', long: 'Sabato' },
  dom: { short: 'Dom', long: 'Domenica' },
}

export type Lesson = {
  key: string
  day: DayKey
  start: string
  end: string
  /** «Binasco», «Milano Bisceglie / Lorenteggio»: la parte del nome prima del trattino. */
  place: string
  gym: string | null
  centerSlug: string
  course: { name: string; slug: string } | null
  note: string | null
  teachers: string[]
}

export type Day = { key: DayKey; lessons: Lesson[] }

/** «Milano Bisceglie / Lorenteggio - Palestra Piscina Cardellino» -> «Milano Bisceglie / Lorenteggio». */
export function placeName(center: Pick<Sedi, 'nome' | 'indirizzo'>) {
  const [first] = center.nome.split(' - ')
  return first?.trim() || center.indirizzo?.citta || center.nome
}

/** Il nome del docente per esteso: sulla bacheca si legge chi, non un soprannome. */
export function teacherName(i: unknown, names?: Map<number, string>) {
  if (typeof i === 'number') return names?.get(i) ?? null
  if (typeof i !== 'object' || i === null) return null
  const doc = i as { nome?: string | null }
  return doc.nome || null
}

/** «20.30» e «20:30» sono lo stesso orario: il validatore del campo accetta entrambi. */
function normalizeTime(t: string | null | undefined) {
  return (t ?? '').replace('.', ':')
}

/**
 * `names` risolve i docenti quando arrivano come id: la home legge le sedi con
 * `select`, e li' la relazione dei docenti torna non popolata.
 */
export function lessonsOf(center: Sedi, names?: Map<number, string>): Lesson[] {
  const lessons: Lesson[] = []
  for (const slot of center.orari ?? []) {
    const course =
      typeof slot.disciplina === 'object' && slot.disciplina
        ? { name: slot.disciplina.nome, slug: slot.disciplina.slug ?? '' }
        : null
    const teachers = (slot.docenti ?? []).map((d) => teacherName(d, names)).filter((n): n is string => Boolean(n))
    for (const day of slot.giorni ?? []) {
      if (!DAY_KEYS.includes(day as DayKey)) continue
      lessons.push({
        key: `${center.id}-${slot.id}-${day}`,
        day: day as DayKey,
        start: normalizeTime(slot.oraInizio),
        end: normalizeTime(slot.oraFine),
        place: placeName(center),
        gym: center.palestra || null,
        centerSlug: center.slug ?? '',
        course,
        note: slot.note || null,
        teachers,
      })
    }
  }
  return lessons
}

/**
 * La settimana da lunedi' a sabato, e la domenica solo se qualcuno la tiene:
 * un giorno vuoto in coda non e' un dato, e' una colonna da spiegare.
 * Un giorno feriale senza lezioni invece resta, e lo dice.
 */
export function buildWeek(centers: Sedi[], names?: Map<number, string>): Day[] {
  const all = centers.flatMap((c) => lessonsOf(c, names))
  const byDay = (key: DayKey) =>
    all
      .filter((l) => l.day === key)
      .sort((a, b) => a.start.localeCompare(b.start) || a.place.localeCompare(b.place, 'it'))

  return DAY_KEYS.map((key) => ({ key, lessons: byDay(key) })).filter(
    (d) => d.key !== 'dom' || d.lessons.length > 0,
  )
}

/** Il giorno della settimana a Milano, qualunque sia il fuso del server. */
export function todayKey(now = new Date()): DayKey {
  const name = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/Rome' })
    .format(now)
    .toLowerCase()
  const map: Record<string, DayKey> = {
    mon: 'lun',
    tue: 'mar',
    wed: 'mer',
    thu: 'gio',
    fri: 'ven',
    sat: 'sab',
    sun: 'dom',
  }
  return map[name] ?? 'lun'
}

export function lessonsLabel(n: number) {
  return n === 1 ? 'lezione' : 'lezioni'
}
