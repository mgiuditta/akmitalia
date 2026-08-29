import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'
import { legacyField } from '../fields/legacy'

/**
 * 235 notizie dal 2011 a oggi. Le 3 categorie e i 458 tag di WordPress non
 * arrivano: erano keyword SEO con doppioni, e una sola categoria copriva tutto.
 * Al loro posto un enum chiuso di quattro voci, piu i legami veri (sedi, istruttori).
 */
export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Notizia', plural: 'News' },
  versions: { drafts: true },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'titolo',
    defaultColumns: ['titolo', 'data', 'tipo', '_status'],
    group: 'Contenuti',
  },
  defaultSort: '-data',
  fields: [
    { name: 'titolo', type: 'text', required: true, label: 'Titolo' },
    slugField({ useAsSlug: 'titolo' }),
    {
      name: 'data',
      type: 'date',
      required: true,
      label: 'Data',
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      label: 'Tipo',
      defaultValue: 'notizia',
      index: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Notizia', value: 'notizia' },
        { label: 'Stage o seminario', value: 'stage-seminario' },
        { label: 'Rassegna stampa', value: 'rassegna-stampa' },
        { label: 'Comunicato', value: 'comunicato' },
      ] as const,
    },
    { name: 'copertina', type: 'upload', relationTo: 'media', label: 'Copertina' },
    {
      name: 'estratto',
      type: 'textarea',
      label: 'Estratto',
      maxLength: 300,
      admin: { description: 'Usato nell elenco e come descrizione di anteprima.' },
    },
    { name: 'contenuto', type: 'richText', label: 'Contenuto' },
    {
      type: 'row',
      fields: [
        {
          name: 'sedi',
          type: 'relationship',
          relationTo: 'sedi',
          hasMany: true,
          label: 'Centri citati',
        },
        {
          name: 'istruttori',
          type: 'relationship',
          relationTo: 'istruttori',
          hasMany: true,
          label: 'Istruttori citati',
        },
      ],
    },
    legacyField(),
  ],
}
