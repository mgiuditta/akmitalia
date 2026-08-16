import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, publicRead } from '../access'
import { revalidaCollezione } from '../hooks/revalidate'

export const Corsi: CollectionConfig = {
  slug: 'corsi',
  labels: { singular: 'Corso', plural: 'Corsi' },
  access: {
    read: publicRead,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'target', 'ordine'],
    group: 'Contenuti',
  },
  defaultSort: 'ordine',
  hooks: revalidaCollezione((doc) => ['/corsi', `/corsi/${doc.slug}`, '/']),
  fields: [
    { name: 'nome', type: 'text', required: true, label: 'Nome' },
    slugField({ useAsSlug: 'nome' }),
    {
      name: 'target',
      type: 'select',
      required: true,
      label: 'Destinatari',
      options: [
        { label: 'Adulti', value: 'adulti' },
        { label: 'Ragazzi', value: 'ragazzi' },
        { label: 'Bambini', value: 'bambini' },
        { label: 'Donne', value: 'donne' },
        { label: 'Istruttori', value: 'istruttori' },
        { label: 'Aziende e Forze dell’Ordine', value: 'aziende-ffoo' },
      ] as const,
    },
    {
      name: 'sommario',
      type: 'textarea',
      label: 'Sommario',
      maxLength: 300,
      admin: { description: 'Una o due righe, usate nelle card e nella meta description.' },
    },
    { name: 'descrizione', type: 'richText', label: 'Descrizione' },
    { name: 'immagine', type: 'upload', relationTo: 'media', label: 'Immagine' },
    {
      name: 'ordine',
      type: 'number',
      label: 'Ordine',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Ordine di comparsa nell’elenco corsi.' },
    },
    {
      name: 'centri',
      type: 'join',
      collection: 'centri',
      on: 'orari.disciplina',
      label: 'Dove si pratica',
      admin: {
        allowCreate: false,
        defaultColumns: ['nome', 'provincia', 'attivo'],
        description: 'Compilato dagli orari delle schede centro: qui non si modifica.',
      },
    },
  ],
}
