import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'
import { legacyField } from '../fields/legacy'

/**
 * Tutte le pagine istituzionali in un posto solo: /krav-maga e le sue dieci figlie,
 * /chi-siamo e le sue, piu le legali. La gerarchia sta in `parent`, la URL in `path`.
 *
 * `path` e un campo salvato e non virtuale perche il frontend deve poterlo
 * interrogare (`where: { path: { equals: '/krav-maga/faq' } }`): un campo virtuale
 * si legge ma non si filtra.
 */
export const Pagine: CollectionConfig = {
  slug: 'pagine',
  labels: { singular: 'Pagina', plural: 'Pagine' },
  versions: { drafts: true },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'titolo',
    defaultColumns: ['titolo', 'path', '_status', 'updatedAt'],
    group: 'Contenuti',
  },
  defaultSort: 'path',
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const slug = data?.slug ?? originalDoc?.slug
        if (!slug) return data

        const parentId = data?.parent ?? originalDoc?.parent
        let prefisso = ''

        if (parentId) {
          const genitore = await req.payload.findByID({
            collection: 'pagine',
            id: typeof parentId === 'object' ? parentId.id : parentId,
            depth: 0,
            req,
          })
          prefisso = genitore?.path ?? ''
        }

        data.path = `${prefisso}/${slug}`
        return data
      },
    ],
  },
  fields: [
    { name: 'titolo', type: 'text', required: true, label: 'Titolo' },
    slugField({ useAsSlug: 'titolo' }),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pagine',
      label: 'Pagina genitore',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Vuoto = pagina di primo livello. Es. «Krav Maga» per /krav-maga/faq.',
      },
      // Una pagina non puo essere figlia di se stessa.
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    {
      name: 'path',
      type: 'text',
      label: 'URL',
      index: true,
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Calcolato da genitore + slug.',
        // ponytail: si ricalcola solo sulla pagina che salvi. Se rinomini un genitore,
        // ri-salva le figlie. Con 39 pagine non serve una cascata.
      },
    },
    {
      name: 'occhiello',
      type: 'text',
      label: 'Occhiello',
      maxLength: 60,
      admin: { description: 'La riga corta sopra il titolo. Es. «Missione AKM Italia».' },
    },
    {
      name: 'sommario',
      type: 'textarea',
      label: 'Sommario',
      admin: { description: 'Il paragrafo sotto il titolo, in cima alla pagina.' },
    },
    {
      name: 'immagineHero',
      type: 'upload',
      relationTo: 'media',
      label: 'Immagine in cima',
      admin: {
        description: 'Orizzontale, a tutta larghezza fra la testata e il testo. Facoltativa.',
      },
      // Il testo alternativo sta sul file in Media: si scrive una volta sola.
    },
    {
      name: 'sezioni',
      type: 'array',
      label: 'Sezioni',
      labels: { singular: 'Sezione', plural: 'Sezioni' },
      admin: { description: 'I blocchi della pagina, uno sotto l altro.' },
      fields: [
        { name: 'titolo', type: 'text', label: 'Titolo' },
        { name: 'testo', type: 'richText', required: true, label: 'Testo' },
      ],
    },
    legacyField(),
  ],
}
