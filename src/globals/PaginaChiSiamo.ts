import type { Field, GlobalConfig } from 'payload'

import { authenticated, publicRead } from '../access'

const sezione = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'titolo', type: 'text', label: 'Titolo' },
    { name: 'contenuto', type: 'richText', label: 'Contenuto' },
  ],
})

export const PaginaChiSiamo: GlobalConfig = {
  slug: 'pagina-chi-siamo',
  label: 'Pagina Chi Siamo',
  access: { read: publicRead, update: authenticated },
  admin: { group: 'Pagine fisse' },
  fields: [
    sezione('storia', 'Storia'),
    sezione('valori', 'Valori'),
    sezione('riconoscimenti', 'Riconoscimenti'),
    sezione('codiceEtico', 'Codice etico e deontologico'),
    sezione('rassegnaStampa', 'Rassegna stampa'),
    {
      name: 'partner',
      type: 'array',
      label: 'Partner',
      fields: [
        { name: 'nome', type: 'text', required: true, label: 'Nome' },
        { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
        { name: 'url', type: 'text', label: 'Sito web' },
      ],
    },
  ],
}
