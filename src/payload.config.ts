import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { it } from '@payloadcms/translations/languages/it'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Centri } from './collections/Centri'
import { Corsi } from './collections/Corsi'
import { Docenti } from './collections/Docenti'
import { Eventi } from './collections/Eventi'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Pagine } from './collections/Pagine'
import { Richieste } from './collections/Richieste'
import { Users } from './collections/Users'
import { Contatti } from './globals/Contatti'
import { Home } from './globals/Home'
import { Impostazioni } from './globals/Impostazioni'
import { PaginaChiSiamo } from './globals/PaginaChiSiamo'
import { PaginaKravMaga } from './globals/PaginaKravMaga'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — AKM Italia',
    },
  },
  i18n: {
    fallbackLanguage: 'it',
    supportedLanguages: { it },
  },
  collections: [Centri, Corsi, Docenti, News, Eventi, Pagine, Richieste, Media, Users],
  globals: [Home, PaginaKravMaga, PaginaChiSiamo, Contatti, Impostazioni],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
