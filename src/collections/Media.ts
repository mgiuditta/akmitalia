import type { CollectionConfig } from 'payload'

import { authenticated, publicRead } from '../access'
import { legacyField } from '../fields/legacy'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'File', plural: 'Media' },
  access: {
    read: publicRead,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: { group: 'Sistema' },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Testo alternativo',
      admin: { description: 'Descrive l immagine a chi non la vede. Obbligatorio.' },
    },
    { name: 'didascalia', type: 'text', label: 'Didascalia' },
    legacyField(),
  ],
  upload: {
    focalPoint: true,
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, formatOptions: { format: 'webp' } },
      { name: 'card', width: 800, formatOptions: { format: 'webp' } },
      { name: 'hero', width: 1600, formatOptions: { format: 'webp' } },
    ],
  },
}
