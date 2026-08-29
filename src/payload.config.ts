import { postgresAdapter } from '@payloadcms/db-postgres'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { it } from '@payloadcms/translations/languages/it'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Corsi } from './collections/Corsi'
import { Eventi } from './collections/Eventi'
import { Istruttori } from './collections/Istruttori'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Pagine } from './collections/Pagine'
import { Richieste } from './collections/Richieste'
import { Sedi } from './collections/Sedi'
import { Utenti } from './collections/Utenti'
import { Contatti } from './globals/Contatti'
import { Impostazioni } from './globals/Impostazioni'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** Le collezioni con una pagina pubblica: prendono i campi SEO e possono essere destinazione di un redirect. */
const collezioniPubbliche = ['pagine', 'news', 'eventi', 'corsi', 'sedi', 'istruttori'] as const

export default buildConfig({
  admin: {
    user: Utenti.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — AKM Italia' },
  },
  i18n: {
    fallbackLanguage: 'it',
    supportedLanguages: { it },
    // plugin-redirects non ha le traduzioni italiane: senza queste l'admin
    // stampa «key not found» al posto delle etichette.
    translations: {
      it: {
        'plugin-redirects': {
          customUrl: 'URL personalizzato',
          documentToRedirect: 'Documento di destinazione',
          fromUrl: 'URL di partenza',
          internalLink: 'Link interno',
          redirectType: 'Tipo di redirect',
          toUrlType: 'Tipo di destinazione',
        },
      },
    },
  },
  collections: [Pagine, News, Eventi, Corsi, Sedi, Istruttori, Richieste, Media, Utenti],
  globals: [Contatti, Impostazioni],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // In produzione lo schema si applica con le migration, mai in automatico.
    push: process.env.NODE_ENV !== 'production',
  }),
  plugins: [
    seoPlugin({
      collections: [...collezioniPubbliche],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }: { doc: Record<string, unknown> }) =>
        `${(doc?.titolo as string) ?? (doc?.nome as string) ?? ''} — AKM Italia`,
      generateDescription: ({ doc }: { doc: Record<string, unknown> }) =>
        (doc?.estratto as string) ?? (doc?.sommario as string) ?? '',
    }),
    // I 314 redirect dal vecchio sito: gestiti dall admin, con relationship alla
    // destinazione cosi reggono i cambi di slug futuri.
    redirectsPlugin({
      collections: [...collezioniPubbliche],
      overrides: {
        admin: { group: 'Sistema' },
      },
    }),
  ],
  sharp,
})
