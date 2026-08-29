import type { Field } from 'payload'

/**
 * Aggancio ai contenuti WordPress: rende l'import ri-eseguibile (upsert per wpId
 * invece di duplicare 235 post) e permette di verificare i redirect.
 *
 * ponytail: e un ponteggio. Quando la migrazione e chiusa si cancella questo file
 * e le righe che lo usano.
 */
export const legacyField = (): Field => ({
  name: 'legacy',
  type: 'group',
  label: 'Origine WordPress',
  admin: { hidden: true },
  fields: [
    {
      name: 'wpId',
      type: 'number',
      label: 'ID WordPress',
      index: true,
      unique: true,
      admin: { description: 'Chiave di deduplicazione dell import.' },
    },
    { name: 'url', type: 'text', label: 'URL originale' },
  ],
})
