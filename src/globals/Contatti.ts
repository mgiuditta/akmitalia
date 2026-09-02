import type { GlobalConfig } from 'payload'

import { ALTRE_VOCI_DI_SERIE } from '@/app/(frontend)/contatti/validazione'

import { authenticated, publicRead } from '../access'

export const Contatti: GlobalConfig = {
  slug: 'contatti',
  label: 'Contatti',
  versions: true,
  access: { read: publicRead, update: authenticated },
  admin: { group: 'Sistema' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, label: 'Email' },
        { name: 'telefono', type: 'text', label: 'Telefono' },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp',
          admin: { description: 'In formato internazionale, es. +393401234567.' },
        },
      ],
    },
    {
      name: 'emailRichieste',
      type: 'email',
      label: 'Email per le richieste',
      defaultValue: 'formazione@akm-italia.eu',
      admin: {
        description: 'Riceve le richieste del form in /contatti. Se vuota si usa l Email qui sopra.',
      },
    },
    {
      name: 'introRichieste',
      type: 'textarea',
      label: 'Testo in cima a /contatti',
      maxLength: 400,
      admin: { description: 'Due o tre righe sopra il form. Vuoto: resta il testo di serie.' },
    },
    {
      name: 'modulo',
      type: 'group',
      label: 'Il modulo di richiesta',
      admin: {
        description:
          'I testi del form e quali campi facoltativi chiedere. I campi obbligatori (cognome, nome, email, telefono, centro, consenso) non si spengono: senza non si puo ricontattare nessuno.',
      },
      fields: [
        {
          name: 'nota',
          type: 'text',
          label: 'Riga sopra il modulo',
          maxLength: 160,
          defaultValue: 'Tutti i campi sono obbligatori, tranne percorso e messaggio.',
        },
        {
          name: 'etichettaConsenso',
          type: 'textarea',
          label: 'Testo accanto alla casella del consenso',
          maxLength: 400,
          defaultValue:
            'Autorizzo il trattamento dei dati personali secondo il Regolamento UE 2016/679, per essere ricontattato da AKM Italia.',
        },
        {
          name: 'paginaPrivacy',
          type: 'relationship',
          relationTo: 'pagine',
          label: 'Pagina dell informativa',
          admin: {
            description:
              'Il link «Leggi l informativa» accanto al consenso. Vuoto: il link non compare.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'etichettaInvio',
              type: 'text',
              label: 'Etichetta del bottone',
              maxLength: 32,
              defaultValue: 'Invia la richiesta',
            },
            {
              name: 'messaggioConferma',
              type: 'text',
              label: 'Messaggio dopo l invio',
              maxLength: 200,
              defaultValue:
                'Grazie: la richiesta e arrivata. Ti ricontattiamo entro pochi giorni.',
            },
          ],
        },
        {
          name: 'altreVoci',
          type: 'array',
          label: 'Altre voci del percorso',
          labels: { singular: 'Voce', plural: 'Voci' },
          maxRows: 12,
          admin: {
            description:
              'Dopo i corsi pubblicati, le voci senza una pagina: stage, discipline tenute a parte, «Altro». Finiscono nella richiesta come testo.',
          },
          defaultValue: ALTRE_VOCI_DI_SERIE.map((etichetta) => ({ etichetta })),
          fields: [{ name: 'etichetta', type: 'text', required: true, label: 'Voce', maxLength: 60 }],
        },
        // Un campo spento sparisce dal modulo e smette di essere obbligatorio
        // anche sul server: la Server Action rilegge questi tre interruttori.
        {
          type: 'row',
          fields: [
            {
              name: 'chiediDataNascita',
              type: 'checkbox',
              label: 'Chiedi la data di nascita',
              defaultValue: true,
            },
            {
              name: 'chiediPercorso',
              type: 'checkbox',
              label: 'Chiedi il percorso di interesse',
              defaultValue: true,
            },
            {
              name: 'chiediMessaggio',
              type: 'checkbox',
              label: 'Lascia scrivere un messaggio',
              defaultValue: true,
            },
          ],
        },
      ],
    },
    {
      name: 'immagineContatti',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto della pagina contatti',
      admin: { description: 'Verticale, accanto al form. Senza foto la colonna resta di solo testo.' },
    },
    {
      name: 'sedeLegale',
      type: 'group',
      label: 'Sede legale',
      fields: [
        { name: 'via', type: 'text', label: 'Via e numero' },
        {
          type: 'row',
          fields: [
            { name: 'cap', type: 'text', label: 'CAP', maxLength: 5 },
            { name: 'citta', type: 'text', label: 'Citta' },
            { name: 'provincia', type: 'text', label: 'Provincia', maxLength: 2 },
          ],
        },
      ],
    },
    {
      name: 'social',
      type: 'array',
      label: 'Social',
      labels: { singular: 'Profilo', plural: 'Profili' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'rete',
              type: 'select',
              required: true,
              label: 'Rete',
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'LinkedIn', value: 'linkedin' },
              ] as const,
            },
            { name: 'url', type: 'text', required: true, label: 'Indirizzo' },
          ],
        },
      ],
    },
  ],
}
