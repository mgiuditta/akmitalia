import { describe, expect, it } from 'vitest'

import { distanzaKm, distanzaLeggibile } from '@/componenti/dati'

/* La distanza serve a ordinare quindici centri, non a farci navigare: la
   tolleranza dei casi qui sotto e' quella che regge il suo mestiere. */
const duomoMilano = { lat: 45.4642, lng: 9.19 }
const duomoMonza = { lat: 45.5836, lng: 9.2744 }
const moleTorino = { lat: 45.0691, lng: 7.6934 }

describe('distanzaKm', () => {
  it('misura una distanza breve nota', () => {
    // Milano-Monza in linea d'aria sta poco sopra i 15 km.
    expect(distanzaKm(duomoMilano, duomoMonza)).toBeGreaterThan(14)
    expect(distanzaKm(duomoMilano, duomoMonza)).toBeLessThan(16)
  })

  it('misura una distanza lunga nota', () => {
    // Milano-Torino sta attorno ai 125 km.
    expect(distanzaKm(duomoMilano, moleTorino)).toBeGreaterThan(120)
    expect(distanzaKm(duomoMilano, moleTorino)).toBeLessThan(130)
  })

  it('e simmetrica e vale zero su se stessa', () => {
    expect(distanzaKm(duomoMilano, duomoMilano)).toBe(0)
    expect(distanzaKm(duomoMilano, duomoMonza)).toBeCloseTo(distanzaKm(duomoMonza, duomoMilano), 9)
  })
})

describe('distanzaLeggibile', () => {
  it('tiene un decimale sotto i 10 km e lo perde sopra', () => {
    expect(distanzaLeggibile(2.34)).toBe('2,3 km')
    expect(distanzaLeggibile(9.98)).toBe('10,0 km')
    expect(distanzaLeggibile(17.4)).toBe('17 km')
    expect(distanzaLeggibile(124.6)).toBe('125 km')
  })
})
