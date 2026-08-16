import type { GlobalConfig } from 'payload'

import { authenticated, publicRead } from '../access'

export const Impostazioni: GlobalConfig = {
  slug: 'impostazioni',
  label: 'Impostazioni',
  access: { read: publicRead, update: authenticated },
  admin: { group: 'Sistema' },
  fields: [
    { name: 'siteName', type: 'text', required: true, label: 'Nome del sito', defaultValue: 'AKM Italia' },
    {
      name: 'seoTitleDefault',
      type: 'text',
      label: 'Titolo SEO di default',
      admin: { description: 'Usato quando la pagina non ne ha uno proprio.' },
    },
    { name: 'seoDescriptionDefault', type: 'textarea', label: 'Descrizione SEO di default', maxLength: 200 },
    { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Immagine di condivisione' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    { name: 'testoFooter', type: 'textarea', label: 'Testo del footer' },
  ],
}
