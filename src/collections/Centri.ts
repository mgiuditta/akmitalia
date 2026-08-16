import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, publicRead } from '../access'
import { revalidaCollezione } from '../hooks/revalidate'

const ORA = /^([01]\d|2[0-3])[:.][0-5]\d$/

const validaOra = (value: unknown) =>
  !value || (typeof value === 'string' && ORA.test(value)) || 'Usa il formato HH:MM (es. 20:00).'

export const Centri: CollectionConfig = {
  slug: 'centri',
  labels: { singular: 'Centro tecnico', plural: 'Centri tecnici' },
  access: {
    read: publicRead,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'provincia', 'palestra', 'attivo'],
    group: 'Contenuti',
  },
  defaultSort: 'nome',
  hooks: revalidaCollezione((doc) => ['/centri', `/centri/${doc.slug}`, '/']),
  fields: [
    { name: 'nome', type: 'text', required: true, label: 'Nome', admin: { description: 'Es. Abbiategrasso.' } },
    slugField({ useAsSlug: 'nome' }),
    { name: 'palestra', type: 'text', required: true, label: 'Palestra' },
    { name: 'indirizzo', type: 'text', required: true, label: 'Indirizzo' },
    {
      type: 'row',
      fields: [
        { name: 'citta', type: 'text', required: true, label: 'Città' },
        {
          name: 'provincia',
          type: 'text',
          required: true,
          label: 'Provincia',
          index: true,
          maxLength: 2,
          admin: { description: 'Sigla a 2 lettere. Raggruppa l’elenco dei centri.' },
          hooks: {
            beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value)],
          },
        },
        { name: 'cap', type: 'text', label: 'CAP' },
      ],
    },
    {
      name: 'mapsUrl',
      type: 'text',
      label: 'Link Google Maps',
      admin: { description: 'Il link "condividi" di Google Maps. Nessuna API, solo un link.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'lat',
          type: 'number',
          required: true,
          label: 'Latitudine',
          min: -90,
          max: 90,
          admin: { description: 'Es. 45.3985' },
        },
        {
          name: 'lng',
          type: 'number',
          required: true,
          label: 'Longitudine',
          min: -180,
          max: 180,
          admin: { description: 'Es. 8.9192' },
        },
      ],
    },
    {
      name: 'attivo',
      type: 'checkbox',
      label: 'Attivo',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Se disattivato il centro sparisce dal sito e dal form di preiscrizione.',
      },
    },
    { name: 'foto', type: 'upload', relationTo: 'media', label: 'Foto' },
    {
      name: 'docenti',
      type: 'relationship',
      relationTo: 'docenti',
      hasMany: true,
      label: 'Docenti',
    },
    {
      name: 'orari',
      type: 'array',
      label: 'Orari',
      labels: { singular: 'Orario', plural: 'Orari' },
      admin: {
        description: 'Sostituisce il PDF orari: questi sono gli orari veri, indicizzabili.',
      },
      fields: [
        {
          name: 'disciplina',
          type: 'relationship',
          relationTo: 'corsi',
          required: true,
          label: 'Disciplina',
        },
        {
          name: 'giorni',
          type: 'select',
          hasMany: true,
          required: true,
          label: 'Giorni',
          options: [
            { label: 'Lunedì', value: 'lun' },
            { label: 'Martedì', value: 'mar' },
            { label: 'Mercoledì', value: 'mer' },
            { label: 'Giovedì', value: 'gio' },
            { label: 'Venerdì', value: 'ven' },
            { label: 'Sabato', value: 'sab' },
            { label: 'Domenica', value: 'dom' },
          ] as const,
        },
        {
          type: 'row',
          fields: [
            { name: 'oraInizio', type: 'text', required: true, label: 'Dalle', validate: validaOra },
            { name: 'oraFine', type: 'text', required: true, label: 'Alle', validate: validaOra },
          ],
        },
        { name: 'note', type: 'text', label: 'Note' },
      ],
    },
    {
      name: 'eventi',
      type: 'join',
      collection: 'eventi',
      on: 'centro',
      label: 'Eventi in questo centro',
      admin: { defaultColumns: ['titolo', 'dataInizio'] },
    },
    {
      name: 'richieste',
      type: 'join',
      collection: 'richieste',
      on: 'centro',
      label: 'Preiscrizioni ricevute',
      admin: {
        allowCreate: false,
        defaultColumns: ['cognome', 'nome', 'stato', 'createdAt'],
      },
    },
  ],
}
