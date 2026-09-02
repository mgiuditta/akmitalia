import type { CollectionConfig } from 'payload'
import path from 'path'

import { authenticated, publicRead } from '../access'
import { legacyField } from '../fields/legacy'

/*
 * I file caricati stanno in `media/`. Il percorso e' dichiarato invece di
 * lasciarlo al valore di serie perche' e' un dato di rilascio: in Docker quella
 * cartella e' un volume, e se cambia posizione le immagini spariscono.
 *
 * Si risolve sulla cwd e non su `import.meta.url`: nel build standalone questo
 * modulo finisce dentro un chunk di .next e il suo percorso non dice piu' dove
 * sta la radice del progetto. La cwd invece e' la radice sia con `next dev` sia
 * nel container. `MEDIA_DIR` resta la via d'uscita se il volume sta altrove.
 */
const cartellaMedia = process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media')

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'File', plural: 'Media' },
  access: {
    read: publicRead,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: { group: 'Sistema' },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Testo alternativo',
      admin: { description: 'Descrive l immagine a chi non la vede. Obbligatorio.' },
    },
    { name: 'didascalia', type: 'text', label: 'Didascalia' },
    legacyField(),
  ],
  upload: {
    staticDir: cartellaMedia,
    focalPoint: true,
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, formatOptions: { format: 'webp' } },
      { name: 'card', width: 800, formatOptions: { format: 'webp' } },
      { name: 'hero', width: 1600, formatOptions: { format: 'webp' } },
    ],
  },
}
