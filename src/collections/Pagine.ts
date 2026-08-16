import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'
import { revalidaCollezione } from '../hooks/revalidate'

/**
 * Solo le pagine legali: privacy, cookie, 5x1000, legal disclaimer.
 * ponytail: non è un page-builder e non deve diventarlo — tutto il resto sta nei globals.
 */
export const Pagine: CollectionConfig = {
  slug: 'pagine',
  labels: { singular: 'Pagina', plural: 'Pagine' },
  versions: { drafts: true },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'titolo',
    defaultColumns: ['titolo', 'slug', 'updatedAt'],
    group: 'Contenuti',
  },
  hooks: revalidaCollezione((doc) => [`/${doc.slug}`]),
  fields: [
    { name: 'titolo', type: 'text', required: true, label: 'Titolo' },
    slugField({ useAsSlug: 'titolo' }),
    { name: 'contenuto', type: 'richText', label: 'Contenuto' },
  ],
}
