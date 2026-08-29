import type { Access } from 'payload'

/** Payload chiude tutto di default: la lettura pubblica va aperta esplicitamente. */
export const publicRead: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

/**
 * Collezioni con bozze: lo staff vede tutto, il pubblico solo il pubblicato.
 * Senza questo una bozza mai pubblicata resterebbe leggibile dalla REST API.
 */
export const authenticatedOrPublished: Access = ({ req }) =>
  Boolean(req.user) || { _status: { equals: 'published' } }

/**
 * Blocca admin e REST API. La Local API passa comunque, perche di default usa
 * `overrideAccess: true`: e cosi che la Server Action del form crea le richieste.
 */
export const noOne: Access = () => false
