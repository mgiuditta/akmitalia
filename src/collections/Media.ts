import { APIError, type CollectionConfig } from 'payload'
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

/*
 * Un video in cima alla home si scarica su ogni visita, anche dal telefono.
 * Il tetto e' largo (a 1080p per 15 secondi ne bastano 8) ma ferma chi carica
 * lo spot da 200 MB cosi' com'e' uscito dal montaggio.
 */
export const MB_MASSIMI_VIDEO = 12

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
  hooks: {
    beforeValidate: [
      // Qui Payload ha gia' letto il file: tipo e peso stanno in `data`, sia
      // dall'admin sia dalla Local API. Il file non e' ancora su disco.
      ({ data }) => {
        const peso = data?.filesize ?? 0
        if (data?.mimeType?.startsWith('video/') && peso > MB_MASSIMI_VIDEO * 1024 * 1024) {
          throw new APIError(
            `Il video pesa ${Math.round(peso / 1024 / 1024)} MB: il massimo e' ${MB_MASSIMI_VIDEO}. Riesportalo a 1920x1080, senza audio, 10-15 secondi.`,
            400,
            null,
            true,
          )
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Testo alternativo',
      admin: {
        description:
          'Descrive l immagine a chi non la vede. Obbligatorio. Per un video di sfondo basta dire cosa mostra, per esempio «Allenamento in sala».',
      },
    },
    { name: 'didascalia', type: 'text', label: 'Didascalia' },
    legacyField(),
  ],
  upload: {
    staticDir: cartellaMedia,
    focalPoint: true,
    // Il video e' solo MP4: H.264 lo leggono tutti i browser, Safari compreso.
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4'],
    imageSizes: [
      { name: 'thumbnail', width: 400, formatOptions: { format: 'webp' } },
      { name: 'card', width: 800, formatOptions: { format: 'webp' } },
      { name: 'hero', width: 1600, formatOptions: { format: 'webp' } },
    ],
  },
}
