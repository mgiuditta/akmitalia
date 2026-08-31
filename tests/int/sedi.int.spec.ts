import { Sedi } from '@/collections/Sedi'
import type { Field, TextField } from 'payload'
import { describe, expect, it } from 'vitest'

// Nessun Payload da avviare: si chiama la validate del campo direttamente.
const provincia = (() => {
  const indirizzo = Sedi.fields.find((f) => 'name' in f && f.name === 'indirizzo')
  const riga = (indirizzo as { fields: Field[] }).fields.find((f) => f.type === 'row')
  const campo = (riga as { fields: Field[] }).fields.find(
    (f) => 'name' in f && f.name === 'provincia',
  )
  return campo as TextField
})()

const valida = (value: unknown, nazione: string, status?: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (provincia.validate as any)(value, { data: { _status: status }, siblingData: { nazione } })

describe('indirizzo.provincia', () => {
  it('e obbligatoria per un centro in Italia', () => {
    expect(valida(undefined, 'IT')).toBe('Obbligatoria per i centri in Italia.')
    expect(valida('MI', 'IT')).toBe(true)
  })

  it('e facoltativa fuori Italia: Chiasso puo non avere cantone', () => {
    expect(valida(undefined, 'CH')).toBe(true)
  })

  it('non blocca la bozza', () => {
    expect(valida(undefined, 'IT', 'draft')).toBe(true)
  })
})
