import type { GlobalConfig } from 'payload'

import { authenticated, publicRead } from '../access'
import { revalidaGlobal } from '../hooks/revalidate'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  versions: true,
  access: { read: publicRead, update: authenticated },
  admin: { group: 'Pagine fisse' },
  hooks: revalidaGlobal('/'),
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero',
      fields: [
        { name: 'titolo', type: 'text', required: true, label: 'Titolo' },
        { name: 'sottotitolo', type: 'textarea', label: 'Sottotitolo' },
        {
          type: 'row',
          fields: [
            { name: 'ctaLabel', type: 'text', label: 'Testo del pulsante' },
            { name: 'ctaHref', type: 'text', label: 'Link del pulsante' },
          ],
        },
        { name: 'immagine', type: 'upload', relationTo: 'media', label: 'Immagine' },
      ],
    },
    {
      name: 'inEvidenza',
      type: 'array',
      label: 'In evidenza',
      maxRows: 3,
      fields: [
        { name: 'titolo', type: 'text', required: true, label: 'Titolo' },
        { name: 'testo', type: 'textarea', label: 'Testo' },
        { name: 'href', type: 'text', label: 'Link' },
        { name: 'immagine', type: 'upload', relationTo: 'media', label: 'Immagine' },
      ],
    },
    {
      name: 'video',
      type: 'group',
      label: 'Video in evidenza',
      fields: [
        {
          name: 'youtubeId',
          type: 'text',
          label: 'ID del video YouTube',
          admin: { description: 'Solo l’ID, es. dQw4w9WgXcQ. Il video si carica solo al click.' },
        },
        { name: 'copertina', type: 'upload', relationTo: 'media', label: 'Immagine di copertina' },
      ],
    },
  ],
}
