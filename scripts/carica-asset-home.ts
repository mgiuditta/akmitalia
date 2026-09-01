/**
 * Carica in `Media` gli asset di partenza della home e li aggancia a
 * `Impostazioni` (#17). Rieseguibile: la chiave e' il nome del file.
 *
 *   pnpm asset:home
 *
 * Gli asset sono una **base**, non codice: il cliente li sostituisce dall'admin,
 * e la home regge anche se li svuota. Stanno in `docs/marchio/asset-home/`
 * perche' il repository e' l'unico posto dove non si perdono, come gli
 * originali del marchio (#23).
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

const CARTELLA = path.resolve(import.meta.dirname, '../docs/marchio/asset-home')

const ASSET: [string, string][] = [
  ['akm-trama-hero.webp', 'Trama a filetti concentrici, decorativa'],
  ['akm-fondo-carta.webp', 'Grana di carta, decorativa'],
  ['akm-og-sfondo.jpg', 'Sfondo della scheda di condivisione: archi concentrici su carta'],
  ['akm-percorso-1.png', 'Segno del percorso: tre archi concentrici'],
  ['akm-percorso-2.png', 'Segno del percorso: anello interrotto in alto'],
  ['akm-percorso-3.png', 'Segno del percorso: anello aperto a destra'],
]

const payload = await getPayload({ config })

const id = async (filename: string, alt: string): Promise<number> => {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  // Ricaricare il file lo fa rinominare (`-1`, `-2`), e il nome e' la chiave di
  // questo script: se esiste gia' si tocca solo l'alt.
  if (docs[0]) {
    console.log(`gia' presente  ${docs[0].filename}  id=${docs[0].id}`)
    return docs[0].id as number
  }
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(CARTELLA, filename),
  })
  console.log(`creato  ${doc.filename}  id=${doc.id}`)
  return doc.id as number
}

const caricati = new Map<string, number>()
for (const [file, alt] of ASSET) caricati.set(file, await id(file, alt))

// Le due trame della home. Le altre restano in libreria: la card di
// condivisione la compone il codice, i segni di percorso aspettano #NN.
await payload.updateGlobal({
  slug: 'impostazioni',
  data: {
    aspetto: {
      tramaHero: caricati.get('akm-trama-hero.webp'),
      fondoCarta: caricati.get('akm-fondo-carta.webp'),
    },
  },
})
console.log('Impostazioni → Trame della home: agganciate.')

process.exit(0)
