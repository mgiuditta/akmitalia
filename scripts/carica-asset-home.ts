/**
 * Carica in `Media` gli asset generati della home (#17).
 * Rieseguibile: la chiave e' il nome del file, e un asset gia' presente si aggiorna.
 *
 *   pnpm payload run scripts/carica-asset-home.ts -- <cartella>
 *
 * ponytail: script usa e getta. Gli asset veri li carica il cliente dall'admin;
 * questo serve solo a mettere la base di partenza senza click a mano.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

const cartella = process.argv[process.argv.length - 1]

const ASSET: [string, string][] = [
  ['akm-trama-hero.webp', 'Trama a filetti concentrici, decorativa'],
  ['akm-fondo-carta.webp', 'Grana di carta, decorativa'],
  ['akm-og-sfondo.jpg', 'Sfondo della scheda di condivisione: archi concentrici su carta'],
  ['akm-percorso-1.png', 'Segno del percorso: tre archi concentrici'],
  ['akm-percorso-2.png', 'Segno del percorso: anello interrotto in alto'],
  ['akm-percorso-3.png', 'Segno del percorso: anello aperto a destra'],
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
  console.log(`${docs[0] ? 'aggiornato' : 'creato'}  ${doc.filename}  id=${doc.id}  ${doc.width}x${doc.height}`)
}

process.exit(0)
