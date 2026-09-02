'use server'

import { getPayload } from 'payload'

import { pubblicato, sitoUrl } from '@/componenti/dati'
import config from '@/payload.config'
import {
  TEMPO_MINIMO_MS,
  altreVoci,
  leggi,
  valida,
  type OpzioniModulo,
  type StatoRichiesta,
} from './validazione'

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

const GRAZIE = 'Grazie: la richiesta e arrivata. Ti ricontattiamo entro pochi giorni.'

export async function inviaRichiesta(
  _prec: StatoRichiesta,
  dati: FormData,
): Promise<StatoRichiesta> {
  const payload = await getPayload({ config: await config })
  const valori = leggi(dati)

  /* Le opzioni del modulo si rileggono qui e non arrivano dal client: un campo
     spento a CMS non deve poter tornare obbligatorio, ne' un campo spento
     riapparire in un POST costruito a mano. */
  const contatti = await payload.findGlobal({ slug: 'contatti', depth: 0 })
  const opzioni: OpzioniModulo = {
    dataNascita: contatti.modulo?.chiediDataNascita !== false,
    percorso: contatti.modulo?.chiediPercorso !== false,
    messaggio: contatti.modulo?.chiediMessaggio !== false,
    altreVoci: altreVoci(contatti.modulo),
  }
  const grazie = contatti.modulo?.messaggioConferma || GRAZIE

  const sito = String(dati.get('sito') ?? '')
  const t = Number(dati.get('t'))
  if (sito || !Number.isFinite(t) || Date.now() - t < TEMPO_MINIMO_MS) {
    payload.logger.warn({ msg: 'Richiesta scartata dal filtro anti-bot', honeypot: Boolean(sito) })
    return { ok: true, errori: {}, messaggio: grazie, valori: {} }
  }

  /* Il «non sono un robot» visibile, solo se le chiavi ci sono. Chi fallisce
     la verifica riceve il modulo indietro con i valori: e' una persona con un
     token scaduto piu' spesso che un bot. */
  if (process.env.TURNSTILE_SECRET_KEY && !(await turnstileOk(dati))) {
    return {
      ok: false,
      errori: {},
      valori,
      messaggio: 'Conferma di non essere un robot e riprova.',
    }
  }

  const errori = valida(valori, opzioni)

  const sede = errori.sede
    ? null
    : ((
        await payload.find({
          collection: 'sedi',
          depth: 0,
          limit: 1,
          select: { nome: true },
          where: {
            and: [{ id: { equals: Number(valori.sede) } }, { attivo: { equals: true } }, pubblicato],
          },
        })
      ).docs[0] ?? null)
  if (!errori.sede && !sede) {
    errori.sede = 'Il centro scelto non e piu disponibile: scegline un altro.'
  }

  let corsoId: number | null = null
  let corsoIndicato: string | null = null
  if (opzioni.percorso && !errori.corso && valori.corso) {
    if (opzioni.altreVoci.includes(valori.corso)) {
      corsoIndicato = valori.corso
    } else {
      const corso = (
        await payload.find({
          collection: 'corsi',
          depth: 0,
          limit: 1,
          select: { nome: true },
          where: { and: [{ id: { equals: Number(valori.corso) } }, pubblicato] },
        })
      ).docs[0]
      if (corso) {
        corsoId = corso.id
        corsoIndicato = corso.nome
      } else {
        errori.corso = 'Il percorso scelto non e piu disponibile: scegline un altro.'
      }
    }
  }

  if (Object.keys(errori).length > 0 || !sede) {
    return { ok: false, errori, messaggio: 'Controlla i campi segnalati qui sotto.', valori }
  }

  let id: number
  try {
    const creata = await payload.create({
      collection: 'richieste',
      data: {
        stato: 'nuova',
        cognome: valori.cognome,
        nome: valori.nome,
        email: valori.email,
        telefono: valori.telefono,
        dataNascita: opzioni.dataNascita ? valori.dataNascita : null,
        sede: sede.id,
        sedeIndicata: sede.nome,
        corso: corsoId,
        corsoIndicato,
        messaggio: opzioni.messaggio ? valori.messaggio || null : null,
        consenso: true,
      },
    })
    id = creata.id
  } catch (err) {
    payload.logger.error({ err, msg: 'Creazione richiesta fallita' })
    return {
      ok: false,
      errori: {},
      valori,
      messaggio: 'Non siamo riusciti a salvare la richiesta. Riprova tra poco o scrivici via email.',
    }
  }

  try {
    const a = contatti.emailRichieste || contatti.email
    if (payload.email.name === 'console') {
      payload.logger.warn({
        msg: `SMTP non configurato: avviso per la richiesta ${id} non inviato (a ${a})`,
      })
    } else {
      const righe = [
        `Nuova richiesta dal sito, numero ${id}.`,
        '',
        `Cognome e nome: ${valori.cognome} ${valori.nome}`,
        `Email: ${valori.email}`,
        `Telefono: ${valori.telefono}`,
        opzioni.dataNascita ? `Data di nascita: ${valori.dataNascita}` : null,
        `Centro tecnico: ${sede.nome}`,
        corsoIndicato ? `Percorso: ${corsoIndicato}` : null,
        '',
        valori.messaggio ? `Messaggio:\n${valori.messaggio}` : 'Nessun messaggio.',
        '',
        `Nel pannello: ${sitoUrl()}/admin/collections/richieste/${id}`,
      ].filter((r): r is string => r !== null)

      await payload.sendEmail({
        to: a,
        replyTo: valori.email,
        subject: `Nuova richiesta: ${valori.cognome} ${valori.nome} (${sede.nome})`,
        text: righe.join('\n'),
      })
      await payload.update({ collection: 'richieste', id, data: { emailInviata: true } })
    }
  } catch (err) {
    payload.logger.error({ err, msg: `Invio avviso email fallito per la richiesta ${id}` })
  }

  return { ok: true, errori: {}, messaggio: grazie, valori: {} }
}

async function turnstileOk(dati: FormData) {
  const risposta = dati.get('cf-turnstile-response')
  if (typeof risposta !== 'string' || !risposta) return false
  const corpo = new FormData()
  corpo.set('secret', process.env.TURNSTILE_SECRET_KEY ?? '')
  corpo.set('response', risposta)
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: corpo,
    })
    const esito = (await r.json()) as { success?: boolean }
    return esito.success === true
  } catch {
    return false
  }
}
