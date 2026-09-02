import { describe, expect, it } from 'vitest'

import { Contatti } from '@/globals/Contatti'
import { Navigazione } from '@/globals/Navigazione'
import { valoriPredefiniti } from '@/componenti/payload'

/* Il guscio che il build prerenderizza senza database (docs/adr/0013) deve
   coincidere con quello che Payload restituisce su un database appena
   migrato. Se un global cambia forma e questi valori spariscono, il primo
   rilascio esce con la barra rotta: e' il caso che questo test tiene fermo. */
describe('valoriPredefiniti', () => {
  it('ricostruisce il bottone della barra, che sta dentro un group e una row', () => {
    const navigazione = valoriPredefiniti(Navigazione.fields)
    expect(navigazione.cta).toEqual({ etichetta: 'Richiedi informazioni', href: '/contatti' })
  })

  it('tiene le voci del menu e quelle del piede', () => {
    const navigazione = valoriPredefiniti(Navigazione.fields) as {
      voci: { href: string }[]
      piede: { href: string }[]
    }
    expect(navigazione.voci.map((v) => v.href)).toEqual([
      '/corsi',
      '/centri',
      '/istruttori',
      '/eventi',
      '/contatti',
    ])
    expect(navigazione.piede.map((v) => v.href)).toEqual(['/privacy', '/cookie'])
  })

  it('un group senza default resta un oggetto vuoto, non undefined', () => {
    const contatti = valoriPredefiniti(Contatti.fields)
    expect(contatti.sedeLegale).toEqual({})
    expect(contatti.emailRichieste).toBe('formazione@akm-italia.eu')
  })
})
