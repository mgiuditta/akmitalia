import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'

/**
 * Krav Maga, Kick Boxing, Full Contact, Donna Sicura, Corsi Istruttori: sei-otto
 * record. Sono insieme la disciplina praticata (a cui puntano gli orari delle sedi)
 * e la pagina commerciale: separarli oggi sarebbe astrazione senza bisogno.
 *
 * I campi lunghi (focus, risultati, adattoA) sono array di righe e non richText:
 * il layout li disegna come liste e tag, e un incolla da Word lo sfascerebbe.
 */
export const Corsi: CollectionConfig = {
  slug: 'corsi',
  labels: { singular: 'Corso', plural: 'Corsi' },
  versions: { drafts: true },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'target', 'ordine', '_status'],
    group: 'Contenuti',
  },
  defaultSort: 'ordine',
  fields: [
    { name: 'nome', type: 'text', required: true, label: 'Nome' },
    slugField({ useAsSlug: 'nome' }),
    {
      type: 'row',
      fields: [
        {
          name: 'target',
          type: 'select',
          required: true,
          label: 'Destinatari',
          index: true,
          // Enum chiuso: lasciarlo libero produce «Adulti» / «adulti» / «over 16» nello stesso elenco.
          options: [
            { label: 'Adulti', value: 'adulti' },
            { label: 'Ragazzi', value: 'ragazzi' },
            { label: 'Bambini', value: 'bambini' },
            { label: 'Donne', value: 'donne' },
            { label: 'Istruttori', value: 'istruttori' },
            { label: 'Aziende e Forze dell Ordine', value: 'aziende-ffoo' },
          ] as const,
        },
        {
          name: 'ordine',
          type: 'number',
          label: 'Ordine',
          defaultValue: 0,
          admin: { description: 'Numero piu basso = piu in alto nell elenco.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'colore',
          type: 'select',
          required: true,
          label: 'Ruolo di colore',
          // Enum chiuso sui quattro ruoli di DESIGN.md: si sceglie quale ruolo, mai quale
          // colore. Un color picker qui e la fine della Regola della Bandiera Smontata.
          options: [
            { label: 'Verde AKM - sicurezza quotidiana', value: 'verde' },
            { label: 'Rosso Mattone - antiaggressione', value: 'rosso' },
            { label: 'Carta - crescita dei ragazzi', value: 'carta' },
            { label: 'Inchiostro - formazione tecnica', value: 'inchiostro' },
          ] as const,
          defaultValue: 'inchiostro',
        },
        {
          name: 'inBivio',
          type: 'checkbox',
          label: 'Voce del primo bivio',
          defaultValue: false,
          admin: {
            description:
              'Spento di default: un corso nuovo nasce come pagina, non come voce di orientamento.',
          },
        },
      ],
    },
    {
      name: 'domanda',
      type: 'text',
      label: 'Domanda del bivio',
      maxLength: 60,
      admin: {
        condition: (data) => Boolean(data?.inBivio),
        description: 'In prima persona, come la direbbe il visitatore. Es. «Voglio sapermi difendere ogni giorno».',
      },
    },
    {
      name: 'occhiello',
      type: 'text',
      label: 'Occhiello',
      maxLength: 40,
      admin: { description: 'La riga corta sopra il titolo. Es. «Percorso regolare».' },
    },
    {
      name: 'aChiSiRivolge',
      type: 'text',
      label: 'A chi si rivolge',
      admin: { description: 'Una riga sola. Es. «Uomini e donne dai 16 anni».' },
    },
    {
      name: 'sommario',
      type: 'textarea',
      required: true,
      label: 'Sommario',
      maxLength: 300,
      admin: { description: 'Una o due righe, usate nelle card.' },
    },
    { name: 'descrizione', type: 'richText', label: 'Descrizione estesa' },
    {
      type: 'row',
      fields: [
        { name: 'durata', type: 'text', label: 'Durata', admin: { description: 'Es. «Lezioni settimanali».' } },
        { name: 'ingresso', type: 'text', label: 'Ingresso', admin: { description: 'Es. «Ingresso possibile durante l anno».' } },
        { name: 'cadenza', type: 'text', label: 'Come si inizia', admin: { description: 'Es. «Prova gratuita in sede».' } },
      ],
    },
    {
      name: 'focus',
      type: 'array',
      label: 'Su cosa si lavora',
      labels: { singular: 'Voce', plural: 'Voci' },
      admin: { description: 'Etichette brevi mostrate come tag. Es. «Difesa da armi».' },
      fields: [{ name: 'voce', type: 'text', required: true, label: 'Voce' }],
    },
    {
      name: 'risultati',
      type: 'array',
      label: 'Cosa si ottiene',
      labels: { singular: 'Risultato', plural: 'Risultati' },
      fields: [{ name: 'voce', type: 'text', required: true, label: 'Voce' }],
    },
    {
      name: 'adattoA',
      type: 'array',
      label: 'Adatto a',
      labels: { singular: 'Profilo', plural: 'Profili' },
      admin: { description: 'Frasi intere. Es. «Chi vuole iniziare senza venire da sport da combattimento».' },
      fields: [{ name: 'voce', type: 'text', required: true, label: 'Voce' }],
    },
    {
      name: 'prova',
      type: 'textarea',
      label: 'Prova concreta',
      maxLength: 300,
      admin: { description: 'La riga che dimostra il corso: numeri, sedi, qualifiche. Non promesse.' },
    },
    {
      name: 'azione',
      type: 'text',
      label: 'Testo del pulsante',
      defaultValue: 'Chiedi una prova',
    },
    { name: 'immagine', type: 'upload', relationTo: 'media', label: 'Immagine' },
    {
      name: 'sedi',
      type: 'join',
      collection: 'sedi',
      on: 'orari.disciplina',
      label: 'Dove si pratica',
      admin: {
        allowCreate: false,
        defaultColumns: ['nome', 'indirizzo.provincia', 'attivo'],
        description: 'Compilato dagli orari delle schede centro: qui non si modifica.',
      },
    },
  ],
}
