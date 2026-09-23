import { describe, expect, it } from 'vitest'

import { distanceKm, readableDistance } from '@/components/data'

/* La distanza serve a ordinare quindici centri, non a farci navigare: la
   tolleranza dei casi qui sotto e' quella che regge il suo mestiere. */
const milanDuomo = { lat: 45.4642, lng: 9.19 }
const monzaDuomo = { lat: 45.5836, lng: 9.2744 }
const turinMole = { lat: 45.0691, lng: 7.6934 }

describe('distanzaKm', () => {
  it('misura una distanza breve nota', () => {
    // Milano-Monza in linea d'aria sta poco sopra i 15 km.
    expect(distanceKm(milanDuomo, monzaDuomo)).toBeGreaterThan(14)
    expect(distanceKm(milanDuomo, monzaDuomo)).toBeLessThan(16)
  })

  it('misura una distanza lunga nota', () => {
    // Milano-Torino sta attorno ai 125 km.
    expect(distanceKm(milanDuomo, turinMole)).toBeGreaterThan(120)
    expect(distanceKm(milanDuomo, turinMole)).toBeLessThan(130)
  })

  it('e simmetrica e vale zero su se stessa', () => {
    expect(distanceKm(milanDuomo, milanDuomo)).toBe(0)
    expect(distanceKm(milanDuomo, monzaDuomo)).toBeCloseTo(distanceKm(monzaDuomo, milanDuomo), 9)
  })
})

describe('distanzaLeggibile', () => {
  it('tiene un decimale sotto i 10 km e lo perde sopra', () => {
    expect(readableDistance(2.34)).toBe('2,3 km')
    expect(readableDistance(9.98)).toBe('10,0 km')
    expect(readableDistance(17.4)).toBe('17 km')
    expect(readableDistance(124.6)).toBe('125 km')
  })
})
