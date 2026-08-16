import type { CollectionConfig } from 'payload'

import { authenticated, noOne } from '../access'

/**
 * Preiscrizioni inviate dal form pubblico.
 *
 * Sono dati dichiarati dall'utente: nell'admin si leggono, non si modificano.
 * Restano editabili solo `stato` e `note`, che sono nostri.
 *
 * `create: noOne` blocca admin e REST API; la Server Action passa comunque
 * perché la Local API usa `overrideAccess: true` di default.
 *
 * `delete` resta invece consentita allo staff: senza, una richiesta di
 * cancellazione dati (GDPR art. 17) non sarebbe eseguibile dall'admin.
 */
const soloLettura = { readOnly: true } as const

export const Richieste: CollectionConfig = {
  slug: 'richieste',
  labels: { singular: 'Richiesta', plural: 'Richieste' },
  access: {
    create: noOne,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'cognome',
    defaultColumns: ['cognome', 'nome', 'centro', 'stato', 'createdAt'],
    group: 'Gestione',
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Il timestamp del consenso lo mette il server: quello che arriva dal client non prova nulla.
        if (operation === 'create' && data.consenso) {
          data.consensoAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'stato',
      type: 'select',
      required: true,
      label: 'Stato',
      defaultValue: 'nuova',
      index: true,
      options: [
        { label: 'Nuova', value: 'nuova' },
        { label: 'Contattata', value: 'contattata' },
        { label: 'Iscritta', value: 'iscritta' },
        { label: 'Archiviata', value: 'archiviata' },
      ] as const,
      admin: { position: 'sidebar' },
    },
    { name: 'note', type: 'textarea', label: 'Note interne', admin: { position: 'sidebar' } },
    {
      name: 'centro',
      type: 'relationship',
      relationTo: 'centri',
      required: true,
      label: 'Centro',
      admin: soloLettura,
    },
    {
      type: 'row',
      fields: [
        { name: 'cognome', type: 'text', required: true, label: 'Cognome', admin: soloLettura },
        { name: 'nome', type: 'text', required: true, label: 'Nome', admin: soloLettura },
      ],
    },
    { name: 'dataNascita', type: 'date', label: 'Data di nascita', admin: soloLettura },
    {
      type: 'row',
      fields: [
        { name: 'telefono', type: 'text', label: 'Telefono', admin: soloLettura },
        { name: 'email', type: 'email', required: true, label: 'Email', admin: soloLettura },
      ],
    },
    { name: 'messaggio', type: 'textarea', label: 'Messaggio', admin: soloLettura },
    {
      type: 'row',
      fields: [
        { name: 'consenso', type: 'checkbox', required: true, label: 'Consenso privacy', admin: soloLettura },
        { name: 'consensoAt', type: 'date', label: 'Data consenso', admin: soloLettura },
      ],
    },
  ],
}
