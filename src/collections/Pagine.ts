import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, publicRead } from '../access'

/**
 * Solo le pagine legali: privacy, cookie, 5x1000, legal disclaimer.
 * ponytail: non è un page-builder e non deve diventarlo — tutto il resto sta nei globals.
 */
export const Pagine: CollectionConfig = {
  slug: 'pagine',
  labels: { singular: 'Pagina', plural: 'Pagine' },
  access: {
    read: publicRead,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'titolo',
    defaultColumns: ['titolo', 'slug', 'updatedAt'],
    group: 'Contenuti',
  },
  fields: [
    { name: 'titolo', type: 'text', required: true, label: 'Titolo' },
    slugField({ useAsSlug: 'titolo' }),
    { name: 'contenuto', type: 'richText', label: 'Contenuto' },
  ],
}
