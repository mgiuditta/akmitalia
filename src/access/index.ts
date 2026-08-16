import type { Access } from 'payload'

/** Payload richiede un utente anche in lettura: il read pubblico va aperto esplicitamente. */
export const publicRead: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

/**
 * Per le collezioni con bozze: lo staff vede tutto, il pubblico solo il pubblicato.
 * Senza questo, una bozza mai pubblicata resterebbe leggibile dalla REST API.
 */
export const authenticatedOrPublished: Access = ({ req }) =>
  Boolean(req.user) || { _status: { equals: 'published' } }

/**
 * Blocca admin e REST API. La Local API passa comunque, perché di default
 * usa `overrideAccess: true`: è così che la Server Action del form crea le richieste.
 */
export const noOne: Access = () => false
