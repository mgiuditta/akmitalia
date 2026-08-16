import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, publicRead } from '../access'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Notizia', plural: 'News' },
  access: {
    read: publicRead,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'titolo',
    defaultColumns: ['titolo', 'data'],
    group: 'Contenuti',
  },
  defaultSort: '-data',
  fields: [
    { name: 'titolo', type: 'text', required: true, label: 'Titolo' },
    slugField({ useAsSlug: 'titolo' }),
    {
      name: 'data',
      type: 'date',
      required: true,
      label: 'Data',
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
    { name: 'copertina', type: 'upload', relationTo: 'media', label: 'Copertina' },
    {
      name: 'estratto',
      type: 'textarea',
      label: 'Estratto',
      maxLength: 200,
      admin: { description: 'Usato nell’elenco e come meta description.' },
    },
    { name: 'contenuto', type: 'richText', label: 'Contenuto' },
  ],
}
