import type { GlobalConfig } from 'payload'

import { authenticated, publicRead } from '../access'

/**
 * Le voci della barra e il bottone principale. Erano scritte in Barra.tsx:
 * il cliente arriva da WordPress e si aspetta di cambiare un'etichetta senza
 * chiamare nessuno. I conteggi sotto le voci restano un fatto del codice, non
 * un campo: Barra.tsx li abbina per indirizzo (/corsi, /centri, /istruttori).
 *
 * Cinque voci al massimo: sopra i 1024px stanno in riga nella barra e la
 * sesta non ci entra. Il perche' della riga sta in docs/adr/0008.
 */
const indirizzo = (value: unknown) =>
  (typeof value === 'string' && /^(\/\S*|https?:\/\/\S+)$/.test(value)) ||
  'Scrivi un percorso interno (es. /corsi) o un indirizzo completo (https://...).'

export const Navigazione: GlobalConfig = {
  slug: 'navigazione',
  label: 'Navigazione',
  versions: true,
  access: { read: publicRead, update: authenticated },
  admin: { group: 'Sistema' },
  fields: [
    {
      name: 'voci',
      type: 'array',
      label: 'Voci del menu',
      labels: { singular: 'Voce', plural: 'Voci' },
      minRows: 1,
      maxRows: 5,
      admin: {
        description: 'Sopra i 1024px stanno in riga nella barra: cinque al massimo.',
      },
      defaultValue: [
        { etichetta: 'Percorsi', href: '/corsi' },
        { etichetta: 'Centri', href: '/centri' },
        { etichetta: 'Istruttori', href: '/istruttori' },
        { etichetta: 'Contatti', href: '/contatti' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'etichetta', type: 'text', required: true, label: 'Etichetta', maxLength: 24 },
            { name: 'href', type: 'text', required: true, label: 'Indirizzo', validate: indirizzo },
          ],
        },
      ],
    },
    {
      name: 'piede',
      type: 'array',
      label: 'Voci legali nel footer',
      labels: { singular: 'Voce', plural: 'Voci' },
      admin: {
        description:
          'In fondo alla pagina, accanto al copyright. Le pagine si scrivono in Contenuti > Pagine.',
      },
      defaultValue: [
        { etichetta: 'Privacy', href: '/privacy' },
        { etichetta: 'Cookie', href: '/cookie' },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'etichetta', type: 'text', required: true, label: 'Etichetta', maxLength: 24 },
            { name: 'href', type: 'text', required: true, label: 'Indirizzo', validate: indirizzo },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Bottone principale',
      admin: { description: 'Il bottone rosso in barra. Non si nasconde mai.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'etichetta',
              type: 'text',
              required: true,
              label: 'Etichetta',
              maxLength: 28,
              defaultValue: 'Richiedi informazioni',
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              label: 'Indirizzo',
              defaultValue: '/contatti',
              validate: indirizzo,
            },
          ],
        },
      ],
    },
  ],
}
