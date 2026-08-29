import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'

export const Istruttori: CollectionConfig = {
  slug: 'istruttori',
  labels: { singular: 'Istruttore', plural: 'Istruttori' },
  versions: { drafts: true },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'ruolo', 'qualifica', 'ordine', '_status'],
    group: 'Contenuti',
  },
  defaultSort: 'ordine',
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      label: 'Nome',
      admin: { description: 'Come va scritto sul sito. Es. «M. Vittorio Porreca».' },
    },
    slugField({ useAsSlug: 'nome' }),
    {
      type: 'row',
      fields: [
        {
          name: 'nomeBreve',
          type: 'text',
          label: 'Nome breve',
          admin: { description: 'Solo il nome, per gli spazi stretti. Es. «Vittorio».' },
        },
        {
          name: 'ordine',
          type: 'number',
          label: 'Ordine',
          defaultValue: 0,
          admin: { description: 'Numero piu basso = piu in alto nell elenco.' },
        },
      ],
    },
    {
      name: 'ruolo',
      type: 'text',
      label: 'Ruolo',
      admin: { description: 'Es. «Presidente e Direttore Tecnico AKM Italia».' },
    },
    {
      name: 'qualifica',
      type: 'select',
      label: 'Qualifica',
      index: true,
      // Enum chiuso: libero produce «Istruttore» / «istruttore» / «Ist.» nello stesso elenco.
      options: [
        { label: 'Istruttore', value: 'istruttore' },
        { label: 'Trainer', value: 'trainer' },
        { label: 'Maestro', value: 'maestro' },
        { label: 'Direttore tecnico', value: 'direttore-tecnico' },
        { label: 'Presidente', value: 'presidente' },
      ] as const,
    },
    {
      type: 'row',
      fields: [
        { name: 'grado', type: 'text', label: 'Grado', admin: { description: 'Es. cintura nera 2 dan.' } },
        {
          name: 'livello',
          type: 'text',
          label: 'Specializzazione',
          admin: { description: 'La riga sotto il ruolo. Es. «Krav Maga Master Teacher».' },
        },
      ],
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
      // Il testo alternativo sta sul file in Media: e una proprieta dell immagine.
    },
    {
      name: 'sommario',
      type: 'textarea',
      label: 'Sommario',
      maxLength: 300,
      admin: { description: 'Una o due righe, usate nella card dell elenco.' },
    },
    { name: 'bio', type: 'richText', label: 'Biografia' },
    {
      name: 'credenziali',
      type: 'array',
      label: 'Qualifiche e incarichi',
      labels: { singular: 'Qualifica', plural: 'Qualifiche' },
      admin: { description: 'Una riga per titolo. Es. «Krav Maga Master Teacher CSEN-CONI».' },
      fields: [{ name: 'voce', type: 'text', required: true, label: 'Voce' }],
    },
    {
      name: 'focus',
      type: 'array',
      label: 'Aree di lavoro',
      labels: { singular: 'Area', plural: 'Aree' },
      admin: { description: 'Etichette brevi mostrate come tag. Es. «Formazione istruttori».' },
      fields: [{ name: 'voce', type: 'text', required: true, label: 'Voce' }],
    },
    {
      name: 'sedi',
      type: 'join',
      collection: 'sedi',
      on: 'istruttori',
      label: 'Centri dove insegna',
      admin: { allowCreate: false, defaultColumns: ['nome', 'indirizzo.citta', 'attivo'] },
    },
  ],
}
