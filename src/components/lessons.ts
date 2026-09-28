import type { Sedi } from '@/payload-types'

import { disciplineId } from '@/components/data'

/**
 * Le lezioni vere, lette dagli orari dei centri: servono alla prima schermata
 * della home, che deve dire un centro, un giorno, un'ora e il nome di chi
 * insegna prima di qualunque affermazione. Niente di scritto a mano: se un
 * orario cambia dall'admin, cambia la home.
 *
 * Il fuso e' quello delle sale, Europe/Rome, qualunque sia il fuso del server.
 */

const DAY_CODES = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'] as const
const WEEK = 7 * 24 * 60
const ZONE = 'Europe/Rome'

/** «Bresso - Palestra Beauty Island» -> luogo «Bresso», palestra «Palestra Beauty Island». */
export function splitCenterName(center: Pick<Sedi, 'nome' | 'palestra' | 'indirizzo'>) {
  const [place, ...rest] = (center.nome ?? '').split(' - ')
  return {
    place: place?.trim() || center.indirizzo?.citta || center.nome,
    gym: rest.join(' - ').trim() || center.palestra || '',
  }
}

/** Il nome per esteso di chi insegna: in home e nella scheda la persona si nomina intera. */
export function fullName(i: unknown) {
  if (typeof i !== 'object' || i === null) return null
  const doc = i as { nome?: string | null; nomeBreve?: string | null }
  return doc.nome || doc.nomeBreve || null
}

/** «Vittorio Porreca e Stefano», «Omar Borghini, Marco e Monica». */
export function joinNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? ''
  return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
}

export type Lesson = {
  key: string
  centerSlug: string
  place: string
  gym: string
  day: (typeof DAY_CODES)[number]
  start: string
  end: string
  courseId: number | null
  courseName: string
  note: string
  teachers: string[]
  /** Minuti da adesso all'inizio, dentro la settimana. */
  inMinutes: number
  /** «Oggi», «Domani» oppure il giorno: «Giovedì». */
  when: string
  /** «martedì 29 settembre». */
  date: string
}

function romeNow(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'))
  return day * 1440 + Number(get('hour')) * 60 + Number(get('minute'))
}

function minutes(time: string | null | undefined) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time ?? '')
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

const WEEKDAY = new Intl.DateTimeFormat('it-IT', { timeZone: ZONE, weekday: 'long' })
const LONG_DATE = new Intl.DateTimeFormat('it-IT', {
  timeZone: ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const DAY_KEY = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE })

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * Tutte le lezioni della settimana, in ordine a partire da adesso: la prima e'
 * la prossima. Una lezione gia' cominciata oggi passa in fondo, alla settimana
 * dopo.
 */
export function upcomingLessons(
  centers: Pick<Sedi, 'nome' | 'slug' | 'palestra' | 'indirizzo' | 'orari'>[],
  now = new Date(),
): Lesson[] {
  const nowMin = romeNow(now)
  const today = DAY_KEY.format(now)
  const tomorrow = DAY_KEY.format(new Date(now.getTime() + 24 * 60 * 60 * 1000))
  const lessons: Lesson[] = []

  for (const center of centers) {
    const { place, gym } = splitCenterName(center)
    for (const slot of center.orari ?? []) {
      const start = minutes(slot.oraInizio)
      if (start === null) continue
      const course = typeof slot.disciplina === 'object' ? slot.disciplina : null
      const teachers = (slot.docenti ?? []).map(fullName).filter((n): n is string => Boolean(n))
      for (const code of slot.giorni ?? []) {
        const day = DAY_CODES.indexOf(code as (typeof DAY_CODES)[number])
        if (day < 0) continue
        const inMinutes = (day * 1440 + start - nowMin + WEEK) % WEEK
        const at = new Date(now.getTime() + inMinutes * 60 * 1000)
        const key = DAY_KEY.format(at)
        lessons.push({
          key: `${slot.id}-${code}`,
          centerSlug: center.slug,
          place,
          gym,
          day: DAY_CODES[day],
          start: slot.oraInizio,
          end: slot.oraFine,
          courseId: disciplineId(slot.disciplina),
          courseName: course?.nome ?? '',
          note: slot.note ?? '',
          teachers,
          inMinutes,
          when: key === today ? 'Oggi' : key === tomorrow ? 'Domani' : capital(WEEKDAY.format(at)),
          date: LONG_DATE.format(at),
        })
      }
    }
  }

  return lessons.sort((a, b) => a.inMinutes - b.inMinutes || a.place.localeCompare(b.place, 'it'))
}
