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
          name: 'superficie',
          type: 'select',
          required: true,
          label: 'Ruolo di superficie',
          // Enum chiuso sui quattro valori di superficie di DESIGN.md: si sceglie quale
          // ruolo, mai quale tinta. Il sistema non ha accenti cromatici, quindi la
          // distinzione fra corsi passa per il valore del fondo, e sempre insieme al nome
          // scritto: la Regola dell'Etichetta non ammette un fondo senza etichetta.
          options: [
            { label: 'Nero - sicurezza quotidiana', value: 'nero' },
            { label: 'Carbone - antiaggressione', value: 'carbone' },
            { label: 'Bianco - crescita dei ragazzi', value: 'bianco' },
            { label: 'Grigio - formazione tecnica', value: 'grigio' },
          ] as const,
          defaultValue: 'grigio',
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
    {
      name: 'immagine',
      type: 'upload',
      relationTo: 'media',
      label: 'Segno del percorso',
      admin: {
        description:
          'Il marchio grafico del percorso, non una fotografia: inchiostro su trasparente, quadrato. Sta in filigrana dietro la testata e accanto alla riga in elenco.',
      },
    },
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
