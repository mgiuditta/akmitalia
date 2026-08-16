import type { Access } from 'payload'

/** Payload richiede un utente anche in lettura: il read pubblico va aperto esplicitamente. */
export const publicRead: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

/**
 * Blocca admin e REST API. La Local API passa comunque, perché di default
 * usa `overrideAccess: true`: è così che la Server Action del form crea le richieste.
 */
export const noOne: Access = () => false
