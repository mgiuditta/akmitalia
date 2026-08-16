import { describe, expect, it } from 'vitest'

import { coordinateDaUrl, parseDocente, parsePaginaCentri } from '../../scripts/lib/parse-centri'

/** Un accordion reale, copiato dal WordPress in produzione. */
const ACCORDION = `
<div class="dslc-accordion-item" id="accordion-0">
  <div class="dslc-accordion-header dslc-accordion-hook">
    <span class="dslc-accordion-title" >ABBIATEGRASSO (MI)</span>
  </div>
  <div class="dslc-accordion-content">
    <div class="dslca-editable-content">
      <p><span><strong>Dynamic Dance School</strong></span><br /><span>Via Alighieri n&#176;110 - Abbiategrasso (MI)</span><br /><span>guarda su</span> <em><a href="https://maps.app.goo.gl/EduAmV91VERhTeC47" target="_blank" rel="noopener">google maps</a></em></p><p><span><strong>Krav Maga &#8211; Self Defense System (Adulti e Ragazzi)</strong></span><br /><span><strong>Gioved&igrave;</strong> dalle ore 20.00 alle ore 21.30</span></p><p><span><strong>Docente Istruttore Vittorio - Trainer Luca</strong></span></p><p><span>Per informazioni clicca</span> <em><a href="http://www.akm-italia.it/richiesta-informazioni/">QUI</a></em></p>
    </div>
  </div><!-- .dslc-accordion-content -->
</div>
`

describe('parsePaginaCentri', () => {
  const centro = parsePaginaCentri(ACCORDION)[0]

  it('estrae anagrafica e slug', () => {
    expect(centro.nome).toBe('Abbiategrasso')
    expect(centro.slug).toBe('abbiategrasso')
    expect(centro.provincia).toBe('MI')
    expect(centro.palestra).toBe('Dynamic Dance School')
    expect(centro.indirizzo).toBe('Via Alighieri n°110 - Abbiategrasso (MI)')
    expect(centro.mapsUrl).toBe('https://maps.app.goo.gl/EduAmV91VERhTeC47')
  })

  it('estrae orari e docenti, senza righe spurie', () => {
    expect(centro.orari).toEqual([
      {
        disciplina: 'Krav Maga – Self Defense System (Adulti e Ragazzi)',
        giorni: ['gio'],
        oraFine: '21:30',
        oraInizio: '20:00',
      },
    ])
    expect(centro.docenti).toEqual(['Istruttore Vittorio', 'Trainer Luca'])
    expect(centro.daControllare).toEqual([])
  })

  it('trova gli accordion dentro la pagina intera', () => {
    expect(parsePaginaCentri(ACCORDION)).toHaveLength(1)
  })
})

describe('parseDocente', () => {
  it('separa ruolo e nome', () => {
    expect(parseDocente('Istruttore Vittorio')).toEqual({ nome: 'Vittorio', ruolo: 'istruttore' })
  })

  it('lascia il ruolo null se non è fra quelli previsti', () => {
    expect(parseDocente('Sensei Marco').ruolo).toBeNull()
  })
})

describe('coordinateDaUrl', () => {
  it('preferisce le coordinate del luogo (!3d!4d) a quelle della vista (@)', () => {
    const url =
      'https://www.google.it/maps/place/Dynamic+Dance+School/@45.3874046,8.9172169,17z/data=!3m1!4b1!4m6!3m5!1s0x47:0x38!8m2!3d45.3874009!4d8.9197918'
    expect(coordinateDaUrl(url)).toEqual({ lat: 45.3874009, lng: 8.9197918 })
  })

  it('restituisce null se l’URL non contiene coordinate', () => {
    expect(coordinateDaUrl('https://maps.app.goo.gl/abc')).toBeNull()
  })
})
