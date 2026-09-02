import { describe, expect, it } from 'vitest'

import {
  chiaveGiorno,
  daRoma,
  dataLeggibile,
  giorniDiUnEvento,
  griglia,
  intervalloMese,
  meseDaParam,
  nomeMese,
  orarioLeggibile,
} from '@/componenti/calendario'

/* Il calendario e' aritmetica su date in Europe/Rome: queste sono le poche
   cose che, se sbagliano, mettono un evento nel giorno o nel mese sbagliato. */

const unMercoledi = new Date('2026-09-02T12:00:00Z')

describe('meseDaParam', () => {
  it('legge «2026-02»', () => {
    expect(meseDaParam('2026-02', unMercoledi)).toEqual({ anno: 2026, mese: 2 })
  })

  it('con un valore sporco torna al mese corrente', () => {
    for (const sporco of [undefined, '', 'settembre', '2026-13', '2026-00', '99-01', '1999-01']) {
      expect(meseDaParam(sporco, unMercoledi)).toEqual({ anno: 2026, mese: 9 })
    }
  })
})

describe('griglia', () => {
  it('parte da lunedi e finisce di domenica, sempre piena', () => {
    // Settembre 2026 comincia di martedi: la prima cella e' lunedi 31 agosto.
    const settimane = griglia({ anno: 2026, mese: 9 })
    expect(settimane[0][0]).toBe('2026-08-31')
    expect(settimane[0][1]).toBe('2026-09-01')
    expect(settimane.at(-1)?.at(-1)).toBe('2026-10-04')
    expect(settimane.every((s) => s.length === 7)).toBe(true)
  })

  it('fa cinque righe quando bastano e sei quando servono', () => {
    expect(griglia({ anno: 2026, mese: 9 })).toHaveLength(5)
    // Agosto 2026 comincia di sabato e ha 31 giorni: sei settimane.
    expect(griglia({ anno: 2026, mese: 8 })).toHaveLength(6)
    // Febbraio 2027 comincia di lunedi e ha 28 giorni: quattro esatte.
    expect(griglia({ anno: 2027, mese: 2 })).toHaveLength(4)
  })
})

describe('fuso di Roma', () => {
  it('un evento alle 00:30 di Roma del primo sta nel mese, non in quello prima', () => {
    // 2026-08-31T22:30Z e' il 1 settembre alle 00:30 a Roma (CEST).
    expect(chiaveGiorno('2026-08-31T22:30:00Z')).toBe('2026-09-01')
    const { inizio } = intervalloMese({ anno: 2026, mese: 9 })
    expect(inizio.toISOString()).toBe('2026-08-31T22:00:00.000Z')
  })

  it('legge un orario di Roma in estate e in inverno', () => {
    expect(daRoma(2026, 9, 24, 18, 30).toISOString()).toBe('2026-09-24T16:30:00.000Z')
    expect(daRoma(2026, 12, 20, 20).toISOString()).toBe('2026-12-20T19:00:00.000Z')
  })

  it("l'intervallo di gennaio tiene conto dell'ora solare", () => {
    const { inizio, fine } = intervalloMese({ anno: 2027, mese: 1 })
    expect(inizio.toISOString()).toBe('2026-12-31T23:00:00.000Z')
    expect(fine.toISOString()).toBe('2027-01-31T23:00:00.000Z')
  })
})

describe('giorniDiUnEvento', () => {
  it('un evento di tre giorni occupa tre celle', () => {
    expect(giorniDiUnEvento('2026-05-23T08:00:00Z', '2026-05-25T16:00:00Z')).toEqual([
      '2026-05-23',
      '2026-05-24',
      '2026-05-25',
    ])
  })

  it('senza fine, o con una fine prima dell inizio, occupa un giorno solo', () => {
    expect(giorniDiUnEvento('2026-09-24T16:30:00Z')).toEqual(['2026-09-24'])
    expect(giorniDiUnEvento('2026-09-24T16:30:00Z', '2026-09-20T16:30:00Z')).toEqual(['2026-09-24'])
  })
})

describe('testi', () => {
  it('scrive l orario di Roma e lo tace a mezzanotte', () => {
    expect(orarioLeggibile('2026-09-24T16:30:00Z', '2026-09-24T17:30:00Z')).toBe('18:30-19:30')
    expect(orarioLeggibile('2026-09-24T16:30:00Z')).toBe('18:30')
    expect(orarioLeggibile('2026-09-23T22:00:00Z')).toBe('')
  })

  it('scrive la data per esteso, e gli intervalli in una riga', () => {
    expect(dataLeggibile('2026-09-24T16:30:00Z')).toBe('Giovedì 24 settembre 2026')
    expect(dataLeggibile('2026-05-23T08:00:00Z', '2026-05-25T16:00:00Z')).toBe('23-25 maggio 2026')
    expect(dataLeggibile('2026-04-30T08:00:00Z', '2026-05-02T16:00:00Z')).toBe(
      '30 aprile - 2 maggio 2026',
    )
    expect(nomeMese({ anno: 2026, mese: 9 })).toBe('Settembre 2026')
  })
})

describe('jsonLd', () => {
  it('non lascia chiudere lo script a un titolo ostile', async () => {
    const { jsonLd } = await import('@/componenti/dati')
    const uscita = jsonLd({ name: '</script><script>alert(1)</script>' })
    expect(uscita).not.toContain('</script>')
    expect(JSON.parse(uscita)).toEqual({ name: '</script><script>alert(1)</script>' })
  })
})
