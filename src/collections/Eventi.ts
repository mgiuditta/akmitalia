import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'
import { revalidaCollezione } from '../hooks/revalidate'

export const Eventi: CollectionConfig = {
  slug: 'eventi',
  labels: { singular: 'Evento', plural: 'Eventi' },
  versions: { drafts: true },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'titolo',
    defaultColumns: ['titolo', 'dataInizio', 'centro'],
    group: 'Contenuti',
  },
  defaultSort: 'dataInizio',
  hooks: revalidaCollezione((doc) => ['/eventi', `/eventi/${doc.slug}`, '/']),
  fields: [
    { name: 'titolo', type: 'text', required: true, label: 'Titolo' },
    slugField({ useAsSlug: 'titolo' }),
    {
      type: 'row',
      fields: [
        { name: 'dataInizio', type: 'date', required: true, label: 'Data inizio', index: true },
        { name: 'dataFine', type: 'date', label: 'Data fine' },
      ],
    },
    {
      name: 'centro',
      type: 'relationship',
      relationTo: 'centri',
      label: 'Centro',
      admin: { description: 'Se l’evento si svolge in un centro tecnico.' },
    },
    {
      name: 'luogo',
      type: 'text',
      label: 'Luogo',
      admin: { description: 'Per gli eventi fuori dai centri. Se vuoto si usa l’indirizzo del centro.' },
    },
    { name: 'descrizione', type: 'richText', label: 'Descrizione' },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link iscrizione',
      admin: { description: 'Opzionale: modulo esterno, pagina Facebook, ecc.' },
    },
  ],
}
