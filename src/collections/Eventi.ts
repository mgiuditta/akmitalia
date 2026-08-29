import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'

/**
 * Stage e seminari: guardano avanti, si ordinano per data futura, hanno una sede
 * e un link di iscrizione. Per questo non sono News.
 */
export const Eventi: CollectionConfig = {
  slug: 'eventi',
  labels: { singular: 'Evento', plural: 'Eventi' },
  versions: { drafts: true },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'titolo',
    defaultColumns: ['titolo', 'dataInizio', 'sede', '_status'],
    group: 'Contenuti',
  },
  defaultSort: '-dataInizio',
  fields: [
    { name: 'titolo', type: 'text', required: true, label: 'Titolo' },
    slugField({ useAsSlug: 'titolo' }),
    {
      type: 'row',
      fields: [
        { name: 'dataInizio', type: 'date', required: true, label: 'Data inizio', index: true },
        {
          name: 'dataFine',
          type: 'date',
          label: 'Data fine',
          validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
            const inizio = siblingData?.dataInizio
            if (!value || !inizio) return true
            return (
              new Date(String(value)) >= new Date(String(inizio)) ||
              'La data di fine non puo precedere quella di inizio.'
            )
          },
        },
      ],
    },
    {
      name: 'sede',
      type: 'relationship',
      relationTo: 'sedi',
      label: 'Centro tecnico',
      index: true,
      admin: { description: 'Se l evento si svolge in un centro tecnico.' },
    },
    {
      name: 'luogo',
      type: 'text',
      label: 'Luogo',
      admin: {
        description: 'Per gli eventi fuori dai centri. Se vuoto si usa l indirizzo del centro.',
        condition: (_, siblingData) => !siblingData?.sede,
      },
    },
    { name: 'copertina', type: 'upload', relationTo: 'media', label: 'Copertina' },
    {
      name: 'estratto',
      type: 'textarea',
      label: 'Estratto',
      maxLength: 300,
      admin: { description: 'Usato nell elenco e come descrizione di anteprima.' },
    },
    { name: 'descrizione', type: 'richText', label: 'Descrizione' },
    {
      name: 'corsi',
      type: 'relationship',
      relationTo: 'corsi',
      hasMany: true,
      label: 'Discipline coinvolte',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link iscrizione',
      admin: { description: 'Opzionale: modulo esterno, pagina Facebook, ecc.' },
    },
  ],
}
