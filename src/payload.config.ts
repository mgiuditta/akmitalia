import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
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
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  // Il sito legge con la Local API: GraphQL sarebbe solo superficie pubblica in più.
  graphQL: { disable: true },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // In produzione lo schema si applica solo con `pnpm migrate`, mai in automatico.
    push: process.env.NODE_ENV !== 'production',
  }),
  // Senza SMTP configurato Payload logga le email in console: è quello che serve in sviluppo.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_USER || 'no-reply@akm-italia.it',
        defaultFromName: 'AKM Italia',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  sharp,
  plugins: [],
})
