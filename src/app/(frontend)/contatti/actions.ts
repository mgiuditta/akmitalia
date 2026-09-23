'use server'

import { getPayload } from 'payload'

import { published, siteUrl } from '@/components/data'
import config from '@/payload.config'
import {
  MIN_TIME_MS,
  extraItems,
  read,
  validate,
  type FormOptions,
  type RequestState,
} from './validation'

/**
 * L'unica scrittura del sito pubblico: la richiesta di /contatti.
 *
 * `richieste` ha `create: noOne`, che chiude admin e REST. La Local API passa
 * perche' di default usa `overrideAccess: true`: questo file e' l'unico punto
 * che la crea, e ogni campo che arriva dal browser viene riletto e rivalidato
 * qui, comprese le select, che si controllano sul database e non sull'HTML.
 *
 * L'avviso email e' un avviso: se non parte, la richiesta resta salvata con
 * `emailInviata` spento e l'admin la vede lo stesso. All'utente si dice che e'
 * arrivata, perche' e' vero.
 *
 * Anti-bot non visivo (PRODUCT.md): un campo nascosto che una persona non
 * compila e un timestamp che una persona non batte in tre secondi. Al bot si
 * risponde come a tutti: non gli si insegna niente.
 */

const THANKS = 'Grazie: la richiesta è arrivata. Ti ricontattiamo entro pochi giorni.'

export async function submitRequest(
  _prev: RequestState,
  data: FormData,
): Promise<RequestState> {
  const payload = await getPayload({ config: await config })
  const values = read(data)

  /* Le opzioni del modulo si rileggono qui e non arrivano dal client: un campo
     spento a CMS non deve poter tornare obbligatorio, ne' un campo spento
     riapparire in un POST costruito a mano. */
  const contacts = await payload.findGlobal({ slug: 'contatti', depth: 0 })
  const options: FormOptions = {
    dataNascita: contacts.modulo?.chiediDataNascita !== false,
    pathway: contacts.modulo?.chiediPercorso !== false,
    messaggio: contacts.modulo?.chiediMessaggio !== false,
    altreVoci: extraItems(contacts.modulo),
  }
  const thanks = contacts.modulo?.messaggioConferma || THANKS

  const site = String(data.get('sito') ?? '')
  const t = Number(data.get('t'))
  if (site || !Number.isFinite(t) || Date.now() - t < MIN_TIME_MS) {
    payload.logger.warn({ msg: 'Richiesta scartata dal filtro anti-bot', honeypot: Boolean(site) })
    return { ok: true, errors: {}, messaggio: thanks, values: {} }
  }

  /* Il «non sono un robot» visibile, solo se le chiavi ci sono. Chi fallisce
     la verifica riceve il modulo indietro con i valori: e' una persona con un
     token scaduto piu' spesso che un bot. */
  if (process.env.TURNSTILE_SECRET_KEY && !(await turnstileOk(data))) {
    return {
      ok: false,
      errors: {},
      values,
      messaggio: 'Conferma di non essere un robot e riprova.',
    }
  }

  const errors = validate(values, options)

  const center = errors.sede
    ? null
    : ((
        await payload.find({
          collection: 'sedi',
          depth: 0,
          limit: 1,
          select: { nome: true },
          where: {
            and: [{ id: { equals: Number(values.sede) } }, { attivo: { equals: true } }, published],
          },
        })
      ).docs[0] ?? null)
  if (!errors.sede && !center) {
    errors.sede = 'Il centro scelto non è più disponibile: scegline un altro.'
  }

  let courseId: number | null = null
  let requestedCourse: string | null = null
  if (options.pathway && !errors.corso && values.corso) {
    if (options.altreVoci.includes(values.corso)) {
      requestedCourse = values.corso
    } else {
      const course = (
        await payload.find({
          collection: 'corsi',
          depth: 0,
          limit: 1,
          select: { nome: true },
          where: { and: [{ id: { equals: Number(values.corso) } }, published] },
        })
      ).docs[0]
      if (course) {
        courseId = course.id
        requestedCourse = course.nome
      } else {
        errors.corso = 'Il percorso scelto non è più disponibile: scegline un altro.'
      }
    }
  }

  if (Object.keys(errors).length > 0 || !center) {
    return { ok: false, errors, messaggio: 'Controlla i campi segnalati qui sotto.', values }
  }

  let id: number
  try {
    const created = await payload.create({
      collection: 'richieste',
      data: {
        stato: 'nuova',
        cognome: values.cognome,
        nome: values.nome,
        email: values.email,
        telefono: values.telefono,
        dataNascita: options.dataNascita ? values.dataNascita : null,
        sede: center.id,
        sedeIndicata: center.nome,
        corso: courseId,
        corsoIndicato: requestedCourse,
        messaggio: options.messaggio ? values.messaggio || null : null,
        consenso: true,
      },
    })
    id = created.id
  } catch (err) {
    payload.logger.error({ err, msg: 'Creazione richiesta fallita' })
    return {
      ok: false,
      errors: {},
      values,
      messaggio: 'Non siamo riusciti a salvare la richiesta. Riprova tra poco o scrivici via email.',
    }
  }

  try {
    const a = contacts.emailRichieste || contacts.email
    if (payload.email.name === 'console') {
      payload.logger.warn({
        msg: `SMTP non configurato: avviso per la richiesta ${id} non inviato (a ${a})`,
      })
    } else {
      const rows = [
        `Nuova richiesta dal sito, numero ${id}.`,
        '',
        `Cognome e nome: ${values.cognome} ${values.nome}`,
        `Email: ${values.email}`,
        `Telefono: ${values.telefono}`,
        options.dataNascita ? `Data di nascita: ${values.dataNascita}` : null,
        `Centro tecnico: ${center.nome}`,
        requestedCourse ? `Percorso: ${requestedCourse}` : null,
        '',
        values.messaggio ? `Messaggio:\n${values.messaggio}` : 'Nessun messaggio.',
        '',
        `Nel pannello: ${siteUrl()}/admin/collections/richieste/${id}`,
      ].filter((r): r is string => r !== null)

      await payload.sendEmail({
        to: a,
        replyTo: values.email,
        subject: `Nuova richiesta: ${values.cognome} ${values.nome} (${center.nome})`,
        text: rows.join('\n'),
      })
      await payload.update({ collection: 'richieste', id, data: { emailInviata: true } })
    }
  } catch (err) {
    payload.logger.error({ err, msg: `Invio avviso email fallito per la richiesta ${id}` })
  }

  return { ok: true, errors: {}, messaggio: thanks, values: {} }
}

async function turnstileOk(data: FormData) {
  const response = data.get('cf-turnstile-response')
  if (typeof response !== 'string' || !response) return false
  const body = new FormData()
  body.set('secret', process.env.TURNSTILE_SECRET_KEY ?? '')
  body.set('response', response)
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const outcome = (await r.json()) as { success?: boolean }
    return outcome.success === true
  } catch {
    return false
  }
}
