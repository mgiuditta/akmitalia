import type { CollectionConfig } from 'payload'

import { authenticated, noOne } from '../access'

/**
 * Preiscrizioni inviate dal form pubblico.
 *
 * Sono dati dichiarati dall utente: nell admin si leggono, non si modificano.
 * Restano editabili solo `stato` e `note`, che sono nostri.
 *
 * `create: noOne` blocca admin e REST API; la Server Action passa comunque perche
 * la Local API usa `overrideAccess: true` di default.
 *
 * `delete` resta consentita allo staff: senza, una richiesta di cancellazione dati
 * (GDPR art. 17) non sarebbe eseguibile dall admin.
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
    defaultColumns: ['cognome', 'nome', 'sede', 'stato', 'createdAt'],
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
      name: 'emailInviata',
      type: 'checkbox',
      label: 'Notifica email inviata',
      defaultValue: false,
      admin: {
        ...soloLettura,
        position: 'sidebar',
        description: 'Se e spenta la richiesta e arrivata ma la mail di avviso no: va guardata a mano.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'cognome', type: 'text', required: true, label: 'Cognome', admin: soloLettura },
        { name: 'nome', type: 'text', required: true, label: 'Nome', admin: soloLettura },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, label: 'Email', admin: soloLettura },
        { name: 'telefono', type: 'text', label: 'Telefono', admin: soloLettura },
      ],
    },
    { name: 'dataNascita', type: 'date', label: 'Data di nascita', admin: soloLettura },
    {
      name: 'sede',
      type: 'relationship',
      relationTo: 'sedi',
      label: 'Centro tecnico',
      index: true,
      admin: soloLettura,
    },
    {
      name: 'sedeIndicata',
      type: 'text',
      label: 'Centro indicato',
      admin: {
        ...soloLettura,
        description: 'Quello che l utente ha scelto nel form, testuale. Resta anche se il centro cambia nome.',
      },
    },
    {
      name: 'corso',
      type: 'relationship',
      relationTo: 'corsi',
      label: 'Percorso di interesse',
      admin: soloLettura,
    },
    {
      name: 'corsoIndicato',
      type: 'text',
      label: 'Percorso indicato',
      admin: {
        ...soloLettura,
        description: 'Il form propone anche voci che non sono corsi («Stage o evento», «Altro»): quelle restano qui.',
      },
    },
    { name: 'messaggio', type: 'textarea', label: 'Messaggio', admin: soloLettura },
    {
      type: 'row',
      fields: [
        {
          name: 'consenso',
          type: 'checkbox',
          required: true,
          label: 'Consenso privacy',
          admin: soloLettura,
        },
        { name: 'consensoAt', type: 'date', label: 'Data consenso', admin: soloLettura },
      ],
    },
  ],
}
