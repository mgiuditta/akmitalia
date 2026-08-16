import type { Field, GlobalConfig } from 'payload'

import { authenticated, publicRead } from '../access'

/**
 * Le nove pagine della vecchia sezione "storia del krav maga" in una sola pagina ad ancore.
 * Gli slug delle ancore (#imi-lichtenfeld, #idf, …) sono fissi nel codice, non qui:
 * sono destinazioni di 301 già dichiarate in docs/contenuti.md e non devono cambiare dall'admin.
 */
const sezione = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'titolo', type: 'text', label: 'Titolo' },
    { name: 'contenuto', type: 'richText', label: 'Contenuto' },
  ],
})

export const PaginaKravMaga: GlobalConfig = {
  slug: 'pagina-krav-maga',
  label: 'Pagina Krav Maga',
  access: { read: publicRead, update: authenticated },
  admin: { group: 'Pagine fisse' },
  fields: [
    sezione('cosE', 'Cos’è il Krav Maga'),
    sezione('imiLichtenfeld', 'Imi Lichtenfeld'),
    sezione('idf', 'Israel Defense Forces'),
    sezione('principi', 'I principi'),
    sezione('caratteristiche', 'Le caratteristiche'),
    sezione('attrezzatura', 'Abbigliamento, protezioni e armi'),
    {
      name: 'faq',
      type: 'array',
      label: 'FAQ',
      admin: { description: 'Alimenta anche i dati strutturati FAQPage per Google.' },
      fields: [
        { name: 'domanda', type: 'text', required: true, label: 'Domanda' },
        { name: 'risposta', type: 'textarea', required: true, label: 'Risposta' },
      ],
    },
  ],
}
