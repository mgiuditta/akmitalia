import type { GlobalConfig } from 'payload'

import { authenticated, publicRead } from '../access'

export const Contatti: GlobalConfig = {
  slug: 'contatti',
  label: 'Contatti',
  access: { read: publicRead, update: authenticated },
  admin: { group: 'Pagine fisse' },
  fields: [
    { name: 'indirizzo', type: 'textarea', label: 'Indirizzo' },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'telefono', type: 'text', label: 'Telefono' },
      ],
    },
    {
      name: 'social',
      type: 'array',
      label: 'Social',
      fields: [
        {
          name: 'piattaforma',
          type: 'select',
          required: true,
          label: 'Piattaforma',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'LinkedIn', value: 'linkedin' },
          ] as const,
        },
        { name: 'url', type: 'text', required: true, label: 'URL' },
      ],
    },
    {
      name: 'pdfOrari',
      type: 'upload',
      relationTo: 'media',
      label: 'PDF orari di stagione',
      admin: { description: 'Resta scaricabile, ma gli orari veri stanno nelle schede centro.' },
    },
  ],
}
