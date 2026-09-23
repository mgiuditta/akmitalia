/**
 * Il minimo per scrivere un campo richText da uno script: paragrafi ed elenchi
 * puntati. Lexical vuole un albero, non del testo.
 *
 * ponytail: nessun convertitore da Markdown. Due funzioni bastano a tutto
 * quello che gli script di contenuto scrivono, e il cliente da qui in poi
 * modifica dall'editor dell'admin.
 */

const text = (t: string) => ({
  type: 'text',
  text: t,
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

export const p = (t: string) => ({
  type: 'paragraph',
  children: [text(t)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

export const ul = (items: string[]) => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((v, i) => ({
    type: 'listitem',
    value: i + 1,
    children: [text(v)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  })),
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
})

/** L'albero completo, gia' nella forma che il campo richText si aspetta. */
export const rich = (blocks: unknown[]) =>
  ({
    root: {
      type: 'root',
      children: blocks,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }) as never
