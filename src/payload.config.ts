import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
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
import { Navigazione } from './globals/Navigazione'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * L'avviso email delle richieste parte via SMTP del dominio. Senza SMTP_HOST
 * `email` resta undefined e Payload usa il suo adapter console: la richiesta si
 * salva lo stesso e il log dice a chi sarebbe andata. Non si chiama
 * nodemailerAdapter() a vuoto perche' al boot contatterebbe Ethereal, e in
 * sviluppo offline il sito non partirebbe.
 */
const portaSmtp = Number(process.env.SMTP_PORT || 587)
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM || 'noreply@akm-italia.eu',
      defaultFromName: 'AKM Italia',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: portaSmtp,
        secure: portaSmtp === 465,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      },
    })
  : undefined

/** Le collezioni con una pagina pubblica: prendono i campi SEO e possono essere destinazione di un redirect. */
const collezioniPubbliche = ['pagine', 'news', 'eventi', 'corsi', 'sedi', 'istruttori'] as const

export default buildConfig({
  admin: {
    user: Utenti.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — AKM Italia' },
  },
  // Sito monolingua: un solo locale cosi le API rispondono sempre `locale=it`
  // invece di `undefined`. Nessun campo e' localized, quindi niente tabelle _locales.
  localization: {
    locales: ['it'],
    defaultLocale: 'it',
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
  globals: [Contatti, Impostazioni, Navigazione],
  editor: lexicalEditor(),
  email,
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
