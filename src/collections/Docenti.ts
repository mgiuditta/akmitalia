import type { CollectionConfig } from 'payload'

import { authenticated, publicRead } from '../access'

export const Docenti: CollectionConfig = {
  slug: 'docenti',
  labels: { singular: 'Docente', plural: 'Docenti' },
  access: {
    read: publicRead,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'ruolo', 'grado'],
    group: 'Contenuti',
  },
  defaultSort: 'nome',
  fields: [
    { name: 'nome', type: 'text', required: true, label: 'Nome' },
    { name: 'ruolo', type: 'text', label: 'Ruolo', admin: { description: 'Es. Istruttore, Trainer.' } },
    { name: 'grado', type: 'text', label: 'Grado' },
    { name: 'foto', type: 'upload', relationTo: 'media', label: 'Foto' },
    { name: 'bio', type: 'textarea', label: 'Biografia' },
  ],
}
