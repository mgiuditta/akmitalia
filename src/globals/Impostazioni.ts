import type { GlobalConfig } from 'payload'

import { authenticated, publicRead } from '../access'

export const Impostazioni: GlobalConfig = {
  slug: 'impostazioni',
  label: 'Impostazioni',
  versions: true,
  access: { read: publicRead, update: authenticated },
  admin: { group: 'Sistema' },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      label: 'Nome del sito',
      defaultValue: 'AKM Italia',
    },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Immagine di condivisione' },
    {
      name: 'immagineHero',
      type: 'upload',
      relationTo: 'media',
      label: 'Immagine in cima alla home',
      admin: {
        description:
          'Una sola foto, mostrata in monocromo sotto il titolo. Senza immagine la home resta tipografica su nero.',
      },
    },
    { name: 'testoFooter', type: 'textarea', label: 'Testo del footer' },
    {
      name: 'datiFiscali',
      type: 'group',
      label: 'Dati fiscali',
      admin: { description: 'Compaiono nel footer e nella pagina 5x1000.' },
      fields: [
        { name: 'ragioneSociale', type: 'text', label: 'Denominazione' },
        {
          type: 'row',
          fields: [
            {
              name: 'codiceFiscale',
              type: 'text',
              label: 'Codice fiscale',
              admin: { description: 'E il codice del 5x1000. Un errore qui costa donazioni.' },
              // 11 cifre per gli enti, 16 alfanumerici per le persone fisiche.
              validate: (value: unknown) =>
                !value ||
                (typeof value === 'string' && /^([0-9]{11}|[A-Za-z0-9]{16})$/.test(value.trim())) ||
                'Deve essere di 11 cifre (ente) o 16 caratteri (persona fisica).',
            },
            { name: 'partitaIva', type: 'text', label: 'Partita IVA' },
            { name: 'iban', type: 'text', label: 'IBAN' },
          ],
        },
      ],
    },
  ],
}
