import type { GlobalConfig } from 'payload'

import { authenticated, publicRead } from '../access'

export const Contatti: GlobalConfig = {
  slug: 'contatti',
  label: 'Contatti',
  versions: true,
  access: { read: publicRead, update: authenticated },
  admin: { group: 'Sistema' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, label: 'Email' },
        { name: 'telefono', type: 'text', label: 'Telefono' },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp',
          admin: { description: 'In formato internazionale, es. +393401234567.' },
        },
      ],
    },
    {
      name: 'sedeLegale',
      type: 'group',
      label: 'Sede legale',
      fields: [
        { name: 'via', type: 'text', label: 'Via e numero' },
        {
          type: 'row',
          fields: [
            { name: 'cap', type: 'text', label: 'CAP', maxLength: 5 },
            { name: 'citta', type: 'text', label: 'Citta' },
            { name: 'provincia', type: 'text', label: 'Provincia', maxLength: 2 },
          ],
        },
      ],
    },
    {
      name: 'social',
      type: 'array',
      label: 'Social',
      labels: { singular: 'Profilo', plural: 'Profili' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'rete',
              type: 'select',
              required: true,
              label: 'Rete',
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'LinkedIn', value: 'linkedin' },
              ] as const,
            },
            { name: 'url', type: 'text', required: true, label: 'Indirizzo' },
          ],
        },
      ],
    },
  ],
}
