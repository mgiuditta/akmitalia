import { describe, expect, it } from 'vitest'

import {
  OPZIONI_DI_SERIE,
  altreVoci,
  leggi,
  valida,
  type ValoriRichiesta,
} from '@/app/(frontend)/contatti/validazione'

/* Le regole del form, senza Payload: e' codice puro. */
const buoni: ValoriRichiesta = {
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
    expect(valida(buoni)).toEqual({})
  })

  it('segnala ogni campo obbligatorio vuoto con una frase', () => {
    const errori = valida({ ...buoni, cognome: '', nome: '', email: '', telefono: '', sede: '', consenso: '' })
    expect(Object.keys(errori).sort()).toEqual(
      ['cognome', 'consenso', 'email', 'nome', 'sede', 'telefono'].sort(),
    )
    for (const frase of Object.values(errori)) expect(frase).toMatch(/\.$/)
  })

  it('rifiuta email, telefono e date non plausibili', () => {
    expect(valida({ ...buoni, email: 'giulia@' }).email).toBeDefined()
    expect(valida({ ...buoni, telefono: '12' }).telefono).toBeDefined()
    expect(valida({ ...buoni, dataNascita: '2099-01-01' }).dataNascita).toBeDefined()
    expect(valida({ ...buoni, dataNascita: '1991-02-30' }).dataNascita).toBeDefined()
    expect(valida({ ...buoni, dataNascita: '12/04/1991' }).dataNascita).toBeDefined()
  })

  it('accetta il percorso vuoto, numerico o fra le voci extra, e rifiuta il resto', () => {
    expect(valida({ ...buoni, corso: '3' }).corso).toBeUndefined()
    expect(valida({ ...buoni, corso: 'Stage o evento' }).corso).toBeUndefined()
    expect(valida({ ...buoni, corso: 'Kick Boxing' }).corso).toBeUndefined()
    expect(valida({ ...buoni, corso: 'toString' }).corso).toBeDefined()
    expect(valida({ ...buoni, corso: 'Kick Boxing' }, { ...OPZIONI_DI_SERIE, altreVoci: ['Altro'] }).corso).toBeDefined()
  })
})

/* Gli interruttori del modulo stanno nel global Contatti e li rilegge la Server
   Action: un campo spento a CMS non deve restare obbligatorio sul server, ed e'
   l'unico punto in cui la validazione cambia forma. */
describe('valida con i campi facoltativi spenti', () => {
  const spenti = { dataNascita: false, percorso: false, messaggio: false, altreVoci: [] }

  it('non chiede la data di nascita quando il campo e spento', () => {
    expect(valida({ ...buoni, dataNascita: '' }).dataNascita).toBeDefined()
    expect(valida({ ...buoni, dataNascita: '' }, spenti).dataNascita).toBeUndefined()
  })

  it('ignora un percorso arrivato lo stesso quando il campo e spento', () => {
    expect(valida({ ...buoni, corso: 'toString' }).corso).toBeDefined()
    expect(valida({ ...buoni, corso: 'toString' }, spenti).corso).toBeUndefined()
  })

  it('non controlla la lunghezza del messaggio quando il campo e spento', () => {
    const lungo = { ...buoni, messaggio: 'x'.repeat(2100) }
    expect(valida(lungo).messaggio).toBeDefined()
    expect(valida(lungo, spenti).messaggio).toBeUndefined()
  })

  it('tiene obbligatori i campi che non si possono spegnere', () => {
    const vuoti = { ...buoni, cognome: '', email: '', sede: '', consenso: '' }
    expect(Object.keys(valida(vuoti, spenti)).sort()).toEqual(
      ['cognome', 'consenso', 'email', 'sede'].sort(),
    )
  })
})

describe('altreVoci', () => {
  it('usa le voci del global e ricade su quelle di serie se mancano', () => {
    expect(altreVoci({ altreVoci: [{ etichetta: ' Kick Boxing ' }, { etichetta: '' }] })).toEqual(['Kick Boxing'])
    expect(altreVoci({ altreVoci: [] })).toContain('Altro')
    expect(altreVoci(null)).toContain('Stage o evento')
  })
})

describe('leggi', () => {
  it('ripulisce gli spazi e ignora i campi che non conosce', () => {
    const dati = new FormData()
    dati.set('cognome', '  Rossi ')
    dati.set('sito', 'http://spam')
    const valori = leggi(dati)
    expect(valori.cognome).toBe('Rossi')
    expect(valori.nome).toBe('')
    expect('sito' in valori).toBe(false)
  })
})
