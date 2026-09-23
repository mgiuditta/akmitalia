import { describe, expect, it } from 'vitest'

import { Contacts } from '@/globals/Contacts'
import { Navigation } from '@/globals/Navigation'
import { defaultValues } from '@/components/payload'

/* Il guscio che il build prerenderizza senza database (docs/adr/0013) deve
   coincidere con quello che Payload restituisce su un database appena
   migrato. Se un global cambia forma e questi valori spariscono, il primo
   rilascio esce con la barra rotta: e' il caso che questo test tiene fermo. */
describe('valoriPredefiniti', () => {
  it('ricostruisce il bottone della barra, che sta dentro un group e una row', () => {
    const navigation = defaultValues(Navigation.fields)
    expect(navigation.cta).toEqual({ etichetta: 'Richiedi informazioni', href: '/contatti' })
  })

  it('tiene le voci del menu e quelle del piede', () => {
    const navigation = defaultValues(Navigation.fields) as {
      voci: { href: string }[]
      piede: { href: string }[]
    }
    expect(navigation.voci.map((v) => v.href)).toEqual([
      '/corsi',
      '/centri',
      '/istruttori',
      '/eventi',
      '/contatti',
    ])
    expect(navigation.piede.map((v) => v.href)).toEqual(['/privacy', '/cookie'])
  })

  it('un group senza default resta un oggetto vuoto, non undefined', () => {
    const contacts = defaultValues(Contacts.fields)
    expect(contacts.sedeLegale).toEqual({})
    expect(contacts.emailRichieste).toBe('formazione@akm-italia.eu')
  })
})
