import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'
import { revalidaCollezione } from '../hooks/revalidate'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Notizia', plural: 'News' },
  versions: { drafts: true },
  access: {
    read: authenticatedOrPublished,
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
  hooks: revalidaCollezione((doc) => ['/news', `/news/${doc.slug}`, '/']),
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
