/**
 * Il calcolo del calendario, senza librerie e senza DOM: mesi, griglia delle
 * settimane, chiavi dei giorni, date e orari scritti in italiano. Tutto in
 * Europe/Rome, perche' le date di Payload arrivano in UTC e un evento delle
 * 00:30 del primo del mese non deve finire nel mese prima.
 *
 * ponytail: niente date-fns. Intl fa il fuso e i nomi, il resto e' aritmetica
 * su Date.UTC, e le sole cose che questa pagina chiede sono qui sotto.
 */

export const FUSO = 'Europe/Rome'

/** `mese` va da 1 a 12, come lo scrive una persona. */
export type Mese = { anno: number; mese: number }

const parti = (d: Date) => {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSO,
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

const due = (n: number) => String(n).padStart(2, '0')

/** «2026-09-24» del giorno in cui cade l'istante, a Roma. */
export function chiaveGiorno(d: Date | string): string {
  const { year, month, day } = parti(new Date(d))
  return `${year}-${due(month)}-${due(day)}`
}

export function chiaveMese({ anno, mese }: Mese): string {
  return `${anno}-${due(mese)}`
}

export function meseCorrente(oggi: Date = new Date()): Mese {
  const { year, month } = parti(oggi)
  return { anno: year, mese: month }
}

/** `?mese=2026-09`. Qualsiasi altra cosa vale il mese corrente: la URL non e' un errore. */
export function meseDaParam(param: string | undefined, oggi: Date = new Date()): Mese {
  const m = /^(\d{4})-(\d{2})$/.exec(param ?? '')
  if (!m) return meseCorrente(oggi)
  const anno = Number(m[1])
  const mese = Number(m[2])
  if (mese < 1 || mese > 12 || anno < 2000 || anno > 2100) return meseCorrente(oggi)
  return { anno, mese }
}

export function meseSuccessivo({ anno, mese }: Mese): Mese {
  return mese === 12 ? { anno: anno + 1, mese: 1 } : { anno, mese: mese + 1 }
}

export function mesePrecedente({ anno, mese }: Mese): Mese {
  return mese === 1 ? { anno: anno - 1, mese: 12 } : { anno, mese: mese - 1 }
}

/** L'istante di un'ora dell'orologio di Roma: «24 settembre 2026, 18:30». */
export function daRoma(anno: number, mese: number, giorno: number, ora = 0, minuto = 0): Date {
  const presunto = Date.UTC(anno, mese - 1, giorno, ora, minuto)
  const p = parti(new Date(presunto))
  const letto = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute)
  // Lo scarto fra quanto letto a Roma e quanto chiesto e' l'offset del fuso.
  return new Date(presunto - (letto - presunto))
}

const mezzanotteARoma = (anno: number, mese: number, giorno: number) => daRoma(anno, mese, giorno)

/** [inizio, fine): dalla mezzanotte del primo a quella del primo del mese dopo. */
export function intervalloMese(m: Mese): { inizio: Date; fine: Date } {
  const dopo = meseSuccessivo(m)
  return {
    inizio: mezzanotteARoma(m.anno, m.mese, 1),
    fine: mezzanotteARoma(dopo.anno, dopo.mese, 1),
  }
}

const chiaveUtc = (t: number) => new Date(t).toISOString().slice(0, 10)
const GIORNO_MS = 86_400_000

/**
 * Le settimane del mese, da lunedi' a domenica, come chiavi di giorno. Le
 * celle prima del primo e dopo l'ultimo appartengono ai mesi accanto: la
 * griglia e' sempre piena, cinque o sei righe.
 */
export function griglia({ anno, mese }: Mese): string[][] {
  const primo = Date.UTC(anno, mese - 1, 1)
  const ultimo = Date.UTC(anno, mese, 0)
  // getUTCDay: 0 = domenica. Lo spostiamo su lunedi' = 0.
  const scarto = (new Date(primo).getUTCDay() + 6) % 7
  const settimane: string[][] = []
  let t = primo - scarto * GIORNO_MS
  while (t <= ultimo) {
    const settimana: string[] = []
    for (let i = 0; i < 7; i++, t += GIORNO_MS) settimana.push(chiaveUtc(t))
    settimane.push(settimana)
  }
  return settimane
}

/** Tutti i giorni su cui un evento si stende, estremi compresi. */
export function giorniDiUnEvento(inizio: string, fine?: string | null): string[] {
  const da = chiaveGiorno(inizio)
  const a = fine ? chiaveGiorno(fine) : da
  if (a <= da) return [da]
  const giorni: string[] = []
  for (let t = Date.parse(da); chiaveUtc(t) <= a && giorni.length < 62; t += GIORNO_MS) {
    giorni.push(chiaveUtc(t))
  }
  return giorni
}

const ora = (d: Date | string) => {
  const { hour, minute } = parti(new Date(d))
  return `${due(hour)}:${due(minute)}`
}

/**
 * «18:30-19:30». Vuoto se l'inizio e' a mezzanotte: e' il modo di dire «tutto
 * il giorno» senza un campo in piu'.
 *
 * ponytail: un evento che inizia davvero a mezzanotte non esiste in una
 * palestra. Se un giorno servira', si aggiunge un flag.
 */
export function orarioLeggibile(inizio: string, fine?: string | null): string {
  const hi = ora(inizio)
  if (hi === '00:00') return ''
  const hf = fine ? ora(fine) : ''
  return hf && hf !== '00:00' && hf !== hi ? `${hi}-${hf}` : hi
}

const maiuscola = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** «Settembre 2026» */
export function nomeMese({ anno, mese }: Mese): string {
  const nome = new Intl.DateTimeFormat('it-IT', { month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(anno, mese - 1, 1)),
  )
  return `${maiuscola(nome)} ${anno}`
}

/**
 * «Giovedì 24 settembre 2026», oppure «23-25 maggio 2026» se dura piu' giorni
 * nello stesso mese, «30 aprile - 2 maggio 2026» se lo scavalca.
 */
export function dataLeggibile(inizio: string, fine?: string | null): string {
  const giorni = giorniDiUnEvento(inizio, fine)
  const da = new Date(inizio)
  if (giorni.length === 1) {
    return maiuscola(
      new Intl.DateTimeFormat('it-IT', {
        timeZone: FUSO,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(da),
    )
  }
  const a = new Date(fine as string)
  const pd = parti(da)
  const pa = parti(a)
  const meseEsteso = (d: Date) =>
    new Intl.DateTimeFormat('it-IT', { timeZone: FUSO, month: 'long' }).format(d)
  if (pd.month === pa.month && pd.year === pa.year) {
    return `${pd.day}-${pa.day} ${meseEsteso(da)} ${pa.year}`
  }
  return `${pd.day} ${meseEsteso(da)} - ${pa.day} ${meseEsteso(a)} ${pa.year}`
}

/** «gio 24 set», per la riga d'agenda. */
export function dataBreve(inizio: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: FUSO,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
    .format(new Date(inizio))
    .replace(/\./g, '')
}
