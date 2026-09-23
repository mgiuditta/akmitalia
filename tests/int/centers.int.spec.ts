import { Centers } from '@/collections/Centers'
import type { Field, TextField } from 'payload'
import { describe, expect, it } from 'vitest'

// Nessun Payload da avviare: si chiama la validate del campo direttamente.
const province = (() => {
  const address = Centers.fields.find((f) => 'name' in f && f.name === 'indirizzo')
  const row = (address as { fields: Field[] }).fields.find((f) => f.type === 'row')
  const field = (row as { fields: Field[] }).fields.find(
    (f) => 'name' in f && f.name === 'provincia',
  )
  return field as TextField
})()

const validate = (value: unknown, country: string, status?: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (province.validate as any)(value, { data: { _status: status }, siblingData: { nazione: country } })

describe('indirizzo.provincia', () => {
  it('e obbligatoria per un centro in Italia', () => {
    expect(validate(undefined, 'IT')).toBe('Obbligatoria per i centri in Italia.')
    expect(validate('MI', 'IT')).toBe(true)
  })

  it('e facoltativa fuori Italia: Chiasso puo non avere cantone', () => {
    expect(validate(undefined, 'CH')).toBe(true)
  })

  it('non blocca la bozza', () => {
    expect(validate(undefined, 'IT', 'draft')).toBe(true)
  })
})
