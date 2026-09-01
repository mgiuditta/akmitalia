import type { Field, GlobalConfig } from 'payload'

import { authenticated, publicRead } from '../access'

type Voce = { tipo?: 'interna' | 'rotta' | 'esterna' }

/**
 * Una voce di menu ha un tipo, mai un URL scritto a mano: enum chiuso dove il
 * dato e' di codice, relazione dove e' di contenuto (stessa forma di ADR 0003).
 * Un `url` libero produce `/centri-tecnici` il giorno che qualcuno ricorda la
 * vecchia URL di WordPress.
 *
 * L'ordine e' l'ordine dell'array: Payload lo persiste e l'admin lo fa
 * trascinare. Nessun campo `ordine` — quello serve alle collection, dove le
 * righe non hanno un ordine proprio.
 */
const voci = (name: string, label: string): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: 'Voce', plural: 'Voci' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'tipo',
          type: 'select',
          required: true,
          defaultValue: 'interna',
          label: 'Tipo',
          options: [
            { label: 'Pagina del sito', value: 'interna' },
            { label: 'Sezione fissa', value: 'rotta' },
            { label: 'Indirizzo esterno', value: 'esterna' },
          ],
        },
        {
          name: 'etichetta',
          type: 'text',
          label: 'Etichetta',
          admin: { description: 'Vuoto = il titolo della pagina.' },
          validate: (value: unknown, { siblingData }: { siblingData: Partial<Voce> }) =>
            siblingData?.tipo === 'interna' || Boolean(value) || 'Serve un etichetta.',
        },
      ],
    },
    {
      name: 'pagina',
      type: 'relationship',
      relationTo: 'pagine',
      label: 'Pagina',
      admin: { condition: (_, s: Partial<Voce>) => s?.tipo === 'interna' },
      validate: (value: unknown, { siblingData }: { siblingData: Partial<Voce> }) =>
        siblingData?.tipo !== 'interna' || Boolean(value) || 'Scegli una pagina.',
    },
    {
      name: 'rotta',
      type: 'select',
      label: 'Sezione',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Centri tecnici', value: 'centri' },
        { label: 'Contatta', value: 'contatta' },
        { label: 'Istruttori', value: 'istruttori' },
        { label: 'Privacy', value: 'privacy' },
      ],
      admin: { condition: (_, s: Partial<Voce>) => s?.tipo === 'rotta' },
      validate: (value: unknown, { siblingData }: { siblingData: Partial<Voce> }) =>
        siblingData?.tipo !== 'rotta' || Boolean(value) || 'Scegli una sezione.',
    },
    {
      name: 'url',
      type: 'text',
      label: 'Indirizzo',
      admin: {
        condition: (_, s: Partial<Voce>) => s?.tipo === 'esterna',
        description: 'Completo di https://.',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Partial<Voce> }) =>
        siblingData?.tipo !== 'esterna' ||
        (typeof value === 'string' && /^https?:\/\//.test(value)) ||
        'Deve iniziare con http:// o https://.',
    },
  ],
})

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
    { name: 'testoFooter', type: 'textarea', label: 'Testo del footer' },
    {
      name: 'aspetto',
      type: 'group',
      label: 'Trame della home',
      admin: {
        description:
          'Due sfondi decorativi, gia\' compilati con quelli di partenza. Si possono sostituire o svuotare: senza, la home resta tipografica e non si rompe nulla.',
      },
      fields: [
        {
          name: 'tramaHero',
          type: 'upload',
          relationTo: 'media',
          label: 'Trama in testa alla home',
          admin: { description: 'Sta dietro il titolo, al 5%. Larga, non ripetuta.' },
        },
        {
          name: 'fondoCarta',
          type: 'upload',
          relationTo: 'media',
          label: 'Grana di carta',
          admin: { description: 'Ripetuta su tutta la pagina, al 3%. Deve essere senza giunte.' },
        },
        {
          name: 'aperturaHome',
          type: 'upload',
          relationTo: 'media',
          label: 'Immagine in apertura',
          admin: {
            description:
              "Ritagliata dal cerchio del sigillo, in apertura di home. Il soggetto deve stare nel 70% centrale, perche' il cerchio mangia gli angoli. Senza, restano gli anelli disegnati e la pagina e' completa lo stesso.",
          },
        },
      ],
    },
    {
      name: 'navigazione',
      type: 'group',
      label: 'Navigazione',
      admin: {
        description:
          'Le voci si riordinano trascinandole. Quattro non compaiono qui perche\' non si possono togliere: «Centri» e «Contatta» sono sempre in testata e reggono la conversione, «Istruttori» e «Privacy» sono sempre nel footer.',
      },
      fields: [voci('menu', 'Voci in testata'), voci('piede', 'Voci nel footer')],
    },
    {
      name: 'datiFiscali',
      type: 'group',
      label: 'Dati fiscali',
      admin: { description: 'Compaiono nel footer.' },
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
