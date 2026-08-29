import type { CollectionConfig } from 'payload'

/**
 * Solo staff AKM: nessuna registrazione pubblica.
 * ponytail: niente ruoli finche tutti hanno gli stessi permessi.
 */
export const Utenti: CollectionConfig = {
  slug: 'utenti',
  labels: { singular: 'Utente', plural: 'Utenti' },
  auth: true,
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'email'],
    group: 'Sistema',
  },
  fields: [
    // L email la aggiunge `auth: true`.
    { name: 'nome', type: 'text', required: true, label: 'Nome' },
  ],
}
