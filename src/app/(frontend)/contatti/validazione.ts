/**
 * Le regole del form di /contatti, senza direttive: le usano la Server Action,
 * il componente client e il test. Un file 'use server' puo' esportare solo
 * funzioni asincrone, quindi tipi, stato iniziale e validatore stanno qui.
 *
 * Gli errori sono frasi, non codici: vanno lette sotto il campo da chi non
 * vede lo schermo (PRODUCT.md, accessibilita').
 */

export type CampoRichiesta =
  | 'cognome'
  | 'nome'
  | 'dataNascita'
  | 'telefono'
  | 'email'
  | 'sede'
  | 'corso'
  | 'messaggio'
  | 'consenso'

export type ValoriRichiesta = Record<CampoRichiesta, string>
export type ErroriRichiesta = Partial<Record<CampoRichiesta, string>>

export type StatoRichiesta = {
  ok: boolean
  errori: ErroriRichiesta
  /** Riga generale: errore di sistema o conferma. */
  messaggio: string | null
  /** React 19 svuota il form dopo l'action: i valori digitati tornano da qui. */
  valori: Partial<ValoriRichiesta>
}

export const STATO_INIZIALE: StatoRichiesta = { ok: false, errori: {}, messaggio: null, valori: {} }

/** Le voci del percorso che non sono corsi: restano testuali in `corsoIndicato`. */
export const CORSO_EXTRA = { stage: 'Stage o evento', altro: 'Altro' } as const

/** Sotto questo tempo fra apertura e invio non e' una persona. */
export const TEMPO_MINIMO_MS = 3000

/**
 * Quali campi facoltativi il modulo chiede. Vengono dal global Contatti e li
 * rilegge la Server Action: un campo spento a CMS non deve poter essere
 * imposto da un HTML costruito a mano, ne' restare obbligatorio sul server.
 */
export type OpzioniModulo = {
  dataNascita: boolean
  percorso: boolean
  messaggio: boolean
}

export const OPZIONI_DI_SERIE: OpzioniModulo = {
  dataNascita: true,
  percorso: true,
  messaggio: true,
}

const CAMPI: CampoRichiesta[] = [
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

export function leggi(dati: FormData): ValoriRichiesta {
  const valori = {} as ValoriRichiesta
  for (const campo of CAMPI) {
    const v = dati.get(campo)
    valori[campo] = typeof v === 'string' ? v.trim() : ''
  }
  return valori
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TELEFONO = /^\+?\d{6,15}$/
const DATA = /^\d{4}-\d{2}-\d{2}$/

export function valida(
  v: ValoriRichiesta,
  opzioni: OpzioniModulo = OPZIONI_DI_SERIE,
): ErroriRichiesta {
  const errori: ErroriRichiesta = {}

  if (!v.cognome) errori.cognome = 'Scrivi il tuo cognome.'
  else if (v.cognome.length > 80) errori.cognome = 'Il cognome puo avere al massimo 80 caratteri.'

  if (!v.nome) errori.nome = 'Scrivi il tuo nome.'
  else if (v.nome.length > 80) errori.nome = 'Il nome puo avere al massimo 80 caratteri.'

  if (!v.email || v.email.length > 120 || !EMAIL.test(v.email)) {
    errori.email = 'Scrivi un indirizzo email valido, ad esempio nome@dominio.it.'
  }

  const cifre = v.telefono.replace(/[\s.()-]/g, '')
  if (!cifre || !TELEFONO.test(cifre)) {
    errori.telefono = 'Scrivi un numero di telefono con almeno 6 cifre.'
  }

  if (opzioni.dataNascita && (!DATA.test(v.dataNascita) || !dataPlausibile(v.dataNascita))) {
    errori.dataNascita = 'Scrivi la data di nascita nel formato giorno/mese/anno.'
  }

  if (!/^\d+$/.test(v.sede)) errori.sede = 'Scegli il centro tecnico che ti interessa.'

  if (opzioni.percorso && v.corso && !/^\d+$/.test(v.corso) && !Object.hasOwn(CORSO_EXTRA, v.corso)) {
    errori.corso = 'Scegli una voce dall elenco.'
  }

  if (opzioni.messaggio && v.messaggio.length > 2000) {
    errori.messaggio = 'Il messaggio puo avere al massimo 2000 caratteri.'
  }

  if (v.consenso !== 'on') {
    errori.consenso = 'Per inviare la richiesta devi accettare il trattamento dei dati.'
  }

  return errori
}

function dataPlausibile(iso: string) {
  const data = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== iso) return false
  return data >= new Date('1900-01-01T00:00:00Z') && data <= new Date()
}
