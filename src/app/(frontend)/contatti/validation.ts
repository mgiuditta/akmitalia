/**
 * Le regole del form di /contatti, senza direttive: le usano la Server Action,
 * il componente client e il test. Un file 'use server' puo' esportare solo
 * funzioni asincrone, quindi tipi, stato iniziale e validatore stanno qui.
 *
 * Gli errori sono frasi, non codici: vanno lette sotto il campo da chi non
 * vede lo schermo (PRODUCT.md, accessibilita').
 */

export type RequestField =
  | 'cognome'
  | 'nome'
  | 'dataNascita'
  | 'telefono'
  | 'email'
  | 'sede'
  | 'corso'
  | 'messaggio'
  | 'consenso'

export type RequestValues = Record<RequestField, string>
export type RequestErrors = Partial<Record<RequestField, string>>

export type RequestState = {
  ok: boolean
  errors: RequestErrors
  /** Riga generale: errore di sistema o conferma. */
  messaggio: string | null
  /** React 19 svuota il form dopo l'action: i valori digitati tornano da qui. */
  values: Partial<RequestValues>
}

export const INITIAL_STATE: RequestState = { ok: false, errors: {}, messaggio: null, values: {} }

/**
 * Le voci del percorso che non sono corsi: restano testuali in `corsoIndicato`.
 * L'elenco vero sta in Contatti > modulo > altreVoci; questo e' il ripiego.
 */
export const DEFAULT_EXTRA_ITEMS = [
  'Formazione istruttori',
  'Kick Boxing',
  'Full Contact',
  'Stage o evento',
  'Altro',
]

export function extraItems(form?: { altreVoci?: { etichetta: string }[] | null } | null) {
  const items = (form?.altreVoci ?? []).map((v) => v.etichetta.trim()).filter(Boolean)
  return items.length > 0 ? items : DEFAULT_EXTRA_ITEMS
}

/** Sotto questo tempo fra apertura e invio non e' una persona. */
export const MIN_TIME_MS = 3000

/**
 * Quali campi facoltativi il modulo chiede. Vengono dal global Contatti e li
 * rilegge la Server Action: un campo spento a CMS non deve poter essere
 * imposto da un HTML costruito a mano, ne' restare obbligatorio sul server.
 */
export type FormOptions = {
  dataNascita: boolean
  pathway: boolean
  messaggio: boolean
  /** Le voci del percorso senza un corso dietro: il valore inviato e' l'etichetta. */
  altreVoci: string[]
}

export const DEFAULT_OPTIONS: FormOptions = {
  dataNascita: true,
  pathway: true,
  messaggio: true,
  altreVoci: DEFAULT_EXTRA_ITEMS,
}

const FIELDS: RequestField[] = [
  'cognome',
  'nome',
  'dataNascita',
  'telefono',
  'email',
  'sede',
  'corso',
  'messaggio',
  'consenso',
]

export function read(data: FormData): RequestValues {
  const values = {} as RequestValues
  for (const field of FIELDS) {
    const v = data.get(field)
    values[field] = typeof v === 'string' ? v.trim() : ''
  }
  return values
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?\d{6,15}$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

export function validate(
  v: RequestValues,
  options: FormOptions = DEFAULT_OPTIONS,
): RequestErrors {
  const errors: RequestErrors = {}

  if (!v.cognome) errors.cognome = 'Scrivi il tuo cognome.'
  else if (v.cognome.length > 80) errors.cognome = 'Il cognome può avere al massimo 80 caratteri.'

  if (!v.nome) errors.nome = 'Scrivi il tuo nome.'
  else if (v.nome.length > 80) errors.nome = 'Il nome può avere al massimo 80 caratteri.'

  if (!v.email || v.email.length > 120 || !EMAIL.test(v.email)) {
    errors.email = 'Scrivi un indirizzo email valido, ad esempio nome@dominio.it.'
  }

  const digits = v.telefono.replace(/[\s.()-]/g, '')
  if (!digits || !PHONE.test(digits)) {
    errors.telefono = 'Scrivi un numero di telefono con almeno 6 cifre.'
  }

  if (options.dataNascita && (!DATE.test(v.dataNascita) || !plausibleDate(v.dataNascita))) {
    errors.dataNascita = 'Scrivi la data di nascita nel formato giorno/mese/anno.'
  }

  if (!/^\d+$/.test(v.sede)) errors.sede = 'Scegli il centro tecnico che ti interessa.'

  if (options.pathway && v.corso && !/^\d+$/.test(v.corso) && !options.altreVoci.includes(v.corso)) {
    errors.corso = 'Scegli una voce dall’elenco.'
  }

  if (options.messaggio && v.messaggio.length > 2000) {
    errors.messaggio = 'Il messaggio può avere al massimo 2000 caratteri.'
  }

  if (v.consenso !== 'on') {
    errors.consenso = 'Per inviare la richiesta devi accettare il trattamento dei dati.'
  }

  return errors
}

function plausibleDate(iso: string) {
  const data = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== iso) return false
  return data >= new Date('1900-01-01T00:00:00Z') && data <= new Date()
}
