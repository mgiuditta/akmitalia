import type { CollectionConfig } from 'payload'

import { authenticated, publicRead } from '../access'
import { revalidaCollezione } from '../hooks/revalidate'

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
  // ponytail: le schede centro che citano il docente si aggiornano con l'ISR normale.
  // Se diventasse un problema, qui si leggono i centri dal join e si rigenerano i loro path.
  hooks: revalidaCollezione(() => ['/chi-siamo']),
  fields: [
    { name: 'nome', type: 'text', required: true, label: 'Nome' },
    {
      name: 'ruolo',
      type: 'select',
      label: 'Ruolo',
      // Enum chiuso: lasciarlo libero produce "Istruttore" / "istruttore" / "Ist." nello stesso elenco.
      options: [
        { label: 'Istruttore', value: 'istruttore' },
        { label: 'Trainer', value: 'trainer' },
        { label: 'Maestro', value: 'maestro' },
        { label: 'Direttore tecnico', value: 'direttore-tecnico' },
        { label: 'Presidente', value: 'presidente' },
      ] as const,
    },
    { name: 'grado', type: 'text', label: 'Grado', admin: { description: 'Es. cintura nera 2° dan.' } },
    { name: 'foto', type: 'upload', relationTo: 'media', label: 'Foto' },
    { name: 'bio', type: 'textarea', label: 'Biografia' },
    {
      name: 'centri',
      type: 'join',
      collection: 'centri',
      on: 'docenti',
      label: 'Insegna nei centri',
      admin: { allowCreate: false, defaultColumns: ['nome', 'provincia', 'attivo'] },
    },
  ],
}
