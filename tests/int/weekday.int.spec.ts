import { describe, it, expect } from 'vitest'

import { byWeekday } from '@/components/data'

describe('byWeekday', () => {
  it('ordina da lunedi a domenica, poi per ora di inizio', () => {
    const slots = [
      { id: 'a', giorni: ['ven'], oraInizio: '20:00' },
      { id: 'b', giorni: ['mar'], oraInizio: '20:30' },
      { id: 'c', giorni: ['ven'], oraInizio: '18:30' },
      { id: 'd', giorni: [], oraInizio: '10:00' },
      { id: 'e', giorni: ['sab', 'lun'], oraInizio: '19:00' },
    ]
    expect(byWeekday(slots).map((s) => s.id)).toEqual(['e', 'b', 'c', 'a', 'd'])
  })
})
