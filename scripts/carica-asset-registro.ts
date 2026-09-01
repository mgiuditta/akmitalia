/**
 * Carica in `Media` gli asset del registro nuovo (#46).
 * Rieseguibile: la chiave e' il nome del file, e un asset gia' presente si aggiorna.
 *
 *   pnpm payload run scripts/carica-asset-registro.ts -- docs/marchio/asset-registro
 *
 * ponytail: script usa e getta, gemello di `carica-asset-home.ts`. Gli asset veri
 * li carica il cliente dall'admin; questo serve solo a mettere la base senza
 * click a mano, e a non sbagliare l'alt.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

const cartella = process.argv[process.argv.length - 1]

/* L'alt e' descrittivo e non decorativo: questa immagine porta informazione,
   cioe' com'e' fatta davvero la sala dove si va. Non e' una trama. */
const ASSET: [string, string][] = [
  [
    'akm-palestra-sera.webp',
    'La palestra vuota la sera: parquet con le righe del campo, spalliere e materassini a parete, luce al neon',
  ],
]

const payload = await getPayload({ config })

for (const [file, alt] of ASSET) {
  const filePath = path.resolve(cartella, file)
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: file } },
    limit: 1,
  })
  const doc = docs[0]
    ? await payload.update({ collection: 'media', id: docs[0].id, data: { alt }, filePath })
    : await payload.create({ collection: 'media', data: { alt }, filePath })
  console.log(
    `${docs[0] ? 'aggiornato' : 'creato'}  ${doc.filename}  id=${doc.id}  ${doc.width}x${doc.height}`,
  )
}

process.exit(0)
