import { describe, expect, it } from 'vitest'

import {
  DEFAULT_OPTIONS,
  extraItems,
  read,
  validate,
  type RequestValues,
} from '@/app/(frontend)/contatti/validation'

/* Le regole del form, senza Payload: e' codice puro. */
const valid: RequestValues = {
  cognome: 'Rossi',
  nome: 'Giulia',
  dataNascita: '1991-04-12',
  telefono: '+39 348 26 32 100',
  email: 'giulia.rossi@example.it',
  sede: '12',
  corso: '',
  messaggio: '',
  consenso: 'on',
}

describe('valida', () => {
  it('accetta una richiesta completa', () => {
    expect(validate(valid)).toEqual({})
  })

  it('segnala ogni campo obbligatorio vuoto con una frase', () => {
    const errors = validate({ ...valid, cognome: '', nome: '', email: '', telefono: '', sede: '', consenso: '' })
    expect(Object.keys(errors).sort()).toEqual(
      ['cognome', 'consenso', 'email', 'nome', 'sede', 'telefono'].sort(),
    )
    for (const sentence of Object.values(errors)) expect(sentence).toMatch(/\.$/)
  })

  it('rifiuta email, telefono e date non plausibili', () => {
    expect(validate({ ...valid, email: 'giulia@' }).email).toBeDefined()
    expect(validate({ ...valid, telefono: '12' }).telefono).toBeDefined()
    expect(validate({ ...valid, dataNascita: '2099-01-01' }).dataNascita).toBeDefined()
    expect(validate({ ...valid, dataNascita: '1991-02-30' }).dataNascita).toBeDefined()
    expect(validate({ ...valid, dataNascita: '12/04/1991' }).dataNascita).toBeDefined()
  })

  it('accetta il percorso vuoto, numerico o fra le voci extra, e rifiuta il resto', () => {
    expect(validate({ ...valid, corso: '3' }).corso).toBeUndefined()
    expect(validate({ ...valid, corso: 'Stage o evento' }).corso).toBeUndefined()
    expect(validate({ ...valid, corso: 'Kick Boxing' }).corso).toBeUndefined()
    expect(validate({ ...valid, corso: 'toString' }).corso).toBeDefined()
    expect(validate({ ...valid, corso: 'Kick Boxing' }, { ...DEFAULT_OPTIONS, altreVoci: ['Altro'] }).corso).toBeDefined()
  })
})

/* Gli interruttori del modulo stanno nel global Contatti e li rilegge la Server
   Action: un campo spento a CMS non deve restare obbligatorio sul server, ed e'
   l'unico punto in cui la validazione cambia forma. */
describe('valida con i campi facoltativi spenti', () => {
  const inactive = { dataNascita: false, pathway: false, messaggio: false, altreVoci: [] }

  it('non chiede la data di nascita quando il campo e spento', () => {
    expect(validate({ ...valid, dataNascita: '' }).dataNascita).toBeDefined()
    expect(validate({ ...valid, dataNascita: '' }, inactive).dataNascita).toBeUndefined()
  })

  it('ignora un percorso arrivato lo stesso quando il campo e spento', () => {
    expect(validate({ ...valid, corso: 'toString' }).corso).toBeDefined()
    expect(validate({ ...valid, corso: 'toString' }, inactive).corso).toBeUndefined()
  })

  it('non controlla la lunghezza del messaggio quando il campo e spento', () => {
    const long = { ...valid, messaggio: 'x'.repeat(2100) }
    expect(validate(long).messaggio).toBeDefined()
    expect(validate(long, inactive).messaggio).toBeUndefined()
  })

  it('tiene obbligatori i campi che non si possono spegnere', () => {
    const blanks = { ...valid, cognome: '', email: '', sede: '', consenso: '' }
    expect(Object.keys(validate(blanks, inactive)).sort()).toEqual(
      ['cognome', 'consenso', 'email', 'sede'].sort(),
    )
  })
})

describe('altreVoci', () => {
  it('usa le voci del global e ricade su quelle di serie se mancano', () => {
    expect(extraItems({ altreVoci: [{ etichetta: ' Kick Boxing ' }, { etichetta: '' }] })).toEqual(['Kick Boxing'])
    expect(extraItems({ altreVoci: [] })).toContain('Altro')
    expect(extraItems(null)).toContain('Stage o evento')
  })
})

describe('leggi', () => {
  it('ripulisce gli spazi e ignora i campi che non conosce', () => {
    const data = new FormData()
    data.set('cognome', '  Rossi ')
    data.set('sito', 'http://spam')
    const values = read(data)
    expect(values.cognome).toBe('Rossi')
    expect(values.nome).toBe('')
    expect('sito' in values).toBe(false)
  })
})
