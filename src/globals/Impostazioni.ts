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
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: { description: 'Lo stemma. Quadrato, sfondo trasparente, almeno 400x400.' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Immagine di condivisione',
      admin: {
        description:
          'Quella che si vede su WhatsApp e sui social. Orizzontale 1200x630. Lasciala vuota: il sito ne compone una da solo, con il titolo e lo stemma.',
      },
    },
    {
      name: 'immagineHero',
      type: 'upload',
      relationTo: 'media',
      label: 'Immagine in cima alla home',
      admin: {
        description:
          'Una sola foto, mostrata in monocromo sotto il titolo. Orizzontale, almeno 1600px di lato lungo, con spazio a destra: il titolo occupa la meta sinistra. Senza immagine la home resta tipografica su nero.',
      },
    },
    {
      name: 'eroe',
      type: 'group',
      label: 'Testi in cima alla home',
      admin: { description: 'Occhiello, titolo, riga di testo e i due bottoni dell eroe.' },
      fields: [
        {
          name: 'occhiello',
          type: 'text',
          label: 'Occhiello',
          defaultValue: 'Krav Maga · Milano, Monza e Brianza, Lodi, Varese',
        },
        { name: 'titolo', type: 'text', label: 'Titolo', defaultValue: 'Difendersi si impara' },
        {
          name: 'testo',
          type: 'textarea',
          label: 'Riga sotto il titolo',
          maxLength: 160,
          admin: {
            description:
              'Vuota: il sito scrive da solo «N centri tecnici attivi, lezioni settimanali tutto l anno, istruttori con nome e cognome».',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaPrimariaEtichetta',
              type: 'text',
              label: 'Bottone rosso',
              defaultValue: 'Scegli il tuo percorso',
            },
            {
              name: 'ctaPrimariaHref',
              type: 'text',
              label: 'Indirizzo del bottone rosso',
              defaultValue: '#percorsi',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaSecondariaEtichetta',
              type: 'text',
              label: 'Bottone scuro',
              defaultValue: 'Trova un centro',
            },
            {
              name: 'ctaSecondariaHref',
              type: 'text',
              label: 'Indirizzo del bottone scuro',
              defaultValue: '/centri',
            },
          ],
        },
      ],
    },
    {
      name: 'home',
      type: 'group',
      label: 'Le due sezioni in fondo alla home',
      admin: {
        description:
          '«Cosa succede quando entri» e il paragrafo delle qualifiche. I numeri delle prove li conta il sito da solo.',
      },
      fields: [
        {
          name: 'primaVolta',
          type: 'array',
          label: 'Cosa succede quando entri',
          labels: { singular: 'Punto', plural: 'Punti' },
          maxRows: 4,
          admin: { description: 'Quattro al massimo: sopra gli 800px stanno in due colonne.' },
          defaultValue: [
            {
              titolo: 'Non serve essere allenati',
              testo:
                'Si comincia dal proprio passo. La prima lezione non è un test e nessuno ti mette a confronto con chi pratica da anni: si impara a muoversi, a tenere la distanza, a reagire.',
            },
            {
              titolo: 'Cosa portare',
              testo:
                'Pantaloni o pantaloncini comodi, una maglietta, scarpe da interno pulite e una bottiglia d’acqua. Guanti e protezioni servono più avanti, non alla prima lezione.',
            },
            {
              titolo: 'Quando si entra',
              testo:
                'Le lezioni sono settimanali e si tengono tutto l’anno. Non c’è un corso da aspettare a settembre: si entra durante la stagione, nel centro che ti resta comodo.',
            },
            {
              titolo: 'Con chi parli',
              testo:
                'Il referente è l’istruttore che tiene la lezione in quel centro. La richiesta che mandi arriva a lui, non a un centralino.',
            },
          ],
          fields: [
            { name: 'titolo', type: 'text', required: true, label: 'Titolo', maxLength: 60 },
            { name: 'testo', type: 'textarea', required: true, label: 'Testo', maxLength: 400 },
          ],
        },
        {
          name: 'immagineIngresso',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto di «Cosa succede quando entri»',
          admin: {
            description:
              'Orizzontale, la sala durante una lezione. Sta accanto ai quattro punti. Senza foto resta un segnaposto con la marca.',
          },
        },
        {
          name: 'testoQualifiche',
          type: 'textarea',
          label: 'Paragrafo delle qualifiche',
          maxLength: 500,
          admin: {
            description:
              'Sotto «Le qualifiche si contano». Vuoto: resta il testo di serie con CSEN-CONI, F.E.K.D.A. e P.T.D.',
          },
        },
      ],
    },
    {
      /* Il nome e' corto per forza: Postgres tronca gli identificatori a 63
         caratteri, e `immaginiPagine` faceva un vincolo da 65 che poi drizzle
         non ritrovava piu' per nome. */
      name: 'fotoPagine',
      type: 'group',
      label: 'Foto delle pagine indice',
      admin: {
        description:
          'Centri, percorsi e istruttori sono pagine di codice e non hanno una scheda a CMS: la loro fotografia si carica qui. Orizzontali, almeno 1600px di lato lungo.',
      },
      fields: [
        {
          name: 'centri',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto della pagina Centri',
        },
        {
          name: 'corsi',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto della pagina Percorsi',
        },
        {
          name: 'istruttori',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto della pagina Istruttori',
        },
      ],
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
