/**
 * Il calcolo del calendario, senza librerie e senza DOM: mesi, griglia delle
 * settimane, chiavi dei giorni, date e orari scritti in italiano. Tutto in
 * Europe/Rome, perche' le date di Payload arrivano in UTC e un evento delle
 * 00:30 del primo del mese non deve finire nel mese prima.
 *
 * ponytail: niente date-fns. Intl fa il fuso e i nomi, il resto e' aritmetica
 * su Date.UTC, e le sole cose che questa pagina chiede sono qui sotto.
 */

export const TIME_ZONE = 'Europe/Rome'

/** `month` va da 1 a 12, come lo scrive una persona. */
export type Month = { year: number; month: number }

const parts = (d: Date) => {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
  const p: Record<string, number> = {}
  for (const { type, value } of f.formatToParts(d)) {
    if (type !== 'literal') p[type] = Number(value)
  }
  // Intl scrive «24» per la mezzanotte in alcune versioni di ICU.
  if (p.hour === 24) p.hour = 0
  return p as { year: number; month: number; day: number; hour: number; minute: number }
}

const two = (n: number) => String(n).padStart(2, '0')

/** «2026-09-24» del giorno in cui cade l'istante, a Roma. */
export function dayKey(d: Date | string): string {
  const { year, month, day } = parts(new Date(d))
  return `${year}-${two(month)}-${two(day)}`
}

export function monthKey({ year, month }: Month): string {
  return `${year}-${two(month)}`
}

export function currentMonth(today: Date = new Date()): Month {
  const { year, month } = parts(today)
  return { year, month }
}

/** `?mese=2026-09`. Qualsiasi altra cosa vale il mese corrente: la URL non e' un errore. */
export function monthFromParam(param: string | undefined, today: Date = new Date()): Month {
  const m = /^(\d{4})-(\d{2})$/.exec(param ?? '')
  if (!m) return currentMonth(today)
  const year = Number(m[1])
  const month = Number(m[2])
  if (month < 1 || month > 12 || year < 2000 || year > 2100) return currentMonth(today)
  return { year, month }
}

export function nextMonth({ year, month }: Month): Month {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 }
}

export function previousMonth({ year, month }: Month): Month {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 }
}

/** L'istante di un'ora dell'orologio di Roma: «24 settembre 2026, 18:30». */
export function fromRome(year: number, month: number, day: number, time = 0, minute = 0): Date {
  const presumed = Date.UTC(year, month - 1, day, time, minute)
  const p = parts(new Date(presumed))
  const parsed = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute)
  // Lo scarto fra quanto letto a Roma e quanto chiesto e' l'offset del fuso.
  return new Date(presumed - (parsed - presumed))
}

const romeMidnight = (year: number, month: number, day: number) => fromRome(year, month, day)

/** [inizio, fine): dalla mezzanotte del primo a quella del primo del mese dopo. */
export function monthRange(m: Month): { start: Date; end: Date } {
  const after = nextMonth(m)
  return {
    start: romeMidnight(m.year, m.month, 1),
    end: romeMidnight(after.year, after.month, 1),
  }
}

const utcKey = (t: number) => new Date(t).toISOString().slice(0, 10)
const DAY_MS = 86_400_000

/**
 * Le settimane del mese, da lunedi' a domenica, come chiavi di giorno. Le
 * celle prima del primo e dopo l'ultimo appartengono ai mesi accanto: la
 * griglia e' sempre piena, cinque o sei righe.
 */
export function grid({ year, month }: Month): string[][] {
  const first = Date.UTC(year, month - 1, 1)
  const last = Date.UTC(year, month, 0)
  // getUTCDay: 0 = domenica. Lo spostiamo su lunedi' = 0.
  const discarded = (new Date(first).getUTCDay() + 6) % 7
  const weeks: string[][] = []
  let t = first - discarded * DAY_MS
  while (t <= last) {
    const week: string[] = []
    for (let i = 0; i < 7; i++, t += DAY_MS) week.push(utcKey(t))
    weeks.push(week)
  }
  return weeks
}

/** Tutti i giorni su cui un evento si stende, estremi compresi. */
export function eventDays(start: string, end?: string | null): string[] {
  const from = dayKey(start)
  const a = end ? dayKey(end) : from
  if (a <= from) return [from]
  const days: string[] = []
  for (let t = Date.parse(from); utcKey(t) <= a && days.length < 62; t += DAY_MS) {
    days.push(utcKey(t))
  }
  return days
}

const time = (d: Date | string) => {
  const { hour, minute } = parts(new Date(d))
  return `${two(hour)}:${two(minute)}`
}

/**
 * «18:30-19:30». Vuoto se l'inizio e' a mezzanotte: e' il modo di dire «tutto
 * il giorno» senza un campo in piu'.
 *
 * ponytail: un evento che inizia davvero a mezzanotte non esiste in una
 * palestra. Se un giorno servira', si aggiunge un flag.
 */
export function readableSlot(start: string, end?: string | null): string {
  const hi = time(start)
  if (hi === '00:00') return ''
  const hf = end ? time(end) : ''
  return hf && hf !== '00:00' && hf !== hi ? `${hi}-${hf}` : hi
}

const capitalized = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** «Settembre 2026» */
export function monthName({ year, month }: Month): string {
  const name = new Intl.DateTimeFormat('it-IT', { month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  )
  return `${capitalized(name)} ${year}`
}

/**
 * «Giovedì 24 settembre 2026», oppure «23-25 maggio 2026» se dura piu' giorni
 * nello stesso mese, «30 aprile - 2 maggio 2026» se lo scavalca.
 */
export function readableDate(start: string, end?: string | null): string {
  const days = eventDays(start, end)
  const from = new Date(start)
  if (days.length === 1) {
    return capitalized(
      new Intl.DateTimeFormat('it-IT', {
        timeZone: TIME_ZONE,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(from),
    )
  }
  const a = new Date(end as string)
  const pd = parts(from)
  const pa = parts(a)
  const fullMonth = (d: Date) =>
    new Intl.DateTimeFormat('it-IT', { timeZone: TIME_ZONE, month: 'long' }).format(d)
  if (pd.month === pa.month && pd.year === pa.year) {
    return `${pd.day}-${pa.day} ${fullMonth(from)} ${pa.year}`
  }
  return `${pd.day} ${fullMonth(from)} - ${pa.day} ${fullMonth(a)} ${pa.year}`
}

/** «gio 24 set», per la riga d'agenda. */
export function shortDate(start: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
    .format(new Date(start))
    .replace(/\./g, '')
}
