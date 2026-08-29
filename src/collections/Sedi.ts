import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'
import { legacyField } from '../fields/legacy'

const ORA = /^([01]\d|2[0-3])[:.][0-5]\d$/

const validaOra = (value: unknown) =>
  !value || (typeof value === 'string' && ORA.test(value)) || 'Usa il formato HH:MM (es. 20:00).'

/**
 * Lo slug della collezione e `sedi` come la URL pubblica: un solo nome da ricordare.
 * Le etichette dicono «Centro tecnico» perche e cosi che AKM li chiama.
 *
 * `attivo` non e la bozza: una sede pubblicata ma chiusa per la stagione resta
 * pubblicata e sparisce dagli elenchi. La bozza e una sede non ancora annunciata.
 */
export const Sedi: CollectionConfig = {
  slug: 'sedi',
  labels: { singular: 'Centro tecnico', plural: 'Centri tecnici' },
  versions: { drafts: true },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'indirizzo.citta', 'indirizzo.provincia', 'attivo', '_status'],
    group: 'Contenuti',
  },
  defaultSort: 'nome',
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      label: 'Nome',
      admin: { description: 'Es. «Abbiategrasso - Dynamic Dance School».' },
    },
    slugField({ useAsSlug: 'nome' }),
    { name: 'palestra', type: 'text', label: 'Palestra' },
    {
      name: 'indirizzo',
      type: 'group',
      label: 'Indirizzo',
      fields: [
        {
          name: 'via',
          type: 'text',
          label: 'Via e numero',
          // Non obbligatoria: due centri su quaranta non ce l hanno nemmeno su WordPress.
        },
        {
          type: 'row',
          fields: [
            { name: 'cap', type: 'text', label: 'CAP', maxLength: 5 },
            { name: 'citta', type: 'text', required: true, label: 'Citta' },
            {
              name: 'provincia',
              type: 'text',
              label: 'Provincia',
              index: true,
              maxLength: 2,
              admin: { description: 'Sigla a 2 lettere. Raggruppa l elenco dei centri.' },
              hooks: {
                beforeValidate: [
                  ({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value),
                ],
              },
            },
            {
              name: 'nazione',
              type: 'select',
              required: true,
              label: 'Nazione',
              defaultValue: 'IT',
              index: true,
              // Chiasso e in Svizzera: su WordPress era «Svizzera», «Italia» e «Italy» insieme.
              options: [
                { label: 'Italia', value: 'IT' },
                { label: 'Svizzera', value: 'CH' },
              ] as const,
            },
          ],
        },
      ],
    },
    {
      name: 'coordinate',
      type: 'group',
      label: 'Coordinate',
      admin: { description: 'Servono alla mappa dei centri. Le prendi dal link di Google Maps.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'lat', type: 'number', required: true, label: 'Latitudine', min: -90, max: 90 },
            { name: 'lng', type: 'number', required: true, label: 'Longitudine', min: -180, max: 180 },
          ],
        },
      ],
    },
    {
      name: 'mapsUrl',
      type: 'text',
      label: 'Link Google Maps',
      admin: { description: 'Il link «condividi» di Google Maps. Nessuna API, solo un link.' },
    },
    {
      name: 'attivo',
      type: 'checkbox',
      label: 'Attivo',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Se spento il centro sparisce dagli elenchi e dal form di preiscrizione.',
      },
    },
    { name: 'descrizione', type: 'textarea', label: 'Descrizione' },
    { name: 'foto', type: 'upload', relationTo: 'media', label: 'Foto' },
    {
      name: 'istruttori',
      type: 'relationship',
      relationTo: 'istruttori',
      hasMany: true,
      label: 'Istruttori',
    },
    {
      name: 'orari',
      type: 'array',
      label: 'Orari',
      labels: { singular: 'Orario', plural: 'Orari' },
      admin: { description: 'Sostituisce il PDF orari: questi sono orari veri, indicizzabili.' },
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
            { label: 'Lunedi', value: 'lun' },
            { label: 'Martedi', value: 'mar' },
            { label: 'Mercoledi', value: 'mer' },
            { label: 'Giovedi', value: 'gio' },
            { label: 'Venerdi', value: 'ven' },
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
      on: 'sede',
      label: 'Eventi in questo centro',
      admin: { defaultColumns: ['titolo', 'dataInizio'] },
    },
    {
      name: 'richieste',
      type: 'join',
      collection: 'richieste',
      on: 'sede',
      label: 'Preiscrizioni ricevute',
      admin: { allowCreate: false, defaultColumns: ['cognome', 'nome', 'stato', 'createdAt'] },
    },
    legacyField(),
  ],
}
